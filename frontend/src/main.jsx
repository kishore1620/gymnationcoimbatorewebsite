import React from "react";
import ReactDOM from "react-dom/client";

import "./App.css"; 

import App from "./App";
import { UserProvider } from "./context/UserContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
