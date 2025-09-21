import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Shield, Users, Gift, Wallet } from 'lucide-react';
import Notification from '../../../components/Notification';
import { useSelector } from "react-redux";
import { useGetProfileQuery, useGetBalanceQuery } from '../../../services/profile/profileApi';
import { useGetFriendsCountQuery } from '../../../services/friends/friendsApi';
import { formatDateForInput } from '../../admin/common/formatDateForInput';
import '../profile.scss';

const linkCls = ({ isActive }) => `profile-nav-link ${isActive ? 'active' : ''}`;
const fmtUAH = (n) => `${Number(n || 0).toLocaleString('uk-UA', { maximumFractionDigits: 0 })}₴`;

const ProfileLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { data: profileRes, isLoading: loadingProfile, error: profileErr } = useGetProfileQuery(user?.id, {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
    });
  const { data: balRes, isLoading: loadingBal, error: balErr } = useGetBalanceQuery();
  const { data: friendsCountData } = useGetFriendsCountQuery();

  const apiError = profileErr?.data?.message || balErr?.data?.message || null;
  const loading = loadingProfile || loadingBal;

  const pd = useMemo(() => {
    const p = profileRes?.payload ?? profileRes ?? {};
    const username = p.username || p.userName || p.nickName || p.nickname || '—';
    const country = p.country?.name || p.countryName || p.country || '—';
    const msRaw = p.memberSince || p.createdAt || p.registeredAt || null;
    const memberSince = msRaw ? formatDateForInput(msRaw) : '—';  
    return {
      username,
      avatarUrl: p.avatarUrl || null,
      level: p.level ?? 0,
      country,
      memberSince,
      friendsCount: friendsCountData?.payload ?? (p.friendsCount ?? 0),
    };
  }, [profileRes, friendsCountData]);

  const balance =
    typeof balRes?.payload === 'number'
      ? balRes.payload
      : balRes?.payload?.balance ??
        balRes?.payload?.amount ??
        balRes?.balance ??
        balRes?.amount ??
        0;

  return (
    <div id="page-top" className="profile-page-wrapper">
      <div className="notification-global-top">
        {apiError && <Notification message={apiError} type="error" onClose={() => {}} />}
      </div>

      {loading && <div className="profile-loading-overlay visible">Loading data...</div>}

      <div className="profile-page-container">
        <div className="profile-main-content">
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              <img
                src={pd.avatarUrl || "/common/icon_profile.svg"}
                alt={`${pd.username}'s avatar`}
                style={{ padding: pd.avatarUrl ? 0 : 40 }}
              />
            </div>
            <h1 className="profile-username">{pd.username}</h1>
            <p className="profile-level">
              Level <span className="level-badge">{pd.level}</span>
            </p>
            <p className="profile-country">{pd.country}</p>
            <p className="profile-member-since">Member since: {pd.memberSince}</p>

            <div className="profile-balance-chip" title="Wallet balance" style={{ marginTop: 8 }}>
              <Wallet size={16} style={{ marginRight: 6 }} />
              <span>{fmtUAH(balance)}</span>
            </div>

            <button className="profile-edit-button" onClick={() => navigate('/profile/edit')} />

            <nav className="profile-navigation">
              <NavLink to="/profile/activity" className={linkCls}>
                <BarChart3 size={18} /> Activity
              </NavLink>
              <NavLink to="/profile/badges" className={linkCls}>
                <Shield size={18} /> Badges
              </NavLink>
              <NavLink to="/profile/friends" className={linkCls}>
                <Users size={18} /> Friends ({pd.friendsCount})
              </NavLink>
              <NavLink to="/profile/inventory" className={linkCls}>
                <Gift size={18} /> Inventory
              </NavLink>
            </nav>
          </aside>

          <section className="profile-details-column">{children}</section>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
