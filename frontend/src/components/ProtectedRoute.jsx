// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // If no token, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  return children; // allow access
};

export default ProtectedRoute;
