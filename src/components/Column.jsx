import React, { useEffect, useState } from 'react'
import Task from './Task'
import { useDispatch, useSelector } from 'react-redux'
import boardSlice from '../redux/boardSlice'
import crossIcon from '../assets/icon-cross.svg'
import { cloneDeep } from 'lodash'
import { isNullOrUndefinedOrEmpty, isObjectEmpty } from '../utils/validations'

const Column = ({colIndex, col, setIsAddTaskModalOpen, setIsEditTaskModalOpen}) => {

  const dispatch = useDispatch();

  const activeBoard = useSelector(state => state.boardsData.activeBoard);

  const searchString = cloneDeep(useSelector(state => state.boardsData.searchString));
  const [tasks, setTasks] = useState(col?.tasks);

  useEffect(() => {
    const tasks = isNullOrUndefinedOrEmpty(searchString) 
      ? col?.tasks 
      : col?.tasks.filter(task => task?.title?.toLowerCase()?.includes(searchString?.toLowerCase()));
    setTasks(tasks);  
  },[searchString, col])
  

  const renderTask = () => (tasks?.map((task, index) => (
    <Task 
      key={index} 
      taskIndex={index} 
      colIndex={colIndex} 
      task={task}
      col={col}
      setIsEditTaskModalOpen={setIsEditTaskModalOpen}
    />
  )))

  const dragOverTask = useSelector(state => state.boardsData.dragOverTask);
  const handleOnDrop = e => {
    const { draggedTask, prevCol} = JSON.parse(
      e.dataTransfer.getData("taskData")
    );

    // Dropping in the same column
    if(prevCol.id === col.id){
      dispatch(boardSlice.actions.insertDraggedTaskSameColumn({posDragged: draggedTask.pos, colId: col.id, posOver: dragOverTask.pos}))
    }else{
      // Dropping in different column
      // 1. Remove from previous column
      dispatch(boardSlice.actions.removedDraggedTaskFromPreviousColumn({taskId: draggedTask.id, colId: prevCol.id}));

      // 2. Add in new column
      draggedTask.status = col?.name;
      if(isObjectEmpty(dragOverTask)){
        // Push new task at the end of new column
        draggedTask.pos = col?.tasks?.length;
        dispatch(boardSlice.actions.pushNewDraggedTask({draggedTask, colId: col.id}));
      }else{
        // calculate the actual position to add in the column
        dispatch(boardSlice.actions.insertDraggedTask({draggedTask, colId: col.id, pos: dragOverTask.pos}))
      }
    }
  }

  const hanldeOnDragOver = e => e.preventDefault();

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={hanldeOnDragOver}
      on
      className="custom-scrollbar mt-[90px] min-w-[280px] ml-2"
      draggable
    >
      {/* Column Header */}
      <div className="column flex  justify-between items-center bg-[#c1cde7] font-bold font-sans rounded-md 
        shadow-md shadow-[#364e7e1a] hover:bg-[#b3bdd2]">
        <h3 className="dark:text-gray-300 text-gray-600 font-semibold pl-2">
            {col.name} ({tasks?.length})
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
        {renderTask()}
      </div>
    </div>
  )
}

export default Column