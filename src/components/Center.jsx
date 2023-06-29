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

const Center = ({}) => {

  const dispatch  = useDispatch();

  // Local state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const [windowSize, setWindowSize] = useState([window.innerWidth,window.innerHeight]);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  const[isAddBoardModalOpen, setIsAddBoardModalOpen] = useState();
  const[isEditBoardModalOpen, setIsEditBoardModalOpen] = useState();

  // Global state
  const activeBoard = useSelector(state => state.boardsData.activeBoard);
  const isDeleteModalOpen = useSelector(state => state.boardsData.isDeleteModalOpen);
  const columns = activeBoard.columns;

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize',handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, []);

  return (
    <div
      className={windowSize[0] >= 768 && isSideBarOpen 
      ? "bg-[#f4f7fd]  h-screen flex dar:bg-[#20212c] overflow-x-scroll gap-6 ml-[261px]" 
      : "bg-[#f4f7fd]  h-screen flex dark:bg-[#20212c] overflow-x-scroll gap-6 "}
    >

      {/* SideBar section */}
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsSideBarOpen={setIsSideBarOpen}
          isSideBarOpen={isSideBarOpen}
          setIsAddBoardModalOpen={setIsAddBoardModalOpen}
        />
      )}
      
      {/* Columns Section */}
      {columns?.length > 0 ? (
        <>
          {columns.map((col, index) => (
            <Column 
              key={index} 
              colIndex={index} 
              col={col}
              setIsAddTaskModalOpen={setIsAddTaskModalOpen}
              setIsEditTaskModalOpen={setIsEditTaskModalOpen}
              />
           ))}
          <div
            onClick={() => {
              setIsAddColumnModalOpen(true);
            }}
            className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl 
            hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2
            mx-5 pt-[70px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
          >
            + Add New Column
          </div>
        </>
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

      {isDeleteModalOpen && <DeletingModal />}

      {isAddColumnModalOpen && (
        <AddColumnModal setIsAddColumnModalOpen={setIsAddColumnModalOpen}/>
      )}

      {/* Show Add new Board Modal */}
      {isAddBoardModalOpen && <AddBoardModal
        setIsAddBoardModalOpen={setIsAddBoardModalOpen}
        isDropdown={false}
      />}

    </div>
  )
}

export default Center