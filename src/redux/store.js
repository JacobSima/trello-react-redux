import {configureStore } from '@reduxjs/toolkit';
import boardSlice from './boardSlice';

const store = configureStore({

  reducer : {
    boardsData: boardSlice.reducer,
  }
})

export default store;