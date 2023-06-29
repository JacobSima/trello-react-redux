import React from 'react';
import { useDispatch } from 'react-redux';
import boardSlice from '../redux/boardSlice';

const Task = ({taskIndex, colIndex, task, setIsEditTaskModalOpen, col}) => {

  const dispatch = useDispatch();

  let completed = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const onClick = e =>{
    if(e.target !== e.currentTarget) return;
    setIsEditTaskModalOpen(true);
    dispatch(boardSlice.actions.setAddEditColumn({col}));
    dispatch(boardSlice.actions.setEditTask({task}));
  }

  return (
    <div
      onClick={e => onClick(e)}
      className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] 
      py-6 px-3 mt-4 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer "
    >
      <p onClick={e => onClick(e)} className=" font-bold tracking-wide ">{task.title}</p>
      <p onClick={e => onClick(e)} className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
        {completed} of {subtasks.length} completed tasks
      </p>
    </div>
  )
}

export default Task