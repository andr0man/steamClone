import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Shield, Users, Gift } from 'lucide-react';
import '../profile.scss';

const MOCK_PROFILE = {
  username: 'Username',
  avatarUrl: 'https://via.placeholder.com/180/CCCCCC/FFFFFF?Text=User',
  level: 7,
  country: 'Ukraine',
  memberSince: '2023-04-19',
};

const linkCls = ({ isActive }) => `profile-nav-link ${isActive ? 'active' : ''}`;

const ProfileLayout = ({ children, profileData = MOCK_PROFILE }) => {
  const navigate = useNavigate();
  const pd = useMemo(() => ({ ...MOCK_PROFILE, ...profileData }), [profileData]);

  return (
    <div id="page-top" className="profile-page-wrapper">
      <div className="profile-page-container">
        <div className="profile-main-content">
          <aside className="profile-sidebar">
            <img src={pd.avatarUrl} alt={`${pd.username}'s avatar`} className="profile-avatar" />
            <h1 className="profile-username">{pd.username}</h1>
            <p className="profile-level">Level <span className="level-badge">{pd.level}</span></p>
            <p className="profile-country">{pd.country}</p>
            <p className="profile-member-since">Member since: {pd.memberSince}</p>

            <button className="profile-edit-button" onClick={() => navigate('/profile/edit')} />

            <nav className="profile-navigation">
              <NavLink to="/profile/activity" className={linkCls}><BarChart3 size={18} /> Activity</NavLink>
              <NavLink to="/profile/badges" className={linkCls}><Shield size={18} /> Badges</NavLink>
              <NavLink to="/profile/friends" className={linkCls}><Users size={18} /> Friends</NavLink>
              <NavLink to="/profile/inventory" className={linkCls}><Gift size={18} /> Inventory</NavLink>
            </nav>
          </aside>

          <section className="profile-details-column">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;