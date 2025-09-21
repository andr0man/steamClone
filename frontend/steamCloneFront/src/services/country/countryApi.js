import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: baseQueryWithRefresh("/country/"),
  tagTypes: ["Country"],
  endpoints: (builder) => ({
    getAllCountrys: builder.query({
      query: () => "",
      providesTags: ["Country"],
    }),
    createCountry: builder.mutation({
      query: (countryData) => ({
        url: "",
        method: "POST",
        body: countryData,
      }),
      invalidatesTags: ["Country"],
    }),
    getCountryById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["Country"],
    }),
    updateCountry: builder.mutation({
      query: (countryData) => ({
        url: `${countryData.id}`,
        method: "PUT",
        body: countryData,
      }),
      invalidatesTags: ["Country"],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Country"],
    }),
  }),
});

export const {
  useGetAllCountrysQuery,
  useCreateCountryMutation,
  useGetCountryByIdQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countryApi;
