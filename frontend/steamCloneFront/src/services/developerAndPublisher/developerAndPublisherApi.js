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
    getAssociatedUsers: builder.query({
      query: (id) => `get-associated-users/${id}`,
      providesTags: ["DeveloperAndPublisher"],
    }),
    byAssociatedUser: builder.query({
      query: (isApproved) => `by-associated-user?isApproved=${isApproved}`,
      providesTags: ["DeveloperAndPublisher"],
    }),
    getWithoutApproval: builder.query({
      query: () => "get-without-approval",
      providesTags: ["DeveloperAndPublisher"],
    }),
    getIsOwner: builder.query({
      query: (id) => `is-owner/${id}`,
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
    associateUser: builder.mutation({
      query: ({ developerAndPublisherId, userId }) => ({
        url: `associate-user?developerAndPublisherId=${developerAndPublisherId}&userId=${userId}`,
        method: "PATCH"
      }),
      invalidatesTags: ["DeveloperAndPublisher"],
    }),
    removeAssociatedUser: builder.mutation({
      query: ({ developerAndPublisherId, userId }) => ({
        url: `remove-associated-user?developerAndPublisherId=${developerAndPublisherId}&userId=${userId}`,
        method: "PATCH"
      }),
      invalidatesTags: ["DeveloperAndPublisher"],
    }),
    approve: builder.mutation({
      query: ({ id, isApproved }) => ({
        url: `approve?id=${id}&isApproved=${isApproved}`,
        method: "PATCH"
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
  
  useGetIsOwnerQuery,
  useGetAssociatedUsersQuery,
  useAssociateUserMutation,
  useRemoveAssociatedUserMutation,
  useByAssociatedUserQuery,
  
  useGetWithoutApprovalQuery,
  useApproveMutation,
} = developerAndPublisherApi;
