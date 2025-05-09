import express from 'express';
import CallLog from '../models/CallLog.js';  

const router = express.Router();

router.post('/call-log', async (req, res) => {
  try {
    const { userId, driverId, callType, callStatus } = req.body;

    const newCallLog = new CallLog({
      userId,
      driverId,
      callType,
      callStatus
    });

    await newCallLog.save();
    res.status(201).json(newCallLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save call log', message: err.message });
  }
});

router.get('/call-logs', async (req, res) => {
  try {
    const callLogs = await CallLog.find();
    res.status(200).json(callLogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve call logs', message: err.message });
  }
});

export default router;
