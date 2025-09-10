import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const languageApi = createApi({
  reducerPath: "languageApi",
  baseQuery: baseQueryWithRefresh("/language/"),
  tagTypes: ["Language"],
  endpoints: (builder) => ({
    getAllLanguages: builder.query({
      query: () => "",
      providesTags: ["Language"],
    }),
    createLanguage: builder.mutation({
      query: (languageData) => ({
        url: "",
        method: "POST",
        body: languageData,
      }),
      invalidatesTags: ["Language"],
    }),
    getLanguageById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["Language"],
    }),
    updateLanguage: builder.mutation({
      query: (languageData) => ({
        url: `${languageData.id}`,
        method: "PUT",
        body: languageData,
      }),
      invalidatesTags: ["Language"],
    }),
    deleteLanguage: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Language"],
    }),
  }),
});

export const {
  useGetAllLanguagesQuery,
  useCreateLanguageMutation,
  useGetLanguageByIdQuery,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
} = languageApi;
