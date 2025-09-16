import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const marketSellApi = createApi({
  reducerPath: "marketSellApi",
  baseQuery: baseQueryWithRefresh("/market-item/"),
  tagTypes: ["MarketItem", "UserItems", "MarketHistory"],
  endpoints: (builder) => ({
    putUpForSale: builder.mutation({
      query: ({ userItemId, price }) => ({
        url: "put-up-for-sale",
        method: "POST",
        body: { userItemId, price },
      }),
      invalidatesTags: [
        { type: "MarketItem", id: "LIST" },
        { type: "UserItems", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
      ],
    }),

    cancel: builder.mutation({
      query: (marketItemId) => ({
        url: `${marketItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MarketItem", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  usePutUpForSaleMutation: usePutUpForSale2,
  useCancelMutation: useCancelMarketItemMutation,
} = marketSellApi;