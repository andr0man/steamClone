import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./market.scss";
import Notification from "../../components/Notification";
import { Search as SearchIcon, ChevronDown, X } from "lucide-react";
import {
  useGetMarketItemsQuery,
  useBuyMarketItemMutation,
} from "../../services/market/marketApi";
import { useGetAllGamesQuery } from "../../services/game/gameApi";
import { useGetAllGenresQuery } from "../../services/genre/genreApi";

const mapMarketItems = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const marketId = row?.id ?? row?.marketItemId ?? row?.market?.id;
    const i = row?.item ?? row?.marketItem?.item ?? row?.itemDto ?? {};
    const price = Number(row?.price ?? i?.price ?? i?.priceUAH ?? 0);
    const gameObj = i?.game ?? i?.gameDto ?? {};
    const gameName = gameObj?.name ?? i?.game?.name ?? i?.gameName ?? i?.game ?? "Unknown";
    const genres = Array.isArray(gameObj?.genres)
      ? gameObj.genres.map((g) => g?.name).filter(Boolean)
      : Array.isArray(i?.genres)
      ? i.genres.map((g) => (typeof g === "string" ? g : g?.name)).filter(Boolean)
      : Array.isArray(i?.tags)
      ? i.tags.map((t) => (typeof t === "string" ? t : t?.name)).filter(Boolean)
      : [];
    const status = String(row?.status ?? i?.status ?? "available").toLowerCase();
    return {
      id: marketId,
      name: i?.name ?? i?.title ?? "Item",
      game: gameName,
      tags: genres,
      priceUAH: price,
      imageUrl: i?.imageUrl ?? i?.iconUrl ?? "/common/itemNoImage.png",
      available: status !== "sold" && status !== "inactive",
    };
  });
};

const formatUAH = (n) => {
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${Number(n ?? 0).toLocaleString("uk-UA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}₴`;
};

const DEFAULT_CATEGORIES = ["Action", "Adventure", "Indie", "RPG", "Shooter", "Casual"];

const MarketItemModal = ({ open, item, onClose, onBuy, buying = false }) => {
  if (!open || !item) return null;
  return (
    <div className="market-modal" role="dialog" aria-modal="true">
      <div className="market-modal-card">
        <button className="x" onClick={onClose} title="Close">
          <X size={18} />
        </button>
        <div className="mm-body">
          <div className="mm-left">
            <div className="thumb">
              <img src={item.imageUrl || "/common/itemNoImage.png"} alt={item.name} />
            </div>
          </div>
          <div className="mm-right">
            <div className="name" title={item.name}>{item.name}</div>
            <div className="sub">
              <span className="game">{item.game}</span>
              {item.tags?.length ? (
                <>
                  <span className="dot">•</span>
                  <span className="tags">{item.tags.join(", ")}</span>
                </>
              ) : null}
            </div>
            <div className="price-line">
              <span className="price">{formatUAH(item.priceUAH)}</span>
              {!item.available && <span className="sold">Sold / Not available</span>}
            </div>
            <div className="actions">
              <button className="ghost" onClick={onClose}>Close</button>
              <button
                className="price-badge"
                disabled={!item.available || buying}
                onClick={onBuy}
                title={item.available ? "Buy now" : "Sold"}
              >
                {buying ? "Buying…" : `Buy for ${formatUAH(item.priceUAH)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Market = () => {
  const navigate = useNavigate();
  const { data, isFetching, isError, error, refetch } = useGetMarketItemsQuery();
  const [buyMarketItem, { isLoading: buying }] = useBuyMarketItemMutation();
  const { data: gamesRes, isFetching: gamesLoading } = useGetAllGamesQuery();
  const { data: genresRes } = useGetAllGenresQuery();

  const items = useMemo(() => mapMarketItems(data), [data]);

  const gamesFromApi = useMemo(() => {
    const list = gamesRes?.payload ?? gamesRes ?? [];
    if (!Array.isArray(list)) return [];
    const names = list.map((g) => g?.name ?? g?.title ?? g?.gameName ?? null).filter(Boolean);
    return Array.from(new Set(names));
  }, [gamesRes]);

  const gamesForFilter = useMemo(() => {
    const derived = Array.from(new Set(items.map((i) => i.game).filter(Boolean)));
    return gamesFromApi.length ? gamesFromApi : derived;
  }, [gamesFromApi, items]);

  const genresFromApi = useMemo(() => {
    const list = genresRes?.payload ?? genresRes ?? [];
    if (!Array.isArray(list)) return [];
    return list.map((g) => g?.name ?? g?.title ?? null).filter(Boolean);
  }, [genresRes]);

  const tagsFromItems = useMemo(() => {
    const bag = new Set();
    for (const it of items) {
      for (const t of it.tags || []) if (t) bag.add(t);
    }
    return Array.from(bag);
  }, [items]);

  const categoriesForFilter = useMemo(() => {
    if (genresFromApi.length) return genresFromApi;
    if (tagsFromItems.length) return tagsFromItems;
    return DEFAULT_CATEGORIES;
  }, [genresFromApi, tagsFromItems]);

  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [gameSearch, setGameSearch] = useState("");
  const [tagFilters, setTagFilters] = useState(new Set());
  const [customTag, setCustomTag] = useState("");
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [preview, setPreview] = useState(null);

  const filteredGames = useMemo(() => {
    const base = gamesForFilter.slice();
    const s = gameSearch.trim().toLowerCase();
    return s ? base.filter((n) => n.toLowerCase().includes(s)) : base;
  }, [gamesForFilter, gameSearch]);

  const toggleSet = (s, v) => {
    const next = new Set(s);
    next.has(v) ? next.delete(v) : next.add(v);
    return next;
  };

  const processed = useMemo(() => {
    let list = items.slice();
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (i) =>
          (i.name || "").toLowerCase().includes(s) ||
          (i.game || "").toLowerCase().includes(s) ||
          (i.tags || []).some((t) => (t || "").toLowerCase().includes(s))
      );
    }
    if (selectedGame !== "All Games") list = list.filter((i) => i.game === selectedGame);
    if (tagFilters.size) {
      list = list.filter((i) => {
        const tags = (i.tags || []).map((t) => (t || "").toLowerCase());
        for (const sel of tagFilters) if (tags.includes(String(sel).toLowerCase())) return true;
        return false;
      });
    }
    if (sortBy === "price_asc") list.sort((a, b) => (a.priceUAH || 0) - (b.priceUAH || 0));
    if (sortBy === "price_desc") list.sort((a, b) => (b.priceUAH || 0) - (a.priceUAH || 0));
    if (sortBy === "name_asc") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sortBy === "name_desc") list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    if (sortBy === "relevance" && s) {
      list.sort((a, b) => {
        const ai = (a.name || "").toLowerCase().indexOf(s);
        const bi = (b.name || "").toLowerCase().indexOf(s);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
    }
    return list;
  }, [items, q, selectedGame, tagFilters, sortBy]);

  const onBuy = async (marketItemId, displayName, price) => {
    setApiError(null);
    setApiSuccess(null);
    try {
      await buyMarketItem({ marketItemId }).unwrap();
      setApiSuccess(`Purchased "${displayName}" for ${formatUAH(price)}`);
      setPreview(null);
      refetch();
    } catch (e) {
      setApiError(e?.data?.message || e?.error || "Purchase failed");
    }
  };

  return (
    <div className="market-page-container">
      <Notification
        message={
          apiError ||
          (isError ? error?.data?.message || "Failed to load market items" : null)
        }
        type="error"
        onClose={() => setApiError(null)}
      />
      <Notification message={apiSuccess} type="success" onClose={() => setApiSuccess(null)} />

      <aside className="market-left">
        <div className="mk-panel mk-search">
          <div className="mk-input">
            <input
              type="text"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
            <SearchIcon size={18} className="ico" />
          </div>
          <span className="mk-underline" />
        </div>

        <div className="mk-panel mk-filter-game">
          <div className="mk-title">Filter by game</div>
          <span className="mk-underline" />
          <div className="game-list">
            {(gamesLoading ? [] : filteredGames).slice(0, 20).map((name) => (
              <button
                type="button"
                key={name}
                className={`game-row ${selectedGame === name ? "active" : ""}`}
                onClick={() => setSelectedGame(name)}
                title={name}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    background: "#222",
                    borderRadius: 4,
                    display: "grid",
                    placeItems: "center",
                    color: "#bbb",
                    fontSize: 12,
                  }}
                >
                  {name?.[0] || "G"}
                </div>
                <span>{name}</span>
              </button>
            ))}
          </div>

          <div className="mk-enter-game">
            <div className="mk-input small">
              <input
                type="text"
                placeholder="Enter game name"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const found = filteredGames[0];
                    if (found) setSelectedGame(found);
                    e.currentTarget.blur();
                  }
                }}
              />
              <SearchIcon size={16} className="ico" />
            </div>
            <span className="mk-underline small" />
          </div>
        </div>

        <div className="mk-panel mk-tags-panel">
          <div className="mk-title">Filter by category</div>
          <span className="mk-underline" />
          <div className="mk-checks">
            {categoriesForFilter.slice(0, 15).map((t) => (
              <label key={t} className="mk-check">
                <input
                  type="checkbox"
                  checked={tagFilters.has(t)}
                  onChange={() => setTagFilters((prev) => toggleSet(prev, t))}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          <div className="mk-enter-game" style={{ marginTop: 10 }}>
            <div className="mk-input small">
              <input
                type="text"
                placeholder="Enter category name"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = e.currentTarget.value.trim();
                    if (val) setTagFilters((prev) => toggleSet(prev, val));
                    setCustomTag("");
                    e.currentTarget.blur();
                  }
                }}
              />
              <SearchIcon size={16} className="ico" />
            </div>
            <span className="mk-underline small" />
          </div>
        </div>

        <div className="mk-panel mk-records">
          <ul className="records">
            <li>
              <button type="button" onClick={() => navigate("/market/history?tab=sell")}>
                My sell records
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate("/market/history?tab=buy")}>
                My buy records
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate("/market/history?tab=hold")}>
                My items on hold
              </button>
            </li>
            <li className="accent">
              <button type="button" onClick={() => navigate("/market/sell")}>Sell an item</button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="market-right">
        <section className="mk-panel mk-market">
          <div className="market-head">
            <div className="h-left">Market</div>
            <div className="h-right">
              <span>Sort by:</span>
              <div className="sort-select">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort items"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A - Z</option>
                  <option value="name_desc">Name: Z - A</option>
                </select>
                <ChevronDown size={16} className="chev" />
              </div>
              <button className="price-badge" style={{ padding: "8px 10px" }} onClick={() => refetch()}>
                Refresh
              </button>
            </div>
          </div>

          <div className="market-sub">
            Trade, buy and sell unique in-game items with the Flux community
          </div>

          {isFetching ? (
            <div className="market-inline-loader">
              <div className="spinner-small" />
              Loading…
            </div>
          ) : (
            <div className="market-list">
              {processed.length ? (
                processed.map((item) => (
                  <div
                    key={item.id}
                    className={`list-row ${!item.available ? "sold" : ""}`}
                    onClick={() => setPreview(item)}
                    title="Open details"
                  >
                    <div className="icon-wrap">
                      <img
                        src={
                          item.imageUrl ||
                          "https://via.placeholder.com/64/1c232c/ffffff?text=?"
                        }
                        alt={item.name}
                      />
                    </div>
                    <div className="meta">
                      <div className="name" title={item.name}>
                        {item.name}
                      </div>
                      <div className="game">{item.game}</div>
                    </div>
                    <div className="spacer" />
                    <button
                      type="button"
                      className="price-badge"
                      disabled={!item.available || buying}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuy(item.id, item.name, item.priceUAH);
                      }}
                      title={item.available ? "Buy now" : "Sold"}
                    >
                      {formatUAH(item.priceUAH)}
                    </button>
                  </div>
                ))
              ) : (
                <div className="market-empty">No items for current selection</div>
              )}
            </div>
          )}
        </section>
      </main>

      <MarketItemModal
        open={!!preview}
        item={preview}
        onClose={() => setPreview(null)}
        buying={buying}
        onBuy={() => preview && onBuy(preview.id, preview.name, preview.priceUAH)}
      />
    </div>
  );
};

export default Market;