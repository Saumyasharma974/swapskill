import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin")); // converts "true" => true
  const token = localStorage.getItem("token");

  if (isAdmin && token) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
