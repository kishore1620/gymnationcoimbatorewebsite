import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";   // ✅ import User model

const router = express.Router();

// 🔹 Middleware to protect admin routes
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secret123"); // use process.env.JWT_SECRET in prod
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 🔹 Admin Signup (Max 2 admins allowed)
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminCount = await Admin.countDocuments();
    if (adminCount >= 2) {
      return res.status(400).json({ message: "❌ Maximum 2 admins allowed!" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "❌ Admin already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "✅ Admin registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, "secret123", { expiresIn: "1h" });
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Fetch all registered users (Protected)
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
