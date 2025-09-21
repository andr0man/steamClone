import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./EditProfile.scss";
import Notification from "../../../components/Notification";
import {
  User,
  Shield,
  BarChart3,
  Users,
  Gift,
  UploadCloud,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";

import {
  useGetProfileQuery,
  useUpdateUserMutation,   // PUT /Users/{id}
  useUploadAvatarMutation,   // POST /Users/avatar (FormData)
} from "../../../services/profile/profileApi";

import { useGetAllCountrysQuery } from "../../../services/country/countryApi";

const BIO_MAX = 280;
const USERNAME_MAX = 32;

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { data, isLoading, error } = useGetProfileQuery(user?.id, {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
    });
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const { data: countriesRes } = useGetAllCountrysQuery();

  const server = useMemo(() => data?.payload || data || {}, [data]);
  const countries = useMemo(() => {
    const raw = countriesRes?.payload ?? countriesRes;
    return Array.isArray(raw) ? raw : [];
  }, [countriesRes]);

  const [username, setUsername] = useState("Username");
  const [countryId, setCountryId] = useState(null);
  const [bio, setBio] = useState("This user has not set up a bio yet.");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [level, setLevel] = useState(0);
  const [memberSince, setMemberSince] = useState("N/A");
  const [friendsCount, setFriendsCount] = useState(0);
  const [badges, setBadges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [favoriteWorlds, setFavoriteWorlds] = useState([]);
  const [favoriteGame, setFavoriteGame] = useState(null);

  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const [newFavTitle, setNewFavTitle] = useState("");
  const [newFavImage, setNewFavImage] = useState("");

  const fileInputRef = useRef(null);
  const originRef = useRef(null);

  useEffect(() => {
    if (error)
      setApiError(error?.data?.message || "Could not load profile data.");
  }, [error]);

  useEffect(() => {
    if (!server || !Object.keys(server).length) return;

    const sFavWorlds = Array.isArray(server.favoriteWorlds)
      ? server.favoriteWorlds
      : [];
    const sFavGame =
      server.favoriteGame &&
      server.favoriteGame.title &&
      server.favoriteGame.imageUrl
        ? [server.favoriteGame]
        : [];

    const name =
      server.username ||
      server.userName ||
      server.nickName ||
      server.nickname ||
      "Username";
    const cId = server.country?.id ?? server.countryId ?? null;
    const ms =
      server.memberSince || server.createdAt || server.registeredAt || "N/A";

    setUsername(name);
    setCountryId(cId);
    setBio(server.bio || "This user has not set up a bio yet.");
    setAvatarUrl(server.avatarUrl);
    setLevel(server.level ?? 0);
    setMemberSince(
      typeof ms === "string" ? ms : new Date(ms).toLocaleDateString()
    );
    setFriendsCount(server.friendsCount ?? 0);
    setBadges(Array.isArray(server.badges) ? server.badges : []);
    setRecentActivity(
      Array.isArray(server.recentActivity) ? server.recentActivity : []
    );
    setFavoriteWorlds(sFavWorlds);
    setFavoriteGame(server.favoriteGame || null);

    originRef.current = {
      username: name,
      countryId: cId,
      bio: server.bio || "This user has not set up a bio yet.",
      avatarUrl:
        server.avatarUrl ||
        "https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=User",
      favoriteWorlds: sFavWorlds.length ? sFavWorlds : sFavGame,
    };
  }, [server]);

  const favEditable = useMemo(() => {
    if (Array.isArray(favoriteWorlds) && favoriteWorlds.length)
      return favoriteWorlds;
    if (favoriteGame?.title && favoriteGame?.imageUrl) return [favoriteGame];
    return [];
  }, [favoriteWorlds, favoriteGame]);

  const normalizedCurrent = useMemo(
    () => ({
      username,
      countryId,
      bio,
      avatarUrl,
      favoriteWorlds: (favoriteWorlds || []).map((f) => ({
        title: f.title,
        imageUrl: f.imageUrl,
      })),
    }),
    [username, countryId, bio, avatarUrl, favoriteWorlds]
  );

  const dirty = useMemo(() => {
    const o = originRef.current;
    if (!o) return false;
    const toMin = (v) => JSON.stringify(v);
    return (
      toMin({
        username: o.username,
        countryId: o.countryId,
        bio: o.bio,
        avatarUrl: o.avatarUrl,
        favoriteWorlds: (o.favoriteWorlds || []).map((f) => ({
          title: f.title,
          imageUrl: f.imageUrl,
        })),
      }) !== toMin(normalizedCurrent)
    );
  }, [normalizedCurrent]);

  useEffect(() => {
    const beforeUnload = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const handleAddFavorite = () => {
    if (!newFavTitle.trim() || !newFavImage.trim()) return;
    const id =
      (crypto?.randomUUID && crypto.randomUUID()) || `fav-${Date.now()}`;
    const newItem = {
      id,
      title: newFavTitle.trim(),
      imageUrl: newFavImage.trim(),
    };
    setFavoriteWorlds((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      newItem,
    ]);
    setNewFavTitle("");
    setNewFavImage("");
  };

  const handleRemoveFavorite = (id) => {
    setFavoriteWorlds((prev) =>
      (prev || []).filter((item) => (item.id || item.title) !== id)
    );
  };

  const handleAvatarPick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("UserId", server?.id ?? server?.userId);
      fd.append("Image", file);
      const res = await uploadAvatar(fd).unwrap();
      const url = res?.payload?.url || res?.url || res?.payload || null;
      if (url) setAvatarUrl(url);
      setApiSuccess("Avatar updated");
    } catch (err) {
      setApiError(err?.data?.message || "Avatar upload failed");
    } finally {
      e.target.value = "";
    }
  };

  // const validate = () => {
  //   if (!username.trim()) {
  //     setApiError("Username cannot be empty.");
  //     return false;
  //   }
  //   if (username.length > USERNAME_MAX) {
  //     setApiError(`Username must be under ${USERNAME_MAX} characters.`);
  //     return false;
  //   }
  //   if (bio.length > BIO_MAX) {
  //     setApiError(`Bio must be under ${BIO_MAX} characters.`);
  //     return false;
  //   }
  //   if (!countryId) {
  //     setApiError("Please select a country.");
  //     return false;
  //   }
  //   return true; 
  // };

  const handleSave = async () => {
  setApiError(null);
  setApiSuccess(null);

  if (!dirty) return;

  const payload = {};
  if (originRef.current.username !== username.trim()) payload.nickName = username.trim();
  if (originRef.current.bio !== bio) payload.bio = bio;
  if (originRef.current.countryId !== countryId) payload.countryId = countryId;
  if (originRef.current.avatarUrl !== avatarUrl) payload.avatarUrl = avatarUrl;
  if (JSON.stringify(originRef.current.favoriteWorlds) !== JSON.stringify(favEditable)) {
    payload.favoriteWorlds = favEditable.map(f => ({ title: f.title, imageUrl: f.imageUrl }));
  }

  if (Object.keys(payload).length === 0) {
    setApiError("No changes to save.");
    return;
  }

  // Валідація лише тих полів, які змінилися
  if ("nickName" in payload && !payload.nickName.trim()) {
    setApiError("Username cannot be empty.");
    return;
  }
  if ("nickName" in payload && payload.nickName.length > USERNAME_MAX) {
    setApiError(`Username must be under ${USERNAME_MAX} characters.`);
    return;
  }
  if ("bio" in payload && payload.bio.length > BIO_MAX) {
    setApiError(`Bio must be under ${BIO_MAX} characters.`);
    return;
  }
  if ("countryId" in payload && !payload.countryId) {
    setApiError("Please select a country.");
    return;
  }

  const userId = server?.id;
  if (!userId) {
    setApiError("User ID not found. Reload the page.");
    return;
  }

  try {
    await updateUser({ id: userId, ...payload }).unwrap();

    originRef.current = {
      ...originRef.current,
      ...payload,
    };

    setApiSuccess("Profile saved");
    setTimeout(() => navigate("/profile"), 650);
  } catch (err) {
    setApiError(err?.data?.message || "Could not save profile");
  }
};

  const handleCancel = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    navigate("/profile");
  };

  const resetToOrigin = () => {
    const o = originRef.current;
    if (!o) return;
    setUsername(o.username);
    setCountryId(o.countryId ?? null);
    setBio(o.bio);
    setAvatarUrl(o.avatarUrl);
    setFavoriteWorlds(o.favoriteWorlds || []);
    setApiError(null);
    setApiSuccess(null);
  };

  const countryNameById = (id) =>
    countries.find((c) => String(c.id) === String(id))?.name || "—";

  return (
    <div className="profile-page-container edit-mode">
      <div className="notification-global-top">
        <Notification
          message={apiError}
          type="error"
          onClose={() => setApiError(null)}
        />
        <Notification
          message={apiSuccess}
          type="success"
          onClose={() => setApiSuccess(null)}
        />
      </div>

      {(isLoading || isSaving) && (
        <div className="profile-loading-overlay visible">
          {isSaving ? "Saving..." : "Loading data..."}
        </div>
      )}

      <div className="edit-topbar">
        <button className="back-link" onClick={handleCancel}>
          <ArrowLeft size={16} />
          Back to Profile
        </button>
        <div className="topbar-actions">
          {dirty && (
            <span className="unsaved-dot" title="Unsaved changes"></span>
          )}
          <button
            className="ghost-btn"
            onClick={resetToOrigin}
            disabled={!dirty || isSaving}
          >
            Reset
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={!dirty || isSaving}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="profile-main-content">
        <div className="profile-sidebar editable">
          <div className="avatar-edit-wrap">
            <div className="avatar-frame">
              <div className="profile-avatar">
                <img
                  src={avatarUrl ?? "/common/icon_profile.svg"}
                  alt={`${username}'s avatar`}
                  style={{ padding: avatarUrl ? 0 : 40 }}
                />
              </div>
              <button
                type="button"
                className="avatar-change-fab"
                onClick={handleAvatarPick}
                title="Change avatar"
              >
                <UploadCloud size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-file"
              onChange={handleAvatarChange}
            />
            {isUploadingAvatar && (
              <span className="uploading-hint">Uploading...</span>
            )}
          </div>

          <div className="stack">
            <label className="stack-label">Username</label>
            <div className="input-with-counter">
              <input
                className={`profile-username-input ${
                  username.length > USERNAME_MAX ? "error" : ""
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                maxLength={USERNAME_MAX + 5}
              />
              <span
                className={`counter ${
                  username.length > USERNAME_MAX ? "over" : ""
                }`}
              >
                {username.length}/{USERNAME_MAX}
              </span>
            </div>
          </div>

          <p className="profile-level">
            Level <span className="level-badge">{level}</span>
          </p>

          <div className="sidebar-field">
            <label>Country</label>
            <select
              value={countryId ?? ""}
              onChange={(e) => setCountryId(Number(e.target.value) || null)}
            >
              <option value="" disabled>
                Select country
              </option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {!countryId && (
              <div className="muted" style={{ marginTop: 4 }}>
                Current:{" "}
                {countryNameById(server.country?.id || server.countryId) || "—"}
              </div>
            )}
          </div>

          <div className="sidebar-field readonly">
            <label>Member since</label>
            <div className="readonly-chip">{memberSince}</div>
          </div>

          <div className="profile-navigation">
            <a href="#activity" className="profile-nav-link">
              <BarChart3 size={18} /> Activity
            </a>
            <a href="#badges" className="profile-nav-link">
              <Shield size={18} /> Badges
            </a>
            <a href="#friends" className="profile-nav-link">
              <Users size={18} /> Friends ({friendsCount})
            </a>
            <a href="#inventory" className="profile-nav-link">
              <Gift size={18} /> Inventory
            </a>
          </div>
        </div>

        <div className="profile-details-column">
          <div className="profile-section profile-bio editable">
            <div className="section-header">
              <h3>
                <User size={22} /> About me
              </h3>
              <div className="counter-wrap">
                <span
                  className={`counter ${bio.length > BIO_MAX ? "over" : ""}`}
                >
                  {bio.length}/{BIO_MAX}
                </span>
              </div>
            </div>
            <textarea
              className="edit-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              placeholder="Tell something about yourself..."
              maxLength={BIO_MAX + 50}
            />
          </div>

          <div className="profile-section profile-favorites editable">
            <div className="section-header">
              <h3>Favorite worlds ({favEditable.length})</h3>
              <span className="muted">Add up to 8</span>
            </div>

            <div className="favorites-row editable-grid">
              {favEditable.slice(0, 8).map((g, i) => (
                <div
                  className="favorite-card edit"
                  key={g.id || `${g.title}-${i}`}
                >
                  <img src={g.imageUrl} alt={g.title} />
                  <div className="fav-title">{g.title}</div>
                  <button
                    className="remove-fav"
                    onClick={() => handleRemoveFavorite(g.id || g.title)}
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {favEditable.length < 8 && (
                <div className="favorite-card add-card">
                  <div className="add-form">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newFavTitle}
                      onChange={(e) => setNewFavTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newFavImage}
                      onChange={(e) => setNewFavImage(e.target.value)}
                    />
                    <button className="add-btn" onClick={handleAddFavorite}>
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section profile-badges">
            <div className="section-header">
              <h3>
                <Shield size={22} /> Badges ({(badges && badges.length) || 0})
              </h3>
              <span className="muted">Managed automatically</span>
            </div>
            {badges && badges.length > 0 ? (
              <div className="badges-grid">
                {badges.map((badge, index) => (
                  <div
                    key={badge.id || index}
                    className="badge-item"
                    data-title={badge.name}
                  >
                    <img
                      src={
                        badge.iconUrl ||
                        "https://via.placeholder.com/60/CCCCCC/000000?Text=B"
                      }
                      alt={badge.name || "Badge"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No badges to display.</p>
            )}
          </div>

          <div
            className="profile-section profile-recent-activity"
            id="activity"
          >
            <div className="section-header">
              <h3>
                <BarChart3 size={22} /> Recent Activity
              </h3>
              <span className="muted">Read-only</span>
            </div>
            {recentActivity && recentActivity.length > 0 ? (
              <ul>
                {recentActivity.map((activity, index) => (
                  <li key={activity.id || index}>
                    <p>{activity.text}</p>
                    {activity.time && <span>{activity.time}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No recent activity to display.</p>
            )}
          </div>

          <div className="footer-actions">
            <button
              className="ghost-btn"
              onClick={resetToOrigin}
              disabled={!dirty || isSaving}
            >
              Reset
            </button>
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={!dirty || isSaving}
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
