import { createAsyncThunk} from '@reduxjs/toolkit';

export const getBoards = createAsyncThunk('board/getboards', async (data) => {
  console.log(data)
  try {
    const res = await fetch('api/boards');
    const result = await res.json();
    console.log(result)
    return result
  } catch (err) {
    // return console.log(err);
  }
})