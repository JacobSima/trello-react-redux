import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import boardSlice from '../redux/boardSlice';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({taskIndex, colIndex, task, setIsEditTaskModalOpen, col}) => {

  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);

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

  const handleOnDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData(
      "taskData",
      JSON.stringify({ draggedTask: task, prevCol: col})
    );
  };

  // change opacity of the dragging element
  const handleDragEnd = e => {
    isDragging && setIsDragging(false);
    dispatch(boardSlice.actions.resetDragOverTask());
  }

  const hanldeOnDragOver = e => {
    e.preventDefault();
    dispatch(boardSlice.actions.setDragOverTask({task}));
  }

  const handleOnDragLeave = () => dispatch(boardSlice.actions.resetDragOverTask());

  return (
   
    <Draggable  draggableId={task.id} index={taskIndex} key={task.id}>
      {
        provided => (
           <div
           {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            
            className={`  task w-[300px] last:mb-3 first:mt-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] 
            py-6 px-3 mt-4 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-move`}
          >
            <div className='cursor-pointer'>
            <p onClick={e => onClick(e)} className="font-bold tracking-wide ">{task.title}</p>
            <p onClick={e => onClick(e)} className="font-bold text-xs tracking-tighter mt-2 text-gray-500">
              {completed} of {subtasks.length} completed tasks
            </p>
            </div> 
          </div>
        )
      }
    </Draggable>
  )
}

export default Task