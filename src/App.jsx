import React from 'react'
import Header from './components/Header'
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Center from './components/Center';
import EmptyBoard from './components/EmptyBoard';

const App = () => {

  const boards = useSelector(state => state.boardsData.boards)

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