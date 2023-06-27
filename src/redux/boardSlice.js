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
     * Action to set Active Board on the Page, during initialization of when switching boards
     * @param {*} state 
     * @param {*} action 
     * @returns {state} 
     */
    setActiveBoard: (state) => {
      state = cloneDeep(state);
      const anyActiveBoard = state.boards?.some(board => board.isActive);
      if(state.boards?.length > 0){
        state.activeBoard =  anyActiveBoard
        ? state.boards?.find(board => board?.isActive)
        : state.activeBoard = state.boards?.[0];
        state.activeBoard.isActive = true;
      }else{
        state.activeBoard = {}
      }
      return state;
    },

    /**
     * Action to set Active Board on the Page, during initialization of when switching boards
     * @param {*} state 
     * @param {*} action 
     * @returns {state} 
     */
    updateActiveBoard: (state, action) => {
      state = cloneDeep(state);
      const payloadIndex = action.payload;
      state.boards?.map((board, index) => {
        index === payloadIndex ? (board.isActive = true) : (board.isActive = false);
        return board;
      })
      return state;
    },

    addBoard: (state, action) => {
      state = cloneDeep(state);
      state.boards.map(board =>{
        board.isActive = false;
        return board
      });

      const board = {
        name: action.payload.name,
        columns: action.payload.newColumns,
        isActive: true,
        id: action.payload.id,
        pos: action.payload.pos
      };

      state.boards.push(board);
      return state;
    },

    editBoard: (state, action) => {
      const payload = action.payload;
      const board = state.boards.find(board => board.isActive);
      board.name = payload.name;
      board.columns = payload.newColumns;
      return state;
    },

    deleteBoard: (state) => {
      const board = state.boards?.find(board => board.isActive);
      state.boards?.splice(state.boards?.indexOf(board), 1);
      return state;
    },
  }
})

export default boardSlice;