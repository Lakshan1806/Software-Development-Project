import express from "express";
import feedbackController from "../controllers/rent/feedbackController.js";
import rentalController from "../controllers/rent/rentalController.js";
import getAvailableCars from "../controllers/caroptionsController.js";
import userController from "../controllers/user/userController.js";
import userAuth from "../middlewares/userAuth.js";
import passport from "passport";
import generateJwtToken from "../utils/generateJWTToken.js";
import dotenv from "dotenv";
import sendOtp from "../utils/sendOtp.js";
import validateOtp from "../utils/validateOtp.js";
import otpModel from "../models/otpModels.js";
import userUpload from "../middlewares/userMulter.js";

dotenv.config();

const userRoutes = express.Router();
userRoutes.post("/register", userController.auth.register);
userRoutes.post("/login", userController.auth.login);
userRoutes.post("/logout", userController.auth.logout);
userRoutes.get("/is-auth", userAuth, userController.auth.isAuthenticated);
userRoutes.post("/resend-otp", userController.auth.resendOTP);
userRoutes.post("/google/verify-phone", userController.auth.verifyGooglePhone);
userRoutes.post("/forgot-password", userController.password.forgotPassword);
userRoutes.post(
  "/reset-password/:token",
  userController.password.resetPassword
);
userRoutes.put(
  "/profile/password",
  userAuth,
  userController.password.changePassword
);
userRoutes.get("/profile", userAuth, userController.profile.getUserProfile);
userRoutes.post(
  "/updateprofile",
  userAuth,
  userUpload.single("photo"),
  userController.profile.updateProfile
);
userRoutes.delete(
  "/delete-account",
  userAuth,
  userController.profile.deleteAccount
);

userRoutes.get(
  "/google",
  (req, res, next) => {
    req.session.googleAuthIntent = req.query.intent || "login";
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

userRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (req.user.isTerminated) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=account_terminated`
        );
      }
      if (user.isAccountVerified) {
        const token = generateJwtToken(user._id, user.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        return res.redirect(`${process.env.FRONTEND_URL}`);
      }

      req.session.tempUser = {
        googleId: user.googleId,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        authMethod: "google",
      };

      req.session.save();

      res.redirect(
        `${process.env.FRONTEND_URL}/verify-phone?authMethod=google`
      );
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
      );
    }
  }
);

userRoutes.post("/send-otp", async (req, res) => {
  console.log("OTP request received:", req.body);

  try {
    const { type, phone, email, userId } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    if (type === "phone" && !phone) {
      return res
        .status(400)
        .json({ message: "Phone is required for phone OTP" });
    }

    if (type === "email" && !email) {
      return res
        .status(400)
        .json({ message: "Email is required for email OTP" });
    }

    await sendOtp(req, res);
  } catch (error) {
    console.error("Route handler error:", error);

    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
});

userRoutes.post("/verify-otp", async (req, res) => {
  try {
    const { type, phone, email, otp } = req.body;
    const identifier = type === "phone" ? phone : email;

    const result = await validateOtp(type, identifier, otp, otpModel);
    if (!result.isValid) {
      return res.status(400).json({ message: result.message });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
});

// Create a new rental
//userRoutes.post('/', rentalController.createRental);

// Get all rentals
//userRoutes.get('/', rentalController.getAllRentals);

// Get a single rental by ID
//userRoutes.get('/:id', rentalController.getRentalById);

// Update a rental
//userRoutes.put('/:id', rentalController.updateRental);

// Delete a rental
//userRoutes.delete('/:id', rentalController.deleteRental);

userRoutes.post("/submit", feedbackController.submit);

userRoutes.get("/slideshow_images", rentalController.fetchSlideshowImage);

userRoutes.get("/availableCars", getAvailableCars);

export default userRoutes;
