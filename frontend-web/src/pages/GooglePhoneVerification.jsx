import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import OtpInput from "../components/otp-input";
import useCountdown from "../components/hooks/useCountdown";
import Line1 from "../signup_photos/liner1.svg";
import arrow from "../signup_photos/arrowvector.svg";

const GooglePhoneVerification = () => {
  const { checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const {
    secondsLeft,
    isActive,
    start: startTimer,
    reset: resetTimer,
  } = useCountdown(60);

  const handleSendOtp = async () => {
    setError("");
    try {
      const response = await axios.post("/auth/google/verify-phone",{ phoneNumber },);

      if (response.data.success) {
        toast.success("OTP sent to your phone");
        startTimer();
        setStep(2);
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    try {
      const response = await axios.post("/auth/google/verify-phone", { phoneNumber, otp },);

      if (response.data.success) {
        toast.success("Phone verification successful!");
        await checkAuth();
        navigate("/");
      } else {
        throw new Error(response.data.message || "Failed to verify OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  const handleResendOtp = async () => {
    if (isActive) return;
    setError("");
    try {
      const response = await axios.post("/auth/resend-otp",{ phone: phoneNumber },);

      if (response.data.message.includes("sent to phone")) {
        toast.success("New OTP sent to your phone");
        startTimer();
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      <div className="flex flex-col px-0.5 z-10 pt-[130px]">
        {step === 1 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
            <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
              Enter your Mobile Number
            </h1>
            <p className="font-[700] text-[20px] ">
              We will send a verification code to this number
            </p>

            <img src={Line1} className="h-auto w-full" />
            {error && <p className="text-red-500 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Enter your Mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
              required
            />
            <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
              <button
                type="button"
                onClick={handleSendOtp}
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              >
                continue
              </button>
              <img src={arrow} className="pl-1 pt-1" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
            <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
              verify your Mobile Number
            </h1>
            <p className="font-[700] text-[20px]">
              We will send a verification code to this number
            </p>
            <img src={Line1} className="h-auto w-full" />
            {error && <p className="text-red-500 text-center">{error}</p>}

            <OtpInput length={6} onOtpSubmit={(code) => setOtp(code)} />

            <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              >
                continue
              </button>
              <img src={arrow} className="pl-1 pt-1" />
            </div>
            <button
              onClick={handleResendOtp}
              disabled={isActive}
              className={`${isActive ? "text-gray-400" : "text-orange-500"}`}
            >
              {isActive
                ? `Resend in ${secondsLeft}s`
                : "Didn't receive code? Resend"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GooglePhoneVerification;