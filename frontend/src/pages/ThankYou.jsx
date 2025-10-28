import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { FaDumbbell } from "react-icons/fa"; 
import "../styles/ThankYou.css";

const ThankYou = () => {
  const navigate = useNavigate();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  // ✅ Resize confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    // stop confetti after 5s
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="thankyou-container ">
      {/* 🎊 Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={250}
          gravity={0.2}
        />
      )}

      {/* ✅ Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="thankyou-card"
      >
        {/* 💪 Gym Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          className="thankyou-icon"
        >
          <FaDumbbell />
        </motion.div>

        {/* 🎊 Thank You Text */}
        <h2 className="thankyou-title">Thank You for Joining Us!</h2>
        <p className="thankyou-subtext">
          Your gym membership has been successfully confirmed 💪🔥
        </p>

        {/* 🎊 Buttons */}
        <div className="thankyou-buttons">
          <button
            className="btn-outline"
            onClick={() => navigate("/profile")}
          >
            View Profile
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/price")}
          >
            Back to Pricing
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
