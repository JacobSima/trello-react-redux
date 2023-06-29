import React from 'react'
import Task from './Task'
import { useDispatch } from 'react-redux'
import boardSlice from '../redux/boardSlice'
import crossIcon from '../assets/icon-cross.svg'

const Column = ({colIndex, col, setIsAddTaskModalOpen, setIsEditTaskModalOpen}) => {

  const dispatch = useDispatch();

  return (
    <div
      className="custom-scrollbar mt-[90px] min-w-[280px] ml-2"
    >
      {/* Column Header */}
      <div className="flex  justify-between items-center bg-[#c1cde7] font-bold font-sans rounded-md 
        shadow-md shadow-[#364e7e1a] hover:bg-[#b3bdd2]">
        <h3 className="dark:text-gray-300 text-gray-600 font-semibold pl-2">
            {col.name} ({col?.tasks?.length})
        </h3>
        <div className="flex space-x-4 items-center p-1">
          <button 
            className="text-lg py-1 cursor-pointer"
            onClick={() =>{
              dispatch(boardSlice.actions.setAddEditColumn({col}));
              setIsAddTaskModalOpen(true);
              setIsEditTaskModalOpen(false)
            }}
          >
            +
          </button>
          <img
            src={crossIcon}
            onClick={() => {
              dispatch(boardSlice.actions.setDeleteModal());
              dispatch(boardSlice.actions.setDeleteColumn({col}));
            }}
            className="h-2 w-2 cursor-pointer mt-1 mr-3"
          />
        </div>
      </div>
      <div>
        {/* Render Task */}
        {col?.tasks?.map((task, index) => (
          <Task 
            key={index} 
            taskIndex={index} 
            colIndex={colIndex} 
            task={task}
            col={col}
            setIsEditTaskModalOpen={setIsEditTaskModalOpen}
            />
        ))}
      </div>

      

    </div>
  )
}

export default Column