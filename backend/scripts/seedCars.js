import mongoose from "mongoose";
import Car from "../models/car.model.js";

// MongoDB connection string (Update with your database URI)
const MONGO_URI = "mongodb://127.0.0.1:27017/Urban_Move"; // Change "yourDatabase" to your actual database name

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample car data
const cars = [
  {
    name: "Toyota Camry",
    model: "Camry",
    year: 2023,
    type: "sedan",
    pricePerDay: 60,
    image: "camry.jpg",
    location: "New York",
    available: true,
    bookings: [],
  },
  {
    name: "Honda Accord",
    model: "Accord",
    year: 2022,
    type: "sedan",
    pricePerDay: 55,
    image: "accord.jpg",
    location: "New York",
    available: true,
    bookings: [],
  },
  {
    name: "Tesla Model 3",
    model: "Model 3",
    year: 2023,
    type: "sedan",
    pricePerDay: 90,
    image: "tesla.jpg",
    location: "San Francisco",
    available: true,
    bookings: [],
  },
  {
    name: "BMW X5",
    model: "X5",
    year: 2022,
    type: "suv",
    pricePerDay: 120,
    image: "bmw.jpg",
    location: "Miami",
    available: true,
    bookings: [],
  },
  {
    name: "Ford F-150",
    model: "F-150",
    year: 2023,
    type: "truck",
    pricePerDay: 85,
    image: "ford.jpg",
    location: "Chicago",
    available: true,
    bookings: [],
  },
  {
    name: "Jeep Wrangler",
    model: "Wrangler",
    year: 2022,
    type: "suv",
    pricePerDay: 95,
    image: "jeep.jpg",
    location: "Los Angeles",
    available: true,
    bookings: [],
  },
  {
    name: "Toyota RAV4",
    model: "RAV4",
    year: 2023,
    type: "suv",
    pricePerDay: 75,
    image: "rav4.jpg",
    location: "Los Angeles",
    available: true,
    bookings: [],
  },
  {
    name: "Chevrolet Corvette",
    model: "Corvette",
    year: 2022,
    type: "luxury",
    pricePerDay: 150,
    image: "corvette.jpg",
    location: "Miami",
    available: true,
    bookings: [],
  },
  {
    name: "Honda Civic",
    model: "Civic",
    year: 2023,
    type: "compact",
    pricePerDay: 50,
    image: "civic.jpg",
    location: "Chicago",
    available: true,
    bookings: [],
  },
  {
    name: "Mercedes-Benz S-Class",
    model: "S-Class",
    year: 2022,
    type: "luxury",
    pricePerDay: 180,
    image: "mercedes.jpg",
    location: "New York",
    available: true,
    bookings: [],
  },
];

// Function to seed data
const seedCars = async () => {
  try {
    // Delete existing car records
    await Car.deleteMany({});
    console.log("Deleted existing car data");

    // Insert new cars
    const createdCars = await Car.insertMany(cars);
    console.log(`Seeded ${createdCars.length} cars successfully`);

    // Close database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding cars:", error.message);
    process.exit(1);
  }
};

// Run the seed function
seedCars();
