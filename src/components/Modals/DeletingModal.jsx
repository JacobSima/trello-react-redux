import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardSlice from "../../redux/boardSlice";
import notify from "../../utils/notify";
import { useDeleteBucket } from "../../redux/boardSLiceThunk";

const DeleteBoardModal = ({}) => {
   
  const dispatch = useDispatch();
  const columnToDelete = useSelector(state => state.boardsData.columnToDelete);
  const columnToDeleteId = columnToDelete?.id || null;
  const taskToDelete = useSelector(state => state.boardsData.taskToDelete);
  const taskToDeleteId = taskToDelete?.id || null;

  const renderText = () => {
    switch(true){
      case(columnToDeleteId && !taskToDeleteId):
        return (
          <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
              Are you sure you want to delete the "<span className="text-red-500 font-bold">{columnToDelete.name}</span>" column? This action
              will remove all columns's tasks and cannot be reversed.
          </p>
        );
      case(!columnToDeleteId && taskToDeleteId):
        return (
          <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
              Are you sure you want to delete the "<span className="text-red font-bold">{taskToDelete.title}</span>" task? This action
              will remove all tasks' substasks and cannot be reversed.
          </p>
        );
      default:
        return(
          <p className="text-gray-500 font-[600] tracking-wide text-xs pt-6">
              Are you sure about this action?
              This will not be reversed and all data will be lost
          </p>
        );
    }
  }

  const onClose = () => {
    dispatch(boardSlice.actions.setDeleteModal());
    dispatch(boardSlice.actions.genericReset());
  }

  const onDeleteBtnClick = async() => {

    if(columnToDelete?.id && !taskToDelete?.id){// Delete Column
      const res = await dispatch(useDeleteBucket(columnToDelete?.id))
      dispatch(boardSlice.actions.updatedBoad({board: res.payload.board}));
      notify("Column Deleted");
    } else if(!columnToDelete?.id && taskToDelete?.id){ // Delete Task

    }

    onClose();
    dispatch(boardSlice.actions.setActiveBoard());
  }

  return (
    // Modal Container
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        dispatch(boardSlice.actions.setDeleteModal());
      }}
      
      className="fixed right-0 top-0 px-2 py-4 custom-scrollbar bg-[#00000086] bottom-0  z-50 left-0 justify-center items-center flex dropdown"
    >
      {/* Delete Modal  */}

      <div className=" custom-scrollbar max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl ">
        <h3 className=" font-bold text-red-500 text-xl  ">
          {/* Delete this {type}? */}
        </h3>

        {renderText()}

        <div className=" flex w-full mt-4 items-center justify-center space-x-4 ">
          <button
            onClick={onDeleteBtnClick}
            className="w-full items-center text-white hover:opacity-75 bg-red-500 py-2 rounded-full"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full items-center text-[#635fc7] dark:bg-white hover:opacity-75 bg-[#635fc71a]  py-2 rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBoardModal;
