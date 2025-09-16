import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./buy.scss";
import Notification from "../../../components/Notification";
import { useBuyMarketItemMutation } from "../../../services/market/marketApi";
import { useGetBalanceQuery } from "../../../services/profile/profileApi";

const ITEM_SKEY = "BUY_ITEM_CACHE";

const fmtUAH = (n) => {
  const num = Number(n) || 0;
  const digits = Number.isInteger(num) ? 0 : 2;
  return `${num.toLocaleString("uk-UA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

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
    } catch { return null; }
  });

  const { data: balRes, refetch: refetchBalance } = useGetBalanceQuery();
  const balance =
    balRes?.payload?.balance ??
    balRes?.payload?.amount ??
    balRes?.balance ??
    balRes?.amount ?? 0;

  const [buyMarketItem, { isLoading: buying }] = useBuyMarketItemMutation();

  const [price, setPrice] = useState(() => Number(item?.priceUAH || 0));
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [notif, setNotif] = useState(null);

  useEffect(() => { setPrice(Number(item?.priceUAH || 0)); }, [item]);

  const total = useMemo(() => {
    const p = Math.max(0, Number(price) || 0);
    const q = Math.max(1, parseInt(qty, 10) || 1);
    return Math.round(p * q * 100) / 100;
  }, [price, qty]);

  const insufficient = Number(balance) < total;
  const valid = !!item && total > 0 && qty >= 1;

  const placeOrder = async () => {
    setError(""); setNotif(null);
    if (!valid) return setError("Fill price and quantity correctly.");
    if (insufficient) return setError("Insufficient balance. Please top up.");
    if (!item?.id) return setError("No market item id.");

    try {
      await buyMarketItem({ marketItemId: item.id }).unwrap();
      await refetchBalance();
      setNotif({ type: "success", msg: `Purchased "${item.name}" for ${fmtUAH(total)}` });
      setTimeout(() => navigate("/market", { replace: true }), 700);
    } catch (e) {
      setError(e?.data?.message || e?.error || "Purchase failed");
    }
  };

  if (!item) {
    return (
      <div className="buyx-page">
        <div className="buyx-top">
          <Link className="nav-link" to="/inventory">Inventory</Link>
          <Link className="nav-link" to="/market/history">Market History</Link>
          <span className="balance">Balance: {fmtUAH(balance)}</span>
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
    <div className="buyx-page">
      <Notification
        message={error || notif?.msg || null}
        type={error ? "error" : "success"}
        onClose={() => { setError(""); setNotif(null); }}
      />

      <div className="buyx-top">
        <button className="nav-link" onClick={() => navigate("/inventory")}>Inventory</button>
        <button className="nav-link" onClick={() => navigate("/market/history")}>Market History</button>
        <span className="balance">Balance: {fmtUAH(balance)}</span>
      </div>

      <div className="checkout">
        <div className="panel">
          <div className="left">
            <div className="title">Checkout</div>

            <label className="field">
              <span className="label">Price per item (market: {fmtUAH(item.priceUAH)})</span>
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
              <span className="label">Quantity of items</span>
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
                className={`svg-btn big ${!valid || insufficient || buying ? "disabled" : ""}`}
                onClick={placeOrder}
                disabled={!valid || insufficient || buying}
                title={insufficient ? "Insufficient balance" : "Place order"}
              >
                <img src="/authbc/placeorder.svg" alt="Place order" />
              </button>

              {insufficient && (
                <div className="hint warn">
                  Not enough balance for {fmtUAH(total)}. Top up to proceed.
                </div>
              )}
              {buying && <div className="hint">Processing…</div>}
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
              you agree to the Flux Subscriber Agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}