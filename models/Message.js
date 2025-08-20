import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  room: { type: String, index: true, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL of 1 day as fallback
});

export default mongoose.model('Message', MessageSchema);
