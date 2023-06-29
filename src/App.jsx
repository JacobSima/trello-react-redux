import React, { useEffect } from 'react'
import Header from './components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Center from './components/Center';
import EmptyBoard from './components/EmptyBoard';
import boardSlice from './redux/boardSlice';

const App = () => {

  const dispatch = useDispatch();
  const boards = useSelector(state => state.boardsData.boards)

  useEffect(() => {
    dispatch(boardSlice.actions.setActiveBoard());
  }, [])

  return (
    <>
      <div className="overflow-hidden overflow-x-scroll">
       {
        boards?.length > 0
        ? (
            <>
              {/* Header Section  */}
              <Header />

              {/* Center Section */}
              <Center />
            </> 
          )
        : (<><EmptyBoard /></>)
       }
        <ToastContainer />
      </div>

    </>
    
  )
}

export default App