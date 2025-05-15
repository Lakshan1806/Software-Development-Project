import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  carInstanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarInstance",
    required: true,
  },
  pickupLocation: String,
  dropoffLocation: String,
  pickupTime: Date,
  dropoffTime: Date,
  userId: {
    type: String, // Or ObjectId if users are in MongoDB
    required: true,
  },
});

export default mongoose.model( "Rental", bookingSchema);