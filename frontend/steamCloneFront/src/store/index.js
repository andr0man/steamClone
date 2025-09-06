import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import { rootReducer } from "./rootReducer";
import { gameApi } from "../services/game/gameApi";
import { wishlistApi } from "../services/wishlist/wishlistApi";
import { gameLibraryApi } from "../services/game-library/gameLibraryApi";
import { genreApi } from "../services/genre/genreApi";

const middlewares = [
  authApi.middleware,
  userApi.middleware,
  gameApi.middleware,
  wishlistApi.middleware,
  gameLibraryApi.middleware,
  genreApi.middleware,
];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middlewares),
});

setupListeners(store.dispatch);
