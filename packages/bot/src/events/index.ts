import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

import { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

const eventLogger = logger('Events');

/**
 * Register all events from the events directory
 * @param client The Discord client
 */
export async function registerEvents(client: Client): Promise<void> {
  const eventsPath = path.resolve(process.cwd(), 'src/events');
  const eventFiles = readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))
    .filter((file) => file !== 'index.js' && file !== 'index.ts');

  const events = new Collection<string, Event>();

  // Load all event modules
  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`).href;
      const eventModule = await import(fileUrl);
      const event: Event = eventModule.default || eventModule.event;

      if (!event || !event.name) {
        eventLogger.error(`Event in file ${file} is missing required properties.`);
        continue;
      }

      if (events.has(event.name)) {
        eventLogger.warn(`Duplicate event name '${event.name}' found in ${file}. Skipping.`);
        continue;
      }

      events.set(event.name, event);
      eventLogger.debug(`Registered event: ${event.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      eventLogger.error(`Error loading event from ${file}`, {
        message: errorMessage,
        stack: errorStack,
        error: error,
      });
    }
  }

  // Register event listeners
  for (const [eventName, event] of events) {
    try {
      if (event.once) {
        client.once(eventName, (...args) => event.execute(...args));
      } else {
        client.on(eventName, (...args) => event.execute(...args));
      }
      eventLogger.info(`Registered ${event.once ? 'one-time ' : ''}event: ${eventName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      eventLogger.error(`Error registering event ${eventName}`, {
        message: errorMessage,
        stack: errorStack,
        error: error,
      });
    }
  }

  eventLogger.info(`Successfully registered ${events.size} events`);
}

// Export all event handlers for easy importing
export * from './ready.js';
export * from './interactionCreate.js';
export * from './error.js';
// Add more event exports as needed
