import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameLocalizationApi = createApi({
  reducerPath: "gameLocalizationApi",
  baseQuery: baseQueryWithRefresh("/game/localization/"),
  tagTypes: ["GameLocalization"],
  endpoints: (builder) => ({
    createGameLocalization: builder.mutation({
      query: (gameLocalizationData) => ({
        url: "",
        method: "POST",
        body: gameLocalizationData,
      }),
      invalidatesTags: ["GameLocalization"],
    }),
    updateGameLocalization: builder.mutation({
      query: (gameLocalizationData) => ({
        url: `${gameLocalizationData.id}`,
        method: "PUT",
        body: gameLocalizationData,
      }),
      invalidatesTags: ["GameLocalization"],
    }),
    deleteGameLocalization: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GameLocalization"],
    }),
  }),
});

export const {
  useCreateGameLocalizationMutation,
  useUpdateGameLocalizationMutation,
  useDeleteGameLocalizationMutation,
} = gameLocalizationApi;
