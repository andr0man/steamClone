import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Game"],
  endpoints: (builder) => ({
    getGameById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["Game"],
    }),
    buyGame: builder.mutation({
      query: (gameId) => ({
        url: `buy/${gameId}`,
        method: "POST",
      }),
      invalidatesTags: ["Game"],
    }),
  }),
});

export const { useGetGameByIdQuery, useBuyGameMutation } = gameApi;
