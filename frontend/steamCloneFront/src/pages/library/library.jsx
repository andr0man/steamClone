import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./library.scss";
import Notification from "../../components/Notification";
import { Search as SearchIcon } from "lucide-react";
import { useGetGameLibraryQuery } from "../../services/gameLibrary/gameLibraryApi";
import { useGetAllGenresQuery } from "../../services/genre/genreApi";
import { useGetAllGamesQuery } from "../../services/game/gameApi";

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

const extractGenres = (g, row) => {
  const raw = g?.genres ?? g?.gameGenres ?? row?.genres ?? g?.tags ?? [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) =>
      typeof x === "string"
        ? x
        : x?.name ?? x?.genre?.name ?? x?.title ?? null
    )
    .filter(Boolean);
};

const mapFromApi = (resp, gamesById) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const g = row?.game ?? row?.gameDto ?? row?.gameDetails ?? row;
    const gameId = g?.id ?? row?.gameId ?? row?.id;
    let genres = extractGenres(g, row);
    if ((!genres || genres.length === 0) && gameId && gamesById) {
      const meta = gamesById.get(gameId);
      if (meta?.genres?.length) genres = meta.genres;
    }
    const tags = Array.from(new Set((genres || []).map((t) => String(t)).filter(Boolean)));
    return {
      id: gameId,
      title: g?.name ?? g?.title ?? "Game",
      imageUrl:
        g?.coverImageUrl ??
        g?.coverImage ??
        (Array.isArray(g?.screenshotUrls) ? g.screenshotUrls[0] : null) ??
        "/common/gameNoImage.png",
      tags,
      category: tags[0] || "General",
      isInstalled: Boolean(row?.installed ?? row?.isInstalled ?? g?.isInstalled ?? false),
      hoursPlayed: row?.hoursPlayed ?? g?.hoursPlayed ?? 0,
      lastPlayed: row?.lastPlayed ?? g?.lastPlayed ?? null,
      releaseDate: g?.releaseDate ?? null,
      price: g?.price ?? null,
      discount: g?.discount ?? 0,
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
  const { data, isFetching: loading, isError, error, refetch } = useGetGameLibraryQuery();
  const { data: genresRes, isError: genresIsError, error: genresError, refetch: refetchGenres } = useGetAllGenresQuery();
  const { data: allGamesRes } = useGetAllGamesQuery();

  useEffect(() => {
    refetch();
    refetchGenres();
    const id = setInterval(() => {
      refetch();
      refetchGenres();
    }, 60000);
    return () => clearInterval(id);
  }, [refetch, refetchGenres]);

  const gamesById = useMemo(() => {
    const list = allGamesRes?.payload ?? allGamesRes ?? [];
    const map = new Map();
    if (Array.isArray(list)) {
      list.forEach((g) => {
        if (g?.id) {
          const genres = Array.isArray(g?.genres)
            ? g.genres
                .map((x) =>
                  typeof x === "string"
                    ? x
                    : x?.name ?? x?.title ?? null
                )
                .filter(Boolean)
            : [];
          map.set(g.id, { genres });
        }
      });
    }
    return map;
  }, [allGamesRes]);

  const games = useMemo(() => mapFromApi(data, gamesById), [data, gamesById]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilters, setTagFilters] = useState(new Set());
  const [statusFilters, setStatusFilters] = useState(new Set());
  const [tagSearch, setTagSearch] = useState("");

  const allTags = useMemo(() => {
    const list = genresRes?.payload ?? genresRes ?? [];
    const fromGenres = Array.isArray(list)
      ? list
          .map((g) => g?.name ?? g?.title ?? g)
          .filter(Boolean)
      : [];
    const fromGames = [];
    games.forEach((g) => (g.tags || []).forEach((t) => t && fromGames.push(String(t))));
    const allGamesList = allGamesRes?.payload ?? allGamesRes ?? [];
    const fromAllGames = Array.isArray(allGamesList)
      ? allGamesList.flatMap((g) =>
          Array.isArray(g?.genres)
            ? g.genres
                .map((x) =>
                  typeof x === "string"
                    ? x
                    : x?.name ?? x?.title ?? null
                )
                .filter(Boolean)
            : []
        )
      : [];
    const merged = Array.from(new Set([...fromGenres, ...fromGames, ...fromAllGames]))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    return merged.length ? merged : DEFAULT_TAGS;
  }, [genresRes, games, allGamesRes]);

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

  const tagSuggestions = useMemo(() => {
    const s = tagSearch.trim().toLowerCase();
    const base = s ? allTags.filter((t) => t.toLowerCase().includes(s)) : allTags.slice();
    return base.slice(0, 24);
  }, [tagSearch, allTags]);

  const applyFilters = useCallback(
    (list) => {
      let items = [...(list || [])];
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        items = items.filter((g) => {
          const inTitle = (g.title || "").toLowerCase().includes(q);
          const inTags = (g.tags || []).some((t) => (t || "").toLowerCase().includes(q));
          return inTitle || inTags;
        });
      }
      if (tagFilters.size) {
        items = items.filter((g) => {
          const gt = (g.tags || []).map((t) => (t || "").toLowerCase());
          for (const sel of tagFilters) if (gt.includes(String(sel).toLowerCase())) return true;
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

  const handleGameInfoClick = (gameId) => navigate(`/store/game/${gameId}`);
  const handleCreateCollection = () => navigate("/library/collections?create=1");
  const handleOpenCollections = () => navigate("/library/collections");
  const openCollectionFromLib = (id) => navigate(`/library/collections?open=${encodeURIComponent(id)}`);

  const apiErrorText =
    (isError ? error?.data?.message || "Failed to load library. Try again." : null) ||
    (genresIsError ? genresError?.data?.message || "Failed to load genres" : null);

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
              placeholder="Search by name or category"
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
            {allTags.map((t) => (
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
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const pick = (tagSuggestions[0] || tagSearch || "").trim();
                    if (pick) setTagFilters((prev) => toggleSet(prev, pick));
                    setTagSearch("");
                    e.currentTarget.blur();
                  }
                }}
              />
              <SearchIcon size={18} className="search-ico" />
            </div>
            <span className="lib-underline small" />
            {tagSearch.trim() && tagSuggestions.length > 0 && (
              <div className="lib-tag-suggest">
                {tagSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`tag-suggest-item ${tagFilters.has(name) ? "active" : ""}`}
                    onClick={() => setTagFilters((prev) => toggleSet(prev, name))}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
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