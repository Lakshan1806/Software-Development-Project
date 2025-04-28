import nodemailer from "nodemailer";
import dotenv, { config } from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendWelcomeEmail(email, temporaryPassword, username) {
  const mailOptions = {
    from: " Urban Move Admin <yourusername@email.com>",
    to: email,
    subject: "Urban Move Admin Registration",
    text: ` Welcome!\n Your username is: ${username}\n Your temporary password is: ${temporaryPassword}\n Please log in and change your password immediately.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

export default sendWelcomeEmail;