import React from "react";
import "./admin-dashboard.scss";
import { useSelector } from "react-redux";

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
        <div className="admin-card">
          <h3>Create Game</h3>
          <p>Add new games to the store.</p>
          <button className="admin-btn">Go to Create Game</button>
        </div>
        <div className="admin-card">
          <h3>Create Genre</h3>
          <p>Add or manage game genres.</p>
          <button className="admin-btn">Go to Genres</button>
        </div>
        <div className="admin-card">
          <h3>Other Management</h3>
          <p>Manage users, news, items, etc.</p>
          <button className="admin-btn">Coming Soon</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
