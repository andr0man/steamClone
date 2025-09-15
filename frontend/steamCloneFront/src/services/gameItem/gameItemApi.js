import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameItemApi = createApi({
  reducerPath: "gameItemApi",
  baseQuery: baseQueryWithRefresh("/item/"),
  tagTypes: ["GameItem"],
  endpoints: (builder) => ({
    getAllGameItems: builder.query({
      query: () => ``,
      providesTags: ["GameItem"],
    }),
    getGameItemById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["GameItem"],
    }),
    getByGameId: builder.query({
      query: (gameId) => `by-game/${gameId}`,
      providesTags: ["GameItem"],
    }),
    // create body
    // {
    //   "name": "item",
    //   "description": "some description",
    //   "gameId": "02fd4d3d-2de7-4967-8d1b-efb73f80ec41"
    // }
    createGameItem: builder.mutation({
      query: (newItem) => ({
        url: ``,
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["GameItem"],
    }),
    // update body
    // {
    //   "name": "string",
    //   "description": "string"
    // }
    updateGameItem: builder.mutation({
      query: (updatedItem) => ({
        url: `${updatedItem.id}`,
        method: "PUT",
        body: updatedItem,
      }),
      invalidatesTags: ["GameItem"],
    }),
    deleteGameItem: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GameItem"],
    }),
    updateItemImage: builder.mutation({
      query: ({ itemId, formData }) => ({
        url: `update-image/${itemId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["GameItem"],
    }),
  }),
});

export const {
  useGetAllGameItemsQuery,
  useGetGameItemByIdQuery,
  useCreateGameItemMutation,
  useUpdateGameItemMutation,
  useDeleteGameItemMutation,
  useUpdateItemImageMutation,
  useGetByGameIdQuery,
} = gameItemApi;
