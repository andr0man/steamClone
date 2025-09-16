import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithRefresh(),
  tagTypes: ["Profile", "Users"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/Users/profile",
      providesTags: [{ type: "Profile", id: "ME" }],
    }),
    getBalance: builder.query({
      query: () => "/Users/balance",
      providesTags: [{ type: "Profile", id: "BALANCE" }],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/Users/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    getUserById: builder.query({
      query: (id) => `/Users/${id}`,
      providesTags: (res, err, id) => [{ type: "Users", id: String(id) }],
    }),
    getUserByEmail: builder.query({
      query: (email) => `/Users/by-email/${encodeURIComponent(email)}`,
    }),
    getUserByNickname: builder.query({
      query: (nickname) => `/Users/by-nickname/${encodeURIComponent(nickname)}`,
    }),
    getAllUsers: builder.query({
      query: () => "/Users",
      providesTags: (res) => {
        const list = res?.payload ?? res ?? [];
        if (!Array.isArray(list)) return [{ type: "Users", id: "LIST" }];
        const ids = list
          .map((u) => (u?.id ? { type: "Users", id: String(u.id) } : null))
          .filter(Boolean);
        return [{ type: "Users", id: "LIST" }, ...ids];
      },
    }),
    getUsersPaged: builder.query({
      query: ({ page = 1, pageSize = 10 }) =>
        `/Users/paged?page=${page}&pageSize=${pageSize}`,
      providesTags: [{ type: "Users", id: "PAGED" }],
    }),
    getUsersByRole: builder.query({
      query: (role) => `/Users/role/${role}`,
      providesTags: [{ type: "Users", id: "ROLE" }],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/Users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/Users",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (res, err, body) => {
        const id = body?.id || body?.userId;
        return id
          ? [{ type: "Users", id: String(id) }, { type: "Users", id: "LIST" }]
          : [{ type: "Users", id: "LIST" }];
      },
    }),
    updateUserPut: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/Users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Users", id: String(id) },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/Users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Users", id: String(id) },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetBalanceQuery,
  useUploadAvatarMutation,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useGetUserByNicknameQuery,
  useGetAllUsersQuery,
  useGetUsersPagedQuery,
  useGetUsersByRoleQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserPutMutation,
  useDeleteUserMutation,
} = profileApi;