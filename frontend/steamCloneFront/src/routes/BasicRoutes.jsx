import { Navigate, Route, Link as RouterLink, Routes } from "react-router-dom";

import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import AdminAll from '../pages/admin/all/AdminAll';
import ForgotPassword from "../pages/auth/login/ForgotPassword.jsx";
import Login from "../pages/auth/login/Login.jsx";
import Register from "../pages/auth/register/Register.jsx";
import Chat from "../pages/chat/Chat.jsx";
import { GamePage } from "../pages/game/GamePage.jsx";
import Home from "../pages/home/home.jsx";
import Search from "../pages/home/search/Search.jsx";
import Collections from "../pages/library/collections/Collections.jsx";
import GameInfo from "../pages/library/gameinfo/GameInfo.jsx";
import Library from "../pages/library/library.jsx";
import Buy from '../pages/market/buy/Buy.jsx';
import MarketHistory from "../pages/market/history/MarketHistory.jsx";
import Market from "../pages/market/market.jsx";
import Sell from '../pages/market/sell/Sell.jsx';
import Activity from '../pages/profile/activity/Activity.jsx';
import Badges from '../pages/profile/badges/Badges.jsx';
import EditProfile from "../pages/profile/editprofile/EditProfile.jsx";
import Friends from '../pages/profile/friends/Friends.jsx';
import Inventory from '../pages/profile/inventory/Inventory.jsx';
import Profile from "../pages/profile/profile.jsx";
import Discover from "../pages/store/discover/Discover.jsx";
import Featured from "../pages/store/featured/Featured.jsx";
import News from "../pages/store/news/News.jsx";
import PointsShop from "../pages/store/points-shop/PointsShop.jsx";
import Purchase from "../pages/store/purchase/Purchase.jsx";
import Stats from "../pages/store/stats/Stats.jsx";
import Wishlist from "../pages/store/wishlist/Wishlist.jsx";
import adminRoutes from "./AdminRoutes.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const UnderConstructionPage = ({ pageName }) => (
  <div style={{ padding: "50px", textAlign: "center", color: "#fff" }}>
    <h1>{pageName || "Page"} is Under Construction</h1>
    <p>We are working hard to bring this feature to you!</p>
    <RouterLink
      to="/store"
      style={{ color: "#66c0f4", textDecoration: "underline" }}
    >
      Go to Store
    </RouterLink>
  </div>
);

const BasicRoutes = ({ isLoggedIn, handleLogout }) => {
  const currentUser = useSelector((state) => state.user.user);
  return (
    <div className="app-container">
      {isLoggedIn && <Navbar onLogout={handleLogout} />}

      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/store/game/:gameId"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <GamePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/featured"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Featured />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/discover"
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/stats"
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/points-shop"
              element={
                <ProtectedRoute>
                  <PointsShop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/news"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/:subpage"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/purchase"
              element={
                <ProtectedRoute>
                  <Purchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library/collections"
              element={
                <ProtectedRoute>
                  <Collections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library/game/:gameId"
              element={
                <ProtectedRoute>
                  <GameInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library/:subpage"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />

            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <Market />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market/history"
              element={
                <ProtectedRoute>
                  <MarketHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile userData={currentUser} />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile currentProfileData={currentUser} />
                </ProtectedRoute>
              }
            />
              <Route path="/profile/activity" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Activity /></ProtectedRoute>} />
              <Route path="/profile/badges" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Badges /></ProtectedRoute>} />
              <Route path="/profile/friends" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Friends /></ProtectedRoute>} />
              <Route path="/profile/inventory" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Inventory /></ProtectedRoute>} />
              <Route path="/market/buy" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Buy /></ProtectedRoute>} />
              <Route path="/market/sell" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Sell /></ProtectedRoute>} />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <UnderConstructionPage pageName="Community" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community/:subpage"
              element={
                <ProtectedRoute>
                  <UnderConstructionPage pageName="Community Section" />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/all" element={<AdminAll />} />

            {adminRoutes}

            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/store" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="*"
              element={
                <div
                  style={{
                    padding: "50px",
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <RouterLink
                    to={isLoggedIn ? "/store" : "/login"}
                    style={{ color: "#66c0f4", textDecoration: "underline" }}
                  >
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