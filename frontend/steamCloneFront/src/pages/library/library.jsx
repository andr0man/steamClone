import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./library.scss";
import Notification from "../../components/Notification";
import { Search as SearchIcon } from "lucide-react";
import { useGetGameLibraryQuery } from "../../services/gameLibrary/gameLibraryApi";

const DEFAULT_TAGS = ["Indie", "Singleplayer", "Casual", "Action", "Adventure"];
const STATUS_LIST = ["Played", "Not played", "Non-installed"];

const LS_KEYS = { COL: "mock:collections" };

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const mapFromApi = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];

  return list.map((row) => {
    const g = row?.game ?? row?.gameDto ?? row?.gameDetails ?? row;
    return {
      id: g?.id ?? row?.gameId ?? row?.id,
      title: g?.name ?? g?.title ?? "Game",
      imageUrl: g?.coverImageUrl ?? g?.coverImage ?? "/common/gameNoImage.png",
      tags: Array.isArray(g?.genres) ? g.genres.map((x) => x?.name ?? x) : [],
      category:
        Array.isArray(g?.genres) && g.genres[0] ? g.genres[0].name : "General",
      isInstalled: false,
      hoursPlayed: row?.hoursPlayed ?? g?.hoursPlayed ?? 0,
      lastPlayed: row?.lastPlayed ?? g?.lastPlayed ?? null,
    };
  });
};

const shapeCollections = (rawList, library) => {
  const map = new Map(library.map((g) => [g.id, g]));
  return (rawList || []).map((c) => {
    const gameIds = Array.from(new Set(c.gameIds || []));
    const previewGames = gameIds.map((id) => map.get(id)).filter(Boolean).slice(0, 4);
    return {
      id: c.id,
      name: c.name,
      gameIds,
      gameCount: gameIds.length,
      previewGames,
    };
  });
};

const Library = () => {
  const navigate = useNavigate();
  const { data, isFetching: loading, isError, error } = useGetGameLibraryQuery();
  const games = useMemo(() => mapFromApi(data), [data]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilters, setTagFilters] = useState(new Set());
  const [statusFilters, setStatusFilters] = useState(new Set());

  const [rawCollections, setRawCollections] = useState([]);
  const collections = useMemo(() => shapeCollections(rawCollections, games), [rawCollections, games]);

  useEffect(() => {
    const raw = readLS(LS_KEYS.COL, []);
    setRawCollections(Array.isArray(raw) ? raw : []);
  }, []);

  const toggleSet = (setVal, value) => {
    const next = new Set(setVal);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const applyFilters = useCallback(
    (list) => {
      let items = [...(list || [])];
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        items = items.filter((g) => (g.title || "").toLowerCase().includes(q));
      }
      if (tagFilters.size) {
        items = items.filter((g) => {
          const gt = (g.tags || []).map((t) => (t || "").toLowerCase());
          for (const sel of tagFilters) if (gt.includes(sel.toLowerCase())) return true;
          return false;
        });
      }
      if (statusFilters.size) {
        items = items.filter((g) => {
          const played = !!(g.hoursPlayed > 0 || g.lastPlayed);
          const notPlayed = !g.hoursPlayed && !g.lastPlayed;
          const nonInstalled = !g.isInstalled;
          let ok = false;
          if (statusFilters.has("Played") && played) ok = true;
          if (statusFilters.has("Not played") && notPlayed) ok = true;
          if (statusFilters.has("Non-installed") && nonInstalled) ok = true;
          return ok;
        });
      }
      return items;
    },
    [searchTerm, tagFilters, statusFilters]
  );

  const recentGames = useMemo(() => {
    const withDate = (games || []).filter((g) => g.lastPlayed);
    if (withDate.length) {
      withDate.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
      return withDate.slice(0, 9);
    }
    return (games || []).slice(0, 9);
  }, [games]);

  const filteredRecent = useMemo(() => applyFilters(recentGames), [applyFilters, recentGames]);

  const handleGameInfoClick = (gameId) => navigate(`../store/game/${gameId}`);
  const handleCreateCollection = () => navigate("/library/collections?create=1");
  const handleOpenCollections = () => navigate("/library/collections");
  const openCollectionFromLib = (id) => navigate(`/library/collections?open=${encodeURIComponent(id)}`);

  const apiErrorText = isError ? error?.data?.message || "Failed to load library. Try again." : null;

  return (
    <div className="library-page-container">
      <Notification
        message={apiErrorText}
        type="error"
        onClose={() => {}}
      />

      <aside className="library-left">
        <div className="lib-panel lib-search-panel">
          <div className="lib-search-input">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
            <SearchIcon size={20} className="search-ico" />
          </div>
          <span className="lib-underline" />
        </div>

        <div className="lib-panel lib-tags-panel">
          <div className="lib-panel-title">Filter by tag</div>
          <span className="lib-underline" />
          <div className="lib-checks">
            {DEFAULT_TAGS.map((t) => (
              <label key={t} className="lib-check">
                <input
                  type="checkbox"
                  checked={tagFilters.has(t)}
                  onChange={() => setTagFilters((prev) => toggleSet(prev, t))}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          <div className="lib-enter-tag">
            <div className="lib-enter-tag-row">
              <input
                type="text"
                placeholder="Enter tag name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = e.currentTarget.value.trim();
                    if (val) setTagFilters((prev) => toggleSet(prev, val));
                    e.currentTarget.value = "";
                  }
                }}
              />
              <SearchIcon size={18} className="search-ico" />
            </div>
            <span className="lib-underline small" />
          </div>
        </div>

        <div className="lib-panel lib-status-panel">
          <div className="lib-panel-title">Filter by Status</div>
          <span className="lib-underline" />
          {STATUS_LIST.map((s) => (
            <label key={s} className="lib-check">
              <input
                type="checkbox"
                checked={statusFilters.has(s)}
                onChange={() => setStatusFilters((prev) => toggleSet(prev, s))}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </aside>

      <main className="library-right">
        <section className="lib-panel lib-recent-panel">
          <div className="lib-panel-title linkish">Recent</div>
          <div className="recent-grid">
            {loading ? (
              <div className="recent-empty">Loading...</div>
            ) : filteredRecent.length ? (
              filteredRecent.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="recent-tile"
                  onClick={() => handleGameInfoClick(g.id)}
                  title={g.title}
                >
                  <img
                    src={g.imageUrl || "/common/gameNoImage.png"}
                    alt={g.title || "Game"}
                  />
                  <span className="recent-name">{g.title || "Game"}</span>
                </button>
              ))
            ) : (
              <div className="recent-empty">No items</div>
            )}
          </div>
        </section>

        <section className="lib-panel lib-collections-panel">
          <div className="lib-panel-header">
            <div className="lib-panel-title">Collections</div>
            <div className="lib-collections-actions">
              <button className="linkish-btn" type="button" onClick={handleOpenCollections} title="Open Collections">
                Manage
              </button>
              <button className="linkish-btn primary" type="button" onClick={handleCreateCollection} title="Create collection">
                Create
              </button>
            </div>
          </div>

          {collections.length ? (
            <div className="collections-row">
              {collections.map((c) => {
                const preview = c.previewGames || [];
                return (
                  <div
                    className="collection-card clickable"
                    key={c.id}
                    title={c.name}
                    onClick={() => openCollectionFromLib(c.id)}
                  >
                    <div className="collection-cover">
                      <div className="collection-four">
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const game = preview[idx];
                          return (
                            <div
                              key={idx}
                              className="four-cell"
                              style={{
                                backgroundImage: game?.imageUrl ? `url(${game.imageUrl})` : "none",
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="collection-overlay">
                        <span className="collection-name">{c.name}</span>
                        <span className="collection-count">{c.gameCount} {c.gameCount === 1 ? "game" : "games"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                className="collection-card add-card"
                type="button"
                title="Create collection"
                onClick={handleCreateCollection}
              >
                +
              </button>
            </div>
          ) : (
            <div className="collections-row empty">
              <button
                className="collection-card add-card"
                type="button"
                title="Create collection"
                onClick={handleCreateCollection}
              >
                +
              </button>
              <div className="collections-empty-note">No collections yet</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Library;