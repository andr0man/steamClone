import React from 'react';
import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';

import Login from '../pages/auth/login/Login.jsx';
import Register from '../pages/auth/register/Register.jsx';
import Home from '../pages/home/home.jsx';
import Library from '../pages/library/library.jsx';
import Market from '../pages/market/market.jsx';
import Profile from '../pages/profile/Profile.jsx';
import EditProfile from '../pages/profile/editprofile/EditProfile.jsx';
import GameInfo from '../pages/library/gameinfo/GameInfo.jsx';
import Discover from '../pages/store/discover/Discover.jsx';
import Navbar from '../components/Navbar.jsx';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const UnderConstructionPage = ({ pageName }) => (
  <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>
    <h1>{pageName || 'Page'} is Under Construction</h1>
    <p>We are working hard to bring this feature to you!</p>
    <RouterLink to="/store" style={{ color: '#66c0f4', textDecoration: 'underline' }}>Go to Store</RouterLink>
  </div>
);

const BasicRoutes = ({ isLoggedIn, currentUser, handleLoginSuccess, handleLogout }) => {
  return (
    <div className="app-container">
      {isLoggedIn && (
        <Navbar 
          onLogout={handleLogout} 
          username={currentUser?.username || "User"} 
        />
      )}
      
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/store" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/register" 
              element={isLoggedIn ? <Navigate to="/store" replace /> : <Register />} 
            />
            
            {/* <Route 
              path="/store/discover" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Discover /></ProtectedRoute>} 
            /> */}
            <Route 
              path="/store/:subpage" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Home /></ProtectedRoute>} 
            /> 
            <Route 
              path="/store" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Home /></ProtectedRoute>} 
            />
            
            <Route 
              path="/library" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Library /></ProtectedRoute>} 
            />
            <Route 
              path="/library/game/:gameId" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><GameInfo /></ProtectedRoute>} 
            />
            <Route 
              path="/library/:subpage" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Library /></ProtectedRoute>} 
            />

            <Route 
              path="/market" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Market /></ProtectedRoute>} 
            />
            
            <Route 
              path="/profile" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><Profile userData={currentUser} /></ProtectedRoute>}
            >
            </Route>
            <Route 
              path="/profile/edit" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><EditProfile currentProfileData={currentUser} /></ProtectedRoute>} 
            />
            
            <Route 
              path="/community" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><UnderConstructionPage pageName="Community" /></ProtectedRoute>} 
            />
            <Route 
              path="/community/:subpage" 
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><UnderConstructionPage pageName="Community Section" /></ProtectedRoute>} 
            />
            
            <Route 
              path="/" 
              element={isLoggedIn ? <Navigate to="/store" replace /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="*" 
              element={
                <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <RouterLink to={isLoggedIn ? "/store" : "/login"} style={{ color: '#66c0f4', textDecoration: 'underline' }}>
                    Go to {isLoggedIn ? "Store" : "Login"}
                  </RouterLink>
                </div>
              } 
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default BasicRoutes;