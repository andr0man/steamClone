import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import APP_ENV from "../../env";

export const baseQueryWithRefresh = (endpointPrefix = "") => {
  const baseUrl = APP_ENV.API_URL;
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

  return async (args, api, extraOptions) => {
    // Додаємо префікс до url
    // debugger;
    let modifiedArgs = args;
    if (typeof args === "string") {
      modifiedArgs = endpointPrefix + args;
    } else if (typeof args === "object") {
      modifiedArgs = { ...args, url: endpointPrefix + args.url };
    }

    let result = await rawBaseQuery(modifiedArgs, api, extraOptions);

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

        result = await rawBaseQuery(modifiedArgs, api, extraOptions);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    return result;
  };
};
