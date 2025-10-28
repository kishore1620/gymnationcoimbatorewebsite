import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";

const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/attendance/admin/all");
        if (Array.isArray(res.data)) setRecords(res.data);
        else setRecords([]);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch attendance records");
        setLoading(false);
      }
    };

    fetchAllAttendance();
  }, []);

  // Filter by user name or email
  const filteredRecords = records.filter(
    (rec) =>
      rec.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      rec.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Format helpers
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });

  const formatTime = (timeStr) =>
    timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

  return (
    <div className="container-fluid mt-4 p-3 rounded shadow bg-dark text-light">
      {/* Header */}
      <h2 className="mb-4 text-warning d-flex align-items-center">
        <FontAwesomeIcon icon={faUserCheck} className="me-2" />
        All Users Attendance
      </h2>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-dark text-light border-secondary"
          placeholder="🔍 Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading / Error / Table */}
      {loading ? (
        <div className="text-center py-3">Loading attendance records...</div>
      ) : error ? (
        <div className="text-danger text-center py-3">{error}</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-muted text-center py-3">No attendance records found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover table-bordered align-middle text-center mb-0">
            <thead className="table-warning text-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">User Name</th>
                <th scope="col">Email</th>
                <th scope="col">Date</th>
                <th scope="col">Entry Time</th>
                <th scope="col">Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec, index) => (
                <tr key={rec._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{rec.userId?.name || "Unknown"}</td>
                  <td className="text-info fw-semibold">{rec.userId?.email || "No Email"}</td>
                  <td>{formatDate(rec.date)}</td>
                  <td>{formatTime(rec.entryTime)}</td>
                  <td>{formatTime(rec.exitTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
