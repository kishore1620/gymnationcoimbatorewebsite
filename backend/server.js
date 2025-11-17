import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db.js";

import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import planRoutes from "./routes/plans.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";

dotenv.config();
connectDB();   // ✔ Only ONE MongoDB connection

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
