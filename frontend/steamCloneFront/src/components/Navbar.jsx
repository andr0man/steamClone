import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { useSelector } from "react-redux";

const ChevronDown = ({ size = 16, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const UserIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" />
  </svg>
);
const LogOutIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H8" />
  </svg>
);

const Navbar = ({ onLogout }) => {
  const { user } = useSelector((state) => state.user);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const itemRefs = useRef({});
  const linksRef = useRef(null);
  const location = useLocation();

  const navItems = [
    {
      id: "store",
      label: "STORE",
      path: "/store",
      subItems: [
        { id: "store-discover", label: "DISCOVER", path: "/store/discover" },
        { id: "store-wishlist", label: "WISHLIST", path: "/store/wishlist" },
        {
          id: "store-points-shop",
          label: "POINTS SHOP",
          path: "/store/points-shop",
        },
      ],
    },
    {
      id: "library",
      label: "LIBRARY",
      path: "/library",
      subItems: [
        { id: "library-home", label: "HOME", path: "/library" },
        {
          id: "library-collections",
          label: "COLLECTIONS",
          path: "/library/collections",
        },
      ],
    },
    {
      id: "community",
      label: "COMMUNITY",
      path: "/community",
      subItems: [{ id: "community-market", label: "MARKET", path: "/market" }],
    },
    {
      id: "admin",
      label: "ADMIN",
      path: "/admin/dashboard",
      subItems: [
        {
          id: "manage-games",
          label: "MANAGE GAMES",
          path: "/admin/games",
        },
        {
          id: "manage-genres",
          label: "MANAGE GENRES",
          path: "/admin/genres",
        },
        {
          id: "manage-devpubs",
          label: "MANAGE DEV/PUB",
          path: "/admin/developers-and-publishers",
        },
      ],
    },
    {
      id: "manager",
      label: "MANAGER",
      // path: "/manager/dashboard",
      subItems: [
        {
          id: "my-games",
          label: "MY GAMES",
          path: "/manager/my-games",
        },
        {
          id: "my-devpubs",
          label: "MY DEV/PUBS",
          path: "/manager/my-developers-and-publishers",
        },
      ],
    },
  ];

  const userNavItems = [
    {
      id: "profile-view",
      label: "View My Profile",
      path: "/profile",
      icon: <UserIcon size={18} />,
    },
  ];

  const updateBubblePosition = useCallback(() => {
    const currentBase = "/" + location.pathname.split("/")[1];

    const activeItem = navItems.find(
      (i) =>
        currentBase.startsWith(`/${i.id}`) ||
        (i.id === "manager" && currentBase === "/manager") ||
        currentBase.startsWith(i.path.split("/")[1]) ||
        currentBase === i.path ||
        (i.id === "admin" && currentBase === "/admin")
    );
    if (activeItem && itemRefs.current[activeItem.id] && linksRef.current) {
      const el = itemRefs.current[activeItem.id];
      const laneRect = linksRef.current.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      setBubbleStyle({
        width: `${itemRect.width}px`,
        left: `${itemRect.left - laneRect.left}px`,
        opacity: 1,
      });
    } else {
      setBubbleStyle({ opacity: 0 });
    }
  }, [location.pathname]);

  useEffect(() => {
    const t = setTimeout(updateBubblePosition, 50);
    window.addEventListener("resize", updateBubblePosition);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateBubblePosition);
    };
  }, [updateBubblePosition]);

  const toggleDropdown = (id) =>
    setActiveDropdown((prev) => (prev === id ? null : id));

  const handleLogoutClick = () => {
    onLogout();
    setActiveDropdown(null);
    navigate("/login");
  };

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  return (
    <nav className="fluxi-navbar" ref={navbarRef}>
      <div className="fluxi-bar">
        <div className="fluxi-left">
          <a href="/" className="fluxi-logo" aria-label="Logo" />
          <div className="fluxi-links" ref={linksRef}>
            <div className="fluxi-bubble" style={bubbleStyle} />
            {navItems
              .filter(
                (item) =>
                  (item.id !== "admin" ||
                    (user && user.roleName.includes("admin"))) &&
                  (item.id !== "manager" ||
                    (user && user.roleName.includes("manager")))
              )
              .map((item) => {
                const basePath = "/" + location.pathname.split("/")[1];
                const isActive =
                  basePath === item.path ||
                  basePath.startsWith(item.path) ||
                  (item.id === "admin" && basePath === "/admin");
                return (
                  <div
                    key={item.id}
                    className="fluxi-item-wrap"
                    onMouseEnter={() =>
                      item.subItems && setActiveDropdown(item.id)
                    }
                    onMouseLeave={() =>
                      item.subItems && setActiveDropdown(null)
                    }
                  >
                    <NavLink
                      ref={(el) => (itemRefs.current[item.id] = el)}
                      to={item.path}
                      className={`fluxi-item${isActive ? " active" : ""}`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.label}
                      {item.subItems && (
                        <ChevronDown size={16} className="item-arrow" />
                      )}
                    </NavLink>

                    {item.subItems && activeDropdown === item.id && (
                      <div
                        className={`fluxi-dropdown ${
                          item.id === "store" ? "store-dropdown" : ""
                        }`}
                      >
                        {item.subItems.map((sub) => (
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
                );
              })}
          </div>
        </div>

        <div className="fluxi-right">
          <span className="user-name-plain">{user.nickname}</span>

          <div className="user-menu">
            <button
              className={`avatar-button ${
                activeDropdown === "user-menu" ? "active" : ""
              }`}
              onClick={() => toggleDropdown("user-menu")}
              aria-haspopup="menu"
              aria-expanded={activeDropdown === "user-menu"}
              aria-controls="user-menu-dropdown"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.nickname}'s avatar`}
                  className="user-avatar"
                />
              ) : (
                <UserIcon size={18} />
              )}
            </button>

            {activeDropdown === "user-menu" && (
              <div
                id="user-menu-dropdown"
                role="menu"
                className="fluxi-dropdown user-dropdown"
              >
                {userNavItems.map((u) => (
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
                <button
                  onClick={handleLogoutClick}
                  className="fluxi-dropdown-item logout-item"
                  role="menuitem"
                >
                  <span className="dropdown-item-icon">
                    <LogOutIcon size={18} />
                  </span>
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
