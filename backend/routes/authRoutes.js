import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";
import passport from "passport";
import generateJwtToken from "../utils/generateJWTToken.js";
const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile", userAuth, userController.getUserProfile);
router.post("/reset-password", userController.resetPassword);
router.get("/is-auth", userAuth, userController.isAuthenticated);
router.post("/forgot-password", userController.forgotPassword);
router.post("/resend-otp", userController.resendOTP);
router.post("/reset-password/:token", userController.resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    const token = generateJwtToken(req.user._id, req.user.username);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

export default router;
