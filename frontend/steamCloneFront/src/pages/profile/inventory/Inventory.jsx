import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "../components/ProfileLayout";
import "./inventory.scss";
import {
  Search as SearchIcon,
  ChevronDown,
  PackageOpen,
  Star,
  Shirt,
  ShoppingCart,
  X,
  Check,
  Tag,
  Layers,
  Filter,
  Boxes,
  Wallet,
} from "lucide-react";
import { useGetUserItemsByUserQuery } from "../../../services/inventory/inventoryApi";
import { usePutUpForSaleMutation } from "../../../services/market/marketApi";
import { useGetBalanceQuery } from "../../../services/profile/profileApi";

const formatUAH = (n) => {
  if (n == null) return "—";
  const digits = Number.isInteger(n) ? 0 : 2;
  return `${Number(n).toLocaleString("uk-UA", { minimumFractionDigits: digits, maximumFractionDigits: digits })}₴`;
};

const RARITY_ORDER = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Artifact"];
const RARITY_COLORS = {
  Common: "#9aa6b3",
  Uncommon: "#5bd7ae",
  Rare: "#4aa3ff",
  Epic: "#a178eb",
  Legendary: "#ffb84d",
  Artifact: "#ff6d6d",
};

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest", color: "#7C72DB" },
  { value: "date_asc", label: "Oldest", color: "#6A6391" },
  { value: "price_desc", label: "Price: High to Low", color: "#3DFFB3" },
  { value: "price_asc", label: "Price: Low to High", color: "#A178EB" },
  { value: "name_asc", label: "Name: A - Z", color: "#74BFF7" },
  { value: "name_desc", label: "Name: Z - A", color: "#FF9584" },
  { value: "rarity_desc", label: "Rarity", color: "#FFB84D" },
];

const unique = (arr) => Array.from(new Set(arr));
const isOnHold = (item) => item.onHoldUntil && new Date(item.onHoldUntil) > new Date();

const mapUserItems = (resp) => {
  const list = resp?.payload ?? resp ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const it = row?.item ?? row;
    const price = Number(it?.price ?? it?.priceUAH ?? 0);
    return {
      id: row?.id ?? it?.id,
      name: it?.name ?? "Item",
      game: it?.game?.name ?? it?.game ?? "Unknown",
      type: it?.type ?? "Item",
      rarity: it?.rarity ?? "Common",
      quality: it?.quality ?? null,
      priceUAH: price,
      tradable: row?.tradable ?? it?.tradable ?? true,
      marketable: row?.marketable ?? it?.marketable ?? true,
      onHoldUntil: row?.onHoldUntil ?? it?.onHoldUntil ?? null,
      imageUrl: it?.imageUrl ?? "/common/itemNoImage.png",
      acquiredAt: row?.acquiredAt ?? it?.acquiredAt ?? new Date().toISOString(),
      quantity: row?.quantity ?? it?.quantity ?? 1,
      equipped: row?.equipped ?? false,
      favorite: row?.favorite ?? false,
      tags: Array.isArray(it?.tags) ? it.tags : [],
    };
  });
};

const SortDropdown = ({ value, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = useMemo(() => SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0], [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className={`sort-dd ${className}`} ref={ref}>
      <button
        type="button"
        className={`sort-btn ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
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
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value} role="option" aria-selected={value === opt.value}>
              <button
                type="button"
                className={`opt ${value === opt.value ? "active" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
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
  const rColor = RARITY_COLORS[item.rarity] || "#a4a4a4";
  return (
    <div className={`inv-card ${!item.tradable ? "not-tradable" : ""}`} onClick={onClick} title={item.name}>
      <div className="inv-thumb" style={{ borderColor: rColor }}>
        <img
          src={item.imageUrl || "https://via.placeholder.com/300x180/1e252e/657382?Text=?"}
          alt={item.name}
        />
        {item.equipped && (
          <span className="badge eq">
            <Shirt size={14} /> Equipped
          </span>
        )}
        {isOnHold(item) && <span className="badge hold">On hold</span>}
        {!item.tradable && <span className="badge nt">Not tradable</span>}
        {item.favorite && (
          <span className="badge fav">
            <Star size={14} />
          </span>
        )}
        {stackMode && item.quantity > 1 && (
          <span className="stack-qty">
            <Boxes size={14} /> x{item.quantity}
          </span>
        )}
      </div>
      <div className="inv-meta">
        <div className="inv-name">{item.name}</div>
        <div className="inv-sub">
          <span className="game">{item.game}</span>
          <span className="dot">•</span>
          <span className="type">{item.type}</span>
          {item.quality ? (
            <>
              <span className="dot">•</span>
              <span className="quality">{item.quality}</span>
            </>
          ) : null}
        </div>
        <div className="inv-foot">
          <span className="price">{formatUAH(item.priceUAH)}</span>
          {typeof checked === "boolean" && (
            <label className="sel">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheck?.(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

const SellModal = ({ open, onClose, onConfirm, item, selectionCount, pending }) => {
  const [price, setPrice] = useState(item?.priceUAH || 0);
  const count = selectionCount || 1;
  useEffect(() => {
    if (open) setPrice(item?.priceUAH || 0);
  }, [open, item]);
  if (!open) return null;
  const quick = () => setPrice(Math.max(0, Number((price * 0.9).toFixed(2))));
  return (
    <div className="inv-modal">
      <div className="inv-modal-card">
        <div className="inv-modal-head">
          <h3>
            <ShoppingCart size={18} /> List {count > 1 ? `${count} items` : `"${item?.name}"`}
          </h3>
          <button className="x" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="inv-modal-body">
          <div className="row">
            <label>Price per item</label>
            <div className="price-input">
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              />
              <span>₴</span>
            </div>
            <button className="ghost" onClick={quick} title="Suggest quick price (−10%)">
              Quick −10%
            </button>
          </div>
          <div className="muted">
            You will receive approximately {formatUAH(Math.max(0, price * 0.95))} per item after fees
          </div>
        </div>
        <div className="inv-modal-foot">
          <button className="ghost" onClick={onClose}>
            <X size={16} /> Cancel
          </button>
          <button className="rainbow" onClick={() => onConfirm(price)} disabled={pending}>
            {pending ? "Listing…" : (<><Check size={16} /> Confirm listing</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const navigate = useNavigate();
  const { data: invRes, isFetching: invLoading } = useGetUserItemsByUserQuery();
  const { data: balRes } = useGetBalanceQuery();
  const [putUpForSale, { isLoading: selling }] = usePutUpForSaleMutation();

  const [items, setItems] = useState([]);
  useEffect(() => {
    const mapped = mapUserItems(invRes);
    if (mapped.length) setItems(mapped);
  }, [invRes]);

  const [q, setQ] = useState("");
  const [gameFilter, setGameFilter] = useState("All Games");
  const [typeFilters, setTypeFilters] = useState(new Set());
  const [rarityFilters, setRarityFilters] = useState(new Set());
  const [qualityFilters, setQualityFilters] = useState(new Set());
  const [onlyTradable, setOnlyTradable] = useState(false);
  const [onlyOnHold, setOnlyOnHold] = useState(false);
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);
  const [sortBy, setSortBy] = useState("date_desc");

  const [stackMode, setStackMode] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  const [sellOpen, setSellOpen] = useState(false);

  const uniqueGames = useMemo(
    () => ["All Games", ...unique((items || []).map((i) => i.game).filter(Boolean))],
    [items]
  );
  const uniqueTypes = useMemo(() => unique((items || []).map((i) => i.type).filter(Boolean)), [items]);
  const uniqueQualities = useMemo(
    () => unique((items || []).map((i) => i.quality).filter(Boolean)),
    [items]
  );

  const toggleSet = (s, v) => {
    const next = new Set(s);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const stackKey = (it) => [it.game, it.name, it.type, it.rarity, it.quality].join("|");
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
      list = list.filter(
        (i) =>
          (i.name || "").toLowerCase().includes(s) ||
          (i.game || "").toLowerCase().includes(s) ||
          (i.tags || []).some((t) => (t || "").toLowerCase().includes(s))
      );
    }
    if (gameFilter !== "All Games") list = list.filter((i) => i.game === gameFilter);
    if (typeFilters.size) list = list.filter((i) => typeFilters.has(i.type));
    if (rarityFilters.size) list = list.filter((i) => rarityFilters.has(i.rarity));
    if (qualityFilters.size) list = list.filter((i) => i.quality && qualityFilters.has(i.quality));
    if (onlyTradable) list = list.filter((i) => i.tradable);
    if (onlyOnHold) list = list.filter((i) => isOnHold(i));
    if (onlyDuplicates) list = list.filter((i) => (i.quantity || 1) > 1);

    if (sortBy === "price_desc") list.sort((a, b) => (b.priceUAH || 0) - (a.priceUAH || 0));
    if (sortBy === "price_asc") list.sort((a, b) => (a.priceUAH || 0) - (b.priceUAH || 0));
    if (sortBy === "name_asc") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sortBy === "name_desc") list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    if (sortBy === "rarity_desc")
      list.sort((a, b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity));
    if (sortBy === "date_desc") list.sort((a, b) => new Date(b.acquiredAt) - new Date(a.acquiredAt));
    if (sortBy === "date_asc") list.sort((a, b) => new Date(a.acquiredAt) - new Date(b.acquiredAt));
    return list;
  }, [
    stackedList,
    q,
    gameFilter,
    typeFilters,
    rarityFilters,
    qualityFilters,
    onlyTradable,
    onlyOnHold,
    onlyDuplicates,
    sortBy,
  ]);

  const stats = useMemo(() => {
    const total = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const value = items.reduce((acc, it) => acc + (it.priceUAH || 0) * (it.quantity || 1), 0);
    const listed = items.filter((it) => it.listedAt).length;
    const duplicates = items.filter((it) => (it.quantity || 1) > 1).length;
    return { total, value, listed, duplicates };
  }, [items]);

  const selectionCount = selectedIds.size;
  const selectionList = useMemo(() => items.filter((it) => selectedIds.has(it.id)), [items, selectedIds]);

  const updateItems = (next) => setItems(next);

  const onSellSingle = (it) => {
    setSelectedItem(it);
    setSellOpen(true);
  };

  const confirmSell = async (price) => {
    const ids = selectionCount > 1 ? Array.from(selectedIds) : [selectedItem.id];
    try {
      await Promise.all(ids.map((id) => putUpForSale({ userItemId: id, price }).unwrap()));
      const next = items.map((it) =>
        ids.includes(it.id) ? { ...it, listedAt: new Date().toISOString(), listingPrice: price } : it
      );
      updateItems(next);
      setSellOpen(false);
      setSelectedIds(new Set());
      setSelectedItem(null);
    } catch (e) {
      alert(e?.data?.message || e?.error || "Failed to list item");
    }
  };

  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());
  const removeListings = () => {
    const ids = Array.from(selectedIds);
    const next = items.map((it) =>
      ids.includes(it.id) ? { ...it, listedAt: null, listingPrice: null } : it
    );
    updateItems(next);
    clearSelection();
  };

  const sellViaMarketPage = useCallback(() => {
    const first = selectionList[0] || selectedItem;
    if (!first) return;
    navigate("/market/sell", { state: { fromInventory: true, item: first } });
  }, [navigate, selectionList, selectedItem]);

  const balance =
    balRes?.payload?.balance ??
    balRes?.payload?.amount ??
    balRes?.balance ??
    balRes?.amount ??
    0;

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
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              />
              <SearchIcon size={18} className="ico" />
            </div>
            <span className="inv-underline" />
          </div>

          <div className="inv-panel">
            <div className="inv-title">Games</div>
            <span className="inv-underline" />
            <div className="game-list">
              {uniqueGames.slice(0, 14).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGameFilter(g)}
                  className={`game-row ${gameFilter === g ? "active" : ""}`}
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
              <div className="group-title">
                <Filter size={14} /> Type
              </div>
              {uniqueTypes.map((t) => (
                <label key={t} className="inv-check">
                  <input
                    type="checkbox"
                    checked={typeFilters.has(t)}
                    onChange={() => setTypeFilters((prev) => toggleSet(prev, t))}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>

            <div className="check-group">
              <div className="group-title">
                <Tag size={14} /> Rarity
              </div>
              {RARITY_ORDER.map((r) => (
                <label key={r} className="inv-check">
                  <input
                    type="checkbox"
                    checked={rarityFilters.has(r)}
                    onChange={() => setRarityFilters((prev) => toggleSet(prev, r))}
                  />
                  <span style={{ color: RARITY_COLORS[r] }}>{r}</span>
                </label>
              ))}
            </div>

            {uniqueQualities.length > 0 && (
              <div className="check-group">
                <div className="group-title">
                  <Layers size={14} /> Quality
                </div>
                {uniqueQualities.map((ql) => (
                  <label key={ql} className="inv-check">
                    <input
                      type="checkbox"
                      checked={qualityFilters.has(ql)}
                      onChange={() => setQualityFilters((prev) => toggleSet(prev, ql))}
                    />
                    <span>{ql}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="split" />
            <label className="inv-check">
              <input
                type="checkbox"
                checked={onlyTradable}
                onChange={(e) => setOnlyTradable(e.target.checked)}
              />
              <span>Tradable only</span>
            </label>
            <label className="inv-check">
              <input
                type="checkbox"
                checked={onlyOnHold}
                onChange={(e) => setOnlyOnHold(e.target.checked)}
              />
              <span>On hold only</span>
            </label>
            <label className="inv-check">
              <input
                type="checkbox"
                checked={onlyDuplicates}
                onChange={(e) => setOnlyDuplicates(e.target.checked)}
              />
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
                  <span className="v">{items.length}</span>
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
              <div
                className="balance-chip"
                title="Wallet balance"
                style={{
                  marginRight: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  border: "1px solid #9277C4",
                  borderRadius: 6,
                }}
              >
                <Wallet size={16} />
                <b>{formatUAH(balance)}</b>
              </div>

              <div className="switchers">
                <button
                  type="button"
                  className={`switch ${stackMode ? "active" : ""}`}
                  onClick={() => setStackMode(true)}
                  title="Stack duplicates"
                >
                  <Boxes size={14} /> Stack
                </button>
                <button
                  type="button"
                  className={`switch ${!stackMode ? "active" : ""}`}
                  onClick={() => setStackMode(false)}
                  title="Show individually"
                >
                  <Layers size={14} /> Unstack
                </button>
                <button
                  type="button"
                  className={`switch ${selectMode ? "active" : ""}`}
                  onClick={() => {
                    setSelectMode((v) => !v);
                    if (selectMode) clearSelection();
                  }}
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
                <button className="ghost" onClick={clearSelection}>
                  <X size={14} /> Clear
                </button>
              </div>
              <div className="bulk-right">
                <button className="ghost" onClick={() => setSellOpen(true)}>
                  <ShoppingCart size={16} /> Sell
                </button>
                <button className="ghost" onClick={removeListings}>
                  <X size={16} /> Cancel listings
                </button>
                <button className="rainbow" onClick={sellViaMarketPage}>
                  Sell via Market
                </button>
              </div>
            </section>
          )}

          <section className="inv-panel inv-list">
            {invLoading ? (
              <div className="inv-empty">Loading inventory…</div>
            ) : processed.length ? (
              <div className="inv-grid">
                {processed.map((it) => (
                  <ItemCard
                    key={stackMode ? `${it.game}|${it.name}|${it.type}|${it.rarity}|${it.quality}|stacked` : it.id}
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
            <button className="x" onClick={() => setSelectedItem(null)} title="Close">
              <X size={18} />
            </button>
            <div className="drawer-body">
              <div className="preview">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} />
                <div className="labels">
                  <span className="lab" style={{ borderColor: RARITY_COLORS[selectedItem.rarity] }}>
                    {selectedItem.rarity}
                  </span>
                  {selectedItem.quality && <span className="lab">{selectedItem.quality}</span>}
                  {selectedItem.tradable ? (
                    <span className="lab ok">Tradable</span>
                  ) : (
                    <span className="lab bad">Not tradable</span>
                  )}
                  {isOnHold(selectedItem) && <span className="lab warn">On hold</span>}
                </div>
              </div>
              <div className="info">
                <h3 className="name">{selectedItem.name}</h3>
                <div className="sub">
                  <span>{selectedItem.game}</span>
                  <span className="dot">•</span>
                  <span>{selectedItem.type}</span>
                  {selectedItem.quality && (
                    <>
                      <span className="dot">•</span>
                      <span>{selectedItem.quality}</span>
                    </>
                  )}
                </div>
                <div className="price-line">
                  <span className="price">{formatUAH(selectedItem.priceUAH)}</span>
                  {selectedItem.listedAt && (
                    <span className="listed">
                      Listed at {formatUAH(selectedItem.listingPrice)} (
                      {new Date(selectedItem.listedAt).toLocaleString()})
                    </span>
                  )}
                </div>

                <div className="actions">
                  <button
                    className="rainbow"
                    disabled={!selectedItem.marketable || selling}
                    onClick={() => onSellSingle(selectedItem)}
                  >
                    <ShoppingCart size={16} /> {selling ? "Listing…" : "Sell"}
                  </button>
                  <button className="ghost" onClick={sellViaMarketPage}>
                    Sell via Market
                  </button>
                </div>

                {selectedItem.tags?.length ? (
                  <div className="tags">
                    {selectedItem.tags.map((t, i) => (
                      <span key={`${t}-${i}`} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
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
        pending={selling}
      />
    </ProfileLayout>
  );
};

export default Inventory;