import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './wishlist.scss';
import Notification from '../../../components/Notification';
import { Search as SearchIcon } from 'lucide-react';

const API_BASE_URL = '';



const formatUAH = (n) => `${(n ?? 0).toLocaleString('uk-UA', { minimumFractionDigits: 0 })}₴`;
const addedLabel = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `Added on ${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
};

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('personal'); // personal | date | price_asc | price_desc | name_asc

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
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort wishlist">
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
          <div className="wl-list">
            {filteredSorted.map((g, idx) => {
              const rank = idx + 1;
              const hasDiscount = Number.isFinite(g.discountUAH);
              const pct = hasDiscount ? Math.round((1 - (g.discountUAH / g.priceUAH)) * 100) : 0;

              return (
                <div className="wl-row" key={g.id || idx}>
                  <div className="rank-badge">
                    <span>{rank}</span>
                    <i className="chev up" />
                    <i className="chev down" />
                  </div>

                  <img className="thumb" src={g.imageUrl || 'https://via.placeholder.com/158x74/1e252e/c7d5e0?text=Game'} alt={g.title || 'Game'} />

                  <div className="meta">
                    <div className="name">{g.title || 'Untitled'}</div>
                    <div className="sub">
                      <span className="year">{g.year || '—'}</span>
                      <span className="dot">•</span>
                      <span className="added">{addedLabel(g.added)}</span>
                      <button type="button" className="remove" onClick={() => removeItem(g.id)}>Remove</button>
                    </div>
                  </div>

                  <div className="spacer" />

                  <div className="price-side">
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