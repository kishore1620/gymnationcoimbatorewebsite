import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { Table, Form, Spinner, Alert, Row, Col, Button } from "react-bootstrap";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading)
    return (
      <div className="text-center py-5 text-light">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading users...</p>
      </div>
    );

  if (error)
    return <Alert variant="danger" className="text-center">{error}</Alert>;

  return (
    <div className="container-fluid mt-4">
      <div className="bg-dark text-light p-4 rounded shadow-lg">
        {/* Header */}
        <h2 className="mb-3 text-warning d-flex align-items-center">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Registered Users
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

        {filteredUsers.length === 0 ? (
          <Alert variant="secondary" className="text-center">No users found.</Alert>
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Signup Date</th>
                    <th>Signup Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => {
                    const dateObj = new Date(user.createdAt);
                    const formattedDate = dateObj.toLocaleDateString();
                    const formattedTime = dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={user._id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{user.name || "N/A"}</td>
                        <td className="text-info fw-semibold">{user.email}</td>
                        <td>{formattedDate}</td>
                        <td>{formattedTime}</td>
                      </tr>
                    );
                  })}
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

export default ManageUsers;
