import express from "express";
import mongoose from "mongoose";
import Attendance from "../models/attendance.js";

const router = express.Router();

/* ============================================================
   ADMIN ROUTES
   ============================================================ */

// ✅ 1. Get all attendance records (Admin view)
router.get("/admin/all", async (req, res) => {
  try {
    const records = await Attendance.find()
      .sort({ date: -1 })
      .populate("userId", "name email"); // populate user info if referenced
    res.json(records);
  } catch (error) {
    console.error("Admin all route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 2. Get attendance by userId (Admin view)
router.get("/admin/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    console.error("Admin user route error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   USER ROUTES
   ============================================================ */

// ✅ 3. Mark entry (first check if already marked today)
router.post("/entry", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      userId,
      date: { $gte: today },
    });

    if (existing) {
      return res.status(400).json({ message: "Already marked entry today" });
    }

    const newRecord = await Attendance.create({
      userId,
      date: new Date(),
      entryTime: new Date(),
    });

    res.json({ message: "Entry marked successfully", data: newRecord });
  } catch (error) {
    console.error("Entry error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 4. Mark exit (update today's record)
router.post("/exit", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({
      userId,
      date: { $gte: today },
    });

    if (!record) {
      return res.status(404).json({ message: "No entry found for today" });
    }

    if (record.exitTime) {
      return res.status(400).json({ message: "Already marked exit today" });
    }

    record.exitTime = new Date();
    await record.save();

    res.json({ message: "Exit marked successfully", data: record });
  } catch (error) {
    console.error("Exit error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 5. Get user’s attendance history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    console.error("History route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 6. Get today’s attendance record for a specific user
router.get("/today/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({
      userId,
      date: { $gte: today },
    });

    if (!record) return res.json(null);
    res.json(record);
  } catch (error) {
    console.error("Today route error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
