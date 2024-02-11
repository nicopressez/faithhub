import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,

};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
   updateRequest(state){
    state.isLoading = true
   },
   updateSuccess(state){
    state.isLoading = false
   },
   updateFailed(state,action){
    state.isLoading= false,
    state.error = action.payload
   }
  },
});

export const {
  updateFailed,updateRequest,updateSuccess
} = settingsSlice.actions;
export default settingsSlice.reducer;
