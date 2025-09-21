import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const marketApi = createApi({
  reducerPath: "marketApi",
  baseQuery: baseQueryWithRefresh("/market-item/"),
  tagTypes: ["MarketItem", "MarketHistory", "UserItem"],
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
      query: (arg) => {
        const marketItemId = typeof arg === "string" ? arg : arg?.marketItemId;
        return {
          url: `buy?marketItemId=${encodeURIComponent(marketItemId ?? "")}`,
          method: "PUT",
        };
      },
      invalidatesTags: [
        { type: "MarketItem", id: "LIST" },
        { type: "MarketHistory", id: "LIST" },
        { type: "UserItem", id: "LIST" },
      ],
    }),
    getUserItems: builder.query({
      query: () => "../user-item",
      providesTags: (res) => {
        const list = res?.payload ?? res ?? [];
        if (!Array.isArray(list)) return [{ type: "UserItem", id: "LIST" }];
        const ids = list
          .map((row) => (row?.id ? { type: "UserItem", id: String(row.id) } : null))
          .filter(Boolean);
        return [{ type: "UserItem", id: "LIST" }, ...ids];
      },
    }),
    getUserItemById: builder.query({
      query: (id) => `../user-item/${id}`,
      providesTags: (res, err, id) => [{ type: "UserItem", id: String(id) }],
    }),
    getUserItemsByUser: builder.query({
      query: () => "../user-item/by-user",
      providesTags: [{ type: "UserItem", id: "LIST" }],
    }),
    createUserItem: builder.mutation({
      query: (body) => ({ url: "../user-item", method: "POST", body }),
      invalidatesTags: [{ type: "UserItem", id: "LIST" }],
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
  useGetUserItemsQuery,
  useGetUserItemByIdQuery,
  useGetUserItemsByUserQuery,
  useCreateUserItemMutation,
} = marketApi;