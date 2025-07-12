import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './profile.scss'; 
import Notification from '../../components/Notification';
import { User, Shield, BarChart3, Users, Gift, Edit3 } from 'lucide-react';
import { useGetProfileQuery } from '../../services/user/userApi';



const initialProfileState = {
  nickname: 'Username',
  avatarUrl: 'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=User',
  level: 0,
  country: 'Country',
  memberSince: 'N/A',
  bio: 'This user has not set up a bio yet.',
  recentActivity: [],
  favoriteGame: null,
  badges: [],
  friendsCount: 0,
  bannerImageUrl: 'https://via.placeholder.com/1200x250/101010/333333?Text=Profile+Banner',
};


const Profile = () => { 

  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProfileQuery(); 

  const payload = data?.payload;
  const profileData = {
    ...initialProfileState,
    ...payload,
    bannerImageUrl: payload?.bannerImageUrl || payload?.favoriteGame?.imageUrl || initialProfileState.bannerImageUrl,
    recentActivity: payload?.recentActivity || [],
    badges: payload?.badges || [],
    friendsCount: payload?.friendsCount ?? 0,
  };

  const {
    nickname,
    avatarUrl,
    level,
    countryName,
    bio,
    recentActivity,
    favoriteGame,
    badges,
    friendsCount,
    bannerImageUrl
  } = profileData; 

  const handleEditProfileClick = () => {
    navigate('/profile/edit');
  };



  return (
    <div className="profile-page-container">
      {error && (
        <Notification
          message={error?.data?.message || 'Failed to load profile.'}
          type="error"
          onClose={() => {}}
        />
      )}

      {isLoading && <div className="profile-loading-overlay visible">Loading data...</div>}

      <div className="profile-header-banner" style={{ backgroundImage: `url(${bannerImageUrl})` }}>
      </div>
      <div className="profile-main-content">
        <div className="profile-sidebar">
          <img src={avatarUrl} alt={`${nickname}'s avatar`} className="profile-avatar" />
          <h1 className="profile-username">{nickname}</h1>
          <p className="profile-level">Level <span className="level-badge">{level}</span></p>
          <p className="profile-country">{countryName}</p>
          <p className="profile-member-since">
            Member since: {new Date(profileData.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          
          <button className="profile-edit-button" onClick={handleEditProfileClick}> {/* onClick */}
            <Edit3 size={18} /> Edit Profile
          </button>
          
          <div className="profile-navigation">
            <a href="#activity" className="profile-nav-link"><BarChart3 size={18} /> Activity</a>
            <a href="#badges" className="profile-nav-link"><Shield size={18} /> Badges</a>
            <a href="#friends" className="profile-nav-link"><Users size={18} /> Friends ({friendsCount})</a>
            <a href="#inventory" className="profile-nav-link"><Gift size={18} /> Inventory</a>
          </div>
        </div>

        <div className="profile-details-column">
          <div className="profile-section profile-bio">
            <h3><User size={22} /> About Me</h3>
            <p>{bio}</p>
          </div>

          {favoriteGame && favoriteGame.title && favoriteGame.imageUrl ? (
            <div className="profile-section profile-favorite-game">
              <h3>Favorite Game</h3>
              <div className="favorite-game-card">
                <img src={favoriteGame.imageUrl} alt={favoriteGame.title} className="favorite-game-image" />
                <h4>{favoriteGame.title}</h4>
              </div>
            </div>
          ) : (
            <div className="profile-section profile-favorite-game">
              <h3>Favorite Game</h3>
              <p>No favorite game selected.</p>
            </div>
          )}

          <div className="profile-section profile-recent-activity" id="activity">
            <h3><BarChart3 size={22} /> Recent Activity</h3>
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
              <p>No recent activity to display.</p>
            )}
          </div>

          <div className="profile-section profile-badges" id="badges">
            <h3><Shield size={22} /> Badges ({(badges && badges.length) || 0})</h3>
            {badges && badges.length > 0 ? (
              <div className="badges-grid">
                {badges.map((badge, index) => (
                  <div key={badge.id || index} className="badge-item" data-title={badge.name}>
                    <img src={badge.iconUrl || 'https://via.placeholder.com/60/CCCCCC/000000?Text=B'} alt={badge.name || 'Badge'} />
                  </div>
                ))}
              </div>
            ) : (
              <p>No badges to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;