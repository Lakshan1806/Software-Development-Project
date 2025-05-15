import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get("/auth/is-auth");

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      if (error.message === 'Account terminated') {
        navigate('/login?error=account_terminated');
      }
      return false;
    }
  }, [navigate]);

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("source") === "google") {
        await checkAuth();
        navigate("/");
      }
    };

    checkAuth();
    handleGoogleRedirect();
  }, [checkAuth, navigate]);

  // Register function
  const register = async (formData) => {
    setError(null);
    setMessage("");
    console.log("Sending registration data:", formData);
    try {
      const response = await axios.post("/auth/register", formData);

      if (response.status === 201) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setMessage(response.data.message);
      }
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  // OTP login function
  const login = async ({ otp }) => {
    try {
      const response = await axios.post("/auth/login", { otp });

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
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
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
      const response = await axios.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error("Failed to send password reset link");
    }
  };

  // Resend OTP handler
  const resendOtp = async (email) => {
    try {
      const response = await axios.post("/resend-otp", { email });
      return response.data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error.response?.data?.message || "Failed to resend OTP";
    }
  };

  const resetPassword = async (token, password) => {
    setError(null);
    try {
      const response = await axios.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage({ message: response.data.message });
    } catch (error) {
      setError("Failed to reset password");
    }
  };
  const loginWithGoogle = useCallback((intent = "login") => {
    try {
      setError(null);
      window.open(
        `http://localhost:5000/auth/google?intent=${intent}`,
        "_self"
      );
    } catch (error) {
      setError("Failed to initiate Google login");
      console.error("Google login error:", error);
    }
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const response = await axios.get("/auth/profile");
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return response.data;
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  }, []);
  

  const value = {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resendOtp,
    resetPassword,
    loginWithGoogle,
    getProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export { AuthContext, AuthProvider, useAuth };

