import {
  Events,
  Interaction,
  CommandInteraction,
  AutocompleteInteraction,
  Client,
  Collection,
  MessageFlags,
  BitFieldResolvable,
} from 'discord.js';
import type { Command } from '../types/index.js';
import { Event } from '../types/index.js';
import { logger } from '../utils/logger.js';

interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}

interface CommandWithAutocomplete extends Command {
  autocomplete: (interaction: AutocompleteInteraction) => Promise<void>;
}

const interactionLogger = logger('Interaction');

// Cooldown cache
const cooldowns = new Map<string, Map<string, number>>();

export const interactionCreate: Event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(...args: unknown[]) {
    const interaction = args[0] as Interaction;
    try {
      if (interaction.isCommand()) {
        await handleCommand(interaction);
      } else if (interaction.isAutocomplete()) {
        await handleAutocomplete(interaction);
      } else if (interaction.isButton() || interaction.isSelectMenu()) {
        // Handle buttons and select menus here if needed
        interactionLogger.debug(
          `Received ${interaction.isButton() ? 'button' : 'select menu'} interaction: ${interaction.customId}`
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      interactionLogger.error('Error handling interaction:', {
        message: errorMessage,
        stack: errorStack,
        error,
      });

      // Try to reply to the interaction if it hasn't been replied to yet
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction
          .reply({
            content: 'An error occurred while processing your request. Please try again later.',
            ephemeral: true,
          })
          .catch((replyError) => {
            console.error('Failed to send error reply:', replyError);
          });
      }
    }
  },
};

async function handleCommand(interaction: CommandInteraction) {
  const { commandName, user, client } = interaction;
  const command = (client as ExtendedClient).commands.get(commandName);

  if (!command) {
    interactionLogger.warn(`No command matching ${commandName} was found`);
    return;
  }

  // Log command usage
  interactionLogger.info(
    `Command executed: ${commandName} by ${user.tag} (${user.id}) in ${interaction.guild?.name || 'DMs'}`
  );

  // Check cooldown (cooldown is required but can be 0 for no cooldown)
  if (command.cooldown > 0) {
    const cooldownKey = `${user.id}-${command.name}`;
    const now = Date.now();

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const timestamps = cooldowns.get(command.name)!;
    const cooldownAmount = command.cooldown * 1000; // Convert to ms

    if (timestamps.has(cooldownKey)) {
      const expirationTime = timestamps.get(cooldownKey)! + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({
          content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(cooldownKey, now);
    setTimeout(() => timestamps.delete(cooldownKey), cooldownAmount);
  }

  try {
    // Execute the command
    await command.execute(interaction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    interactionLogger.error(`Error executing command ${commandName}:`, {
      message: errorMessage,
      stack: errorStack,
      error,
    });

    const errorReply = {
      content: `An error occurred: ${errorMessage}`,
      ephemeral: true,
    };

    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply(errorReply);
      } else if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorReply);
      }
    } catch (replyError) {
      console.error('Failed to send error reply to interaction:', replyError);
    }
  }
}

async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const { commandName, client } = interaction;
  const command = (client as ExtendedClient).commands.get(commandName) as
    | CommandWithAutocomplete
    | undefined;
  if (!command || !command.autocomplete) {
    interactionLogger.warn(`No autocomplete handler for command: ${commandName}`);
    return;
  }

  try {
    await command.autocomplete(interaction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    interactionLogger.error(`Error in autocomplete for ${commandName}:`, {
      message: errorMessage,
      stack: errorStack,
      error,
    });
  }
}

export default interactionCreate;
