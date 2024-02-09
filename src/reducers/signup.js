import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  credentials: null,
};

export const signupSlice = createSlice({
    name:'signup',
    initialState,
    reducers: {
        signupRequest(state){
            state.isLoading = true
        },
        signupNext(state,action) {
            state.isLoading = false,
            state.credentials = action.payload
            state.error = null
        },
        signupFailed(state, action){
            state.isLoading = false,
            state.error = action.payload
        },
        signupSuccess(state){
            state.isLoading = false,
            state.error = null,
            state.credentials = null
        }
    }
})

export const { signupRequest, signupFailed, signupSuccess, signupNext} = signupSlice.actions
export default signupSlice.reducer