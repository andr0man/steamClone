import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useGetProfileQuery } from '../services/user/userApi';

const Navbar = ({ onLogout }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const itemRefs = useRef({});
  const leftNavRef = useRef(null);
  const location = useLocation();
  const { data: profileData, isLoading } = useGetProfileQuery();
  

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
    { id: 'profile-view', label: 'View My Profile', path: '/profile', icon: <UserCircle size={18}/> },
  ];

  const updateBubblePosition = useCallback(() => {
    const currentBasePath = '/' + location.pathname.split('/')[1];
    const activeItemConfig = navItems.find(item => item.path === currentBasePath);

    if (activeItemConfig && itemRefs.current[activeItemConfig.id] && leftNavRef.current) {
      const activeItem = itemRefs.current[activeItemConfig.id];
      const navRect = leftNavRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      setBubbleStyle({
        width: `${itemRect.width}px`,
        left: `${itemRect.left - navRect.left}px`,
        opacity: 1,
      });
    } else {
      setBubbleStyle({ opacity: 0 });
    }
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(updateBubblePosition, 50);
    window.addEventListener('resize', updateBubblePosition);
    return () => window.removeEventListener('resize', updateBubblePosition);
  }, [updateBubblePosition]);

  const toggleDropdown = (itemId) => {
    setActiveDropdown(prev => (prev === itemId ? null : itemId));
  };

  const handleLogoutClick = () => {
    onLogout();
    setActiveDropdown(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarRef]);

  return (
    <nav className="fluxi-navbar" ref={navbarRef}>
      <div className="fluxi-navbar-left" ref={leftNavRef}>
        <div className="fluxi-navbar-bubble" style={bubbleStyle} />
        {navItems.map(item => (
          <div
            key={item.id}
            className="fluxi-navbar-item-container"
            onMouseEnter={() => item.subItems && setActiveDropdown(item.id)}
            onMouseLeave={() => item.subItems && setActiveDropdown(null)}
          >
            <NavLink
              ref={el => (itemRefs.current[item.id] = el)}
              to={item.path}
              className={() => {
                const isBasePathActive = location.pathname.startsWith(item.path);
                return `fluxi-navbar-item ${isBasePathActive ? 'active' : ''}`;
              }}
              onClick={() => setActiveDropdown(null)}
            >
              {item.label}
              {item.subItems && <ChevronDown size={16} className="fluxi-navbar-item-arrow" />}
            </NavLink>
            {item.subItems && activeDropdown === item.id && (
              <div className={`fluxi-navbar-dropdown ${item.id === 'store' ? 'store-dropdown' : ''}`}>
                {item.subItems.map(subItem => (
                  <NavLink
                    key={subItem.id}
                    to={subItem.path}
                    className="fluxi-navbar-dropdown-item"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fluxi-navbar-right">
        <div
          className="fluxi-navbar-item-container user-menu-container"
          onMouseEnter={() => setActiveDropdown('user-menu')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className={`fluxi-navbar-user-button ${activeDropdown === 'user-menu' ? 'active' : ''}`}
            onClick={() => toggleDropdown('user-menu')}
          >
            <span>{isLoading ? '...' : profileData?.payload?.nickname || "User"}</span>
            <ChevronDown size={16} className="fluxi-navbar-item-arrow" />
          </button>
          {activeDropdown === 'user-menu' && (
            <div className="fluxi-navbar-dropdown user-dropdown">
              {userNavItems.map(userItem => (
                <NavLink
                  key={userItem.id}
                  to={userItem.path}
                  className="fluxi-navbar-dropdown-item"
                  onClick={() => setActiveDropdown(null)}
                >
                  {userItem.icon && <span className="dropdown-item-icon">{userItem.icon}</span>}
                  <span>{userItem.label}</span>
                </NavLink>
              ))}
              <div className="fluxi-navbar-dropdown-separator"></div>
              <button
                onClick={handleLogoutClick}
                className="fluxi-navbar-dropdown-item logout-item"
              >
                <span className="dropdown-item-icon"><LogOut size={18}/></span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;