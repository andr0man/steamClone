import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import BasicRoutes from './routes/BasicRoutes';
import { Footer } from './components/Footer/Footer';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem('steamCloneUser');
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem('steamCloneUser');
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(true); //якшо нада без логінки зайти поміняйте на true 
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLoginSuccess = (formData) => {
    const username = formData.nickname || formData.identity || "User";
    const userData = { username };
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('steamCloneUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('steamCloneUser');
  };
  
  if (isLoadingAuth) {
    return <div className="app-loading-initial">Initializing Fluxi...</div>; 
  }

  return (
    <BrowserRouter>
      <BasicRoutes 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;