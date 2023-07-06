import React, { useEffect } from 'react'
import Header from './components/Header'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Center from './components/Center';
import EmptyBoard from './components/EmptyBoard';
import boardSlice from './redux/boardSlice';
import { useGetBoards } from './redux/boardSLiceThunk';
import { cloneDeep } from 'lodash';


const App = () => {

  const dispatch = useDispatch();
  const boards = useSelector(state => state.boardsData.boards)

  const initBoardsData = async() => {
    const res = await dispatch(useGetBoards())
    dispatch(boardSlice.actions.setBoards(res.payload))
    dispatch(boardSlice.actions.setActiveBoard());
  }

  useEffect(() => {
    initBoardsData()
  }, [])

  return (
    <>
      <div className="overflow-hidden">
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