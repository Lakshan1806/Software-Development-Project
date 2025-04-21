import dotenv from "dotenv";
import hashPassword from "../utils/hashPassword.js";
import generateJwtToken from "../utils/generateJWTToken.js";
import checkExistingUser from "../utils/checkExistingUser.js";
import validateOtp from "../utils/validateOtp.js";
import saveSession from "../utils/saveSession.js";
import sendOtp from "../utils/sendOtp.js";
import userModel from "../models/usermodel.js";
import otpModel from "../models/otpModels.js";
import nodemailer from "../utils/nodemailer.js";
import clearTempUserSession from "../utils/clearTempUserSession.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


dotenv.config();
const userController = {
  register: async (req, res) => {
    if (!req.session)
      return res.status(500).json({ message: "Session is not initialized" });

    if (!req.session.tempUser) req.session.tempUser = {};

    try {
      const {
        username,
        password,
        phoneNumber,
        otp: phoneOTP,
        email,
        emailOTP,
      } = req.body;
      let userSession = req.session.tempUser || {};

      if (!userSession.username && !userSession.password) {
        if (!username || !password) {
          return res.status(400).json({ message: "Username and Password are required" });
        }

        if (await checkExistingUser("username", username, userModel)) {
          return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await hashPassword(password);
        req.session.tempUser = { username, password: hashedPassword };
        return saveSession( req.session,res,"Please enter your phone number.");
      }

      if (userSession.username && !userSession.phoneNumber) {
        if (!phoneNumber)
          return res.status(400).json({ message: "Phone number is required" });
        function validatePhoneNumber(phoneNumber) {
          const phoneRegex = /^(0|94|\+94)?(7[0-9])([0-9]{7})$/;
          return phoneRegex.test(phoneNumber);
        }

        if (!validatePhoneNumber(phoneNumber)) {
          return res.status(400).json({ message: "Invalid phone number format" });
        }

        if (await checkExistingUser("phone", phoneNumber, userModel)) {
          return res.status(400).json({ message: "Phone number already exists" });
        }

        await sendOtp({ body: { type: "phone", phone: phoneNumber } }, res);

        req.session.tempUser.phoneNumber = phoneNumber;
        return saveSession(req.session, res, "OTP sent to phone. Please verify."
        );
      }

      if (
        userSession.username &&
        userSession.phoneNumber &&
        !userSession.phoneVerified
      ) {
        if (!phoneOTP)
          return res.status(400).json({ message: "Phone OTP is required" });

        if (
          !(await validateOtp(
            "phone",
            userSession.phoneNumber,
            phoneOTP,
            otpModel
          ))
        ) {
          return res.status(400).json({ message: "Invalid or expired phone OTP" });
        }

        userSession.phoneVerified = true;
        return saveSession( req.session, res,"Phone number verified. Please enter your email address.");
      }

      if (
        userSession.username &&
        userSession.phoneVerified &&
        !userSession.email
      ) {
        if (!email)
          return res.status(400).json({ message: "Email address is required" });

        if (await checkExistingUser("email", email, userModel)) {
          return res.status(400).json({ message: "Email already exists" });
        }

        await sendOtp({ body: { type: "email", email } }, res);
        req.session.tempUser.email = email;
        return saveSession(req.session, res,"OTP sent to email. Please verify.");
      }

      if (
        userSession.username &&
        userSession.phoneVerified &&
        userSession.email &&
        !userSession.emailVerified
      ) {
        if (!emailOTP) {
          return res.status(400).json({ message: "Email OTP is required" });
        }

        if (
          !(await validateOtp("email", userSession.email, emailOTP, otpModel))
        ) {
          return res.status(400).json({ message: "Invalid or expired email OTP" });
        }

        userSession.emailVerified = true;

        const newUser = await userModel.create({
          username: userSession.username,
          password: userSession.password,
          phone: userSession.phoneNumber,
          email: userSession.email,
        });

        const token = generateJwtToken(newUser._id, newUser.username);
        clearTempUserSession(req.session);

        try {
          await nodemailer.sendEmail(newUser.email, "Welcome to the Cab Booking System", "Registration successful");
        } catch (error) {
          return res.status(500).json({ message: "Failed to send welcome email", error: error.message });
        }
        return res.status(201).json({ message: "Registration successful!" ,
          user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            phone: newUser.phone
          }
        });
      }

      return res.status(400).json({ message: "Unexpected state of registration process." });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  login: async (req, res) => {
    if (!req.session) {
      return res.status(500).json({ message: "Session is not initialized" });
    }

    if (!req.session.tempUser) {
      req.session.tempUser = {};
    }

    try {
      const { username, password, otp: phoneOTP } = req.body;
      let userSession = req.session.tempUser || {};

      if (!userSession.username && !userSession.password) {
        if (!username || !password) {
          return res
            .status(400)
            .json({ message: "Username and Password are required" });
        }

        const user = await userModel.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          
          if (user) {
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              return res.status(400).json({ message: "Invalid credentials" });
            }
          }
          return res.status(400).json({
            message: "Invalid credentials",
            details: {
              userExists: !!user,
              passwordMatch: user ? await bcrypt.compare(password, user.password) : false,
            },
          });
        }

        req.session.tempUser = { username, password };
        const phoneNumber = user.phone;
        if (!phoneNumber) {return res.status(400).json({ message: "Phone number not found for the user" });
        }

        try {
          await sendOtp({ body: { type: "phone", phone: phoneNumber } }, res);
        } catch (error) {
          return res.status(500).json({ message: "Failed to send OTP", error: error.message });
        }

        req.session.tempUser.phoneNumber = phoneNumber;
        await req.session.save();
        return res.status(200).json({ message: "OTP sent to your phone. Please verify to continue." });
      }

      if (
        userSession.username &&
        userSession.phoneNumber &&
        !userSession.phoneVerified
      ) {
        if (!phoneOTP) {
          return res.status(400).json({ message: "Phone OTP is required" });
        }

        const isValidOtp = await validateOtp(
          "phone",
          userSession.phoneNumber,
          phoneOTP,
          otpModel
        );
        if (!isValidOtp) {
          return res.status(400).json({ message: "Invalid or expired phone OTP" });
        }

        req.session.tempUser.phoneVerified = true;
        await req.session.save();

        const user = await userModel.findOne({
          username: userSession.username,
        });
        const token = generateJwtToken(user._id, user.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        clearTempUserSession(req.session);
        return res.status(200).json({
          success: true,
          message: "Phone number verified. Login successful!",
          token,
          user: { username: user.username },
        });
      }

      return res
        .status(400)
        .json({ message: "Invalid request or process step." });
    } catch (error) {
      const errorMessage = error && error.message ? error.message : "An unexpected server error occurred";

      if (!res.headersSent) {
        return res.status(500).json({ message: errorMessage });
      }
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      req.session.destroy((err) => {
        if (err) { return res.status(500).json({ message: "Failed to destroy session", error: err.message }); }
        return res.status(200).json({ message: "Logout successful!" });
      });
    } catch (error) {
      
      return res.status(500).json({ message: "Server error during logout", error: error.message });
    }
  },

  isAuthenticated: async (req, res) => {
    try {
      if (req.session.user) {
        return res.json({ success: true, user: req.session.user });
      } else {
        return res.json({ success: false });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
  
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;

      await user.save();

      try {
        await nodemailer.sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
      } catch (error) {
        return res.status(500).json({message: "Failed to send Reset email", error: error.message});
      }
      res.status(200).json({ success: true, message: "Password reset link sent to your email"});
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpiresAt: undefined,
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update password");
      }

      const updatedUser = await userModel.findById(user._id);
      
      await nodemailer.sendResetSuccessEmail(updatedUser.email);

      res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
      
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  resendOTP: async (req, res) => {
    try {
      const { email, phone } = req.body;

      if (!req.session.tempUser) {
        return res.status(400).json({ message: "Registration session not found" });
      }

      if (email) {
        if (req.session.tempUser.email !== email) {
           return res.status(400).json({ message: "Email doesn't match registration" });
        }
      } else if (phone) {
        if (req.session.tempUser.phoneNumber !== phone) {
          return res.status(400).json({ message: "Phone doesn't match registration" });
        }
      } else {
        return res.status(400).json({ message: "Email or phone is required" });
      }

      await otpModel.deleteMany({ $or: [{ email }, { phone }] });

      const mockReq = {
        body: {
          type: email ? "email" : "phone",
          email: email || undefined,
          phone: phone || undefined,
        },
      };

      const mockRes = {
        status: () => mockRes,
        json: (data) => {
          return mockRes;
        },
      };

      await sendOtp(mockReq, mockRes);

      return res.status(200).json({
        message: `New OTP sent to ${email ? "email" : "phone"}`,
      });
    } catch (error) {
      return res.status(500).json({message: "Failed to resend OTP", error: error.message});
    }
  },

  
};
export default userController;
