import React, { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { isNullOrUndefinedOrEmpty } from '../../utils/validations';
import notify from '../../utils/notify';
import boardSlice from '../../redux/boardSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddColumnModal = ({setIsAddColumnModalOpen}) => {

  const dispatch = useDispatch();

  // Global state
  const activeBoard = useSelector(state => state.boardsData.activeBoard);
  const columnsLength = activeBoard?.columns?.length || 0;

  // Local state
  const [name, setName] = useState("");

  // Submit Creation
  const onSubmit = () => {
    // run form validation
    if(isNullOrUndefinedOrEmpty(name)){
      notify("Form is invalid");
      return;
    }

    const column = {
      id: uuidv4(),
      name,
      pos: columnsLength === 0 ? 0 : columnsLength,
      tasks: []
    }

    dispatch(boardSlice.actions.addColumn({column}));
    dispatch(boardSlice.actions.setActiveBoard());

    notify("Column Created");
    setIsAddColumnModalOpen(false);
  };

  return (
    <div
      className={`py-10 px-6 absolute left-0 right-0 bottom-[-2vh] top-16 bg-[#00000086]`}
      onClick={e => {
        if(e.target !== e.currentTarget) return;
        setIsAddColumnModalOpen(false);
      }}
    >
      <div>

        {/* Modal Section */}
        <div
        className=" overflow-y-scroll max-h-[85vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
        shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
        >
          <h3 className="text-lg">Add New Column</h3>

          {/* Column Name */}
          <div className="mt-8 flex flex-col space-y-1">
            <label className="  text-sm dark:text-white text-gray-500">
              Column Name
            </label>
            <input
              className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
              placeholder=" e.g Opus 1 repos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="board-name-input"
            />
          </div>

          {/* Add new Column */}
          <div>
            <button
              onClick={() => onSubmit()}
              className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
            >
              Create New Column
            </button>
            <button
              onClick={() => setIsAddColumnModalOpen(false)}
              className="mt-4 w-full items-center text-[#635fc7] dark:bg-white hover:opacity-75 bg-[#c657e21a]  py-2 rounded-full"
            >
              Cancel
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AddColumnModal