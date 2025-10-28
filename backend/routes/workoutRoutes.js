import express from "express";
import Workout from "../models/Workout.js";

const router = express.Router();

/**
 * 🟢 Create (add) a workout entry — returns the created workout entry
 */
router.post("/", async (req, res) => {
  try {
    const { userId, day, type, workout } = req.body;
    if (!userId || !day || !type || !workout) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let entry = await Workout.findOne({ userId, day, type });
    if (!entry) {
      entry = new Workout({ userId, day, type, workouts: [] });
    }

    entry.workouts.push(workout);
    await entry.save();

    // Return the last pushed workout
    const created = entry.workouts[entry.workouts.length - 1];
    res.status(201).json({
      message: "Workout saved",
      parentId: entry._id,
      day: entry.day,
      type: entry.type,
      workout: {
        _id: created._id,
        name: created.name,
        sets: created.sets,
        reps: created.reps,
        weight: created.weight,
        calories: created.calories,
      },
    });
  } catch (err) {
    console.error("POST /api/workouts error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 Get all workouts grouped by day and type
 * Example: { Monday: { chest: [..], back: [..] }, Tuesday: {...} }
 */
router.get("/myworkouts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "UserId required" });

    // 🟢 Get ALL workouts (no date filter)
    const entries = await Workout.find({ userId }).sort({ createdAt: -1 });

    const grouped = {};
    entries.forEach(entry => {
      if (!grouped[entry.day]) grouped[entry.day] = {};
      if (!grouped[entry.day][entry.type]) grouped[entry.day][entry.type] = [];

      entry.workouts.forEach(w => {
        grouped[entry.day][entry.type].push({
          _id: w._id,
          name: w.name,
          sets: w.sets,
          reps: w.reps,
          weight: w.weight,
          calories: w.calories,
          createdAt: w.createdAt || entry.createdAt,
        });
      });
    });

    res.json(grouped);
  } catch (err) {
    console.error("GET /api/workouts/myworkouts error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 Update a workout entry (by workoutId)
 */
router.put("/:workoutId", async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { userId, day, type, workout } = req.body;
    if (!workoutId || !userId || !day || !type || !workout) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const entry = await Workout.findOne({ userId, day, type });
    if (!entry) return res.status(404).json({ message: "Workout group not found" });

    const idx = entry.workouts.findIndex(w => w._id.toString() === workoutId);
    if (idx === -1) return res.status(404).json({ message: "Workout item not found" });

    // Merge and replace
    entry.workouts[idx] = { ...entry.workouts[idx]._doc, ...workout };
    await entry.save();

    res.json({ message: "Updated", workout: entry.workouts[idx] });
  } catch (err) {
    console.error("PUT /api/workouts/:workoutId error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 Delete a workout entry
 */
router.delete("/:workoutId", async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { userId, day, type } = req.body;
    if (!workoutId || !userId || !day || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const entry = await Workout.findOne({ userId, day, type });
    if (!entry) return res.status(404).json({ message: "Workout group not found" });

    entry.workouts = entry.workouts.filter(w => w._id.toString() !== workoutId);
    await entry.save();

    res.json({ message: "Deleted", workoutId });
  } catch (err) {
    console.error("DELETE /api/workouts/:workoutId error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 Get ALL workouts (Admin use only → ManagePrograms.jsx / history)
 */
router.get("/", async (req, res) => {
  try {
    const entries = await Workout.find()
      .populate("userId", "name email") // include user info
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    console.error("GET /api/workouts error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;



