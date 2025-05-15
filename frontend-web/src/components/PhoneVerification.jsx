import React from "react";
import OtpInput from "./otp-input";
import Line1 from "../signup_photos/liner1.svg";
import arrow from "../signup_photos/arrowvector.svg";

const PhoneVerification = ({
  title = "verify your Mobile Number",
  description = "We will send a verification code to this number",
  onContinue,
  onResend,
  isActive,
  secondsLeft,
  error,
  initialPhoneNumber,
  onPhoneNumberChange,
  showPhoneInput = false,
  otpLength = 6,
  onOtpSubmit,
  continueButtonText = "continue",
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[25px] w-auto ">
      <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
        {title}
      </h1>
      <p className="font-[700] text-[20px]">{description}</p>
      <img src={Line1} className="h-auto w-full" />
      {error && <p className="text-red-500 text-center">{error}</p>}

      {showPhoneInput && (
        <input
          type="tel"
          placeholder="Enter your Mobile number"
          value={initialPhoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
          required
        />
      )}

      {!showPhoneInput && (
        <OtpInput length={otpLength} onOtpSubmit={onOtpSubmit} />
      )}

      <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
        <button
          type="button"
          onClick={onContinue}
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
        >
          {continueButtonText}
        </button>
        <img src={arrow} className="pl-1 pt-1" />
      </div>

      {onResend && (
        <button
          onClick={onResend}
          disabled={isActive}
          className={`${isActive ? "text-gray-400" : "text-orange-500"}`}
        >
          {isActive
            ? `Resend in ${secondsLeft}s`
            : "Didn't receive code? Resend"}
        </button>
      )}
    </div>
  );
};

export default PhoneVerification;
