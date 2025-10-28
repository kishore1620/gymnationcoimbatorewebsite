import express from "express";
import Purchase from "../models/Purchase.js";

const router = express.Router();

// ✅ Save purchase for logged-in user
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, plan, price } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const newPurchase = new Purchase({ userId, name, email, plan, price });
    await newPurchase.save();

    res.status(201).json({ message: "Purchase stored successfully", newPurchase });
  } catch (err) {
    console.error("❌ Error saving purchase:", err);
    res.status(500).json({ error: "Failed to store purchase" });
  }
});

// ✅ Get all purchases (for admin)
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("userId", "name email") // 🔗 also return user details
      .sort({ date: -1 });

    res.json(purchases || []); // always return array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// ✅ Get purchases for one user
router.get("/user/:userId", async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(purchases || []); // always return array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user purchases" });
  }
});

// ✅ Delete a purchase (admin)
router.delete("/:id", async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!deletedPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete purchase" });
  }
});

export default router;
