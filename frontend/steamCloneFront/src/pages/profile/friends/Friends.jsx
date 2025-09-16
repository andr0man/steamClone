import React, { useMemo, useState } from "react";
import ProfileLayout from "../components/ProfileLayout";
import "./friends.scss";
import {
  Users,
  Search as SearchIcon,
  MessageSquareText,
  UserMinus,
  Check,
  X,
  Clock8,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Notification from "../../../components/Notification";

import {
  useGetFriendsQuery,
  useGetFriendsCountQuery,
  useGetRequestsReceivedQuery,
  useGetRequestsSentQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useDeleteFriendMutation,
  useSendFriendRequestMutation,
} from "../../../services/friends/friendsApi";

import {
  useGetAllUsersQuery,
  useGetProfileQuery as useGetMyProfileQuery,
} from "../../../services/profile/profileApi";

// Кружечок з ініціалом
const Avatar = ({ name = "U" }) => {
  const letter = (name?.trim?.()[0] || "U").toUpperCase();
  return <div className="avatar-circle">{letter}</div>;
};

const normalizeName = (u) =>
  u?.nickName ||
  u?.nickname ||
  u?.userName ||
  u?.username ||
  u?.name ||
  (u?.email ? u.email.split("@")[0] : "User");

const mapFriends = (res) => {
  const list = res?.payload ?? res ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((row) => {
    const f = row?.friend ?? row?.user ?? row;
    return {
      id: f?.id ?? row?.id,
      name: normalizeName(f),
      status: f?.status || f?.onlineStatus || "offline",
      level: f?.level ?? 0,
      game: f?.currentGame || null,
      lastOnline: f?.lastOnline || row?.lastOnline || null,
    };
  });
};

const mapRequestsReceived = (res) => {
  const list = res?.payload ?? res ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((r) => {
    const reqId = r?.id ?? r?.requestId ?? r?.request?.id;
    const from = r?.sender ?? r?.from ?? r?.requester ?? r?.userFrom ?? r?.user ?? {};
    return {
      requestId: reqId,
      fromId: from?.id,
      name: normalizeName(from),
      createdAt: r?.createdAt || null,
    };
  });
};

const mapRequestsSent = (res) => {
  const list = res?.payload ?? res ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((r) => {
    const reqId = r?.id ?? r?.requestId ?? r?.request?.id;
    const to = r?.receiver ?? r?.to ?? r?.userTo ?? r?.user ?? {};
    return {
      requestId: reqId,
      toId: to?.id,
      name: normalizeName(to),
      createdAt: r?.createdAt || null,
    };
  });
};

const mapUsers = (res) => {
  const list = res?.payload ?? res ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((u) => ({
    id: u?.id,
    name: normalizeName(u),
    email: u?.email || "",
    role: u?.role || u?.roleName || "",
  }));
};

const Friends = () => {
  const navigate = useNavigate();

  // me
  const { data: meRes } = useGetMyProfileQuery();
  const myId = meRes?.payload?.id ?? meRes?.id ?? null;

  // API
  const {
    data: friendsRes,
    isFetching: friendsLoading,
    isError: friendsErr,
    error: friendsErrObj,
    refetch: refetchFriends,
  } = useGetFriendsQuery();
  const {
    data: cntRes,
    isError: cntErr,
    error: cntErrObj,
  } = useGetFriendsCountQuery();
  const {
    data: recRes,
    isFetching: recLoading,
    isError: recErr,
    error: recErrObj,
    refetch: refetchRec,
  } = useGetRequestsReceivedQuery();
  const {
    data: sentRes,
    isFetching: sentLoading,
    isError: sentErr,
    error: sentErrObj,
    refetch: refetchSent,
  } = useGetRequestsSentQuery();

  const [acceptFriend] = useAcceptFriendRequestMutation();
  const [rejectFriend] = useRejectFriendRequestMutation();
  const [deleteFriend] = useDeleteFriendMutation();
  const [sendFriendRequest, { isLoading: sending }] = useSendFriendRequestMutation();

  const {
    data: allUsersRes,
    isFetching: usersLoading,
    isError: usersErr,
    error: usersErrObj,
  } = useGetAllUsersQuery();

  // UI стейти
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [peopleQ, setPeopleQ] = useState("");
  const [uiError, setUiError] = useState(null);
  const [uiSuccess, setUiSuccess] = useState(null);

  const friends = useMemo(() => mapFriends(friendsRes), [friendsRes]);
  const requestsReceived = useMemo(() => mapRequestsReceived(recRes), [recRes]);
  const requestsSent = useMemo(() => mapRequestsSent(sentRes), [sentRes]);
  const allUsers = useMemo(() => mapUsers(allUsersRes), [allUsersRes]);

  const totalCount =
    cntRes?.payload?.count ?? cntRes?.count ?? friends?.length ?? 0;

  // індекси
  const friendIds = useMemo(() => new Set(friends.map((f) => f.id)), [friends]);
  const recByUser = useMemo(() => {
    const m = new Map();
    for (const r of requestsReceived) if (r.fromId) m.set(r.fromId, r.requestId);
    return m;
  }, [requestsReceived]);
  const sentToUser = useMemo(() => {
    const m = new Map();
    for (const r of requestsSent) if (r.toId) m.set(r.toId, r.requestId);
    return m;
  }, [requestsSent]);

  // друзів фільтруємо
  const filtered = useMemo(() => {
    let arr = friends.slice();
    const s = q.trim().toLowerCase();
    if (s) arr = arr.filter((u) => (u.name || "").toLowerCase().includes(s));
    if (tab !== "all") arr = arr.filter((u) => (u.status || "offline") === tab);
    return arr;
  }, [friends, q, tab]);

  // всі користувачі з пошуком + статуси
  const people = useMemo(() => {
    const s = peopleQ.trim().toLowerCase();
    const base = allUsers
      .filter((u) => u.id && u.id !== myId)
      .map((u) => {
        let status = "none";
        let requestId = null;
        if (friendIds.has(u.id)) status = "friend";
        else if (sentToUser.has(u.id)) status = "pending";
        else if (recByUser.has(u.id)) {
          status = "incoming";
          requestId = recByUser.get(u.id);
        }
        return { ...u, status, requestId };
      });

    const filtered = s
      ? base.filter(
          (u) =>
            (u.name || "").toLowerCase().includes(s) ||
            (u.email || "").toLowerCase().includes(s)
        )
      : base;

    const rank = { incoming: 0, none: 1, pending: 2, friend: 3 };
    filtered.sort((a, b) => (rank[a.status] ?? 5) - (rank[b.status] ?? 5));

    return filtered.slice(0, 50);
  }, [allUsers, myId, peopleQ, friendIds, sentToUser, recByUser]);

  // дії
  const message = (id) => navigate("/chat", { state: { to: id } });

  const onAccept = async (requestId) => {
    try {
      await acceptFriend(requestId).unwrap();
      refetchFriends();
      refetchRec();
      setUiSuccess("Friend request accepted");
    } catch (e) {
      setUiError(e?.data?.message || "Accept failed");
    }
  };

  const onReject = async (requestId) => {
    try {
      await rejectFriend(requestId).unwrap();
      refetchRec();
      setUiSuccess("Friend request rejected");
    } catch (e) {
      setUiError(e?.data?.message || "Reject failed");
    }
  };

  const onRemoveFriend = async (friendId) => {
    try {
      await deleteFriend(friendId).unwrap();
      refetchFriends();
      setUiSuccess("Friend removed");
    } catch (e) {
      setUiError(e?.data?.message || "Remove failed");
    }
  };

  const onSendRequest = async (userId) => {
    setUiError(null);
    setUiSuccess(null);
    try {
      await sendFriendRequest(userId).unwrap();
      refetchSent();
      setUiSuccess("Friend request sent");
    } catch (e) {
      setUiError(e?.data?.message || "Send request failed");
    }
  };

  // збираємо серверні помилки 500
  const serverErr =
    (friendsErr && friendsErrObj?.data?.message) ||
    (recErr && recErrObj?.data?.message) ||
    (sentErr && sentErrObj?.data?.message) ||
    (cntErr && cntErrObj?.data?.message) ||
    (usersErr && usersErrObj?.data?.message) ||
    null;

  return (
    <ProfileLayout>
      <div className="friends-container profile-section">
        <Notification message={serverErr} type="error" onClose={() => {}} />
        <Notification message={uiError} type="error" onClose={() => setUiError(null)} />
        <Notification message={uiSuccess} type="success" onClose={() => setUiSuccess(null)} />

        <div className="friends-head">
          <div className="left">
            <h3>
              <Users size={18} /> Friends
            </h3>
            <div className="tabs">
              <button className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
                All ({totalCount})
              </button>
              <button className={`tab ${tab === "online" ? "active" : ""}`} onClick={() => setTab("online")}>
                Online
              </button>
              <button className={`tab ${tab === "in_game" ? "active" : ""}`} onClick={() => setTab("in_game")}>
                In-game
              </button>
              <button className={`tab ${tab === "offline" ? "active" : ""}`} onClick={() => setTab("offline")}>
                Offline
              </button>
            </div>
          </div>

          <div className="right">
            <div className="friends-input">
              <input
                placeholder="Search friends"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              />
              <SearchIcon size={16} className="ico" />
            </div>
          </div>
        </div>

        {/* Received */}
        <div className="requests-panel">
          <div className="rp-head">Friend requests received</div>
          {recLoading ? (
            <div className="empty">Loading…</div>
          ) : requestsReceived.length ? (
            <div className="requests-list">
              {requestsReceived.map((r) => (
                <div key={r.requestId} className="request-card">
                  <div className="left">
                    <Avatar name={r.name} />
                    <div className="meta">
                      <div className="name">{r.name}</div>
                      <div className="sub">
                        <Clock8 size={14} />{" "}
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <button className="ghost ok" onClick={() => onAccept(r.requestId)}>
                      <Check size={14} /> Accept
                    </button>
                    <button className="ghost bad" onClick={() => onReject(r.requestId)}>
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No incoming requests</div>
          )}
        </div>

        {/* Sent */}
        <div className="requests-panel">
          <div className="rp-head">Friend requests sent</div>
          {sentLoading ? (
            <div className="empty">Loading…</div>
          ) : requestsSent.length ? (
            <div className="requests-list">
              {requestsSent.map((r) => (
                <div key={r.requestId} className="request-card">
                  <div className="left">
                    <Avatar name={r.name} />
                    <div className="meta">
                      <div className="name">{r.name}</div>
                      <div className="sub">
                        <Clock8 size={14} />{" "}
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <span className="pill">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No sent requests</div>
          )}
        </div>

        {/* Find people */}
        <div className="people-panel">
          <div className="rp-head">Find people</div>
          <div className="friends-input" style={{ maxWidth: 360 }}>
            <input
              placeholder="Search by name or email"
              value={peopleQ}
              onChange={(e) => setPeopleQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
            <SearchIcon size={16} className="ico" />
          </div>

          <div className="people-list">
            {usersLoading ? (
              <div className="empty">Loading users…</div>
            ) : people.length ? (
              people.map((u) => (
                <div key={u.id} className="friend-card">
                  <div className="left">
                    <Avatar name={u.name} />
                    <div className="meta">
                      <div className="name">{u.name}</div>
                      <div className="sub">{u.email || "—"}</div>
                    </div>
                  </div>
                  <div className="right" style={{ gap: 6 }}>
                    {u.status === "incoming" && u.requestId ? (
                      <>
                        <button className="ghost ok" onClick={() => onAccept(u.requestId)}>
                          <Check size={14} /> Accept
                        </button>
                        <button className="ghost bad" onClick={() => onReject(u.requestId)}>
                          <X size={14} /> Reject
                        </button>
                      </>
                    ) : u.status === "pending" ? (
                      <span className="pill">Pending</span>
                    ) : u.status === "friend" ? (
                      <>
                        <span className="pill">Friend</span>
                        <button className="ghost" onClick={() => message(u.id)}>
                          <MessageSquareText size={16} /> Message
                        </button>
                      </>
                    ) : (
                      <button
                        className="ghost"
                        disabled={sending}
                        onClick={() => onSendRequest(u.id)}
                        title="Add friend"
                      >
                        <UserPlus size={16} /> Add friend
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">No users found</div>
            )}
          </div>
        </div>

        {/* Друзі */}
        <div className="friends-list">
          {friendsLoading ? (
            <div className="empty">Loading friends…</div>
          ) : filtered.length ? (
            filtered.map((u) => (
              <div key={u.id} className={`friend-card ${u.status}`}>
                <div className="left">
                  <Avatar name={u.name} />
                  <div className="meta">
                    <div className="name">{u.name}</div>
                    <div className="sub">
                      <span className={`st ${u.status}`}>{(u.status || "offline").replace("_", " ")}</span>
                      {u.game && (
                        <>
                          <span className="dot">•</span>
                          <span className="game">{u.game}</span>
                        </>
                      )}
                      {u.lastOnline && (
                        <>
                          <span className="dot">•</span>
                          <span className="last">
                            last: {new Date(u.lastOnline).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="right">
                  <button className="ghost" onClick={() => navigate("/chat", { state: { to: u.id } })}>
                    <MessageSquareText size={16} /> Message
                  </button>
                  <button className="ghost" onClick={() => onRemoveFriend(u.id)}>
                    <UserMinus size={16} /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">No friends</div>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Friends;