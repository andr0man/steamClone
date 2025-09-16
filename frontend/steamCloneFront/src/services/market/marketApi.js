import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const marketApi = createApi({
  reducerPath: "marketApi",
  baseQuery: baseQueryWithRefresh("/market-item/"),
  tagTypes: ["MarketItem", "MarketHistory"],
  endpoints: (builder) => ({
    getMarketItems: builder.query({
      query: () => "",
      providesTags: (res) => {
        const list = res?.payload ?? res ?? [];
        if (!Array.isArray(list)) return [{ type: "MarketItem", id: "LIST" }];
        const ids = list
          .map((row) => {
            const id = row?.id ?? row?.marketItemId ?? row?.itemId ?? row?.item?.id;
            return id ? { type: "MarketItem", id: String(id) } : null;
          })
          .filter(Boolean);
        return [{ type: "MarketItem", id: "LIST" }, ...ids];
      },
    }),

    getMarketItemHistory: builder.query({
      query: () => "history",
      providesTags: [{ type: "MarketHistory", id: "LIST" }],
    }),

    getMarketItemById: builder.query({
      query: (id) => `${id}`,
      providesTags: (res, err, id) => [{ type: "MarketItem", id: String(id) }],
    }),

    deleteMarketItem: builder.mutation({
      query: (id) => ({ url: `${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "MarketItem", id: String(id) },
        { type: "MarketItem", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
      ],
    }),

    putUpForSale: builder.mutation({
      query: (body) => ({
        url: "put-up-for-sale",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "MarketItem", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
      ],
    }),

    buyMarketItem: builder.mutation({
      query: (body) => ({
        url: "buy",
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        { type: "MarketItem", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMarketItemsQuery,
  useGetMarketItemHistoryQuery,
  useGetMarketItemByIdQuery,
  useDeleteMarketItemMutation,
  usePutUpForSaleMutation,
  useBuyMarketItemMutation,
} = marketApi;