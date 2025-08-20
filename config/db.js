import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('Missing MongoDB URI');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected');
}
