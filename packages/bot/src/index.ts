import 'dotenv/config';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { logger } from './utils/logger';
import { registerEvents } from './events';
import { Command } from './types';
import { loadCommands, registerSlashCommands } from './utils/commandHandler';

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
      // Load commands
      await this.loadAndRegisterCommands();

      // Register event handlers
      registerEvents(this);

      // Login to Discord
      await this.login(process.env.DISCORD_TOKEN);
      this.logger.info('Bot is now running!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error('Failed to start bot', {
        message: errorMessage,
        stack: errorStack,
        error: error,
      });
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

// Start the bot
const client = new ClipCraftrClient();
client.start();
