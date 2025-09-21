import React, { useEffect, useMemo, useState } from 'react';
import ProfileLayout from '../components/ProfileLayout';
import './badges.scss';
import { Shield, Award, Search as SearchIcon } from 'lucide-react';

const LS_KEY = 'mock:badges';

const MOCK_BADGES = [
  { id: 'b1', name: 'Early Supporter', iconUrl: 'https://via.placeholder.com/72/9277c5/FFFFFF?text=ES', game: 'Global', earned: true, progress: 1, xp: 100, earnedAt: '2025-07-02' },
  { id: 'b2', name: 'CS2: Case Opener', iconUrl: 'https://via.placeholder.com/72/4aa3ff/FFFFFF?text=CS2', game: 'Counter Strike 2', earned: true, progress: 1, xp: 50, earnedAt: '2025-08-01' },
  { id: 'b3', name: 'Rust Builder', iconUrl: 'https://via.placeholder.com/72/A178EB/FFFFFF?text=R', game: 'Rust', earned: false, progress: 0.6, xp: 75 },
  { id: 'b4', name: 'Marathon Player', iconUrl: 'https://via.placeholder.com/72/ffb84d/000?text=MP', game: 'Global', earned: false, progress: 0.2, xp: 200 },
  { id: 'b5', name: 'Dota Strategist', iconUrl: 'https://via.placeholder.com/72/5bd7ae/000?text=D2', game: 'Dota 2', earned: true, progress: 1, xp: 80, earnedAt: '2025-05-15' },
  { id: 'b6', name: 'Bongo Cat Fan', iconUrl: 'https://via.placeholder.com/72/ff6d6d/FFFFFF?text=BC', game: 'Bongo Cat', earned: false, progress: 0.85, xp: 60 },
];

const Badges = () => {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all'); // all | earned | progress | locked
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let ls = null;
    try { ls = JSON.parse(localStorage.getItem(LS_KEY)); } catch {}
    if (!ls || !Array.isArray(ls) || !ls.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_BADGES));
      setList(MOCK_BADGES);
    } else setList(ls);
  }, []);

  const filtered = useMemo(() => {
    let f = list.slice();
    const s = q.trim().toLowerCase();
    if (s) f = f.filter(b => b.name.toLowerCase().includes(s) || (b.game || '').toLowerCase().includes(s));
    if (tab === 'earned') f = f.filter(b => b.earned);
    if (tab === 'locked') f = f.filter(b => !b.earned && (b.progress || 0) === 0);
    if (tab === 'progress') f = f.filter(b => !b.earned && (b.progress || 0) > 0);
    if (sortBy === 'newest') f.sort((a, b) => new Date(b.earnedAt || '1970-01-01') - new Date(a.earnedAt || '1970-01-01'));
    if (sortBy === 'xp_desc') f.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    if (sortBy === 'name_asc') f.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return f;
  }, [list, q, tab, sortBy]);

  const stats = useMemo(() => {
    const earned = list.filter(b => b.earned).length;
    const totalXP = list.reduce((acc, b) => acc + (b.earned ? b.xp || 0 : 0), 0);
    return { earned, total: list.length, totalXP };
  }, [list]);

  return (
    <ProfileLayout>
      <div className="badges-container profile-section">
        <div className="badges-head">
          <div className="left">
            <h3><Shield size={18} /> Badges</h3>
            <div className="stats">
              <span>Earned: <b>{stats.earned}</b> / {stats.total}</span>
              <span>XP: <b>{stats.totalXP}</b></span>
            </div>
          </div>
          <div className="right">
            <div className="badges-input">
              <input placeholder="Search badges" value={q} onChange={(e) => setQ(e.target.value)} />
              <SearchIcon size={16} className="ico" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="xp_desc">XP: High to Low</option>
              <option value="name_asc">Name: A - Z</option>
            </select>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}><Award size={14} /> All</button>
          <button className={`tab ${tab === 'earned' ? 'active' : ''}`} onClick={() => setTab('earned')}>Earned</button>
          <button className={`tab ${tab === 'progress' ? 'active' : ''}`} onClick={() => setTab('progress')}>In progress</button>
          <button className={`tab ${tab === 'locked' ? 'active' : ''}`} onClick={() => setTab('locked')}>Locked</button>
        </div>

        <div className="badges-grid">
          {filtered.length ? filtered.map(b => (
            <div key={b.id} className={`badge-card ${b.earned ? 'earned' : ''}`}>
              <img src={b.iconUrl} alt={b.name} />
              <div className="bname">{b.name}</div>
              <div className="game">{b.game}</div>
              <div className="progress">
                <div className="bar"><span style={{ width: `${Math.min(100, Math.round((b.progress || (b.earned ? 1 : 0)) * 100))}%` }} /></div>
                <div className="ptext">{b.earned ? '100%' : `${Math.round((b.progress || 0) * 100)}%`}</div>
              </div>
            </div>
          )) : <div className="empty">No badges</div>}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Badges;