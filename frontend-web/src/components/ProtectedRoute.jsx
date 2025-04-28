import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading,user } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" />; 
  }

  return children; 
};

export default ProtectedRoute;