import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const developerAndPublisherApi = createApi({
  reducerPath: "developerAndPublisherApi",
  baseQuery: baseQueryWithRefresh("/developer-and-publisher/"),
  tagTypes: ["DeveloperAndPublisher"],
  endpoints: (builder) => ({
    getAllDevelopersAndPublishers: builder.query({
      query: () => "",
      providesTags: ["DeveloperAndPublisher"],
    }),
    getByIdDeveloperAndPublisher: builder.query({
      query: (id) => `${id}`,
      providesTags: ["DeveloperAndPublisher"],
    }),
    createDeveloperAndPublisher: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DeveloperAndPublisher"],
    }),
    updateDeveloperAndPublisher: builder.mutation({
      query: (data) => ({
        url: `${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DeveloperAndPublisher"],
    }),
    deleteDeveloperAndPublisher: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeveloperAndPublisher"],
    }),
  }),
});

export const {
  useGetAllDevelopersAndPublishersQuery,
  useGetByIdDeveloperAndPublisherQuery,
  useCreateDeveloperAndPublisherMutation,
  useUpdateDeveloperAndPublisherMutation,
  useDeleteDeveloperAndPublisherMutation,
} = developerAndPublisherApi;
