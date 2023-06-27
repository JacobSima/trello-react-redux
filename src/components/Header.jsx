import React, { useCallback, useState } from 'react';
import logo from '../assets/logo.png';
import iconDown from '../assets/icon-chevron-down.svg';
import iconUp from '../assets/icon-chevron-up.svg'
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { debounce } from 'lodash';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import boardSlice from '../redux/boardSlice';

const Header = () => {

  const disptach = useDispatch();

  // Global state
  const boards = useSelector(state => state.boardsData.boards)
  const activeBoard = useSelector(state => state.boardsData.activeBoard);


  // Local state
  const [isDropDownOpen, setisDropDownOpen] = useState(false);

  const onDropDownIconClick = () => {
    setisDropDownOpen(state => !state);
  }

  const [searchString, setSearchString] =  useState("");
  const debounceSearch = useCallback(debounce(setSearchString, 200), []);
  const setSearchStringLocal = e => {
    debounceSearch((e.target.value));
  }


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
              <h3 className="truncate max-w-[200px] md:text-2xl text-xl font-blod  ml-3 md:ml-20 font-sans">{activeBoard.name}</h3>
              <img 
                src={isDropDownOpen ? iconUp: iconDown} 
                alt="dropdown icon"
                className="w-3 h-3 ml-2 md:hidden cursor-pointer mt-1"
                onClick={onDropDownIconClick}
              />
          </div>
        </div>


        {/* Right Side */}
        <div className="flex space-x-4 items-center md:space-x-6">
          {/* Serach box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-1 shadow-md flex-1 md:flex-initial">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400"/>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchString}
                onChange={setSearchStringLocal}
                className="flex-1 outline-none p-2"/>
              <button hidden type="submit">Search</button>
            </form>
            {/* Avatar */}
            <Avatar name="Jacob Sima" round size="50" className="cprimary"/>
        </div>

      </header>
      
    </div>
  )
}

export default Header

