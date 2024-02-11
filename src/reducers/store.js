import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import signupReducer from "./signup";
import settingsReducer from "./settings"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    settings: settingsReducer
  },
});
