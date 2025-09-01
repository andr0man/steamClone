import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};

export const gameLibraryApi = createApi({
  reducerPath: "gameLibraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_ENV.API_URL}user-game-library/`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["GameLibrary"],
  endpoints: (builder) => ({
    getGameLibrary: builder.query({
      query: () => `by-user`,
      providesTags: ["GameLibrary"],
    }),
    getIsInGameLibrary: builder.query({
      query: (gameId) => `is-in-library/${gameId}`,
      providesTags: ["GameLibrary"],
    }),
  }),
});

export const { useGetGameLibraryQuery, useGetIsInGameLibraryQuery } = gameLibraryApi;