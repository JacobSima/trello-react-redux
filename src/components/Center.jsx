import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Column from './Column';
import Sidebar from './Sidebar';
import AddTaskModal from './Modals/AddTaskModal';
import EditTaskModal from './Modals/EditTaskModal';
import DeletingModal from './Modals/DeletingModal';
import EmptyColumn from './EmptyColumn';
import AddColumnModal from './Modals/AddColumnModal';
import AddBoardModal from './Modals/AddBoardModal';
import EditBoardModal from './Modals/EditBoardModal';
import DeleteBoardModal from './Modals/DeleteBoardModal';
import notify from '../utils/notify';
import boardSlice from '../redux/boardSlice';
import { cloneDeep } from 'lodash';
import { useDeleteBoard, useDraggedColumn, useDraggedTaskInDifferentColumn, useDraggedTaskInSameColumn } from '../redux/boardSLiceThunk';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const Center = ({}) => {

  const dispatch  = useDispatch();

  // Local state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const [windowSize, setWindowSize] = useState([window.innerWidth,window.innerHeight]);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  const[isAddBoardModalOpen, setIsAddBoardModalOpen] = useState();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const[isEditBoardModalOpen, setIsEditBoardModalOpen] = useState();
  const[isDeleteModalOpen, setIsDeleteModalOpen] = useState();

  // Global state
  const activeBoard = cloneDeep(useSelector(state => state.boardsData.activeBoard));
  const isDeleteModalOpenTaskOrColumn = useSelector(state => state.boardsData.isDeleteModalOpen);
  const columns = cloneDeep(activeBoard.columns)?.sort((a,b) => a.pos - b.pos);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize',handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, []);

  const deleteBoard = async() => {

    const response = await dispatch(useDeleteBoard(activeBoard?.id)) 
    if(response.payload){
      dispatch(boardSlice.actions.deleteBoard({id : activeBoard?.id}));
      dispatch(boardSlice.actions.setActiveBoard());
      notify("Board Deleted"); 
      setIsDeleteModalOpen(false);
    }
  }
  const onDragEnd = async(result) => {
    const {destination, source, draggableId, type} = result;
    if(!destination) return;
    // if(destination.index > source.index + 1 || destination.idndex < source.index -1) return;
    if(type === "column" &&  destination.index === source.index) return;

    if(type === "column"){
      const draggedColumn = {
        sourceIndex: Number(source.index),
        destinationIndex: Number(destination.index)  
      }
      dispatch(boardSlice.actions.updatedDraggedBuckets({ draggedColumn }));
      dispatch(useDraggedColumn(draggedColumn));
      return 
    }

    if(type === "task"){
      const taskDropped = {
        sourcedroppableId: source.droppableId,
        sourceIndex: source.index,
        destinationDroppableId: destination.droppableId,
        destinationIndex: destination.index
      }

      if(!source.droppableId || !destination.droppableId) return;
      if(source.index === destination.index && source.droppableId === destination.droppableId) return;

      if(source.droppableId === destination.droppableId){ 
        // drop in the same column
        const {board, taskPosition} = draggedTaskSameColumn(taskDropped);
        dispatch(boardSlice.actions.draggedTask({ board }));
        dispatch(useDraggedTaskInSameColumn(taskPosition))
        return;
      }else{
        // Dragging in a different column
       const {board, startTaskPosition, finishTaskPosition, taskId} =  dragInDifferentColumn(taskDropped)
       dispatch(boardSlice.actions.draggedTask({ board }));
       const dragTaskDifferentColumn ={startTaskPosition,  finishTaskPosition, taskId}
       dispatch(useDraggedTaskInDifferentColumn(dragTaskDifferentColumn))
      }

    }
  }

  const draggedTaskSameColumn = (taskDropped) => {
    const {
      sourcedroppableId, 
      sourceIndex, 
      destinationIndex
    } = taskDropped
    const board = activeBoard;
    let startCol = board?.columns?.find(col => col.id === sourcedroppableId);
    let startTasks = startCol?.tasks;
    const [taskMove] = startTasks.splice(sourceIndex, 1);
    startTasks.splice(destinationIndex, 0, taskMove)
    startTasks?.forEach((task,index )=> {task.pos = index})

    const taskPosition = {
      bucketId: sourcedroppableId,
      tasksPosition : startTasks?.map(task => ({
        id: task.id,
        pos: Number(task.pos)
      })) ?? []
    }
    return { board, taskPosition }
  }

  const dragInDifferentColumn = (taskDropped) => {
    const {
      sourcedroppableId, 
      sourceIndex, 
      destinationDroppableId,
      destinationIndex
    } = taskDropped;

    const board = activeBoard;
    let startCol = board?.columns?.find(col => col.id === sourcedroppableId);
    let finishCol = board?.columns?.find(col => col.id === destinationDroppableId);

    // Remove from start column
    let startTasks = startCol?.tasks;
    const [taskMove] = startTasks?.splice(sourceIndex, 1);
    startTasks?.forEach((task,index )=> {task.pos = index})
    const startTaskPosition = {
      bucketId: sourcedroppableId,
      tasksPosition : startTasks?.map(task => ({
        id: task.id,
        pos: Number(task.pos)
      })) ?? []
    }

    // Add in new column
    let finishTasks = finishCol.tasks;
    finishTasks?.splice(destinationIndex, 0, taskMove)
    finishTasks?.forEach((task,index )=> {
      task.pos = index;
      if(task.id === taskMove.id){
        task.status = finishCol.name;
      }
    })
    const finishTaskPosition = {
      bucketId: destinationDroppableId,
      tasksPosition : finishTasks?.map(task => ({
        id: task.id, 
        pos: Number(task.pos)
      })) ?? []
    }

    return {board, startTaskPosition, finishTaskPosition, taskId: taskMove.id};
  }

  return (
    <div
      className={windowSize[0] >= 768 && isSideBarOpen 
      ? "bg-[#f4f7fd]  h-screen flex dar:bg-[#20212c] overflow-y-hidden  gap-0 ml-[290px] center_scroll" 
      : "bg-[#f4f7fd]  h-screen flex dark:bg-[#20212c] overflow-y-hidden gap-0 center_scroll"}
    >

      {/* SideBar section */}
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsSideBarOpen={setIsSideBarOpen}
          isSideBarOpen={isSideBarOpen}
          setIsAddBoardModalOpen={setIsAddBoardModalOpen}
          setIsElipsisMenuOpen={setIsElipsisMenuOpen}
          isElipsisMenuOpen={isElipsisMenuOpen}
          setIsEditBoardModalOpen={setIsEditBoardModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}
      
      {/* Columns Section */}
      {columns?.length > 0 ? (
        <div className='flex'>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {
                provided => (
                  <div
                    className="flex"
                    {...provided.droppableProps}
                    ref={provided.innerRef}   
                  >
                    {columns.map((col, index) => (
                      <Column 
                        key={index} 
                        colIndex={index} 
                        col={col}
                        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
                        setIsEditTaskModalOpen={setIsEditTaskModalOpen}
                        />
                    ))}
                  {provided.placeholder}
                  </div>
                )
              }
            </Droppable>

          </DragDropContext>
          
          <div
            onClick={() => {
              setIsAddColumnModalOpen(true);
            }}
            className=" dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl 
            hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2
            mx-5  min-w-[280px] text-[#828FA3] mt-[90px] rounded-lg "
          >
            + Add New Column
          </div>
        </div>
      ) : (
        <>
          <EmptyColumn />
        </>
      )}

      {isAddTaskModalOpen && <AddTaskModal
        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
        setIsEditTaskModalOpen={setIsEditTaskModalOpen}
      />}

      {isEditTaskModalOpen && <EditTaskModal setIsEditTaskModalOpen={setIsEditTaskModalOpen}/>}

      {isDeleteModalOpenTaskOrColumn && <DeletingModal />}

      {isAddColumnModalOpen && (
        <AddColumnModal setIsAddColumnModalOpen={setIsAddColumnModalOpen}/>
      )}

      {/* Show Add new Board Modal */}
      {isAddBoardModalOpen && <AddBoardModal
        setIsAddBoardModalOpen={setIsAddBoardModalOpen}
        isDropdown={false}
      />}

      {/* Show Edit Board Modal */}
      {isEditBoardModalOpen && <EditBoardModal
        setIsEditBoardModalOpen={setIsEditBoardModalOpen}
        setIsElipsisMenuOpen={setIsElipsisMenuOpen}
        isDropdown={false}
      />}

      {/* Show Delete Boad Modal */}
      {
        isDeleteModalOpen && <DeleteBoardModal
          title={activeBoard.name}
          type="board"
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsElipsisMenuOpen={setIsElipsisMenuOpen}
          onDeleteBtnClick={deleteBoard}
          isDropdown={true}
        />
      }

    </div>
  )
}

export default Center