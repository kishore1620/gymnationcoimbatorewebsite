import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "../styles/Presence.css";

const MyAttendance = () => {
  const { user } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/history/${user._id}`
        );

        if (Array.isArray(res.data)) {
          setRecords(res.data);
        } else {
          setRecords([]);
          console.warn("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (timeStr) =>
    timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

  return (
    <div className="presence-container container py-5">
      <h2 className="text-center mb-4 text-warning">My Attendance</h2>
      {user && <p className="text-center text-light mb-4 fs-5">Welcome back, <strong>{user.name}</strong></p>}

      {loading && <p className="text-white text-center">Loading attendance...</p>}
      {!loading && error && <p className="text-danger text-center">{error}</p>}
      {!loading && !error && records.length === 0 && <p className="text-center text-light">No attendance records found.</p>}

      {!loading && !error && records.length > 0 && (
        <div className="attendance-history d-flex flex-column align-items-center text-light">
          {records.map((rec) => (
            <div
              key={rec._id}
              className="card bg-black text-white mb-3 shadow rounded-4"
              style={{ width: "350px" }} // fixed width to center nicely
            >
              <div className="card-body text-center">
                <h6 className="text-warning mb-1">{formatDate(rec.date)}</h6>
                <p className="mb-0">
                  Entry: <strong className="text-info">{formatTime(rec.entryTime)}</strong> | Exit:{" "}
                  <strong className="text-info">{formatTime(rec.exitTime)}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyAttendance;
