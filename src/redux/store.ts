import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import viewUpdate from "./viewUpdate";
import localApi from "service/localApi";
import rootApi from "service/rootApi";

const store = configureStore({
    reducer: {
        viewUpdate,
        [localApi.reducerPath]: localApi.reducer,
        [rootApi.reducerPath]: rootApi.reducer,
    },
    devTools: process.env.NODE_ENV === "development",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk).concat(localApi.middleware).concat(rootApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
