import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Dumbbell, Tags, ShoppingCart, LogOut } from "lucide-react";
import "../styles/AdminLayout.css";
import logo from "../img/gnlogo.jpg"; // ✅ import your logo

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img 
            src={logo} 
            alt="GymNation Logo" 
            style={{ width: "90px", height: "55px", objectFit: "cover" }} 
          />
          GymNation Admin
        </h2>

        <nav>
          <NavLink to="/admin/dashboard"><LayoutDashboard size={18}/> Dashboard</NavLink>
          <NavLink to="/admin/users"><Users size={18}/> Users</NavLink>
          <NavLink to="/admin/profiles"><Users size={18}/> Profiles</NavLink> {/* ✅ New */}
          <NavLink to="/admin/attendance"><Users size={18}/> Attendance</NavLink>
          <NavLink to="/admin/programs"><Dumbbell size={18}/> Programs</NavLink>
          {/* <NavLink to="/admin/prices"><Tags size={18}/> Prices</NavLink> */}
          <NavLink to="/admin/purchases"><ShoppingCart size={18}/> Purchases</NavLink> {/* ✅ NEW */}
        </nav>

        {/* Logout at the bottom */}
        <div className="admin-logout">
          <button 
            onClick={handleLogout} 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: "#ff5e00",
              cursor: "pointer",
              padding: "10px 0",
              fontWeight: "500"
            }}
          >
            <LogOut size={18}/> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet /> {/* Each admin page renders here */}
      </main>
    </div>
  );
};

export default AdminLayout;
