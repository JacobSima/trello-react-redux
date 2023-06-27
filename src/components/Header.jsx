import React, { useCallback, useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import iconDown from '../assets/icon-chevron-down.svg';
import iconUp from '../assets/icon-chevron-up.svg'
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { debounce } from 'lodash';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import boardSlice from '../redux/boardSlice';
import HeaderDropdown from './HeaderDropdown';
import AddBoardModal from './Modals/AddBoardModal';
import EditBoardModal from './Modals/EditBoardModal';
import DeleteBoardModal from './Modals/DeleteBoardModal';
import notify from '../utils/notify';

const Header = () => {

  const dispatch = useDispatch();

  // Global state
  const boards = useSelector(state => state.boardsData.boards)
  const activeBoard = useSelector(state => state.boardsData.activeBoard);


  // Local state
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const[isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const[isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [windowSize, setWindowSize] = useState([window.innerWidth,window.innerHeight]);

  const onDropDownIconClick = () => {
    setIsDropDownOpen(state => !state);
  }

  const [searchString, setSearchString] =  useState("");
  const debounceSearch = useCallback(debounce(setSearchString, 200), []);
  const setSearchStringLocal = e => {
    debounceSearch((e.target.value));
  }

  const deleteBoard = () => {
    dispatch(boardSlice.actions.deleteBoard({id : activeBoard?.id}));
    dispatch(boardSlice.actions.setActiveBoard());
    notify("Board Deleted"); 
    setIsDeleteModalOpen(false);
  }

  useEffect(() => {

    dispatch(boardSlice.actions.setActiveBoard());

    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize',handleWindowResize);

    if(windowSize[0] >= 768 && isDropDownOpen){
      setIsDropDownOpen(false);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [windowSize[0]])


  return (
    <div 
      className="p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0"
    >
      <header className="flex justify-between dark:text-white items-center">

        {/* Left Side */}
        <div
          className="flex items-center space-x-2 md:space-x-4"
        >
          <img src={logo} alt="logo" className="h-10 w-10"/>
          <h3 className="hidden md:inline-block font-bold md:text-4xl">Opus1</h3>
          <div className="flex items-center">
              <h3 className="truncate max-w-[200px] md:text-2xl text-xl font-blod  ml-3 md:ml-20 font-sans">
                {boards?.length > 0 ? activeBoard.name : "No Board available"}
              </h3>
              <img 
                src={isDropDownOpen ? iconUp: iconDown} 
                alt="dropdown icon"
                className="w-3 h-3 ml-2 md:hidden cursor-pointer mt-1"
                onClick={onDropDownIconClick}
              />
          </div>
        </div>


        {/* Right Side */}
        {
          !isDropDownOpen && boards?.length > 0 && (
            <div className="flex items-center md:space-x-6">
              {/* Serach box */}
              <form className="flex items-center  md:space-x-5 md:p-1 bg-white rounded-md  shadow-md flex-1 md:flex-initial">
                  <MagnifyingGlassIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-400"/>
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchString}
                    onChange={setSearchStringLocal}
                    className="flex-1 outline-none p-2 md:p-2"/>
                  <button hidden type="submit">Search</button>
                </form>
                {/* Avatar */}
                <Avatar name="Jacob Sima" round size="50" className="cprimary hidden md:block"/>
            </div>
          )
        }
        
      </header>

      {/* Dropwsown Menu for small screen */}
      {isDropDownOpen && <HeaderDropdown 
        setIsDropDownOpen={setIsDropDownOpen}
        setIsAddBoardModalOpen={setIsAddBoardModalOpen}
        isElipsisMenuOpen={isElipsisMenuOpen}
        setIsElipsisMenuOpen={setIsElipsisMenuOpen}
        setIsEditBoardModalOpen={setIsEditBoardModalOpen}
        isEditBoardModalOpen={isEditBoardModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}

      />}

      {/* Show Add new Board Modal */}
      {isDropDownOpen && isAddBoardModalOpen && <AddBoardModal
        setIsAddBoardModalOpen={setIsAddBoardModalOpen}
      />}
    
      {/* Show Edit Board Modal */}
      {isDropDownOpen && isEditBoardModalOpen && <EditBoardModal
        setIsEditBoardModalOpen={setIsEditBoardModalOpen}
        setIsElipsisMenuOpen={setIsElipsisMenuOpen}
      />}

      {/* Show Delete Boad Modal */}
      {
        isDropDownOpen && isDeleteModalOpen && <DeleteBoardModal
          title={activeBoard.name}
          type="board"
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsElipsisMenuOpen={setIsElipsisMenuOpen}
          onDeleteBtnClick={deleteBoard}
        />
      }
    </div>
  )
}

export default Header

