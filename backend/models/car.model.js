import mongoose from "mongoose";

const carSchema = new mongoose.schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, unique: true, required: true },
  licensePlate: { type: String },
  engine: { type: String },
  transmission: { type: String },
  bodyStyle: { type: String },
  fuelType: { type: String },
  mileage: { type: Number },
  color: { type: String },
  price: { type: Number },
  status: { type: String, enum: ["new", "used", "certified pre-owned"] },
  features: [{ type: String }],
  images: [{ type: String }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("Car", carSchema);
