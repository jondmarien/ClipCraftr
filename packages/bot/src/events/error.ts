import { Events } from 'discord.js';
import { Event } from '../types';
import { logger } from '../utils/logger';

const errorLogger = logger('Error');

export const error: Event = {
  name: Events.Error,
  once: false,
  execute(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    errorLogger.error('An error occurred', {
      message: errorMessage,
      stack: errorStack,
      error,
    });
  },
};

export default error;
