import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.scss'; 
import { ChevronDown, LogOut, UserCircle } from 'lucide-react'; 

const Navbar = ({ onLogout, username = "User" }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const navbarRef = useRef(null);

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

  const toggleDropdown = (itemId) => {
    if (activeDropdown === itemId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(itemId);
    }
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
      <div className="fluxi-navbar-left">
        {navItems.map(item => (
          <div
            key={item.id}
            className="fluxi-navbar-item-container"
            onMouseEnter={() => item.subItems && setActiveDropdown(item.id)} 
            onMouseLeave={() => item.subItems && setActiveDropdown(null)}   
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `fluxi-navbar-item ${isActive || (item.id === 'store' && location.pathname.startsWith('/store')) || (item.id === 'library' && location.pathname.startsWith('/library')) || (item.id === 'community' && location.pathname.startsWith('/community')) ? 'active' : ''}`
              }
              end={item.path === "/store" || item.path === "/library" || item.path === "/community"} 
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
            {username}
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
                  {userItem.label}
                </NavLink>
              ))}
              <div className="fluxi-navbar-dropdown-separator"></div>
              <button
                onClick={handleLogoutClick}
                className="fluxi-navbar-dropdown-item logout-item"
              >
                <LogOut size={18} className="dropdown-item-icon"/>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;