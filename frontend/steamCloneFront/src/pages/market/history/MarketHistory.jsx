import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MarketHistory.scss";
import Notification from "../../../components/Notification";
import { useGetHistoryQuery } from "../../../services/market/marketHistoryApi";
import { useGetUserItemsQuery } from "../../../services/market/marketApi";
import { useGetAllGamesQuery } from "../../../services/game/gameApi";

const fmtUAH = (n) => {
  const num = Number(n ?? 0);
  const digits = Number.isInteger(num) ? 0 : 2;
  return `${num.toLocaleString("uk-UA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

const formatDateTime = (iso) => {
  try {
    const d = new Date(iso);
    return d
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  } catch {
    return iso || "";
  }
};

const parseJwt = (token) => {
  try {
    const base = token.split(".")[1];
    const json = JSON.parse(atob(base.replace(/-/g, "+").replace(/_/g, "/")));
    return json || null;
  } catch {
    return null;
  }
};

const shortId = (s) => (s && s.length > 14 ? `${s.slice(0, 10)}…${s.slice(-4)}` : s || "");

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
          onClick={() => {
            onChange?.(o.key);
            onClose?.();
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default function MarketHistory() {
  const { data: histList = [], isFetching: loading, isError, error } = useGetHistoryQuery();
  const { data: userItemsRes } = useGetUserItemsQuery();
  const { data: gamesRes } = useGetAllGamesQuery();

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    null;
  const me = token ? parseJwt(token) : null;
  const myId = me?.id || me?.userId || null;

  const userItemMap = useMemo(() => {
    const arr = userItemsRes?.payload ?? userItemsRes ?? [];
    const map = new Map();
    if (Array.isArray(arr)) {
      for (const r of arr) {
        if (r?.id && r?.item) {
          map.set(r.id, {
            title: r.item.name || "Item",
            imageUrl: r.item.imageUrl || "/common/itemNoImage.png",
            gameId: r.item.gameId || null,
          });
        }
      }
    }
    return map;
  }, [userItemsRes]);

  const gameNameById = useMemo(() => {
    const list = gamesRes?.payload ?? gamesRes ?? [];
    const map = new Map();
    if (Array.isArray(list)) {
      list.forEach((g) => {
        const id = g?.id;
        const nm = g?.name ?? g?.title ?? g?.gameName ?? null;
        if (id && nm) map.set(id, nm);
      });
    }
    return map;
  }, [gamesRes]);

  const buys = useMemo(() => {
    const res = [];
    const src = Array.isArray(histList) ? histList : [];
    for (const r of src) {
      const buyerId = r?.buyerId ?? null;
      if (myId && buyerId !== myId) continue;
      const userItemId = r?.userItemId ?? null;
      const ui = userItemId ? userItemMap.get(userItemId) : null;
      const title = ui?.title ?? "Item";
      const img = ui?.imageUrl ?? "/common/itemNoImage.png";
      const game = ui?.gameId ? gameNameById.get(ui.gameId) || "Unknown" : "Unknown";
      const createdAt = r?.date ?? r?.createdAt ?? r?.timestamp ?? new Date().toISOString();
      res.push({
        id: r?.id ?? `hist-${Math.random()}`,
        title,
        game,
        img,
        price: Number(r?.price ?? r?.amount ?? 0),
        createdAt,
        sellerId: r?.sellerId ?? "",
      });
    }
    return res;
  }, [histList, userItemMap, gameNameById, myId]);

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
    const q = search.trim().toLowerCase();
    const filtered = q
      ? buys.filter(
          (i) =>
            (i.title || "").toLowerCase().includes(q) ||
            (i.game || "").toLowerCase().includes(q)
        )
      : buys.slice();

    const compare = (a, b) => {
      let A, B;
      if (sortKey === "date") {
        A = new Date(a.createdAt || 0).getTime();
        B = new Date(b.createdAt || 0).getTime();
      } else if (sortKey === "price") {
        A = a.price || 0;
        B = b.price || 0;
      } else {
        A = (a.title || "").toLowerCase();
        B = (b.title || "").toLowerCase();
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    };

    return filtered.sort(compare);
  }, [buys, search, sortKey, sortDir]);

  const copyPrice = async (item) => {
    const text = fmtUAH(item.price);
    try {
      await navigator.clipboard?.writeText(text);
      setNotif({ type: "success", msg: `Copied: ${text}` });
    } catch {
      setNotif({ type: "info", msg: text });
    }
  };

  const copySeller = async (sellerId) => {
    if (!sellerId) return;
    try {
      await navigator.clipboard?.writeText(sellerId);
      setNotif({ type: "success", msg: "Seller ID copied" });
    } catch {
      setNotif({ type: "info", msg: sellerId });
    }
  };

  const toggleSortDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <div className="mh-page">
      <div className="notif-wrap">
        <Notification
          message={
            notif?.msg ||
            (isError ? error?.data?.message || error?.error || "Failed to load history" : null)
          }
          type={notif?.type || (isError ? "error" : "info")}
          onClose={() => setNotif(null)}
        />
      </div>

      <div className="mh-panel flux-border">
        <div className="mh-header">
          <div className="mh-title-only">My buy orders</div>

          <div className="mh-right">
            <div className="mh-search">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search ? (
                <button className="mh-clear" aria-label="Clear" onClick={() => setSearch("")}>
                  ×
                </button>
              ) : (
                <span className="mh-ico">🔎</span>
              )}
            </div>
            <div className="mh-sort" ref={sortRef}>
              <span>Sort by:</span>
              <button
                className="mh-sort-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen((v) => !v);
                }}
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
            <div className="mh-empty-title">No records</div>
            <div className="mh-empty-desc">Your buy orders will appear here.</div>
          </div>
        ) : (
          <div className="mh-list" role="list">
            {view.map((it) => (
              <div className="mh-row" role="listitem" key={`buy-${it.id}`}>
                <div className="mh-left">
                  <img src={it.img} alt="" className="mh-thumb" />
                  <div className="mh-info">
                    <div className="mh-title" title={it.title}>
                      {it.title}
                    </div>
                    <div className="mh-game">{it.game}</div>
                  </div>
                </div>

                <button
                  className="pill mh-price"
                  onClick={() => copyPrice(it)}
                  title="Copy price"
                >
                  {fmtUAH(it.price)}
                </button>

                <div className="mh-meta">
                  <span className="pill small mh-created" title={new Date(it.createdAt).toISOString()}>
                    created • {formatDateTime(it.createdAt)}
                  </span>
                  {it.sellerId ? (
                    <button
                      className="pill small mh-peer"
                      onClick={() => copySeller(it.sellerId)}
                      title={it.sellerId}
                    >
                      seller: {shortId(it.sellerId)}
                    </button>
                  ) : (
                    <span className="pill small mh-peer ghost">seller: —</span>
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