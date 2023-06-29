import React, { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../../assets/icon-cross.svg";
import { isNullOrUndefinedOrEmpty, isStringArrayValide } from '../../utils/validations';
import notify from '../../utils/notify';
import boardSlice from '../../redux/boardSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddBoardModal = ({setIsAddBoardModalOpen, setBoardModalOpen, isDropdown}) => {

  const dispatch = useDispatch();

  // Global state
  const boards = useSelector(state => state.boardsData.boards);

  // Local state
  const [name, setName] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "Doing", tasks: [], id: uuidv4() },
  ]);

  const onChange = (id, newValue) => {
    setNewColumns(prevState => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  const onDelete = id => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  // Submit Creation
  const onSubmit = () => {
    // run form validation
    const data = newColumns?.map(col => col?.name);
    const boardIndex = boards.length;

    if(isNullOrUndefinedOrEmpty(name) || !isStringArrayValide(data)){
      notify("Form is invalid");
      return;
    }

    dispatch(boardSlice.actions.addBoard({ name, newColumns, id: uuidv4(), pos: boardIndex }));
    dispatch(boardSlice.actions.setActiveBoard());

    notify("Board Added");
    setIsAddBoardModalOpen && setIsAddBoardModalOpen(false);
    setBoardModalOpen && setBoardModalOpen(false)
  };

  return (
    <div
      className={`py-10 px-6 absolute left-0 right-0 ${boards?.length > 0 && isDropdown ? "bottom-[-100vh]" : "bottom-[-2vh]"}  top-16 bg-[#00000086]`}
      onClick={e => {
        if(e.target !== e.currentTarget) return;
        setIsAddBoardModalOpen && setIsAddBoardModalOpen(false);
        setBoardModalOpen && setBoardModalOpen(false)
      }}
    >
      <div>

        {/* Modal Section */}
        {/* style  */}
        <div
        className=" custom-scrollbar max-h-[85vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
        shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
        >
          <h3 className="text-lg">Add New Board</h3>

          {/* Task Name */}
          <div className="mt-8 flex flex-col space-y-1">
            <label className="  text-sm dark:text-white text-gray-500">
              Board Name
            </label>
            <input
              className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
              placeholder=" e.g Opus 1 repos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="board-name-input"
            />
          </div>

          {/* Board Columns */}
          <div className="mt-8 flex flex-col space-y-3">
            <label className=" text-sm dark:text-white text-gray-500">
              Board Columns
            </label>

            {newColumns.map((column, index) => (
              <div key={index} className=" flex items-center w-full ">
                <input
                  className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
                  onChange={(e) => onChange(column.id, e.target.value)}
                  type="text"
                  value={column.name}
                />
                <img
                  src={crossIcon}
                  onClick={() => onDelete(column.id)}
                  className=" m-4 cursor-pointer "
                />
              </div>
            ))}

            {/* Add new Column */}
            <div>
              <button
                className=" w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white  text-white bg-[#BB5450] py-2 rounded-full "
                onClick={() => {
                  setNewColumns(state => [
                    ...state,
                    { name: "", tasks: [], id: uuidv4() },
                  ]);
                }}
              >
                + Add New Column
              </button>
              <button
                onClick={() => onSubmit()}
                className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#BB5450] py-2 rounded-full"
              >
                Create New Board
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default AddBoardModal