import React, { useEffect, useState } from 'react'
import Task from './Task'
import { Provider, useDispatch, useSelector } from 'react-redux'
import boardSlice from '../redux/boardSlice'
import crossIcon from '../assets/icon-cross.svg'
import { cloneDeep } from 'lodash'
import { isNullOrUndefinedOrEmpty } from '../utils/validations'
import { Draggable, Droppable } from 'react-beautiful-dnd'

const Column = ({colIndex, col, setIsAddTaskModalOpen, setIsEditTaskModalOpen}) => {

  const dispatch = useDispatch();

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


  return (
    
    <Draggable draggableId={col.id} index={colIndex} key={col.id}>
      {
        provided => (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="custom-scrollbar mt-[90px] min-w-[280px] ml-2"
          >
            {/* Column Header */}
            <div
              {...provided.dragHandleProps} 
              className="column flex  justify-between items-center bg-[#c1cde7] font-bold font-sans rounded-md 
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

            <Droppable droppableId={col.id} type="task">
              {
                provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {/* Render Task */}
                    {renderTask()}
                    { 
                      // col?.tasks?.length === 0 && (<div className='h-4'></div>)
                    }
                    <div className='h-4'></div>
                    {provided.placeholder}
                  </div>
                )
              }
            </Droppable>
            

          </div> 
        )
      }
    </Draggable>
  )
}

export default Column