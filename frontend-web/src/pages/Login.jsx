import React, { useState, useContext ,useEffect} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import imgcl from "../signup_photos/signupcustomer.svg";
import imgl from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import { Link } from "react-router-dom";
import OtpInput from "../components/otp-input";
import Line1 from "../signup_photos/liner1.svg";
import useCountdown from "../components/hooks/useCountdown";
import { toast } from "react-toastify";
import GoogleLoginButton from "../components/GoogleLogin";

const Login = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    if (location.search.includes('account_terminated')) {
      setError('Your account has been terminated');
    }
  }, [location]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const {
    secondsLeft: phoneSecondsLeft,
    isActive: isPhoneActive,
    start: startPhoneTimer,
    reset: resetPhoneTimer,
  } = useCountdown(60);
  const handleResendPhoneOtp = async () => {
    if (isPhoneActive) return;

    try {
      const response = await axios.post(
        "/auth/resend-otp",
        { phone: formData.phone }
      );

      if (response.data.message.includes("sent to phone")) {
        toast.success("New OTP sent to your phone");
        startPhoneTimer();
        console.log("New Phone OTP:", response.data.otp);
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (step === 1) {
        await axios.post(
          "/auth/login",
          {
            username: formData.username,
            password: formData.password
          }
        );
        setStep(2);
      } else if (step === 2) {
        await axios.post(
          "/auth/login",
          {
            phone: formData.phone
          }
        );
        startPhoneTimer();
        setStep(3);
      } else if (step === 3) {
        const response = await login({ otp: formData.otp });
        if (response.success) {
          navigate("/");
        } else {
          toast.error(response.message || "Login failed");
        }
        resetPhoneTimer();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className=" flex flex-col items-center px-0 py-0 ">
      {step === 1 && (
        <img
          src={imgcl}
          alt="Signup Background"
          className="absolute z-0 w-full h-auto"
        />
      )}
      <div className="flex flex-col px-0.5  z-10 pt-[130px]">
        <form onSubmit={handleSubmit} className="w-[340px]">
          {step === 1 && (
            <>
              <h2 className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
                Sign in as a Customer
              </h2>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <label className=" mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="bg-white w-full p-2 border rounded border-[#FFD12E]"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label className=" mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="bg-white w-full p-2 border rounded border-[#FFD12E]"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="flex items-center mb-6">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              {error && (
                <p className="text-red-500 font-semibold mb-2">{error}</p>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="pt-[10px] pb-[10px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] cursor-pointer"
                >
                  SIGN IN
                </button>
              </div>

              <img src={imgl} alt="Divider" className="w-full h-auto" />
              <GoogleLoginButton />
              <p className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
                <Link to="/Register">Don't have an account? Sign up</Link>
              </p>
            </>
          )}
        </form>
        <form onSubmit={handleSubmit}>
          {step === 2 && (
            <>
              <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  Enter your Mobile Number
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this number
                </p>
                <img src={Line1} className="h-auto w-full" />
                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your Mobile number"
                  className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                  >
                    Continue
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
              </div>
            </>
          )}
        </form>
        <form onSubmit={handleSubmit}>
          {step === 3 && (
            <>
              <div className="flex flex-col items-center justify-center  gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  verify your Mobile Number
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this number
                </p>
                <img src={Line1} className="h-auto w-full" />
                {error && <p className="text-red-500 text-center">{error}</p>}

                <OtpInput
                  length={6}
                  onOtpSubmit={(otp) => setFormData({ ...formData, otp })}
                />

                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                  >
                    continue
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
                <button
                  onClick={handleResendPhoneOtp}
                  disabled={isPhoneActive}
                  className={`${isPhoneActive ? "text-gray-400" : "text-orange-500"}`}
                >
                  {isPhoneActive
                    ? `Resend in ${phoneSecondsLeft}s`
                    : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
