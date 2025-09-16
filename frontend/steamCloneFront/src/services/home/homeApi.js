import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../api/baseQueryWithRefresh";

const num = (v) => (v == null ? null : Number(v));

const normalize = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const g = row?.game ?? row?.gameDto ?? row?.gameDetails ?? row;
    return {
      id: String(g?.slug ?? g?.id ?? row?.gameId ?? row?.id ?? ""),
      title: g?.name ?? g?.title ?? "Game",
      imageUrl:
        g?.coverImageUrl ??
        g?.coverImage ??
        (Array.isArray(g?.screenshots) ? g.screenshots[0] : null) ??
        null,
      basePrice: num(g?.originalPrice ?? g?.basePrice ?? g?.standardPrice ?? g?.price),
      finalPrice: num(g?.finalPrice ?? g?.price),
      discountPercent: num(g?.discountPercent),
      isFree: Boolean(g?.isFree ?? (Number(g?.finalPrice ?? g?.price) === 0)),
      releaseDate: g?.releaseDate ?? g?.createdAt ?? g?.publishDate ?? null,
      popularity: num(g?.popularity ?? g?.sales ?? g?.rating) ?? 0,
      genres: Array.isArray(g?.genres) ? g.genres.map((x) => x?.name ?? x) : [],
    };
  });
};

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: baseQueryWithRefresh("/game/"),
  tagTypes: ["Home"],
  endpoints: (builder) => ({
    getHomeFeed: builder.query({
      query: () => "",
      transformResponse: (resp) => normalize(resp),
      providesTags: ["Home"],
    }),
  }),
});

export const { useGetHomeFeedQuery } = homeApi;