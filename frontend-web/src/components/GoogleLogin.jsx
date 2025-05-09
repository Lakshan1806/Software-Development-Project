import React from "react";
import imgg from "../signup_photos/googlelogo.svg";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton({ intent = "login" }) {
  const { loginWithGoogle } = useAuth();

  const handleClick = () => {
    try {
      loginWithGoogle(intent);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white w-full p-2 border rounded border-[#FFD12E] text-center mt-3 cursor-pointer flex items-center justify-center"
    >
      <>
        <img src={imgg} alt="Google" className="inline-block mr-2 h-5 w-5" />
        {intent === "signup" ? "Sign up with Google" : "Sign in with Google"}
      </>
    </button>
  );
}
