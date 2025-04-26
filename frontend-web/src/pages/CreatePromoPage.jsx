import React, { useEffect, useState } from "react";
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
  const [promos, setPromos] = useState([]);

  const fetchPromos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/promo/all");
      setPromos(response.data);
    } catch (err) {
      console.error("Failed to fetch promo codes:", err);
    }
  };

  useEffect(() => {
    fetchPromos();
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
      fetchPromos(); 
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Failed to create promo code. Server error."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center mb-6">
          Create Promo Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="code" placeholder="Promo Code" value={form.code} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="number" name="discount" placeholder="Discount (%)" value={form.discount} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <input type="date" name="expiry" placeholder="Expiry Date" value={form.expiry} onChange={handleChange} className="w-full border p-3 rounded-md" />
          <input type="number" name="usageLimit" placeholder="Usage Limit" value={form.usageLimit} onChange={handleChange} className="w-full border p-3 rounded-md" required />
          <button type="submit" className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90">
            Create Promo
          </button>
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-semibold mb-4">Existing Promo Codes</h3>
        {promos.length === 0 ? (
          <p>No promo codes found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Code</th>
                <th className="p-3">Discount (%)</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Usage Limit</th>
                <th className="p-3">Used</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo._id} className="border-t">
                  <td className="p-3">{promo.code}</td>
                  <td className="p-3">{promo.discount}</td>
                  <td className="p-3">{promo.expirationDate ? new Date(promo.expirationDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-3">{promo.usageLimit}</td>
                  <td className="p-3">{promo.usedCount || 0}</td>
                  <td className="p-3">{promo.isActive ? "Active" : "Not Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreatePromoPage;
