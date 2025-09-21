import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const marketBuyApi = createApi({
  reducerPath: "marketBuyApi",
  baseQuery: baseQueryWithRefresh("/market-item/"),
  tagTypes: ["MarketItem", "UserItems", "MarketHistory"],
  endpoints: (builder) => ({
    buy: builder.mutation({
      query: (marketItemId) => ({
        url: `buy?marketItemId=${encodeURIComponent(marketItemId)}`,
        method: "PUT",
      }),
      invalidatesTags: [
        { type: "MarketItem", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
        { type: "UserItems", id: "LIST" },
      ],
    }),
  }),
});

export const { useBuyMutation: useBuyMarketMutation } = marketBuyApi;