import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    amount: "",
    promo: "",
  });

  const [finalAmount, setFinalAmount] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyPromoCode = async () => {
    const amount = parseFloat(form.amount);
    if (!form.promo || isNaN(amount)) {
      setApplyMessage("Please enter a valid promo code and amount.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/promo/apply", {
        code: form.promo.trim(),
      });

      const discountedAmount = amount - (amount * response.data.discount) / 100;
      setFinalAmount(discountedAmount);
      setApplyMessage(`Promo applied! New Amount: Rs. ${discountedAmount.toFixed(2)}`);
    } catch (error) {
      setApplyMessage("Invalid promo code");
      setFinalAmount(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applyPromoCode();  

      const emailData = {
        recipient: form.email,
        subject: "Payment Confirmation",
        message: `Hello ${form.name}, your payment of Rs. ${finalAmount ? finalAmount.toFixed(2) : form.amount} has been processed successfully.`,
      };

      const response = await axios.post("http://localhost:5000/api/email/send-email", emailData);
      console.log("Email sent:", response);
      alert("Payment successful!");
    } catch (error) {
      console.error("Error sending email:", error);

      if (error.response) {
        console.error("Server Response:", error.response);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-light text-center mb-6 text-orange-500">Complete Your Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
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
              className="w-1/2 border p-3 rounded-md"
              required
            />
            <input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={form.cvc}
              onChange={handleChange}
              className="w-1/2 border p-3 rounded-md"
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
              className="w-full border p-3 rounded-md"
            />
            <button
              type="button"
              onClick={applyPromoCode}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Apply
            </button>
          </div>
          {applyMessage && <p className="text-sm text-gray-700">{applyMessage}</p>}

          <div className="text-right text-lg font-semibold">
            Total: Rs. {finalAmount !== null ? finalAmount.toFixed(2) : form.amount || "0.00"}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-yellow-400 to-orange-500"}`}
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
