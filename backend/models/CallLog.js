import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  driverId: {
    type: String,
    required: true
  },
  callType: {
    type: String, 
    required: true
  },
  callStatus: {
    type: String, 
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const CallLog = mongoose.model('CallLog', callLogSchema);

export default CallLog;
