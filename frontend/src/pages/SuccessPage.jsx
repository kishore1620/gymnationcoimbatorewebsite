import React from "react";

const SuccessPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card bg-dark text-white text-center shadow-lg p-5">
        <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: "4rem" }}></i>
        <h2 className="text-warning">Registration Successful!</h2>
        <p className="mt-3">
          Thank you for registering. A confirmation has been sent to your email.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
