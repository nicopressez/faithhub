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
            state.user = action.payload;
            state.error = null;
        },
        loginFailed(state){
            state.error = "Invalid credentials. Please double-check your username and password.";
            state.isLoading = false;
        }

    }
})

export const { loginRequest, loginSuccess, loginFailed } = authSlice.actions;
export default authSlice.reducer
