import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Urban_Move_Colour.svg";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";

function NavBar() {
  
  const { isAuthenticated, logout} = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/rent", label: "Rent" },
    { path: "/drive", label: "Drive" },
    { path: "/ride", label: "Ride" },
    { path: "/help", label: "Help" },
  ];

  const accAuth = [
    { path: "/signup", label: "Sign Up" },
    { path: "/signin", label: "Sign In" },
  ];

  const accountOptions = [
    { label: "My Profile", icon: <FaUser /> },
    { label: "Activities", icon: <FaBell /> },
    { label: "Notifications", icon: <FaBell /> },
    { label: "Sign Out", icon: <FaSignOutAlt />, action: logout },
  ];

  const linkstyles1 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase";

  const linkstyles2 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase rounded-[50px] ";

  return (
    <nav className="bg-black w-full h-[80px] flex flex-row items-center py-[10px] px-[40px] justify-between">
      <header>
        <img src={Logo} alt="Logo" className="w-[60px] h-[60px]" />
      </header>
      <div className="flex gap-[40px]">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className={linkstyles1}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-[10px]">
        {!isAuthenticated ? (
          accAuth.map((item) => (
            <Link to={item.path} key={item.path} className={linkstyles2}>
              {item.label}
            </Link>
          ))
        ) : (
          <div className="relative group">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-full text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-black transition"
            >
              <FaUser />
              <span>ACCOUNT</span>
              <span>{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-black text-orange-400 border border-orange-400 rounded-xl p-3 space-y-2 shadow-lg z-10">
                {accountOptions.map((option) => (
                  <div
                    key={option.label}
                    onClick={option.action || null}
                    className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer rounded"
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
