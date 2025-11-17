import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// Font Awesome Icons
import { FaRightToBracket, FaEnvelope, FaLock } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 🔥 Detect screen width for responsive UI
  const isMobile = window.innerWidth <= 480;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const userObj = {
        _id: data.userId,
        name: data.name,
        email: data.email,
      };

      loginUser(userObj);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
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
        padding: isMobile ? "1rem" : "0", // 🔥 spacing on mobile
      }}
    >
      <div
        style={{
          background: "#000000ff",
          padding: isMobile ? "1.5rem" : "2rem", // 🔥 smaller padding on mobile
          width: isMobile ? "90%" : "400px",   // 🔥 responsive width
          borderRadius: "15px",
          boxShadow: "0 0 20px rgba(230, 53, 17, 0.66)",
          border: "1px solid #2b2b2b",
          textAlign: "center",
        }}
      >
        {/* Login Title */}
        <h2
          style={{
            color: "#ff6600",
            marginBottom: isMobile ? "1rem" : "1.5rem",
            fontSize: isMobile ? "1.6rem" : "1.9rem", // 🔥 responsive title
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaRightToBracket /> Login
        </h2>

        {message && (
          <p
            style={{
              padding: "0.7rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: "500",
              background:
                message.includes("✅") ? "#0a5300" : "#530000",
              color: message.includes("✅") ? "#7dff67" : "#ff7a7a",
              fontSize: isMobile ? "0.9rem" : "1rem", // 🔥 responsive message
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <FaEnvelope
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#888",
                fontSize: isMobile ? "15px" : "16px", // 🔥 small screens adjust
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
                fontSize: isMobile ? "0.9rem" : "1rem", // 🔥 responsive input
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <FaLock
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#888",
                fontSize: isMobile ? "15px" : "16px",
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
                padding: isMobile ? "4px 10px" : "6px 12px", // 🔥 mobile-friendly
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                fontWeight: "500",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              background: "#ff6600",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: isMobile ? "1rem" : "1.05rem",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: "1rem",
            color: "#ddd",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#ff6600",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
