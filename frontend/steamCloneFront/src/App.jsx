import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import BasicRoutes from "./routes/BasicRoutes";
import { Footer } from "./components/Footer/Footer";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./store/reduserSlises/userSlice";
import { jwtDecode } from "jwt-decode";
import { useGetProfileQuery, userApi } from "./services/user/userApi";

function App() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  // Викликаємо запит профілю одразу
  const { data, isLoading } = useGetProfileQuery();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        jwtDecode(accessToken); // просто перевірка валідності токена
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  // Оновлюємо user коли приходить data з бекенду
  useEffect(() => {
    if (data && data.payload) {
      dispatch(setUser(data.payload));
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearUser());
    dispatch(userApi.util.resetApiState());
  };

  if (isLoadingAuth || isLoading) {
    return <div className="app-loading-initial">Initializing Fluxi...</div>;
  }

  return (
    <BrowserRouter>
      <BasicRoutes isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
