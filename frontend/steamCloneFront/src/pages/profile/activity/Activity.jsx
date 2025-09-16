import React, { useEffect, useMemo, useState } from 'react';
import ProfileLayout from '../components/ProfileLayout';
import './activity.scss';
import { BarChart3, Gift, ShoppingCart, Star, Swords, ListChecks } from 'lucide-react';

const LS_KEY = 'mock:inventory-activity';

const MOCK_ACTIVITY = [
  { id: 'a1', time: '2025-09-03T18:00:00Z', type: 'listed_item', text: 'Listed "Glove Case" on Market', meta: { price: 725.32 } },
  { id: 'a2', time: '2025-09-02T20:20:00Z', type: 'gift_sent', text: 'Gifted "Dragon Tower Ward" to Dima', meta: {} },
  { id: 'a3', time: '2025-09-01T09:12:00Z', type: 'achievement', text: 'Unlocked badge: CS2: Case Opener', meta: {} },
  { id: 'a4', time: '2025-08-28T12:40:00Z', type: 'playtime', text: 'Played Rust for 2h 15m', meta: {} },
];

const ICONS = {
  listed_item: <ShoppingCart size={16} />,
  gift_sent: <Gift size={16} />,
  achievement: <Star size={16} />,
  playtime: <Swords size={16} />,
  listing_cancel: <ListChecks size={16} />,
};

const Activity = () => {
  const [list, setList] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    let ls = null;
    try { ls = JSON.parse(localStorage.getItem(LS_KEY)); } catch {}
    const base = (ls && Array.isArray(ls)) ? ls : [];
    const withMock = [...base, ...MOCK_ACTIVITY].sort((a,b) => new Date(b.time)-new Date(a.time));
    setList(withMock);
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return list;
    return list.filter(a => a.type === tab);
  }, [list, tab]);

  return (
    <ProfileLayout>
      <div className="activity-container profile-section">
        <div className="activity-head">
          <h3><BarChart3 size={18} /> Recent Activity</h3>
          <div className="tabs">
            <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
            <button className={`tab ${tab === 'listed_item' ? 'active' : ''}`} onClick={() => setTab('listed_item')}>Market</button>
            <button className={`tab ${tab === 'gift_sent' ? 'active' : ''}`} onClick={() => setTab('gift_sent')}>Gifts</button>
            <button className={`tab ${tab === 'achievement' ? 'active' : ''}`} onClick={() => setTab('achievement')}>Achievements</button>
            <button className={`tab ${tab === 'playtime' ? 'active' : ''}`} onClick={() => setTab('playtime')}>Playtime</button>
          </div>
        </div>

        <div className="feed">
          {filtered.length ? filtered.map(a => (
            <div key={a.id} className="event">
              <div className="ico">{ICONS[a.type] || <BarChart3 size={16} />}</div>
              <div className="body">
                <div className="text">{a.text}</div>
                <div className="meta">{new Date(a.time).toLocaleString()}</div>
              </div>
            </div>
          )) : <div className="empty">No activity yet</div>}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Activity;