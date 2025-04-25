import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return !this.googleId; 
      },
      unique: true,
    },
    password: {
      type: String,
      required:function () {
        return !this.googleId; // Only require password if not a Google user
      },
    },
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    googleId: { type: String, unique: true, sparse: true },
    isAccountVerified: { type: Boolean, default: false },
    name: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    authMethod: { type: String, enum: ['local', 'google'], default: 'local' },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);



const userModel = mongoose.model("User", userSchema);
export default userModel;
