import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from '../src/config/database';
import { logger } from '../src/utils/logger';

const testLogger = logger('DB-Test');

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Construct MongoDB URI from environment variables
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

async function testDatabase() {
  try {
    testLogger.info('Starting database test...');

    // Log connection details (without sensitive data)
    testLogger.info('MongoDB connection details:', {
      user: process.env.MONGODB_USER ? '***' : 'not set',
      host: process.env.MONGODB_HOST,
      database: process.env.MONGODB_DATABASE,
    });

    testLogger.info(`Using MongoDB URI: ${MONGODB_URI.replace(/:[^:]*@/, ':***@')}`);

    // Connect to database
    testLogger.info('Connecting to database...');
    await connectDatabase(MONGODB_URI);
    testLogger.info('Successfully connected to database');

    testLogger.info('Database connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    testLogger.error('Database test failed', {
      message: errorMessage,
      stack: errorStack,
      error,
    });
    process.exit(1);
  }
}

testDatabase().catch((error) => {
  testLogger.error('Unhandled error in testDatabase:', { error });
  process.exit(1);
});
