import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    entryTime: {
      type: Date,
    },
    exitTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
