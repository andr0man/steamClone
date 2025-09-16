import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const marketHistoryApi = createApi({
  reducerPath: "marketHistoryApi",
  baseQuery: baseQueryWithRefresh("/market-item/"),
  tagTypes: ["MarketHistory"],
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: () => "history",
      transformResponse: (res) => res?.payload ?? res ?? [],
      providesTags: [{ type: "MarketHistory", id: "LIST" }],
    }),
  }),
});

export const { useGetHistoryQuery } = marketHistoryApi;