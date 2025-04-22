import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    promo: "",
    amount: "",
  });

  const [finalAmount, setFinalAmount] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyPromoCode = async () => {
    const amount = parseFloat(form.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      setApplyMessage("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/promo/apply", {
        code: form.promo.trim(),
        amount,
      });

      const discountedAmount = amount - (amount * response.data.discount) / 100;
      setFinalAmount(discountedAmount);
      setPromoApplied(true);
      setApplyMessage(`Promo applied! New Amount: $${discountedAmount.toFixed(2)}`);
    } catch (error) {
      setApplyMessage(error.response?.data?.message || "Invalid promo code");
      setFinalAmount(null);
      setPromoApplied(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert("Payment successful!");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center mb-6">
          Complete Your Payment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            required
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={form.cardNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
            <input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={form.cvc}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>
          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              name="promo"
              placeholder="Promo Code"
              value={form.promo}
              onChange={handleChange}
              className="flex-1 border p-3 rounded-md"
            />
            <button
              type="button"
              onClick={applyPromoCode}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Apply
            </button>
          </div>
          {applyMessage && <p className="text-sm text-gray-700">{applyMessage}</p>}
          <div className="text-right text-lg font-semibold">
            Total: Rs.{finalAmount !== null ? finalAmount.toFixed(2) : form.amount || "0.00"}
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-orange-500"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
