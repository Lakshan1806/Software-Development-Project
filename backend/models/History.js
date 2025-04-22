import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    fare: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "Completed" },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

export default History; 
