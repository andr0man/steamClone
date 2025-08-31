import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: APP_ENV.REMOTE_API_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlistByUser: builder.query({
      query: () => `wishlist/by-user`,
      providesTags: ["Wishlist"],
    }),
    getIsInWishlist: builder.query({
      query: (gameId) => `wishlist/is-in-wishlist?gameId=${gameId}`,
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (gameId) => ({
        url: `wishlist?gameId=${gameId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (gameId) => ({
        url: `wishlist?gameId=${gameId}`,
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
