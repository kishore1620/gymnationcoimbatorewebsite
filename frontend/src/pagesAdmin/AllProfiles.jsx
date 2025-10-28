import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Table, Form, Spinner, Alert, Row, Col, Button } from "react-bootstrap";

const AllProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile"); // ✅ fetch all profiles
        setProfiles(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on name or email
  const filteredProfiles = profiles.filter(
    (p) =>
      (p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProfiles = filteredProfiles.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading)
    return (
      <div className="text-center py-5 text-light">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading profiles...</p>
      </div>
    );

  if (error)
    return <Alert variant="danger" className="text-center">{error}</Alert>;

  return (
    <div className="container-fluid mt-4">
      <div className="bg-dark text-light p-4 rounded shadow-lg">
        {/* Header */}
        <h2 className="mb-3 text-warning d-flex align-items-center">
          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
          User Profiles
        </h2>

        {/* Search */}
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-black text-light border-secondary"
          />
        </Form>

        {filteredProfiles.length === 0 ? (
          <Alert variant="secondary" className="text-center">No profiles found.</Alert>
        ) : (
          <>
            <div className="table-responsive">
              <Table
                striped
                bordered
                hover
                responsive
                variant="dark"
                className="rounded shadow-sm text-center align-middle"
              >
                <thead className="table-warning text-dark">
                  <tr>
                    <th>#</th>
                    <th>Profile Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>District</th>
                    <th>Extra Info</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProfiles.map((p, index) => (
                    <tr key={p._id}>
                      <td>{startIndex + index + 1}</td>
                      <td>
                        <img
                          src={
                            p.profilePicture
                              ? `http://localhost:5000/${p.profilePicture}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={p.name || "Profile"}
                          className="rounded-circle"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{p.name || "N/A"}</td>
                      <td className="text-info fw-semibold">{p.email || "N/A"}</td>
                      <td>{p.phone || "N/A"}</td>
                      <td>{p.country || "N/A"}</td>
                      <td>{p.state || "N/A"}</td>
                      <td>{p.district || "N/A"}</td>
                      <td>{p.extraInfo || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            <Row className="mt-3 align-items-center">
              <Col xs="auto" className="mb-2 mb-md-0">
                <Button variant="outline-warning" disabled={currentPage === 1} onClick={handlePrev}>
                  ← Previous
                </Button>
              </Col>
              <Col className="text-center text-light fw-semibold">
                Page {currentPage} of {totalPages}
              </Col>
              <Col xs="auto">
                <Button variant="outline-warning" disabled={currentPage === totalPages} onClick={handleNext}>
                  Next →
                </Button>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default AllProfiles;
