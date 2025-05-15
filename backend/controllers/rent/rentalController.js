import Rental from "../../models/rental.model.js";
import CarModel from "../../models/carModel.model.js";

const rentalController = {
  // Create a new rental
  createRental: async (req, res) => {
    try {
      const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } =
        req.body;

      if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const pickupDate = new Date(pickupTime);
      const dropoffDate = new Date(dropoffTime);

      if (pickupDate >= dropoffDate) {
        return res
          .status(400)
          .json({ message: "Drop-off time must be after pickup time" });
      }

      const rental = await Rental.create({
        pickupLocation,
        dropoffLocation,
        pickupTime: pickupDate,
        dropoffTime: dropoffDate,
      });

      res.status(201).json({
        success: true,
        message: "Rental booked successfully!",
        data: rental,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error creating rental",
      });
    }
  },

  // Get all rentals
  getAllRentals: async (req, res) => {
    try {
      const rentals = await Rental.find().sort({ createdAt: -1 });
      res
        .status(200)
        .json({ success: true, count: rentals.length, data: rentals });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error fetching rentals",
      });
    }
  },

  // Get a single rental by ID
  getRentalById: async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) {
        return res
          .status(404)
          .json({ success: false, message: "Rental not found" });
      }
      res.status(200).json({ success: true, data: rental });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error fetching rental",
      });
    }
  },

  // Update a rental
  updateRental: async (req, res) => {
    try {
      if (req.body.pickupTime && req.body.dropoffTime) {
        const pickupDate = new Date(req.body.pickupTime);
        const dropoffDate = new Date(req.body.dropoffTime);

        if (pickupDate >= dropoffDate) {
          return res.status(400).json({
            success: false,
            message: "Drop-off time must be after pickup time",
          });
        }
      }

      const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!rental) {
        return res
          .status(404)
          .json({ success: false, message: "Rental not found" });
      }

      res.status(200).json({
        success: true,
        message: "Rental updated successfully",
        data: rental,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error updating rental",
      });
    }
  },

  // Delete a rental
  deleteRental: async (req, res) => {
    try {
      const rental = await Rental.findByIdAndDelete(req.params.id);
      if (!rental) {
        return res
          .status(404)
          .json({ success: false, message: "Rental not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Rental deleted successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error deleting rental",
      });
    }
  },

  fetchSlideshowImage: async (req, res) => {
    console.log(req.body);
    try {
      const images = await CarModel.find().select({ keyImage: 1 });
      console.log(images);
      images.map((image)=> {
        image.keyImage = image.keyImage
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }) 
      res.json(images);
    } catch (err) {
      console.error("Error in /user/slideshow_images:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default rentalController;
