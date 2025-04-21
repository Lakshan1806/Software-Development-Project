import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="  bg-gray-800  rounded-2xl shadow-lg max-w-md mx-auto mt-44 ">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Forgot Password
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-300 mb-6 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              className="w-full py-3 px-4 bg-gradient-to-r  text-black font-bold rounded-lg  focus:ring-offset-gray-900 cursor-pointer "
              type="submit"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-300 mb-6">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link
          to={"/login"}
          className="text-sm text-green-400 hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
