import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/home.css';
import profile1 from '../img/profile1.jpg';
import profile2 from '../img/profile2.jpg';
import profileImg from '../img/profile2.jpg';

function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section fade-up ">
        <div className="hero-overlay bg-black"></div>
        <div className="container hero-content bg">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start fade-up delay-1">
              <h1>Build<br />Your Body</h1>
              <p>
                Push your limits with GymNation’s elite fitness programs. Transform your life with top-tier trainers and facilities.
              </p>
              <Link to="/contact">
                <button className="btn-contact">
                  Contact Us <i className="fas fa-arrow-right ms-1"></i>
                </button>
              </Link>
            </div>
            <div className="col-lg-6 text-center hero-image fade-up delay-2" style={{ marginTop: "50px" }}>
              <img src={profileImg} alt="Fitness Motivation" />
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="coaches-section container py-5 fade-up delay-1">
        <h2 className="section-title2 text-center">TEAM OF EXPERT COACHES</h2>
        <p className="section-subtitle text-center mb-4">
          Meet our certified experts in strength, crossfit, and body transformation.
        </p>
        <div id="coachCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {/* First Slide */}
            <div className="carousel-item active">
              <div className="coach-card">
                <img src={profile1} alt="Coach 1" />
                <div className="coach-role">Crossfit Coach</div>
                <div className="coach-name">Kanish</div>
              </div>
            </div>

            {/* Second Slide */}
            <div className="carousel-item">
              <div className="coach-card">
                <img src={profile2} alt="Coach 2" />
                <div className="coach-role">Bodybuilding Coach</div>
                <div className="coach-name">Kanish</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#coachCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#coachCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

      </section>

      {/* Advantages Section */}
      <section className="advantages-section container py-5 fade-up delay-1">
        <h2 className="text-center section-title mb-5">OUR ADVANTAGES</h2>
        <div className="row">
          <div className="col-md-6 advantage-box fade-up delay-2">
            <h5 className="advantage-title"><i className="fas fa-user-check me-2"></i>Qualified Trainers</h5>
            <p className="advantage-desc">Certified trainers to guide and motivate every step of your journey.</p>
            <h5 className="advantage-title">Multiple Classes</h5>
            <p className="advantage-desc">Zumba, Yoga, Strength Training, Aerobics, and more.</p>
            <h5 className="advantage-title">Men & Women Changing Rooms</h5>
            <p className="advantage-desc">Clean, secure changing rooms with all amenities.</p>
            <h5 className="advantage-title">Towels and Lockers</h5>
            <p className="advantage-desc">Comfortable locker access and fresh towels for all members.</p>
          </div>

          <div className="col-md-6 advantage-box fade-up delay-3">
            <h5 className="advantage-title">Individual Training</h5>
            <p className="advantage-desc">Custom training sessions tailored to your goals and level.</p>
            <h5 className="advantage-title">Hightech Gym</h5>
            <p className="advantage-desc">Smart equipment and tracking devices for better performance.</p>
            <h5 className="advantage-title">Complimentary Drinks</h5>
            <p className="advantage-desc">Free filtered water and energy drinks to keep you hydrated.</p>
            <h5 className="advantage-title">Free Wi-Fi Zone</h5>
            <p className="advantage-desc">Stream, browse or work out with music – all without using your data.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
