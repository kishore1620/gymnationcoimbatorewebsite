// src/pages/MyWorkouts.jsx
import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { UserContext } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

dayjs.extend(isoWeek);

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

const calcCalories = (exerciseName, sets, reps, weight) => {
  const base = calorieRates[exerciseName] || 5;
  return parseFloat((sets * reps * weight * base * 0.1).toFixed(2));
};

const MyWorkouts = () => {
  const { user } = useContext(UserContext);
  const userId = user?._id || localStorage.getItem("userId");

  const [workouts, setWorkouts] = useState({});
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  // Fetch user workouts
  useEffect(() => {
    if (!userId) return;

    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/workouts/myworkouts/${userId}`);
        const data = await res.json();
        setWorkouts(data || {});
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    fetchWorkouts();
  }, [userId]);

  // Filter workouts
  const filteredGrouped = (() => {
    if (!workouts) return {};
    if (filter === "all") return workouts;

    const out = {};
    Object.keys(workouts).forEach(day => {
      Object.keys(workouts[day]).forEach(type => {
        workouts[day][type].forEach(w => {
          const wDate = dayjs(w.createdAt || new Date());
          const addWorkout = () => {
            if (!out[day]) out[day] = {};
            if (!out[day][type]) out[day][type] = [];
            out[day][type].push(w);
          };
          if (filter === "today" && wDate.isSame(dayjs(), "day")) addWorkout();
          else if (filter === "week") {
            const start = dayjs().startOf("isoWeek");
            const end = dayjs().endOf("isoWeek");
            if (wDate.isAfter(start.subtract(1, "second")) && wDate.isBefore(end.add(1, "second"))) addWorkout();
          }
        });
      });
    });
    return out;
  })();

  const startEditing = (w, type, day) => setEditing({ ...w, type, day });
  const cancelEditing = () => setEditing(null);

  const handleEditChange = (field, value) => {
    setEditing(prev => {
      const next = { ...prev, [field]: value };
      if (["sets", "reps", "weight", "name"].includes(field)) {
        const nameOnly = next.name ? next.name.split(" – ")[0] : "";
        const sets = parseInt(next.sets) || 0;
        const reps = parseInt(next.reps) || 0;
        const weight = parseFloat(next.weight) || 0;
        next.calories = calcCalories(nameOnly, sets, reps, weight);
      }
      return next;
    });
  };

  const saveEdit = async () => {
    if (!editing) return;

    try {
      const payload = {
        userId,
        day: editing.day,
        type: editing.type,
        workout: {
          name: editing.name,
          sets: parseInt(editing.sets),
          reps: parseInt(editing.reps),
          weight: parseFloat(editing.weight),
          calories: parseFloat(editing.calories),
        },
      };

      const res = await fetch(`http://localhost:5000/api/workouts/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setWorkouts(prev => {
          const copy = { ...prev };
          copy[editing.day][editing.type] = copy[editing.day][editing.type].map(w =>
            w._id === editing._id ? { ...w, ...payload.workout } : w
          );
          return copy;
        });
        setEditing(null);
      } else {
        console.error("Save failed", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWorkout = async (w, type, day) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/workouts/${w._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, day, type }),
      });

      if (res.ok) {
        setWorkouts(prev => {
          const copy = { ...prev };
          copy[day][type] = copy[day][type].filter(x => x._id !== w._id);
          return copy;
        });
        if (editing?._id === w._id) setEditing(null);
      } else {
        console.error("Delete failed", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-warning">My Workouts</h2>

      {/* Filter Buttons */}
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        {["all", "today", "week"].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Workouts" : f === "today" ? "Today" : "This Week"}
          </button>
        ))}
      </div>

      {/* Workouts */}
      {Object.keys(filteredGrouped).length === 0 ? (
        <p className="text-center text-muted">No workouts found.</p>
      ) : (
        Object.keys(filteredGrouped).map(day => (
          <div key={day} className="mb-5">
            <h4 className="text-warning">{day.toUpperCase()}</h4>
            {Object.keys(filteredGrouped[day]).map(type => {
              const list = filteredGrouped[day][type];
              const totalCalories = list.reduce((s, it) => s + (it.calories || 0), 0);

              return (
                <div key={type} className="mb-4">
                  <h5 className="text-light">{type.replace("_", " ").toUpperCase()}</h5>

                  {/* Desktop Table */}
                  <div className="d-none d-md-block table-responsive">
                    <table className="table table-dark table-striped text-center">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Exercise</th>
                          <th>Sets</th>
                          <th>Reps</th>
                          <th>Weight (kg)</th>
                          <th>Calories</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map(w => (
                          <tr key={w._id}>
                            <td>{dayjs(w.createdAt).format("MMM D, YYYY h:mm A")}</td>
                            <td>{editing && editing._id === w._id ? <input value={editing.name} onChange={e => handleEditChange("name", e.target.value)} /> : w.name}</td>
                            <td>{editing && editing._id === w._id ? <input type="number" value={editing.sets} onChange={e => handleEditChange("sets", e.target.value)} /> : w.sets}</td>
                            <td>{editing && editing._id === w._id ? <input type="number" value={editing.reps} onChange={e => handleEditChange("reps", e.target.value)} /> : w.reps}</td>
                            <td>{editing && editing._id === w._id ? <input type="number" value={editing.weight} onChange={e => handleEditChange("weight", e.target.value)} /> : `${w.weight} kg`}</td>
                            <td>{editing && editing._id === w._id ? editing.calories : `${w.calories} kcal`}</td>
                            <td>
                              {editing && editing._id === w._id ? (
                                <>
                                  <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>Save</button>
                                  <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button className="btn btn-sm btn-info me-2" onClick={() => startEditing(w, type, day)}>Edit</button>
                                  <button className="btn btn-sm btn-danger" onClick={() => deleteWorkout(w, type, day)}>Delete</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="5" className="text-end fw-bold">Total Calories</td>
                          <td className="fw-bold text-success">{totalCalories} kcal</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="d-md-none">
                    {list.map(w => (
                      <div key={w._id} className="card mb-3 bg-dark text-light">
                        <div className="card-body">
                          <p><strong>Date:</strong> {dayjs(w.createdAt).format("MMM D, YYYY h:mm A")}</p>
                          <p><strong>Exercise:</strong> {editing && editing._id === w._id ? <input value={editing.name} onChange={e => handleEditChange("name", e.target.value)} /> : w.name}</p>
                          <p><strong>Sets:</strong> {editing && editing._id === w._id ? <input type="number" value={editing.sets} onChange={e => handleEditChange("sets", e.target.value)} /> : w.sets}</p>
                          <p><strong>Reps:</strong> {editing && editing._id === w._id ? <input type="number" value={editing.reps} onChange={e => handleEditChange("reps", e.target.value)} /> : w.reps}</p>
                          <p><strong>Weight:</strong> {editing && editing._id === w._id ? <input type="number" value={editing.weight} onChange={e => handleEditChange("weight", e.target.value)} /> : `${w.weight} kg`}</p>
                          <p><strong>Calories:</strong> {editing && editing._id === w._id ? editing.calories : `${w.calories} kcal`}</p>
                          <div className="d-flex gap-2">
                            {editing && editing._id === w._id ? (
                              <>
                                <button className="btn btn-sm btn-success flex-fill" onClick={saveEdit}>Save</button>
                                <button className="btn btn-sm btn-secondary flex-fill" onClick={cancelEditing}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <button className="btn btn-sm btn-info flex-fill" onClick={() => startEditing(w, type, day)}>Edit</button>
                                <button className="btn btn-sm btn-danger flex-fill" onClick={() => deleteWorkout(w, type, day)}>Delete</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default MyWorkouts;
