/* eslint-disable no-console */
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clipcraftr';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
};

export const registerDatabaseHooks = (_app: FastifyInstance): void => {
  // Add any database-related hooks here
};
