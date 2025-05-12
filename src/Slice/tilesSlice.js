
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  tiles: {},
};
export const tilesSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    tilesList: (state, action) => {
      state.tiles = action.payload;
    },
    updateTilesList: (state, action) => {
      state.tiles = action.payload;
    }
  }
});

export const { tilesList, updateTilesList } = tilesSlice.actions;

export default tilesSlice.reducer;
