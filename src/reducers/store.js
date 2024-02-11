import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import signupReducer from "./signup";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
  },
});
