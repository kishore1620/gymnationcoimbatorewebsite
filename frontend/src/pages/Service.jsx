// src/pages/Service.jsx
import React, { useEffect } from 'react';
import '../styles/service.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

function Service() {

  // 🔥 Smooth Fade-Up Animation (same as Home Page)
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

      {/* Services Section */}
      <section className="py-5 text-center fade-up delay-1">
        <div className="container">
          <h2 className="mb-4 fw-bold fade-up delay-1">Our <span>Services</span></h2>

          <div className="row g-4">
            {[
              { title: 'Physical Fitness', img: '../src/img/chest day.jpg' },
              { title: 'Weight Gain', img: '../src/img/shoulder-day.jpg' },
              { title: 'Strength Training', img: '../src/img/strength-trianing.jpg' },
              { title: 'Core Training', img: '../src/img/Leg-Day-Workout.webp' },
              { title: 'Weight Lifting', img: '../src/img/weight-lifting.jpg' },
              { title: 'Muscle Building', img: '../src/img/arm day.webp' },
            ].map((service, idx) => (
              <div className="col-md-4 fade-up delay-2" key={idx}>
                <div className="service-card">
                  <img src={service.img} alt={service.title} />
                  <h5>{service.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <div className="quote-section text-danger fade-up delay-2">
        <h1>"Results happen over time, not overnight. Stay consistent..!"</h1>
      </div>

      {/* Workout Schedule */}
      <div className="container text-center fade-up delay-3">
        <h1 className="main-heading">6 DAYS WORKOUT SCHEDULE</h1>

        <div className="row justify-content-center mt-4">
          <div className="col-md-10">
            <div className="row row-cols-1 row-cols-md-2 g-4 text-start">
              {[
                {
                  day: 'DAY 1: CHEST',
                  icon: '../src/img/chest.png',
                  exercises: [
                    'Bench Press – 4×6',
                    'Incline Dumbbell Press – 4×8',
                    'Chest Fly (Machine/Cable) – 3×12',
                    'Push-Ups – 3×15',
                    'Dips (Chest Focus) – 3×12',
                    'Decline Press – 3×10'
                  ]
                },
                {
                  day: 'DAY 2: BACK',
                  icon: '../src/img/back.png',
                  exercises: [
                    'Deadlift – 4×6',
                    'Pull-Ups/Chin-Ups – 4×Max',
                    'Barbell Row – 4×8',
                    'Lat Pulldown – 4×10',
                    'Seated Cable Row – 3×12',
                    'Face Pulls – 3×12'
                  ]
                },
                {
                  day: 'DAY 3: SHOULDERS & ABS',
                  icon: '../src/img/shoulder.png',
                  exercises: [
                    'Overhead Press – 4×8',
                    'Arnold Press – 3×10',
                    'Lateral Raises – 3×15',
                    'Front Raises – 3×12',
                    'Shrugs – 3×15',
                    'Plank – 3×60 sec',
                    'Hanging Leg Raises – 3×12'
                  ]
                },
                {
                  day: 'DAY 4: BICEPS & FOREARMS',
                  icon: '../src/img/biceps.png',
                  exercises: [
                    'Barbell Curl – 4×10',
                    'Dumbbell Alternating Curl – 3×12',
                    'Hammer Curl – 3×12',
                    'Preacher Curl – 3×10',
                    'Concentration Curl – 3×12',
                    'Wrist Curl – 3×15',
                    'Reverse Curl – 3×12'
                  ]
                },
                {
                  day: 'DAY 5: TRICEPS & ABS',
                  icon: '../src/img/triceps.png',
                  exercises: [
                    'Close Grip Bench Press – 4×8',
                    'Tricep Dips – 3×12',
                    'Overhead Dumbbell Extension – 3×12',
                    'Skull Crushers – 3×10',
                    'Cable Pushdowns – 3×12',
                    'Russian Twists – 3×20',
                    'Leg Raises – 3×15'
                  ]
                },
                {
                  day: 'DAY 6: LEGS',
                  icon: '../src/img/leg.png',
                  exercises: [
                    'Barbell Squat – 4×8',
                    'Leg Press – 4×10',
                    'Walking Lunges – 3×12',
                    'Romanian Deadlift – 3×8',
                    'Leg Extensions – 3×15',
                    'Hamstring Curls – 3×12',
                    'Standing Calf Raises – 4×15'
                  ]
                }
              ].map((dayData, idx) => (
                <div className="col fade-up delay-3" key={idx}>
                  <div className="day-title d-flex align-items-center">
                    <img src={dayData.icon} alt="icon" className="day-icon me-2" />
                    {dayData.day}
                  </div>
                  <div className="exercise">
                    {dayData.exercises.map((e, i) => <div key={i}>{e}</div>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="rest-day mt-5 fade-up delay-3">DAY 7: REST AND RECOVER</div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Service;
