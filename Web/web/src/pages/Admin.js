// pages/Admin.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ParkYeriBelirle from "./ParkYeriBelirle";
import Otoparkım from "./Otoparkım";

const Admin = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/admin/parkyeribelirle">Park Yeri Belirle</Link>
          </li>
          <li>
            <Link to="/admin/otoparkim">Otopark</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/admin/parkyeribelirle" element={<ParkYeriBelirle />} />
        <Route path="/admin/otoparkim" element={<Otoparkım />} />
      </Routes>
    </div>
  );
};

export default Admin;
