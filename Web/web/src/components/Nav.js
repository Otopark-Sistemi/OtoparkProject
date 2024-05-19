import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaParking, FaHome } from "react-icons/fa";

const Nav = () => {
  useEffect(() => {
    const navToggle = document.getElementById("nav-toggle");
    const navContent = document.getElementById("nav-content");

    if (navToggle) {
      navToggle.onclick = function () {
        if (navContent) {
          navContent.classList.toggle("hidden");
        }
      };
    }
  }, []);

  return (
    <nav className="bg-slate-600 text-white  p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl font-bold">
          <NavLink to="/" className="flex items-center">
            <FaHome className="mr-2" /> Anasayfa
          </NavLink>
        </div>
        <div className="hidden md:flex space-x-4">
          <NavLink
            end
            to="/parkyeribelirle"
            className="hover:text-gray-300 transition duration-300"
            activeClassName="text-yellow-400"
          >
            <FaParking className="inline-block mr-1" /> Park Yeri Belirle
          </NavLink>
          <NavLink
            to="/otoparkım"
            className="hover:text-gray-300 transition duration-300"
            activeClassName="text-yellow-400"
          >
            <FaParking className="inline-block mr-1" /> Otoparkım
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
          className="block mt-4 text-white hover:text-gray-300"
          activeClassName="text-yellow-400"
        >
          <FaParking className="inline-block mr-1" /> Park Yeri Belirle
        </NavLink>
        <NavLink
          to="/otoparkım"
          className="block mt-4 text-white hover:text-gray-300"
          activeClassName="text-yellow-400"
        >
          <FaParking className="inline-block mr-1" /> Otoparkım
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
