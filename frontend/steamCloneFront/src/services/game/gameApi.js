import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};
export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_ENV.API_URL}game/`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Game"],
  endpoints: (builder) => ({
    getGameById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["Game"],
    }),
    buyGame: builder.mutation({
      query: (gameId) => ({
        url: `buy/${gameId}`,
        method: "POST",
      }),
      invalidatesTags: ["Game"],
    }),
  }),
});

export const { useGetGameByIdQuery, useBuyGameMutation } = gameApi;
