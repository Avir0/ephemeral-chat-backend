import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, index: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // auto-clean rooms older than 1 day (safety net)
});

export default mongoose.model('Room', RoomSchema);
