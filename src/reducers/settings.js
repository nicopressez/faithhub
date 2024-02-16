import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  errors: {
    username: null,
    first_name: null,
    last_name: null,
    bio: null,
    location: null,
  },
  success: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateRequest(state) {
      state.isLoading = true;
      state.success = false;
    },
    updateSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    updateFailed(state, action) {
      (state.isLoading = false),
        (state.errors = action.payload),
        (state.success = false);
    },
  },
});

export const { updateFailed, updateRequest, updateSuccess } =
  settingsSlice.actions;
export default settingsSlice.reducer;
