import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: baseQueryWithRefresh("/wishlist/"),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlistByUser: builder.query({
      query: () => "by-user",
      providesTags: (res) => {
        const list = (res?.payload ?? res ?? []);
        const itemTags = Array.isArray(list)
          ? list.map((row) => ({
              type: "Wishlist",
              id: String(row?.game?.id ?? row?.gameId ?? row?.id),
            }))
          : [];
        return [{ type: "Wishlist", id: "LIST" }, ...itemTags];
      },
    }),
    getIsInWishlist: builder.query({
      query: (gameId) => `is-in-wishlist?gameId=${gameId}`,
      providesTags: (res, err, arg) => [
        { type: "Wishlist", id: "LIST" },
        { type: "Wishlist", id: String(arg) },
      ],
    }),
    addToWishlist: builder.mutation({
      query: (gameId) => ({
        url: `?gameId=${gameId}`,
        method: "POST",
      }),
      invalidatesTags: (res, err, arg) => [
        { type: "Wishlist", id: "LIST" },
        { type: "Wishlist", id: String(arg) },
      ],
    }),
    removeFromWishlist: builder.mutation({
      query: (gameId) => ({
        url: `?gameId=${gameId}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, arg) => [
        { type: "Wishlist", id: "LIST" },
        { type: "Wishlist", id: String(arg) },
      ],
    }),
  }),
});

export const {
  useGetWishlistByUserQuery,
  useGetIsInWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;