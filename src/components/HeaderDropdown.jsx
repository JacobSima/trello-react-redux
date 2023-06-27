import React from 'react';
import boardSlice from '../redux/boardSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import boardIcon from '../assets/icon-board.svg';
import elipsis from '../assets/icon-vertical-ellipsis.svg'

const HeaderDropdown = ({setIsDropDownOpen, setIsAddBoardModalOpen}) => {

  const dispatch = useDispatch();

  // Global state
  const boards = useSelector(state => state.boardsData.boards);

  // Local state
  const handleCloseDropwdown = e => {
    if(e.target !== e.currentTarget) return;
    setIsDropDownOpen(false);
  }

  const updateActiveBoard = index => {
    dispatch(boardSlice.actions.updateActiveBoard(index));
    dispatch(boardSlice.actions.setActiveBoard(index));
  }

  return (
    <div
      className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-16 bg-[#00000086]"  
      onClick={handleCloseDropwdown}
    >
      
      {/* Dropdown Modal */}
      <div
        className="bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl"
      >
        <div className="flex  justify-between items-center">
          <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
              All Boards ({boards?.length})
          </h3>
          <div className="flex space-x-4 items-center mb-8 mr-4">
            <button 
              className="button py-1 px-3 md:hidden"
              onClick={() => setIsAddBoardModalOpen(true)}
            >
              +
            </button>
            <img 
              src={elipsis} alt="elipsis" 
              className="cursor-pointer h-6"
              onClick={() => {
                // setBoardType("edit");
                // setOpenDropdown(false)
                // setIsElipsisMenuOpen((prevState) => !prevState);
              }}
            />
          </div>
        </div>
        
        <div>
          {
            boards.map((board, index) => (
              <div 
                className={`flex items-baseline dark:text-white space-x-2 px-5 py-4 
                ${board.isActive && 'bg-[#BB5450] rounded-r-full text-white mr-8'} cursor-pointer`}
                key={index}
                onClick={() => updateActiveBoard(index)}
              >
                <img src={boardIcon} alt="borad icon" className="h-4"/>
                <p className="text-lg font-bold">
                  {board.name}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default HeaderDropdown