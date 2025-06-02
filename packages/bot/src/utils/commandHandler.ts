import { REST, Routes, ApplicationCommandData, Collection, Client } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

import { Command } from '../types/index.js';
import { logger } from './logger.js';

const commandLogger = logger('CommandHandler');

interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}

/**
 * Loads all commands from the commands directory
 * @param client The Discord client
 */
export async function loadCommands(client: ExtendedClient): Promise<void> {
  if (!client.commands) {
    client.commands = new Collection();
  }

  const commandsPath = path.resolve(process.cwd(), 'src/commands');
  const commandCategories = readdirSync(commandsPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const category of commandCategories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = readdirSync(categoryPath).filter(
      (file) => (file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts')
    );

    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);

      try {
        // Convert Windows path to file URL for dynamic import
        const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`).href;
        // Use dynamic import to load the command module
        const commandModule = await import(fileUrl);
        const command: Command = commandModule.default || commandModule.command;

        if (!command || !command.name) {
          commandLogger.warn(`Command in file ${file} is missing required properties.`);
          continue;
        }

        if (client.commands.has(command.name)) {
          commandLogger.warn(
            `Duplicate command name '${command.name}' found in ${file}. Skipping.`
          );
          continue;
        }

        client.commands.set(command.name, command);
        commandLogger.debug(`Loaded command: ${command.name} (${category})`);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        commandLogger.error(`Error loading command from ${file}: ${errorMessage}`);
        if (error instanceof Error && error.stack) {
          commandLogger.debug(error.stack);
        }
      }
    }
  }

  commandLogger.info(
    `Successfully loaded ${client.commands.size} commands from ${commandCategories.length} categories`
  );
}

/**
 * Registers all slash commands with Discord
 * @param client The Discord client
 */
export async function registerSlashCommands(client: ExtendedClient): Promise<void> {
  if (!client.commands || client.commands.size === 0) {
    commandLogger.warn('No commands to register');
    return;
  }

  const commands: ApplicationCommandData[] = [];
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  // Convert commands to JSON format for Discord API
  for (const [name, command] of client.commands) {
    if (command.toJSON) {
      commands.push(command.toJSON());
    } else {
      commandLogger.warn(`Command ${name} is missing toJSON method, skipping registration`);
    }
  }

  try {
    commandLogger.info(`Started refreshing ${commands.length} application (/) commands.`);

    // Register commands based on environment
    let data: ApplicationCommandData[] = [];

    if (process.env.NODE_ENV === 'production') {
      // In production, register global commands
      commandLogger.info('Registering global commands...');
      data = (await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
        body: commands,
      })) as ApplicationCommandData[];
    } else {
      // In development, try to register guild commands if DEV_GUILD_ID is set
      if (process.env.DEV_GUILD_ID) {
        commandLogger.info(
          `Registering guild commands for development guild ${process.env.DEV_GUILD_ID}...`
        );
        data = (await rest.put(
          Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DEV_GUILD_ID),
          { body: commands }
        )) as ApplicationCommandData[];
      } else {
        // Fall back to global commands if no DEV_GUILD_ID is set
        commandLogger.warn(
          'DEV_GUILD_ID not set. Registering global commands in development mode...'
        );
        commandLogger.warn(
          'Note: Global commands can take up to an hour to update. Set DEV_GUILD_ID for instant updates.'
        );
        data = (await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
          body: commands,
        })) as ApplicationCommandData[];
      }
    }

    commandLogger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    if (error instanceof Error) {
      commandLogger.error(`Error registering commands: ${error.message}`);
      if (error.stack) {
        commandLogger.debug(error.stack);
      }
    } else {
      commandLogger.error('Unknown error occurred while registering commands');
    }
  }
}

/**
 * Gets a command by name or alias
 * @param name The command name or alias
 * @returns The command if found, otherwise undefined
 */
export function getCommand(client: ExtendedClient, name: string): Command | undefined {
  // First try to find by exact name
  const command = client.commands.get(name);
  if (command) return command;

  // Then try to find by alias
  return client.commands.find((cmd) => {
    const aliases = (cmd as unknown as { aliases?: string[] }).aliases;
    return aliases?.includes(name);
  });
}

export default {
  loadCommands,
  registerSlashCommands,
  getCommand,
};
