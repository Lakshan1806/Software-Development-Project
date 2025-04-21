import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get("/auth/is-auth");

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } 
        
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const token = document.cookie.includes('token=');
    if (token) checkAuth();
  }, []);

  // Register function
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/register", formData);

      if (response.status === 201) {

        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate("/login");
      }

      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } 
  };

  // OTP login function
  const login = async ({ otp }) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/login", { otp });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
        details: error.response?.data?.details || null,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error("Failed to send password reset link");
    }
  };

  // Resend OTP handler
  const resendOtp = async (email) => {
    try {
      const response = await API.post("/resend-otp", { email });
      return response.data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error.response?.data?.message || "Failed to resend OTP";
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage({ message: response.data.message, isLoading: false });
    } catch (error) {
      setError("Failed to reset password");
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resendOtp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
