/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

const OtpInput = ({ length = 4, onOtpSubmit = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits

    if (value.length > 1) return; // Prevent multiple digit input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Submit OTP when all fields are filled
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          ref={(input) => (inputRefs.current[index] = input)}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          maxLength="1"
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-orange-400 rounded-md focus:ring-2 focus:ring-orange-500 
                     transition-all duration-200 ease-in-out"
          style={{
            borderImage: "linear-gradient(to right, #FFD12E, #FF7C1D) 1",
            borderStyle: "solid",
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
