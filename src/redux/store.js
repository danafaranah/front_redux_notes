import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./noteSlice";

const store = configureStore({
    reducer: {
        noteStore: noteReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});

export default store;