import React, { useEffect, useMemo, useState } from 'react';
import ProfileLayout from '../components/ProfileLayout';
import './friends.scss';
import { Users, Search as SearchIcon, MessageSquareText, UserMinus, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LS_KEY = 'mock:friends';

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Dima', avatarUrl: 'https://i.pravatar.cc/80?img=12', status: 'online', level: 21, game: null, lastOnline: null },
  { id: 'f2', name: 'Ira', avatarUrl: 'https://i.pravatar.cc/80?img=32', status: 'offline', level: 5, game: null, lastOnline: '2025-09-02T18:20:00Z' },
  { id: 'f3', name: 'Max', avatarUrl: 'https://i.pravatar.cc/80?img=3', status: 'in_game', game: 'Counter Strike 2', level: 14, lastOnline: null },
  { id: 'f4', name: 'Oleh', avatarUrl: 'https://i.pravatar.cc/80?img=5', status: 'offline', level: 9, game: null, lastOnline: '2025-08-28T09:50:00Z' },
  { id: 'f5', name: 'Lesya', avatarUrl: 'https://i.pravatar.cc/80?img=45', status: 'online', level: 33, game: null, lastOnline: null },
];

const Friends = () => {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    let ls = null;
    try { ls = JSON.parse(localStorage.getItem(LS_KEY)); } catch {}
    if (!ls || !Array.isArray(ls) || !ls.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_FRIENDS));
      setList(MOCK_FRIENDS);
    } else setList(ls);
  }, []);

  const filtered = useMemo(() => {
    let f = list.slice();
    const s = q.trim().toLowerCase();
    if (s) f = f.filter(u => u.name.toLowerCase().includes(s));
    if (tab !== 'all') f = f.filter(u => u.status === tab);
    return f;
  }, [list, q, tab]);

  const removeFriend = (id) => {
    const next = list.filter(u => u.id !== id);
    setList(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const blockFriend = (id) => {
    const next = list.map(u => u.id === id ? { ...u, status: 'blocked' } : u);
    setList(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const message = (id) => navigate('/chat', { state: { to: id } });

  return (
    <ProfileLayout>
      <div className="friends-container profile-section">
        <div className="friends-head">
          <div className="left">
            <h3><Users size={18} /> Friends</h3>
            <div className="tabs">
              <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
              <button className={`tab ${tab === 'online' ? 'active' : ''}`} onClick={() => setTab('online')}>Online</button>
              <button className={`tab ${tab === 'in_game' ? 'active' : ''}`} onClick={() => setTab('in_game')}>In-game</button>
              <button className={`tab ${tab === 'offline' ? 'active' : ''}`} onClick={() => setTab('offline')}>Offline</button>
            </div>
          </div>
          <div className="right">
            <div className="friends-input">
              <input placeholder="Search friends" value={q} onChange={(e) => setQ(e.target.value)} />
              <SearchIcon size={16} className="ico" />
            </div>
          </div>
        </div>

        <div className="friends-list">
          {filtered.length ? filtered.map(u => (
            <div key={u.id} className={`friend-card ${u.status}`}>
              <div className="left">
                <img src={u.avatarUrl} alt={u.name} />
                <div className="meta">
                  <div className="name">{u.name}</div>
                  <div className="sub">
                    <span className={`st ${u.status}`}>{u.status.replace('_', ' ')}</span>
                    {u.game && <><span className="dot">•</span><span className="game">{u.game}</span></>}
                    {u.lastOnline && <><span className="dot">•</span><span className="last">last: {new Date(u.lastOnline).toLocaleString()}</span></>}
                  </div>
                </div>
              </div>
              <div className="right">
                <button className="ghost" onClick={() => message(u.id)}><MessageSquareText size={16} /> Message</button>
                <button className="ghost" onClick={() => removeFriend(u.id)}><UserMinus size={16} /> Remove</button>
                <button className="ghost" onClick={() => blockFriend(u.id)}><Ban size={16} /> Block</button>
              </div>
            </div>
          )) : <div className="empty">No friends</div>}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Friends;