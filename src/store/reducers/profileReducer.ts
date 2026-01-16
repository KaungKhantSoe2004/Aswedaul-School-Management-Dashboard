import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null
};
export const profileReducer = createSlice({
    name: "profile",
    initialState, 
    reducers: {
        setProfile: (state, action)=> {
            state.profile = action.payload;
        },
        removeProfile: (state, action)=> {
            console.log('in removing profile')
            state.profile = null;
        }
    }
})
export const  { setProfile, removeProfile} = profileReducer.actions;
export default profileReducer.reducer;