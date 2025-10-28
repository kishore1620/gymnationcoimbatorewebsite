// src/pages/Program.jsx
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../context/UserContext";
import "../styles/Program.css";

// ✅ Calorie burn rates
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

// ✅ Workouts grouped by type
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

// ✅ Days of the week
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Program = () => {
  const { user } = useContext(UserContext);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("chest");
  const [workoutData, setWorkoutData] = useState({});
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Fetch workouts from backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user?._id) return;
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

  // Calculate calories burned
  const calcCalories = (exerciseName, sets, reps, weight) => {
    const base = calorieRates[exerciseName] || 5;
    return parseFloat((sets * reps * weight * base * 0.1).toFixed(2));
  };

  // Clear form inputs
  const clearForm = () => {
    ["sets-input", "reps-input", "weight-input"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    const elExercise = document.getElementById("exercise-select");
    if (elExercise && workouts[selectedWorkoutType]?.length) elExercise.selectedIndex = 0;
  };

  // Save workout (create or update)
  const handleSaveWorkout = async () => {
    if (!user?._id) return alert("User not logged in");
    if (!selectedDay) return alert("Select a day first");

    const exercise = document.getElementById("exercise-select")?.value;
    const sets = parseInt(document.getElementById("sets-input")?.value);
    const reps = parseInt(document.getElementById("reps-input")?.value);
    const weight = parseFloat(document.getElementById("weight-input")?.value);

    if (!exercise) return alert("Select an exercise");
    if (!sets || !reps || !weight) return alert("Enter valid sets, reps & weight");

    const exerciseName = exercise.split(" – ")[0];
    const calories = calcCalories(exerciseName, sets, reps, weight);
    const workoutObj = { name: exercise, sets, reps, weight, calories };

    try {
      if (editingWorkout) {
        // Update workout
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
          setWorkoutData(prev => ({
            ...prev,
            [selectedDay]: {
              ...prev[selectedDay],
              [editingWorkout.type]: prev[selectedDay]?.[editingWorkout.type]?.map(w =>
                w._id === editingWorkout.workoutId ? { ...w, ...workoutObj, _id: w._id } : w
              ) || [],
            },
          }));
          setEditingWorkout(null);
          clearForm();
        } else console.error("Update failed", await res.text());
        return;
      }

      // Create new workout
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
        setWorkoutData(prev => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [selectedWorkoutType]: Array.isArray(prev[selectedDay]?.[selectedWorkoutType])
              ? [...prev[selectedDay][selectedWorkoutType], created]
              : [created],
          },
        }));
        clearForm();
      } else console.error("Create failed", await res.text());
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Edit workout
  const handleEditWorkout = (workout, type) => {
    setEditingWorkout({ workoutId: workout._id, type });
    setSelectedWorkoutType(type);

    const elExercise = document.getElementById("exercise-select");
    const elSets = document.getElementById("sets-input");
    const elReps = document.getElementById("reps-input");
    const elWeight = document.getElementById("weight-input");

    if (elExercise) {
      for (let i = 0; i < elExercise.options.length; i++) {
        if (elExercise.options[i].value === workout.name) {
          elExercise.selectedIndex = i;
          break;
        }
      }
    }
    if (elSets) elSets.value = workout.sets;
    if (elReps) elReps.value = workout.reps;
    if (elWeight) elWeight.value = workout.weight;
  };

  const handleCancelEdit = () => {
    setEditingWorkout(null);
    clearForm();
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
        setWorkoutData(prev => ({
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [type]: prev[selectedDay]?.[type]?.filter(w => w._id !== workout._id) || [],
          },
        }));
        if (editingWorkout?.workoutId === workout._id) setEditingWorkout(null);
      } else console.error("Delete failed", await res.text());
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="program-container container py-5">
      <h2 className="text-center mb-4 text-warning">Workout Tracker</h2>

      {/* Day Selector */}
      <div className="mb-3">
        <label className="form-label text-light">Select Day</label>
        <select
          className="form-select"
          value={selectedDay}
          onChange={e => setSelectedDay(e.target.value)}
        >
          <option value="">--Choose a Day--</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Workout Type Selector */}
      <div className="mb-3">
        <label className="form-label text-white">Workout Type</label>
        <select
          className="form-select"
          value={selectedWorkoutType}
          onChange={e => setSelectedWorkoutType(e.target.value)}
          disabled={!selectedDay}
        >
          {Object.keys(workouts).map(type => (
            <option key={type} value={type}>
              {type.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise Selector */}
      <div className="mb-3">
        <label className="form-label text-white">Exercise</label>
        <select id="exercise-select" className="form-select" disabled={!selectedWorkoutType}>
          {selectedWorkoutType && workouts[selectedWorkoutType]?.map((ex, i) => (
            <option key={i} value={ex}>{ex}</option>
          ))}
        </select>
      </div>

      {/* Input Fields */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input id="sets-input" type="number" className="form-control" placeholder="Sets" />
        </div>
        <div className="col-md-4 mb-2">
          <input id="reps-input" type="number" className="form-control" placeholder="Reps" />
        </div>
        <div className="col-md-4 mb-2">
          <input id="weight-input" type="number" className="form-control" placeholder="Weight (kg)" />
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-warning flex-grow-1" onClick={handleSaveWorkout}>
          {editingWorkout ? "Update Workout" : "Add Workout"}
        </button>
        {editingWorkout && (
          <button className="btn btn-secondary" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      {/* Workout Table / Cards */}
      {selectedDay && (
        <>
          <h4 className="mb-3 text-white">{selectedDay} Workouts</h4>

          {/* Desktop Table */}
          <div className="d-none d-md-block">
            <table className="table table-dark table-striped text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight (kg)</th>
                  <th>Calories</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(workoutData[selectedDay] || {}).map(type => {
                  const exercises = workoutData[selectedDay]?.[type] || [];
                  return exercises.map((w, i) => (
                    <tr key={w?._id || `${type}-${i}`}>
                      <td>{i + 1}</td>
                      <td>{w?.name || "-"}</td>
                      <td>{w?.sets || 0}</td>
                      <td>{w?.reps || 0}</td>
                      <td>{w?.weight || 0} kg</td>
                      <td>{w?.calories || 0} kcal</td>
                      <td>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEditWorkout(w, type)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteWorkout(w, type)}>Delete</button>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="d-md-none workout-cards">
            {Object.keys(workoutData[selectedDay] || {}).map(type => {
              const exercises = workoutData[selectedDay]?.[type] || [];
              return exercises.map((w, i) => (
                <div className="card workout-card mb-3" key={w?._id || `${type}-${i}`}>
                  <div className="card-body">
                    <h6 className="text-info">{w?.name || "-"}</h6>
                    <p className="mb-1 text-warning"><strong>Sets:</strong> {w?.sets || 0}</p>
                    <p className="mb-1 text-warning"><strong>Reps:</strong> {w?.reps || 0}</p>
                    <p className="mb-1 text-warning"><strong>Weight:</strong> {w?.weight || 0} kg</p>
                    <p className="mb-0 text-success"><strong>{w?.calories || 0} kcal</strong></p>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-info me-2" onClick={() => handleEditWorkout(w, type)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteWorkout(w, type)}>Delete</button>
                    </div>
                  </div>
                </div>
              ));
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Program;
