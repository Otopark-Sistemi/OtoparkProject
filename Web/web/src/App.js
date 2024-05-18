import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ParkYeriBelirle from "./pages/ParkYeriBelirle";
import Otoparkım from "./pages/Otoparkım";

export default function App() {
  const navigate = useNavigate();

  // Giriş yapıldıktan sonra yönlendirme fonksiyonu
  const handleLoginSuccess = () => {
    navigate("/home");
  };

  return (
    <div>
      <div className="bg-transparent absolute border-b-[1px] border-transparent shadow-2xl w-full h-20 p-2">
        <nav>
          <ul className="justify-center items-center flex flex-row">
            <li className="text-2xl p-2 ">
              <Link to="/parkyeribelirle">Park Yeri Belirle</Link>
            </li>
            <li className="text-2xl p-2 ">
              <Link to="/otoparkım">Otoparkım</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route
          path="/"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/parkyeribelirle" element={<ParkYeriBelirle />} />
        <Route path="/otoparkım" element={<Otoparkım />} />
        <Route path="/home" element={<HomePage />} />
        
      </Routes>
    </div>
  );
}
