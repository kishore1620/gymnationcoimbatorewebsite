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

  const [workouts, setWorkouts] = useState({}); // grouped by day -> type -> [items]
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch full history (uses new backend route)
  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/workouts/history/${userId}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setWorkouts(data || {});
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setWorkouts({});
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [userId]);

  // Utility: get a dayjs object for a workout item (prefer entry.date then createdAt)
  const workoutDate = (w) => {
    // w may have `date` (string YYYY-MM-DD from group) or w.createdAt (timestamp)
    if (w.date) return dayjs(w.date);
    if (w.createdAt) return dayjs(w.createdAt);
    return dayjs(); // fallback to now
  };

  // filteredGrouped: returns grouped object similar to `workouts` but filtered for 'today'/'week'
  const filteredGrouped = (() => {
    if (!workouts || Object.keys(workouts).length === 0) return {};
    if (filter === "all") return workouts;

    const out = {};
    Object.keys(workouts).forEach((day) => {
      Object.keys(workouts[day]).forEach((type) => {
        workouts[day][type].forEach((w) => {
          const wDate = workoutDate(w);
          const shouldAdd =
            filter === "today"
              ? wDate.isSame(dayjs(), "day")
              : // week
                wDate.isAfter(dayjs().startOf("isoWeek").subtract(1, "second")) &&
                wDate.isBefore(dayjs().endOf("isoWeek").add(1, "second"));

          if (shouldAdd) {
            if (!out[day]) out[day] = {};
            if (!out[day][type]) out[day][type] = [];
            out[day][type].push(w);
          }
        });
      });
    });

    return out;
  })();

  const startEditing = (w, type, day) => {
    // ensure fields are strings for inputs
    setEditing({
      ...w,
      type,
      day,
      sets: String(w.sets ?? ""),
      reps: String(w.reps ?? ""),
      weight: String(w.weight ?? ""),
      calories: String(w.calories ?? ""),
    });
  };
  const cancelEditing = () => setEditing(null);

  const handleEditChange = (field, value) => {
    setEditing((prev) => {
      const next = { ...prev, [field]: value };

      if (["sets", "reps", "weight", "name"].includes(field)) {
        const nameOnly = (next.name || "").split(" – ")[0];
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
        // update local state
        setWorkouts((prev) => {
          const copy = { ...prev };
          if (copy[editing.day] && copy[editing.day][editing.type]) {
            copy[editing.day][editing.type] = copy[editing.day][editing.type].map((w) =>
              w._id === editing._id ? { ...w, ...payload.workout } : w
            );
          }
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
        setWorkouts((prev) => {
          const copy = { ...prev };
          if (copy[day] && copy[day][type]) {
            copy[day][type] = copy[day][type].filter((x) => x._id !== w._id);
            // if no items remain for that type, optionally remove the key
            if (copy[day][type].length === 0) delete copy[day][type];
            if (Object.keys(copy[day] || {}).length === 0) delete copy[day];
          }
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

  // render helpers
  const renderDesktopTable = (list, type, day) => {
    const totalCalories = list.reduce((s, it) => s + (Number(it.calories) || 0), 0);

    return (
      <div className="d-none d-md-block table-responsive" key={`desk-${type}`}>
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
            {list.map((w, idx) => (
              <tr key={`${w._id}-${idx}`}>
                <td>{dayjs(w.date || w.createdAt).format("MMM D, YYYY h:mm A")}</td>

                <td>
                  {editing && editing._id === w._id ? (
                    <input value={editing.name} onChange={(e) => handleEditChange("name", e.target.value)} />
                  ) : (
                    w.name
                  )}
                </td>

                <td>
                  {editing && editing._id === w._id ? (
                    <input type="number" value={editing.sets} onChange={(e) => handleEditChange("sets", e.target.value)} />
                  ) : (
                    w.sets
                  )}
                </td>

                <td>
                  {editing && editing._id === w._id ? (
                    <input type="number" value={editing.reps} onChange={(e) => handleEditChange("reps", e.target.value)} />
                  ) : (
                    w.reps
                  )}
                </td>

                <td>
                  {editing && editing._id === w._id ? (
                    <input type="number" value={editing.weight} onChange={(e) => handleEditChange("weight", e.target.value)} />
                  ) : (
                    `${w.weight} kg`
                  )}
                </td>

                <td>{editing && editing._id === w._id ? editing.calories : `${w.calories} kcal`}</td>

                <td>
                  {editing && editing._id === w._id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-info btn-sm me-2" onClick={() => startEditing(w, type, day)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(w, type, day)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="text-end fw-bold">
                Total Calories
              </td>
              <td className="fw-bold text-success">{totalCalories} kcal</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderMobileCards = (list, type, day) => {
    return (
      <div className="d-md-none" key={`mobile-${type}`}>
        {list.length === 0 ? (
          <p className="text-muted">No workouts.</p>
        ) : (
          list.map((w, idx) => (
            <div className="card mb-3 bg-dark text-light" key={`${w._id}-m-${idx}`}>
              <div className="card-body">
                <p><strong>Date:</strong> {dayjs(w.date || w.createdAt).format("MMM D, YYYY h:mm A")}</p>

                <p>
                  <strong>Exercise:</strong>{" "}
                  {editing && editing._id === w._id ? (
                    <input value={editing.name} onChange={(e) => handleEditChange("name", e.target.value)} />
                  ) : (
                    w.name
                  )}
                </p>

                <p>
                  <strong>Sets:</strong>{" "}
                  {editing && editing._id === w._id ? (
                    <input type="number" value={editing.sets} onChange={(e) => handleEditChange("sets", e.target.value)} />
                  ) : (
                    w.sets
                  )}
                </p>

                <p>
                  <strong>Reps:</strong>{" "}
                  {editing && editing._id === w._id ? (
                    <input type="number" value={editing.reps} onChange={(e) => handleEditChange("reps", e.target.value)} />
                  ) : (
                    w.reps
                  )}
                </p>

                <p>
                  <strong>Weight:</strong>{" "}
                  {editing && editing._id === w._id ? (
                    <input type="number" value={editing.weight} onChange={(e) => handleEditChange("weight", e.target.value)} />
                  ) : (
                    `${w.weight} kg`
                  )}
                </p>

                <p><strong>Calories:</strong> {editing && editing._id === w._id ? editing.calories : `${w.calories} kcal`}</p>

                <div className="d-flex gap-2">
                  {editing && editing._id === w._id ? (
                    <>
                      <button className="btn btn-success btn-sm flex-fill" onClick={saveEdit}>Save</button>
                      <button className="btn btn-secondary btn-sm flex-fill" onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-info btn-sm flex-fill" onClick={() => startEditing(w, type, day)}>Edit</button>
                      <button className="btn btn-danger btn-sm flex-fill" onClick={() => deleteWorkout(w, type, day)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-warning">My Workout History</h2>

      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        {["all", "today", "week"].map((f) => (
          <button
            key={f}
            className={`btn ${filter === f ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Workouts" : f === "today" ? "Today" : "This Week"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading workouts...</p>
      ) : Object.keys(filteredGrouped).length === 0 ? (
        <p className="text-center text-muted">No workouts found.</p>
      ) : (
        Object.keys(filteredGrouped).map((day) => (
          <div key={`day-${day}`} className="mb-5">
            <h4 className="text-warning">{day.toUpperCase()}</h4>

            {Object.keys(filteredGrouped[day]).map((type) => {
              const list = filteredGrouped[day][type] || [];

              return (
                <div key={`group-${day}-${type}`} className="mb-4">
                  <h5 className="text-light">{type.replace("_", " ").toUpperCase()}</h5>

                  {renderDesktopTable(list, type, day)}
                  {renderMobileCards(list, type, day)}
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
