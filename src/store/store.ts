import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userRedcuer";
import gallerySlice from "./reducers/galleryReducer";
import faqSlice from "./reducers/faqReducer";
import salarySlice from "./reducers/salaryReducer";
import profileSlice from "./reducers/profileReducer"
export const store = configureStore({
  reducer: {
    users: userSlice,
    galleries: gallerySlice,
    faqs: faqSlice,
    salaries: salarySlice,
    profile: profileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
