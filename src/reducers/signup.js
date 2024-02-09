import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupLoading: false,
  signupError: null,
  signupCredentials: null,
};

export const signupSlice = createSlice({
    name:'signup',
    initialState,
    reducers: {
        signupRequest(state, action){
            state.signupLoading = true,
            state.signupCredentials = action.payload
        },
        signupFailed(state, action){
            state.signupLoading = false,
            state.signupError = action.payload
        },
        signupSuccess(state){
            state.signupLoading = false,
            state.signupError = null,
            state.signupCredentials = null
        }
    }
})

export const { signupRequest, signupFailed, signupSuccess} = signupSlice
export default signupSlice.reducer