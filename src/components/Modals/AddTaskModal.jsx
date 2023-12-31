import React, { useState } from 'react';
import crossIcon from '../../assets/icon-cross.svg';
import { v4 as uuidv4 } from "uuid";
import boardSlice from '../../redux/boardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrUndefinedOrEmpty, isStringArrayValide } from '../../utils/validations';
import notify from '../../utils/notify';
import { useCreateTask } from '../../redux/boardSLiceThunk';

const AddTaskModal = ({setIsAddTaskModalOpen, setIsEditTaskModalOpen}) => {

  const dispatch = useDispatch();

  const addOrEditColumn = useSelector(state => state.boardsData.addOrEditColumn);

  const [title, setTitle] = useState();
  const [description, setDescription] =  useState();
  const [subtasks, setSubtasks] = useState([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);

  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onChangeSubtasks = (id, newValue) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;
      return newState;
    });
  };

   // Edition of Board
   const onSubmit = async() => {
    // run form validation
    const data = subtasks?.map(col => col?.title);


    if(isNullOrUndefinedOrEmpty(title) || isNullOrUndefinedOrEmpty(description) || !isStringArrayValide(data)){
      notify("Form is invalid");
      return;
    }
    
    const task = {
      title,
      description,
      subtasks: data,
      bucketId: addOrEditColumn.id,
    }

    const response = await dispatch(useCreateTask(task));
    if(response.payload.bucket){
      dispatch(boardSlice.actions.updatedBucket({ bucket: response.payload.bucket}));
      dispatch(boardSlice.actions.setActiveBoard());
      notify("Task Added");
      setIsAddTaskModalOpen(false);
      dispatch(boardSlice.actions.resetAddOrEditColumn())
    }
  };

  return (
    <div
      className={`py-10 px-6 absolute left-0 right-0 bottom-[-0vh]  top-16 bg-[#00000086]`}
      onClick={e => {
        if(e.target !== e.currentTarget) return;
        setIsAddTaskModalOpen(false);
        dispatch(boardSlice.actions.resetAddOrEditColumn())
      }}
    >
      {/* Add Task Modal Section */}
      <div
        className=" custom-scrollbar max-h-[80vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
        shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl"
      >
        <div className="felx justify-end">
          <img
            src={crossIcon}
            onClick={() => {
              setIsAddTaskModalOpen(false);
            }}
            className="h-4 w-4 cursor-pointer float-right close-modal"
          />
        </div>

        <h3 className="text-lg">Add New Task</h3>

        {/* Task Name */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-name-input"
            type="text"
            className=" bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            placeholder=" e.g Take coffee break"
          />
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px] "
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>

        {/* Subtasks */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Subtasks
          </label>

          {subtasks.map((subtask, index) => (
            <div key={index} className=" flex items-center w-full ">
              <input
                onChange={(e) => {
                  onChangeSubtasks(subtask.id, e.target.value);
                }}
                type="text"
                value={subtask.title}
                className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                placeholder=" e.g Take coffee break"
              />
              <img
                src={crossIcon}
                onClick={() => {
                  onDelete(subtask.id);
                }}
                className=" m-4 cursor-pointer "
              />
            </div>
          ))}

          <button
            className=" w-full items-center dark:text-[#635fc7] dark:bg-white  text-white bg-[#BB5450] py-2 rounded-full "
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuidv4() },
              ]);
            }}
          >
            + Add New Subtask
          </button>
        </div>

        {/* current Status  */}
        <div className="mt-4 flex flex-col space-y-3">
          <button
            onClick={onSubmit}
            className=" w-full items-center text-white bg-[#BB5450] py-2 rounded-full "
          >
           Create task
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddTaskModal