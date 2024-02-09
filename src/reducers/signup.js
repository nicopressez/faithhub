import { createSlice } from "@reduxjs/toolkit";
import defaultImg from "../assets/defaultProfile.png"

const initialState = {
  isLoading: false,
  error: null,
  credentials: {
    username: "",
    password: "",
    password_verif: "",
    first_name: "",
    last_name: "",
    location: "",
  },
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
        signupChange(state,action){
            state.credentials = action.payload
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

export const { signupRequest, signupFailed, signupSuccess, signupNext, signupChange} = signupSlice.actions
export default signupSlice.reducer