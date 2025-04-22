import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import fs from "fs";

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS 
    }
});

const generatePDF = (subject, message, filename) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filename);

        doc.pipe(stream);
        doc.fontSize(18).text("Email Notification", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Subject: ${subject}`);
        doc.moveDown();
        doc.fontSize(12).text(`Message:\n${message}`);
        doc.end();

        stream.on("finish", () => resolve(filename));
        stream.on("error", (err) => reject(err));
    });
};

router.post("/send-email", async (req, res) => {
    const { recipient, subject, message } = req.body;
    const pdfFilename = `email_${Date.now()}.pdf`;

    try {
        await generatePDF(subject, message, pdfFilename);

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipient,
            subject: subject,
            text: "Please find the attached email message in PDF format.",
            attachments: [
                {
                    filename: pdfFilename,
                    path: pdfFilename,
                    contentType: "application/pdf",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        fs.unlinkSync(pdfFilename); 

        res.status(200).json({ success: true, message: "Email with PDF sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Email sending failed", error });
    }
});

export { router as emailRoutes };
