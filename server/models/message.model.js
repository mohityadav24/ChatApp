import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
      sender: String,
  receiver: String,
  message: String,
  time: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);