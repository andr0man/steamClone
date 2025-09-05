import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameLibraryApi = createApi({
  reducerPath: "gameLibraryApi",
  baseQuery: baseQueryWithRefresh,
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