import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_CHANGE_SUCCESS_TEMPLATE,
  ACCOUNT_DELETION_TEMPLATE
} from "./emailTemplates.js";

dotenv.config({
  path: "C:/Users/USER/Videos/Software-Development-Project/.env",
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(email, subject, text) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw error;
  }
}
async function sendPasswordResetEmail(email, resetURL) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
}

async function sendResetSuccessEmail(email) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset success email:", error.message);
    throw error;
  }
}

async function passwordchangeSuccessEmail(email) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Change Successful",
    html: PASSWORD_CHANGE_SUCCESS_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error sending password change success email:",
      error.message
    );
    throw error;
  }
}
async function deleteAccountEmail(email) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Account Deletion Confirmation",
    html: ACCOUNT_DELETION_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error sending account deletion confirmation email:",
      error.message
    );
    throw error;
  }
}

export default {
  sendEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  passwordchangeSuccessEmail,
  deleteAccountEmail,
};
