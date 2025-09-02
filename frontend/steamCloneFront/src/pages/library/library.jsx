import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './library.scss';
import Notification from '../../components/Notification';
import { Search as SearchIcon } from 'lucide-react';

const initialLibraryDataState = { games: [] };

const LS_KEYS = {
  LIB: 'mock:library-games',
  COL: 'mock:collections',
};

const MOCK_GAMES = [
  {
    id: 'obs',
    title: 'PEKA',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-33-3.png',
    tags: ['Tool'],
    category: 'Fav',
    isInstalled: true,
    hoursPlayed: 12,
    lastPlayed: '2025-08-05'
  },
  {
    id: 'stray',
    title: 'Rust',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-32-1.png',
    tags: ['Adventure'],
    category: 'RPG',
    isInstalled: true,
    hoursPlayed: 4,
    lastPlayed: '2025-08-02'
  },
  {
    id: 'bg3',
    title: 'Baldur’s Gate 3',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-1@2x.png',
    tags: ['RPG'],
    category: 'RPG',
    isInstalled: false,
    hoursPlayed: 0,
    lastPlayed: ''
  },
  {
    id: 'ln2',
    title: 'Phasmophobia',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-1@2x.png',
    tags: ['Indie'],
    category: 'Fav',
    isInstalled: true,
    hoursPlayed: 9,
    lastPlayed: '2025-07-30'
  },
  {
    id: 'cult',
    title: 'Cult of the Lamb',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-37-2@2x.png',
    tags: ['Indie', 'Action'],
    category: 'Strategies',
    isInstalled: true,
    hoursPlayed: 20,
    lastPlayed: '2025-07-29'
  },
  {
    id: 'hades',
    title: 'Hades',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-36-2@2x.png',
    tags: ['Action', 'Indie'],
    category: 'Fav',
    isInstalled: true,
    hoursPlayed: 51,
    lastPlayed: '2025-07-28'
  },
  {
    id: 'witcher3',
    title: 'Counter Strike 2',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-2@2x.png',
    tags: ['RPG'],
    category: 'RPG',
    isInstalled: false,
    hoursPlayed: 120,
    lastPlayed: '2025-06-15'
  },
  {
    id: 'disco',
    title: 'Disco Elysium',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-29-1@2x.png',
    tags: ['RPG', 'Indie'],
    category: 'Strategies',
    isInstalled: true,
    hoursPlayed: 33,
    lastPlayed: '2025-07-20'
  },
  {
    id: 'rdr2',
    title: 'Red Dead Redemption 2',
    imageUrl: 'https://c.animaapp.com/tF1DKM3X/img/rectangle-18.png',
    tags: ['Action', 'Adventure'],
    category: 'Fav',
    isInstalled: false,
    hoursPlayed: 0,
    lastPlayed: ''
  }
];

const DEFAULT_TAGS = ['Indie', 'Singleplayer', 'Casual', 'Action', 'Adventure'];
const STATUS_LIST = ['Played', 'Not played', 'Non-installed'];

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function shapeCollections(rawList, libraryGames) {
  const map = new Map((libraryGames || []).map(g => [g.id, g]));
  return (rawList || []).map(c => {
    const ids = Array.from(new Set(c.gameIds || []));
    const previewGames = ids.map(id => map.get(id)).filter(Boolean).slice(0, 4);
    return {
      id: c.id,
      name: c.name,
      gameCount: ids.length,
      previewGames,
    };
  });
}

const Library = () => {
  const [libraryData, setLibraryData] = useState(initialLibraryDataState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilters, setTagFilters] = useState(new Set());
  const [statusFilters, setStatusFilters] = useState(new Set());

  const navigate = useNavigate();
  const { games } = libraryData;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        let lib = readLS(LS_KEYS.LIB, null);
        if (!lib || !Array.isArray(lib) || lib.length === 0) {
          lib = MOCK_GAMES;
          writeLS(LS_KEYS.LIB, lib);
        }
        setLibraryData({ games: lib });
      } catch (e) {
        setApiError('Failed to load local library data.');
        setLibraryData({ games: MOCK_GAMES });
      } finally {
        setLoading(false);
      }
    }, 150);
  }, []);

  const toggleSet = (setVal, value) => {
    const next = new Set(setVal);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const applyFilters = useCallback((list) => {
    let items = [...(list || [])];
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      items = items.filter(g => (g.title || '').toLowerCase().includes(q));
    }
    if (tagFilters.size) {
      items = items.filter(g => {
        const gt = (g.tags || []).map(t => t.toLowerCase());
        for (const sel of tagFilters) if (gt.includes(sel.toLowerCase())) return true;
        return false;
      });
    }
    if (statusFilters.size) {
      items = items.filter(g => {
        const played = !!(g.hoursPlayed > 0 || g.lastPlayed);
        const notPlayed = !g.hoursPlayed && !g.lastPlayed;
        const nonInstalled = !g.isInstalled;
        let ok = false;
        if (statusFilters.has('Played') && played) ok = true;
        if (statusFilters.has('Not played') && notPlayed) ok = true;
        if (statusFilters.has('Non-installed') && nonInstalled) ok = true;
        return ok;
      });
    }
    return items;
  }, [searchTerm, tagFilters, statusFilters]);

  const recentGames = useMemo(() => {
    const withDate = (games || []).filter(g => g.lastPlayed);
    const sorted = withDate.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
    const base = (sorted.length ? sorted : games || []);
    return base.slice(0, 9);
  }, [games]);

  const filteredRecent = useMemo(() => applyFilters(recentGames), [applyFilters, recentGames]);

  const userCollections = useMemo(() => {
    const raw = readLS(LS_KEYS.COL, []);
    return shapeCollections(raw, games);
  }, [games]);

  const handleGameInfoClick = (gameId) => navigate(`/library/game/${gameId}`);
  const handleCreateCollection = () => navigate('/library/collections?create=1');
  const handleOpenCollection = (id) => navigate(`/library/collections?open=${encodeURIComponent(id)}`);
  const handleOpenCollections = () => navigate('/library/collections');

  return (
    <div className="library-page-container">
      <Notification message={apiError || null} type="error" onClose={() => setApiError(null)} />

      <aside className="library-left">
        <div className="lib-panel lib-search-panel">
          <div className="lib-search-input">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            />
            <SearchIcon size={20} className="search-ico" />
          </div>
          <span className="lib-underline" />
        </div>

        <div className="lib-panel lib-tags-panel">
          <div className="lib-panel-title">Filter by tag</div>
          <span className="lib-underline" />
          <div className="lib-checks">
            {DEFAULT_TAGS.map(t => (
              <label key={t} className="lib-check">
                <input
                  type="checkbox"
                  checked={tagFilters.has(t)}
                  onChange={() => setTagFilters(prev => toggleSet(prev, t))}
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
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim();
                    if (val) setTagFilters(prev => toggleSet(prev, val));
                    e.currentTarget.value = '';
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
          {STATUS_LIST.map(s => (
            <label key={s} className="lib-check">
              <input
                type="checkbox"
                checked={statusFilters.has(s)}
                onChange={() => setStatusFilters(prev => toggleSet(prev, s))}
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
            ) : filteredRecent.length ? filteredRecent.map((g, i) => (
              <button
                key={g.id || i}
                type="button"
                className="recent-tile"
                onClick={() => handleGameInfoClick(g.id)}
                title={g.title}
              >
                <img src={g.imageUrl || 'https://via.placeholder.com/300x150/1e252e/657382?Text=No+Image'} alt={g.title || 'Game'} />
                <span className="recent-name">{g.title || 'Game'}</span>
              </button>
            )) : (
              <div className="recent-empty">No recent items</div>
            )}
          </div>
        </section>

        <section className="lib-panel lib-collections-panel">
          <div className="lib-panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Collections</span>
            <button className="linkish-btn" type="button" onClick={handleOpenCollections} title="Open Collections">
              Manage
            </button>
          </div>
          <div className="collections-row">
            <button className="collection-card add-card" type="button" title="Create collection" onClick={handleCreateCollection}>+</button>

            {userCollections && userCollections.length > 0 ? (
              userCollections.map((c) => {
                const cover = c.previewGames?.[0]?.imageUrl;
                return (
                  <div
                    className="collection-card clickable"
                    key={c.id}
                    title={`${c.name} (${c.gameCount})`}
                    onClick={() => handleOpenCollection(c.id)}
                  >
                    <div
                      className="collection-cover"
                      style={{ backgroundImage: cover ? `url(${cover})` : 'none' }}
                    >
                      <div className="collection-overlay">
                        <span className="collection-name">{c.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              [...new Set((games || []).map(g => g.category).filter(Boolean))].slice(0, 3).map((name, i) => {
                const sample = (games || []).find(g => g.category === name);
                return (
                  <div
                    className="collection-card clickable"
                    key={name || i}
                    title={`Create "${name}" collection`}
                    onClick={handleCreateCollection}
                  >
                    <div
                      className="collection-cover"
                      style={{ backgroundImage: sample?.imageUrl ? `url(${sample.imageUrl})` : 'none' }}
                    >
                      <div className="collection-overlay">
                        <span className="collection-name">{name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Library;