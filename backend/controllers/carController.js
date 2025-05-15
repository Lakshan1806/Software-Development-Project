import CarInstance from "../models/carInstance.model";
import CarModel from "../models/carModel.model";
import Booking from "../models/rental.model";

exports.getAvailableCars = async (req, res) => {
  const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.query;

  try {
    const availableInstances = await CarInstance.find({
      city: pickupLocation,
      isAvailable: true,
    });

    const carModelIds = availableInstances.map(inst => inst.carModelId);
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

exports.bookCar = async (req, res) => {
  const { carInstanceId, pickupLocation, dropoffLocation, pickupTime, dropoffTime, userId } = req.body;

  try {
    const carInstance = await CarInstance.findById(carInstanceId);
    if (!carInstance || !carInstance.isAvailable) {
      return res.status(400).json({ message: "Car is not available" });
    }

    carInstance.isAvailable = false;
    await carInstance.save();

    const booking = new Booking({
      carInstanceId,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
      userId,
    });

    await booking.save();

    res.status(200).json({ message: "Booking successful" });
  } catch (error) {
    res.status(500).json({ message: "Error processing booking" });
  }
};
