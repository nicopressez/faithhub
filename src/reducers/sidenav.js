import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navVisible: false,
}

export const sideNavSlice = createSlice({
    name:"sideNav",
    initialState,
    reducers: {
        toggleNavBar(state){
            state.navVisible = !state.navVisible
        },
    }
})

export const { toggleNavBar } = sideNavSlice.actions
export default sideNavSlice.reducer