import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./sell.scss";
import Notification from "../../../components/Notification";
import { useGetUserItemsByUserQuery } from "../../../services/inventory/inventoryApi";
import { usePutUpForSaleMutation } from "../../../services/market/marketApi";

const fmtUAH = (n) => {
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${Number(n ?? 0).toLocaleString("uk-UA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

export default function Sell() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { data, isFetching, isError, error } = useGetUserItemsByUserQuery();
  const [putUpForSale, { isLoading }] = usePutUpForSaleMutation();

  const userItems = useMemo(() => {
    const list = data?.payload ?? data ?? [];
    if (!Array.isArray(list)) return [];
    return list.map((u) => ({
      id: u?.id ?? u?.userItemId,
      title: u?.item?.name ?? "Item",
      game: u?.item?.game?.name ?? "Unknown",
      img: u?.item?.imageUrl ?? "/common/itemNoImage.png",
      tradable: u?.isTradable ?? true,
      basePrice: Number(u?.item?.price ?? 0),
    }));
  }, [data]);

  const firstId = userItems[0]?.id || "";
  const [selectedId, setSelectedId] = useState(state?.item?.id || firstId);
  const selected = useMemo(() => userItems.find((x) => x.id === selectedId), [userItems, selectedId]);

  const [price, setPrice] = useState(() => (state?.item?.priceUAH ? Number(state.item.priceUAH) : ""));
  const [notif, setNotif] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async () => {
    setErr(null);
    const p = Number(price);
    if (!selectedId) return setErr("Select an item to sell");
    if (!Number.isFinite(p) || p <= 0) return setErr("Enter valid price (UAH)");
    try {
      await putUpForSale({ userItemId: selectedId, price: p }).unwrap();
      setNotif({ type: "success", msg: `Listed "${selected?.title}" for ${fmtUAH(p)}` });
      setTimeout(() => navigate("/market", { replace: true }), 700);
    } catch (e) {
      setErr(e?.data?.message || e?.error || "Failed to list item");
    }
  };

  return (
    <div className="sellx-page">
      <Notification
        message={err || notif?.msg || (isError ? error?.data?.message || "Failed to load inventory" : null)}
        type={err || isError ? "error" : "success"}
        onClose={() => { setErr(null); setNotif(null); }}
      />

      <header className="sellx-top">
        <button className="ghost" onClick={() => navigate("/market")}>⬅ Back to Market</button>
        <div className="title">Put up for sale</div>
        <div className="spacer" />
      </header>

      <div className="sellx-card">
        <div className="left">
          <label className="row">
            <span>Choose item</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={isFetching || !userItems.length}
            >
              <option value="" disabled>— select —</option>
              {userItems.map((u) => (
                <option key={u.id} value={u.id} disabled={!u.tradable}>
                  {u.title} ({u.game}) {u.tradable ? "" : " — not tradable"}
                </option>
              ))}
            </select>
          </label>

          <label className="row">
            <span>Price (UAH)</span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={selected?.basePrice ? String(selected.basePrice) : "0"}
            />
          </label>

          <div className="net">
            You receive (simulated after fees ~5%): <b>{fmtUAH(Math.round(Number(price || 0) * 0.95))}</b>
          </div>

          <div className="actions">
            <button className="btn ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn primary" onClick={submit} disabled={isLoading || !selectedId || !Number(price)}>
              {isLoading ? "Listing…" : "Put up for sale"}
            </button>
          </div>
        </div>

        <div className="right">
          <div className="head">Preview</div>
          <div className="preview">
            <div className="thumb">
              <img src={selected?.img || "/common/itemNoImage.png"} alt="" />
            </div>
            <div className="meta">
              <div className="name" title={selected?.title}>{selected?.title || "—"}</div>
              <div className="game">{selected?.game || "—"}</div>
            </div>
          </div>
          <div className="line" />
          <div className="kv">
            <span>Price</span>
            <span>{fmtUAH(price || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}