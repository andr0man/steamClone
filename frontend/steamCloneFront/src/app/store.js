import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});