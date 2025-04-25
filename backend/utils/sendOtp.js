 import nodemailer from "./nodemailer.js";
import sendSMS from "./sendSms.js";
 import otpModel from "../models/otpModels.js";

 const sendOtp = async (req, res) => {
    const { type, phone, email } = req.body;
  
    try {
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      const expiryTime = Date.now() + 0.6* 60 * 1000;
  
      if (type === "phone" && phone) {
      
        await otpModel.create({ phone, otp: generatedOtp, expiresAt: expiryTime });
        await sendSMS(phone, `Your OTP for Cab Booking System is: ${generatedOtp}`);
        console.log("phone otp is: ",generatedOtp);
        
      } else if (type === "email" && email) {
        await otpModel.create({ email, otp: generatedOtp, expiresAt: expiryTime })
        await nodemailer.sendEmail(email, "Email Verification OTP", `Your OTP is: ${generatedOtp}`);
        console.log("Email otp is: ",generatedOtp);

      } else {
        return res.status(400).json({ message: "Invalid type or missing details" });
      }
  
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
  };
  export default sendOtp;