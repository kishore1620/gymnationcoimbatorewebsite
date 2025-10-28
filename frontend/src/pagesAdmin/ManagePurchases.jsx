import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Table, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/purchases");
        setPurchases(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Error fetching purchases:", err);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/purchases/${id}`);
      setPurchases((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Error deleting purchase:", err);
    }
  };

  // Filter purchases
  const filteredPurchases = purchases.filter(
    (p) =>
      (p.userId?.name || p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.userId?.email || p.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.plan || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading)
    return (
      <div className="text-center py-5 text-light">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading purchases...</p>
      </div>
    );

  return (
    <div className="container-fluid mt-4">
      <div className="bg-dark text-light p-4 rounded shadow-lg">
        {/* Header */}
        <h2 className="mb-3 text-warning d-flex align-items-center">
          <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
          Manage Purchases
        </h2>

        {/* Search */}
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 Search by user name, email, or plan"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-black text-light border-secondary"
          />
        </Form>

        {filteredPurchases.length === 0 ? (
          <Alert variant="secondary" className="text-center">
            No purchases found.
          </Alert>
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
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPurchases.map((p, index) => (
                    <tr key={p._id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{p.userId?.name || p.name}</td>
                      <td>{p.userId?.email || p.email}</td>
                      <td>
                        <span className="badge bg-info text-dark">{p.plan}</span>
                      </td>
                      <td className="text-success fw-bold">₹{p.price}</td>
                      <td>{new Date(p.date).toLocaleDateString()}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                      </td>
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
                <Button
                  variant="outline-warning"
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
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

export default ManagePurchases;
