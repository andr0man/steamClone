import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../services/auth/authApi";
import { userApi } from "../services/user/userApi";
import { gameApi } from "../services/game/gameApi";
import { wishlistApi } from "../services/wishlist/wishlistApi";
import { gameLibraryApi } from "../services/game-library/gameLibraryApi";
import userReducer from "./reduserSlises/userSlice";
import { genreApi } from "../services/genre/genreApi";
import { developerAndPublisherApi } from "../services/developerAndPublisher/developerAndPublisherApi";
import { gameSystemRequirementsApi } from "../services/gameSystemRequirements/gameSystemRequrementsApi";
import { languageApi } from "../services/language/languageApi";
import { countryApi } from "../services/country/countryApi";
import { gameLocalizationApi } from "../services/gameLocalization/gameLocalizationApi";

export const rootReducer = combineReducers({
  user: userReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [gameApi.reducerPath]: gameApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [gameLibraryApi.reducerPath]: gameLibraryApi.reducer,
  [genreApi.reducerPath]: genreApi.reducer,
  [developerAndPublisherApi.reducerPath]: developerAndPublisherApi.reducer,
  [gameSystemRequirementsApi.reducerPath]: gameSystemRequirementsApi.reducer,
  [languageApi.reducerPath]: languageApi.reducer,
  [countryApi.reducerPath]: countryApi.reducer,
  [gameLocalizationApi.reducerPath]: gameLocalizationApi.reducer,
});
