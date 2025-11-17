import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import axios from "axios";
import plans from "../data/plansData";

import "../styles/PurchasePage.css";


const PurchasePage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const form = useRef();

  // ✅ Find selected plan by ID
  const selectedPlan = plans.find((p) => p.id === planId);

  if (!selectedPlan) {
    return (
      <div className="container text-center text-white mt-5">
        <h3>❌ Invalid plan selected</h3>
        <button
          className="btn btn-outline-warning mt-3"
          onClick={() => navigate("/price")}
        >
          Back to Pricing
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("You must be logged in to make a purchase.");
      navigate("/login");
      return;
    }

    const userData = {
      userId: currentUser._id,
      name: formData.get("user_name"),
      email: formData.get("user_email"),
      plan: selectedPlan.title,
      price: selectedPlan.newPrice,
      date: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/api/purchases", userData);

      await emailjs.sendForm(
        "service_gymnation",
        "template_user",
        form.current,
        "rzWzqwCMhwFtzP-Us"
      );

      await emailjs.sendForm(
        "service_gymnation",
        "template_admin",
        form.current,
        "rzWzqwCMhwFtzP-Us"
      );

      navigate("/thank-you");
    } catch (err) {
      console.error("❌ Error during purchase:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Plan details */}
          <div className="card shadow-lg border-0 mb-4" style={{ backgroundColor: "#111" }}>
            <div className="card-body text-white text-center rounded">
              <h4 className="card-title fw-bold">{selectedPlan.title}</h4>
              <p className="card-text fs-5">
                <span className="fw-bold" style={{color:"orangered" }}>{selectedPlan.newPrice}</span>
              </p>
            </div>
          </div>

          {/* Purchase form */}
          <div className="card shadow-lg border-0" style={{ backgroundColor: "#111" }}>
            <div className="card-body text-white rounded">
              <h5 className="mb-4 text-center fw-bold">Enter Your Details</h5>
              <form ref={form} onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input
                    type="text"
                    name="user_name"
                    className="form-control bg-dark text-white border-warning"
                    defaultValue={JSON.parse(localStorage.getItem("user"))?.name || ""}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Email</label>
                  <input
                    type="email"
                    name="user_email"
                    className="form-control bg-dark text-white border-warning"
                    defaultValue={JSON.parse(localStorage.getItem("user"))?.email || ""}
                    required
                  />
                </div>

                {/* Hidden fields */}
                <input type="hidden" name="plan" value={selectedPlan.title} />
                <input type="hidden" name="price" value={selectedPlan.newPrice} />

                <button
                  type="submit"
                  className="btn text-black w-100 fw-bold"
                  style={{ letterSpacing: "1px" , backgroundColor:"orangered" }}
                >
                  Confirm Purchase
                </button>
              </form>
            </div>
          </div>

          {/* Back button */}
          <div className="text-center mt-3">
            <button
              className="btn text-black btn-outline-black"
              onClick={() => navigate("/price")}  style={{backgroundColor:"orangered" }}
            >
              ← Back to Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;

// kishore16072005@gmail.com