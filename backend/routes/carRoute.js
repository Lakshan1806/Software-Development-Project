import express from "express";
import carController from "../controllers/carController.js";

router.get("/available", carController.getAvailableCars);
router.post("/book", carController.bookCar);

export default router; 