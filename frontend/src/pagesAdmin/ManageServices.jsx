// src/pagesAdmin/ManageServices.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/services", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="container-fluid p-4 text-light">
      <h2 className="mb-4" style={{ color: "#ff5e00" }}>
        Manage Services
      </h2>

      {loading ? (
        <div className="text-center">Loading services...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : services.length === 0 ? (
        <div>No services found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead className="table-secondary text-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Service Name</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>₹{service.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
