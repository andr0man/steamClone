import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './market.scss';
import Notification from '../../components/Notification';
import { Search as SearchIcon, ChevronDown } from 'lucide-react';

const API_BASE_URL = '';

const initialMarketDataState = {
  items: [],
  uniqueGames: ['All Games'],
};

const MOCK_ITEMS = [
  {
    id: 'eg-sticker',
    name: 'Sticker | Evil Geniuses (Holo) | Stockholm 2021',
    game: 'Counter Strike 2',
    priceUAH: 1042,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/nilby78x_expires_30_days.png',
    available: true,
  },
  {
    id: 'glove-case',
    name: 'Glove Case',
    game: 'Counter Strike 2',
    priceUAH: 725.32,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/wf7szjfh_expires_30_days.png',
    available: true,
  },
  {
    id: 'mann-key',
    name: 'Mann Co. Supply Crate Key',
    game: 'Team Fortress 2',
    priceUAH: 102,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/y98kj0u2_expires_30_days.png',
    available: true,
  },
  {
    id: 'fracture',
    name: 'Fracture Case',
    game: 'Counter Strike 2',
    priceUAH: 22.83,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/tc2plpzm_expires_30_days.png',
    available: true,
  },
  {
    id: 'dreams',
    name: 'Dreams & Nightmares Case',
    game: 'Counter Strike 2',
    priceUAH: 99.78,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/d3fos8iu_expires_30_days.png',
    available: true,
  },
  {
    id: 'recoil',
    name: 'Recoil Case',
    game: 'Counter Strike 2',
    priceUAH: 19.94,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/r22tci5m_expires_30_days.png',
    available: true,
  },
  {
    id: 'revolution',
    name: 'Revolution Case',
    game: 'Counter Strike 2',
    priceUAH: 31.40,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/sy3ixsfp_expires_30_days.png',
    available: true,
  },
  {
    id: 'kilowatt',
    name: 'Kilowatt Case',
    game: 'Counter Strike 2',
    priceUAH: 28.66,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/wxowmf2e_expires_30_days.png',
    available: true,
  },
  {
    id: 'gallery',
    name: 'Gallery Case',
    game: 'Counter Strike 2',
    priceUAH: 39.74,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/olmroamo_expires_30_days.png',
    available: true,
  },
  {
    id: 'fever',
    name: 'Fever Case',
    game: 'Counter Strike 2',
    priceUAH: 40.33,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/unyn0r04_expires_30_days.png',
    available: true,
  },
  {
    id: 'pubg-skin',
    name: 'PUBG: BATTLEGROUNDS Skin',
    game: 'PUBG: BATTLEGROUNDS',
    priceUAH: 349,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/6w5qhf4a_expires_30_days.png',
    available: false,
  },
];

const MOCK_GAMES = [
  { name: 'Counter Strike 2', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/tc2plpzm_expires_30_days.png' },
  { name: 'Bongo Cat', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/j355i7ay_expires_30_days.png' },
  { name: 'PUBG: BATTLEGROUNDS', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/6w5qhf4a_expires_30_days.png' },
  { name: 'Rust', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/bwaiu0cv_expires_30_days.png' },
  { name: 'Dota 2', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/tsciqtpd_expires_30_days.png' },
  { name: 'Team Fortress 2', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/y98kj0u2_expires_30_days.png' },
];

const formatUAH = (n) => {
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${n.toLocaleString('uk-UA', { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

const Market = () => {
  const [marketData, setMarketData] = useState(initialMarketDataState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedGame, setSelectedGame] = useState('All Games');
  const [gameSearch, setGameSearch] = useState('');

  const { items } = marketData;

  const fetchMarketItems = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    setMarketData(prev => ({ ...prev, items: [] }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/market/items_nonexistent_endpoint`);
      if (!response.ok) throw new Error(`Failed to load market items. Status: ${response.status}`);
      const data = await response.json();
      const list = data.items || MOCK_ITEMS;
      const games = ['All Games', ...new Set(list.map(i => i.game).filter(Boolean))];
      setMarketData({ items: list, uniqueGames: games });
    } catch (err) {
      setApiError('Using local market data (API unavailable).');
      const list = MOCK_ITEMS;
      const games = ['All Games', ...new Set(list.map(i => i.game).filter(Boolean))];
      setMarketData({ items: list, uniqueGames: games });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMarketItems(); }, [fetchMarketItems]);

  const filteredGamesList = useMemo(() => {
    const base = (marketData.uniqueGames || []).slice(1);
    const list = base.length ? base : MOCK_GAMES.map(g => g.name);
    const s = gameSearch.trim().toLowerCase();
    return list.filter(n => n.toLowerCase().includes(s));
  }, [marketData.uniqueGames, gameSearch]);

  const gamesWithIcons = useMemo(() => {
    return filteredGamesList.map(name => {
      const found = MOCK_GAMES.find(g => g.name.toLowerCase() === name.toLowerCase());
      return { name, icon: found?.icon || 'https://via.placeholder.com/26/222/fff?text=G' };
    });
  }, [filteredGamesList]);

  const processed = useMemo(() => {
    let list = items.slice();
    const s = q.trim().toLowerCase();
    if (s) list = list.filter(i => (i.name || '').toLowerCase().includes(s) || (i.game || '').toLowerCase().includes(s));
    if (selectedGame !== 'All Games') list = list.filter(i => i.game === selectedGame);

    if (sortBy === 'price_asc') list.sort((a, b) => (a.priceUAH || 0) - (b.priceUAH || 0));
    if (sortBy === 'price_desc') list.sort((a, b) => (b.priceUAH || 0) - (a.priceUAH || 0));
    if (sortBy === 'name_asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (sortBy === 'name_desc') list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    if (sortBy === 'relevance' && s) {
      list.sort((a, b) => {
        const ai = (a.name || '').toLowerCase().indexOf(s);
        const bi = (b.name || '').toLowerCase().indexOf(s);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
    }
    return list;
  }, [items, q, selectedGame, sortBy]);

  const onSelectGame = (name) => setSelectedGame(name);

  return (
    <div className="market-page-container">
      <Notification message={apiError || null} type="error" onClose={() => setApiError(null)} />

      <aside className="market-left">
        <div className="mk-panel mk-search">
          <div className="mk-input">
            <input
              type="text"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            />
            <SearchIcon size={18} className="ico" />
          </div>
          <span className="mk-underline" />
        </div>

        <div className="mk-panel mk-filter-game">
          <div className="mk-title">Filter by game</div>
          <span className="mk-underline" />
          <div className="game-list">
            {gamesWithIcons.slice(0, 12).map(g => (
              <button
                type="button"
                key={g.name}
                className={`game-row ${selectedGame === g.name ? 'active' : ''}`}
                onClick={() => onSelectGame(g.name)}
                title={g.name}
              >
                <img src={g.icon} alt="" />
                <span>{g.name}</span>
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
                  if (e.key === 'Enter') {
                    const found = gamesWithIcons[0]?.name;
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
            <li><button type="button">My sell records</button></li>
            <li><button type="button">My buy records</button></li>
            <li><button type="button">My items on hold</button></li>
            <li className="accent"><button type="button">Sell an item</button></li>
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
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort items">
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A - Z</option>
                  <option value="name_desc">Name: Z - A</option>
                </select>
                <ChevronDown size={16} className="chev" />
              </div>
            </div>
          </div>

          <div className="market-sub">Trade, buy and sell unique in-game items with the Flux community</div>

          {loading ? (
            <div className="market-inline-loader"><div className="spinner-small" />Loading…</div>
          ) : (
            <div className="market-list">
              {processed.length ? processed.map(item => (
                <div key={item.id} className={`list-row ${!item.available ? 'sold' : ''}`}>
                  <div className="icon-wrap">
                    <img src={item.imageUrl || 'https://via.placeholder.com/64/1c232c/ffffff?text=?'} alt="" />
                  </div>
                  <div className="meta">
                    <div className="name" title={item.name}>{item.name}</div>
                    <div className="game">{item.game}</div>
                  </div>
                  <div className="spacer" />
                  <button
                    type="button"
                    className="price-badge"
                    disabled={!item.available}
                    onClick={() => window.alert(`Buy: ${item.name} for ${formatUAH(item.priceUAH)}`)}
                    title={item.available ? 'Buy now' : 'Sold'}
                  >
                    {formatUAH(item.priceUAH)}
                  </button>
                </div>
              )) : (
                <div className="market-empty">No items for current selection</div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Market;