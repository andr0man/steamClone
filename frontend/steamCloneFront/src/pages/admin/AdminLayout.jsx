import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import './admin-layout.scss';
import { LayoutDashboard, Users, Gamepad2, Gift, Newspaper, ShieldCheck, LogOut, Home } from 'lucide-react';


const AdminLayout = ({ currentUser, handleLogout }) => {
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/store" replace />;
  }

  return (
    <div className="admin-layout-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <ShieldCheck size={32} />
          <h2>Flux Admin</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <p className="nav-category">Analytics</p>
          <NavLink to="/admin/dashboard" className="admin-nav-link">
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </NavLink>
          
          <p className="nav-category">Management</p>
          <NavLink to="/admin/users" className="admin-nav-link">
            <Users size={20} /><span>Users</span>
          </NavLink>
          <NavLink to="/admin/games" className="admin-nav-link">
            <Gamepad2 size={20} /><span>Games</span>
          </NavLink>
          <NavLink to="/admin/items" className="admin-nav-link">
            <Gift size={20} /><span>Shop Items</span>
          </NavLink>
          <NavLink to="/admin/news" className="admin-nav-link">
            <Newspaper size={20} /><span>News</span>
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
           <NavLink to="/store" className="admin-nav-link utility">
            <Home size={20} /><span>Back to Site</span>
          </NavLink>
          <button onClick={handleLogout} className="admin-nav-link utility">
            <LogOut size={20} /><span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;