import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Car year is required'],
    },
    type: {
      type: String,
      enum: ['sedan', 'suv', 'truck', 'compact', 'luxury'],
      required: [true, 'Car type is required'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: 0,
    },
    image: {
      type: String,
      default: 'default-car.jpg',
    },
    location: {
      type: String,
      required: [true, 'Car location is required'],
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    // To track when the car is booked
    bookings: [
      {
        from: Date,
        to: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to check if car is available for a specific time period
carSchema.methods.isAvailable = function(pickupTime, dropoffTime) {
  if (!this.available) return false;
  
  const pickup = new Date(pickupTime);
  const dropoff = new Date(dropoffTime);
  
  // Check against existing bookings
  for (const booking of this.bookings) {
    // If there's any overlap, car is not available
    if (
      (pickup >= booking.from && pickup < booking.to) ||
      (dropoff > booking.from && dropoff <= booking.to) ||
      (pickup <= booking.from && dropoff >= booking.to)
    ) {
      return false;
    }
  }
  
  return true;
};

export default mongoose.model('Car', carSchema);
