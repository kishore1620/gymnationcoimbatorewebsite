import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// User Pages
import HeroSection from "./intern/HeroSection";
import Home from "./pages/Home";
import Presence from "./pages/Presence";
import Price from "./pages/Price";
import PurchasePage from "./pages/PurchasePage";
import ThankYou from "./pages/ThankYou";
import Program from "./pages/Program";
import Service from "./pages/Service";
import Login from "./pagesAuth/Login";
import Signup from "./pagesAuth/Signup";
import Contact from "./pages/Contact";
import MyWorkouts from "./pages/MyWorkouts";
import Membership from "./pages/Membership";
import Profile from "./pages/Profile";
import MyAttendance from "./pages/MyAttendance";

// Admin Pages
import AdminSignup from "./pagesAdmin/AdminSignup";
import AdminLogin from "./pagesAdmin/AdminLogin";
import Dashboard from "./pagesAdmin/Dashboard";
import ManageUsers from "./pagesAdmin/ManageUsers";
import AdminAttendance from "./pagesAdmin/AdminAttendance";
import ManagePrograms from "./pagesAdmin/ManagePrograms";
import ManagePlans from "./pagesAdmin/ManagePlans";
import ManagePurchases from "./pagesAdmin/ManagePurchases";
import AllProfiles from "./pagesAdmin/AllProfiles"; // ✅ New Admin Page

// Context
import { WorkoutProvider } from "./context/WorkoutContext";

// 🔐 Protected Admin Route
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  const token = localStorage.getItem("adminToken");
  if (!token || isAdmin !== "true") return <Navigate to="/admin/login" replace />;
  return children;
};

const App = () => {
  return (
    <WorkoutProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Layout → no Navbar/Footer */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* User Layout → Navbar + Footer */}
          <Route element={<UserLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/price" element={<Price />} />
            <Route path="/presence" element={<Presence />} />
            <Route path="/purchase/:planId" element={<PurchasePage />} />
            <Route path="/program" element={<Program />} />
            <Route path="/service" element={<Service />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myattendance" element={<MyAttendance />} />
            <Route path="/myworkouts" element={<MyWorkouts />} />
            <Route path="/membership" element={<Membership />} />
          </Route>

          {/* Admin Layout → Sidebar only */}
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <ManageUsers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/profiles"
              element={
                <ProtectedAdminRoute>
                  <AllProfiles /> {/* ✅ New Route */}
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedAdminRoute>
                  <AdminAttendance />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <ProtectedAdminRoute>
                  <ManagePrograms />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/prices"
              element={
                <ProtectedAdminRoute>
                  <ManagePlans />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/purchases"
              element={
                <ProtectedAdminRoute>
                  <ManagePurchases />
                </ProtectedAdminRoute>
              }
            />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </WorkoutProvider>
  );
};

export default App;
