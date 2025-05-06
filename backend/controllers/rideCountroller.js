import Ride from '../models/RideModel.js';
import mongoose from 'mongoose';

// Create a new ride
export const createRide = async (req, res) => {
  try {
    const { userId, pickup, dropoff, startLocation, endLocation, distance, duration, scheduledTime, steps ,ridestatus,fare} = req.body;
    
    const newRide = new Ride({
      userId,
      pickup,
      dropoff,
      startLocation,
      endLocation,
      distance,
      duration,
      fare,
      scheduledTime,
      steps,
      ridestatus: scheduledTime ? 'scheduled' : 'pending'
    });

    const savedRide = await newRide.save();
    
    res.status(201).json({
      success: true,
      message: 'Ride created successfully',
      data: savedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create ride',
      error: error.message
    });
  }
};

// Get all rides for a user
export const getUserRides = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const rides = await Ride.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user rides',
      error: error.message
    });
  }
};

// Get ride by ID
export const getRideById = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId).lean();

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ride',
      error: error.message
    });
  }
};

// Update ride status
export const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'scheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { 
        status,
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      data: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update ride status',
      error: error.message
    });
  }
};

// Update driver location
export const updateDriverLocation = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { lat, lng } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { 
        driverLocation: { lat, lng },
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver location updated successfully',
      data: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update driver location',
      error: error.message
    });
  }
};

// Cancel a ride
export const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if ride is already completed or cancelled
    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Ride is already ${ride.status} and cannot be cancelled`
      });
    }

    ride.status = 'cancelled';
    ride.lastUpdated = new Date();
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride',
      error: error.message
    });
  }
};

// Get active rides (pending or in_progress)
export const getActiveRides = async (req, res) => {
  try {
    const activeRides = await Ride.find({
      status: { $in: ['pending', 'in_progress'] }
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      data: activeRides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active rides',
      error: error.message
    });
  }
};

// Get scheduled rides
export const getScheduledRides = async (req, res) => {
  try {
    const scheduledRides = await Ride.find({
      status: 'scheduled',
      scheduledTime: { $gte: new Date() }
    }).sort({ scheduledTime: 1 }).lean();

    res.status(200).json({
      success: true,
      data: scheduledRides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled rides',
      error: error.message
    });
  }
};

// Complete a ride
export const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if ride is already completed or cancelled
    if (ride.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Ride is already completed'
      });
    }

    if (ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled ride cannot be completed'
      });
    }

    ride.status = 'completed';
    ride.lastUpdated = new Date();
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully',
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete ride',
      error: error.message
    });
  }
};
const rideCountroller = {
    createRide,
    getUserRides,
    getRideById,
    updateRideStatus,
    updateDriverLocation,
    cancelRide,
    getActiveRides,
    getScheduledRides,
    completeRide
    
  };
  
  export default rideCountroller;