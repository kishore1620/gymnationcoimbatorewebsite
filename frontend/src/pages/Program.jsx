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
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("chest");
  const [workoutData, setWorkoutData] = useState({});
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Fetch only TODAY's workouts
  useEffect(() => {
    if (!user?._id) return;
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/workouts/myworkouts/${user._id}`);
        const data = await res.json();
        setWorkoutData(data || {});
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchWorkouts();
  }, [user]);

  // Calculate calories
  const calcCalories = (exerciseName, sets, reps, weight) => {
    const base = calorieRates[exerciseName] || 5;
    return parseFloat((sets * reps * weight * base * 0.1).toFixed(2));
  };

  const clearForm = () => {
    ["sets-input", "reps-input", "weight-input"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  };

  const handleSaveWorkout = async () => {
    if (!selectedDay) return alert("Select a day");
    if (!user?._id) return alert("Not logged in");

    const exercise = document.getElementById("exercise-select")?.value;
    const sets = parseInt(document.getElementById("sets-input")?.value);
    const reps = parseInt(document.getElementById("reps-input")?.value);
    const weight = parseFloat(document.getElementById("weight-input")?.value);

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
          body: JSON.stringify({
            userId: user._id,
            day: selectedDay,
            type: editingWorkout.type,
            workout: workoutObj,
          }),
        });

        if (res.ok) {
          setWorkoutData((prev) => ({
            ...prev,
            [selectedDay]: {
              ...prev[selectedDay],
              [editingWorkout.type]:
                prev[selectedDay][editingWorkout.type].map((w) =>
                  w._id === editingWorkout.workoutId ? { ...w, ...workoutObj } : w
                ),
            },
          }));
          setEditingWorkout(null);
          clearForm();
        }
        return;
      }

      // ADD NEW
      const res = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          day: selectedDay,
          type: selectedWorkoutType,
          workout: workoutObj,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        const created = payload.workout;

        setWorkoutData((prev) => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [selectedWorkoutType]: [...(prev[selectedDay]?.[selectedWorkoutType] || []), created],
          },
        }));
        clearForm();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEditWorkout = (workout, type) => {
    setEditingWorkout({ workoutId: workout._id, type });

    document.getElementById("sets-input").value = workout.sets;
    document.getElementById("reps-input").value = workout.reps;
    document.getElementById("weight-input").value = workout.weight;
  };

  const handleDeleteWorkout = async (workout, type) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/workouts/${workout._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, day: selectedDay, type }),
      });

      if (res.ok) {
        setWorkoutData((prev) => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [type]: prev[selectedDay][type].filter((w) => w._id !== workout._id),
          },
        }));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
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
            <option key={d}>{d}</option>
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
            <option key={t}>{t.replace("_", " ").toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Exercise */}
      <div className="mb-3">
        <label className="text-light">Exercise</label>
        <select id="exercise-select" className="form-select">
          {workouts[selectedWorkoutType].map((ex, idx) => (
            <option key={idx}>{ex}</option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input id="sets-input" type="number" className="form-control" placeholder="Sets" />
        </div>
        <div className="col-md-4">
          <input id="reps-input" type="number" className="form-control" placeholder="Reps" />
        </div>
        <div className="col-md-4">
          <input id="weight-input" type="number" className="form-control" placeholder="Weight (kg)" />
        </div>
      </div>

      {/* Buttons */}
      <button onClick={handleSaveWorkout} className="btn btn-warning w-100 mb-3">
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
                {Object.keys(workoutData[selectedDay] || {}).map((type) =>
                  workoutData[selectedDay][type].map((w, i) => (
                    <tr key={w._id}>
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
            {Object.keys(workoutData[selectedDay] || {}).map((type) =>
              workoutData[selectedDay][type].map((w, i) => (
                <div key={w._id} className="card bg-dark text-light mb-3">
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
