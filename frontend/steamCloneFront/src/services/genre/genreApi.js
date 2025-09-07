import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const genreApi = createApi({
  reducerPath: "genreApi",
  baseQuery: baseQueryWithRefresh("/game-genre/"),
  tagTypes: ["Genre"],
  endpoints: (builder) => ({
    getAllGenres: builder.query({
      query: () => "",
      providesTags: ["Genre"],
    }),
    // create body
    // {
    //   "name": "string",
    //   "description": "string"
    // }
    createGenre: builder.mutation({
      query: (genreData) => ({
        url: "",
        method: "POST",
        body: genreData,
      }),
      invalidatesTags: ["Genre"],
    }),
    getGenreById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["Genre"],
    }),
    // update body
    // {
    //   "name": "string",
    //   "description": "string"
    // }
    updateGenre: builder.mutation({
      query: (genreData) => ({
        url: `${genreData.id}`,
        method: "PUT",
        body: genreData,
      }),
      invalidatesTags: ["Genre"],
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Genre"],
    }),
  }),
});

export const {
  useGetAllGenresQuery,
  useCreateGenreMutation,
  useGetGenreByIdQuery,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
