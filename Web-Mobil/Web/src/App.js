import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ParkYeriBelirle from "./pages/ParkYeriBelirle";
import Otoparkım from "./pages/Otoparkım";
import Nav from "./components/Nav";
import { AuthProvider } from "../src/auth/AuthProvider";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Initial state changed to false
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in; if not, redirect to login page
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/home");
  };

  return (
    <AuthProvider>
      {" "}
      {/* Wrap the entire application in AuthProvider */}
      <div className="h-screen w-full">
        {isLoggedIn && <Nav />} {/* Show navigation only when logged in */}
        <Routes>
          <Route
            path="/"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/signup" element={<SignUp />} />
          {isLoggedIn && (
            <>
              {" "}
              {/* Use fragment to group multiple routes */}
              <Route path="/parkyeribelirle" element={<ParkYeriBelirle />} />
              <Route path="/otoparkım" element={<Otoparkım />} />
              <Route path="/home" element={<HomePage />} />
            </>
          )}
        </Routes>
      </div>
    </AuthProvider>
  );
}
