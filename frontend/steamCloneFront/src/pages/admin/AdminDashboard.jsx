import React from "react";
import "./AdminDashboard.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  if (!currentUser || currentUser.roleName !== "admin") {
    return (
      <div className="admin-dashboard-denied">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-dashboard-cards">
        <div className="admin-card flux-border">
          <h3>Manage Games</h3>
          <Link to="/admin/games" className="admin-btn">Go to Manage Page</Link>
        </div>
        <div className="admin-card flux-border">
          <h3>Manage Genres</h3>
          <Link to="/admin/genres" className="admin-btn">Go to Manage Page</Link>
        </div>
        <div className="admin-card flux-border">
          <h3>Manage Developers and Publishers</h3>
          <Link to="/admin/developers" className="admin-btn">Go to Manage Page</Link>
        </div>
        <div className="admin-card flux-border">
          <h3>Other Management</h3>
          <p>Manage users, news, items, etc.</p>
          <button className="admin-btn">Coming Soon</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
