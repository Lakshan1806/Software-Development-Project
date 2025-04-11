import { useState, useEffect } from "react";

import myImage from "../assets/rent.image.1.png";
import myImage2 from "../assets/rent.image.2.png";
import myImage3 from "../assets/rent.image.3.png";
import myImage4 from "../assets/rent.image.4.png";
import slide1 from "../assets/rent.slide.1.png";
import slide2 from "../assets/rent.slide.2.png";
import slide3 from "../assets/rent.slide.3.png";
import review1 from "../assets/rent.review.1.png";
import review2 from "../assets/rent.review.2.png";
import review3 from "../assets/rent.review.3.png";
import review4 from "../assets/rent.review.4.png";
import review5 from "../assets/rent.review.5.png";
import review6 from "../assets/rent.review.6.png";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from 'lucide-react';



function Rent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">RENT</h1>
      <div className="flex justify-center gap-4 mt-4">
        <Button text="Renting Options" link="/rent-options" />
        <Button text="Car Options" link="/car-options" />
        <Button text="Reviews" link="/feedback" />
      </div>
      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10">
        <Image1 />
        <Text1 />
      </div>
      <TransportationForm/>
      <div className="flex justify-center gap-6 mt-12">
        <Image src={myImage2} />
        <Image src={myImage3} />
        <Image src={myImage4} />
      </div>
      <AutoSlideshow />
      <Review />
    </div>
  );
}

function Button({ text, link }) {
  return (
    <Link to={link} className="inline-block">
      <button className="bg-transparent font-bold text-black p-2 rounded relative overflow-hidden group">
        {text}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </Link>
  );
}

function Image1() {
  return (
    <div className="w-full md:w-1/2 flex justify-center">
      <img src={myImage} alt="Car Rental" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />
    </div>
  );
}

function Text1() {
  return (
    <div className="text-center md:text-left md:w-1/2 p-4">
      <h1 className="text-2xl md:text-4xl font-bold">
        Browse our fleet and pick the perfect car for a day, a week, or even a month.
      </h1>
    </div>
  );
}

const TransportationForm = () => {
  // Available branches/cities
  const locations = [
    "Nuwarelliya",
    "Galle",
    "Colombo",
    "Jaffna",
    "Batticaloa"
  ];

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission, e.g., API call
    console.log('Form submitted:', formData);
    alert('Booking request submitted successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Transportation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Branch
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select pickup location</option>
              {locations.map((location) => (
                <option key={`pickup-${location}`} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Drop-off Branch
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select drop-off location</option>
              {locations.map((location) => (
                <option key={`dropoff-${location}`} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pickup Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pickup Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pickup Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dropoff Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Drop-off Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="dropoffDate"
                value={formData.dropoffDate}
                onChange={handleChange}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Drop-off Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                name="dropoffTime"
                value={formData.dropoffTime}
                onChange={handleChange}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-transparent text-black bg-clip-text border-3 border-yellow  py-2 px-4 rounded-md 
          hover:shadow-[0_0_15px_rgba(255,165,0,0.8)] 
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
          transition-all 
          text-lg font-semibold
          border-gradient-to-r from-yellow-400 to-orange-500 
          hover:text-yellow-400 hover:border-yellow-400"
        >
          BOOK CAR
        </button>
      </form>
    </div>
  );
};






function Image({ src }) {
  return (
    <div className="w-1/3 flex justify-center">
      <img src={src} alt="Rental Car" className="w-full max-w-xs md:max-w-sm lg:max-w-md" />
    </div>
  );
}

function AutoSlideshow() {
  const images = [slide1, slide2, slide3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4x2 mx-auto overflow-hidden mt-20">
      <div className="relative w-full h-200">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index + 1}`} className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
    </div>                                      
  );
}

function Review() {
  const images = [review1, review2, review3, review4, review5, review6];

  return (
    <div className="relative h-100 flex items-center overflow-hidden mt-12">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ x: "-100%" }}
          animate={{ x: "100vw" }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity, delay: index * 6 }}
        >
          <img src={image} alt={`Review ${index + 1}`} className="w-auto h-auto max-w-full max-h-96" />
        </motion.div>
      ))}
    </div>
  );
}

export default Rent;
 