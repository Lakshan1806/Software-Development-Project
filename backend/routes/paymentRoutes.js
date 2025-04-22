const express = require("express");
const PromoCode = require("../models/PromoCode");
const router = express.Router();

router.post("/process-payment", async (req, res) => {
    try {
        const { amount, promoCode } = req.body;
        let finalAmount = amount;

        if (promoCode) {
            const promo = await PromoCode.findOne({ code: promoCode });
            if (promo && promo.isActive && promo.expirationDate > new Date() && promo.usedCount < promo.usageLimit) {
                finalAmount -= (amount * promo.discount) / 100; 
            }
        }


        res.json({ message: "Payment successful", amountPaid: finalAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
