import express from "express";
import PromoCode from "../models/PromoCode.js";

const router = express.Router();

// Create a new promo code (Admin Only)
router.post("/create", async (req, res) => {
  try {
    const { code, discount, expirationDate, usageLimit } = req.body;

    // Check if promo code already exists
    const existingPromo = await PromoCode.findOne({ code });
    if (existingPromo) {
      return res.status(400).json({ message: "Promo code already exists" });
    }

    //  Create a new promo code if not found
    const newPromo = new PromoCode({ code, discount, expirationDate, usageLimit });
    await newPromo.save();
    
    res.status(201).json({ message: "Promo code created", promo: newPromo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate a promo code
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code });

    if (!promo || !promo.isActive || promo.expirationDate < new Date() || promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ message: "Invalid promo code" });
    }

    res.json({ discount: promo.discount, message: "Promo code is valid" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply promo code
router.post("/apply", async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code });

    if (!promo || !promo.isActive || promo.expirationDate < new Date() || promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ message: "Invalid promo code" });
    }

    promo.usedCount += 1;
    if (promo.usedCount >= promo.usageLimit) {
      promo.isActive = false;
    }
    await promo.save();

    res.json({ discount: promo.discount, message: "Promo code applied successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
