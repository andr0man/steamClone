
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameLibraryApi = createApi({
  reducerPath: "gameLibraryApi",
  baseQuery: baseQueryWithRefresh("/user-game-library/"),
  tagTypes: ["GameLibrary"],
  endpoints: (builder) => ({
    getGameLibrary: builder.query({
      query: () => `by-user`,
      providesTags: () => [{ type: "GameLibrary", id: "LIST" }],
    }),
    getIsInGameLibrary: builder.query({
      query: (gameId) => `is-in-library/${gameId}`,
      providesTags: (res, err, arg) => [
        { type: "GameLibrary", id: "LIST" },
        { type: "GameLibrary", id: String(arg) },
      ],
    }),
  }),
});

export const { useGetGameLibraryQuery, useGetIsInGameLibraryQuery } =
  gameLibraryApi;