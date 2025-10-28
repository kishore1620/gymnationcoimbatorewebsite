import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Button, Form } from "react-bootstrap";

const ManagePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/workouts");
        setPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // 🔍 Filter programs by user name or email
  const filteredPrograms = programs.filter((p) => {
    const name = p.userId?.name || "";
    const email = p.userId?.email || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrograms = filteredPrograms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="container mt-4 text-light">
      <h2 className="mb-3 text-warning">Manage Programs</h2>
      <p className="text-muted">All user workouts (view only)</p>

      {/* Search Input */}
      <Form.Control
        type="text"
        placeholder="🔍 Search by user name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset to first page on search
        }}
        className="mb-3 bg-black text-white border-secondary"
      />

      {loading ? (
        <Spinner animation="border" variant="warning" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredPrograms.length === 0 ? (
        <Alert variant="secondary">No programs found.</Alert>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            variant="dark"
            className="rounded shadow"
          >
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Day</th>
                <th>Type</th>
                <th>Workouts</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentPrograms.map((p) => (
                <tr key={p._id}>
                  <td>{p.userId?.name || "N/A"}</td>
                  <td>{p.userId?.email || "N/A"}</td>
                  <td>{p.day}</td>
                  <td>{p.type}</td>
                  <td>
                    {p.workouts?.map((w) => (
                      <div key={w._id}>
                        <strong>{w.name}</strong> — {w.sets}x{w.reps} @ {w.weight}kg ({w.calories} cal)
                      </div>
                    ))}
                  </td>
                  <td>
                    {p.workouts?.length > 0
                      ? formatDateTime(p.workouts[p.workouts.length - 1]?.createdAt)
                      : formatDateTime(p.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-warning"
              disabled={currentPage === 1}
              onClick={handlePrev}
            >
              ← Previous
            </Button>
            <span className="text-light">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-warning"
              disabled={currentPage === totalPages}
              onClick={handleNext}
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagePrograms;
