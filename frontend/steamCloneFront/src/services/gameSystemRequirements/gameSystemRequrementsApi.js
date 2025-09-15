import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

export const gameSystemRequirementsApi = createApi({
  reducerPath: "gameSystemRequirementsApi",
  baseQuery: baseQueryWithRefresh("/game/system-requirements/"),
  tagTypes: ["GameSystemRequirements"],
  endpoints: (builder) => ({
    createSystemRequirement: builder.mutation({
      query: (systemRequirementData) => ({
        url: "",
        method: "POST",
        body: systemRequirementData,
      }),
      invalidatesTags: ["GameSystemRequirements"],
    }),
    updateSystemRequirement: builder.mutation({
      query: (systemRequirementData) => ({
        url: `${systemRequirementData.id}`,
        method: "PUT",
        body: systemRequirementData,
      }),
      invalidatesTags: ["GameSystemRequirements"],
    }),
    deleteSystemRequirement: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GameSystemRequirements"],
    }),
    getPlatformsEnums: builder.query({
      query: () => "platforms-enums",
      providesTags: ["GameSystemRequirements"],
    }),
    getRequiremetntTypesEnums: builder.query({
      query: () => "requirement-types-enums",
      providesTags: ["GameSystemRequirements"],
    }),
  }),
});

export const {
  useCreateSystemRequirementMutation,
  useUpdateSystemRequirementMutation,
  useDeleteSystemRequirementMutation,
  useGetPlatformsEnumsQuery,
  useGetRequiremetntTypesEnumsQuery,
} = gameSystemRequirementsApi;
