import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // 🔗 Connects to Users collection
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  plan: { type: String, required: true },
  price: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Purchase", purchaseSchema);
