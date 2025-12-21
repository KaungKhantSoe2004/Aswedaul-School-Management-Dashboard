import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

// Type definition
export interface gallery {
  id: string;
  galleryName: string;
  image: string;
  created_at: string;
  updated_at: string;
}

const initialState: gallery[] = [];
const galleryReducer = createSlice({
  name: "galleries",
  initialState,
  reducers: {
    setGalleries: (state, action) => {
      state.push(...action.payload);
    },
    addGallery: (state, action) => {
      state.push(action.payload);
    },
    removeGallery: (state, action) => {
      state.filter((gallery) => gallery.id == action.payload.id);
    },
  },
});
export default galleryReducer.reducer;
export const { setGalleries, addGallery, removeGallery } =
  galleryReducer.actions;
