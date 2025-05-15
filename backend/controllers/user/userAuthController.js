import dotenv from "dotenv";
import hashPassword from "../../utils/hashPassword.js";
import generateJwtToken from "../../utils/generateJWTToken.js";
import checkExistingUser from "../../utils/checkExistingUser.js";
import validateOtp from "../../utils/validateOtp.js";
import saveSession from "../../utils/saveSession.js";
import sendOtp from "../../utils/sendOtp.js";
import userModel from "../../models/usermodel.js";
import otpModel from "../../models/otpModels.js";
import nodemailer from "../../utils/nodemailer.js";
import clearTempUserSession from "../../utils/clearTempUserSession.js";
import bcrypt from "bcrypt";

dotenv.config();
const userAuthController = {
  register: async (req, res) => {
    if (!req.session) {
      return res.status(500).json({ message: "Session is not initialized" });
    }

    const {
      username,
      password,
      phoneNumber,
      otp: phoneOTP,
      email,
      emailOTP,
    } = req.body;

    if (username && password) {
      req.session.tempUser = {};
    }

    let userSession = req.session.tempUser || {};

    try {
      if (!userSession.username && !userSession.password) {
        if (!username || !password) {
          return res
            .status(400)
            .json({ message: "Username and Password are required" });
        }

        if (await checkExistingUser("username", username, userModel)) {
          return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await hashPassword(password);
        req.session.tempUser = { username, password: hashedPassword };
        return saveSession(req.session, res, "Please enter your phone number.");
      }

      if (userSession.username && !userSession.phoneNumber) {
        if (!phoneNumber)
          return res.status(400).json({ message: "Phone number is required" });

        const phoneRegex = /^(0|94|\+94)?(7[0-9])([0-9]{7})$/;

        if (!phoneRegex.test(phoneNumber)) {
          return res
            .status(400)
            .json({ message: "Invalid phone number format" });
        }

        if (await checkExistingUser("phone", phoneNumber, userModel)) {
          return res
            .status(400)
            .json({ message: "Phone number already exists" });
        }

        await sendOtp({ body: { type: "phone", phone: phoneNumber } }, res);

        req.session.tempUser.phoneNumber = phoneNumber;
        return saveSession(
          req.session,
          res,
          "OTP sent to phone. Please verify."
        );
      }

      if (
        userSession.username &&
        userSession.phoneNumber &&
        !userSession.phoneVerified
      ) {
        if (!phoneOTP)
          return res.status(400).json({ message: "Phone OTP is required" });

        const isValidPhoneOtp = await validateOtp(
          "phone",
          userSession.phoneNumber,
          phoneOTP,
          otpModel
        );

        if (!isValidPhoneOtp) {
          return res
            .status(400)
            .json({ message: "Invalid or expired phone OTP" });
        }

        userSession.phoneVerified = true;
        return saveSession(
          req.session,
          res,
          "Phone number verified. Please enter your email address."
        );
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
        return saveSession(
          req.session,
          res,
          "OTP sent to email. Please verify."
        );
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

        const isValidEmailOtp = await validateOtp(
          "email",
          userSession.email,
          emailOTP,
          otpModel
        );

        if (!isValidEmailOtp) {
          return res
            .status(400)
            .json({ message: "Invalid or expired email OTP" });
        }

        userSession.emailVerified = true;

        const newUser = await userModel.create({
          username: userSession.username,
          password: userSession.password,
          phone: userSession.phoneNumber,
          email: userSession.email,
          isAccountVerified: true,
        });

        const token = generateJwtToken(newUser._id, newUser.username);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        req.session.user = {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
        };

        clearTempUserSession(req.session);

        try {
          await nodemailer.sendEmail(
            newUser.email,
            "Welcome to the Cab Booking System",
            "Registration successful"
          );
        } catch (error) {
          return res.status(500).json({
            message: "Failed to send welcome email",
            error: error.message,
          });
        }

        return res.status(201).json({
          message: "Registration successful!",
          user: req.session.user,
        });
      }

      return res.status(400).json({
        message: "Unexpected state of registration process.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    if (!req.session) {
      return res.status(500).json({ message: "Session is not initialized" });
    }

    const { username, password, phone: phoneNumber, otp: phoneOTP } = req.body;
    if (username && password) {
      req.session.tempUser = {};
    }
    let userSession = req.session.tempUser || {};

    try {
      // STAGE 1: Verify username and password
      if (!userSession.username && !userSession.password) {
        if (!username || !password) {
          return res
            .status(400)
            .json({ message: "Username and Password are required" });
        }

        const user = await userModel.findOne({ username });
        if (!user || user.authMethod === "google") {
          return res.status(400).json({
            message: "Please sign in with Google",
            authMethod: user?.authMethod || "none",
          });
        }
        if ( user.isTerminated) {
          return res.status(401).json({ 
            message: " account terminated" 
          });
        }

        if (!user || !bcrypt.compare(password, user.password)) {
          if (user) {
            const isMatch = bcrypt.compare(password, user.password);
            if (isMatch) {
              return res.status(400).json({ message: "Invalid credentials" });
            }
          }
          return res.status(400).json({
            message: "Invalid credentials",
            details: {
              userExists: !!user,
              passwordMatch: user
                ? bcrypt.compare(password, user.password)
                : false,
            },
          });
        }

        req.session.tempUser = { username, password, userId: user._id };
        await req.session.save();

        return res.status(200).json({
          message:
            "Username and password verified. Please provide your phone number.",
          nextStep: "provide_phone",
        });
      }

      // STAGE 2: Verify phone number matches user's record
      if (userSession.username && !userSession.phoneNumber) {
        if (!phoneNumber) {
          return res.status(400).json({ message: "Phone number is required" });
        }
        const phoneRegex = /^(0|94|\+94)?(7[0-9])([0-9]{7})$/;

        if (!phoneRegex.test(phoneNumber)) {
          return res
            .status(400)
            .json({ message: "Invalid phone number format" });
        }

        const user = await userModel.findById(userSession.userId);
        if (!user) {
          clearTempUserSession(req.session);
          return res.status(404).json({ message: "User not found" });
        }

        if (user.phone !== phoneNumber) {
          return res.status(400).json({
            message: "Phone number does not match our records",
            hint: "Please enter the phone number associated with this account",
          });
        }

        req.session.tempUser.phoneNumber = phoneNumber;
        await req.session.save();

        try {
          await sendOtp({ body: { type: "phone", phone: phoneNumber } }, res);
        } catch (error) {
          return res.status(500).json({
            message: "Failed to send OTP",
            error: error.message,
          });
        }

        return res.status(200).json({
          message: "OTP sent to your phone. Please verify to continue.",
          nextStep: "verify_otp",
        });
      }

      // STAGE 3: Verify OTP
      if (userSession.phoneNumber && !userSession.phoneVerified) {
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
          return res
            .status(400)
            .json({ message: "Invalid or expired phone OTP" });
        }

        req.session.tempUser.phoneVerified = true;
        await req.session.save();

        const user = await userModel.findById(userSession.userId);
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
      const errorMessage =
        error?.message || "An unexpected server error occurred";
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
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to destroy session", error: err.message });
        }
        return res.status(200).json({ message: "Logout successful!" });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error during logout", error: error.message });
    }
  },
  resendOTP: async (req, res) => {
    try {
      const { email, phone } = req.body;

      if (!req.session.tempUser) {
        return res
          .status(400)
          .json({ message: "Registration session not found" });
      }

      if (email) {
        if (req.session.tempUser.email !== email) {
          return res
            .status(400)
            .json({ message: "Email doesn't match registration" });
        }
      } else if (phone) {
        if (req.session.tempUser.phoneNumber !== phone) {
          return res
            .status(400)
            .json({ message: "Phone doesn't match registration" });
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
      return res
        .status(500)
        .json({ message: "Failed to resend OTP", error: error.message });
    }
  },
  isAuthenticated: async (req, res) => {
    try {
      if (req.body.userId) {
        const user = await userModel
          .findById(req.body.userId)
          .select("-password -__v");
        return res.json({ success: true, user });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
  verifyGooglePhone: async (req, res) => {
    try {
      if (!req.session.tempUser || !req.session.tempUser.googleId) {
        return res.status(400).json({
          success: false,
          message: "Google signup session expired",
        });
      }

      const { phoneNumber, otp } = req.body;

      if (!phoneNumber && !otp) {
        return res.status(400).json({
          success: false,
          message: "Phone number or OTP is required",
        });
      }

      if (phoneNumber && !otp) {
        const phoneRegex = /^(0|94|\+94)?(7[0-9])([0-9]{7})$/;
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            success: false,
            message: "Invalid phone number format",
          });
        }

        const existingUser = await userModel.findOne({ phone: phoneNumber });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Phone number already exists",
          });
        }

        req.session.tempUser.phoneNumber = phoneNumber;
        await req.session.save();

        await sendOtp(
          { body: { type: "phone", phone: phoneNumber } },
          {
            status: () => ({ json: () => {} }),
          }
        );

        return res.status(200).json({
          success: true,
          message: "OTP sent to phone",
        });
      }

      if (otp) {
        if (!req.session.tempUser.phoneNumber) {
          return res.status(400).json({
            success: false,
            message: "Phone number not found in session",
          });
        }

        const isValidOtp = await validateOtp(
          "phone",
          req.session.tempUser.phoneNumber,
          otp,
          otpModel
        );

        if (!isValidOtp) {
          return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP",
          });
        }

        const updatedUser = await userModel.findOneAndUpdate(
          { googleId: req.session.tempUser.googleId },
          {
            phone: req.session.tempUser.phoneNumber,
            isAccountVerified: true,
          },
          { new: true }
        );

        const token = generateJwtToken(updatedUser._id, updatedUser.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        delete req.session.tempUser;
        await req.session.save();

        return res.status(200).json({
          success: true,
          message: "Phone verification successful",
          user: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            authMethod: updatedUser.authMethod,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    } catch (error) {
      console.error("Google phone verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};
export default userAuthController;
