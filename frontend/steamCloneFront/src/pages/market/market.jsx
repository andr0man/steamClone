import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./market.scss";
import Notification from "../../components/Notification";
import { Search as SearchIcon, ChevronDown, X } from "lucide-react";
import {
  useGetMarketItemsQuery,
  useGetUserItemsQuery,
} from "../../services/market/marketApi";
import { useGetAllGamesQuery } from "../../services/game/gameApi";

const mapMarketItems = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const marketId = row?.id ?? row?.marketItemId ?? row?.market?.id;
    const i = row?.item ?? row?.marketItem?.item ?? row?.itemDto ?? {};
    const price = Number(row?.price ?? i?.price ?? i?.priceUAH ?? 0);
    const gameObj = i?.game ?? i?.gameDto ?? {};
    const gameId = i?.gameId ?? gameObj?.id ?? row?.gameId ?? null;
    const userItemId = row?.userItemId ?? row?.userItem?.id ?? null;
    const gameName =
      gameObj?.name ??
      i?.game?.name ??
      i?.gameName ??
      i?.game ??
      row?.gameName ??
      "Unknown";
    const baseName =
      i?.name ??
      i?.title ??
      row?.itemName ??
      row?.name ??
      "Item";
    const genres = Array.isArray(gameObj?.genres)
      ? gameObj.genres.map((g) => g?.name).filter(Boolean)
      : Array.isArray(i?.genres)
      ? i.genres.map((g) => (typeof g === "string" ? g : g?.name)).filter(Boolean)
      : Array.isArray(i?.tags)
      ? i.tags.map((t) => (typeof t === "string" ? t : t?.name)).filter(Boolean)
      : [];
    const tags = Array.from(new Set([...(genres || []), baseName].filter(Boolean)));
    const status = String(row?.status ?? i?.status ?? "available").toLowerCase();
    return {
      id: marketId,
      itemId: i?.id ?? row?.itemId ?? null,
      userItemId,
      gameId,
      name: baseName,
      game: gameName,
      tags,
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

const MarketItemModal = ({ open, item, onClose, onGoToBuy }) => {
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
                disabled={!item.available}
                onClick={onGoToBuy}
                title={item.available ? "Go to checkout" : "Sold"}
              >
                Go to checkout
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
  const { data: gamesRes } = useGetAllGamesQuery();
  const {
    data: userItemsRes,
    isFetching: userItemsLoading,
    isError: userItemsIsError,
    error: userItemsError,
    refetch: refetchUserItems,
  } = useGetUserItemsQuery();

  const gamesFromApi = useMemo(() => {
    const list = gamesRes?.payload ?? gamesRes ?? [];
    if (!Array.isArray(list)) return [];
    const names = list.map((g) => g?.name ?? g?.title ?? g?.gameName ?? null).filter(Boolean);
    return Array.from(new Set(names));
  }, [gamesRes]);

  const gameNameById = useMemo(() => {
    const list = gamesRes?.payload ?? gamesRes ?? [];
    const map = new Map();
    if (Array.isArray(list)) {
      list.forEach((g) => {
        const id = g?.id;
        const nm = g?.name ?? g?.title ?? g?.gameName ?? null;
        if (id && nm) map.set(id, nm);
      });
    }
    return map;
  }, [gamesRes]);

  const userItemByUserItemId = useMemo(() => {
    const list = userItemsRes?.payload ?? userItemsRes ?? [];
    const map = new Map();
    if (Array.isArray(list)) {
      list.forEach((row) => {
        if (row?.id && row?.item) {
          map.set(row.id, {
            itemId: row.item.id,
            name: row.item.name,
            imageUrl: row.item.imageUrl,
            gameId: row.item.gameId,
          });
        }
      });
    }
    return map;
  }, [userItemsRes]);

  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [gameSearch, setGameSearch] = useState("");
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(null);

  const itemsBase = useMemo(() => mapMarketItems(data), [data]);

  const items = useMemo(() => {
    const enriched = itemsBase.map((it) => {
      const extra = it.userItemId ? userItemByUserItemId.get(it.userItemId) : null;
      const nextGameId = extra?.gameId ?? it.gameId;
      const nextGameName = nextGameId ? gameNameById.get(nextGameId) ?? it.game : it.game;
      return {
        ...it,
        itemId: extra?.itemId ?? it.itemId,
        name: extra?.name ?? it.name,
        imageUrl: extra?.imageUrl ?? it.imageUrl,
        gameId: nextGameId,
        game: nextGameName,
      };
    });
    return enriched;
  }, [itemsBase, userItemByUserItemId, gameNameById]);

  const gamesDerivedFromItems = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.game).filter(Boolean)));
  }, [items]);

  const gamesForFilter = useMemo(() => {
    if (gamesFromApi.length) return gamesFromApi;
    return gamesDerivedFromItems;
  }, [gamesFromApi, gamesDerivedFromItems]);

  const dynamicGameList = useMemo(() => {
    const base = gamesForFilter.slice();
    const s = gameSearch.trim().toLowerCase();
    return s ? base.filter((n) => n.toLowerCase().includes(s)) : base;
  }, [gameSearch, gamesForFilter]);

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
    if (selectedGame !== "All Games") {
      list = list.filter((i) => (i.game || "").toLowerCase() === selectedGame.toLowerCase());
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
  }, [items, q, selectedGame, sortBy]);

  const goToCheckout = (it) => {
    try { sessionStorage.setItem("BUY_ITEM_CACHE", JSON.stringify(it)); } catch {}
    navigate("/market/buy", { state: { item: it } });
  };

  return (
    <div className="market-page-container">
      <Notification
        message={
          apiError ||
          (userItemsIsError ? userItemsError?.data?.message || userItemsError?.error || "Failed to load user items" : null) ||
          (isError ? error?.data?.message || error?.error || "Failed to load market items" : null)
        }
        type="error"
        onClose={() => setApiError(null)}
      />

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
            {dynamicGameList.slice(0, 20).map((name) => (
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
                    const found = dynamicGameList[0];
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

        <div className="mk-panel mk-records">
          <ul className="records">
            <li>
              <button type="button" onClick={() => navigate("/market/history")}>
                My buy records
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
              <button
                className="price-badge"
                style={{ padding: "8px 10px" }}
                onClick={() => {
                  refetch();
                  refetchUserItems();
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="market-sub">
            Trade, buy and sell unique in-game items with the Flux community
          </div>

          {isFetching || userItemsLoading ? (
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
                        src={item.imageUrl || "/common/itemNoImage.png"}
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
                      disabled={!item.available}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToCheckout(item);
                      }}
                      title={item.available ? "Go to checkout" : "Sold"}
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
        onGoToBuy={() => {
          if (preview) {
            goToCheckout(preview);
          }
        }}
      />
    </div>
  );
};

export default Market;