import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type credentialsType = {
  username: string,
    password: string,
    password_verif: string,
    first_name: string,
    last_name: string,
    location: string,
}

interface signupState {
  isLoading: boolean,
  error: string | null,
  credentials: credentialsType
}

const initialState : signupState = {
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
  name: "signup",
  initialState,
  reducers: {
    signupRequest(state) {
      state.isLoading = true;
    },
    signupNext(state, action: PayloadAction<credentialsType>) {
      (state.isLoading = false), (state.credentials = action.payload);
      state.error = null;
    },
    signupChange(state, action: PayloadAction<credentialsType>) {
      state.credentials = action.payload;
    },
    signupFailed(state, action: PayloadAction<string>) {
      (state.isLoading = false), (state.error = action.payload);
    },
    signupSuccess(state) {
      (state.isLoading = false), (state.error = null);
    },
  },
});

export const {
  signupRequest,
  signupFailed,
  signupSuccess,
  signupNext,
  signupChange,
} = signupSlice.actions;
export default signupSlice.reducer;
