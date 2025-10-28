import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    profilePicture: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    extraInfo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
