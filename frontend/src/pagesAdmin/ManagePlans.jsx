import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const ManagePlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/plans");
        setPlans(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Filter plans by title
  const filteredPlans = plans.filter((plan) =>
    plan.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="container-fluid mt-4">
      <div className="bg-dark text-light p-4 rounded shadow-lg">
        <h2 className="mb-2 text-warning">Manage Plans</h2>
        <p className="text-muted mb-3">All available subscription plans</p>

        {/* Search Input */}
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 Search by plan title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-black text-light border-secondary"
          />
        </Form>

        {/* Loading / Error / Table */}
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredPlans.length === 0 ? (
          <Alert variant="secondary">No plans found.</Alert>
        ) : (
          <>
            <div className="table-responsive">
              <Table striped bordered hover variant="dark" className="rounded shadow-sm text-center">
                <thead className="table-warning text-dark">
                  <tr>
                    <th>#</th>
                    <th>Plan Title</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Discount Price</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlans.map((plan, index) => (
                    <tr key={plan._id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{plan.title}</td>
                      <td>{plan.duration}</td>
                      <td>{plan.price}</td>
                      <td className="text-warning">{plan.newPrice || "N/A"}</td>
                      <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <Row className="mt-3 align-items-center">
              <Col xs="auto" className="mb-2 mb-md-0">
                <Button variant="outline-warning" disabled={currentPage === 1} onClick={handlePrev}>
                  ← Previous
                </Button>
              </Col>
              <Col className="text-center text-light">
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

export default ManagePlan;
