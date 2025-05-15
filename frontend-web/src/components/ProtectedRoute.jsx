import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading,user,error } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }
  if (error && error.includes('terminated')) {
    return <Navigate to="/login?error=account_terminated" replace />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" />; 
  }

  return children; 
};

export default ProtectedRoute;