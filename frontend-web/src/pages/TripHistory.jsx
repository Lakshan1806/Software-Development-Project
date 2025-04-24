import React, { useState } from 'react';
import axios from 'axios';

const TripHistory = () => {
  const [userId, setUserId] = useState('');
  const [tripHistory, setTripHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFetch = async () => {
    if (!userId.trim()) return;

    setLoading(true);
    setSubmitted(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/history/${userId}`);
      setTripHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch trip history:', error);
      setTripHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans bg-white min-h-screen">
      <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
        Trip History
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-72 mr-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleFetch}
          className="px-6 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:opacity-90 transition"
        >
          Fetch History
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading trip history...</p>}

      {submitted && !loading && tripHistory.length === 0 && (
        <p className="text-gray-600">No trip history available for User ID: <strong>{userId}</strong></p>
      )}

      {tripHistory.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <tr>
                <th className={thStyle}>#</th>
                <th className={thStyle}>Driver ID</th>
                <th className={thStyle}>Pickup</th>
                <th className={thStyle}>Dropoff</th>
                <th className={thStyle}>Fare</th>
                <th className={thStyle}>Distance (km)</th>
                <th className={thStyle}>Duration</th>
                <th className={thStyle}>Payment</th>
                <th className={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tripHistory.map((trip, index) => (
                <tr key={index} className="hover:bg-orange-50">
                  <td className={tdStyle}>{index + 1}</td>
                  <td className={tdStyle}>{trip.driverId}</td>
                  <td className={tdStyle}>{trip.pickupLocation}</td>
                  <td className={tdStyle}>{trip.dropoffLocation}</td>
                  <td className={tdStyle}>Rs.{trip.fare}</td>
                  <td className={tdStyle}>{(trip.distance ).toFixed(2)}</td>
                  <td className={tdStyle}>{trip.duration}</td>
                  <td className={tdStyle}>{trip.paymentMethod}</td>
                  <td className={tdStyle}>{trip.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = "px-4 py-3 text-left text-sm font-medium";
const tdStyle = "px-4 py-3 border-t border-gray-200 text-sm text-gray-700";

export default TripHistory;
