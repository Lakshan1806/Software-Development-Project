import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ridecar from "../assets/Ride-pics/ridecar.svg";
import Earnings from "./Earnings";
import { useNavigate } from "react-router-dom";
import Communication from "./Communication";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

function Ride() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [mapUrl, setMapUrl] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [rideId, setRideId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledRides, setScheduledRides] = useState([]);
  const [showScheduledRides, setShowScheduledRides] = useState(false);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setPickupSuggestions([]);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target)) {
        setDropoffSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check geolocation permissions on component mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            console.log(
              "Geolocation permission changed to:",
              permissionStatus.state
            );
          };
        });
    }
    
    // Load scheduled rides on component mount
    fetchScheduledRides();
  }, []);

  // Clean up tracking interval on unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

 // Change the fetchScheduledRides function to match the correct endpoint:
const fetchScheduledRides = async () => {
  try {
    const response = await axios.get("http://localhost:5000/rides/scheduled"); // Note the "/rides/" prefix
    if (response.data.status === "SUCCESS") {
      const futureRides = response.data.rides.filter(ride => 
        new Date(ride.scheduledTime) > new Date()
      );
      setScheduledRides(futureRides);
    }
  } catch (err) {
    console.error("Error fetching scheduled rides:", err);
  }
};

  // Fetch location suggestions
  const fetchSuggestions = async (input, isPickup) => {
    if (input.length < 2) {
      isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
      return;
    }

    setIsFetchingSuggestions(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/location/autocomplete?input=${encodeURIComponent(input)}`
      );

      if (response.data.suggestions) {
        isPickup
          ? setPickupSuggestions(response.data.suggestions)
          : setDropoffSuggestions(response.data.suggestions);
      }
    } catch (err) {
      console.error("Autocomplete error:", err);
      isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  // Debounce the autocomplete requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeInput === "pickup" && pickup) {
        fetchSuggestions(pickup, true);
      } else if (activeInput === "dropoff" && dropoff) {
        fetchSuggestions(dropoff, false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pickup, dropoff, activeInput]);

  // Get current location and address
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage;
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  "Location access was denied. Please enable permissions in your browser settings.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMessage = "The request to get location timed out.";
                break;
              default:
                errorMessage = "An unknown error occurred.";
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log("Got coordinates:", latitude, longitude);

      // Get address from coordinates
      const response = await axios.get(
        `http://localhost:5000/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
      );

      if (response.data.status === "SUCCESS") {
        setPickup(response.data.address);
        setPickupSuggestions([]);
      } else {
        throw new Error(response.data.message || "Failed to get address");
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(error.message || "Failed to get your location");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSuggestionClick = (suggestion, isPickup) => {
    isPickup
      ? setPickup(suggestion.description)
      : setDropoff(suggestion.description); 
    isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
    setActiveInput(null);
  };

  const handleInputFocus = (inputType) => {
    setActiveInput(inputType);
    if (inputType === "pickup" && pickup.length >= 2) {
      fetchSuggestions(pickup, true);
    } else if (inputType === "dropoff" && dropoff.length >= 2) {
      fetchSuggestions(dropoff, false);
    }
  };

  const startLiveTracking = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/location/start-tracking",
        {
          rideId,
        }
      );

      if (response.data.status === "SUCCESS") {
        setIsTracking(true); 
        // Start polling for driver location updates
        const interval = setInterval(fetchDriverLocation, 5000);
        setTrackingInterval(interval);
      } else {
        throw new Error(response.data.message || "Failed to start tracking");
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to start tracking"
      );
    }
  };

  const fetchDriverLocation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/location/ride-status/${rideId}`
      );

      if (response.data.status === "SUCCESS") {
        setDriverLocation(response.data.driverLocation);
        setProgress(response.data.progress);

        // Update map URL with current driver location
        if (response.data.driverLocation && routeDetails) {
          const apiKey = process.env.GOOGLE_MAPS_API_KEY;
          const newMapUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${response.data.driverLocation.lat},${response.data.driverLocation.lng}&destination=${encodeURIComponent(dropoff)}&zoom=13`;
          setMapUrl(newMapUrl);
        }
      }
    } catch (err) {
      console.error("Error fetching driver location:", err);
    }
  };

  const simulateDriverMovement = async () => {
    if (!driverLocation) return;

    const newLat = driverLocation.lat + 0.001;
    const newLng = driverLocation.lng + 0.001;

    try {
      await axios.post("http://localhost:5000/location/update-location", {
        rideId,
        lat: newLat,
        lng: newLng,
      });

      await fetchDriverLocation();
    } catch (err) {
      console.error("Error updating driver location:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup.trim() || !dropoff.trim()) {
      setError("Please enter both pickup and dropoff locations");
      return;
    }

    setLoading(true);
    setError(null);
    setRouteDetails(null);
    setMapUrl(null);
    setIsTracking(false);
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/location/track",
        {
          pickup: pickup.trim(),
          dropoff: dropoff.trim(),
        }
      );

      if (response.data.status === "SUCCESS") {
        setRouteDetails(response.data);
        setMapUrl(response.data.map_embed_url);
        setRideId(response.data.rideId);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch route details"
        );
      }
    } catch (err) {
      console.error("Route calculation error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to calculate route"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleRide = async () => {
    if (!pickup.trim() || !dropoff.trim()) {
      setError("Please enter both pickup and dropoff locations");
      return;
    }

    setIsScheduling(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/rides/schedule",
        {
          pickup: pickup.trim(),
          dropoff: dropoff.trim(),
          scheduledTime: scheduledTime.toISOString(),
        }
      );

      if (response.data.status === "SUCCESS") {
        alert("Ride scheduled successfully!");
        setShowScheduleForm(false);
        fetchScheduledRides();
      } else {
        throw new Error(response.data.message || "Failed to schedule ride");
      }
    } catch (err) {
      console.error("Scheduling error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to schedule ride"
      );
    } finally {
      setIsScheduling(false);
    }
  };

  const handleStartRide = () => {
    startLiveTracking();
    const simulationInterval = setInterval(simulateDriverMovement, 3000);
    return () => clearInterval(simulationInterval);
  };

  const cancelScheduledRide = async (rideId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/rides/scheduled/${rideId}`
      );

      if (response.data.status === "SUCCESS") {
        alert("Ride cancelled successfully");
        fetchScheduledRides();
      } else {
        throw new Error(response.data.message || "Failed to cancel ride");
      }
    } catch (err) {
      console.error("Error cancelling ride:", err);
      alert(err.response?.data?.message || "Failed to cancel ride");
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full max-w-screen">
      <Communication/>
      <Earnings/>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8 md:px-8">
        <div className="w-full lg:w-1/2 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent">
            Request a ride for immediate pickup or schedule one for later
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-black p-6 md:p-8 rounded-3xl shadow-xl border-2 border-[#FF7C1D] space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2 relative" ref={pickupRef}>
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 font-medium text-[#FF7C1D]">
                    <MapPinIcon />
                    Pickup Location
                  </label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation || loading}
                    className="flex items-center gap-1 text-sm text-[#FFD12E] hover:text-[#FF7C1D] transition-colors disabled:opacity-50"
                  >
                    {isGettingLocation ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Locating...
                      </>
                    ) : (
                      <>
                        <LocationIcon />
                        Use Current Location
                      </>
                    )}
                  </button>

                  {locationError && (
                    <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm mt-2">
                      <p className="font-medium">Location Error</p>
                      <p>{locationError}</p>
                      <button
                        onClick={() => setLocationError(null)}
                        className="text-blue-600 hover:underline mt-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onFocus={() => handleInputFocus("pickup")}
                  className="w-full p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#FF7C1D] outline-none"
                  placeholder="E.g., Colombo Fort"
                  disabled={loading}
                />
                {isFetchingSuggestions && activeInput === "pickup" && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-3 text-gray-500">
                      Searching locations...
                    </div>
                  </div>
                )}
                {pickupSuggestions.length > 0 &&
                  activeInput === "pickup" &&
                  !isFetchingSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {pickupSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                          onClick={() =>
                            handleSuggestionClick(suggestion, true)
                          }
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="space-y-2 relative" ref={dropoffRef}>
                <label className="flex items-center gap-2 font-medium text-[#FF7C1D]">
                  <MapPinIcon />
                  Drop-off Location
                </label>
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  onFocus={() => handleInputFocus("dropoff")}
                  className="w-full p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-[#FF7C1D] outline-none"
                  placeholder="E.g., Kandy City Center"
                  disabled={loading}
                />
                {isFetchingSuggestions && activeInput === "dropoff" && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-3 text-gray-500">
                      Searching locations...
                    </div>
                  </div>
                )}
                {dropoffSuggestions.length > 0 &&
                  activeInput === "dropoff" &&
                  !isFetchingSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {dropoffSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                          onClick={() =>
                            handleSuggestionClick(suggestion, false)
                          }
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {showScheduleForm && (
              <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-medium text-[#FFD12E]">
                  Schedule Your Ride
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Date & Time
                  </label>
                  <DatePicker
                    selected={scheduledTime}
                    onChange={(date) => setScheduledTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleScheduleRide}
                    disabled={isScheduling}
                    className="px-4 py-2 bg-[#FF7C1D] text-white rounded hover:bg-[#FF6C1D] disabled:opacity-50"
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {locationError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Location Error</p>
                  <p className="text-sm">{locationError}</p>
                </div>
              </div>
            )}

            {routeDetails && (
              <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#FFD12E]">
                  <ClockIcon />
                  <p className="font-medium">{routeDetails.duration}</p>
                </div>
                <div className="flex flex-col gap-1 text-gray-200">
                  <p className="flex items-center gap-2">
                    <span className="text-[#FF7C1D]">From:</span>
                    {routeDetails.start_address}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#FF7C1D]">To:</span>
                    {routeDetails.end_address}
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#FFD12E]">
                    Distance: {routeDetails.distance}
                  </p>
                </div>

                {isTracking && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Driver is on the way</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-[#FF7C1D] h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    {driverLocation && (
                      <p className="text-sm text-gray-400 mt-1">
                        Driver location: {driverLocation.lat.toFixed(4)},{" "}
                        {driverLocation.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {!routeDetails ? (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-black font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      "GET PRICE"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                    className="flex-1 px-6 py-3 border-2 border-[#ad9481] text-[#FF7C1D] font-medium rounded-full hover:bg-[#FF7C1D]/10 transition-colors"
                    disabled={loading}
                  >
                    {showScheduleForm ? "CANCEL SCHEDULE" : "SCHEDULE LATER"}
                  </button>
                </>
              ) : (
                <>
                  {!isTracking ? (
                    <button
                      type="button"
                      onClick={handleStartRide}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-black font-medium rounded-full hover:opacity-90 transition-opacity"
                    >
                      START RIDE
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(`/ride/${rideId}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity"
                    >
                      LIVE TRACKING ACTIVE
                    </button>
                  )}
                </>
              )}
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowScheduledRides(!showScheduledRides)}
              className="w-full py-2 bg-gray-800 text-[#FFD12E] rounded-lg hover:bg-gray-700 transition-colors"
            >
              {showScheduledRides ? "Hide" : "View"} Scheduled Rides
            </button>

            {showScheduledRides && (
              <div className="mt-4 bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-[#FFD12E] mb-3">
                  Your Scheduled Rides
                </h3>
                {scheduledRides.length === 0 ? (
                  <p className="text-gray-400">No scheduled rides found</p>
                ) : (
                  <ul className="space-y-3">
                    {scheduledRides.map((ride) => (
                      <li
                        key={ride._id}
                        className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="text-[#FF7C1D]">
                            {new Date(ride.scheduledTime).toLocaleString()}
                          </p>
                          <p className="text-gray-300">
                            {ride.pickup} → {ride.dropoff}
                          </p>
                        </div>
                        <button
                          onClick={() => cancelScheduledRide(ride._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-md relative">
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="text-white text-lg flex items-center gap-2">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading map...
                </div>
              </div>
            )}
            {mapUrl ? (
              <iframe
                title="Route Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
                onError={() =>
                  setError("Failed to load map. Please try again.")
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                {loading || isGettingLocation ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="animate-spin h-8 w-8 text-[#FF7C1D]"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                ) : (
                  <img
                    src={ridecar}
                    alt="Ride illustration"
                    className="w-1/2 h-1/2 object-contain opacity-50"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ride;