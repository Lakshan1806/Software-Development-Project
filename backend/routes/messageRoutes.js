// routes/messageRoutes.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET all messages by roomId
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to get messages" });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, message, roomId } = req.body;
    const newMessage = new Message({ senderId, receiverId, message, roomId });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
