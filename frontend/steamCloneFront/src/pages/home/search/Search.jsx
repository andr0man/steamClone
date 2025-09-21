import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Search.scss";
import { useGetAllForSearchQuery } from "../../../services/search/searchApi";
import { useGetAllGenresQuery } from "../../../services/genre/genreApi";

const OS_LIST = ["Windows", "macOS", "Linux"];
const PLAYERS = [
  "Single-player",
  "Multi-player",
  "PvP",
  "Shared/Split-screen",
  "Cross-Platform Multi-player",
];

const priceToUAH = (n) => `${Math.round(n ?? 0)}₴`;

const extractOS = (systemRequirements) => {
  const set = new Set();
  if (Array.isArray(systemRequirements)) {
    for (const req of systemRequirements) {
      const p = String(req.platform || "").toLowerCase();
      if (p.includes("win")) set.add("Windows");
      if (p.includes("linux")) set.add("Linux");
      if (p.includes("mac")) set.add("macOS");
    }
  }
  return Array.from(set);
};

const mapGames = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((g) => {
    const price = Number(g?.price ?? g?.finalPrice ?? 0);
    const discount = Number(g?.discount ?? g?.discountPercent ?? 0); // %
    const now = discount > 0 ? Math.round(price - (price * discount) / 100) : price;

    const tags = Array.isArray(g?.genres) ? g.genres.map((x) => x?.name ?? x).filter(Boolean) : [];
    let categories = [];
    if (Array.isArray(g?.categories)) {
      categories = g.categories.map((x) => x?.name ?? x).filter(Boolean);
    } else if (tags.length) {
      categories = [...new Set(tags)]; 
    } else if (g?.category) {
      categories = [g.category];
    }

    return {
      id: g?.id,
      title: g?.name ?? g?.title ?? "Game",
      year: g?.releaseDate ? new Date(g.releaseDate).getFullYear() : "—",
      price: now,
      oldPrice: discount > 0 ? price : undefined,
      discount: discount > 0 ? discount : undefined,
      tags,
      categories,
      os: extractOS(g?.systemRequirements),
      players: [],
      imageUrl: g?.coverImageUrl ?? "/common/gameNoImage.png",
    };
  });
};

const Search = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [sort, setSort] = useState("relevance");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [tagsSel, setTagsSel] = useState(new Set());
  const [catsSel, setCatsSel] = useState(new Set());
  const [osSel, setOsSel] = useState(new Set());
  const [playersSel, setPlayersSel] = useState(new Set());

  const { data: gamesRes, isFetching, isError, error } = useGetAllForSearchQuery();
  const { data: genresRes } = useGetAllGenresQuery();

  const allGames = useMemo(() => mapGames(gamesRes), [gamesRes]);

  const TAGS = useMemo(() => {
    const arr = genresRes?.payload ?? genresRes ?? [];
    return Array.isArray(arr) ? arr.map((g) => g.name).filter(Boolean) : [];
  }, [genresRes]);

  const CATS = useMemo(() => {
    const s = new Set();
    for (const g of allGames) {
      (g.categories || []).forEach((c) => c && s.add(c));
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [allGames]);

  useEffect(() => {
    const qp = params.get("q") || "";
    setQ(qp);
  }, [params]);

  const toggleInSet = (setVal, val) => {
    const next = new Set(setVal);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  const filtered = useMemo(() => {
    let list = allGames.slice();

    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((g) => {
        const inTitle = (g.title || "").toLowerCase().includes(query);
        const inTags = (g.tags || []).some((t) => String(t).toLowerCase().includes(query));
        const inCats = (g.categories || []).some((c) => String(c).toLowerCase().includes(query));
        return inTitle || inTags || inCats;
      });
    }

    list = list.filter((g) => (g.price ?? 0) <= maxPrice);

    if (tagsSel.size) {
      list = list.filter((g) => {
        const t = (g.tags || []).map((s) => String(s).toLowerCase());
        for (const sel of tagsSel) if (t.includes(String(sel).toLowerCase())) return true;
        return false;
      });
    }

    if (catsSel.size) {
      list = list.filter((g) => {
        const c = (g.categories || []).map((s) => String(s).toLowerCase());
        for (const sel of catsSel) if (c.includes(String(sel).toLowerCase())) return true;
        return false;
      });
    }

    if (osSel.size) {
      list = list.filter((g) => {
        const gos = (g.os || []).map((s) => s.toLowerCase());
        for (const sel of osSel) if (gos.includes(sel.toLowerCase())) return true;
        return false;
      });
    }

    if (playersSel.size) {
      list = list.filter((g) => {
        const gp = (g.players || []).map((s) => s.toLowerCase());
        if (gp.length === 0) return false;
        for (const sel of playersSel) if (gp.includes(sel.toLowerCase())) return true;
        return false;
      });
    }

    if (sort === "price-asc") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price-desc") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "year-desc") list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    if (sort === "year-asc") list.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    if (sort === "relevance" && query) {
      list.sort((a, b) => {
        const ai = (a.title || "").toLowerCase().indexOf(query);
        const bi = (b.title || "").toLowerCase().indexOf(query);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
    }

    return list;
  }, [allGames, q, sort, maxPrice, tagsSel, catsSel, osSel, playersSel]);

  const runSearch = () => {
    const next = new URLSearchParams(params);
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    setParams(next, { replace: false });
  };

  const openGame = (id) => navigate(`/store/game/${id}`);

  return (
    <div className="store-search-page">
      <div className="page-inset">
        <div className="search-grid">
          <aside className="filters-col">
            <div className="panel">
              <div className="panel-title">Filter by Price</div>
              <div className="price-range">
                <div className="range-row">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  />
                </div>
                <div className="price-info">
                  {maxPrice >= 10000 ? "Any price" : `Up to ${priceToUAH(maxPrice)}`}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Filter by tag</div>
              <div className="check-list">
                {TAGS.map((t) => (
                  <label key={t} className="check">
                    <input
                      type="checkbox"
                      checked={tagsSel.has(t)}
                      onChange={() => setTagsSel((prev) => toggleInSet(prev, t))}
                    />
                    <span>{t}</span>
                  </label>
                ))}
                {!TAGS.length && <div style={{ opacity: 0.7 }}>No tags</div>}
              </div>
            </div>
            <div className="panel">
              <div className="panel-title">Filter by OS</div>
              <div className="check-list">
                {OS_LIST.map((o) => (
                  <label key={o} className="check">
                    <input
                      type="checkbox"
                      checked={osSel.has(o)}
                      onChange={() => setOsSel((prev) => toggleInSet(prev, o))}
                    />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Filter by number of players</div>
              <div className="check-list">
                {PLAYERS.map((p) => (
                  <label key={p} className="check">
                    <input
                      type="checkbox"
                      checked={playersSel.has(p)}
                      onChange={() => setPlayersSel((prev) => toggleInSet(prev, p))}
                    />
                    <span>{p}</span>
                  </label>
                ))}
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                  Note: player modes are not provided by API yet
                </div>
              </div>
            </div>
          </aside>

          <section className="results-col">
            <div className="panel results-head">
              <div className="search-bar" role="search">
                <input
                  type="text"
                  placeholder="Search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
                <button type="button" aria-label="Search" onClick={runSearch}>
                  <img
                    src="https://c.animaapp.com/tF1DKM3X/img/fluent-search-sparkle-48-regular.svg"
                    alt=""
                  />
                </button>
              </div>

              <div className="sort-box">
                <span>Sort by:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: New to Old</option>
                  <option value="year-asc">Year: Old to New</option>
                </select>
              </div>
            </div>

            <div className="panel results-list">
              {isFetching ? (
                <div className="empty">Loading...</div>
              ) : isError ? (
                <div className="empty">
                  {error?.data?.message || "Failed to load games"}
                </div>
              ) : (
                <>
                  {filtered.map((g) => (
                    <div
                      key={g.id}
                      className="result-row"
                      onClick={() => openGame(g.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img className="thumb" src={g.imageUrl} alt={g.title} />
                      <div className="meta">
                        <div className="title">{g.title}</div>
                        <div className="year">{g.year}</div>
                      </div>
                      <div className="spacer" />
                      {g.discount ? (
                        <div className="price price-discount">
                          <span className="off">-{g.discount}%</span>
                          <div className="nums">
                            <span className="from">{priceToUAH(g.oldPrice)}</span>
                            <span className="now">{priceToUAH(g.price)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="price">
                          <span className="now">{priceToUAH(g.price)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {!filtered.length && <div className="empty">No results</div>}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Search;