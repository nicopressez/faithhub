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
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateRequest(state) {
      state.isLoading = true;
    },
    updateSuccess(state) {
      state.isLoading = false;
    },
    updateFailed(state, action) {
      (state.isLoading = false), (state.errors = action.payload);
    },
  },
});

export const { updateFailed, updateRequest, updateSuccess } =
  settingsSlice.actions;
export default settingsSlice.reducer;
