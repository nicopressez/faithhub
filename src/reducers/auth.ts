import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  bio: string;
  connect?: string[];
  first_name: string;
  friends?: string[];
  last_name: string;
  location?: string;
  password?: string;
  posts: [string];
  preferences: string[];
  profile_picture: string;
  username: string;
  _id: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
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
    loginSuccess(state, action: PayloadAction<User>) {
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
      localStorage.removeItem("token");
      (state.isLoggedIn = false), (state.user = null);
    },
    tokenRefresh(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,
  logoutSuccess,
  tokenRefresh,
} = authSlice.actions;
export default authSlice.reducer;
