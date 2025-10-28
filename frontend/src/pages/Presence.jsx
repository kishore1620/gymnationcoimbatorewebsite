import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import "../styles/Presence.css";

const Presence = () => {
  const { user } = useContext(UserContext);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/today/${user._id}`
      );
      setAttendance(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  const handleEntry = async () => {
    if (!user?._id) return alert("User not logged in");

    try {
      const res = await axios.post("http://localhost:5000/api/attendance/entry", {
        userId: user._id,
      });
      // ✅ Use the actual attendance object from backend
      setAttendance(res.data.data || res.data); 
    } catch (err) {
      console.error("Entry error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to mark entry");
    }
  };

  const handleExit = async () => {
    if (!user?._id) return alert("User not logged in");

    try {
      const res = await axios.post("http://localhost:5000/api/attendance/exit", {
        userId: user._id,
      });
      setAttendance(res.data.data || res.data); // ✅ Same here
    } catch (err) {
      console.error("Exit error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to mark exit");
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="presence-container container py-5">
      <h2 className="text-center mb-4 text-warning">Gym Attendance</h2>

      {user && (
        <p className="text-center text-light mb-4 fs-5">
          Welcome, <strong>{user.name}</strong>
        </p>
      )}

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <>
          <div className="attendance-card card text-white bg-black mb-4 shadow-lg rounded-4">
            <div className="card-body text-center">
              <h5 className="card-title text-warning mb-3">Today's Attendance</h5>
              <p className="mb-2">
                <strong className="text-info">Entry Time:</strong>{" "}
                {formatTime(attendance?.entryTime)}
              </p>
              <p className="mb-2">
                <strong className="text-info">Exit Time:</strong>{" "}
                {formatTime(attendance?.exitTime)}
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-warning btn-lg fw-bold"
              onClick={handleEntry}
              disabled={attendance?.entryTime}
            >
              Mark Entry
            </button>
            <button
              className="btn btn-outline-warning btn-lg fw-bold"
              onClick={handleExit}
              disabled={!attendance?.entryTime || attendance?.exitTime}
            >
              Mark Exit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Presence;
