import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// Icons
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa6";

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

  const isMobile = window.innerWidth <= 480;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword)
      return setMessage("❌ Passwords do not match");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      const userObj = {
        _id: data.userId,
        name: data.name,
        email: data.email,
      };

      loginUser(userObj);

      setMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div
      style={{
        background: "black",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "1rem" : "0",
      }}
    >
      <div
        style={{
          background: "black",
          padding: isMobile ? "1.5rem" : "2rem",
          width: isMobile ? "90%" : "400px",
          borderRadius: "15px",
          boxShadow: "0 0 20px rgba(230, 53, 17, 0.66)",
          border: "1px solid #2b2b2b",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#ff6600",
            marginBottom: "1.5rem",
            fontSize: isMobile ? "1.6rem" : "1.9rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaUserPlus /> Sign Up
        </h3>

        {message && (
          <div
            style={{
              padding: "0.7rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: 500,
              color: message.includes("✅") ? "#7dff67" : "#ff7a7a",
              background: message.includes("✅") ? "#0a5300" : "#530000",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <FaUser
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                height: "50px",
                padding: "0 15px 0 45px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0d0d0d",
                color: "#ccc",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            />
          </div>

          {/* Email */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <FaEnvelope
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                height: "50px",
                padding: "0 15px 0 45px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0d0d0d",
                color: "#ccc",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <FaLock
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                height: "50px",
                padding: "0 15px 0 45px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0d0d0d",
                color: "#ccc",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#ff6600",
                color: "#fff",
                border: "none",
                padding: isMobile ? "4px 10px" : "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                fontWeight: 500,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <FaLock
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                height: "50px",
                padding: "0 15px 0 45px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0d0d0d",
                color: "#ccc",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#ff6600",
                color: "#fff",
                border: "none",
                padding: isMobile ? "4px 10px" : "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                fontWeight: 500,
              }}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              background: "#ff6600",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: isMobile ? "1rem" : "1.05rem",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>

        <p
          style={{
            marginTop: "1rem",
            color: "#ddd",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#ff6600",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
