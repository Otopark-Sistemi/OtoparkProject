// pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-transparent absolute border-b-[1px] border-transparent shadow-2xl w-full h-20 p-2">
      <nav>
        <ul className="justify-center items-center flex flex-row">
          <li className="text-2xl p-2">
            <Link to="/parkyeribelirle">Park Yeri Belirle</Link>
          </li>
          <li className="text-2xl p-2">
            <Link to="/otoparkim">Otoparkım</Link>
          </li>
        </ul>
          </nav>
          
    </div>
  );
};

export default HomePage;
