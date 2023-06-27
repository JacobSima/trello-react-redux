import React, { useEffect } from 'react'
import Header from './components/Header'
import boardSlice from './redux/boardSlice';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {

  const dispatch = useDispatch();

  const boards = useSelector(state => state.boardsData.boards)

  useEffect(() => {
    // Initialized activeBoard
    dispatch(boardSlice.actions.setActiveBoard());
  }, [])

  return (
    <div className="overflow-hidden overflow-x-scroll">

        <>
          {/* Header Section  */}
          <Header />
        </> 
        
    </div>
  )
}

export default App