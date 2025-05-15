import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useCountdown from "./useCountdown";

const useOtpVerification = (initialValue = "") => {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);
  const [email, setEmail] = useState(initialValue);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const {
    secondsLeft,
    isActive,
    start: startTimer,
    reset: resetTimer,
  } = useCountdown(60);

  const sendOtp = async (endpoint, payload = {}) => {
    setError("");
    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success || response.data.message?.includes("sent")) {
        const target = payload.phone ? "phone" : "email";
        toast.success(`OTP sent to your ${target}`);
        startTimer();
        setStep(2);
        return { success: true, data: response.data };
      }
      throw new Error(response.data.message || "Failed to send OTP");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to send OTP";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const verifyOtp = async (endpoint, payload = {}, onSuccess) => {
    setError("");
    try {
      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        toast.success("Verification successful!");
        resetTimer();
        if (onSuccess) onSuccess();
        return { success: true, data: response.data };
      }
      throw new Error(response.data.message || "Failed to verify OTP");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to verify OTP";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const resendOtp = async (endpoint, payload = {}) => {
    if (isActive) return { success: false, error: "Wait before resending" };
    setError("");
    try {
      const response = await axios.post(endpoint, payload);

      if (response.data.message?.includes("sent")) {
        const target = payload.phone ? "phone" : "email";
        toast.success(`New OTP sent to your ${target}`);
        startTimer();
        return { success: true, data: response.data };
      }
      throw new Error(response.data.message || "Failed to resend OTP");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to resend OTP";
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    phoneError: error,
    phoneStep: step,
    phoneSecondsLeft: secondsLeft,
    isPhoneActive: isActive,
    sendPhoneOtp: (endpoint) => sendOtp(endpoint, { phoneNumber }),
    verifyPhoneOtp: (endpoint, onSuccess) =>
      verifyOtp(endpoint, { phoneNumber, otp }, onSuccess),
    resendPhoneOtp: (endpoint) => resendOtp(endpoint, { phone: phoneNumber }),

    email,
    setEmail,
    emailOtp: otp,
    setEmailOtp: setOtp,
    emailError: error,
    emailStep: step,
    emailSecondsLeft: secondsLeft,
    isEmailActive: isActive,
    sendEmailOtp: (endpoint) => sendOtp(endpoint, { email }),
    verifyEmailOtp: (endpoint, onSuccess) =>
      verifyOtp(endpoint, { email, otp }, onSuccess),
    resendEmailOtp: (endpoint) => resendOtp(endpoint, { email }),

    otp,
    setOtp,
    error,
    setError,
    step,
    setStep,
    secondsLeft,
    isActive,
    sendOtp,
    verifyOtp,
    resendOtp,
  };
};

export default useOtpVerification;
