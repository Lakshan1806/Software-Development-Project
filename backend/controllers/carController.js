import CarInstance from "../models/carInstance.model.js";
import CarModel from "../models/carModel.model.js";
import Booking from "../models/carBookings.model.js";

export const getAvailableCars = async (req, res) => {
  const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.query;
  console.log(pickupLocation);
  try {
    const availableInstances = await CarInstance.find({
      location: pickupLocation,
      status: "Available",
    });

    const carModelIds = availableInstances.map(inst => inst.carID);
    const carModels = await CarModel.find({ _id: { $in: carModelIds } });

    res.status(200).json({
      data: {
        cars: carModels,
        instances: availableInstances,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        dropoffTime,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available cars" });
  }
};

export const bookCar = async (req, res) => {
  const {
    carInstanceId,
    pickupLocation,
    dropoffLocation,
    pickupTime,
    dropoffTime,
    userId,
  } = req.body;

  try {
    const carInstance = await CarInstance.findById(carInstanceId);
    if (!carInstance || !carInstance.isAvailable) {
      return res.status(400).json({ message: "Car is not available" });
    }

    carInstance.isAvailable = false;
    carInstance.status = "Booked";
    await carInstance.save();

    const booking = new Booking({
      carID: carInstance.carID,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      userId,
    });

    await booking.save();

    res.status(200).json({ message: "Booking successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing booking" });
  }
};
