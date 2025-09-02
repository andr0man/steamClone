
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Search.scss';


const ALL_GAMES = [
  { id: 'peak', title: 'Peak', year: 2025, price: 159, tags: ['Indie'], os: ['windows'], players: ['Single-player'], imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/9ta02v1k_expires_30_days.png' },
  { id: 'dbd', title: 'Dead by Daylight', year: 2016, price: 429, tags: ['Action', 'Multiplayer'], os: ['windows'], players: ['Multi-player', 'PvP'], imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/boni67ry_expires_30_days.png' },
  { id: 'stellaris', title: 'Stellaris', year: 2016, price: 989, tags: ['Strategy'], os: ['windows', 'macos', 'linux'], players: ['Single-player'], imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/osnt32h9_expires_30_days.png' },
  { id: 'repo', title: 'R.E.P.O', year: 2025, price: 225, tags: ['Action', 'Indie'], os: ['windows'], players: ['Single-player'], imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/wywraefg_expires_30_days.png' },
  { id: 'stardew', title: 'Stardew Valley', year: 2016, price: 229, tags: ['Casual', 'Indie'], os: ['windows', 'macos', 'linux'], players: ['Single-player'], imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/jubnmegk_expires_30_days.png' },
  { id: 'rdr2', title: 'Red Dead Redemption 2', year: 2019, price: 649, oldPrice: 2599, discount: 75, tags: ['Action', 'Adventure'], os: ['windows'], players: ['Single-player'], imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-18.png' },
  { id: 'ittakestwo', title: 'It Takes Two', year: 2021, price: 999, tags: ['Adventure'], os: ['windows'], players: ['Multi-player'], imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-1.png' },
  { id: 'terraria', title: 'Terraria', year: 2011, price: 229, tags: ['Indie', 'Action'], os: ['windows', 'macos', 'linux'], players: ['Single-player', 'Multi-player'], imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-34-1.png' },
  { id: 'hades', title: 'Hades', year: 2020, price: 519, tags: ['Action', 'Indie'], os: ['windows', 'macos'], players: ['Single-player'], imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-2@2x.png' },
  { id: 'hollowknight', title: 'Hollow Knight', year: 2017, price: 325, tags: ['Action', 'Indie'], os: ['windows', 'macos', 'linux'], players: ['Single-player'], imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-1@2x.png' },
];

const TAGS = ['Indie', 'Singleplayer', 'Casual', 'Action', 'Adventure'];
const OS = ['Windows', 'macOS', 'Linux'];
const PLAYERS = ['Single-player', 'Multi-player', 'PvP', 'Shared/Split-screen', 'Cross-Platform Multi-player'];

const priceToUAH = n => `${n}₴`;

const Search = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [sort, setSort] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [tags, setTags] = useState(new Set());
  const [os, setOs] = useState(new Set());
  const [players, setPlayers] = useState(new Set());

  useEffect(() => {
    const qp = params.get('q') || '';
    setQ(qp);
  }, [params]);

  const toggleInSet = (set, val) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  };

  const filtered = useMemo(() => {
    let list = ALL_GAMES.slice();
    const query = q.trim().toLowerCase();
    if (query) list = list.filter(g => g.title.toLowerCase().includes(query));
    list = list.filter(g => (g.price ?? 0) <= maxPrice);
    if (tags.size) {
      list = list.filter(g => {
        const t = (g.tags || []).map(s => s.toLowerCase());
        for (const sel of tags) {
          const normalized = sel === 'Singleplayer' ? 'single-player' : sel.toLowerCase();
          if (t.some(tt => tt.replace(' ', '-') === normalized.replace(' ', '-'))) return true;
        }
        return false;
      });
    }
    if (os.size) {
      list = list.filter(g => {
        const gos = (g.os || []).map(s => s.toLowerCase());
        for (const sel of os) {
          const key = sel.toLowerCase();
          if (gos.includes(key)) return true;
        }
        return false;
      });
    }
    if (players.size) {
      list = list.filter(g => {
        const gp = (g.players || []).map(s => s.toLowerCase());
        for (const sel of players) if (gp.includes(sel.toLowerCase())) return true;
        return false;
      });
    }
    if (sort === 'price-asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price-desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'year-desc') list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    if (sort === 'year-asc') list.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    if (sort === 'relevance' && query) {
      list.sort((a, b) => {
        const ai = a.title.toLowerCase().indexOf(query);
        const bi = b.title.toLowerCase().indexOf(query);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
    }
    return list;
  }, [q, sort, maxPrice, tags, os, players]);

  const runSearch = () => {
    const next = new URLSearchParams(params);
    if (q.trim()) next.set('q', q.trim());
    else next.delete('q');
    setParams(next, { replace: false });
  };

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
                <div className="price-info">{maxPrice >= 10000 ? 'Any price' : `Up to ${priceToUAH(maxPrice)}`}</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Filter by tag</div>
              <div className="check-list">
                {TAGS.map(t => (
                  <label key={t} className="check">
                    <input
                      type="checkbox"
                      checked={tags.has(t)}
                      onChange={() => setTags(prev => toggleInSet(prev, t))}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Filter by OS</div>
              <div className="check-list">
                {OS.map(o => (
                  <label key={o} className="check">
                    <input
                      type="checkbox"
                      checked={os.has(o)}
                      onChange={() => setOs(prev => toggleInSet(prev, o))}
                    />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Filter by number of players</div>
              <div className="check-list">
                {PLAYERS.map(p => (
                  <label key={p} className="check">
                    <input
                      type="checkbox"
                      checked={players.has(p)}
                      onChange={() => setPlayers(prev => toggleInSet(prev, p))}
                    />
                    <span>{p}</span>
                  </label>
                ))}
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
                  onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                />
                <button type="button" aria-label="Search" onClick={runSearch}>
                  <img src="https://c.animaapp.com/tF1DKM3X/img/fluent-search-sparkle-48-regular.svg" alt="" />
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
              {filtered.map(g => (
                <div key={g.id} className="result-row">
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
            </div>
          </section>
        </div>
      </div>

    </div>
  );
};

export default Search;