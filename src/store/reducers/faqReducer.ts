import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Type definition
export interface faq {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

const initialState: faq[] = [];

const faqReducers = createSlice({
  name: "faqs",
  initialState,
  reducers: {
    addFaq: (state, action) => {
      state.push(action.payload);
    },
    setFaqs: (state, action) => {
      state.push(...action.payload);
    },
    removeFaq: (state, action) => {
      return state.filter((faq) => faq.id !== action.payload);
    },
  },
});
export default faqReducers.reducer;
export const { addFaq, setFaqs, removeFaq } = faqReducers.actions;
