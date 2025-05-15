import React, { useState } from 'react';
import axios from 'axios';

const CarSelection = ({ cars, searchParams, onBookingComplete }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setBookingError('');
  };
  
  const handleBookCar = async () => {
    if (!selectedCar) return;
    
    setIsBooking(true);
    setBookingError('');
    
    try {
      await axios.post('http://localhost:5000/api/cars/book', {
        carId: selectedCar._id,
        pickupLocation: searchParams.pickupLocation,
        dropoffLocation: searchParams.dropoffLocation,
        pickupTime: searchParams.pickupTime,
        dropoffTime: searchParams.dropoffTime
      });
      
      onBookingComplete();
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Error booking car. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  
  if (cars.length === 0) {
    return null; // Don't render if no cars available
  }
  
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Available Cars</h2>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Trip Details</h3>
        <p><span className="font-medium">Pickup:</span> {searchParams.pickupLocation} on {formatDate(searchParams.pickupTime)}</p>
        <p><span className="font-medium">Drop-off:</span> {searchParams.dropoffLocation} on {formatDate(searchParams.dropoffTime)}</p>
        <p><span className="font-medium">Duration:</span> {searchParams.rentalDays} day{searchParams.rentalDays !== 1 ? 's' : ''}</p>
      </div>
      
      {bookingError && (
        <div className="p-3 mb-4 rounded bg-red-100 text-red-700">
          {bookingError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {cars.map((car) => (
          <div 
            key={car._id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedCar && selectedCar._id === car._id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow'
            }`}
            onClick={() => handleCarSelect(car)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{car.name}</h3>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                {car.type.charAt(0).toUpperCase() + car.type.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-2">{car.year} {car.model}</p>
            
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">${car.pricePerDay} per day</span>
                <span className="font-bold text-lg">${car.totalPrice} total</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <button
          onClick={handleBookCar}
          disabled={!selectedCar || isBooking}
          className={`px-6 py-3 rounded-md transition-colors ${
            selectedCar
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } disabled:opacity-50`}
        >
          {isBooking ? 'Processing...' : selectedCar ? `Book ${selectedCar.name}` : 'Select a Car'}
        </button>
      </div>
    </div>
  );
};

export default CarSelection;