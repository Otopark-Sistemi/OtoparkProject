// pages/Admin.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ParkYeriBelirle from "./ParkYeriBelirle";
import Otoparkım from "./Otoparkım";

const Admin = () => {
  return (
    <div>
      
      <Routes>
        <Route path="/admin/parkyeribelirle" element={<ParkYeriBelirle />} />
        <Route path="/admin/otoparkim" element={<Otoparkım />} />
      </Routes>
    </div>
  );
};

export default Admin;
