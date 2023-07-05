import { createAsyncThunk} from '@reduxjs/toolkit';


/**
 * This is a Thunk to get all Boards data 
 */
export const useGetBoards = createAsyncThunk('board/getboards', async () => {
  try {
    const res = await fetch('api/boards');
    const result = await res.json();
    return result
  } catch (err) {
    return console.log(err);
  }
})

/**
 * This is a Thunk to get all Boards data 
 */
export const useUpdateActiveBoards = createAsyncThunk('board/updateActiveBoard', async (index) => {
  try {
    const res = await fetch(`api/boards/updateactiveboard/${index}`);
    const result = await res.json();
    return result
  } catch (err) {
    return console.log(err);
  }
})


/**
 * This is a Thunk to get all Boards data 
 */
export const useCreateBoard = createAsyncThunk('board/createBoard', async (data) => {
  const headers = {'Content-Type': 'application/json'};
  const options = {method: 'post', headers: headers, body: JSON.stringify(data)};

  try {
    const res = await fetch("api/boards", options);
    const result = await res.json();
    return result;
  } catch (err) {
    return console.log(err);
  }
})


/**
 * This is a Thunk to get all Boards data 
 */
export const useEditBoard = createAsyncThunk('board/editBoard', async (data) => {
  const headers = {'Content-Type': 'application/json'};
  const options = {method: 'put', headers: headers, body: JSON.stringify(data)};

  try {
    const res = await fetch("/api/boards/editboard", options);
    const result = await res.json();
    return result;
  } catch (err) {
    return console.log(err);
  }
})


/**
 * This is a Thunk to get all Boards data 
 */
export const useDeleteBoard = createAsyncThunk('board/deleteBoard', async (board_id) => {
  const options = {method: 'delete'};
  try {
    const res = await fetch(`/api/boards/${board_id}`, options);
    const result = await res.json();
    return result;
  } catch (err) {
    return console.log(err);
  }
})

/**
 * This is a Thunk to get all Boards data 
 */
export const useDeleteBucket = createAsyncThunk('board/deleteBoard', async (bucket_id) => {
  const options = {method: 'delete'};
  try {
    const res = await fetch(`/api/bucket/${bucket_id}`, options);
    const result = await res.json();
    return result;
  } catch (err) {
    return console.log(err);
  }
})