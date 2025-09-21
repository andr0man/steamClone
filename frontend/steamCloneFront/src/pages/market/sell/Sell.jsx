import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./sell.scss";
import Notification from "../../../components/Notification";
import { useGetUserItemsByUserQuery } from "../../../services/inventory/inventoryApi";
import { usePutUpForSaleMutation } from "../../../services/market/marketApi";
import { useGetAllGamesQuery } from "../../../services/game/gameApi";

const fmtUAH = (n) => {
  const num = Number(n ?? 0);
  const digits = Number.isInteger(num) ? 0 : 2;
  return `${num.toLocaleString("uk-UA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

export default function Sell() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { data, isFetching, isError, error } = useGetUserItemsByUserQuery();
  const { data: gamesRes } = useGetAllGamesQuery();
  const [putUpForSale, { isLoading }] = usePutUpForSaleMutation();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(state?.item?.id || "");
  const [price, setPrice] = useState(() =>
    state?.item?.priceUAH ? Number(state.item.priceUAH) : ""
  );
  const [notif, setNotif] = useState(null);
  const [err, setErr] = useState(null);

  const gamesById = useMemo(() => {
    const list = gamesRes?.payload ?? gamesRes ?? [];
    const map = new Map();
    if (Array.isArray(list)) {
      list.forEach((g) => {
        if (g?.id) {
          map.set(g.id, {
            name: g?.name ?? g?.title ?? "Unknown",
            genres: Array.isArray(g?.genres)
              ? g.genres.map((x) => x?.name).filter(Boolean)
              : [],
          });
        }
      });
    }
    return map;
  }, [gamesRes]);

  const items = useMemo(() => {
    const list = data?.payload ?? data ?? [];
    if (!Array.isArray(list)) return [];
    return list.map((u) => {
      const gameId = u?.item?.gameId ?? u?.item?.game?.id ?? null;
      const gameNameRaw = u?.item?.game?.name ?? "Unknown";
      const gameMeta = gameId ? gamesById.get(gameId) : null;
      const gameName = gameMeta?.name ?? gameNameRaw ?? "Unknown";
      const genres =
        Array.isArray(u?.item?.game?.genres)
          ? u.item.game.genres.map((g) => g?.name).filter(Boolean)
          : Array.isArray(u?.item?.genres)
          ? u.item.genres.map((g) => (typeof g === "string" ? g : g?.name)).filter(Boolean)
          : Array.isArray(u?.item?.tags)
          ? u.item.tags.map((t) => (typeof t === "string" ? t : t?.name)).filter(Boolean)
          : gameMeta?.genres ?? [];
      const tags = Array.from(new Set(genres.filter(Boolean)));
      return {
        id: u?.id ?? u?.userItemId,
        title: u?.item?.name ?? "Item",
        gameId,
        game: gameName,
        img: u?.item?.imageUrl ?? "/common/itemNoImage.png",
        tradable: u?.isTradable ?? true,
        basePrice: Number(u?.item?.price ?? 0),
        tags,
      };
    });
  }, [data, gamesById]);

  useEffect(() => {
    if (!selectedId && items.length) {
      setSelectedId(state?.item?.id || items[0].id);
    }
  }, [items, selectedId, state?.item?.id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        (i.title || "").toLowerCase().includes(q) ||
        (i.game || "").toLowerCase().includes(q) ||
        (i.tags || []).some((t) => (t || "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId),
    [items, selectedId]
  );

  const pNum = Number(price);
  const hasPrice = Number.isFinite(pNum) && pNum > 0;
  const canSell = !!selectedId && hasPrice && !isLoading && (selected?.tradable ?? true);

  const autofillBase = () => {
    if (selected?.basePrice) setPrice(selected.basePrice);
  };

  const onPriceChange = (v) => {
    const raw = v.trim();
    if (raw === "") {
      setPrice("");
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setPrice(raw);
  };

  const submit = async () => {
    setErr(null);
    const p = Number(price);
    if (!selectedId) return setErr("Select an item to sell");
    if (!Number.isFinite(p) || p <= 0) return setErr("Enter a valid price (UAH)");
    if (selected && !selected.tradable) return setErr("This item is not tradable");
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
        message={
          err ||
          notif?.msg ||
          (isError ? error?.data?.message || "Failed to load inventory" : null)
        }
        type={err || isError ? "error" : "success"}
        onClose={() => {
          setErr(null);
          setNotif(null);
        }}
      />

      <header className="sellx-top">
        <button className="back-button" onClick={() => navigate("/market")}>
          Back to Market
        </button>
        <div className="title">Put up for sale</div>
        <div className="spacer" />
      </header>

      <div className="sellx-card flux-border">
        <div className="left">
          <div className="picker-head">
            <div className="ph-title">Choose item</div>
            <div className="ph-search">
              <input
                type="text"
                placeholder="Search your items"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search ? (
                <button
                  className="ph-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear"
                >
                  ×
                </button>
              ) : (
                <span className="ph-ico">🔎</span>
              )}
            </div>
          </div>

          <div className="games-grid sell-grid">
            {isFetching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="sell-card skeleton">
                  <div className="sell-card-thumb sk" />
                  <div className="sell-card-body">
                    <div className="sell-card-title sk sk-text" />
                    <div className="sell-card-chips">
                      <span className="chip sk sk-chip" />
                      <span className="chip sk sk-chip" />
                    </div>
                    <div className="sell-card-bottom">
                      <div className="sell-card-price sk sk-text sm" />
                      <span className="select-btn sk sk-btn" />
                    </div>
                  </div>
                </div>
              ))
            ) : filtered.length ? (
              filtered.map((u) => {
                const active = selectedId === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    className={`sell-card ${active ? "selected" : ""} ${!u.tradable ? "disabled" : ""}`}
                    onClick={() => setSelectedId(u.id)}
                    title={u.tradable ? `${u.title} (${u.game})` : "Not tradable"}
                  >
                    <div className="sell-card-thumb">
                      <img src={u.img} alt={u.title} />
                      {!u.tradable && (
                        <div className="card-flag notrade">Not tradable</div>
                      )}
                    </div>
                    <div className="sell-card-body">
                      <div className="sell-card-title" title={u.title}>
                        {u.title}
                      </div>
                      <div className="sell-card-chips">
                        <span className="chip game">{u.game}</span>
                        {(u.tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="chip">{t}</span>
                        ))}
                        <span className={`chip ${u.tradable ? "ok" : "nt"}`}>
                          {u.tradable ? "Tradable" : "Not tradable"}
                        </span>
                      </div>
                      <div className="sell-card-bottom">
                        <div className="sell-card-price">
                          {u.basePrice ? fmtUAH(u.basePrice) : "—"}
                        </div>
                        <span className={`select-btn ${active ? "is-active" : ""}`}>
                          {active ? "Selected" : "Select"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="sell-empty">No items found</div>
            )}
          </div>

          <div className="sell-price-card">
            <div className="pp-row">
              <label className="pp-label">Price (UAH)</label>
              <div className="pp-input">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={price}
                  onChange={(e) => onPriceChange(e.target.value)}
                  placeholder={selected?.basePrice ? String(selected.basePrice) : "0"}
                />
                <span className="suffix">₴</span>
              </div>
              <div className="pp-actions">
                <button
                  className="create-genre-btn mini"
                  onClick={autofillBase}
                  disabled={!selected?.basePrice}
                  title={
                    selected?.basePrice
                      ? `Use base: ${fmtUAH(selected.basePrice)}`
                      : "No base price"
                  }
                >
                  Use base
                </button>
              </div>
            </div>

            {hasPrice && (
              <div className="pp-breakdown alt">
                <div className="kv">
                  <span>Listing price</span>
                  <span className="pill small">{fmtUAH(pNum)}</span>
                </div>
              </div>
            )}

            {!selected?.tradable && (
              <div className="warn">
                This item is not tradable. You cannot list it on the market.
              </div>
            )}
            {hasPrice && selected?.basePrice && pNum < selected.basePrice && (
              <div className="hint">
                Entered price is lower than base price ({fmtUAH(selected.basePrice)}).
              </div>
            )}
          </div>

          <div className="actions button-items-group">
            <button className="back-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="rainbow-button" onClick={submit} disabled={!canSell}>
              {isLoading ? "Listing…" : "Put up for sale"}
            </button>
          </div>
        </div>

        <div className="right">
          <div className="head">Preview</div>
          <div className="preview flux-border">
            <div className="thumb">
              <div className="thumb-ratio">
                <img src={selected?.img || "/common/itemNoImage.png"} alt="" />
              </div>
            </div>
            <div className="meta">
              <div className="name" title={selected?.title}>
                {selected?.title || "—"}
              </div>
              <div className="game">{selected?.game || "—"}</div>
              <div className="tags-row">
                {(selected?.tags || []).slice(0, 5).map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
              <div className={`trade ${selected?.tradable ? "ok" : "nt"}`}>
                {selected?.tradable ? "Tradable" : "Not tradable"}
              </div>
            </div>
          </div>
          <div className="line" />
          <div className="kv">
            <span>Listing price</span>
            {hasPrice ? (
              <span className="pill">{fmtUAH(pNum)}</span>
            ) : (
              <span className="pill">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}