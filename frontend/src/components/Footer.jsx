// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="bg-black text-white mt-5 py-4">
      <div className="container">
        <hr></hr>
        <div className="row gy-4">
          <div className="col-md-3">
            <h5>Gym Nation</h5>
            <p>
              Every workout brings you closer to your strongest self. Stay committed, stay unstoppable.
            </p>
            <p>
              <strong>Mon-Fri:</strong> 7 AM - 10 PM<br />
              <strong>Sat-Sun:</strong> 7 AM - 2 PM
            </p>
          </div>

          <div className="col-md-3">
            <h5>Our Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/home" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/program" className="text-white text-decoration-none">Programs</Link></li>
              <li><Link to="/service" className="text-white text-decoration-none">Services</Link></li>
              <li><Link to="/price" className="text-white text-decoration-none">Pricing</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5>Contact Us</h5>
            <p>
              GymNation - Sathy Rd, near SNS College Tech,<br />
              Coimbatore, Tamil Nadu 641035
            </p>
            <p>+91 7904126954</p>
          </div>

          <div className="col-md-3">
            <h5>Newsletter</h5>
            <form className="d-flex mb-3">
              <input type="email" className="form-control me-2" placeholder="Email" />
              <button className="btn btn-danger" type="submit">&rarr;</button>
            </form>
            <div className="d-flex gap-3">
              <a href="https://www.instagram.com/gymnation_unisex?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==e" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaInstagram />
              </a>
              <a href="#" className="text-white fs-5">
                <FaFacebook />
              </a>
              <a href="#" className="text-white fs-5">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; 2025 GymNation. All Rights Reserved. |
            <Link to="/" className="text-white ms-1 me-1">Privacy Policy</Link>|
            <Link to="/" className="text-white ms-1">Terms & Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
