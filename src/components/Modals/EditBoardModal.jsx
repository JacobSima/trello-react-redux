import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../../assets/icon-cross.svg";
import { isNullOrUndefinedOrEmpty, isStringArrayValide } from '../../utils/validations';
import notify from '../../utils/notify';
import boardSlice from '../../redux/boardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEditBoard } from '../../redux/boardSLiceThunk';

const EditBoardModal= ({setIsEditBoardModalOpen, setIsElipsisMenuOpen, isDropdown}) => {

  const dispatch = useDispatch();

  // Global state
  const activeBoard = useSelector(state => state.boardsData.activeBoard);
  const columns = activeBoard.columns;
  const [deletedColumns, setDeletedColumns ]= useState([]);

  // Local state
  const [name, setName] = useState("");
  const [newColumns, setNewColumns] = useState([]);

  const onChange = (id, newValue) => {
    setNewColumns(prevState => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  const onDelete = column => {
    if(column.existing){
      const deleted = { id: column.id,name: column.name,deleted: true,updated: false,new: false };
      setDeletedColumns(prevState => ([...prevState, deleted ]));
    }

    setNewColumns((prevState) => prevState.filter((el) => el.id !== column?.id));
  };

  // Edition of Board
  const onSubmit = async() => {
    let nameChanged;
    // run form validation
    const data = newColumns?.map(col => col?.name);


    if(isNullOrUndefinedOrEmpty(name) || !isStringArrayValide(data)){
      notify("Form is invalid");
      return;
    }

    name !== activeBoard?.name ? nameChanged = true : nameChanged = false;
    const newCol = newColumns.map(col => {
      let originalCol = columns?.find(column => column?.id === col.id);
      if (originalCol && (originalCol.name !== col?.name))
        col.updated = true;
      if(!originalCol)
        col.new = true;

      return {
        name: col?.name,
        id: col.id || null,
        updated: col.updated || false,
        deleted: false,
        new: col?.new || false
      }
    }).filter(col => col.updated !== false || col.new !== false);

    const buckets = [...newCol, ...deletedColumns]
    if(nameChanged === false && buckets.length === 0){
      setIsEditBoardModalOpen(false);
      return;
    } 

    const response = await dispatch(useEditBoard({name, nameChanged, id: activeBoard.id, buckets }))
    console.log(response.payload.board)
    dispatch(boardSlice.actions.editBoard({ board: response.payload.board}));

    notify("Board Edited");
    setIsEditBoardModalOpen(false);
  };

  useEffect(() => {
    setIsElipsisMenuOpen && setIsElipsisMenuOpen(false);
    setNewColumns(
      columns.map(col => {
        return {...col}
      })
    );
    setName(activeBoard.name);
  },[])

  return (
    <div
      className={`py-10 px-6 absolute left-0 right-0 ${isDropdown ? "bottom-[-100vh]" : "bottom-[-2vh]" }  top-16 bg-[#00000086]`}
      onClick={e => {
        if(e.target !== e.currentTarget) return;
        setIsEditBoardModalOpen(false);
      }}
    >
      <div>

        {/* Modal Section */}
        {/* style  */}
        <div
        className=" custom-scrollbar max-h-[85vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
        shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
        >
          <h3 className="text-lg">Edit Board</h3>

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
                  onClick={() => onDelete(column)}
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
                Save Changes
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default EditBoardModal