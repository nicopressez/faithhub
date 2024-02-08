import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    user: null,
    isLoading: false,
    error: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest(state) {
            state.isLoading = true;
        },
        loginSuccess(state,action) {
            state.isLoggedIn = true;
            state.isLoading = false;
            state.user = action.payload
        }
    }
})

export const { loginRequest, loginSuccess } = authSlice.actions;
export default authSlice.reducer
