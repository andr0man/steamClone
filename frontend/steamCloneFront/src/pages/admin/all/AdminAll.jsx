import React, { useMemo, useState } from "react";
import "./AdminAll.scss";
import Notification from "../../../components/Notification";
import ApiConsole from "./ApiConsole";

import { useGetAllGamesQuery, useCreateGameMutation } from "../../../services/game/gameApi";
import { useGetAllGenresQuery, useCreateGenreMutation, useUpdateGenreMutation, useDeleteGenreMutation } from "../../../services/genre/genreApi";
import { useGetAllUsersQuery, useCreateUserMutation, useUpdateUserMutation, useUpdateUserPutMutation, useDeleteUserMutation, useUploadAvatarMutation, useGetUserByEmailQuery, useGetUserByNicknameQuery } from "../../../services/profile/profileApi";
import { useGetMarketItemsQuery, useBuyMarketItemMutation, usePutUpForSaleMutation, useDeleteMarketItemMutation } from "../../../services/market/marketApi";
import { useGetUserItemsQuery, useCreateUserItemMutation, useGetItemsQuery, useCreateItemMutation, useUpdateItemImageMutation, useDeleteItemMutation, useGetUserItemsByUserQuery } from "../../../services/inventory/inventoryApi";
import { useSendFriendRequestMutation, useAcceptFriendRequestMutation, useRejectFriendRequestMutation, useGetRequestsReceivedQuery, useGetRequestsSentQuery } from "../../../services/friends/friendsApi";
import { useGetAllCountrysQuery, useCreateCountryMutation, useUpdateCountryMutation, useDeleteCountryMutation } from "../../../services/country/countryApi";
import { useGetAllDevelopersAndPublishersQuery, useCreateDeveloperAndPublisherMutation, useUpdateDeveloperAndPublisherMutation, useDeleteDeveloperAndPublisherMutation } from "../../../services/developerAndPublisher/developerAndPublisherApi";
import { useGetAllLanguagesQuery, useCreateLanguageMutation, useUpdateLanguageMutation, useDeleteLanguageMutation } from "../../../services/language/languageApi";
import { useGetWishlistByUserQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from "../../../services/wishlist/wishlistApi";
import { useLoginMutation, useRegisterMutation } from "../../../services/auth/authApi";

const fmtUAH = (n) => `${Number(n ?? 0).toLocaleString("uk-UA")}₴`;

const Tabs = [
  "All",
  "Auth",
  "Users",
  "Games",
  "Items",
  "Market",
  "User Items",
  "Genres",
  "Countries",
  "Languages",
  "Dev&Pub",
  "Friendships",
  "Wishlist",
];

const copy = async (text) => { try { await navigator.clipboard.writeText(String(text || "")); } catch {} };

export default function AdminAll() {
  const [tab, setTab] = useState("All");
  const [notif, setNotif] = useState(null);

  return (
    <div className="adminall-page">
      <div className="topbar">
        <h2>Admin: All-in-one</h2>
        <div className="tabs">
          {Tabs.map((t) => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        <Notification message={notif?.msg || null} type={notif?.type || "info"} onClose={() => setNotif(null)} />

        {tab === "All" && (
          <div className="grid2">
            <section className="card">
              <h3 className="h">Universal API Console</h3>
              <p className="muted">Будь-який ендпоінт зі Swagger з пресетами, історією, multipart та токен-оверрайдом.</p>
              <ApiConsole title="Swagger API Console" />
            </section>

            <section className="card">
              <h3 className="h">Quick actions</h3>
              <div className="qa-grid">
                <QuickAuth />
                <QuickUsers />
                <QuickGames />
                <QuickItems />
                <QuickMarket />
                <QuickUserItems />
                <QuickGenres />
                <QuickCountries />
                <QuickLanguages />
                <QuickDevPub />
                <QuickFriendships />
                <QuickWishlist />
              </div>
            </section>
          </div>
        )}

        {tab === "Auth" && <QuickAuth full />}
        {tab === "Users" && <QuickUsers full />}
        {tab === "Games" && <QuickGames full />}
        {tab === "Items" && <QuickItems full />}
        {tab === "Market" && <QuickMarket full />}
        {tab === "User Items" && <QuickUserItems full />}
        {tab === "Genres" && <QuickGenres full />}
        {tab === "Countries" && <QuickCountries full />}
        {tab === "Languages" && <QuickLanguages full />}
        {tab === "Dev&Pub" && <QuickDevPub full />}
        {tab === "Friendships" && <QuickFriendships full />}
        {tab === "Wishlist" && <QuickWishlist full />}
      </div>
    </div>
  );
}

/* -------- Quick panels -------- */

function QuickAuth({ full = false }) {
  const [login, { isLoading: logining }] = useLoginMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("string123");
  const [reg, setReg] = useState({ email: "", password: "" });

  const doLogin = async () => {
    try {
      const res = await login({ email, password }).unwrap();
      const token = res?.payload?.accessToken;
      if (token) localStorage.setItem("accessToken", token);
      alert("Logged in (token saved)");
    } catch (e) {
      alert(e?.data?.message || "Login failed");
    }
  };
  const doRegister = async () => {
    try {
      const res = await register(reg).unwrap();
      alert(res?.message || "Registered");
    } catch (e) {
      alert(e?.data?.message || "Register failed");
    }
  };

  const [manualToken, setManualToken] = useState(localStorage.getItem("accessToken") || "");
  const saveToken = () => { localStorage.setItem("accessToken", manualToken || ""); alert("Token saved"); };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Auth</h4></div>
      <div className="row2">
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doLogin} disabled={logining}>Login</button></div>
      </div>

      <div className="row2">
        <label>Manual token<input value={manualToken} onChange={(e) => setManualToken(e.target.value)} placeholder="Paste JWT here" /></label>
        <div className="actions"><button className="btn" onClick={saveToken}>Save token</button></div>
      </div>

      {full && (
        <>
          <div className="divider" />
          <div className="row2">
            <label>Email<input value={reg.email} onChange={(e) => setReg((p) => ({ ...p, email: e.target.value }))} /></label>
            <label>Password<input type="password" value={reg.password} onChange={(e) => setReg((p) => ({ ...p, password: e.target.value }))} /></label>
            <div className="actions"><button className="btn" onClick={doRegister} disabled={registering}>Register</button></div>
          </div>
        </>
      )}
    </section>
  );
}

function QuickUsers({ full = false }) {
  const { data: usersRes, isFetching } = useGetAllUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUserPatch, { isLoading: patching }] = useUpdateUserMutation();
  const [updateUserPut, { isLoading: putting }] = useUpdateUserPutMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [uploadAvatar, { isLoading: uploading }] = useUploadAvatarMutation();

  const [findEmail, setFindEmail] = useState("");
  const { data: foundByEmail } = useGetUserByEmailQuery(findEmail, { skip: !findEmail });
  const [findNick, setFindNick] = useState("");
  const { data: foundByNick } = useGetUserByNicknameQuery(findNick, { skip: !findNick });

  const users = useMemo(() => usersRes?.payload ?? usersRes ?? [], [usersRes]);

  const [userSearch, setUserSearch] = useState("");
  const filtered = useMemo(() => {
    const s = userSearch.trim().toLowerCase();
    const arr = users.slice();
    return s ? arr.filter(u => (u.email || "").toLowerCase().includes(s) || (u.nickName || u.username || "").toLowerCase().includes(s)) : arr;
  }, [users, userSearch]);

  const [createJson, setCreateJson] = useState('{"email":"user@mail.com","password":"string123","nickName":"Nick"}');
  const [updId, setUpdId] = useState("");
  const [updJson, setUpdJson] = useState('{"nickName":"NewNick","roleName":"admin"}');
  const [delId, setDelId] = useState("");

  const doCreate = async () => { try { await createUser(JSON.parse(createJson)).unwrap(); alert("User created"); } catch (e) { alert(e?.data?.message || e?.error || "Create failed"); } };
  const doPatch = async () => { try { await updateUserPatch(JSON.parse(updJson)).unwrap(); alert("Patched"); } catch (e) { alert(e?.data?.message || e?.error || "Patch failed"); } };
  const doPut = async () => { try { await updateUserPut({ id: updId, ...JSON.parse(updJson) }).unwrap(); alert("Updated"); } catch (e) { alert(e?.data?.message || e?.error || "Update failed"); } };
  const doDelete = async () => { if (!delId) return; if (!window.confirm("Delete user?")) return; try { await deleteUser(delId).unwrap(); alert("User deleted"); } catch (e) { alert(e?.data?.message || e?.error || "Delete failed"); } };

  const [avatarFile, setAvatarFile] = useState(null);
  const onUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      const form = new FormData();
      form.append("avatar", avatarFile);
      await uploadAvatar(form).unwrap();
      alert("Avatar uploaded (current user)");
      setAvatarFile(null);
    } catch (e) {
      alert(e?.data?.message || "Upload failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Users</h4></div>

      <div className="row2">
        <label>Search<input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="email or nickname" /></label>
        <label>Find id by email<input value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder="email" /></label>
      </div>
      {!!findEmail && (
        <div className="muted" style={{ marginBottom: 6 }}>
          Found: {(foundByEmail?.payload?.id || foundByEmail?.id) ? <><b>{foundByEmail?.payload?.id || foundByEmail?.id}</b> <button className="btn" onClick={() => copy(foundByEmail?.payload?.id || foundByEmail?.id)}>Copy</button></> : "—"}
        </div>
      )}
      <div className="row2">
        <label>Find id by nickname<input value={findNick} onChange={(e) => setFindNick(e.target.value)} placeholder="nickname" /></label>
      </div>
      {!!findNick && (
        <div className="muted" style={{ marginBottom: 6 }}>
          Found: {(foundByNick?.payload?.id || foundByNick?.id) ? <><b>{foundByNick?.payload?.id || foundByNick?.id}</b> <button className="btn" onClick={() => copy(foundByNick?.payload?.id || foundByNick?.id)}>Copy</button></> : "—"}
        </div>
      )}

      <div className="row2">
        <label>Create (JSON)<textarea rows={3} value={createJson} onChange={(e) => setCreateJson(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doCreate} disabled={creating}>Create</button></div>
      </div>

      <div className="row2">
        <label>Update id<input value={updId} onChange={(e) => setUpdId(e.target.value)} placeholder="(для PUT)" /></label>
        <label>Update body (JSON)<textarea rows={3} value={updJson} onChange={(e) => setUpdJson(e.target.value)} /></label>
        <div className="actions" style={{ gap: 6 }}>
          <button className="btn" onClick={doPatch} disabled={patching}>PATCH</button>
          <button className="btn" onClick={doPut} disabled={putting}>PUT</button>
        </div>
      </div>

      <div className="row2">
        <label>Delete id<input value={delId} onChange={(e) => setDelId(e.target.value)} /></label>
        <div className="actions"><button className="btn danger" onClick={doDelete} disabled={deleting}>Delete</button></div>
      </div>

      <div className="row2">
        <label>Avatar (current user)<input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} /></label>
        <div className="actions"><button className="btn" onClick={onUploadAvatar} disabled={uploading || !avatarFile}>Upload</button></div>
      </div>

      {full && (
        <>
          <div className="divider" />
          <div className="list">
            <div className="list-head">All users</div>
            {isFetching ? <div className="muted">Loading…</div> : filtered.length ? (
              filtered.map((u) => (
                <div className="row-item" key={u.id}>
                  <span>{u.email}</span>
                  <span className="muted">{u.nickName || u.nickname || u.userName || u.username || "-"}</span>
                  <span className="muted">{u.roleName || u.role || "-"}</span>
                  <span className="muted">{u.id}</span>
                  <button className="btn" onClick={() => copy(u.id)}>Copy id</button>
                </div>
              ))
            ) : (<div className="muted">No users</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickGames({ full = false }) {
  const { data: gamesRes, isFetching } = useGetAllGamesQuery();
  const [createGame, { isLoading: creating }] = useCreateGameMutation();
  const games = useMemo(() => (gamesRes?.payload ?? gamesRes ?? []), [gamesRes]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    releaseDate: new Date().toISOString().slice(0, 16),
    developerId: "",
    publisherId: "",
    genresIds: [],
  });

  const [gSearch, setGSearch] = useState("");
  const filtered = useMemo(() => {
    const s = gSearch.trim().toLowerCase();
    const arr = games.slice();
    return s ? arr.filter(g => (g.name || "").toLowerCase().includes(s)) : arr;
  }, [games, gSearch]);

  const onCreate = async () => {
    try {
      await createGame({
        ...form,
        price: Number(form.price),
        releaseDate: new Date(form.releaseDate).toISOString(),
      }).unwrap();
      alert("Game created");
      setForm({ name: "", description: "", price: 0, releaseDate: new Date().toISOString().slice(0, 16), developerId: "", publisherId: "", genresIds: [] });
    } catch (e) {
      alert(e?.data?.message || "Create failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h4>Games</h4>
        <button className="btn" onClick={() => window.location.assign("/admin/games")}>Open Manage</button>
      </div>

      <div className="row2">
        <label>Name<input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></label>
        <label>Price<input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} /></label>
      </div>
      <label>Description<textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></label>
      <label>Release date<input type="datetime-local" value={form.releaseDate} onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))} /></label>
      <div className="actions"><button className="btn primary" onClick={onCreate} disabled={creating}>{creating ? "Creating..." : "Create game"}</button></div>

      {full && (
        <>
          <div className="divider" />
          <label>Search<input value={gSearch} onChange={(e) => setGSearch(e.target.value)} /></label>
          <div className="list">
            <div className="list-head">All games</div>
            {isFetching ? (
              <div className="muted">Loading…</div>
            ) : (filtered || []).length ? (
              filtered.map((g) => (
                <div key={g.id} className="row-item">
                  <span>{g.name}</span>
                  <span className="muted">{fmtUAH(g.price)}</span>
                  <span className="muted">{g.id}</span>
                  <button className="btn" onClick={() => copy(g.id)}>Copy id</button>
                  <button className="btn" onClick={() => window.location.assign(`/admin/games/edit/${g.id}`)}>Edit</button>
                </div>
              ))
            ) : (
              <div className="muted">No games</div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function QuickItems({ full = false }) {
  const { data: itemsRes, isFetching } = useGetItemsQuery();
  const { data: gamesRes } = useGetAllGamesQuery();
  const [createItem, { isLoading: creating }] = useCreateItemMutation();
  const [deleteItem, { isLoading: deleting }] = useDeleteItemMutation();
  const [updateImage, { isLoading: uploading }] = useUpdateItemImageMutation();

  const items = useMemo(() => itemsRes?.payload ?? itemsRes ?? [], [itemsRes]);
  const games = useMemo(() => gamesRes?.payload ?? gamesRes ?? [], [gamesRes]);

  const [createJson, setCreateJson] = useState('{"name":"Item name","description":"Desc","gameId": "GAME_GUID"}');
  const [delId, setDelId] = useState("");
  const [imgId, setImgId] = useState("");
  const [imgFile, setImgFile] = useState(null);

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const arr = items.slice();
    return s ? arr.filter(it => (it.name || "").toLowerCase().includes(s) || String(it.gameId || "").includes(s)) : arr;
  }, [items, search]);

  const [gamePick, setGamePick] = useState("");
  const applyGameId = () => {
    if (!gamePick) return;
    try {
      const obj = JSON.parse(createJson || "{}");
      obj.gameId = gamePick;
      setCreateJson(JSON.stringify(obj, null, 2));
    } catch {}
  };

  const doCreate = async () => {
    try { await createItem(JSON.parse(createJson)).unwrap(); alert("Item created"); }
    catch (e) { alert(e?.data?.message || e?.error || "Create failed"); }
  };
  const doDelete = async () => {
    if (!delId) return;
    if (!window.confirm("Delete item?")) return;
    try { await deleteItem(delId).unwrap(); alert("Item deleted"); }
    catch (e) { alert(e?.data?.message || e?.error || "Delete failed"); }
  };
  const doUpload = async () => {
    if (!imgId || !imgFile) return;
    try {
      const form = new FormData();
      form.append("image", imgFile);
      await updateImage({ id: imgId, formData: form }).unwrap();
      alert("Image updated");
      setImgFile(null);
    } catch (e) {
      alert(e?.data?.message || "Upload failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Items</h4></div>

      <div className="row2">
        <label>Create (JSON)<textarea rows={3} value={createJson} onChange={(e) => setCreateJson(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doCreate} disabled={creating}>Create</button></div>
      </div>

      <div className="row2">
        <label>Pick game<select value={gamePick} onChange={(e) => setGamePick(e.target.value)}>
          <option value="">— select —</option>
          {(games || []).slice(0, 100).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select></label>
        <div className="actions"><button className="btn" onClick={applyGameId} disabled={!gamePick}>Apply gameId</button></div>
      </div>

      <div className="row2">
        <label>Upload image: itemId<input value={imgId} onChange={(e) => setImgId(e.target.value)} /></label>
        <label>File<input type="file" onChange={(e) => setImgFile(e.target.files?.[0] || null)} /></label>
        <div className="actions"><button className="btn" onClick={doUpload} disabled={uploading || !imgId || !imgFile}>Upload</button></div>
      </div>

      <div className="row2">
        <label>Delete itemId<input value={delId} onChange={(e) => setDelId(e.target.value)} /></label>
        <div className="actions"><button className="btn danger" onClick={doDelete} disabled={deleting}>Delete</button></div>
      </div>

      {full && (
        <>
          <div className="divider" />
          <label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          <div className="list">
            <div className="list-head">All items</div>
            {isFetching ? <div className="muted">Loading…</div> : (filtered || []).length ? (
              filtered.map((it) => (
                <div key={it.id} className="row-item">
                  <span>{it.name}</span>
                  <span className="muted">{it.gameId}</span>
                  <span className="muted">{it.id}</span>
                  <button className="btn" onClick={() => copy(it.id)}>Copy id</button>
                </div>
              ))
            ) : (<div className="muted">No data</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickMarket({ full = false }) {
  const { data: listRes, isFetching } = useGetMarketItemsQuery();
  const [buy, { isLoading: buying }] = useBuyMarketItemMutation();
  const [sell, { isLoading: selling }] = usePutUpForSaleMutation();
  const [del, { isLoading: deleting }] = useDeleteMarketItemMutation();

  const [search, setSearch] = useState("");
  const itemsRaw = useMemo(
    () =>
      (listRes?.payload ?? listRes ?? []).map((row) => ({
        id: row?.id ?? row?.marketItemId,
        name: row?.item?.name ?? row?.itemDto?.name ?? "Item",
        game: row?.item?.game?.name ?? row?.itemDto?.game?.name ?? "",
        price: Number(row?.price ?? 0),
      })),
    [listRes]
  );
  const items = useMemo(() => {
    const s = search.trim().toLowerCase();
    const arr = itemsRaw.slice();
    return s ? arr.filter(i => (i.name || "").toLowerCase().includes(s) || (i.game || "").toLowerCase().includes(s)) : arr;
  }, [itemsRaw, search]);

  const [sellUserItemId, setSellUserItemId] = useState("");
  const [sellPrice, setSellPrice] = useState("");

  const putUp = async () => {
    try {
      await sell({ userItemId: sellUserItemId, price: Number(sellPrice) || 0 }).unwrap();
      alert("Listed");
    } catch (e) {
      alert(e?.data?.message || "List failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Market</h4></div>

      <div className="row2">
        <label>userItemId<input value={sellUserItemId} onChange={(e) => setSellUserItemId(e.target.value)} /></label>
        <label>price<input type="number" step="0.01" min="0" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={putUp} disabled={selling}>Put up for sale</button></div>
      </div>

      <div className="divider" />
      <label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} /></label>
      <div className="list">
        <div className="list-head">Market items</div>
        {isFetching ? (
          <div className="muted">Loading…</div>
        ) : items.length ? (
          items.map((it) => (
            <div key={it.id} className="row-item">
              <span>{it.name}</span>
              <span className="muted">{it.game}</span>
              <span className="muted">{fmtUAH(it.price)}</span>
              <button
                className="btn"
                onClick={async () => {
                  try { await buy({ marketItemId: it.id }).unwrap(); alert("Purchased"); }
                  catch (e) { alert(e?.data?.message || "Buy failed"); }
                }}
                disabled={buying}
              >
                Buy
              </button>
              <button
                className="btn danger"
                onClick={async () => {
                  if (!window.confirm("Delete listing?")) return;
                  try { await del(it.id).unwrap(); alert("Deleted"); }
                  catch (e) { alert(e?.data?.message || "Delete failed"); }
                }}
                disabled={deleting}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="muted">No items</div>
        )}
      </div>
    </section>
  );
}

function QuickUserItems({ full = false }) {
  const [currentOnly, setCurrentOnly] = useState(true);
  const { data: invByUserRes, isFetching: f1 } = useGetUserItemsByUserQuery(undefined, { skip: !currentOnly });
  const { data: invAllRes, isFetching: f2 } = useGetUserItemsQuery(undefined, { skip: currentOnly });
  const invRes = currentOnly ? invByUserRes : invAllRes;
  const isFetching = currentOnly ? f1 : f2;

  const [createUserItem, { isLoading }] = useCreateUserItemMutation();
  const list = useMemo(() => invRes?.payload ?? invRes ?? [], [invRes]);

  const [userId, setUserId] = useState("");
  const [itemId, setItemId] = useState("");
  const [tradable, setTradable] = useState(true);
  const [search, setSearch] = useState("");

  const create = async () => {
    try {
      await createUserItem({ userId, itemId, isTradable: !!tradable }).unwrap();
      alert("User item created");
    } catch (e) {
      alert(e?.data?.message || "Failed");
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const arr = list.slice();
    return s ? arr.filter(u => (u.item?.name || "").toLowerCase().includes(s) || (u.userId || "").includes(s)) : arr;
  }, [list, search]);

  return (
    <section className="panel">
      <div className="panel-head"><h4>User Items</h4></div>

      <label className="chk"><input type="checkbox" checked={currentOnly} onChange={(e) => setCurrentOnly(e.target.checked)} /> only current user</label>

      <div className="row2">
        <label>userId<input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="(optional when currentOnly)" /></label>
        <label>itemId<input value={itemId} onChange={(e) => setItemId(e.target.value)} /></label>
        <label className="chk"><input type="checkbox" checked={tradable} onChange={(e) => setTradable(e.target.checked)} /> tradable</label>
        <div className="actions"><button className="btn primary" onClick={create} disabled={isLoading}>Create</button></div>
      </div>

      {full && (
        <>
          <div className="divider" />
          <label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          <div className="list">
            <div className="list-head">User Items</div>
            {isFetching ? <div className="muted">Loading…</div> : filtered.length ? (
              filtered.map((u) => (
                <div className="row-item" key={u.id}>
                  <span>{u.item?.name || u.itemId}</span>
                  <span className="muted">{u.userId}</span>
                  <span className="muted">{u.isTradable ? "tradable" : "not tradable"}</span>
                  <button className="btn" onClick={() => copy(u.id)}>Copy id</button>
                </div>
              ))
            ) : (<div className="muted">No data</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickGenres({ full = false }) {
  const { data: genresRes, isFetching } = useGetAllGenresQuery();
  const [createGenre, { isLoading: creating }] = useCreateGenreMutation();
  const [updateGenre, { isLoading: updating }] = useUpdateGenreMutation();
  const [deleteGenre, { isLoading: deleting }] = useDeleteGenreMutation();
  const genres = useMemo(() => genresRes?.payload ?? genresRes ?? [], [genresRes]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [bulkJson, setBulkJson] = useState('[{"name":"Action","description":""},{"name":"RPG","description":""}]');

  const onCreate = async () => { try { await createGenre({ name, description: desc }).unwrap(); setName(""); setDesc(""); alert("Genre created"); } catch (e) { alert(e?.data?.message || "Create failed"); } };
  const onUpdate = async () => { try { await updateGenre({ id: editId, name: editName, description: editDesc }).unwrap(); alert("Updated"); } catch (e) { alert(e?.data?.message || "Update failed"); } };
  const onDelete = async (id) => { if (!window.confirm("Delete genre?")) return; try { await deleteGenre(id).unwrap(); alert("Deleted"); } catch (e) { alert(e?.data?.message || "Delete failed"); } };

  const bulkCreate = async () => {
    try {
      const arr = JSON.parse(bulkJson);
      if (!Array.isArray(arr)) throw new Error("JSON must be array");
      for (const g of arr) {
        await createGenre(g).unwrap();
      }
      alert("Bulk created");
    } catch (e) {
      alert(e?.message || e?.data?.message || "Bulk failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Genres</h4></div>

      <div className="row2">
        <label>New name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Description<input value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={onCreate} disabled={creating}>Create</button></div>
      </div>

      {full && (
        <>
          <div className="divider" />
          <div className="row2">
            <label>Edit id<input value={editId} onChange={(e) => setEditId(e.target.value)} placeholder="genre id" /></label>
            <label>Edit name<input value={editName} onChange={(e) => setEditName(e.target.value)} /></label>
            <label>Edit desc<input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={onUpdate} disabled={updating}>Update</button></div>
          </div>

          <div className="divider" />
          <div className="row2">
            <label>Bulk create (JSON array)<textarea rows={3} value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={bulkCreate}>Run</button></div>
          </div>

          <div className="divider" />
          <div className="list">
            <div className="list-head">All genres</div>
            {isFetching ? <div className="muted">Loading…</div> : genres.length ? genres.map((g) => (
              <div className="row-item" key={g.id}>
                <span>{g.name}</span>
                <div className="actions">
                  <button className="btn" onClick={() => copy(g.id)}>Copy id</button>
                  <button className="btn danger" onClick={() => onDelete(g.id)} disabled={deleting}>Delete</button>
                </div>
              </div>
            )) : (<div className="muted">No genres</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickCountries({ full = false }) {
  const { data: res, isFetching } = useGetAllCountrysQuery();
  const [createCountry, { isLoading: creating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: updating }] = useUpdateCountryMutation();
  const [deleteCountry, { isLoading: deleting }] = useDeleteCountryMutation();
  const list = useMemo(() => res?.payload ?? res ?? [], [res]);

  const [createJson, setCreateJson] = useState('{"name":"Ukraine","code":"UA"}');
  const [updId, setUpdId] = useState("");
  const [updJson, setUpdJson] = useState('{"name":"Updated name"}');
  const [delId, setDelId] = useState("");
  const [bulkJson, setBulkJson] = useState('[{"name":"USA","code":"US"},{"name":"Germany","code":"DE"}]');

  const doCreate = async () => { try { await createCountry(JSON.parse(createJson)).unwrap(); alert("Country created"); }
    catch (e) { alert(e?.data?.message || e?.error || "Create failed"); } };
  const doUpdate = async () => { try { await updateCountry({ id: updId, ...JSON.parse(updJson) }).unwrap(); alert("Country updated"); }
    catch (e) { alert(e?.data?.message || e?.error || "Update failed"); } };
  const doDelete = async () => { if (!delId) return; if (!window.confirm("Delete country?")) return; try { await deleteCountry(delId).unwrap(); alert("Country deleted"); }
    catch (e) { alert(e?.data?.message || e?.error || "Delete failed"); } };
  const bulkCreate = async () => {
    try {
      const arr = JSON.parse(bulkJson);
      if (!Array.isArray(arr)) throw new Error("JSON must be array");
      for (const c of arr) await createCountry(c).unwrap();
      alert("Bulk created");
    } catch (e) {
      alert(e?.message || e?.data?.message || "Bulk failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Countries</h4></div>

      <div className="row2">
        <label>New (JSON)<textarea rows={3} value={createJson} onChange={(e) => setCreateJson(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doCreate} disabled={creating}>Create</button></div>
      </div>

      {full && (
        <>
          <div className="row2">
            <label>Update id<input value={updId} onChange={(e) => setUpdId(e.target.value)} /></label>
            <label>Update body (JSON)<textarea rows={3} value={updJson} onChange={(e) => setUpdJson(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={doUpdate} disabled={updating}>Update</button></div>
          </div>

          <div className="row2">
            <label>Delete id<input value={delId} onChange={(e) => setDelId(e.target.value)} /></label>
            <div className="actions"><button className="btn danger" onClick={doDelete} disabled={deleting}>Delete</button></div>
          </div>

          <div className="row2">
            <label>Bulk create (JSON array)<textarea rows={3} value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={bulkCreate}>Run</button></div>
          </div>

          <div className="divider" />
          <div className="list">
            <div className="list-head">All countries</div>
            {isFetching ? <div className="muted">Loading…</div> : list.length ? list.map((c) => (
              <div key={c.id || c.name} className="row-item">
                <span>{c.name || c.title}</span>
                <span className="muted">{c.code || ""}</span>
                <button className="btn" onClick={() => copy(c.id || c.name)}>Copy</button>
              </div>
            )) : (<div className="muted">No data</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickLanguages({ full = false }) {
  const { data: res, isFetching } = useGetAllLanguagesQuery();
  const [createLanguage, { isLoading: creating }] = useCreateLanguageMutation();
  const [updateLanguage, { isLoading: updating }] = useUpdateLanguageMutation();
  const [deleteLanguage, { isLoading: deleting }] = useDeleteLanguageMutation();
  const list = useMemo(() => res?.payload ?? res ?? [], [res]);

  const [createJson, setCreateJson] = useState('{"name":"English","code":"EN"}');
  const [updId, setUpdId] = useState("");
  const [updJson, setUpdJson] = useState('{"name":"Updated"}');
  const [delId, setDelId] = useState("");
  const [bulkJson, setBulkJson] = useState('[{"name":"German","code":"DE"},{"name":"Ukrainian","code":"UA"}]');

  const doCreate = async () => { try { await createLanguage(JSON.parse(createJson)).unwrap(); alert("Language created"); }
    catch (e) { alert(e?.data?.message || e?.error || "Create failed"); } };
  const doUpdate = async () => { try { await updateLanguage({ id: updId, ...JSON.parse(updJson) }).unwrap(); alert("Language updated"); }
    catch (e) { alert(e?.data?.message || e?.error || "Update failed"); } };
  const doDelete = async () => { if (!delId) return; if (!window.confirm("Delete language?")) return; try { await deleteLanguage(delId).unwrap(); alert("Language deleted"); }
    catch (e) { alert(e?.data?.message || e?.error || "Delete failed"); } };
  const bulkCreate = async () => {
    try {
      const arr = JSON.parse(bulkJson);
      if (!Array.isArray(arr)) throw new Error("JSON must be array");
      for (const l of arr) await createLanguage(l).unwrap();
      alert("Bulk created");
    } catch (e) {
      alert(e?.message || e?.data?.message || "Bulk failed");
    }
  };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Languages</h4></div>

      <div className="row2">
        <label>Create (JSON)<textarea rows={3} value={createJson} onChange={(e) => setCreateJson(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doCreate} disabled={creating}>Create</button></div>
      </div>

      {full && (
        <>
          <div className="row2">
            <label>Update id<input value={updId} onChange={(e) => setUpdId(e.target.value)} /></label>
            <label>Update body (JSON)<textarea rows={3} value={updJson} onChange={(e) => setUpdJson(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={doUpdate} disabled={updating}>Update</button></div>
          </div>

          <div className="row2">
            <label>Delete id<input value={delId} onChange={(e) => setDelId(e.target.value)} /></label>
            <div className="actions"><button className="btn danger" onClick={doDelete} disabled={deleting}>Delete</button></div>
          </div>

          <div className="row2">
            <label>Bulk create (JSON array)<textarea rows={3} value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={bulkCreate}>Run</button></div>
          </div>

          <div className="divider" />
          <div className="list">
            <div className="list-head">All languages</div>
            {isFetching ? <div className="muted">Loading…</div> : list.length ? list.map((l) => (
              <div key={l.id || l.name} className="row-item">
                <span>{l.name}</span>
                <span className="muted">{l.code || ""}</span>
                <button className="btn" onClick={() => copy(l.id || l.name)}>Copy</button>
              </div>
            )) : (<div className="muted">No data</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickDevPub({ full = false }) {
  const { data: res, isFetching } = useGetAllDevelopersAndPublishersQuery();
  const [createDP, { isLoading: creating }] = useCreateDeveloperAndPublisherMutation();
  const [updateDP, { isLoading: updating }] = useUpdateDeveloperAndPublisherMutation();
  const [deleteDP, { isLoading: deleting }] = useDeleteDeveloperAndPublisherMutation();
  const list = useMemo(() => res?.payload ?? res ?? [], [res]);

  const [createJson, setCreateJson] = useState('{"name":"Studio Name","description":""}');
  const [updId, setUpdId] = useState("");
  const [updJson, setUpdJson] = useState('{"name":"Updated Studio"}');
  const [delId, setDelId] = useState("");

  const doCreate = async () => { try { await createDP(JSON.parse(createJson)).unwrap(); alert("Created"); }
    catch (e) { alert(e?.data?.message || e?.error || "Create failed"); } };
  const doUpdate = async () => { try { await updateDP({ id: updId, ...JSON.parse(updJson) }).unwrap(); alert("Updated"); }
    catch (e) { alert(e?.data?.message || e?.error || "Update failed"); } };
  const doDelete = async () => { if (!delId) return; if (!window.confirm("Delete?")) return;
    try { await deleteDP(delId).unwrap(); alert("Deleted"); }
    catch (e) { alert(e?.data?.message || e?.error || "Delete failed"); } };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Developers & Publishers</h4></div>

      <div className="row2">
        <label>Create (JSON)<textarea rows={3} value={createJson} onChange={(e) => setCreateJson(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doCreate} disabled={creating}>Create</button></div>
      </div>

      {full && (
        <>
          <div className="row2">
            <label>Update id<input value={updId} onChange={(e) => setUpdId(e.target.value)} /></label>
            <label>Update body (JSON)<textarea rows={3} value={updJson} onChange={(e) => setUpdJson(e.target.value)} /></label>
            <div className="actions"><button className="btn" onClick={doUpdate} disabled={updating}>Update</button></div>
          </div>

          <div className="row2">
            <label>Delete id<input value={delId} onChange={(e) => setDelId(e.target.value)} /></label>
            <div className="actions"><button className="btn danger" onClick={doDelete} disabled={deleting}>Delete</button></div>
          </div>

          <div className="divider" />
          <div className="list">
            <div className="list-head">All</div>
            {isFetching ? <div className="muted">Loading…</div> : list.length ? list.map((d) => (
              <div key={d.id} className="row-item">
                <span>{d.name}</span>
                <span className="muted">{d.description || ""}</span>
                <button className="btn" onClick={() => copy(d.id)}>Copy id</button>
              </div>
            )) : (<div className="muted">No data</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickFriendships({ full = false }) {
  const [sendReq] = useSendFriendRequestMutation();
  const [acceptReq] = useAcceptFriendRequestMutation();
  const [rejectReq] = useRejectFriendRequestMutation();
  const { data: recRes, isFetching: recLoading } = useGetRequestsReceivedQuery();
  const { data: sentRes, isFetching: sentLoading } = useGetRequestsSentQuery();

  const rec = useMemo(() => (recRes?.payload ?? recRes ?? []).map((r) => ({
    id: r?.id ?? r?.requestId ?? r?.request?.id, from: r?.sender?.email || r?.from?.email || r?.requester?.email || "user"
  })), [recRes]);
  const sent = useMemo(() => (sentRes?.payload ?? sentRes ?? []).map((r) => ({
    id: r?.id ?? r?.requestId ?? r?.request?.id, to: r?.receiver?.email || r?.to?.email || "user"
  })), [sentRes]);

  const [receiverId, setReceiverId] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const { data: findRecByEmail } = useGetUserByEmailQuery(receiverEmail, { skip: !receiverEmail });
  const applyFound = () => {
    const id = findRecByEmail?.payload?.id || findRecByEmail?.id;
    if (id) setReceiverId(id);
  };

  const doSend = async () => { try { await sendReq(receiverId).unwrap(); alert("Sent"); } catch (e) { alert(e?.data?.message || "Failed"); } };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Friendships</h4></div>
      <div className="row2">
        <label>receiverEmail<input value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} placeholder="find id by email" /></label>
        <div className="actions"><button className="btn" onClick={applyFound} disabled={!receiverEmail}>Apply</button></div>
      </div>
      <div className="row2">
        <label>receiverId<input value={receiverId} onChange={(e) => setReceiverId(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={doSend}>Send request</button></div>
      </div>

      <div className="divider" />
      <div className="list">
        <div className="list-head">Incoming</div>
        {recLoading ? <div className="muted">Loading…</div> : rec.length ? rec.map((r) => (
          <div className="row-item" key={r.id}>
            <span>{r.from}</span>
            <div className="actions">
              <button className="btn" onClick={async () => { try { await acceptReq(r.id).unwrap(); alert("Accepted"); } catch { alert("Failed"); } }}>Accept</button>
              <button className="btn danger" onClick={async () => { try { await rejectReq(r.id).unwrap(); alert("Rejected"); } catch { alert("Failed"); } }}>Reject</button>
            </div>
          </div>
        )) : (<div className="muted">No incoming</div>)}
      </div>

      {full && (
        <>
          <div className="divider" />
          <div className="list">
            <div className="list-head">Sent</div>
            {sentLoading ? <div className="muted">Loading…</div> : sent.length ? sent.map((r) => (
              <div className="row-item" key={r.id}><span>to: {r.to}</span></div>
            )) : (<div className="muted">No sent</div>)}
          </div>
        </>
      )}
    </section>
  );
}

function QuickWishlist({ full = false }) {
  const { data: res, isFetching } = useGetWishlistByUserQuery();
  const [addToWishlist, { isLoading: adding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();

  const list = useMemo(() => res?.payload ?? res ?? [], [res]);
  const [gameId, setGameId] = useState("");

  const add = async () => { try { await addToWishlist(gameId).unwrap(); alert("Added to wishlist"); } catch (e) { alert(e?.data?.message || "Add failed"); } };
  const remove = async () => { try { await removeFromWishlist(gameId).unwrap(); alert("Removed from wishlist"); } catch (e) { alert(e?.data?.message || "Remove failed"); } };

  return (
    <section className="panel">
      <div className="panel-head"><h4>Wishlist</h4></div>

      <div className="row2">
        <label>gameId<input value={gameId} onChange={(e) => setGameId(e.target.value)} /></label>
        <div className="actions">
          <button className="btn" onClick={add} disabled={adding}>Add</button>
          <button className="btn danger" onClick={remove} disabled={removing}>Remove</button>
        </div>
      </div>

      {full && (
        <>
          <div className="divider" />
          <div className="list">
            <div className="list-head">My wishlist</div>
            {isFetching ? <div className="muted">Loading…</div> : list.length ? (
              list.map((w) => (
                <div className="row-item" key={w?.id || w?.game?.id}>
                  <span>{w?.game?.name || w?.gameId}</span>
                  <span className="muted">{w?.game?.id}</span>
                  <button className="btn" onClick={() => copy(w?.game?.id || w?.id)}>Copy</button>
                </div>
              ))
            ) : (<div className="muted">No data</div>)}
          </div>
        </>
      )}
    </section>
  );
}