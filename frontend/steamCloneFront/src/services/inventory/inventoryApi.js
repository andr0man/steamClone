import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

const provideList = (type, res) => {
  const list = res?.payload ?? res ?? [];
  if (!Array.isArray(list)) return [{ type, id: "LIST" }];
  const ids = list
    .map((row) => {
      const id =
        row?.id ??
        row?.itemId ??
        row?.gameId ??
        row?.item?.id ??
        row?.userItemId;
      return id ? { type, id: String(id) } : null;
    })
    .filter(Boolean);
  return [{ type, id: "LIST" }, ...ids];
};

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQueryWithRefresh(),
  tagTypes: ["UserItems", "Items", "MarketItems"],
  endpoints: (builder) => ({
    getUserItems: builder.query({
      query: () => "/user-item",
      providesTags: (res) => provideList("UserItems", res),
    }),
    getUserItemsByUser: builder.query({
      query: () => "/user-item/by-user",
      providesTags: (res) => provideList("UserItems", res),
    }),
    getUserItemById: builder.query({
      query: (id) => `/user-item/${id}`,
      providesTags: (res, err, id) => [{ type: "UserItems", id: String(id) }],
    }),
    createUserItem: builder.mutation({
      query: (body) => ({
        url: "/user-item",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "UserItems", id: "LIST" }],
    }),

    getItems: builder.query({
      query: () => "/item",
      providesTags: (res) => provideList("Items", res),
    }),
    getItemById: builder.query({
      query: (id) => `/item/${id}`,
      providesTags: (res, err, id) => [{ type: "Items", id: String(id) }],
    }),
    createItem: builder.mutation({
      query: (body) => ({
        url: "/item",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/item/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Items", id: String(id) },
        { type: "Items", id: "LIST" },
      ],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Items", id: String(id) },
        { type: "Items", id: "LIST" },
      ],
    }),
    updateItemImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/item/update-image/${id}`,
        method: "PATCH",
        body: formData, // FormData (file)
      }),
      invalidatesTags: (res, err, { id }) => [{ type: "Items", id: String(id) }],
    }),

    getMarketItems: builder.query({
      query: () => "/market-item",
      providesTags: (res) => provideList("MarketItems", res),
    }),
    getMarketItemHistory: builder.query({
      query: () => "/market-item/history",
      providesTags: [{ type: "MarketItems", id: "HISTORY" }],
    }),
    getMarketItemById: builder.query({
      query: (id) => `/market-item/${id}`,
      providesTags: (res, err, id) => [{ type: "MarketItems", id: String(id) }],
    }),
    deleteMarketItem: builder.mutation({
      query: (id) => ({
        url: `/market-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MarketItems", id: "LIST" },
        { type: "MarketItems", id: "HISTORY" },
      ],
    }),
    putUpForSale: builder.mutation({
      query: (body) => ({
        url: "/market-item/put-up-for-sale",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "MarketItems", id: "LIST" },
        { type: "MarketItems", id: "HISTORY" },
        { type: "UserItems", id: "LIST" },
      ],
    }),
    buyMarketItem: builder.mutation({
      query: (body) => ({
        url: "/market-item/buy",
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        { type: "MarketItems", id: "LIST" },
        { type: "MarketItems", id: "HISTORY" },
        { type: "UserItems", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserItemsQuery,
  useGetUserItemsByUserQuery,
  useGetUserItemByIdQuery,
  useCreateUserItemMutation,
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useUpdateItemImageMutation,
  useGetMarketItemsQuery,
  useGetMarketItemHistoryQuery,
  useGetMarketItemByIdQuery,
  useDeleteMarketItemMutation,
  usePutUpForSaleMutation,
  useBuyMarketItemMutation,
} = inventoryApi;