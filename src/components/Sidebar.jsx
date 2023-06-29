import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardIcon from "../assets/icon-board.svg";
import showSidebarIcon from "../assets/icon-show-sidebar.svg";
import hideSidebarIcon from "../assets/icon-hide-sidebar.svg";
import elipsis from '../assets/icon-vertical-ellipsis.svg'
import boardSlice from '../redux/boardSlice';
import ElipsisMenu from "./ElipsisMenu";


const Sidebar = ({ 
  isSideBarOpen, 
  setIsSideBarOpen,
  setIsAddBoardModalOpen,
  setIsElipsisMenuOpen,
  isElipsisMenuOpen,
  setIsEditBoardModalOpen,
  setIsDeleteModalOpen,
}) => { 
  const dispatch = useDispatch();

  const boards = useSelector(state => state.boardsData.boards);

  const toggleSidebar = () => {
    setIsSideBarOpen(curr => !curr);
  };

  const updateActiveBoard = index => {
    dispatch(boardSlice.actions.updateActiveBoard(index));
    dispatch(boardSlice.actions.setActiveBoard());
    setIsElipsisMenuOpen(false);
  }

  return (
    <div>
      <div
        className={
          isSideBarOpen
            ? `min-w-[285px] bg-white dark:bg-[#2b2c37]  fixed top-[72px] h-screen  items-center left-0 z-20`
            : ` bg-[#635FC7] dark:bg-[#2b2c37] dark:hover:bg-[#635FC7] top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer  p-0 transition duration-300 transform fixed felx w-[56px] h-[48px] rounded-r-full  `
        }
      >
        <div>
          {/* reWrite modal  */}

          {isSideBarOpen && (
            <div className=" bg-white  dark:bg-[#2b2c37]    w-full   py-4 rounded-xl">

              <div className="flex  justify-between items-center">
                <h3 className=" dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">
                  All Boards ({boards?.length})
                </h3>

                <div className="flex space-x-4 items-center mb-8 mr-4">
                  <button 
                    className="button py-1 px-3  cursor-pointer"
                    onClick={() =>{
                      setIsAddBoardModalOpen(true);
                    }}
                  >
                    +
                  </button>
                  <img 
                    src={elipsis} alt="elipsis" 
                    className="cursor-pointer  h-6"
                    onClick={() => setIsElipsisMenuOpen(true)}
                  />
                </div>
              </div>

              <div className="  dropdown-borad flex flex-col h-[70vh]  justify-between ">
                <div>
                  {boards.map((board, index) => (
                    <div
                      className={` flex items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a]dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white  ${
                        board.isActive &&
                        " bg-[#BB5450] rounded-r-full text-white mr-8 "
                      } `}
                      key={index}
                      onClick={() => updateActiveBoard(index)}
                    >
                      <img src={boardIcon} className="  filter-white  h-4" />
                      <p className=" text-lg font-bold ">{board.name}</p>
                    </div>
                  ))}
                </div>
                {isElipsisMenuOpen && (
                  <ElipsisMenu
                    setIsEditBoardModalOpen={setIsEditBoardModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                  />
                )}

              </div>
            </div>
          )}

          {/* Sidebar hide/show toggle */}
          {isSideBarOpen ? (
            <div
              onClick={() => toggleSidebar()}
              className=" flex  items-center mt-2  absolute bottom-16  text-lg font-bold  rounded-r-full hover:text-white cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#BB5450] dark:hover:bg-white  space-x-2 justify-center  my-4 text-gray-500 "
            >
              <img
                className=" min-w-[20px]"
                src={hideSidebarIcon}
                alt=" side bar show/hide"
              />
              {isSideBarOpen && <p> Hide Sidebar </p>}
            </div>
          ) : (
            <div 
              className=" absolute p-5  " 
              onClick={() => toggleSidebar()}
            >
              <img src={showSidebarIcon} alt="showSidebarIcon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
