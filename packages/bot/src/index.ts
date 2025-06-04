import dotenv from 'dotenv';
import path from 'path';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

import { registerEvents } from './events/index.js';
import type { Command } from './types/index.js';
import { loadCommands, registerSlashCommands } from './utils/commandHandler.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
import { validateEnvVars } from './utils/env.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

class ClipCraftrClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public logger = logger('Bot');

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
    });

    // Bind methods to maintain 'this' context
    this.start = this.start.bind(this);
    this.loadAndRegisterCommands = this.loadAndRegisterCommands.bind(this);
  }

  public async start() {
    try {
      // Validate required environment variables
      this.logger.info('Validating environment variables...');
      validateEnvVars(['DISCORD_TOKEN', 'MONGODB_URI']);
      this.logger.info('Environment variables validated');

      // Connect to MongoDB
      this.logger.info('Connecting to database...');
      await connectDatabase();
      this.logger.info('Database connection established');

      // Load commands
      this.logger.info('Loading commands...');
      await this.loadAndRegisterCommands();
      this.logger.info('Commands loaded successfully');

      // Register event handlers
      this.logger.info('Registering event handlers...');
      registerEvents(this);
      this.logger.info('Event handlers registered');

      // Login to Discord
      this.logger.info('Logging in to Discord...');
      try {
        await this.login(process.env.DISCORD_TOKEN);
        this.logger.info('Bot is now running!');
      } catch (loginError) {
        this.logger.error('Failed to login to Discord', {
          error: loginError,
          message: loginError instanceof Error ? loginError.message : 'Unknown error',
          stack: loginError instanceof Error ? loginError.stack : undefined,
        });
        throw loginError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorDetails = error instanceof Error ? error : undefined;

      this.logger.error('Failed to start bot', {
        message: errorMessage,
        stack: errorStack,
        error: errorDetails,
      });

      // Add a small delay to ensure logs are written before exiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
      process.exit(1);
    }
  }

  private async loadAndRegisterCommands() {
    try {
      // Load commands from the commands directory
      await loadCommands(this);

      // Register slash commands with Discord
      await registerSlashCommands(this);

      this.logger.info(`Successfully loaded ${this.commands.size} commands`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error('Failed to load commands', {
        message: errorMessage,
        stack: errorStack,
        error: error,
      });
      throw error; // Re-throw to be caught in the start method
    }
  }
}

// Handle uncaught exceptions
process.on('unhandledRejection', (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger('Process').error('Unhandled promise rejection', {
    message: errorMessage,
    stack: errorStack,
    error: error,
  });
});

process.on('uncaughtException', (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger('Process').error('Uncaught exception', {
    message: errorMessage,
    stack: errorStack,
    error: error,
  });

  // Exit after logging uncaught exceptions
  process.exit(1);
});

// Create and start the bot
const client = new ClipCraftrClient();

// Handle process termination
process.on('SIGINT', async () => {
  logger('Process').info('Shutting down...');
  await client.destroy();
  process.exit(0);
});

// Start the application
client.start().catch((error) => {
  logger('Process').error('Failed to start bot', { error });
  process.exit(1);
});
