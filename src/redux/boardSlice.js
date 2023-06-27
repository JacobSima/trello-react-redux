import { createSlice } from '@reduxjs/toolkit';
import data from '../data/data.json';
import { cloneDeep } from 'lodash';

const initState = {
  boards : data.boards,
  activeBoard: {},
  addOrUpdatedBoard: {},
  addOrUpdatedBucket: {},
  addOrUpdatedTask: {},
  addOrUpdatedSubTask: {},
  boardsTobeDeleted: [],
  tasksTobeDeleted: [],
  bucketTobeDeleted: [],
  subTasksTobeDeleted: [],
  searchString: "",


  // General Modal open/close status
}

const boardSlice = createSlice({
  name: "boardsData",
  initialState: initState,
  reducers: {
    // write all the reducers action here
    /**
     * addBoard: (state, action) => {
     *   const payload = action.payload;
     *   board.columns = payload.newColumns;
     *   state.push(board);
     * }
     */

    /**
     * Action to set Active Board on the Page, during initialization of when switching boards
     * @param {*} state 
     * @param {*} action 
     * @returns {state} 
     */
    setActiveBoard: (state, action) => {
      state = cloneDeep(state);
      state.activeBoard = state.boards?.find(board => board?.isActive) || {};
      return state;
    },

    /**
     * Action to reset the search string 
     * @param {*} state 
     * @param {*} action 
     * @returns {state}
     */
    // setSearchString: (state, action) => {
    //   state = cloneDeep(state);
    //   state.searchString = "";
    //   return state;
    // }
  }
})

export default boardSlice;