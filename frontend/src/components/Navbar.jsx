import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Dumbbell,
  UserPlus,
  CalendarDays, // 🆕 added icon
} from "lucide-react";
import logo from "../img/gnlogo.jpg";
import "../styles/Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAuthenticated = localStorage.getItem("user");
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsOpen(false);
  };

  const closeProfile = () => setIsProfileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    closeProfile();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <nav className="navbar-dark">
      <div className="container nav-container">
        <NavLink
          to="/home"
          className="navbar-logo"
          onClick={() => setIsOpen(false)}
        >
          <img src={logo} alt="Gym Nation" className="logo" />
        </NavLink>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={28} color="#ff5e00" />
          ) : (
            <Menu size={28} color="#ff5e00" />
          )}
        </button>

        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/home" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/presence" onClick={() => setIsOpen(false)}>
              Attendance
            </NavLink>
          </li>
          <li>
            <NavLink to="/service" onClick={() => setIsOpen(false)}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/program" onClick={() => setIsOpen(false)}>
              Programs
            </NavLink>
          </li>
          <li>
            <NavLink to="/price" onClick={() => setIsOpen(false)}>
              Pricing
            </NavLink>
          </li>
          <li className="profile-container">
            <button
              className="profile-link"
              onClick={toggleProfile}
              aria-expanded={isProfileOpen}
            >
              <User size={22} color="#fff" />
            </button>
          </li>
        </ul>
      </div>

      {/* ✅ Off-canvas Profile Menu */}
      <div
        className={`offcanvas ${isProfileOpen ? "show" : ""}`}
        style={{ backgroundColor: "black" }}
      >
        <div className="offcanvas-header">
          <h5>Menu</h5>
          <button className="btn-close btn-close-white" onClick={closeProfile}>
            ×
          </button>
        </div>

        <div className="offcanvas-body d-flex flex-column gap-3">
          <NavLink to="/profile" className="btn-custom" onClick={closeProfile}>
            <User size={18} className="me-2" /> Profile
          </NavLink>

          <NavLink
            to="/myworkouts"
            className="btn btn-outline-light w-100"
            onClick={closeProfile}
          >
            <Dumbbell size={18} className="me-2" /> My Workouts
          </NavLink>

          <NavLink
            to="/myattendance" // 🆕 new route
            className="btn btn-outline-light w-100"
            onClick={closeProfile}
          >
            <CalendarDays size={18} className="me-2" /> My Attendance
          </NavLink>

          <NavLink
            to="/membership"
            className={({ isActive }) =>
              `btn btn-outline-light w-100 ${isActive ? "active" : ""}`
            }
            onClick={closeProfile}
          >
            <UserPlus size={18} className="me-2" /> Membership
          </NavLink>

          {isAuthenticated && (
            <button className="btn-custom logout" onClick={handleLogout}>
              <LogOut size={18} className="me-2" /> Logout
            </button>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isProfileOpen && (
        <div
          className="offcanvas-backdrop"
          onClick={closeProfile}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;
