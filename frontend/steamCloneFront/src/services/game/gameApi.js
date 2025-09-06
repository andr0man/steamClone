import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: createBaseQueryWithRefresh("/game/"),
  tagTypes: ["Game"],
  endpoints: (builder) => ({
    getAllGames: builder.query({
      query: () => "",
      providesTags: ["Game"],
    }),
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
    createGame: builder.mutation({
      query: (gameData) => ({
        url: "",
        method: "POST",
        body: gameData,
      }),
      invalidatesTags: ["Game"],
    }),
    updateGame: builder.mutation({
      query: (gameData) => ({
        url: `${gameData.id}`,
        method: "PUT",
        body: gameData,
      }),
      invalidatesTags: ["Game"],
    }),
    deleteGame: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Game"],
    }),
  }),
});

export const {
  useGetGameByIdQuery,
  useBuyGameMutation,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useGetAllGamesQuery,
} = gameApi;
