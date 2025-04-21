import axios from "axios";

export const getRouteDetails = async (pickup, dropoff) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    pickup
  )}&destination=${encodeURIComponent(dropoff)}&key=${apiKey}&region=lk`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch route details");
    }

    if (!data.routes.length || !data.routes[0].legs.length) {
      throw new Error("No routes found for the given locations.");
    }

    const route = data.routes[0].legs[0];
    return {
      distance: route.distance.text,
      duration: route.duration.text,
      start_address: route.start_address,
      end_address: route.end_address,
      start_location: route.start_location,
      end_location: route.end_location,
      steps: route.steps || []
    };
  } catch (error) {
    console.error("Google Maps API error:", error.message);
    throw error;
  }
};