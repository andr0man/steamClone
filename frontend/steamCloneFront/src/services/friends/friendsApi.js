// src/services/friends/friendsApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: baseQueryWithRefresh("/friends/"),
  tagTypes: ["Friends", "FriendRequests", "FriendsCount"],
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => "",
      providesTags: (res) => {
        const list = res?.payload ?? res ?? [];
        if (!Array.isArray(list)) return [{ type: "Friends", id: "LIST" }];
        const ids = list
          .map((f) => (f?.id ? { type: "Friends", id: String(f.id) } : null))
          .filter(Boolean);
        return [{ type: "Friends", id: "LIST" }, ...ids];
      },
    }),

    getFriendsCount: builder.query({
      query: () => "count",
      providesTags: [{ type: "FriendsCount", id: "COUNT" }],
    }),

    getRequestsSent: builder.query({
      query: () => "requests/sent",
      providesTags: [{ type: "FriendRequests", id: "SENT" }],
    }),

    getRequestsReceived: builder.query({
      query: () => "requests/received",
      providesTags: [{ type: "FriendRequests", id: "RECEIVED" }],
    }),

    sendFriendRequest: builder.mutation({
      query: (receiverId) => ({
        url: `send/${receiverId}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "FriendRequests", id: "SENT" },
        { type: "FriendRequests", id: "RECEIVED" },
        { type: "FriendsCount", id: "COUNT" },
      ],
    }),

    acceptFriendRequest: builder.mutation({
      query: (requestId) => ({
        url: `accept/${requestId}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Friends", id: "LIST" },
        { type: "FriendRequests", id: "SENT" },
        { type: "FriendRequests", id: "RECEIVED" },
        { type: "FriendsCount", id: "COUNT" },
      ],
    }),

    rejectFriendRequest: builder.mutation({
      query: (requestId) => ({
        url: `reject/${requestId}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "FriendRequests", id: "SENT" },
        { type: "FriendRequests", id: "RECEIVED" },
        { type: "FriendsCount", id: "COUNT" },
      ],
    }),

    deleteFriend: builder.mutation({
      query: (friendId) => ({
        url: `${friendId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Friends", id: "LIST" },
        { type: "FriendsCount", id: "COUNT" },
      ],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetFriendsCountQuery,
  useGetRequestsSentQuery,
  useGetRequestsReceivedQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useDeleteFriendMutation,
} = friendsApi;