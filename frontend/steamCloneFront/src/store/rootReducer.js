import { combineReducers } from "@reduxjs/toolkit";
import { libraryApi } from "../services/library/libraryApi";

const rootReducer = combineReducers({
    [libraryApi.reducerPath]: libraryApi.reducer
});