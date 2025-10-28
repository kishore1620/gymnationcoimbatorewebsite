// backend/models/Plan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  title: String,
  oldPrice: String,
  newPrice: String,
  icon: String,
  highlight: Boolean,
  features: [{ text: String, inactive: Boolean }],
});

export default mongoose.model("Plan", planSchema);
