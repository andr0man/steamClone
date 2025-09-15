import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import { rootReducer } from "./rootReducer";
import { gameApi } from "../services/game/gameApi";
import { wishlistApi } from "../services/wishlist/wishlistApi";
import { gameLibraryApi } from "../services/gameLibrary/gameLibraryApi";
import { genreApi } from "../services/genre/genreApi";
import { developerAndPublisherApi } from "../services/developerAndPublisher/developerAndPublisherApi";
import { gameSystemRequirementsApi } from "../services/gameSystemRequirements/gameSystemRequrementsApi";
import { languageApi } from "../services/language/languageApi";
import { countryApi } from "../services/country/countryApi";
import { gameLocalizationApi } from "../services/gameLocalization/gameLocalizationApi";
import { gameItemApi } from "../services/gameItem/gameItemApi";

const middlewares = [
  authApi.middleware,
  userApi.middleware,
  gameApi.middleware,
  wishlistApi.middleware,
  gameLibraryApi.middleware,
  genreApi.middleware,
  developerAndPublisherApi.middleware,
  gameSystemRequirementsApi.middleware,
  languageApi.middleware,
  countryApi.middleware,
  gameLocalizationApi.middleware,
  gameItemApi.middleware,
];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middlewares),
});

setupListeners(store.dispatch);
