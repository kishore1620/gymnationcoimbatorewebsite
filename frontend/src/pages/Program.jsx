// src/pages/Program.jsx
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../context/UserContext";
import "../styles/Program.css";

// Calorie rates
const calorieRates = {
  "Bench Press": 7,
  "Incline Dumbbell Press": 7,
  "Chest Fly (Machine/Cable)": 6,
  "Push-Ups": 5,
  "Dips (Chest Focus)": 6,
  "Decline Press": 7,
  Deadlift: 9,
  "Pull-Ups/Chin-Ups": 8,
  "Barbell Row": 7,
  "Lat Pulldown": 6,
  "Seated Cable Row": 6,
  "Face Pulls": 5,
  "Overhead Press (Barbell/Dumbbell)": 7,
  "Arnold Press": 6,
  "Lateral Raises": 5,
  "Front Raises": 5,
  Shrugs: 5,
  Plank: 4,
  "Hanging Leg Raises": 5,
  "Barbell Curl": 5,
  "Dumbbell Alternating Curl": 5,
  "Hammer Curl": 5,
  "Preacher Curl": 5,
  "Concentration Curl": 5,
  "Wrist Curl": 4,
  "Reverse Curl": 4,
  "Close Grip Bench Press": 6,
  "Tricep Dips": 5,
  "Overhead Dumbbell Extension": 5,
  "Skull Crushers": 5,
  "Cable Pushdowns": 5,
  "Russian Twists": 4,
  "Leg Raises": 4,
  "Barbell Squat": 8,
  "Leg Press": 7,
  "Walking Lunges": 6,
  "Romanian Deadlift": 7,
  "Leg Extensions": 6,
  "Hamstring Curls": 5,
  "Standing Calf Raises": 4,
};

// Workouts list for UI
const workouts = {
  chest: [
    "Bench Press – 4×6",
    "Incline Dumbbell Press – 4×8",
    "Chest Fly (Machine/Cable) – 3×12",
    "Push-Ups – 3×15",
    "Dips (Chest Focus) – 3×12",
    "Decline Press – 3×10",
  ],
  back: [
    "Deadlift – 4×6",
    "Pull-Ups/Chin-Ups – 4×Max",
    "Barbell Row – 4×8",
    "Lat Pulldown – 4×10",
    "Seated Cable Row – 3×12",
    "Face Pulls – 3×12",
  ],
  shoulders_abs: [
    "Overhead Press (Barbell/Dumbbell) – 4×8",
    "Arnold Press – 3×10",
    "Lateral Raises – 3×15",
    "Front Raises – 3×12",
    "Shrugs – 3×15",
    "Plank – 3×60 sec",
    "Hanging Leg Raises – 3×12",
  ],
  biceps_forearms: [
    "Barbell Curl – 4×10",
    "Dumbbell Alternating Curl – 3×12",
    "Hammer Curl – 3×12",
    "Preacher Curl – 3×10",
    "Concentration Curl – 3×12",
    "Wrist Curl – 3×15",
    "Reverse Curl – 3×12",
  ],
  triceps_abs: [
    "Close Grip Bench Press – 4×8",
    "Tricep Dips – 3×12",
    "Overhead Dumbbell Extension – 3×12",
    "Skull Crushers – 3×10",
    "Cable Pushdowns – 3×12",
    "Russian Twists – 3×20",
    "Leg Raises – 3×15",
  ],
  legs: [
    "Barbell Squat – 4×8",
    "Leg Press – 4×10",
    "Walking Lunges – 3×12",
    "Romanian Deadlift – 3×8",
    "Leg Extensions – 3×15",
    "Hamstring Curls – 3×12",
    "Standing Calf Raises – 4×15",
  ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Program = () => {
  const { user } = useContext(UserContext);

  // UI state
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("chest");

  // backend data
  // workoutData shape expected: { Monday: { chest: [{...}, ...], back: [...], ... }, Tuesday: { ... } }
  const [workoutData, setWorkoutData] = useState({});

  // form state (controlled inputs)
  const [exercise, setExercise] = useState(workouts.chest[0] || "");
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(20);

  // editing
  const [editingWorkout, setEditingWorkout] = useState(null); // { workoutId, type }
  const [loading, setLoading] = useState(false);

  // Fetch workouts for the user
  useEffect(() => {
    if (!user?._id) return;
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/workouts/myworkouts/${user._id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setWorkoutData(data || {});
      } catch (err) {
        console.error("Fetch error:", err);
        setWorkoutData({});
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [user]);

  // keep exercise select in sync when workout type changes
  useEffect(() => {
    const list = workouts[selectedWorkoutType];
    if (list && list.length) setExercise(list[0]);
    else setExercise("");
  }, [selectedWorkoutType]);

  // Calculate calories
  const calcCalories = (exerciseName, s, r, w) => {
    const base = calorieRates[exerciseName] || 5;
    const setsNum = Number.isFinite(+s) ? +s : 0;
    const repsNum = Number.isFinite(+r) ? +r : 0;
    const weightNum = Number.isFinite(+w) ? +w : 0;
    return parseFloat((setsNum * repsNum * weightNum * base * 0.1).toFixed(2));
  };

  const resetForm = () => {
    setSets(4);
    setReps(8);
    setWeight(20);
    // keep exercise as-is or reset to first of type
    const list = workouts[selectedWorkoutType];
    setExercise(list && list.length ? list[0] : "");
  };

  const handleSaveWorkout = async () => {
    if (!selectedDay) return alert("Select a day");
    if (!user?._id) return alert("Not logged in");

    if (!exercise || !sets || !reps || !weight) return alert("Invalid workout details");

    const exerciseName = exercise.split(" – ")[0];
    const calories = calcCalories(exerciseName, sets, reps, weight);

    const workoutObj = { name: exercise, sets, reps, weight, calories };

    try {
      // UPDATE
      if (editingWorkout) {
        const res = await fetch(`http://localhost:5000/api/workouts/${editingWorkout.workoutId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, day: selectedDay, type: editingWorkout.type, workout: workoutObj }),
        });

        if (!res.ok) throw new Error(`Update failed: ${res.status}`);

        // optimistic update locally
        setWorkoutData((prev) => {
          const dayObj = prev[selectedDay] ? { ...prev[selectedDay] } : {};
          const arr = Array.isArray(dayObj[editingWorkout.type]) ? [...dayObj[editingWorkout.type]] : [];
          const updatedArr = arr.map((w) => (w._id === editingWorkout.workoutId ? { ...w, ...workoutObj } : w));
          return { ...prev, [selectedDay]: { ...dayObj, [editingWorkout.type]: updatedArr } };
        });

        setEditingWorkout(null);
        resetForm();
        return;
      }

      // ADD NEW
      const res = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, day: selectedDay, type: selectedWorkoutType, workout: workoutObj }),
      });

      if (!res.ok) throw new Error(`Create failed: ${res.status}`);

      const payload = await res.json();
      const created = payload.workout;

      setWorkoutData((prev) => {
        const dayObj = prev[selectedDay] ? { ...prev[selectedDay] } : {};
        const arr = Array.isArray(dayObj[selectedWorkoutType]) ? [...dayObj[selectedWorkoutType]] : [];
        return { ...prev, [selectedDay]: { ...dayObj, [selectedWorkoutType]: [...arr, created] } };
      });

      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save workout. See console for details.");
    }
  };

  const handleEditWorkout = (workout, type) => {
    setEditingWorkout({ workoutId: workout._id, type });
    setExercise(workout.name || "");
    setSets(workout.sets || 4);
    setReps(workout.reps || 8);
    setWeight(workout.weight || 20);

    // ensure selected workout type matches the type being edited
    setSelectedWorkoutType(type);
  };

  const handleDeleteWorkout = async (workout, type) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workouts/${workout._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, day: selectedDay, type }),
      });

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      setWorkoutData((prev) => {
        const dayObj = prev[selectedDay] ? { ...prev[selectedDay] } : {};
        const arr = Array.isArray(dayObj[type]) ? dayObj[type].filter((w) => w._id !== workout._id) : [];
        return { ...prev, [selectedDay]: { ...dayObj, [type]: arr } };
      });
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete workout. See console for details.");
    }
  };

  // helpers to safely iterate over day's types
  const getDayTypes = () => {
    if (!selectedDay) return [];
    const dayObj = workoutData[selectedDay] || {};
    return Object.keys(dayObj).filter((k) => Array.isArray(dayObj[k]));
  };

  return (
    <div className="program-container container py-5">
      <h2 className="text-center mb-4 text-warning">Workout Tracker</h2>

      {/* Select Day */}
      <div className="mb-3">
        <label className="text-light">Select Day</label>
        <select className="form-select" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          <option value="">-- Choose a day --</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Select Type */}
      <div className="mb-3">
        <label className="text-light">Workout Type</label>
        <select
          className="form-select"
          value={selectedWorkoutType}
          onChange={(e) => setSelectedWorkoutType(e.target.value)}
          disabled={!selectedDay}
        >
          {Object.keys(workouts).map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise */}
      <div className="mb-3">
        <label className="text-light">Exercise</label>
        <select id="exercise-select" className="form-select" value={exercise} onChange={(e) => setExercise(e.target.value)}>
          {(workouts[selectedWorkoutType] || []).map((ex, idx) => (
            <option key={idx} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            id="sets-input"
            type="number"
            className="form-control"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            id="reps-input"
            type="number"
            className="form-control"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            id="weight-input"
            type="number"
            className="form-control"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min={0}
          />
        </div>
      </div>

      {/* Buttons */}
      <button onClick={handleSaveWorkout} className="btn btn-warning w-100 mb-3" disabled={loading}>
        {editingWorkout ? "Update Workout" : "Add Workout"}
      </button>

      {/* Workout Display */}
      {selectedDay && (
        <>
          <h4 className="text-light mb-3">{selectedDay} Workouts</h4>

          {/* Desktop Table */}
          <div className="d-none d-md-block">
            <table className="table table-dark table-striped text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Calories</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {getDayTypes().length === 0 && (
                  <tr>
                    <td colSpan={7}>No workouts for this day yet.</td>
                  </tr>
                )}

                {getDayTypes().map((type) =>
                  (workoutData[selectedDay][type] || []).map((w, i) => (
                    <tr key={w._id || `${type}-${i}`}>
                      <td>{i + 1}</td>
                      <td>{w.name}</td>
                      <td>{w.sets}</td>
                      <td>{w.reps}</td>
                      <td>{w.weight} kg</td>
                      <td>{w.calories} kcal</td>
                      <td>
                        <button className="btn btn-info btn-sm me-2" onClick={() => handleEditWorkout(w, type)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteWorkout(w, type)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="d-md-none">
            {getDayTypes().length === 0 && <p className="text-light">No workouts for this day yet.</p>}

            {getDayTypes().map((type) =>
              (workoutData[selectedDay][type] || []).map((w, i) => (
                <div key={w._id || `${type}-${i}`} className="card bg-dark text-light mb-3">
                  <div className="card-body">
                    <h5 className="text-info">{w.name}</h5>
                    <p>Sets: {w.sets}</p>
                    <p>Reps: {w.reps}</p>
                    <p>Weight: {w.weight} kg</p>
                    <p className="text-success">{w.calories} kcal</p>

                    <button className="btn btn-info btn-sm me-2" onClick={() => handleEditWorkout(w, type)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteWorkout(w, type)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Program;
