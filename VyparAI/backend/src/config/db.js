import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
  // Minimal startup log to make troubleshooting deployment easier.
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
