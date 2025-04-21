import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getRouteDetails } from "../utils/getRouteDetails.js";

const router = express.Router();

// In-memory storage for active rides (in production, use a database)
const activeRides = new Map();

// Google Maps Places Autocomplete endpoint
router.get("/autocomplete", async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 2) {
    return res.status(400).json({ 
      message: "Input must be at least 2 characters long",
      status: "INVALID_REQUEST"
    });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:lk`;

    const response = await axios.get(autocompleteUrl);
    const data = response.data;

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(data.error_message || "Failed to fetch suggestions");
    }

    const suggestions = data.predictions.map(prediction => ({
      description: prediction.description,
      place_id: prediction.place_id
    }));

    res.json({
      suggestions,
      status: data.status
    });

  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to get autocomplete suggestions",
      status: "ERROR"
    });
  }
});

// Track endpoint
router.post("/track", async (req, res) => {
  const { pickup, dropoff } = req.body;

  if (!pickup || !dropoff) {
    return res.status(400).json({ 
      message: "Pickup and dropoff locations are required",
      status: "INVALID_REQUEST"
    });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&key=${apiKey}&region=lk`;
    
    const response = await axios.get(directionsUrl);
    const data = response.data;

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch route details");
    }

    const route = data.routes[0].legs[0];
    const mapEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&zoom=13`;
    
    // Generate a unique ride ID
    const rideId = uuidv4();
    
    // Store ride details
    activeRides.set(rideId, {
      pickup,
      dropoff,
      startLocation: route.start_location,
      endLocation: route.end_location,
      driverLocation: route.start_location, // Initially at pickup
      status: "pending",
      lastUpdated: new Date(),
      steps: route.steps || []
    });

    res.json({
      rideId,
      distance: route.distance.text,
      duration: route.duration.text,
      start_address: route.start_address,
      end_address: route.end_address,
      map_embed_url: mapEmbedUrl,
      status: "SUCCESS"
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to get route details",
      status: "ERROR"
    });
  }
});

// Start live tracking
router.post("/start-tracking", async (req, res) => {
  const { rideId } = req.body;

  if (!rideId) {
    return res.status(400).json({ 
      message: "Ride ID is required",
      status: "INVALID_REQUEST"
    });
  }

  if (!activeRides.has(rideId)) {
    return res.status(404).json({ 
      message: "Ride not found",
      status: "NOT_FOUND"
    });
  }

  const ride = activeRides.get(rideId);
  ride.status = "in_progress";
  ride.lastUpdated = new Date();
  activeRides.set(rideId, ride);

  res.json({
    status: "SUCCESS",
    message: "Live tracking started"
  });
});

// Update driver location
router.post("/update-location", async (req, res) => {
  const { rideId, lat, lng } = req.body;

  if (!rideId || !lat || !lng) {
    return res.status(400).json({ 
      message: "Ride ID and coordinates are required",
      status: "INVALID_REQUEST"
    });
  }

  if (!activeRides.has(rideId)) {
    return res.status(404).json({ 
      message: "Ride not found",
      status: "NOT_FOUND"
    });
  }

  const ride = activeRides.get(rideId);
  ride.driverLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
  ride.lastUpdated = new Date();
  activeRides.set(rideId, ride);

  res.json({
    status: "SUCCESS",
    message: "Location updated"
  });
});

// Get ride status
router.get("/ride-status/:rideId", (req, res) => {
  const { rideId } = req.params;

  if (!activeRides.has(rideId)) {
    return res.status(404).json({ 
      message: "Ride not found",
      status: "NOT_FOUND"
    });
  }

  const ride = activeRides.get(rideId);
  
  res.json({
    status: "SUCCESS",
    rideStatus: ride.status,
    driverLocation: ride.driverLocation,
    lastUpdated: ride.lastUpdated,
    progress: calculateRouteProgress(ride)
  });
});

// Helper function to calculate route progress
function calculateRouteProgress(ride) {
  if (!ride.steps || ride.steps.length === 0) return 0;
  
  // Simplified progress calculation - in a real app, you'd use more sophisticated geospatial calculations
  const totalDistance = getDistanceFromLatLonInKm(
    ride.startLocation.lat,
    ride.startLocation.lng,
    ride.endLocation.lat,
    ride.endLocation.lng
  );
  
  const completedDistance = getDistanceFromLatLonInKm(
    ride.startLocation.lat,
    ride.startLocation.lng,
    ride.driverLocation.lat,
    ride.driverLocation.lng
  );
  
  return Math.min(100, Math.max(0, (completedDistance / totalDistance) * 100));
}

// Helper function to calculate distance between coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Reverse geocode endpoint
router.get("/reverse-geocode", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ 
      message: "Latitude and longitude are required",
      status: "INVALID_REQUEST"
    });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${9.382927},${80.573134}&key=${apiKey}`;

    const response = await axios.get(geocodeUrl);
    const data = response.data;

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch address details");
    }

    if (!data.results.length) {
      throw new Error("No address found for these coordinates");
    }

    res.json({
      address: data.results[0].formatted_address,
      status: "SUCCESS"
    });

  } catch (error) {
    console.error("Reverse geocode error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to get address from coordinates",
      status: "ERROR"
    });
  }
});

export default router;