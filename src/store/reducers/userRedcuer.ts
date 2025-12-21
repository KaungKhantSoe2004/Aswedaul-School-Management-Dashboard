import { createSlice } from "@reduxjs/toolkit";

export interface user {
  id: number | string;
  taecher_id: number | string;
  user_name: string;
  grade_id: string;
  study_material_web: string;
  study_material_file: string;
  study_material_video: string;
  schedule: string;
}

const initialState: user[] = [];
export const userReducer = createSlice({
  name: "salaries",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.push(...action.payload);
    },
    addUsers: (state, action) => {
      state.push(action.payload);
    },
    removeUser: (state, action) => {
      state.filter((user) => user.id == action.payload.id);
    },
    getUserById: (state, action) => {
      const founduser = state.filter((user) => user.id == action.payload);
      return founduser;
    },
  },
});
export default userReducer.reducer;
export const { setUsers, addUsers, removeUser, getUserById } =
  userReducer.actions;
