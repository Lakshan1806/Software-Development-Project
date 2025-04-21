import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
//import { OAuth2Client } from "google-auth-library";
//import userModel from "../models/usermodel.js";

//const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/reset-password", userController.resetPassword);
router.get("/is-auth", userAuth, userController.isAuthenticated);
router.post("/forgot-password", userController.forgotPassword);
router.post('/resend-otp', userController.resendOTP);
router.post("/reset-password/:token", userController.resetPassword);

/* router.post('/google/callback', async (req, res) => {
    console.log("Request Body:", req.body); // Debug incoming payload
    const { token } = req.body;
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      const { sub: googleId, email, name } = payload;


      console.log("Google Payload:", payload);
      // Use payload to find or create user in the database
      let user = await userModel.findOne({ googleId });
      if (!user) {
        // Check if a user already exists with this email but without Google ID
        user = await userModel.findOne({ email });
        if (user) {
          // Link Google account to existing user
          user.googleId = googleId;
          await user.save();
        } else {
          user = await userModel.create({
            googleId,
            name,
            email
          });
        }
      }
      
  
      res.status(200).json({ message: "Authentication successful", user });
    } catch (error) {
        console.error("Error Verifying Token:", error);
              res.status(401).json({ message: 'Invalid Token' });
    }
  }); */

export default router;
