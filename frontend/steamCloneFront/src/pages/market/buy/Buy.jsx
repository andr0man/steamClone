import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './buy.scss';

const BALANCE_KEY = 'flux-balance-v1';
const HISTORY_KEY = 'mh-data-v1';
const ITEM_SKEY = 'BUY_ITEM_CACHE';

const fmtUAH = (n) => {
  const num = Number(n) || 0;
  const digits = Number.isInteger(num) ? 0 : 2;
  return `${num.toLocaleString('uk-UA', { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

function loadBalance() {
  try {
    const raw = localStorage.getItem(BALANCE_KEY);
    const v = raw ? parseFloat(raw) : 1200;
    return Number.isFinite(v) ? v : 1200;
  } catch {
    return 1200;
  }
}
function saveBalance(v) {
  try { localStorage.setItem(BALANCE_KEY, String(v)); } catch {}
}

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
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({
      hold: ensureArr(data.hold),
      sell: ensureArr(data.sell),
      buy: ensureArr(data.buy),
    }));
  } catch {}
}
function appendBuyRecord({ title, game, img, price }) {
  const data = loadHistory();
  const rec = {
    id: `buy-${Date.now()}`,
    title,
    game,
    img,
    price: Number(price) || 0,
    createdAt: new Date().toISOString(),
  };
  data.buy = [rec, ...data.buy];
  saveHistory(data);
  return rec;
}

export default function Buy() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(() => {
    if (state?.item) {
      try { sessionStorage.setItem(ITEM_SKEY, JSON.stringify(state.item)); } catch {}
      return state.item;
    }
    try {
      const raw = sessionStorage.getItem(ITEM_SKEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [balance, setBalance] = useState(loadBalance);
  const [price, setPrice] = useState(() => Number(item?.priceUAH || 0));
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => { setPrice(Number(item?.priceUAH || 0)); }, [item]);
  useEffect(() => { saveBalance(balance); }, [balance]);

  const total = useMemo(() => {
    const p = Math.max(0, Number(price) || 0);
    const q = Math.max(1, parseInt(qty, 10) || 1);
    return Math.round(p * q * 100) / 100;
  }, [price, qty]);

  const insufficient = balance < total;
  const valid = !!item && total > 0 && qty >= 1;

  const topUp = () => {
    const input = prompt('Top up balance (UAH):', '200');
    const sum = Number(input);
    if (Number.isFinite(sum) && sum > 0) setBalance(b => Math.max(0, b + sum));
  };

  const placeOrder = () => {
    setError('');
    if (!valid) return setError('Fill price and quantity correctly.');
    if (insufficient) return setError('Insufficient balance. Please top up.');

    if (balance < total) return setError('Insufficient balance.');
    setBalance(b => b - total);

    appendBuyRecord({
      title: item.name,
      game: item.game,
      img: item.imageUrl,
      price: total,
    });

    navigate('/market', { replace: true });
  };

  if (!item) {
    return (
      <div className="buy-page">
        <div className="top-rail">
          <span className="nav-link">Inventory</span>
          <span className="nav-link">Market History</span>
          <span className="balance">Balance:{fmtUAH(balance)}</span>
        </div>
        <div className="checkout missing">
          <div className="title">Checkout</div>
          <div className="msg">No item selected. Go back to Market.</div>
          <Link className="btn-back" to="/market">Back to market</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="buy-page">
      {/* Верхній рейл */}
      <div className="top-rail">
        <button className="nav-link" onClick={() => navigate('/inventory')}>Inventory</button>
        <button className="nav-link" onClick={() => navigate('/market/history')}>Market History</button>
        <span className="balance">Balance:{fmtUAH(balance)}</span>
      </div>

      <div className="checkout">
        <div className="panel">
          <div className="left">
            <div className="title">Checkout</div>

            <div className="pay-method">
              Payment method: Flux balance ({fmtUAH(balance)})
              <button className="svg-btn" onClick={topUp} title="Top up balance">
                <img src="/authbc/topupbalance.svg" alt="Top up balance" />
              </button>
            </div>

            <label className="field">
              <span className="label">
                Wanted price to pay per item ({fmtUAH(item.priceUAH)})
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={(e) => {
                  const n = Math.max(0, Number(e.target.value) || 0);
                  setPrice(Math.round(n * 100) / 100);
                }}
              />
              <span className="underline" />
            </label>

            <label className="field">
              <span className="label">Quantity of items (×{qty || 1})</span>
              <input
                type="number"
                min="1"
                step="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <span className="underline" />
            </label>

            <div className="place-row">
              <button
                className={`svg-btn big ${!valid || insufficient ? 'disabled' : ''}`}
                onClick={placeOrder}
                disabled={!valid || insufficient}
                title={insufficient ? 'Insufficient balance' : 'Place order'}
              >
                <img src="/authbc/placeorder.svg" alt="Place order" />
              </button>

              {insufficient && (
                <div className="hint warn">
                  Not enough balance for {fmtUAH(total)}. Top up to proceed.
                </div>
              )}
              {!!error && <div className="hint error">{error}</div>}
            </div>
          </div>

          <div className="right">
            <div className="right-head">Order Summary</div>

            <div className="summary">
              <div className="thumb">
                <img src={item.imageUrl} alt="" />
              </div>
              <div className="meta">
                <div className="name" title={item.name}>{item.name}</div>
                <div className="game">{item.game}</div>
              </div>
            </div>

            <div className="line" />

            <div className="kv">
              <span>Price</span>
              <span>{fmtUAH(price)}</span>
            </div>
            <div className="kv">
              <span>Quantity</span>
              <span>×{qty}</span>
            </div>

            <div className="line" />

            <div className="kv total">
              <span>Total</span>
              <span>{fmtUAH(total)}</span>
            </div>

            <p className="legal">
              You are placing an order for a digital license for this product.
              For full terms, see purchase policy. By selecting ‘Place Order’ below,
              you certify that you are over 18 and an authorized user of this payment method,
              and agree to the Flux Subscriber Agreement.
            </p>

            <div className="help">
              Need Help? <button className="link" onClick={() => alert('Support coming soon')}>Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}