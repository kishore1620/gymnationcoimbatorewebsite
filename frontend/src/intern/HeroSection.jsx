import React from "react";
import "../styles/HeroSection.css";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import profileImg from "../img/profile1.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Left Side: Text */}
        <div className="hero-text">
          <h2 className="hero-subtitle">Transform Your Life</h2>
          <h1 className="hero-title">
            <span className="typewriter-text">
              <Typewriter
                words={[
                  "Stay Fit. Stay Strong.",
                  "Train Smart. Live Better.",
                  "Your Health, Your Power.",
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p className="hero-desc mb-5">
            Unlock your full potential with our expert guidance, 
            proven workouts, and a supportive fitness community.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">
              Get Started →
            </Link>
            <Link to="/signup" className="btn-outline">
              Join Now
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hero-image">
          <img src={profileImg} alt="Fitness Motivation" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
