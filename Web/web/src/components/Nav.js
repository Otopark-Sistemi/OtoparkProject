import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaParking, FaHome } from "react-icons/fa";
import { AuthContext } from "../auth/AuthProvider";

const Nav = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-slate-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-semibold">
          <NavLink
            to="/home"
            className="flex items-center hover:text-yellow-400 transition duration-300"
          >
            <FaHome className="mr-2 text-xl" /> Anasayfa
          </NavLink>
        </div>
        <div className="hidden md:flex space-x-4">
          <NavLink
            end
            to="/parkyeribelirle"
            className="flex items-center hover:text-yellow-400 transition duration-300"
            activeClassName="text-yellow-400"
          >
            <FaParking className="inline-block mr-1 text-xl" /> Park Yeri
            Belirle
          </NavLink>
          <NavLink
            to="/otoparkım"
            className="flex items-center hover:text-yellow-400 transition duration-300"
            activeClassName="text-yellow-400"
          >
            <FaParking className="inline-block mr-1 text-xl" /> Otoparkım
          </NavLink>
        </div>
        <div className="md:hidden flex items-center">
          <button id="nav-toggle" className="text-3xl">
            &#9776;
          </button>
        </div>
      </div>
      <div className="hidden md:hidden" id="nav-content">
        <NavLink
          end
          to="/parkyeribelirle"
          className="block mt-4 text-white hover:text-yellow-400 transition duration-300"
          activeClassName="text-yellow-400"
        >
          <FaParking className="inline-block mr-1 text-xl" /> Park Yeri Belirle
        </NavLink>
        <NavLink
          to="/otoparkım"
          className="block mt-4 text-white hover:text-yellow-400 transition duration-300"
          activeClassName="text-yellow-400"
        >
          <FaParking className="inline-block mr-1 text-xl" /> Otoparkım
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
