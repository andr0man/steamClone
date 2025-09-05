import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlistByUser: builder.query({
      query: () => `by-user`,
      providesTags: ["Wishlist"],
    }),
    getIsInWishlist: builder.query({
      query: (gameId) => `is-in-wishlist?gameId=${gameId}`,
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (gameId) => ({
        url: `?gameId=${gameId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (gameId) => ({
        url: `?gameId=${gameId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistByUserQuery,
  useGetIsInWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
