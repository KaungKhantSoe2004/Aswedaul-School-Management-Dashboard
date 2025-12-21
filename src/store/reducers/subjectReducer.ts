import { createSlice } from "@reduxjs/toolkit";

export interface Subject {
  id: number | string;
  taecher_id: number | string;
  subject_name: string;
  grade_id: string;
  study_material_web: string;
  study_material_file: string;
  study_material_video: string;
  schedule: string;
}

const initialState: Subject[] = [];
const subjectReducer = createSlice({
  name: "salaries",
  initialState,
  reducers: {
    setSubject: (state, action) => {
      state.push(...action.payload);
    },
    addSubject: (state, action) => {
      state.push(action.payload);
    },
    removeSubject: (state, action) => {
      state.filter((subject) => subject.id == action.payload.id);
    },
    getSubjectById: (state, action) => {
      const foundSubject = state.filter(
        (subject) => subject.id == action.payload
      );
      return foundSubject;
    },
  },
});
export default subjectReducer.reducer;
export const { setSubject, addSubject, removeSubject, getSubjectById } =
  subjectReducer.actions;
