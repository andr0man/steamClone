import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import { gameApi } from "../services/game/gameApi";
import { wishlistApi } from "../services/wishlist/wishlistApi";
import { gameLibraryApi } from "../services/game-library/gameLibraryApi";

export const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [gameLibraryApi.reducerPath]: gameLibraryApi.reducer,
});