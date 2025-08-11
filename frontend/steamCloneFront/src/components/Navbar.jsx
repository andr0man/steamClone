import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { ChevronDown, LogOut, UserCircle } from 'lucide-react';

const Navbar = ({ onLogout, username = 'User123' }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const itemRefs = useRef({});
  const linksRef = useRef(null);
  const location = useLocation();

  const navItems = [
    {
      id: 'store',
      label: 'STORE',
      path: '/store',
      subItems: [
        { id: 'store-featured', label: 'FEATURED', path: '/store/featured' },
        { id: 'store-discover', label: 'DISCOVER', path: '/store/discover' },
        { id: 'store-wishlist', label: 'WISHLIST', path: '/store/wishlist' },
        { id: 'store-points-shop', label: 'POINTS SHOP', path: '/store/points-shop' },
        { id: 'store-news', label: 'NEWS', path: '/store/news' },
        { id: 'store-stats', label: 'STATS', path: '/store/stats' },
      ]
    },
    {
      id: 'library',
      label: 'LIBRARY',
      path: '/library',
      subItems: [
        { id: 'library-home', label: 'HOME', path: '/library' },
        { id: 'library-collections', label: 'COLLECTIONS', path: '/library/collections' },
      ]
    },
    {
      id: 'community',
      label: 'COMMUNITY',
      path: '/community',
      subItems: [
        { id: 'community-home', label: 'HOME', path: '/community' },
        { id: 'community-discussions', label: 'DISCUSSIONS', path: '/community/discussions' },
        { id: 'community-workshop', label: 'WORKSHOP', path: '/community/workshop' },
        { id: 'community-market', label: 'MARKET', path: '/market' },
        { id: 'community-broadcasts', label: 'BROADCASTS', path: '/community/broadcasts' },
      ]
    }
  ];

  const userNavItems = [
    { id: 'profile-view', label: 'View My Profile', path: '/profile', icon: <UserCircle size={18} /> }
  ];

  const updateBubblePosition = useCallback(() => {
    const currentBase = '/' + location.pathname.split('/')[1];
    const activeItem = navItems.find(i => i.path === currentBase);
    if (activeItem && itemRefs.current[activeItem.id] && linksRef.current) {
      const el = itemRefs.current[activeItem.id];
      const laneRect = linksRef.current.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      setBubbleStyle({
        width: `${itemRect.width}px`,
        left: `${itemRect.left - laneRect.left}px`,
        opacity: 1
      });
    } else {
      setBubbleStyle({ opacity: 0 });
    }
  }, [location.pathname]);

  useEffect(() => {
    const t = setTimeout(updateBubblePosition, 50);
    window.addEventListener('resize', updateBubblePosition);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateBubblePosition);
    };
  }, [updateBubblePosition]);

  const toggleDropdown = id => setActiveDropdown(prev => (prev === id ? null : id));

  const handleLogoutClick = () => {
    onLogout?.();
    setActiveDropdown(null);
    navigate('/login');
  };

  useEffect(() => {
    const closeOnOutside = e => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) setActiveDropdown(null);
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, []);

  return (
    <nav className="fluxi-navbar" ref={navbarRef}>
      <div className="fluxi-bar">
        <div className="fluxi-left">
          <a href="/" className="fluxi-logo" aria-label="Logo" />
          <div className="fluxi-links" ref={linksRef}>
            <div className="fluxi-bubble" style={bubbleStyle} />
            {navItems.map(item => (
              <div
                key={item.id}
                className="fluxi-item-wrap"
                onMouseEnter={() => item.subItems && setActiveDropdown(item.id)}
                onMouseLeave={() => item.subItems && setActiveDropdown(null)}
              >
                <NavLink
                  ref={el => (itemRefs.current[item.id] = el)}
                  to={item.path}
                  className={() => {
                    const active = location.pathname.startsWith(item.path);
                    return `fluxi-item ${active ? 'active' : ''}`;
                  }}
                  onClick={() => setActiveDropdown(null)}
                >
                  {item.label}
                  {item.subItems && <ChevronDown size={16} className="item-arrow" />}
                </NavLink>

                {item.subItems && activeDropdown === item.id && (
                  <div className={`fluxi-dropdown ${item.id === 'store' ? 'store-dropdown' : ''}`}>
                    {item.subItems.map(sub => (
                      <NavLink
                        key={sub.id}
                        to={sub.path}
                        className="fluxi-dropdown-item"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="fluxi-right">
          <span className="user-name-plain">{username}</span>

          <div className="user-menu">
            <button
              className={`avatar-button ${activeDropdown === 'user-menu' ? 'active' : ''}`}
              onClick={() => toggleDropdown('user-menu')}
              aria-haspopup="menu"
              aria-expanded={activeDropdown === 'user-menu'}
              aria-controls="user-menu-dropdown"
            >
              <UserCircle size={18} />
            </button>

            {activeDropdown === 'user-menu' && (
              <div id="user-menu-dropdown" role="menu" className="fluxi-dropdown user-dropdown">
                {userNavItems.map(u => (
                  <NavLink
                    key={u.id}
                    to={u.path}
                    className="fluxi-dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                    role="menuitem"
                  >
                    <span className="dropdown-item-icon">{u.icon}</span>
                    <span>{u.label}</span>
                  </NavLink>
                ))}
                <div className="dropdown-sep" />
                <button onClick={handleLogoutClick} className="fluxi-dropdown-item logout-item" role="menuitem">
                  <span className="dropdown-item-icon"><LogOut size={18} /></span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="fluxi-underline">
          <span className="rgb-line" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;