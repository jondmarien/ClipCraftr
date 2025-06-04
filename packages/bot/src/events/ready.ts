import { Client, Events } from 'discord.js';
import { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

const readyLogger = logger('Ready');

export const ready: Event = {
  name: Events.ClientReady,
  once: true,
  execute: async (...args: unknown[]) => {
    const client = args[0] as Client;
    if (!client.user) {
      readyLogger.error('Client user is not available');
      return;
    }

    const { username, id } = client.user;
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot%20applications.commands`;

    readyLogger.info(`Logged in as ${username} (${id})`);
    readyLogger.info(`Bot invite link: ${inviteLink}`);

    // Set custom status
    try {
      await client.user.setPresence({
        activities: [
          {
            name: '/help | ClipCraftr',
            type: 3, // WATCHING
          },
        ],
        status: 'online',
      });
      readyLogger.info('Bot is now online and ready!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      readyLogger.error('Failed to set bot presence', {
        message: errorMessage,
        stack: errorStack,
        error,
      });
      readyLogger.info('Bot is online but presence setting failed');
    }
  },
};

export default ready;
