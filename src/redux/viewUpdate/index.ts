import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ViewUpdateState {
    title: string | null;
    sidebar: {
        open: boolean;
    };
}

const initialState: ViewUpdateState = {
    title: null,
    sidebar: {
        open: false,
    },
};

const viewUpdate = createSlice({
    name: "viewUpdate",
    initialState,
    reducers: {
        setTitle(state, action: PayloadAction<string | null>) {
            state.title = action.payload;
        },
        setSidebarOpen(state, action: PayloadAction<boolean>) {
            state.sidebar.open = action.payload;
        },
    },
});

export const { setTitle, setSidebarOpen } = viewUpdate.actions;
export default viewUpdate.reducer;
