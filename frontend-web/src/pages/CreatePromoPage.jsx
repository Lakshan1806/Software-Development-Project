import React, { useState } from "react";
import axios from "axios";

const CreatePromoPage = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    expiry: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.code || !form.discount) {
      setError("Please enter both promo code and discount.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/promo/create", {
        code: form.code.trim(),
        discount: parseFloat(form.discount),
        expiry: form.expiry || null,
      });

      setMessage(`✅ Promo "${form.code}" created successfully!`);
      setForm({ code: "", discount: "", expiry: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Failed to create promo code. Server error."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center mb-6">
          Create Promo Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="code"
            placeholder="Promo Code"
            value={form.code}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
            required
          />
          <input
            type="date"
            name="expiry"
            placeholder="Expiry Date"
            value={form.expiry}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90"
          >
            Create Promo
          </button>

          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePromoPage;
