import mongoose from "mongoose";

const WorkoutEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true, default: 0 }, // kg
    calories: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    day: { type: String, required: true }, // e.g. "Monday"
    type: { type: String, required: true }, // e.g. "chest"
    workouts: [WorkoutEntrySchema],
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", WorkoutSchema);
export default Workout;