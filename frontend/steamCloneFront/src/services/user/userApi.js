import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createBaseQueryWithRefresh(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    getUserByEmail: builder.query({
      query: (email) => `/users/by-email/${email}`,
    }),

    getUserByNickname: builder.query({
      query: (nickname) => `/users/by-nickname/${nickname}`,
    }),

    getAllUsers: builder.query({
      query: () => `/users`,
      providesTags: ["User"],
    }),

    getPagedUsers: builder.query({
      query: ({ page = 1, pageSize = 10 }) => `/users/paged?page=${page}&pageSize=${pageSize}`,
    }),

    getUsersByRole: builder.query({
      query: (role) => `/users/role/${role}`,
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetProfileQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useGetUserByNicknameQuery,
  useGetAllUsersQuery,
  useGetPagedUsersQuery,
  useGetUsersByRoleQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadAvatarMutation
} = userApi;