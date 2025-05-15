import mongoose from "mongoose";

const carInstanceSchema = new mongoose.Schema(
  {
    carID: { type: String, required: true },
    vin: { type: String, unique: true, required: true },
    licensePlate: { type: String, unique: true, required: true },
    color: { type: String },
    status: {
      type: String,
      enum: ["Booked", "Available"],
      default: "Available",
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    isAvailable: { type: Boolean, default: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CarInstance", carInstanceSchema);
