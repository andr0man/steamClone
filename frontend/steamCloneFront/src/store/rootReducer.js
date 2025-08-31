import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import { gameApi } from "../services/game/gameApi";

export const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
});