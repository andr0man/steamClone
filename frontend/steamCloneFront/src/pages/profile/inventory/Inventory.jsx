import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../components/ProfileLayout';
import './inventory.scss';
import {
  Search as SearchIcon,
  ChevronDown,
  PackageOpen,
  Star,
  StarOff,
  Shirt,
  Gift,
  ShoppingCart,
  X,
  Check,
  Tag,
  Layers,
  Filter,
  Boxes,
} from 'lucide-react';

const LS_KEYS = {
  INV: 'mock:inventory-items',
  ACT: 'mock:inventory-activity',
  FRIENDS: 'mock:friends',
};

const formatUAH = (n) => {
  if (n == null) return '—';
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${Number(n).toLocaleString('uk-UA', { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Artifact'];
const QUALITY_ORDER = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

const RARITY_COLORS = {
  Common: '#9aa6b3',
  Uncommon: '#5bd7ae',
  Rare: '#4aa3ff',
  Epic: '#a178eb',
  Legendary: '#ffb84d',
  Artifact: '#ff6d6d',
};

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest', color: '#7C72DB' },
  { value: 'date_asc', label: 'Oldest', color: '#6A6391' },
  { value: 'price_desc', label: 'Price: High to Low', color: '#3DFFB3' },
  { value: 'price_asc', label: 'Price: Low to High', color: '#A178EB' },
  { value: 'name_asc', label: 'Name: A - Z', color: '#74BFF7' },
  { value: 'name_desc', label: 'Name: Z - A', color: '#FF9584' },
  { value: 'rarity_desc', label: 'Rarity', color: '#FFB84D' },
];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Dima', avatarUrl: 'https://i.pravatar.cc/80?img=12', status: 'online' },
  { id: 'f2', name: 'Ira', avatarUrl: 'https://i.pravatar.cc/80?img=32', status: 'offline' },
  { id: 'f3', name: 'Max', avatarUrl: 'https://i.pravatar.cc/80?img=3', status: 'in_game' },
];

const MOCK_ITEMS = [
  {
    id: 'cs2-ak-redline-ft',
    name: 'AK-47 | Redline (Field-Tested)',
    game: 'Counter Strike 2',
    type: 'Weapon Skin',
    rarity: 'Epic',
    quality: 'Field-Tested',
    priceUAH: 1620.5,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/olmroamo_expires_30_days.png',
    acquiredAt: '2025-08-02T12:11:00Z',
    quantity: 1,
    equipped: false,
    favorite: false,
    tags: ['AK-47', 'Rifle', 'Classic'],
  },
  {
    id: 'cs2-sticker-eg-holo-2021',
    name: 'Sticker | Evil Geniuses (Holo) | Stockholm 2021',
    game: 'Counter Strike 2',
    type: 'Sticker',
    rarity: 'Legendary',
    quality: null,
    priceUAH: 1042,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/nilby78x_expires_30_days.png',
    acquiredAt: '2025-07-28T12:11:00Z',
    quantity: 2,
    equipped: false,
    favorite: true,
    tags: ['Holo', '2021'],
  },
  {
    id: 'cs2-glove-case',
    name: 'Glove Case',
    game: 'Counter Strike 2',
    type: 'Case',
    rarity: 'Uncommon',
    quality: null,
    priceUAH: 725.32,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/wf7szjfh_expires_30_days.png',
    acquiredAt: '2025-07-31T09:01:00Z',
    quantity: 1,
    equipped: false,
    favorite: false,
    tags: ['Case'],
  },
  {
    id: 'cs2-fracture',
    name: 'Fracture Case',
    game: 'Counter Strike 2',
    type: 'Case',
    rarity: 'Common',
    quality: null,
    priceUAH: 22.83,
    tradable: true,
    marketable: true,
    onHoldUntil: '2025-09-10T00:00:00Z',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/tc2plpzm_expires_30_days.png',
    acquiredAt: '2025-09-03T18:00:00Z',
    quantity: 5,
    equipped: false,
    favorite: false,
    tags: ['Case', 'New'],
  },
  {
    id: 'tf2-key',
    name: 'Mann Co. Supply Crate Key',
    game: 'Team Fortress 2',
    type: 'Key',
    rarity: 'Rare',
    quality: null,
    priceUAH: 102,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/y98kj0u2_expires_30_days.png',
    acquiredAt: '2025-08-12T13:20:00Z',
    quantity: 3,
    equipped: false,
    favorite: false,
    tags: ['Key'],
  },
  {
    id: 'rust-door-skin',
    name: 'Garage Door Skin | Neon Bones',
    game: 'Rust',
    type: 'Skin',
    rarity: 'Epic',
    quality: 'Minimal Wear',
    priceUAH: 349,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/bwaiu0cv_expires_30_days.png',
    acquiredAt: '2025-08-03T10:00:00Z',
    quantity: 1,
    equipped: true,
    favorite: false,
    tags: ['Door', 'Base'],
  },
  {
    id: 'pubg-skin',
    name: 'PUBG: BATTLEGROUNDS Skin',
    game: 'PUBG: BATTLEGROUNDS',
    type: 'Outfit',
    rarity: 'Legendary',
    quality: 'Factory New',
    priceUAH: 349,
    tradable: false,
    marketable: false,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/6w5qhf4a_expires_30_days.png',
    acquiredAt: '2025-07-10T08:00:00Z',
    quantity: 1,
    equipped: false,
    favorite: false,
    tags: ['Bundle'],
  },
  {
    id: 'dota-ward',
    name: 'Dragon Tower Ward',
    game: 'Dota 2',
    type: 'Ward',
    rarity: 'Uncommon',
    quality: null,
    priceUAH: 75.5,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/tsciqtpd_expires_30_days.png',
    acquiredAt: '2025-06-12T08:00:00Z',
    quantity: 4,
    equipped: false,
    favorite: false,
    tags: ['Ward', 'Visual'],
  },
  {
    id: 'cs2-revolution',
    name: 'Revolution Case',
    game: 'Counter Strike 2',
    type: 'Case',
    rarity: 'Common',
    quality: null,
    priceUAH: 31.4,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/sy3ixsfp_expires_30_days.png',
    acquiredAt: '2025-07-21T08:00:00Z',
    quantity: 2,
    equipped: false,
    favorite: false,
    tags: ['Case'],
  },
  {
    id: 'cs2-kilowatt',
    name: 'Kilowatt Case',
    game: 'Counter Strike 2',
    type: 'Case',
    rarity: 'Uncommon',
    quality: null,
    priceUAH: 28.66,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/wxowmf2e_expires_30_days.png',
    acquiredAt: '2025-07-30T08:00:00Z',
    quantity: 1,
    equipped: false,
    favorite: false,
    tags: ['Case'],
  },
  {
    id: 'cs2-gallery',
    name: 'Gallery Case',
    game: 'Counter Strike 2',
    type: 'Case',
    rarity: 'Uncommon',
    quality: null,
    priceUAH: 39.74,
    tradable: false,
    marketable: false,
    onHoldUntil: '2025-09-15T00:00:00Z',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/olmroamo_expires_30_days.png',
    acquiredAt: '2025-09-03T09:00:00Z',
    quantity: 1,
    equipped: false,
    favorite: false,
    tags: ['Case', 'Hold'],
  },
  {
    id: 'bongo-emote',
    name: 'Bongo Cat Emote',
    game: 'Bongo Cat',
    type: 'Emote',
    rarity: 'Artifact',
    quality: null,
    priceUAH: 999.99,
    tradable: true,
    marketable: true,
    onHoldUntil: null,
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/j355i7ay_expires_30_days.png',
    acquiredAt: '2025-08-24T20:20:20Z',
    quantity: 1,
    equipped: true,
    favorite: true,
    tags: ['Cute', 'Chat'],
  },
];

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const unique = (arr) => Array.from(new Set(arr));
const isOnHold = (item) => item.onHoldUntil && new Date(item.onHoldUntil) > new Date();

const SortDropdown = ({ value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = useMemo(() => SORT_OPTIONS.find(o => o.value === value) || SORT_OPTIONS[0], [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className={`sort-dd ${className}`} ref={ref}>
      <button
        type="button"
        className={`sort-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Sort items"
      >
        <span className="dot" style={{ backgroundColor: current.color }} />
        <span className="label">{current.label}</span>
        <ChevronDown size={16} className="chev" />
      </button>

      {open && (
        <ul className="sort-menu" role="listbox" aria-label="Sort options">
          {SORT_OPTIONS.map(opt => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                className={`opt ${value === opt.value ? 'active' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                title={opt.label}
              >
                <span className="dot" style={{ backgroundColor: opt.color }} />
                <span className="label">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ItemCard = ({ item, checked, onCheck, onClick, stackMode = false }) => {
  const rColor = RARITY_COLORS[item.rarity] || '#a4a4a4';
  return (
    <div className={`inv-card ${!item.tradable ? 'not-tradable' : ''}`} onClick={onClick} title={item.name}>
      <div className="inv-thumb" style={{ borderColor: rColor }}>
        <img src={item.imageUrl || 'https://via.placeholder.com/300x180/1e252e/657382?Text=?'} alt={item.name} />
        {item.equipped && <span className="badge eq"><Shirt size={14} /> Equipped</span>}
        {isOnHold(item) && <span className="badge hold">On hold</span>}
        {!item.tradable && <span className="badge nt">Not tradable</span>}
        {item.favorite && <span className="badge fav"><Star size={14} /></span>}
        {stackMode && item.quantity > 1 && <span className="stack-qty"><Boxes size={14} /> x{item.quantity}</span>}
      </div>
      <div className="inv-meta">
        <div className="inv-name">{item.name}</div>
        <div className="inv-sub">
          <span className="game">{item.game}</span>
          <span className="dot">•</span>
          <span className="type">{item.type}</span>
          {item.quality ? (<><span className="dot">•</span><span className="quality">{item.quality}</span></>) : null}
        </div>
        <div className="inv-foot">
          <span className="price">{formatUAH(item.priceUAH)}</span>
          {typeof checked === 'boolean' && (
            <label className="sel">
              <input type="checkbox" checked={checked} onChange={(e) => onCheck?.(e.target.checked)} onClick={(e) => e.stopPropagation()} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

const SellModal = ({ open, onClose, onConfirm, item, selectionCount }) => {
  const [price, setPrice] = useState(item?.priceUAH || 0);
  const count = selectionCount || 1;
  useEffect(() => { if (open) setPrice(item?.priceUAH || 0); }, [open, item]);
  if (!open) return null;
  const quick = () => setPrice(Math.max(0, Number((price * 0.9).toFixed(2))));
  return (
    <div className="inv-modal">
      <div className="inv-modal-card">
        <div className="inv-modal-head">
          <h3><ShoppingCart size={18} /> List {count > 1 ? `${count} items` : `"${item?.name}"`}</h3>
          <button className="x" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="inv-modal-body">
          <div className="row">
            <label>Price per item</label>
            <div className="price-input">
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} />
              <span>₴</span>
            </div>
            <button className="ghost" onClick={quick} title="Suggest quick price (−10%)">Quick −10%</button>
          </div>
          <div className="muted">You will receive approximately {formatUAH(Math.max(0, price * 0.95))} per item after fees (simulated).</div>
        </div>
        <div className="inv-modal-foot">
          <button className="ghost" onClick={onClose}><X size={16} /> Cancel</button>
          <button className="rainbow" onClick={() => onConfirm(price)}><Check size={16} /> Confirm listing</button>
        </div>
      </div>
    </div>
  );
};

const GiftModal = ({ open, onClose, onConfirm, friends = MOCK_FRIENDS, selectionCount }) => {
  const [q, setQ] = useState('');
  const filtered = friends.filter(f => f.name.toLowerCase().includes(q.trim().toLowerCase()));
  if (!open) return null;
  return (
    <div className="inv-modal">
      <div className="inv-modal-card">
        <div className="inv-modal-head">
          <h3><Gift size={18} /> Send gift {selectionCount > 1 ? `(${selectionCount} items)` : ''}</h3>
          <button className="x" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="inv-modal-body">
          <div className="search-row">
            <SearchIcon size={16} />
            <input placeholder="Search friend" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="friends-list">
            {filtered.length ? filtered.map(f => (
              <button key={f.id} className="friend-row" onClick={() => onConfirm(f)}>
                <img src={f.avatarUrl} alt="" />
                <div className="meta">
                  <div className="name">{f.name}</div>
                  <div className={`st ${f.status}`}>{f.status}</div>
                </div>
              </button>
            )) : <div className="empty">No friends found</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [activity, setActivity] = useState([]);

  const [q, setQ] = useState('');
  const [gameFilter, setGameFilter] = useState('All Games');
  const [typeFilters, setTypeFilters] = useState(new Set());
  const [rarityFilters, setRarityFilters] = useState(new Set());
  const [qualityFilters, setQualityFilters] = useState(new Set());
  const [onlyTradable, setOnlyTradable] = useState(false);
  const [onlyOnHold, setOnlyOnHold] = useState(false);
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);
  const [sortBy, setSortBy] = useState('date_desc');

  const [stackMode, setStackMode] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  const [sellOpen, setSellOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  useEffect(() => {
    let inv = readLS(LS_KEYS.INV, null);
    if (!inv || !Array.isArray(inv) || inv.length === 0) {
      inv = MOCK_ITEMS;
      writeLS(LS_KEYS.INV, inv);
    }
    setItems(inv);
    const act = readLS(LS_KEYS.ACT, []);
    setActivity(act);
    const fr = readLS(LS_KEYS.FRIENDS, MOCK_FRIENDS);
    setFriends(fr.length ? fr : MOCK_FRIENDS);
  }, []);

  const uniqueGames = useMemo(() => ['All Games', ...unique((items || []).map(i => i.game).filter(Boolean))], [items]);
  const uniqueTypes = useMemo(() => unique((items || []).map(i => i.type).filter(Boolean)), [items]);
  const uniqueQualities = useMemo(() => unique((items || []).map(i => i.quality).filter(Boolean)), [items]);

  const toggleSet = (s, v) => {
    const next = new Set(s);
    if (next.has(v)) next.delete(v); else next.add(v);
    return next;
  };

  const stackKey = (it) => [it.game, it.name, it.type, it.rarity, it.quality].join('|');
  const stackedList = useMemo(() => {
    if (!stackMode) return items.slice();
    const map = new Map();
    for (const it of items) {
      const key = stackKey(it);
      if (!map.has(key)) map.set(key, { ...it });
      else map.get(key).quantity += it.quantity || 1;
    }
    return Array.from(map.values());
  }, [items, stackMode]);

  const processed = useMemo(() => {
    let list = stackedList.slice();
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(i =>
        (i.name || '').toLowerCase().includes(s) ||
        (i.game || '').toLowerCase().includes(s) ||
        (i.tags || []).some(t => (t || '').toLowerCase().includes(s))
      );
    }
    if (gameFilter !== 'All Games') list = list.filter(i => i.game === gameFilter);
    if (typeFilters.size) list = list.filter(i => typeFilters.has(i.type));
    if (rarityFilters.size) list = list.filter(i => rarityFilters.has(i.rarity));
    if (qualityFilters.size) list = list.filter(i => i.quality && qualityFilters.has(i.quality));
    if (onlyTradable) list = list.filter(i => i.tradable);
    if (onlyOnHold) list = list.filter(i => isOnHold(i));
    if (onlyDuplicates) list = list.filter(i => (i.quantity || 1) > 1);

    if (sortBy === 'price_desc') list.sort((a, b) => (b.priceUAH || 0) - (a.priceUAH || 0));
    if (sortBy === 'price_asc') list.sort((a, b) => (a.priceUAH || 0) - (b.priceUAH || 0));
    if (sortBy === 'name_asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (sortBy === 'name_desc') list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    if (sortBy === 'rarity_desc') list.sort((a, b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity));
    if (sortBy === 'date_desc') list.sort((a, b) => new Date(b.acquiredAt) - new Date(a.acquiredAt));
    if (sortBy === 'date_asc') list.sort((a, b) => new Date(a.acquiredAt) - new Date(b.acquiredAt));
    return list;
  }, [stackedList, q, gameFilter, typeFilters, rarityFilters, qualityFilters, onlyTradable, onlyOnHold, onlyDuplicates, sortBy]);

  const stats = useMemo(() => {
    const total = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const value = items.reduce((acc, it) => acc + (it.priceUAH || 0) * (it.quantity || 1), 0);
    const listed = items.filter(it => it.listedAt).length;
    const duplicates = items.filter(it => (it.quantity || 1) > 1).length;
    return { total, value, listed, duplicates };
  }, [items]);

  const selectionCount = selectedIds.size;
  const selectionList = useMemo(() => (items.filter(it => selectedIds.has(it.id))), [items, selectedIds]);

  const updateItems = (next) => { setItems(next); writeLS(LS_KEYS.INV, next); };
  const pushActivity = (entry) => {
    const next = [{ id: `${Date.now()}`, time: new Date().toISOString(), ...entry }, ...activity];
    setActivity(next);
    writeLS(LS_KEYS.ACT, next);
  };

  const toggleFavorite = (id) => {
    updateItems(items.map(it => it.id === id ? { ...it, favorite: !it.favorite } : it));
  };
  const toggleEquip = (id) => {
    updateItems(items.map(it => it.id === id ? { ...it, equipped: !it.equipped } : it));
  };

  const onSellSingle = (it) => { setSelectedItem(it); setSellOpen(true); };
  const onGiftSingle = () => { setGiftOpen(true); };

  const confirmSell = (price) => {
    const ids = selectionCount > 1 ? Array.from(selectedIds) : [selectedItem.id];
    const next = items.map(it => ids.includes(it.id) ? { ...it, listedAt: new Date().toISOString(), listingPrice: price } : it);
    updateItems(next);
    pushActivity({ type: 'listed_item', items: ids, price });
    setSellOpen(false);
    setSelectedIds(new Set());
    setSelectedItem(null);
  };

  const confirmGift = (friend) => {
    const ids = selectionCount > 1 ? Array.from(selectedIds) : [selectedItem.id];
    const next = items.map(it => ids.includes(it.id) ? { ...it, quantity: Math.max(0, (it.quantity || 1) - 1) } : it).filter(it => (it.quantity || 1) > 0);
    updateItems(next);
    pushActivity({ type: 'gift_sent', to: friend.name, items: ids });
    setGiftOpen(false);
    setSelectedIds(new Set());
    setSelectedItem(null);
  };

  const toggleSelect = (id, checked) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const removeListings = () => {
    const ids = Array.from(selectedIds);
    const next = items.map(it => ids.includes(it.id) ? ({ ...it, listedAt: null, listingPrice: null }) : it);
    updateItems(next);
    pushActivity({ type: 'listing_cancel', items: ids });
    clearSelection();
  };

  const stackDuplicates = () => setStackMode(true);
  const unstack = () => setStackMode(false);

  const sellViaMarketPage = useCallback(() => {
    const first = selectionList[0] || selectedItem;
    if (!first) return;
    navigate('/market/sell', { state: { fromInventory: true, item: first } });
  }, [navigate, selectionList, selectedItem]);

  return (
    <ProfileLayout>
      <div className="inventory-content">
        <aside className="inv-left">
          <div className="inv-panel">
            <div className="inv-input">
              <input
                type="text"
                placeholder="Search items"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              />
              <SearchIcon size={18} className="ico" />
            </div>
            <span className="inv-underline" />
          </div>

          <div className="inv-panel">
            <div className="inv-title">Games</div>
            <span className="inv-underline" />
            <div className="game-list">
              {uniqueGames.slice(0, 14).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGameFilter(g)}
                  className={`game-row ${gameFilter === g ? 'active' : ''}`}
                >
                  <PackageOpen size={16} />
                  <span>{g}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="inv-panel">
            <div className="inv-title">Filters</div>
            <span className="inv-underline" />
            <div className="check-group">
              <div className="group-title"><Filter size={14} /> Type</div>
              {uniqueTypes.map(t => (
                <label key={t} className="inv-check">
                  <input type="checkbox" checked={typeFilters.has(t)} onChange={() => setTypeFilters(prev => toggleSet(prev, t))} />
                  <span>{t}</span>
                </label>
              ))}
            </div>

            <div className="check-group">
              <div className="group-title"><Tag size={14} /> Rarity</div>
              {RARITY_ORDER.map(r => (
                <label key={r} className="inv-check">
                  <input type="checkbox" checked={rarityFilters.has(r)} onChange={() => setRarityFilters(prev => toggleSet(prev, r))} />
                  <span style={{ color: RARITY_COLORS[r] }}>{r}</span>
                </label>
              ))}
            </div>

            {uniqueQualities.length > 0 && (
              <div className="check-group">
                <div className="group-title"><Layers size={14} /> Quality</div>
                {uniqueQualities.map(ql => (
                  <label key={ql} className="inv-check">
                    <input type="checkbox" checked={qualityFilters.has(ql)} onChange={() => setQualityFilters(prev => toggleSet(prev, ql))} />
                    <span>{ql}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="split" />
            <label className="inv-check">
              <input type="checkbox" checked={onlyTradable} onChange={(e) => setOnlyTradable(e.target.checked)} />
              <span>Tradable only</span>
            </label>
            <label className="inv-check">
              <input type="checkbox" checked={onlyOnHold} onChange={(e) => setOnlyOnHold(e.target.checked)} />
              <span>On hold only</span>
            </label>
            <label className="inv-check">
              <input type="checkbox" checked={onlyDuplicates} onChange={(e) => setOnlyDuplicates(e.target.checked)} />
              <span>Only duplicates</span>
            </label>
          </div>
        </aside>

        <main className="inv-right">
          <section className="inv-panel inv-head">
            <div className="head-left">
              <div className="h-title">Inventory</div>
              <div className="stats">
                <div className="stat">
                  <span className="k">Items</span>
                  <span className="v">{stats.total}</span>
                </div>
                <div className="stat">
                  <span className="k">Value</span>
                  <span className="v">{formatUAH(stats.value)}</span>
                </div>
                <div className="stat">
                  <span className="k">Listed</span>
                  <span className="v">{stats.listed}</span>
                </div>
                <div className="stat">
                  <span className="k">Duplicates</span>
                  <span className="v">{stats.duplicates}</span>
                </div>
              </div>
            </div>
            <div className="head-right">
              <div className="switchers">
                <button
                  type="button"
                  className={`switch ${stackMode ? 'active' : ''}`}
                  onClick={stackDuplicates}
                  title="Stack duplicates"
                >
                  <Boxes size={14} /> Stack
                </button>
                <button
                  type="button"
                  className={`switch ${!stackMode ? 'active' : ''}`}
                  onClick={unstack}
                  title="Show individually"
                >
                  <Layers size={14} /> Unstack
                </button>
                <button
                  type="button"
                  className={`switch ${selectMode ? 'active' : ''}`}
                  onClick={() => { setSelectMode(v => !v); if (selectMode) clearSelection(); }}
                  title="Toggle select mode"
                >
                  {selectMode ? <Check size={14} /> : <Tag size={14} />} Select
                </button>
              </div>

              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </section>

          {selectMode && selectionCount > 0 && (
            <section className="inv-panel inv-bulk">
              <div className="bulk-left">
                <span className="sel-count">{selectionCount} selected</span>
                <button className="ghost" onClick={clearSelection}><X size={14} /> Clear</button>
              </div>
              <div className="bulk-right">
                <button className="ghost" onClick={() => setSellOpen(true)}><ShoppingCart size={16} /> Sell</button>
                <button className="ghost" onClick={() => setGiftOpen(true)}><Gift size={16} /> Gift</button>
                <button className="ghost" onClick={removeListings}><X size={16} /> Cancel listings</button>
                <button className="rainbow" onClick={sellViaMarketPage}>Sell via Market</button>
              </div>
            </section>
          )}

          <section className="inv-panel inv-list">
            {processed.length ? (
              <div className="inv-grid">
                {processed.map(it => (
                  <ItemCard
                    key={stackMode ? `${stackKey(it)}|stacked` : it.id}
                    item={it}
                    checked={selectMode ? selectedIds.has(it.id) : undefined}
                    onCheck={(ch) => toggleSelect(it.id, ch)}
                    onClick={() => {
                      if (selectMode) toggleSelect(it.id, !selectedIds.has(it.id));
                      else setSelectedItem(it);
                    }}
                    stackMode={stackMode}
                  />
                ))}
              </div>
            ) : (
              <div className="inv-empty">No items for current selection</div>
            )}
          </section>
        </main>
      </div>

      {selectedItem && !selectMode && (
        <div className="inv-drawer">
          <div className="drawer-card">
            <button className="x" onClick={() => setSelectedItem(null)} title="Close"><X size={18} /></button>
            <div className="drawer-body">
              <div className="preview">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} />
                <div className="labels">
                  <span className="lab" style={{ borderColor: RARITY_COLORS[selectedItem.rarity] }}>{selectedItem.rarity}</span>
                  {selectedItem.quality && <span className="lab">{selectedItem.quality}</span>}
                  {selectedItem.tradable ? <span className="lab ok">Tradable</span> : <span className="lab bad">Not tradable</span>}
                  {isOnHold(selectedItem) && <span className="lab warn">On hold</span>}
                </div>
              </div>
              <div className="info">
                <h3 className="name">{selectedItem.name}</h3>
                <div className="sub">
                  <span>{selectedItem.game}</span>
                  <span className="dot">•</span>
                  <span>{selectedItem.type}</span>
                  {selectedItem.quality && (<><span className="dot">•</span><span>{selectedItem.quality}</span></>)}
                </div>
                <div className="price-line">
                  <span className="price">{formatUAH(selectedItem.priceUAH)}</span>
                  {selectedItem.listedAt && <span className="listed">Listed at {formatUAH(selectedItem.listingPrice)} ({new Date(selectedItem.listedAt).toLocaleString()})</span>}
                </div>

                <div className="actions">
                  <button className="ghost" onClick={() => toggleFavorite(selectedItem.id)}>
                    {selectedItem.favorite ? <><StarOff size={16} /> Unfavorite</> : <><Star size={16} /> Favorite</>}
                  </button>
                  <button className="ghost" onClick={() => toggleEquip(selectedItem.id)}>
                    <Shirt size={16} /> {selectedItem.equipped ? 'Unequip' : 'Equip'}
                  </button>
                  <button className="ghost" disabled={!selectedItem.tradable} onClick={() => onGiftSingle()}>
                    <Gift size={16} /> Gift
                  </button>
                  <button className="rainbow" disabled={!selectedItem.marketable} onClick={() => onSellSingle(selectedItem)}>
                    <ShoppingCart size={16} /> Sell
                  </button>
                </div>

                {selectedItem.tags?.length ? (
                  <div className="tags">{selectedItem.tags.map((t, i) => <span key={`${t}-${i}`} className="tag">{t}</span>)}</div>
                ) : null}

                <div className="acq">Acquired: {new Date(selectedItem.acquiredAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SellModal
        open={sellOpen}
        onClose={() => setSellOpen(false)}
        onConfirm={confirmSell}
        item={selectedItem}
        selectionCount={selectionCount}
      />
      <GiftModal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        onConfirm={confirmGift}
        friends={friends}
        selectionCount={selectionCount}
      />
    </ProfileLayout>
  );
};

export default Inventory;