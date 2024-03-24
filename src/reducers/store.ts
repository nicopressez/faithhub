import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.js";
import signupReducer from "./signup.js";
import settingsReducer from "./settings.js";
import sideNavReducer from "./sidenav.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    settings: settingsReducer,
    sideNav: sideNavReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
