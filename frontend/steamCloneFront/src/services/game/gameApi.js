import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env"

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
}
export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: APP_ENV.REMOTE_API_URL,
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
      query: (id) => `game/${id}`,
    }),
  }),
});

export const { useGetGameByIdQuery } = gameApi;
