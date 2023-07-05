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