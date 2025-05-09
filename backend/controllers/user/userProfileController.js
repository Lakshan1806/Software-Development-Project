import dotenv from "dotenv";
import userModel from "../../models/usermodel.js";
import ArchivedUser from "../../models/archivedUser.model.js";
import nodemailer from "../../utils/nodemailer.js";

dotenv.config();

const userProfileController = {
  getUserProfile: async (req, res) => {
    try {
      const user = await userModel.findById(req.body.userId).select({
        fullname: 1,
        username: 1,
        email: 1,
        phone: 1,
        photo: 1,
        age: 1,
        address: 1,
        nicNumber: 1,
      });

      user.photo = user.photo
        .replace(/\\/g, "/")
        .replace("backend/uploads", "/uploads");

      res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const {
        username,
        email,
        phone,
        userId,
        fullname,
        nicNumber,
        address,
        age,
      } = req.body;

      console.log("Update profile request body:", req.body);

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      if (!username || !email || !phone) {
        return res
          .status(400)
          .json({ message: "Username, email, and phone are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (req.file && req.file.path) {
        const user = await userModel.findByIdAndUpdate(req.body.userId, {
          $set: { photo: req.file.path },
        });
        console.log("Uploaded file:", req.file);
      }

      const updatedUser = await userModel.findByIdAndUpdate(userId, {
        $set: {
          fullname,
          username,
          email,
          phone,
          address,
          nicNumber,
          age,
        },
      });

      res.status(200).json({ message: "update successful" });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const { reason, userId } = req.body;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const archivedUser = new ArchivedUser({
        originalId: user._id,
        ...user.toObject(),
        reasonForDeletion: reason || "No reason provided",
        deletedAt: new Date(),
      });
      await archivedUser.save();
      await nodemailer.deleteAccountEmail(user.email);

      await userModel.findByIdAndDelete(userId);

      res.clearCookie("token");

      res
        .status(200)
        .json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Account deletion failed",
        error: error.message,
      });
    }
  },
};
export default userProfileController;
