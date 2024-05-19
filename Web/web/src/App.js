import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ParkYeriBelirle from "./pages/ParkYeriBelirle";
import Otoparkım from "./pages/Otoparkım";
import Nav from "./components/Nav";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer kullanıcı login değilse, login sayfasına yönlendirin
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/home");
  };



  return (
    <div className="h-screen w-full">
      {isLoggedIn && <Nav />}
      <Routes>
        <Route
          path="/"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/signup" element={<SignUp />} />
        {isLoggedIn && (
          <>
            <Route path="/parkyeribelirle" element={<ParkYeriBelirle />} />
            <Route path="/otoparkım" element={<Otoparkım />} />
            <Route path="/home" element={<HomePage />} />
          </>
        )}
      </Routes>
    </div>
  );
}
