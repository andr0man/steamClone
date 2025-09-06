import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameLibraryApi = createApi({
  reducerPath: "gameLibraryApi",
  baseQuery: createBaseQueryWithRefresh("/user-game-library/"),
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