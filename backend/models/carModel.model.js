import mongoose from "mongoose";

const carModelSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    engine: { type: String, required: true },
    transmission: { type: String, required: true },
    bodyStyle: { type: String, required: true },
    fuelType: { type: String, required: true },
    mileage: { type: Number, required: true },
    price: { type: Number, required: true },
    seat: { type: Number, required: true },
    speed: { type: Number, required: true },
    features: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    keyImage: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("CarModel", carModelSchema);
