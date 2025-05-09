import express from "express";
import { getAvailableCars, bookCar } from "../controllers/carController.js";

const router = express.Router();

// GET available cars
router.get("/available", getAvailableCars);

// POST book a car
router.post("/book", bookCar);

export default router;
