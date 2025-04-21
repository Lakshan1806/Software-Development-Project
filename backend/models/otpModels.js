import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: function () {
      return !this.email; 
    },
    validate: {
      validator: function () {
        return !(this.phone && this.email); 
      },
      message: "Only one of phone or email should be provided, not both.",
    },
  },
  email: {
    type: String,
    required: function () {
      return !this.phone; 
    },
  },
  otp: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{6}$/.test(v); 
      },
      message: props => `The OTP ${props.value} must be a 6-digit numeric code.`,
    },
  },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model("Otp", otpSchema);

export default otpModel;
