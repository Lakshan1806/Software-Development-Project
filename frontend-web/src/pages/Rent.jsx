import { useState, useEffect } from "react";
import myImage from "../assets/rent.image.1.png";
import myImage2 from "../assets/rent.image.2.png";
import myImage3 from "../assets/rent.image.3.png";
import myImage4 from "../assets/rent.image.4.png";
import { Link } from "react-router-dom";
import axios from "axios";
import CarSelection from "./CarSelection.jsx";



function Rent() {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
    document.body.style.overflow = 'auto'; // prevent scroll
  };

  const handleCloseForm = () => {
    setShowForm(false);
    document.body.style.overflow = 'auto'; // re-enable scroll
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold text-center">RENT</h1>

      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10">
        <Image1 />
        <Text1 />
      </div>

      {!showForm && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleShowForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rent Now
          </button>
        </div>
      )}

      {/* Image grid */}
      <div className="flex justify-center gap-12 mt-12">
        <Image src={myImage2} />
        <Image src={myImage3} />
        <Image src={myImage4} />
      </div>

      <Slideshow />

      {/* Modal and Overlay */}
      {showForm && (
        <>
          {/* Blurred background overlay */}
          <div className="fixed inset-0  backdrop-blur"></div>

          {/* Popup modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-xl">
              {/* Close button */}
              <button
                onClick={handleCloseForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold z-10"
              >
                &times;
              </button>

              <RentNowForm onClose={handleCloseForm} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function RentNowForm() {
  // List of available cities
  const availableCities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Miami",
    "San Francisco",
  ];

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    dropoffTime: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableCars, setAvailableCars] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [showCarSelection, setShowCarSelection] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If we were showing cars and the user changes any form data,
    // hide the car selection until they search again
    if (showCarSelection) {
      setShowCarSelection(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Search for available cars
      const response = await axios.get(
        "http://localhost:5000/api/cars/available",
        {
          params: formData,
        }
      );

      setAvailableCars(response.data.data.cars);
      setSearchParams(response.data.data);
      setShowCarSelection(true);

      // If no cars are available, show a message
      if (response.data.data.cars.length === 0) {
        setMessage(
          "No cars available for the selected time and location. Please try different dates or locations."
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error searching for available cars"
      );
      setShowCarSelection(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Rent Now
        </h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded ${message.includes("Error") || message.includes("No cars") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="pickupLocation"
              className="block text-gray-700 font-medium mb-2"
            >
              Pickup Location
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Pickup City</option>
              {availableCities.map((city) => (
                <option key={`pickup-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="dropoffLocation"
              className="block text-gray-700 font-medium mb-2"
            >
              Drop-off Location
            </label>
            <select
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Drop-off City</option>
              {availableCities.map((city) => (
                <option key={`dropoff-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="pickupTime"
              className="block text-gray-700 font-medium mb-2"
            >
              Pickup Time
            </label>
            <input
              type="datetime-local"
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="dropoffTime"
              className="block text-gray-700 font-medium mb-2"
            >
              Drop-off Time
            </label>
            <input
              type="datetime-local"
              id="dropoffTime"
              name="dropoffTime"
              value={formData.dropoffTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Find Available Cars"}
          </button>
        </form>
      </div>

      {showCarSelection && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {availableCars.map((car, index) => (
      <div key={index} className="border rounded shadow p-4">
        <img src={car.imageUrl} alt={car.model} className="w-full h-40 object-cover mb-2" />
        <h3 className="text-lg font-bold">{car.brand} {car.model}</h3>
        <p>Seats: {car.seats}</p>
        <button
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => handleBooking(carInstances[index]._id)}
        >
          Book Now
        </button>
      </div>
    ))}
  </div>
)}
    </div>
  );
}


function Image1() {
  return (
    <div className="w-full md:w-1/2 flex justify-center">
      <img
        src={myImage}
        alt="Car Rental"
        className="w-full max-w-sm md:max-w-md lg:max-w-lg"
      />
    </div>
  );
}

function Text1() {
  return (
    <div className="text-center md:text-left md:w-1/2 p-4">
      <h1 className="text-2xl md:text-4xl font-bold">
        Browse our fleet and pick the perfect car for a day, a week, or even a
        month.
      </h1>
    </div>
  );
}
function Image({ src }) {
  return (
    <div className="w-1/3 flex justify-center">
      <img
        src={src}
        alt="Rental Car"
        className="w-full max-w-xs md:max-w-sm lg:max-w-md"
      />
    </div>
  );
}

function Slideshow() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user/slideshow_images");
        console.log("image", response);
        setImages(response.data);
      } catch (error) {
        console.log(Error);
      }
    };

    fetchData();
  }, []);

  const slideshowPath = [];
  images.map((image) => slideshowPath.push(image.keyImage));
  console.log(slideshowPath);
  useEffect(() => {
    if (slideshowPath.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideshowPath.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshowPath]);

  if (slideshowPath.length === 0) return <div>Loading slideshow...</div>;

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-xl overflow-hidden shadow-md gap-12 mt-12">
      <img
        src={slideshowPath[current]}
        alt="slideshow"
        className="w-full h-full object-cover transition-all duration-500"
      />
    </div>
  );
}



export default Rent;
