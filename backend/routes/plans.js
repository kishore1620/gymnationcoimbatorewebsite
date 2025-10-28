// backend/routes/plans.js
import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

// Get all plans
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a plan
router.put("/:id", async (req, res) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
