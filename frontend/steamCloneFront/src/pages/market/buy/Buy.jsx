import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./buy.scss";
import Notification from "../../../components/Notification";
import { useBuyMarketMutation } from "../../../services/market/marketBuyApi";
import { useGetBalanceQuery } from "../../../services/profile/profileApi";
import { Wallet } from "lucide-react";

const ITEM_SKEY = "BUY_ITEM_CACHE";

const fmtUAH = (n) =>
  `${Number(n || 0).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}₴`;

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
    typeof balRes?.payload === "number"
      ? balRes.payload
      : balRes?.payload?.balance ??
        balRes?.payload?.amount ??
        balRes?.balance ??
        balRes?.amount ??
        0;

  const [buy, { isLoading: buying }] = useBuyMarketMutation();

  const [error, setError] = useState("");
  const [notif, setNotif] = useState(null);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (state?.item) setItem(state.item);
  }, [state?.item]);

  const price = Number(item?.priceUAH ?? item?.price ?? 0);
  const quantity = 1;
  const total = price * quantity;

  const insufficient = Number(balance) < total;
  const valid = !!item?.id && total > 0 && agree;

  const placeOrder = async () => {
    setError(""); setNotif(null);
    if (!item?.id) return setError("No selected item.");
    if (!agree) return setError("Please confirm you agree with the purchase terms.");
    if (insufficient) return setError("Insufficient funds. Please top up your balance.");
    try {
      await buy(item.id).unwrap();
      await refetchBalance();
      try { sessionStorage.removeItem(ITEM_SKEY); } catch {}
      setNotif({ type: "success", msg: `Purchased "${item.name}" for ${fmtUAH(total)}` });
      setTimeout(() => navigate("/market", { replace: true }), 700);
    } catch (e) {
      setError(e?.data?.message || e?.error || "Failed to place the order");
    }
  };

  const breakdown = useMemo(() => {
    const pay = total;
    return { pay };
  }, [total]);

  if (!item) {
    return (
      <div className="buyx-page">
        <div className="buyx-top">
          <button className="back-button" onClick={() => navigate("/market")}>Back to Market</button>
          <div className="spacer" />
          <button className="nav-link" onClick={() => navigate("/profile/inventory")}>Inventory</button>
          <button className="nav-link" onClick={() => navigate("/market/history")}>Market History</button>
          <div className="wallet-chip" title="Wallet balance">
            <Wallet size={16} />
            <span>{fmtUAH(balance)}</span>
          </div>
        </div>

        <div className="checkout missing flux-border">
          <div className="title">Checkout</div>
          <div className="msg">No selected item. Go back to Market.</div>
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
        <button className="back-button" onClick={() => navigate("/market")}>Back to Market</button>
        <div className="spacer" />
        <button className="nav-link" onClick={() => navigate("/profile/inventory")}>Inventory</button>
        <button className="nav-link" onClick={() => navigate("/market/history")}>Market History</button>
        <div className={`wallet-chip ${insufficient ? "low" : ""}`} title="Wallet balance">
          <Wallet size={16} />
          <span>{fmtUAH(balance)}</span>
        </div>
      </div>

      <div className="checkout">
        <div className="panel flux-border">
          <div className="left">
            <div className="title">Checkout</div>

            <div className="field readonly">
              <span className="label">Price</span>
              <div className="value">{fmtUAH(price)}</div>
              <span className="underline" />
            </div>

            <div className="field readonly">
              <span className="label">Quantity</span>
              <div className="value">×{quantity}</div>
              <span className="underline" />
            </div>

            <div className="pp-breakdown alt">
              <div className="kv total">
                <span>Total to pay</span>
                <span className="pill">{fmtUAH(breakdown.pay)}</span>
              </div>
            </div>

            <div className="agree-row">
              <label className="agree-check">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I agree to the purchase terms and the Flux Subscriber Agreement. By continuing I confirm the purchase is final.
                </span>
              </label>
              {insufficient && (
                <div className="warn">
                  Insufficient funds for {fmtUAH(total)}. Please top up your balance.
                </div>
              )}
            </div>

            <div className="place-row">
              <button
                className="rainbow-button"
                onClick={placeOrder}
                disabled={!valid || buying || insufficient}
                title={insufficient ? "Insufficient funds" : "Place order"}
              >
                {buying ? "Processing…" : "Place order"}
              </button>
            </div>
          </div>

          <div className="right">
            <div className="right-head">Order Summary</div>

            <div className="summary flux-border">
              <div className="thumb">
                <div className="thumb-ratio">
                  <img src={item.imageUrl || "/common/itemNoImage.png"} alt={item.name} />
                </div>
              </div>
              <div className="meta">
                <div className="name" title={item.name}>{item.name}</div>
                <div className="game">{item.game}</div>
                <div className="pill">{fmtUAH(total)}</div>
              </div>
            </div>

            <div className="line" />

            <div className="kv">
              <span>Price</span>
              <span className="pill small">{fmtUAH(price)}</span>
            </div>
            <div className="kv">
              <span>Quantity</span>
              <span className="pill small">×{quantity}</span>
            </div>

            <div className="line" />

            <div className="kv total">
              <span>Total</span>
              <span className="pill">{fmtUAH(total)}</span>
            </div>

            <p className="legal">
              You are placing an order for a digital product. All sales are final. By confirming this order, you agree to the service terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}