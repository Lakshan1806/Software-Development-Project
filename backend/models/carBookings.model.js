// backend/models/carBookings.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  carID: { type: String },
  pickupLocation: { type: String },
  dropoffLocation: { type: String }, 
  pickupTime: { type: Date },
  dropoffTime: { type: Date },
  userId: { type: String },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
