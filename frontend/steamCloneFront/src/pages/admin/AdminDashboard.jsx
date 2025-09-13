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
          <p>Add new games to the store.</p>
          <Link to="/admin/games" className="admin-btn">Go to Manage Games</Link>
        </div>
        <div className="admin-card flux-border">
          <h3>Manage All</h3>
          <p>One page to manage everything from Swagger.</p>
          <Link to="/admin/all" className="admin-btn">Open All</Link>
          </div>
        <div className="admin-card flux-border">
          <h3>Manage Genres</h3>
          <p>Add or manage game genres.</p>
          <Link to="/admin/genres" className="admin-btn">Go to Manage Genres</Link>
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
