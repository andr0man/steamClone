import React, { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_BASE =
  (import.meta?.env?.VITE_API_URL ||
    import.meta?.env?.VITE_APP_API_URL ||
    "http://localhost:7004").replace(/\/$/, "");

const PRESETS = [
  { group: "Account", label: "POST /Account/signin", method: "POST", path: "/Account/signin", ct: "application/json", body: JSON.stringify({ email: "admin@mail.com", password: "string123" }, null, 2) },
  { group: "Account", label: "POST /Account/refresh", method: "POST", path: "/Account/refresh", ct: "application/json", body: JSON.stringify({ accessToken: "PASTE_ACCESS", refreshToken: "PASTE_REFRESH" }, null, 2) },

  { group: "Users", label: "GET /Users", method: "GET", path: "/Users", ct: "" },
  { group: "Users", label: "POST /Users (create)", method: "POST", path: "/Users", ct: "application/json", body: JSON.stringify({ email: "user@mail.com", password: "string123", nickName: "Nick" }, null, 2) },
  { group: "Users", label: "PATCH /Users (update current)", method: "PATCH", path: "/Users", ct: "application/json", body: JSON.stringify({ id: "USER_ID", nickName: "NewNick", roleName: "admin" }, null, 2) },
  { group: "Users", label: "PUT /Users/{id}", method: "PUT", path: "/Users/USER_ID", ct: "application/json", body: JSON.stringify({ email: "new@mail.com", nickName: "Nick2" }, null, 2) },
  { group: "Users", label: "DELETE /Users/{id}", method: "DELETE", path: "/Users/USER_ID", ct: "" },
  { group: "Users", label: "POST /Users/avatar (multipart)", method: "POST", path: "/Users/avatar", ct: "multipart/form-data", body: JSON.stringify({ /* field name: avatar */ }, null, 2) },

  { group: "Game", label: "GET /Game", method: "GET", path: "/Game", ct: "" },
  { group: "Game", label: "POST /Game", method: "POST", path: "/Game", ct: "application/json", body: JSON.stringify({ name: "Game name", description: "Desc", price: 99.99, releaseDate: new Date().toISOString(), developerId: "GUID", publisherId: "GUID", genresIds: [1] }, null, 2) },
  { group: "Game", label: "PATCH /Game/update-cover-image/{gameId}", method: "PATCH", path: "/Game/update-cover-image/GAME_ID", ct: "multipart/form-data", body: JSON.stringify({ /* field name: coverImage */ }, null, 2) },
  { group: "Game", label: "PATCH /Game/update-screenshots-images/{gameId}", method: "PATCH", path: "/Game/update-screenshots-images/GAME_ID", ct: "multipart/form-data", body: JSON.stringify({ /* field name: newImages (multi), imagesToDelete (strings) */ }, null, 2) },

  { group: "Item", label: "GET /Item", method: "GET", path: "/Item", ct: "" },
  { group: "Item", label: "POST /Item", method: "POST", path: "/Item", ct: "application/json", body: JSON.stringify({ name: "AK-47 | Redline", description: "Covert Rifle", gameId: "GAME_GUID" }, null, 2) },
  { group: "Item", label: "PATCH /Item/update-image/{id}", method: "PATCH", path: "/Item/update-image/ITEM_ID", ct: "multipart/form-data", body: JSON.stringify({ /* field name: image */ }, null, 2) },

  { group: "Market", label: "GET /market-item", method: "GET", path: "/market-item", ct: "" },
  { group: "Market", label: "POST /market-item/put-up-for-sale", method: "POST", path: "/market-item/put-up-for-sale", ct: "application/json", body: JSON.stringify({ userItemId: "USER_ITEM_ID", price: 111 }, null, 2) },
  { group: "Market", label: "PUT /market-item/buy (query)", method: "PUT", path: "/market-item/buy?marketItemId=MARKET_ID", ct: "" },

  { group: "User Item", label: "GET /user-item", method: "GET", path: "/user-item", ct: "" },
  { group: "User Item", label: "GET /user-item/by-user", method: "GET", path: "/user-item/by-user", ct: "" },
  { group: "User Item", label: "POST /user-item", method: "POST", path: "/user-item", ct: "application/json", body: JSON.stringify({ userId: "USER_ID", itemId: "ITEM_ID", isTradable: true }, null, 2) },

  { group: "Genre", label: "GET /game-genre", method: "GET", path: "/game-genre", ct: "" },
  { group: "Genre", label: "POST /game-genre", method: "POST", path: "/game-genre", ct: "application/json", body: JSON.stringify({ name: "Action", description: "" }, null, 2) },

  { group: "Language", label: "POST /Language", method: "POST", path: "/Language", ct: "application/json", body: JSON.stringify({ name: "English", code: "EN" }, null, 2) },
  { group: "Country", label: "POST /Country", method: "POST", path: "/Country", ct: "application/json", body: JSON.stringify({ name: "Ukraine", code: "UA" }, null, 2) },

  { group: "Friendships", label: "POST /friends/send/{receiverId}", method: "POST", path: "/friends/send/USER_ID", ct: "" },
  { group: "Friendships", label: "POST /friends/accept/{requestId}", method: "POST", path: "/friends/accept/REQUEST_ID", ct: "" },
  { group: "Friendships", label: "POST /friends/reject/{requestId}", method: "POST", path: "/friends/reject/REQUEST_ID", ct: "" },

  { group: "Wishlist", label: "GET /Wishlist/by-user", method: "GET", path: "/Wishlist/by-user", ct: "" },
  { group: "Wishlist", label: "POST /Wishlist?gameId=", method: "POST", path: "/Wishlist?gameId=GAME_ID", ct: "" },
  { group: "Wishlist", label: "DELETE /Wishlist?gameId=", method: "DELETE", path: "/Wishlist?gameId=GAME_ID", ct: "" },

  { group: "Localization", label: "POST /Game/localization", method: "POST", path: "/Game/localization", ct: "application/json", body: JSON.stringify({ interface: true, fullAudio: false, subtitles: true, gameId: "GAME_ID", languageId: 1 }, null, 2) },

  { group: "SystemReq", label: "POST /Game/system-requirements", method: "POST", path: "/Game/system-requirements", ct: "application/json", body: JSON.stringify({ gameId: "GAME_ID", platform: 0, requirementType: 0, os: "Windows 10", processor: "i5", memory: "8 GB", graphics: "GTX 960", directX: "11", storage: "30 GB", network: "Broadband" }, null, 2) },
];

const HISTORY_KEY = "admin_api_console_history_v1";

function readHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeHistory(list) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20))); } catch {}
}

export default function ApiConsole({
  defaultMethod = "GET",
  defaultPath = "/Game",
  defaultContentType = "application/json",
  title = "API Console",
}) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE);
  const [method, setMethod] = useState(defaultMethod);
  const [path, setPath] = useState(defaultPath);
  const [contentType, setContentType] = useState(defaultContentType);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [headersText, setHeadersText] = useState("{}");
  const [bodyText, setBodyText] = useState("{}");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState(null);
  const [presetIdx, setPresetIdx] = useState(-1);
  const [history, setHistory] = useState(readHistory());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "accessToken") setToken(e.newValue || "");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const groupedPresets = useMemo(() => {
    const map = new Map();
    for (const p of PRESETS) {
      const arr = map.get(p.group) || [];
      arr.push(p);
      map.set(p.group, arr);
    }
    return Array.from(map.entries());
  }, []);

  const applyPreset = (p) => {
    setMethod(p.method);
    setPath(p.path);
    setContentType(p.ct || "");
    if (p.body != null) setBodyText(p.body);
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const buildCurl = () => {
    const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const lines = [`curl -X '${method}' \\`, `  '${url}' \\`];
    const hdrs = [];
    if (token) hdrs.push(`  -H 'Authorization: Bearer ${token}' \\`);
    if (contentType === "application/json" && method !== "GET") hdrs.push(`  -H 'Content-Type: application/json' \\`);
    try {
      const extra = JSON.parse(headersText || "{}");
      for (const [k, v] of Object.entries(extra)) {
        hdrs.push(`  -H '${k}: ${v}' \\`);
      }
    } catch {}
    const body = (contentType === "application/json" && method !== "GET") ? (bodyText || "{}") : null;
    const final = [...lines, ...hdrs, body ? `  -d '${body.replace(/'/g, "\\'")}'` : ""].filter(Boolean).join("\n");
    return final;
  };

  const saveToHistory = () => {
    const rec = {
      t: Date.now(),
      method, path, contentType, headersText, bodyText,
    };
    const next = [rec, ...history].slice(0, 20);
    setHistory(next);
    writeHistory(next);
  };

  const loadFromHistory = (rec) => {
    setMethod(rec.method);
    setPath(rec.path);
    setContentType(rec.contentType);
    setHeadersText(rec.headersText);
    setBodyText(rec.bodyText);
  };

  const send = async () => {
    setLoading(true);
    setResp(null);
    setStatus(null);
    setErr(null);
    try {
      const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

      const extraHeaders = {};
      if (token) extraHeaders["Authorization"] = `Bearer ${token}`;
      let parsedHdrs = {};
      try { parsedHdrs = JSON.parse(headersText || "{}"); } catch {}
      let headers = { ...extraHeaders, ...parsedHdrs };

      let body;
      if (contentType === "multipart/form-data") {
        const form = new FormData();
        try {
          const obj = JSON.parse(bodyText || "{}");
          Object.entries(obj).forEach(([k, v]) => {
            if (typeof v === "object" && v != null) form.append(k, JSON.stringify(v));
            else form.append(k, v ?? "");
          });
        } catch {}
        for (const f of files) form.append(f.field || "file", f.file);
        body = form;
      } else if (contentType === "application/json" && method !== "GET") {
        headers["Content-Type"] = "application/json";
        body = bodyText ? bodyText : "{}";
      } else {
        body = method === "GET" || method === "DELETE" ? undefined : bodyText || "";
      }

      const res = await fetch(url, { method, headers, body, credentials: "include" });
      setStatus(`${res.status} ${res.statusText}`);
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) setErr(typeof data === "string" ? data : data?.message || "Request failed");
      setResp(data);
      saveToHistory();
    } catch (e) {
      setErr(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef(null);

  return (
    <div className="adminall-console flux-border">
      <div className="console-head">
        <h3>{title}</h3>
        <div className="row">
          <label>
            Presets
            <select value={presetIdx} onChange={(e) => setPresetIdx(parseInt(e.target.value, 10))}>
              <option value={-1}>— select preset —</option>
              {groupedPresets.map(([grp, arr], gi) => (
                <optgroup key={grp} label={grp}>
                  {arr.map((p, i) => (
                    <option key={`${grp}-${i}`} value={PRESETS.indexOf(p)}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="actions">
            <button
              className="btn"
              onClick={() => {
                if (presetIdx >= 0) applyPreset(PRESETS[presetIdx]);
              }}
            >
              Apply
            </button>
            <button className="btn" onClick={() => setPresetIdx(-1)}>Clear</button>
          </div>
        </div>
        <div className="row">
          <label>
            Base URL
            <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          </label>
          <label>
            Method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="path">
            Path
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/Game" />
          </label>
        </div>
        <div className="row">
          <label>
            Content-Type
            <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
              <option value="application/json">application/json</option>
              <option value="multipart/form-data">multipart/form-data</option>
              <option value="">(none)</option>
            </select>
          </label>

          <label className="token">
            Bearer token (optional)
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOi..."
                style={{ flex: 1 }}
              />
              <button type="button" className="btn" onClick={() => setToken(localStorage.getItem("accessToken") || "")}>
                ↻ load
              </button>
              <button type="button" className="btn" onClick={() => { localStorage.setItem("accessToken", token || ""); alert("Token saved to localStorage"); }}>
                Save
              </button>
            </div>
          </label>
        </div>
        <div className="row">
          <label className="ta">
            Headers (JSON)
            <textarea
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              spellCheck={false}
              rows={4}
              placeholder='{"X-Custom":"1"}'
            />
          </label>
          <label className="ta">
            Body
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              spellCheck={false}
              rows={4}
              placeholder='{"name":"AK-47", "price": 99.99}'
            />
          </label>
        </div>
        {contentType === "multipart/form-data" && (
          <div className="row">
            <div className="files">
              <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
                Add files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const arr = Array.from(e.target.files || []);
                  setFiles((prev) => [...prev, ...arr.map((f) => ({ field: "file", file: f }))]);
                }}
              />
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-row">
                    <span>{f.file.name}</span>
                    <input
                      value={f.field}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFiles((prev) => prev.map((x, idx) => (idx === i ? { ...x, field: v } : x)));
                      }}
                      placeholder="field name (e.g. image, coverImage)"
                    />
                    <button type="button" className="btn danger" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="row actions" style={{ gap: 8 }}>
          <button className="btn primary" onClick={send} disabled={loading}>
            {loading ? "Sending..." : "Send request"}
          </button>
          <button className="btn" onClick={() => copy(buildCurl())}>Copy curl</button>
          <button className="btn danger" onClick={() => { setResp(null); setStatus(null); setErr(null); }}>Clear result</button>
        </div>

        {/* History */}
        <div className="row">
          <label>
            History (last 20)
            <select onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              if (idx >= 0) loadFromHistory(history[idx]);
            }}>
              <option value={-1}>— pick request —</option>
              {history.map((h, idx) => (
                <option key={h.t} value={idx}>
                  [{new Date(h.t).toLocaleString()}] {h.method} {h.path}
                </option>
              ))}
            </select>
          </label>
          <div className="actions">
            <button className="btn danger" onClick={() => { setHistory([]); writeHistory([]); }}>Clear history</button>
          </div>
        </div>
      </div>

      <div className="console-body">
        {status && <div className="status">Status: {status}</div>}
        {err && <div className="err">Error: {String(err)}</div>}
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <button className="btn" onClick={() => { if (resp != null) navigator.clipboard.writeText(typeof resp === "string" ? resp : JSON.stringify(resp, null, 2)); }}>Copy response</button>
        </div>
        <pre className="resp">
{typeof resp === "string" ? resp : JSON.stringify(resp, null, 2)}
        </pre>
      </div>
    </div>
  );
}