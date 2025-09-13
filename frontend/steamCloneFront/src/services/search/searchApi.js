import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: baseQueryWithRefresh("/game/"),
  tagTypes: ["Search"],
  endpoints: (builder) => ({
    getAllForSearch: builder.query({
      query: () => "",
      providesTags: ["Search"],
    }),
  }),
});

export const { useGetAllForSearchQuery } = searchApi;