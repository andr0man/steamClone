import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: baseQueryWithRefresh("/game/"),
  tagTypes: ["Game"],
  endpoints: (builder) => ({
    getAllGames: builder.query({
      query: () => "",
      providesTags: ["Game"],
    }),
    getIsOwner: builder.query({
      query: (gameId) => `is-owner/${gameId}`,
      providesTags: ["Game"],
    }),
    getAssociatedUsers: builder.query({
      query: (gameId) => `get-associated-users/${gameId}`,
      providesTags: ["Game"],
    }),
    isGameBought: builder.query({
      query: (gameId) => `is-game-bought/${gameId}`,
      providesTags: ["Game"],
    }),
    byAssociatedUser: builder.query({
      query: () => "by-associated-user",
      providesTags: ["Game"],
    }),
    getWithoutApproval: builder.query({
      query: () => "get-without-approval",
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
    updateCoverImage: builder.mutation({
      query: ({ gameId, formData }) => ({
        url: `update-cover-image/${gameId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Game"],
    }),
    updateScreenshots: builder.mutation({
      query: ({ gameId, formData }) => ({
        url: `update-screenshots-images/${gameId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Game"],
    }),
    associateUser: builder.mutation({
      query: ({ gameId, userId }) => ({
        url: `associate-user?gameId=${gameId}&userId=${userId}`,
        method: "PATCH"
      }),
      invalidatesTags: ["Game"],
    }),
    removeAssociatedUser: builder.mutation({
      query: ({ gameId, userId }) => ({
        url: `remove-associated-user?gameId=${gameId}&userId=${userId}`,
        method: "PATCH"
      }),
      invalidatesTags: ["Game"],
    }),
    approve: builder.mutation({
      query: ({ id, isApproved }) => ({
        url: `approve?id=${id}&isApproved=${isApproved}`,
        method: "PATCH"
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
  useIsGameBoughtQuery,
  useUpdateCoverImageMutation,
  useUpdateScreenshotsMutation,
  
  useGetIsOwnerQuery,
  useGetAssociatedUsersQuery,
  useAssociateUserMutation,
  useRemoveAssociatedUserMutation,
  useByAssociatedUserQuery,

  useGetWithoutApprovalQuery,
  useApproveMutation,
} = gameApi;