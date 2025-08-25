import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_APP_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
export const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  
  if (result?.error?.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return result;

    
    const refreshResult = await rawBaseQuery(
      {
        url: "/account/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.payload?.accessToken) {
      const newAccessToken = refreshResult.data.payload.accessToken;

      localStorage.setItem("accessToken", newAccessToken);

      
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};