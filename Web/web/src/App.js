import React from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import Admin from "./pages/Admin";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  const navigate = useNavigate();

  // Giriş yapıldıktan sonra yönlendirme fonksiyonu
  const handleLoginSuccess = () => {
    navigate("/Admin");
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </>
  );
}
