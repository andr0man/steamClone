import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../services/auth/authApi';
import { userApi } from '../services/user/userApi';
import { libraryApi } from '../services/library/libraryApi';

const middlewares = [authApi.middleware, userApi.middleware, libraryApi.middleware];

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middlewares),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);