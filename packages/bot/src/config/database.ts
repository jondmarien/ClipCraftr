import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const dbLogger = logger('Database');

export async function connectDatabase(mongoUri?: string) {
  // Use provided URI or fall back to environment variable or default
  const MONGODB_URI = mongoUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/clipcraftr';

  // Log the MongoDB URI (without password for security)
  const safeMongoUri = MONGODB_URI.replace(/:[^:]*@/, ':***@');
  dbLogger.info(`Connecting to MongoDB at: ${safeMongoUri}`);

  // Log debug information
  dbLogger.debug('MongoDB connection details:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_HOST: process.env.MONGODB_HOST || 'not set',
    MONGODB_DATABASE: process.env.MONGODB_DATABASE || 'not set',
    MONGODB_USER: process.env.MONGODB_USER ? '***' : 'not set',
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD ? '***' : 'not set',
  });

  try {
    // Set debug mode
    mongoose.set('debug', (collectionName, method, query, doc) => {
      dbLogger.debug(`Mongoose: ${collectionName}.${method}`, { query, doc });
    });

    // Connect with options
    dbLogger.debug('Attempting to connect to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      connectTimeoutMS: 10000, // 10 second connection timeout
      retryWrites: true,
      w: 'majority',
    });

    dbLogger.info('Successfully connected to MongoDB');
    dbLogger.debug('MongoDB connection details:', {
      host: connection.connection.host,
      port: connection.connection.port,
      name: connection.connection.name,
      readyState: connection.connection.readyState,
      db: connection.connection.db?.namespace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    dbLogger.error('MongoDB connection error:', { message: errorMessage, error });
    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  dbLogger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  dbLogger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  dbLogger.info('MongoDB reconnected');
});
