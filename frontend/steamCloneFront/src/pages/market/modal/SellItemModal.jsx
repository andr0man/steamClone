import React, { useMemo, useState } from 'react';
import './sell-modal.scss';

const HISTORY_KEY = 'mh-data-v1';
const FEE_RATE = 0.065;

function ensureArr(a) { return Array.isArray(a) ? a : []; }
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return { hold: [], sell: [], buy: [] };
    const parsed = JSON.parse(raw);
    return {
      hold: ensureArr(parsed.hold),
      sell: ensureArr(parsed.sell),
      buy: ensureArr(parsed.buy),
    };
  } catch {
    return { hold: [], sell: [], buy: [] };
  }
}
function saveHistory(data) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(data)); } catch {}
}

export default function SellItemModal({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Counter Strike 2');
  const [img, setImg] = useState('https://via.placeholder.com/158x74/16161c/fff?text=Item');
  const [price, setPrice] = useState('');
  const [holdDays, setHoldDays] = useState(7);

  const p = Math.max(0, Number(price) || 0);
  const net = useMemo(() => Math.round(p * (1 - FEE_RATE)), [p]);

  if (!open) return null;

  const createListing = () => {
    if (!title || !p) return;
    const data = loadHistory();
    const rec = {
      id: `hold-${Date.now()}`,
      title,
      game,
      img,
      price: p,
      net,
      holdUntil: new Date(Date.now() + (Math.max(1, holdDays) * 86400e3)).toISOString(),
      createdAt: new Date().toISOString(),
    };
    data.hold = [rec, ...data.hold];
    saveHistory(data);
    onClose?.('created');
  };

  return (
    <div className="sell-modal-overlay" onClick={() => onClose?.()}>
      <div className="sell-modal" onClick={(e) => e.stopPropagation()}>
        <div className="head">
          <div className="t">Sell item</div>
          <button className="x" onClick={() => onClose?.()} aria-label="Close">×</button>
        </div>

        <label className="row">
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AWP | Atheris (Minimal Wear)" />
        </label>

        <label className="row">
          <span>Game</span>
          <input value={game} onChange={(e) => setGame(e.target.value)} placeholder="Counter Strike 2" />
        </label>

        <label className="row">
          <span>Image URL</span>
          <input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." />
        </label>

        <label className="row">
          <span>Price (UAH)</span>
          <input type="number" min="1" step="1" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>

        <label className="row">
          <span>Hold (days)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={holdDays}
            onChange={(e) => setHoldDays(Math.max(1, parseInt(e.target.value || '7', 10)))}
          />
        </label>

        <div className="net">Net after fee ({Math.round(FEE_RATE * 100)}%): <b>{net}₴</b></div>

        <div className="actions">
          <button className="btn ghost" onClick={() => onClose?.()}>Cancel</button>
          <button className="btn primary" onClick={createListing} disabled={!title || !p}>Create listing</button>
        </div>
      </div>
    </div>
  );
}