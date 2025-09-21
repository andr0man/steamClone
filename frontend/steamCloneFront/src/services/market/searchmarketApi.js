import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const searchmarketApi = createApi({
  reducerPath: "searchmarketApi",
  baseQuery: baseQueryWithRefresh("/"),
  endpoints: (builder) => ({
    searchMarketItems: builder.query({
      query: ({ q, game, tags, sort, page, size } = {}) => {
        const params = {};
        if (q) params.search = q;
        if (game) params.game = game;
        if (tags && tags.length) params.tags = tags.join(",");
        if (sort) params.sort = sort;
        if (page != null) params.page = page;
        if (size != null) params.size = size;
        return { url: `market-item`, params };
      },
    }),
    searchGames: builder.query({
      query: (q) => ({ url: `Game`, params: q ? { search: q } : {} }),
    }),
  }),
});

export const { useSearchMarketItemsQuery, useSearchGamesQuery } = searchmarketApi;