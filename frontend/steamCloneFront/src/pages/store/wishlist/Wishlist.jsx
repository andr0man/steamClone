import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './wishlist.scss';
import Notification from '../../../components/Notification';
import { Search as SearchIcon } from 'lucide-react';

const API_BASE_URL = '';

const formatUAH = (n) => `${Math.round(n ?? 0)}₴`;

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
const addedLabel = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const month = MONTHS_SHORT[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `Added on ${month} ${day}/${year}`;
};

const MOCK_WISHLIST = [
  {
    id: 'rdr2',
    title: 'Red Dead Redemption 2',
    year: 2019,
    added: '2025-09-27',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/6zh2b0dw_expires_30_days.png',
    priceUAH: 2599,
    discountUAH: 649,
  },
  {
    id: 'repo',
    title: 'R.E.P.O',
    year: 2025,
    added: '2025-08-10',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/4ptiqtro_expires_30_days.png',
    priceUAH: 225,
  },
  {
    id: 'stardew',
    title: 'Stardew Valley',
    year: 2016,
    added: '2025-08-02',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/cw3h705p_expires_30_days.png',
    priceUAH: 229,
  },
  {
    id: 'stellaris',
    title: 'Stellaris',
    year: 2016,
    added: '2025-08-01',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/e7drucft_expires_30_days.png',
    priceUAH: 989,
  },
  {
    id: 'terraria',
    title: 'Terraria',
    year: 2011,
    added: '2025-07-07',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/e4qwzyl3_expires_30_days.png',
    priceUAH: 229,
  },
  {
    id: 'ittakestwo',
    title: 'It Takes Two',
    year: 2021,
    added: '2025-07-06',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/7qtrekim_expires_30_days.png',
    priceUAH: 999,
  },
  {
    id: 'dbd',
    title: 'Dead by Daylight',
    year: 2016,
    added: '2025-06-15',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/bivhkzs8_expires_30_days.png',
    priceUAH: 429,
  },
  {
    id: 'hk',
    title: 'Hollow Knight',
    year: 2017,
    added: '2025-06-03',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/acmfyhyt_expires_30_days.png',
    priceUAH: 325,
  },
];

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('personal');

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist_nonexistent_endpoint`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const list = (data.items || []).map((g, i) => ({ ...g, rank: i + 1 }));
      setItems(list.length ? list : MOCK_WISHLIST.map((g, i) => ({ ...g, rank: i + 1 })));
    } catch {
      setApiError('Using local wishlist data (API unavailable).');
      setItems(MOCK_WISHLIST.map((g, i) => ({ ...g, rank: i + 1 })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const filteredSorted = useMemo(() => {
    let list = items.slice();
    const s = q.trim().toLowerCase();
    if (s) list = list.filter(it => it.title?.toLowerCase().includes(s));
    if (sortBy === 'personal') list.sort((a, b) => (a.rank || 0) - (b.rank || 0));
    if (sortBy === 'date') list.sort((a, b) => new Date(b.added || 0) - new Date(a.added || 0));
    if (sortBy === 'price_asc') list.sort((a, b) => (a.discountUAH ?? a.priceUAH ?? 0) - (b.discountUAH ?? b.priceUAH ?? 0));
    if (sortBy === 'price_desc') list.sort((a, b) => (b.discountUAH ?? b.priceUAH ?? 0) - (a.discountUAH ?? a.priceUAH ?? 0));
    if (sortBy === 'name_asc') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return list;
  }, [items, q, sortBy]);

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id).map((it, idx) => ({ ...it, rank: idx + 1 })));
  };

  return (
    <div className="wl-page">
      <Notification message={apiError} type="error" onClose={() => setApiError(null)} />

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
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                aria-label="Search wishlist"
              />
              <SearchIcon size={18} className="ico" />
              <span className="wl-search-underline" />
            </div>

            <div className="wl-sort">
              <span>Sort by:</span>
              <button
                className={`plain-sort ${sortBy === 'personal' ? 'active' : ''}`}
                onClick={() => setSortBy('personal')}
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

        {loading ? (
          <div className="wl-loading"><div className="spinner" />Loading your wishlist...</div>
        ) : (
          <div className="wl-list" role="list">
            {filteredSorted.map((g, idx) => {
              const rank = idx + 1;
              const hasDiscount = Number.isFinite(g.discountUAH);
              const pct = hasDiscount && g.priceUAH > 0
                ? Math.round((1 - (g.discountUAH / g.priceUAH)) * 100)
                : 0;

              return (
                <div className="wl-row" key={g.id || idx} role="listitem" aria-label={g.title}>
                  <div className="rank-badge" role="img" aria-label={`Rank ${rank}`}>
                    <span>{rank}</span>
                    <i className="chev up" />
                    <i className="chev down" />
                  </div>

                  <img
                    className="thumb"
                    src={g.imageUrl || 'https://via.placeholder.com/158x74/1e252e/c7d5e0?text=Game'}
                    alt={g.title || 'Game cover'}
                    loading="lazy"
                  />

                  <div className="meta">
                    <div className="name" title={g.title || 'Untitled'}>
                      {g.title || 'Untitled'}
                    </div>
                    <div className="sub">
                      <span className="year">{g.year || '—'}</span>
                      <span className="dot">•</span>
                      <span className="added">{addedLabel(g.added)}</span>
                      <button
                        type="button"
                        className="remove"
                        onClick={() => removeItem(g.id)}
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
                          <span className="new">{formatUAH(g.discountUAH)}</span>
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
        )}
      </div>
    </div>
  );
};

export default Wishlist;