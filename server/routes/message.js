import express from "express";
import Message from "../models/message.model.js";

const router = express.Router();

// Get chat between two users
router.get("/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;

  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender }
    ]
  });

  res.json(messages);
});

export default router;
