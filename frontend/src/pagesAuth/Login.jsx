import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Login.css"; // <-- new CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const userObj = { _id: data.userId, name: data.name, email: data.email };
      loginUser(userObj);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h3 className="login-title">Login</h3>

        {message && (
          <div className={`login-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span className="login-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
