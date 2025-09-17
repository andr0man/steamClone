import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./library.scss";
import Notification from "../../components/Notification";
import { Search as SearchIcon } from "lucide-react";
import { useGetGameLibraryQuery } from "../../services/gameLibrary/gameLibraryApi";

const DEFAULT_TAGS = ["Indie", "Singleplayer", "Casual", "Action", "Adventure"];
const STATUS_LIST = ["Played", "Not played", "Non-installed"];

const mapFromApi = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];

  return list.map((row) => {
    const g = row?.game ?? row?.gameDto ?? row?.gameDetails ?? row;

    return {
      id: g?.id ?? row?.gameId ?? row?.id,
      title: g?.name ?? g?.title ?? "Game",
      imageUrl: g?.coverImageUrl ?? g?.coverImage ?? "/common/gameNoImage.png",
      tags: Array.isArray(g?.genres) ? g.genres.map((x) => x.name) : [],
      category:
        Array.isArray(g?.genres) && g.genres[0] ? g.genres[0].name : "General",
      isInstalled: false,
      hoursPlayed: row?.hoursPlayed ?? g?.hoursPlayed ?? 0,
      lastPlayed: row?.lastPlayed ?? g?.lastPlayed ?? null,
    };
  });
};

const Library = () => {
  const navigate = useNavigate();
  const {
    data,
    isFetching: loading,
    isError,
    error,
    refetch,
  } = useGetGameLibraryQuery();

  const games = useMemo(() => mapFromApi(data), [data]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilters, setTagFilters] = useState(new Set());
  const [statusFilters, setStatusFilters] = useState(new Set());

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
          const gt = (g.tags || []).map((t) => t.toLowerCase());
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

  const filteredRecent = useMemo(
    () => applyFilters(recentGames),
    [applyFilters, recentGames]
  );

  const topCategories = useMemo(() => {
    const map = new Map();
    for (const g of games) {
      const key = g.category || "General";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
  }, [games]);

  const handleGameInfoClick = (gameId) => navigate(`../store/game/${gameId}`);
  const handleCreateCollection = () => navigate("/library/collections?create=1");
  const handleOpenCollections = () => navigate("/library/collections");

  const apiErrorText =
    isError ? error?.data?.message || "Failed to load library. Try again." : null;

  return (
    <div className="library-page-container">
      <Notification
        message={apiErrorText}
        type="error"
        onClose={() => {
          /* лишаємо як є; можна зробити refetch() */
        }}
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
                    src={
                      g.imageUrl ||
                      "https://via.placeholder.com/300x150/1e252e/657382?Text=No+Image"
                    }
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
          <div
            className="lib-panel-title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Collections</span>
            <button
              className="linkish-btn"
              type="button"
              onClick={handleOpenCollections}
              title="Open Collections"
            >
              Manage
            </button>
          </div>

          <div className="collections-row">
            <button
              className="collection-card add-card"
              type="button"
              title="Create collection"
              onClick={handleCreateCollection}
            >
              +
            </button>

            {/* Демонстраційні картки з категорій (жанрів) бібліотеки */}
            {topCategories.length ? (
              topCategories.map((name) => {
                const sample = games.find((g) => g.category === name);
                return (
                  <div
                    className="collection-card clickable"
                    key={name}
                    title={`Open "${name}"`}
                    onClick={handleOpenCollections}
                  >
                    <div
                      className="collection-cover"
                      style={{
                        backgroundImage: sample?.imageUrl
                          ? `url(${sample.imageUrl})`
                          : "none",
                      }}
                    >
                      <div className="collection-overlay">
                        <span className="collection-name">{name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="collection-card"
                style={{
                  gridColumn: "span 3",
                  display: "grid",
                  placeItems: "center",
                  color: "#c8d0d8",
                  fontWeight: 600,
                }}
              >
                Collections will be here soon
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Library;