import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaParking, FaHome, FaBars } from "react-icons/fa";
import { AuthContext } from "../auth/AuthProvider";

const Nav = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-lg">
    
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-semibold">
          <NavLink
            to="/home"
            className="flex items-center hover:text-yellow-400 transition duration-300"
          >
            <FaHome className="mr-2 text-xl" /> Anasayfa
          </NavLink>
        </div>
        <div className="hidden md:flex space-x-6">
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
          <button onClick={toggleMenu} className="text-3xl focus:outline-none">
            <FaBars />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
        id="nav-content"
      >
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
