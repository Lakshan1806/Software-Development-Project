import express from "express";
import feedbackController from "../controllers/rent/feedbackController.js";
import rentalController from "../controllers/rent/rentalController.js";


const userRoutes = express.Router();
// Create a new rental
//userRoutes.post('/', rentalController.createRental);

// Get all rentals
//userRoutes.get('/', rentalController.getAllRentals);

// Get a single rental by ID
//userRoutes.get('/:id', rentalController.getRentalById);

// Update a rental
//userRoutes.put('/:id', rentalController.updateRental);

// Delete a rental
//userRoutes.delete('/:id', rentalController.deleteRental); 



userRoutes.post("/submit",feedbackController.submit );

userRoutes.get("/slideshow_images", rentalController.fetchSlideshowImage);



export default userRoutes; 