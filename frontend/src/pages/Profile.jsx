import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faCity,
  faBuilding,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    district: "",
    extraInfo: "",
  });

  const [savedProfile, setSavedProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?._id) {
      setUserId(storedUser._id);
      setUsername(storedUser.name);

      axios
        .get(`http://localhost:5000/api/profile/${storedUser._id}`)
        .then((res) => {
          if (res.data) {
            setFormData(res.data);
            setSavedProfile(res.data);
          }
        })
        .catch((err) => console.error("Profile not found yet:", err));
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    if (!formData.name || !formData.email) {
      alert("❌ Name and Email are required!");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });
    data.append("userId", userId);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/profile/save",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSavedProfile(res.data);
      setLoading(false);
      setEditMode(false);
      alert(
        savedProfile
          ? "✅ Profile updated successfully!"
          : "✅ Profile saved successfully!"
      );
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("❌ Error saving profile. Please check your input.");
    }
  };

  return (
    <div className="container profile-page">
      <h2 className="profile-title">
        Welcome to Gym Nation, {username || "User"}!
      </h2>
      <h4 className="profile-subtitle">Manage Your Profile</h4>

      <div className="row g-4 ">
        {/* Profile Form */}
        {editMode && (
          <div className="col-lg-6 ">
            <div className="card profile-card">
              <div className="card-body p-4 bg-black">
                <h4 className="section-heading">
                  {savedProfile ? "Update Profile" : "Create Profile"}
                </h4>
                <form onSubmit={handleSubmit} className="row g-3">
                  {/* Profile Picture */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faUser} className="me-2 text-warning" /> Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="profilePicture"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Name */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faUser} className="me-2 text-warning" /> Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2 text-warning" /> Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faPhone} className="me-2 text-warning" /> Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-warning" /> Address
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Country */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faGlobe} className="me-2 text-warning" /> Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>

                  {/* State */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faCity} className="me-2 text-warning" /> State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  {/* District */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faBuilding} className="me-2 text-warning" /> District
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Extra Info */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-info">
                      <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-warning" /> Extra Info
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="extraInfo"
                      value={formData.extraInfo}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 d-grid">
                    <button
                      type="submit"
                      className="btn btn-warning btn-lg text-dark fw-semibold"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : savedProfile
                        ? "Update Profile"
                        : "Save Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Profile Preview */}
        <div className={editMode ? "col-lg-6" : "col-lg-12"}>
          <div className="card profile-card text-center">
            <div className="card-body p-4 bg-black">
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={
                    savedProfile?.profilePicture
                      ? `http://localhost:5000/${savedProfile.profilePicture}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="rounded-circle profile-pic"
                />
              </div>

              {/* Name stays centered */}
              <h4 className="profile-name">{savedProfile?.name || "No name yet"}</h4>

              {/* Info rows */}
              <div className="profile-info text-start mx-auto mt-3">
                <p><FontAwesomeIcon icon={faEnvelope} /> <span>{savedProfile?.email || "Not set"}</span></p>
                <p><FontAwesomeIcon icon={faPhone} /> <span>{savedProfile?.phone || "Not set"}</span></p>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <span>{savedProfile?.address || "Not set"}</span></p>
                <p><FontAwesomeIcon icon={faGlobe} /> <span>{savedProfile?.country || "Not set"}</span></p>
                <p><FontAwesomeIcon icon={faCity} /> <span>{savedProfile?.state || "Not set"}</span></p>
                <p><FontAwesomeIcon icon={faBuilding} /> <span>{savedProfile?.district || "Not set"}</span></p>
                <p><FontAwesomeIcon icon={faInfoCircle} /> <span>{savedProfile?.extraInfo || "Not set"}</span></p>
              </div>

              {!editMode && (
                <button
                  className="btn btn-outline-warning btn-sm mt-3"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
