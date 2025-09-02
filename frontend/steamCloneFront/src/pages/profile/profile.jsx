import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.scss';
import Notification from '../../components/Notification';
import { User, Shield, BarChart3, Users, Gift } from 'lucide-react';
import { useGetProfileQuery } from '../../services/user/userApi';


const initialProfileState = {
  username: 'Username',
  avatarUrl: 'https://via.placeholder.com/180/CCCCCC/FFFFFF?Text=User',
  level: 0,
  country: 'Country',
  memberSince: 'N/A',
  bio: 'This user has not set up a bio yet.',
  recentActivity: [],
  favoriteGame: null,
  favoriteWorlds: [],
  badges: [],
  friendsCount: 0,
};

const Profile = ({ userData }) => {
  const [profileData, setProfileData] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProfileQuery();

  useEffect(() => setLoading(isLoading), [isLoading]);

  useEffect(() => {
    if (error) {
      setApiError(error?.data?.message || 'Could not load profile data from server.');
      if (userData) {
        setProfileData(prev => ({ ...prev, ...initialProfileState, ...userData }));
      }
    } else {
      setApiError(null);
    }
  }, [error, userData]);

  useEffect(() => {
    if (!data) return;
    const payload = data?.payload || data || {};
    setProfileData(prev => ({
      ...prev,
      ...payload,
      recentActivity: payload.recentActivity || prev.recentActivity || [],
      badges: payload.badges || prev.badges || [],
      friendsCount: payload.friendsCount ?? prev.friendsCount ?? 0,
      favoriteWorlds: payload.favoriteWorlds || prev.favoriteWorlds || [],
    }));
  }, [data]);

  const displayData = loading && !profileData.username ? initialProfileState : profileData;

  const handleEditProfileClick = () => navigate('/profile/edit');

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

  const favoriteWorlds = Array.isArray(fw) && fw.length
    ? fw
    : (favoriteGame && favoriteGame.title && favoriteGame.imageUrl ? [favoriteGame] : []);

  return (
    <>
      <div id="page-top" className="profile-page-wrapper">
        <div className="notification-global-top">
          <Notification message={apiError} type="error" onClose={() => setApiError(null)} />
        </div>

        {loading && <div className="profile-loading-overlay visible">Loading data...</div>}

        <div className="profile-page-container">
          <div className="profile-main-content">
            <aside className="profile-sidebar">
              <img src={avatarUrl} alt={`${username}'s avatar`} className="profile-avatar" />
              <h1 className="profile-username">{username}</h1>
              <p className="profile-level">Level <span className="level-badge">{level}</span></p>
              <p className="profile-country">{country}</p>
              <p className="profile-member-since">Member since: {memberSince}</p>

              <button className="profile-edit-button" onClick={handleEditProfileClick} />

              <nav className="profile-navigation">
                <a href="#activity" className="profile-nav-link"><BarChart3 size={18} /> Activity</a>
                <a href="#badges" className="profile-nav-link"><Shield size={18} /> Badges</a>
                <a href="#friends" className="profile-nav-link"><Users size={18} /> Friends ({friendsCount})</a>
                <a href="#inventory" className="profile-nav-link"><Gift size={18} /> Inventory</a>
              </nav>
            </aside>

            <section className="profile-details-column">
              {}
              <div className="profile-section profile-bio">
                <div className="section-header">
                  <h3><User size={22} /> About me</h3>
                </div>
                <p>{bio}</p>
              </div>

              <div className="profile-section profile-favorites">
                <div className="section-header">
                  <h3>Favorite worlds ({favoriteWorlds.length})</h3>
                  <a href="#favorites" className="section-action">See all</a>
                </div>
                {favoriteWorlds.length ? (
                  <div className="favorites-row">
                    {favoriteWorlds.slice(0, 8).map((g, i) => (
                      <div className="favorite-card" key={g.id || `${g.title}-${i}`}>
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
                  <h3><Shield size={22} /> Badges ({(badges && badges.length) || 0})</h3>
                  <a href="#badges-all" className="section-action">See all</a>
                </div>
                {badges && badges.length > 0 ? (
                  <div className="badges-grid">
                    {badges.map((badge, index) => (
                      <div key={badge.id || index} className="badge-item" data-title={badge.name}>
                        <img src={badge.iconUrl || 'https://via.placeholder.com/60/CCCCCC/000000?Text=B'} alt={badge.name || 'Badge'} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No badges to display.</p>
                )}
              </div>

              <div className="profile-section profile-recent-activity" id="activity">
                <div className="section-header">
                  <h3><BarChart3 size={22} /> Recent Activity</h3>
                  <a href="#activity-all" className="section-action">See all</a>
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