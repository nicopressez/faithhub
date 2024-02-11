import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    loginFailed(state) {
      state.error =
        "Invalid credentials. Please double-check your username and password.";
      state.isLoading = false;
    },
    logoutSuccess(state) {
      (state.isLoggedIn = false), (state.user = null);
    },
  },
});

export const { loginRequest, loginSuccess, loginFailed, logoutSuccess } =
  authSlice.actions;
export default authSlice.reducer;
