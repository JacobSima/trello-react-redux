import { createSlice } from '@reduxjs/toolkit';
import data from '../data/data.json';
import { cloneDeep } from 'lodash';

const initState = {
  boards : data.boards,
  activeBoard: {},
  addOrEditColumn: {},
  editTask: {},
  isDeleteModalOpen: false,
  columnToDelete: {},
  searchString: "",

  // Drag and Drop
  dragOverTask: {},


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

      state.searchString = "";
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
      state.searchString = "";
      return state;
    },

    addColumn: (state, action) => {
      state = cloneDeep(state);
      const board = state.boards?.find(board => board.isActive);
      board.columns.push(action.payload.column);

      state.searchString = "";
      return state;
    },

    editBoard: (state, action) => {
      state = cloneDeep(state);
      const payload = action.payload;
      const board = state.boards.find(board => board.isActive);
      board.name = payload.name;
      board.columns = payload.newColumns;

      state.searchString = "";
      return state;
    },

    deleteBoard: (state) => {
      state = cloneDeep(state);
      const board = state.boards?.find(board => board.isActive);
      state.boards?.splice(state.boards?.indexOf(board), 1);

      state.searchString = "";
      return state;
    },

    deleteColumn: (state) => {
      state = cloneDeep(state);
      const board = state.boards?.find(board => board.isActive);
      board.columns = board?.columns?.filter(col => col.id !== state.columnToDelete.id);

      state.searchString = "";
      return state;
    },

    setAddEditColumn: (state, action) => {
      state = cloneDeep(state);
      state.addOrEditColumn = action.payload.col;
      return state;
    },

    setEditTask: (state, action) => {
      state = cloneDeep(state);
      state.editTask = action.payload.task;
      return state;
    },

    addNewTask: (state, action) => {
      state = cloneDeep(state);
      let addOrEditColumn = state.addOrEditColumn;
      const task = action.payload.task;
      task.pos = addOrEditColumn?.tasks?.length;
      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === addOrEditColumn.id)
      column.tasks.push(task);
      state.addOrEditColumn = {};

      state.searchString = "";
      return state; 
    },

    updateTaskSameColumn: (state, action) => {
      state = cloneDeep(state);
      let addOrEditColumn = state.addOrEditColumn;
      const newTask = action.payload.task;

      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === addOrEditColumn.id);
      let oldTask = column?.tasks?.find(task => task.id === newTask.id);
      newTask.pos = oldTask.pos;

      column?.tasks?.splice(oldTask.pos, 1, newTask);
      state.addOrEditColumn = {};
      state.editTask = {};

      state.searchString = "";
      return state;
    },

    deleteTask: (state, action) => {
      state = cloneDeep(state);
      const task = action.payload.task;
      let addOrEditColumn = state.addOrEditColumn;
      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === addOrEditColumn.id);
      column.tasks = column.tasks.filter(t => t.id !== task.id);

      state.addOrEditColumn = {};
      state.editTask = {};

      state.searchString = "";
      return state;
    },

    updateTaskNewColumn: (state, action) => {
      state = cloneDeep(state);
      const newTask = action.payload.task;
      const newColId = action.payload.newColId;

      // Add task into new column
      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const newColumn = board.columns?.find(col => col?.id === newColId);
      newTask.pos = newColumn.tasks.length;
      newColumn.tasks.push(newTask);

      state.searchString = "";
      return state;
    },

    // set Column to delete
    setDeleteColumn: (state, action) => {
      state = cloneDeep(state);
      state.columnToDelete = action.payload.col;
      return state;
    },

    // Reset reducer delet items
    genericReset: (state) => {
      state = cloneDeep(state);
      state.columnToDelete = {};
      state.taskToDelete = {}
      return state;
    },

    // Set delete modal true
    setDeleteModal:(state) => {
      state = cloneDeep(state);
      state.isDeleteModalOpen = !state.isDeleteModalOpen;
      return state;
    },

    searchString: (state, action) => {
      state = cloneDeep(state);
      state.searchString = action.payload.searchString;
      return state;
    },



    // Drag and drop
    // 1. task
    setDragOverTask: (state, action) => {
      state = cloneDeep(state);
      state.dragOverTask = action.payload.task
      return state;
    },
    
    resetDragOverTask: (state) => {
      state = cloneDeep(state);
      state.dragOverTask = {}
      return state;
    },

    removedDraggedTaskFromPreviousColumn: (state, action) => {
      state = cloneDeep(state);
      const taskId = action.payload.taskId;
      const colId = action.payload.colId;

      const board = state.boards?.find(board => board.isActive);
      const column = board.columns?.find(col => col?.id === colId);
      column.tasks =  column?.tasks?.filter(task => task.id !== taskId);
      column?.tasks?.forEach((task, index) => task.pos = index);

      state.activeBoard = board; // update board
      return state;
    },

    pushNewDraggedTask: (state, action) => {
      state = cloneDeep(state);
      const task = action.payload.draggedTask;
      const colId = action.payload.colId;

      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === colId)
      column.tasks.push(task);

      state.activeBoard = board; // update board
      return state; 
    },

    insertDraggedTask: (state, action) => {
      state = cloneDeep(state);
      const task = action.payload.draggedTask;
      const colId = action.payload.colId;
      const pos = action.payload.pos + 1;

      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === colId)
      column?.tasks?.splice(pos, 0, task);
      column?.tasks?.forEach((task, index) => task.pos = index); // update position

      state.activeBoard = board; // update board
      return state; 
    },
  }
})

export default boardSlice;