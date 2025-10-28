import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const cards = [
    { title: "Users", description: "View and manage all registered users.", link: "/admin/users" },
    { title: "Profiles", description: "View all user profiles including details and pictures.", link: "/admin/profiles" },
    { title: "Programs", description: "Add, edit, or remove programs easily.", link: "/admin/programs" },
    // { title: "Pricing", description: "Update pricing and packages quickly.", link: "/admin/prices" },
    { title: "Purchases", description: "All the membership users will be shown here.", link: "/admin/purchases" },
    { title: "Attendance", description: "View all users’ attendance records.", link: "/admin/attendance" },
  ];

  return (
    <div
      className="min-vh-100 p-5"
      style={{
        backgroundColor: "#121212", // dark-gray background
        color: "#e0e0e0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="p-5 rounded-4 shadow-lg"
        style={{
          backgroundColor: "#1f1f1f", // slightly lighter dark card
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <h1 style={{ color: "#ff6f00", marginBottom: "20px" }}>Admin Dashboard</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#cfcfcf" }}>
          Welcome, Admin! Manage your <strong>users</strong>, <strong>profiles</strong>, <strong>programs</strong>,{" "}
          <strong>purchases</strong>, and <strong>attendance records</strong> efficiently from here.
        </p>

        {/* Dashboard Cards */}
        <div className="mt-4 d-flex flex-wrap gap-4 justify-content-center">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              style={{ textDecoration: "none", flex: "1 1 220px", maxWidth: "280px" }}
            >
              <div
                className="p-4 rounded-3 h-100"
                style={{
                  backgroundColor: "#292929", // darker card
                  textAlign: "center",
                  border: "1px solid #333",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3 style={{ color: "#ff6f00", marginBottom: "10px" }}>
                  {card.title}
                </h3>
                <p style={{ color: "#cfcfcf" }}>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
