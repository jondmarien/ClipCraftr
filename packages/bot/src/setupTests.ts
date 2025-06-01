/* eslint-disable no-console */
// Import required modules
import { config } from 'dotenv';
import path from 'path';
import { jest, beforeAll, afterAll } from '@jest/globals';

// Load environment variables
config({ path: path.resolve(process.cwd(), '../../.env') });

// Set test environment
process.env.NODE_ENV = 'test';

// Set timeout for all tests (30 seconds)
const TEST_TIMEOUT = 30000;

// Set the timeout for all tests
jest.setTimeout(TEST_TIMEOUT);

// Global setup
beforeAll(async () => {
  // Any test setup code here
  console.log('Test environment is set up');
});

// Global teardown
afterAll(async () => {
  // Any test cleanup code here
  console.log('Test environment is being torn down');
});
