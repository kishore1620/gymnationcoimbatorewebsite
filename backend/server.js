import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db.js"; // adjust path if needed
// import path from "path";

import profileRoutes from "./routes/profileRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import attendanceRoutes from "./routes/attendanceRoutes.js";


import planRoutes from "./routes/plans.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// // serve profile images
app.use("/uploads", express.static("uploads"));


// Serve uploads folder statically
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Example route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/workouts", workoutRoutes);

// Routes
app.use("/api/admin", adminRoutes);

app.use("/api/purchases", purchaseRoutes);

app.use("/api/plans", planRoutes);

app.use("/api/attendance", attendanceRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

