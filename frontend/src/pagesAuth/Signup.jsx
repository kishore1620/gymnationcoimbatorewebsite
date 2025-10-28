import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Signup.css"; // <-- linked CSS file

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setMessage("❌ Passwords do not match");

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      const userObj = { _id: data.userId, name: data.name, email: data.email };
      loginUser(userObj);

      // Save in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);

      setMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h3 className="signup-title">Sign Up</h3>

        {message && (
          <div className={`signup-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />

          {/* Password field */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* Confirm Password field */}
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-input"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?/{" "}
          <span className="signup-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
