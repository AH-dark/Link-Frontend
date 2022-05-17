import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import data from "./data";
import viewUpdate from "./viewUpdate";

const store = configureStore({
    reducer: {
        data,
        viewUpdate,
    },
    devTools: process.env.NODE_ENV === "development",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
