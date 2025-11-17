import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    Promise.all([
      emailjs.sendForm(
        "service_kishore",
        "template_uh332vq",
        form.current,
        "M7356cdugTHrXsBek"
      ),
      emailjs.sendForm(
        "service_kishore",
        "template_5yykd3b",
        form.current,
        "M7356cdugTHrXsBek"
      ),
    ])
      .then(() => {
        alert("Form submitted! Check your email.");
        e.target.reset();
      })
      .catch(() => alert("Failed to send form. Please try again."))
      .finally(() => setSending(false));
  };

  return (
    <section className="bg-black text-light py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Info Column */}
          <div className="col-lg-6 mb-4">
            <h1 className="text-warning">Get in Touch</h1>
            <p>
              Have questions, feedback, or need help? Fill out the form or email us at{" "}
              <a href="mailto:kishoreragul0@gmail.com" className="text-warning">
                kishoreragul0@gmail.com
              </a>
            </p>
            <p className="text-info">
              We usually reply within 24 hours. Urgent messages are prioritized.
            </p>

            <h4 className="mt-4">Follow Us</h4>
            <div className="d-flex gap-3 fs-4">
              <a
                href="https://www.instagram.com/gymnation_unisex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="mailto:kishoreragul0@gmail.com"
                className="text-light"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="col-lg-6">
            <form ref={form} onSubmit={sendEmail} className="p-4 bg-black rounded">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" id="firstName" name="firstName" required className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" id="lastName" name="lastName" required className="form-control" />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input type="email" id="email" name="email" required className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="contactNo" className="form-label">
                  Contact No:
                </label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  pattern="[0-9]{10}"
                  title="Enter a valid 10-digit phone number"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea id="message" name="message" rows="5" required className="form-control"></textarea>
              </div>

              <button type="submit" className="btn btn-warning w-100" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Full-Width Google Maps */}
      <div className="mt-5">
        <iframe
          title="GymNation Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.184993328332!2d77.01892677480981!3d11.099586389069506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f970c9a21425%3A0xab3ec22a1e9494ea!2sGYM%20nation!5e0!3m2!1sen!2sin!4v1757871909568!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}

