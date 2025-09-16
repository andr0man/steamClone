import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MarketHistory.scss";
import Notification from "../../../components/Notification";
import { useGetMarketItemHistoryQuery } from "../../../services/market/marketApi";

const fmtUAH = (n) => `${(n ?? 0).toLocaleString("uk-UA")}₴`;
const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const formatHoldUntil = (iso) => {
  const d = new Date(iso);
  return `hold until ${d.getDate()} ${monthShort[d.getMonth()]}`;
};

const adaptHistory = (arr) => {
  const hold = [], sell = [], buy = [];
  for (const r of arr) {
    const item = r?.item ?? r?.itemDto ?? {};
    const rec = {
      id: r?.id ?? r?.historyId ?? `hist-${Math.random()}`,
      title: item?.name ?? r?.title ?? "Item",
      game: item?.game?.name ?? r?.game ?? "Unknown",
      img: item?.imageUrl ?? r?.img ?? "/common/itemNoImage.png",
      price: Number(r?.price ?? r?.amount ?? 0),
      net: Number(r?.net ?? 0) || undefined,
      createdAt: r?.createdAt ?? new Date().toISOString(),
      soldAt: r?.soldAt,
      holdUntil: r?.holdUntil,
    };
    const kind = String(r?.type ?? r?.status ?? "").toLowerCase();
    if (kind.includes("hold") || r?.holdUntil) hold.push(rec);
    else if (kind.includes("sell") || r?.soldAt) sell.push(rec);
    else buy.push(rec);
  }
  return { hold, sell, buy };
};

const SortPopover = ({ open, anchorRef, value, onChange, onClose }) => {
  if (!open) return null;
  const rect = anchorRef.current?.getBoundingClientRect();
  const style = rect
    ? { top: rect.bottom + 8 + window.scrollY, left: rect.left + window.scrollX }
    : { top: 0, left: 0 };

  const opts = [
    { key: "date", label: "Date" },
    { key: "price", label: "Price" },
    { key: "title", label: "Title" },
  ];

  return (
    <div className="mh-popover" style={style} role="menu">
      {opts.map((o) => (
        <button
          key={o.key}
          className={`mh-pop-item ${value === o.key ? "active" : ""}`}
          onClick={() => { onChange?.(o.key); onClose?.(); }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default function MarketHistory() {
  const { data: histRes, isFetching: loading, isError, error } = useGetMarketItemHistoryQuery();
  const historyArr = (histRes?.payload ?? histRes ?? []);
  const remote = Array.isArray(historyArr) ? adaptHistory(historyArr) : { hold: [], sell: [], buy: [] };

  const [tab, setTab] = useState("hold");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [notif, setNotif] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const view = useMemo(() => {
    const items = remote[tab] || [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? items.filter(i =>
          i.title.toLowerCase().includes(q) || (i.game || "").toLowerCase().includes(q)
        )
      : items.slice();

    const compare = (a, b) => {
      let A, B;
      if (sortKey === "date") {
        const key = tab === "sell" ? "soldAt" : "createdAt";
        A = new Date(a[key] || a.createdAt || 0).getTime();
        B = new Date(b[key] || b.createdAt || 0).getTime();
      } else if (sortKey === "price") {
        A = a.price || 0; B = b.price || 0;
      } else {
        A = (a.title || "").toLowerCase(); B = (b.title || "").toLowerCase();
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    };

    return filtered.sort(compare);
  }, [remote, tab, search, sortKey, sortDir]);

  const copyPrice = async (item) => {
    const text = item.net ? `${fmtUAH(item.price)} (${fmtUAH(item.net)})` : fmtUAH(item.price);
    try {
      await navigator.clipboard?.writeText(text);
      setNotif({ type: "success", msg: `Скопійовано: ${text}` });
    } catch {
      setNotif({ type: "info", msg: text });
    }
  };

  const toggleSortDir = () => setSortDir(d => (d === "asc" ? "desc" : "asc"));

  return (
    <div className="mh-page">
      <div className="notif-wrap">
        <Notification
          message={notif?.msg || (isError ? error?.data?.message || "Failed to load history" : null)}
          type={notif?.type || (isError ? "error" : "info")}
          onClose={() => setNotif(null)}
        />
      </div>

      <div className="mh-panel">
        <div className="mh-header">
          <div className="mh-tabs">
            <button className={`mh-tab ${tab === "hold" ? "active" : ""}`} onClick={() => setTab("hold")}>
              My items on hold
            </button>
            <span className="mh-slash">/</span>
            <button className={`mh-tab ${tab === "sell" ? "active" : ""}`} onClick={() => setTab("sell")}>
              My sell records
            </button>
            <span className="mh-slash">/</span>
            <button className={`mh-tab ${tab === "buy" ? "active" : ""}`} onClick={() => setTab("buy")}>
              My buy orders
            </button>
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
                <button className="mh-clear" aria-label="Clear" onClick={() => setSearch("")}>×</button>
              ) : (
                <span style={{ color: "#cfcfe6" }}>🔎</span>
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
                {sortKey === "date" ? "Date" : sortKey === "price" ? "Price" : "Title"}
              </button>
              <button
                className={`mh-dir ${sortDir}`}
                onClick={toggleSortDir}
                title={sortDir === "asc" ? "Ascending" : "Descending"}
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

        {loading ? (
          <div className="mh-empty">Loading history…</div>
        ) : view.length === 0 ? (
          <div className="mh-empty">
            <div className="mh-empty-art" />
            <div className="mh-empty-title">Немає записів</div>
            <div className="mh-empty-desc">
              Тут з’являться ваші {tab === "hold" ? "айтоми в холді" : tab === "sell" ? "історія продажів" : "ордери на купівлю"}.
            </div>
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
                  {tab === "hold" && it.holdUntil && (
                    <span className="mh-hold">{formatHoldUntil(it.holdUntil)}</span>
                  )}
                  {tab === "sell" && it.soldAt && (
                    <span className="mh-sold">
                      sold {new Date(it.soldAt).toLocaleDateString("en-GB")}
                    </span>
                  )}
                  {tab === "buy" && (
                    <span className="mh-created">
                      created {new Date(it.createdAt).toLocaleDateString("en-GB")}
                    </span>
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