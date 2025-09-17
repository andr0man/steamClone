import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./profile.scss";
import Notification from "../../components/Notification";
import { User, Shield, BarChart3, Users, Gift, Wallet } from "lucide-react";
// import { useGetProfileQuery, useGetBalanceQuery } from "../../services/profileApi";
import {
  useGetProfileQuery,
  useGetBalanceQuery,
} from "../../services/profile/profileApi";
import { formatDateForInput } from "../admin/common/formatDateForInput";

const initialProfileState = {
  username: "Username",
  avatarUrl: null,
  level: 0,
  country: "Country",
  memberSince: "N/A",
  bio: "This user has not set up a bio yet.",
  recentActivity: [],
  favoriteGame: null,
  favoriteWorlds: [],
  badges: [],
  friendsCount: 0,
};

const formatUAH = (n) =>
  `${Number(n || 0).toLocaleString("uk-UA", { maximumFractionDigits: 0 })}₴`;

const Profile = ({ userData }) => {
  const [profileData, setProfileData] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProfileQuery();
  const {
    data: balRes,
    isLoading: balLoading,
    error: balErr,
  } = useGetBalanceQuery();

  useEffect(() => setLoading(isLoading || balLoading), [isLoading, balLoading]);

  useEffect(() => {
    if (error || balErr) {
      setApiError(
        error?.data?.message ||
          balErr?.data?.message ||
          "Could not load profile data from server."
      );
      if (userData) {
        setProfileData((prev) => ({
          ...prev,
          ...initialProfileState,
          ...userData,
        }));
      }
    } else {
      setApiError(null);
    }
  }, [error, balErr, userData]);

  useEffect(() => {
    if (!data) return;
    const p = data?.payload || data || {};

    // нормалізація полів з бекенду
    const username =
      p.username || p.userName || p.nickName || p.nickname || "Username";
    const countryName =
      p.country?.name || p.countryName || p.country || "Country";
    const memberSince = p.memberSince || p.createdAt || p.registeredAt || "N/A";

    setProfileData((prev) => ({
      ...prev,
      username,
      avatarUrl: p.avatarUrl || prev.avatarUrl,
      level: p.level ?? prev.level ?? 0,
      country: countryName,
      memberSince:
        typeof memberSince === "string"
          ? memberSince
          : new Date(memberSince).toLocaleDateString(),
      bio: p.bio || prev.bio,
      recentActivity: Array.isArray(p.recentActivity)
        ? p.recentActivity
        : prev.recentActivity || [],
      badges: Array.isArray(p.badges) ? p.badges : prev.badges || [],
      friendsCount: p.friendsCount ?? prev.friendsCount ?? 0,
      favoriteWorlds: Array.isArray(p.favoriteWorlds)
        ? p.favoriteWorlds
        : prev.favoriteWorlds || [],
      favoriteGame: p.favoriteGame || prev.favoriteGame || null,
    }));
  }, [data]);

  const displayData =
    loading && !profileData.username ? initialProfileState : profileData;

  const handleEditProfileClick = () => navigate("/profile/edit");

  const {
    username,
    avatarUrl,
    level,
    country,
    memberSince,
    bio,
    recentActivity,
    favoriteGame,
    favoriteWorlds: fw,
    badges,
    friendsCount,
  } = displayData;

  const favoriteWorlds =
    Array.isArray(fw) && fw.length
      ? fw
      : favoriteGame && favoriteGame.title && favoriteGame.imageUrl
      ? [favoriteGame]
      : [];

  const balance =
    balRes?.payload?.balance ??
    balRes?.payload?.amount ??
    balRes?.balance ??
    balRes?.amount ??
    0;

  return (
    <>
      <div id="page-top" className="profile-page-wrapper">
        <div className="notification-global-top">
          <Notification
            message={apiError}
            type="error"
            onClose={() => setApiError(null)}
          />
        </div>

        {loading && (
          <div className="profile-loading-overlay visible">Loading data...</div>
        )}

        <div className="profile-page-container">
          <div className="profile-main-content">
            <aside className="profile-sidebar">
              <div className="profile-avatar">
                <img
                  src={avatarUrl ?? "/common/icon_profile.svg"}
                  alt={`${username}'s avatar`}
                  style={{ padding: avatarUrl ? 0 : 40 }}
                />
              </div>
              <h1 className="profile-username">{username}</h1>

              <p className="profile-level">
                Level <span className="level-badge">{level}</span>
              </p>
              <p className="profile-country">{country}</p>
              <p className="profile-member-since">
                Member since: {formatDateForInput(memberSince)}
              </p>

              <div
                className="profile-balance-chip"
                title="Wallet balance"
                style={{ marginTop: 8 }}
              >
                <Wallet size={16} style={{ marginRight: 6 }} />
                <span>{formatUAH(balance)}</span>
              </div>

              <button
                className="profile-edit-button"
                onClick={handleEditProfileClick}
              />

              <nav className="profile-navigation">
                <NavLink
                  to="/profile/activity"
                  className={({ isActive }) =>
                    `profile-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <BarChart3 size={18} /> Activity
                </NavLink>
                <NavLink
                  to="/profile/badges"
                  className={({ isActive }) =>
                    `profile-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Shield size={18} /> Badges
                </NavLink>
                <NavLink
                  to="/profile/friends"
                  className={({ isActive }) =>
                    `profile-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Users size={18} /> Friends ({friendsCount})
                </NavLink>
                <NavLink
                  to="/profile/inventory"
                  className={({ isActive }) =>
                    `profile-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Gift size={18} /> Inventory
                </NavLink>
              </nav>
            </aside>

            <section className="profile-details-column">
              <div className="profile-section profile-bio">
                <div className="section-header">
                  <h3>
                    <User size={22} /> About me
                  </h3>
                </div>
                <p>{bio}</p>
              </div>

              <div className="profile-section profile-favorites">
                <div className="section-header">
                  <h3>Favorite worlds ({favoriteWorlds.length})</h3>
                  <a href="#favorites" className="section-action">
                    See all
                  </a>
                </div>
                {favoriteWorlds.length ? (
                  <div className="favorites-row">
                    {favoriteWorlds.slice(0, 8).map((g, i) => (
                      <div
                        className="favorite-card"
                        key={g.id || `${g.title}-${i}`}
                      >
                        <img src={g.imageUrl} alt={g.title} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No favorite worlds yet.</p>
                )}
              </div>

              <div className="profile-section profile-badges" id="badges">
                <div className="section-header">
                  <h3>
                    <Shield size={22} /> Badges (
                    {(badges && badges.length) || 0})
                  </h3>
                  <NavLink to="/profile/badges" className="section-action">
                    See all
                  </NavLink>
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
                  <NavLink to="/profile/activity" className="section-action">
                    See all
                  </NavLink>
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
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
