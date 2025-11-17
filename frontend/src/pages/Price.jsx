import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import plans from "../data/plansData";
import "../styles/Pricing.css";

const Price = () => {
  const navigate = useNavigate();

  // 🔥 Scroll Animation (Fade-Up)
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
    <div className="pricing-page fade-up delay-1">

      <section className="pricing-section text-white">
        
        <p className="text-center fs-4 fade-up delay-1">
          <strong>Timings:</strong> Monday - Saturday | 5 AM – 11 AM & 4 PM – 10 PM
        </p>

        <h3 className="fade-up delay-2">Pricing</h3>
        <h2 className="fade-up delay-2">
          OUR <span style={{ color: "white" }}>SPECIAL PLAN</span>
        </h2>

        <div className="container fade-up delay-3">
          <div className="row g-4 justify-content-center">

            {plans.map((plan, index) => (
              <div className="col-md-4 fade-up delay-3" key={plan.id}>
                <div className={`pricing-card p-4 ${plan.highlight ? "highlight" : ""}`}>
                  
                  <div className="mb-3">
                    <i className={`fas ${plan.icon} fa-3x`}></i>
                  </div>

                  <h5 className="fw-bold">{plan.title}</h5>

                  <div className="pricing-price">
                    {plan.oldPrice && <s>{plan.oldPrice}</s>} {plan.newPrice}
                  </div>

                  <ul className="list-unstyled pricing-features text-start">
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <i className={`fas fa-check-circle ${feature.inactive ? "text-muted" : ""}`}></i>{" "}
                        {feature.text}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => navigate(`/purchase/${plan.id}`)}
                  >
                    Purchase Now →
                  </button>

                </div>
              </div>

            ))}

          </div>
        </div>
      </section>

    </div>
  );
};

export default Price;
