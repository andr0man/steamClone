import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const getToken = () => {
 return token = localStorage.getItem("accessToken");
}

export const libraryApi = createApi({
    reducerPath: 'libraryApi',
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_APP_API_URL}),
    tagTypes: ["Library"],
    endpoints: (builder) => ({
        getLibrary: builder.query({
            query: () => ({
                url: 'UserGameLibrary/by-user',
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOTE0NjY3MS1iYTJiLTQxYzUtYjc2NC05YmE1MTkzNzg0NTYiLCJpZCI6IjMxZTZkZThkLTVmNTUtNDU0My1hYzQ2LTQyOWUxYWUzMGZiZiIsImVtYWlsIjoidXNlckBtYWlsLmNvbSIsIm5pY2tOYW1lIjoiVXNlciIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzU2NzE4NTM0LCJpc3MiOiJkYXNoYm9hcmQuY29tIiwiYXVkIjoiZGFzaGJvYXJkLmNvbSJ9.JwV9fXxQ5ryfdW2vN0SJYij1E5gs6atPw0O4Zsv_aVs"
                }
            }),
            providesTags: ["Library"]
        }),
        addGame: builder.mutation({
            query: (gameId) => ({
                url: 'Game/buy/' + gameId,
                method: 'POST',
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOTE0NjY3MS1iYTJiLTQxYzUtYjc2NC05YmE1MTkzNzg0NTYiLCJpZCI6IjMxZTZkZThkLTVmNTUtNDU0My1hYzQ2LTQyOWUxYWUzMGZiZiIsImVtYWlsIjoidXNlckBtYWlsLmNvbSIsIm5pY2tOYW1lIjoiVXNlciIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzU2NzE4NTM0LCJpc3MiOiJkYXNoYm9hcmQuY29tIiwiYXVkIjoiZGFzaGJvYXJkLmNvbSJ9.JwV9fXxQ5ryfdW2vN0SJYij1E5gs6atPw0O4Zsv_aVs"
                },
            }) ,
            invalidatesTags: ['Library']
        })
    })
});

export const { useGetLibraryQuery, useAddGameMutation } = libraryApi;