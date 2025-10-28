
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)" }}>
      <div className="card p-5 shadow-lg" style={{ width: "400px", borderRadius: "15px", background: "#1b1b1b" }}>
        <h2 className="text-center mb-4" style={{ color: "#ff5e00" }}>
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label style={{ color: "#fff", fontWeight: "500" }}>Enter your email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary mt-1"
              placeholder="Email"
              style={{ color: "#fff", borderRadius: "8px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label style={{ color: "#fff", fontWeight: "500" }}>Enter your password</label>
            <div className="input-group mt-1">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control bg-dark text-white border-secondary"
                placeholder="Password"
                style={{ color: "#fff", borderRadius: "8px 0 0 8px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn"
                style={{ background: "#ff5e00", color: "#fff", borderRadius: "0 8px 8px 0" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="btn w-100"
            style={{ background: "#ff5e00", color: "#fff", fontWeight: "500", borderRadius: "10px" }}
          >
            Login
          </button>
        </form>

        {message && (
          <p className="mt-3 text-center" style={{ color: "#ff5e00", fontWeight: "500" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;