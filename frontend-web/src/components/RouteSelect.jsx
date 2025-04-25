import Signupinitialpage from "../pages/SignupInitialPage";
import Home from "../pages/Home";
import Rent from "../pages/Rent";
import Drive from "../pages/Drive";
import Ride from "../pages/Ride";
import Help from "../pages/Help";
import Feedback from "../pages/Feedback";
import Register from "../pages/Register";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signininitialpage from "../pages/SigninInitialPage.jsx";
import PaymentPage from "../pages/PaymentPage.jsx";
import TripHistory from "../pages/TripHistory.jsx";
import EmailForm from "../pages/EmailForm";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetpasswordPage from "../pages/ResetPasswordPage.jsx";
function RouteSelect() {
  const userId = "123456"; // Replace this with actual logged-in user ID

  return (
    <div>
      <main className="h-dvh ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/help" element={<Help />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/signup" element={<Signupinitialpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signininitialpage />} />
          <Route path="/email" element={<EmailForm />} />{" "}
          <Route path="/feedback" element={<Feedback />} />
          <Route
            path="/trip-history"
            element={<TripHistory userId={userId} />}
          />{" "}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />{" "}
          <Route
            path="/reset-password/:token"
            element={<ResetpasswordPage />}
          />{" "}
        </Routes>
      </main>
    </div>
  );
}

export default RouteSelect;
