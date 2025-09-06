import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: createBaseQueryWithRefresh("/wishlist/"),
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
