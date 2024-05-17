import React from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import Admin from "./pages/Admin";
<<<<<<< HEAD
import Login, { LoginPage } from "./pages/Login";
import ParkingLotSetup  from "./pages/ParkingLotSetup";
import SignUp from "./pages/SignUp";
import CanvasApi from "./pages/CanvasApi";
import CanvaAPI from "./pages/CanvaAPI";


=======
import { LoginPage } from "./pages/LoginPage";
>>>>>>> b2fac7d5b989b834bd6b5b0e0566570181dbbfe9

export default function App() {
  const navigate = useNavigate();

  // Giriş yapıldıktan sonra yönlendirme fonksiyonu
  const handleLoginSuccess = () => {
<<<<<<< HEAD
    navigate("/ParkingLotSetup");
=======
    navigate("/Admin");
>>>>>>> b2fac7d5b989b834bd6b5b0e0566570181dbbfe9
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
<<<<<<< HEAD
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />

        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/ParkingLotSetup" element={<ParkingLotSetup />} />
        <Route path="/CanvasApi" element={<CanvasApi />} />
        <Route path="/CanvaApi" element={<CanvaAPI />} />
=======
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/Admin" element={<Admin />} />
>>>>>>> b2fac7d5b989b834bd6b5b0e0566570181dbbfe9
      </Routes>
    </>
  );
}
