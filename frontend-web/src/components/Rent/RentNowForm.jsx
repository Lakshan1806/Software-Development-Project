import { useState } from "react";
import axios from "axios";

function RentNowForm({ onClose, userId }) {
  const cities = ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo"];

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    dropoffTime: "",
  });

  const [availableCar, setAvailableCar] = useState(null);
  const [loadingCar, setLoadingCar] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAvailableCar = async () => {
    setLoadingCar(true);
    try {
      console.log(formData);
      const res = await axios.get("/api/cars/available", {
        params: {
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          pickupTime: formData.pickupTime,
          dropoffTime: formData.dropoffTime,
        },
      });

      console.log("Raw response from API:", res.data); // 🔍 log full response

      const data = res?.data?.data;
      if (!data) {
        console.warn("No data received from server.");
        return;
      }

      const instances = data.instances;
      const cars = data.cars;

      console.log("Available instances:", instances); // 🔍 log instances
      console.log("Available cars:", cars); // 🔍 log car models

      if (!Array.isArray(instances) || instances.length === 0) {
        console.warn("No available car instances foun.");
        return;
      }

      const instance = instances[0];

      if (!instance?.carID || !instance?._id) {
        console.warn("Invalid car instance data:", instance);
        return;
      }

      const model = cars?.find((car) => car._id === instance.carID);

      if (!model) {
        console.warn("No matching car model found for instance:", instance);
        return;
      }

      setAvailableCar({
        carInstanceId: instance._id,
        carModel: model,
      });

      console.log("Selected car set:", {
        carInstanceId: instance._id,
        carModel: model,
      }); // ✅ log the final selected car
    } catch (err) {
      console.error("Error fetching available car", err);
    } finally {
      setLoadingCar(false);
    }
  };

  const handleBooking = async () => {
    if (!availableCar) return;
    try {
      await axios.post("/api/cars/book", {
        carInstanceId: availableCar.carInstanceId,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        pickupTime: formData.pickupTime,
        dropoffTime: formData.dropoffTime,
        userId: userId,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Booking error", error);
      alert("Booking failed");
    }
  };

  return (
    <div className="p-4 relative bg-white rounded-2xl">
      <h1 className="text-2xl font-bold text-center">RENT</h1>

      <div className="flex flex-col gap-4 mt-6">
        <select
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Pickup Location</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Dropoff Location</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="dropoffTime"
          value={formData.dropoffTime}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {!availableCar && (
          <button
            type="button"
            onClick={fetchAvailableCar}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            {loadingCar ? "Finding Car..." : "Check Availability"}
          </button>
        )}

        {availableCar && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">Available Car</h3>
            <p>
              <strong>Model:</strong> {availableCar.carModel?.name || "N/A"}
            </p>
            <p>
              <strong>Brand:</strong> {availableCar.carModel?.brand || "N/A"}
            </p>
            <p>
              <strong>Seats:</strong> {availableCar.carModel?.seats || "N/A"}
            </p>
            <button
              type="button"
              onClick={handleBooking}
              className="bg-green-600 text-white mt-4 px-6 py-2 rounded hover:bg-green-700 transition w-full"
            >
              Confirm Booking
            </button>
          </div>
        )}

        {bookingSuccess && (
          <p className="text-green-600 text-center mt-4">Booking successful!</p>
        )}
      </div>
    </div>
  );
}

export default RentNowForm;
