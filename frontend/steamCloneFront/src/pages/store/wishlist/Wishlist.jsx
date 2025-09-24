import React, { useMemo, useState, useEffect } from "react";
import "./wishlist.scss";
import Notification from "../../../components/Notification";
import { Search as SearchIcon } from "lucide-react";
import {
  useGetWishlistByUserQuery,
  useRemoveFromWishlistMutation,
} from "../../../services/wishlist/wishlistApi";
import { useNavigate } from "react-router-dom";

const formatUAH = (n) => `${Math.round(n ?? 0)}₴`;
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
const addedLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = MONTHS_SHORT[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `Added on ${month} ${day}/${year}`;
};

const mapFromApi = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];

  return list.map((row) => {
    const g = row.game ?? row;
    const gameId = g?.id ?? row?.gameId ?? row?.id;

    const price = Number(g?.price ?? 0);
    const discountPercent = Number(g?.discount ?? 0);
    const finalPrice =
      discountPercent > 0 ? Math.round(price - (price * discountPercent) / 100) : price;

    return {
      id: gameId,
      title: g?.name ?? g?.title ?? "Game",
      year: g?.releaseDate ? new Date(g.releaseDate).getFullYear() : "—",
      added: row?.addedAt ?? row?.createdAt ?? null,
      imageUrl: g?.coverImageUrl ?? g?.coverImage ?? "/common/gameNoImage.png",
      priceUAH: price,
      discountPercent,
      finalPriceUAH: finalPrice,
    };
  });
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { data, isFetching, isError, error, refetch } = useGetWishlistByUserQuery();
  const [removeFromWishlist, { isLoading: removing, isSuccess: removeSuccess }] = useRemoveFromWishlistMutation();

  const items = useMemo(() => mapFromApi(data), [data]);

  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("personal");

  useEffect(() => {
    if (removeSuccess) refetch();
  }, [removeSuccess, refetch]);

  const filteredSorted = useMemo(() => {
    let list = items.slice();
    const s = q.trim().toLowerCase();

    if (s) list = list.filter((it) => (it.title || "").toLowerCase().includes(s));

    if (sortBy === "date") {
      list.sort((a, b) => new Date(b.added || 0) - new Date(a.added || 0));
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => (a.finalPriceUAH ?? 0) - (b.finalPriceUAH ?? 0));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (b.finalPriceUAH ?? 0) - (a.finalPriceUAH ?? 0));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return list;
  }, [items, q, sortBy]);

  const handleRemove = async (gameId) => {
    try {
      await removeFromWishlist(gameId).unwrap();
    } catch (e) {
      console.error("Remove error:", e);
    }
  };

  const goToGame = (id) => navigate(`/store/game/${id}`);

  const apiErrorText =
    isError ? error?.data?.message || "Failed to load wishlist. Try again." : null;

  return (
    <div className="wl-page">
      <Notification message={apiErrorText} type="error" onClose={() => {}} />

      <div className="wl-panel">
        <div className="wl-head">
          <div className="wl-title">Wishlist ({items.length})</div>

          <div className="wl-head-controls">
            <div className="wl-input">
              <input
                type="text"
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                aria-label="Search wishlist"
              />
              <SearchIcon size={18} className="ico" />
              <span className="wl-search-underline" />
            </div>

            <div className="wl-sort">
              <span>Sort by:</span>
              <button
                className={`plain-sort ${sortBy === "personal" ? "active" : ""}`}
                onClick={() => setSortBy("personal")}
                type="button"
              >
                Personal rank
              </button>
              <div className="sort-dropdown">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort wishlist"
                >
                  <option value="personal">Personal rank</option>
                  <option value="date">Date added</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="name_asc">Name: A → Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <span className="wl-underline" />

        {isFetching ? (
          <div className="wl-loading">
            <div className="spinner" />
            Loading your wishlist...
          </div>
        ) : filteredSorted.length ? (
          <div className="wl-list" role="list">
            {filteredSorted.map((g) => {
              const hasDiscount = Number.isFinite(g.discountPercent) && g.discountPercent > 0;
              const pct = hasDiscount ? Math.round(g.discountPercent) : 0;

              return (
                <div className="wl-row" key={g.id} role="listitem" aria-label={g.title}>
                  <img
                    className="thumb"
                    src={g.imageUrl || "/common/gameNoImage.png"}
                    alt={g.title || "Game cover"}
                    loading="lazy"
                    onClick={() => goToGame(g.id)}
                    style={{ cursor: "pointer" }}
                  />

                  <div className="meta">
                    <div
                      className="name"
                      title={g.title || "Untitled"}
                      onClick={() => goToGame(g.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {g.title || "Untitled"}
                    </div>
                    <div className="sub">
                      <span className="year">{g.year || "—"}</span>
                      <span className="dot">•</span>
                      <span className="added">{addedLabel(g.added)}</span>
                      <button
                        type="button"
                        className="remove"
                        onClick={() => handleRemove(g.id)}
                        disabled={removing}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="price-side" aria-label="Price">
                    {hasDiscount ? (
                      <>
                        <span className="pct-badge">-{pct}%</span>
                        <div className="price-box">
                          <span className="old">{formatUAH(g.priceUAH)}</span>
                          <span className="new">{formatUAH(g.finalPriceUAH)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="price-chip">{formatUAH(g.priceUAH)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="wl-empty">Your wishlist is empty.</div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;