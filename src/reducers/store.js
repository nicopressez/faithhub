import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import signupReducer from "./signup";
import settingsReducer from "./settings";
import sideNavReducer from "./sidenav";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    settings: settingsReducer,
    sideNav: sideNavReducer
  },
});
