import React, { useEffect, useMemo, useRef, useState } from 'react';
import './MarketHistory.scss';
import Notification from '../../../components/Notification';

const ICONS = {
  more: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/y8179h42_expires_30_days.png',
  search: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/09z7ptbh_expires_30_days.png',
};

const IMG_STICKER = 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/nJZmgJCsJw/j597a8pi_expires_30_days.png';

const fmtUAH = (n) => `${(n ?? 0).toLocaleString('uk-UA')}₴`;
const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const formatHoldUntil = (iso) => {
  const d = new Date(iso);
  return `hold until ${d.getDate()} ${monthShort[d.getMonth()]}`;
};

const STORAGE_KEY = 'mh-data-v1';

const seedData = {
  hold: [
    {
      id: 'hold-1',
      title: 'Sticker | Evil Geniuses (Holo) | Stockholm 2021',
      game: 'Counter Strike 2',
      img: IMG_STICKER,
      price: 1042,
      net: 973,
      holdUntil: '2025-08-19T00:00:00.000Z',
      createdAt: '2025-08-12T12:00:00.000Z',
    },
    {
      id: 'hold-2',
      title: 'Sticker | FaZe Clan (Glitter) | Antwerp 2022',
      game: 'Counter Strike 2',
      img: IMG_STICKER,
      price: 649,
      net: 607,
      holdUntil: '2025-09-02T00:00:00.000Z',
      createdAt: '2025-08-17T18:40:00.000Z',
    },
  ],
  sell: [
    {
      id: 'sell-1',
      title: 'AK-47 | Redline (Field-Tested)',
      game: 'Counter Strike 2',
      img: IMG_STICKER,
      price: 749,
      net: 699,
      soldAt: '2025-08-10T14:25:00.000Z',
      createdAt: '2025-08-07T09:10:00.000Z',
    },
    {
      id: 'sell-2',
      title: 'AWP | Atheris (Minimal Wear)',
      game: 'Counter Strike 2',
      img: IMG_STICKER,
      price: 1129,
      net: 1053,
      soldAt: '2025-08-02T08:55:00.000Z',
      createdAt: '2025-07-30T12:33:00.000Z',
    },
  ],
  buy: [
    {
      id: 'buy-1',
      title: 'Case Key | Operation Breakout',
      game: 'Counter Strike 2',
      img: IMG_STICKER,
      price: 299,
      createdAt: '2025-08-15T16:00:00.000Z',
    },
    {
      id: 'buy-2',
      title: 'Case | Recoil',
      game: 'Counter Strike 2',
      img: IMG_STICKER,
      price: 89,
      createdAt: '2025-08-14T11:30:00.000Z',
    },
  ],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedData;
    const parsed = JSON.parse(raw);
    return {
      hold: Array.isArray(parsed.hold) ? parsed.hold : seedData.hold,
      sell: Array.isArray(parsed.sell) ? parsed.sell : seedData.sell,
      buy: Array.isArray(parsed.buy) ? parsed.buy : seedData.buy,
    };
  } catch {
    return seedData;
  }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

const SortPopover = ({ open, anchorRef, value, onChange, onClose }) => {
  if (!open) return null;
  const rect = anchorRef.current?.getBoundingClientRect();
  const style = rect
    ? { top: rect.bottom + 8 + window.scrollY, left: rect.left + window.scrollX }
    : { top: 0, left: 0 };

  const opts = [
    { key: 'date', label: 'Date' },
    { key: 'price', label: 'Price' },
    { key: 'title', label: 'Title' },
  ];

  return (
    <div className="mh-popover" style={style} role="menu">
      {opts.map(o => (
        <button
          key={o.key}
          className={`mh-pop-item ${value === o.key ? 'active' : ''}`}
          onClick={() => { onChange?.(o.key); onClose?.(); }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default function MarketHistory({ onSell }) {
  const [tab, setTab] = useState('hold'); 
  const [data, setData] = useState(loadData);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('date'); 
  const [sortDir, setSortDir] = useState('desc'); 
  const [notif, setNotif] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => { saveData(data); }, [data]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const view = useMemo(() => {
    const items = data[tab] || [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? items.filter(i =>
          i.title.toLowerCase().includes(q) || (i.game || '').toLowerCase().includes(q)
        )
      : items.slice();

    const compare = (a, b) => {
      let A, B;
      if (sortKey === 'date') {
        const key = tab === 'sell' ? 'soldAt' : 'createdAt';
        A = new Date(a[key] || a.createdAt || 0).getTime();
        B = new Date(b[key] || b.createdAt || 0).getTime();
      } else if (sortKey === 'price') {
        A = a.price || 0; B = b.price || 0;
      } else {
        A = (a.title || '').toLowerCase(); B = (b.title || '').toLowerCase();
      }
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    };

    return filtered.sort(compare);
  }, [data, tab, search, sortKey, sortDir]);

  const copyPrice = async (item) => {
    const text = item.net ? `${fmtUAH(item.price)} (${fmtUAH(item.net)})` : fmtUAH(item.price);
    try {
      await navigator.clipboard?.writeText(text);
      setNotif({ type: 'success', msg: `Скопійовано: ${text}` });
    } catch {
      setNotif({ type: 'info', msg: text });
    }
  };

  const removeHold = (id) => {
    if (!window.confirm('Видалити цей лот з холду?')) return;
    setData(prev => ({ ...prev, hold: prev.hold.filter(i => i.id !== id) }));
    setNotif({ type: 'success', msg: 'Айтем видалено з холду.' });
  };

  const cancelSale = (id) => {
    if (!window.confirm('Скасувати продаж?')) return;
    setData(prev => ({ ...prev, sell: prev.sell.filter(i => i.id !== id) }));
    setNotif({ type: 'success', msg: 'Продаж скасовано.' });
  };

  const cancelBuy = (id) => {
    if (!window.confirm('Скасувати ордер?')) return;
    setData(prev => ({ ...prev, buy: prev.buy.filter(i => i.id !== id) }));
    setNotif({ type: 'success', msg: 'Ордер скасовано.' });
  };

  const handleSell = () => {
    if (typeof onSell === 'function') onSell();
    else setNotif({ type: 'info', msg: 'Sell flow — скоро 😉' });
  };

  const toggleSortDir = () => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));

  return (
    <div className="mh-page">
      <div className="notif-wrap">
        <Notification
          message={notif?.msg || null}
          type={notif?.type || 'info'}
          onClose={() => setNotif(null)}
        />
      </div>

      <div className="mh-panel">
        {}
        <div className="mh-header">
          <div className="mh-tabs">
            <button
              className={`mh-tab ${tab === 'hold' ? 'active' : ''}`}
              onClick={() => setTab('hold')}
            >
              My items on hold
            </button>
            <span className="mh-slash">/</span>
            <button
              className={`mh-tab ${tab === 'sell' ? 'active' : ''}`}
              onClick={() => setTab('sell')}
            >
              My sell records
            </button>
            <span className="mh-slash">/</span>
            <button
              className={`mh-tab ${tab === 'buy' ? 'active' : ''}`}
              onClick={() => setTab('buy')}
            >
              My buy orders
            </button>
            <img src={ICONS.more} alt="" className="mh-icon" />
          </div>

          <div className="mh-right">
            <div className="mh-search">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search ? (
                <button className="mh-clear" aria-label="Clear" onClick={() => setSearch('')}>×</button>
              ) : (
                <img src={ICONS.search} alt="" />
              )}
            </div>
            <div className="mh-sort" ref={sortRef}>
              <span>Sort by:</span>
              <button
                className="mh-sort-btn"
                onClick={(e) => { e.stopPropagation(); setSortOpen((v) => !v); }}
                aria-haspopup="menu"
                aria-expanded={sortOpen}
              >
                {sortKey === 'date' ? 'Date' : sortKey === 'price' ? 'Price' : 'Title'}
              </button>
              <button
                className={`mh-dir ${sortDir}`}
                onClick={toggleSortDir}
                title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
                aria-label="Toggle sort direction"
              />
              <SortPopover
                open={sortOpen}
                anchorRef={sortRef}
                value={sortKey}
                onChange={setSortKey}
                onClose={() => setSortOpen(false)}
              />
            </div>
            <div className="mh-underline" />
          </div>
        </div>

        <div className="mh-subhead">
          <button className="mh-sell-cta" onClick={handleSell}>
            Sell an item
          </button>
          <div className="mh-subline" />
        </div>

        {}
        {view.length === 0 ? (
          <div className="mh-empty">
            <div className="mh-empty-art" />
            <div className="mh-empty-title">Немає записів</div>
            <div className="mh-empty-desc">
              Тут з’являться ваші {tab === 'hold' ? 'айтоми в холді' : tab === 'sell' ? 'історія продажів' : 'ордери на купівлю'}.
            </div>
            <button className="mh-sell-cta" onClick={handleSell}>Sell an item</button>
          </div>
        ) : (
          <div className="mh-list" role="list">
            {view.map((it) => (
              <div className="mh-row" role="listitem" key={`${tab}-${it.id}`}>
                <img src={it.img} alt="" className="mh-thumb" />
                <div className="mh-info">
                  <div className="mh-title" title={it.title}>{it.title}</div>
                  <div className="mh-game">{it.game}</div>
                </div>

                <button className="mh-price" onClick={() => copyPrice(it)} title="Copy price">
                  {it.net ? (
                    <>
                      {fmtUAH(it.price)} <span className="mh-net">({fmtUAH(it.net)})</span>
                    </>
                  ) : (
                    <>{fmtUAH(it.price)}</>
                  )}
                </button>

                <div className="mh-meta">
                  {tab === 'hold' && it.holdUntil && (
                    <span className="mh-hold">{formatHoldUntil(it.holdUntil)}</span>
                  )}
                  {tab === 'sell' && it.soldAt && (
                    <span className="mh-sold">
                      sold {new Date(it.soldAt).toLocaleDateString('en-GB')}
                    </span>
                  )}
                  {tab === 'buy' && (
                    <span className="mh-created">
                      created {new Date(it.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  )}
                </div>

                <div className="mh-action">
                  {tab === 'hold' && (
                    <button className="mh-link" onClick={() => removeHold(it.id)}>Remove</button>
                  )}
                  {tab === 'sell' && (
                    <button className="mh-link" onClick={() => cancelSale(it.id)}>Cancel sale</button>
                  )}
                  {tab === 'buy' && (
                    <button className="mh-link" onClick={() => cancelBuy(it.id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}