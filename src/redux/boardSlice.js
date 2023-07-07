import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import data from '../data/data.json';
import { cloneDeep } from 'lodash';


const initState = {
  boards : [],
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
     * Initialize board data, from API call to Backend
     * @param {*} state 
     * @param {*} action 
     * @returns state
     */
    setBoards: (state, action ) => {
      state = cloneDeep(state);
      state.boards = action.payload.boards;
      return state
    },

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

      state.boards.push(action.payload.board);
      state.activeBoard = action.payload.board;
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
      const board = action.payload.board;
      const boards = state.boards;
      const index = boards.findIndex(b => b.id === board.id)
      if(index !== -1){
        state.boards[index] = board;
      }
      state.activeBoard = board;
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

    updatedBoad: (state, action) => {
      state = cloneDeep(state);
      const board = state.boards?.find(board => board.isActive);
      state.boards?.splice(state.boards?.indexOf(board), 1, action.payload.board);
      state.activeBoard = action.payload.board
      state.searchString = "";
      return state;
    },

    updatedBucket: (state, action) => {
      state = cloneDeep(state);
      const bucket = action.payload.bucket
      let addOrEditColumn = state.addOrEditColumn;
      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === addOrEditColumn.id)

      board?.columns?.splice(board?.columns?.indexOf(column), 1, bucket)
      state.activeBoard = board
      state.searchString = "";
      
      return state; 
    },

    updatedDraggedBuckets: (state, action) => {
      state = cloneDeep(state);
      const {sourceIndex, destinationIndex} =  action.payload.draggedColumn;
      const board = state.boards?.find(board => board.isActive);
      const sourceColumn = board?.columns?.find(col => col.pos === sourceIndex);
      const destinationColumn = board?.columns?.find(col => col.pos === destinationIndex);
      sourceColumn.pos = destinationIndex;
      destinationColumn.pos = sourceIndex;
      state.activeBoard = board;

      state.searchString = "";
      return state;
    },

    draggedTaskSameBucket: (state,action) => {
      let board = state.boards?.find(board => board.isActive);
      board = action.payload.board
      state.activeBoard = board
      return state;
    },

    setAddEditColumn: (state, action) => {
      state = cloneDeep(state);
      state.addOrEditColumn = action.payload.col;
      return state;
    },

    resetAddOrEditColumn: (state) => {
      state = cloneDeep(state);
      state.addOrEditColumn = {};
      return state;
    },

    setEditTask: (state, action) => {
      state = cloneDeep(state);
      state.editTask = action.payload.task;
      return state;
    },
    
    resetEditTask: (state) => {
      state = cloneDeep(state);
      state.editTask = {};
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
      const newTask = action.payload.task;

      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === newTask.bucketId);
      let oldTask = column?.tasks?.find(task => task.id === newTask.id);

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
    
    insertDraggedTaskSameColumn: (state, action) => {
      state = cloneDeep(state);
      const posDragged = action.payload.posDragged;
      const colId = action.payload.colId;
      const posOver = action.payload.posOver + 1;

      const board = state.boards?.find(board => board.id === state.activeBoard.id);
      const column = board.columns?.find(col => col?.id === colId)
      const tasks = column?.tasks;
      const temp = tasks?.splice(posDragged, 1)[0];
      tasks.splice(posOver, 0, temp)

      column?.tasks?.forEach((task, index) => task.pos = index); // update position
      state.activeBoard = board; // update board
      return state; 
    },
  },
})

export default boardSlice;