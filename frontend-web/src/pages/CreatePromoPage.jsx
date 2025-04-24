import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePromoPage = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    expiry: "",
    usageLimit: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [promoCodes, setPromoCodes] = useState([]); // New state to store promo codes

  // Fetch promo codes when component mounts
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/promo/all");
        setPromoCodes(response.data); // Set promo codes in state
      } catch (err) {
        console.error("Failed to fetch promo codes:", err);
      }
    };

    fetchPromoCodes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.code || !form.discount || !form.usageLimit) {
      setError("Please fill in promo code, discount, and usage limit.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/promo/create", {
        code: form.code.trim(),
        discount: parseFloat(form.discount),
        expirationDate: form.expiry || null,
        usageLimit: parseInt(form.usageLimit),
      });

      setMessage(`✅ Promo "${form.code}" created successfully!`);
      setForm({ code: "", discount: "", expiry: "", usageLimit: "" });
      // Fetch the promo codes again after adding a new one
      const updatedPromoCodes = await axios.get("http://localhost:5000/api/promo/all");
      setPromoCodes(updatedPromoCodes.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Failed to create promo code. Server error."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
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
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="date"
            name="expiry"
            placeholder="Expiry Date"
            value={form.expiry}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            name="usageLimit"
            placeholder="Usage Limit"
            value={form.usageLimit}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Create Promo
          </button>

          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>

        <h2 className="text-3xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center mt-8 mb-4">
          Existing Promo Codes
        </h2>

        {/* Table for displaying existing promo codes */}
        {promoCodes.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg mt-6 shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left text-lg font-semibold text-gray-700 border-b">Code</th>
                <th className="py-3 px-6 text-left text-lg font-semibold text-gray-700 border-b">Discount (%)</th>
                <th className="py-3 px-6 text-left text-lg font-semibold text-gray-700 border-b">Expiry Date</th>
                <th className="py-3 px-6 text-left text-lg font-semibold text-gray-700 border-b">Usage Limit</th>
                <th className="py-3 px-6 text-left text-lg font-semibold text-gray-700 border-b">Used Count</th>
                <th className="py-3 px-6 text-left text-lg font-semibold text-gray-700 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo._id} className="border-t">
                  <td className="py-3 px-6 text-sm text-gray-600">{promo.code}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{promo.discount}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{promo.expirationDate || "N/A"}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{promo.usageLimit}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{promo.usedCount}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {promo.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-center text-gray-600">No promo codes found.</p>
        )}
      </div>
    </div>
  );
};

export default CreatePromoPage;
