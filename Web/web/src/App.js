import React from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import Admin from "./pages/Admin";
import Login, { LoginPage } from "./pages/Login";
import ParkingLotSetup  from "./pages/ParkingLotSetup";
import SignUp from "./pages/SignUp";
import CanvasApi from "./pages/CanvasApi";



export default function App() {
  const navigate = useNavigate();

  // Giriş yapıldıktan sonra yönlendirme fonksiyonu
  const handleLoginSuccess = () => {
    navigate("/ParkingLotSetup");
  };

  return (
    <>
      <Routes >
        <Route
          path="/"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
      
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Admin" element={<Admin />} />
       <Route path="/ParkingLotSetup" element={<ParkingLotSetup/>} /> 
       <Route path="/CanvasApi" element={<CanvasApi/>} /> 
      </Routes>
    </>
  );
}
