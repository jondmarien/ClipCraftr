import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  AutocompleteInteraction,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';

export interface CommandOptions {
  name: string;
  description: string;
  category: string;
  options?: ApplicationCommandOptionData[];
  defaultPermission?: boolean;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  guildOnly?: boolean;
  ownerOnly?: boolean;
  cooldown?: number;
  execute: (interaction: CommandInteraction) => Promise<void> | void;
}

export class Command implements CommandOptions {
  public name: string;
  public description: string;
  public category: string;
  public options: ApplicationCommandOptionData[];
  public defaultPermission: boolean;
  public userPermissions: PermissionResolvable[];
  public botPermissions: PermissionResolvable[];
  public guildOnly: boolean;
  public ownerOnly: boolean;
  public cooldown: number;
  public autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  public execute: (interaction: CommandInteraction) => Promise<void> | void;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.category = options.category || 'General';
    this.options = options.options || [];
    this.defaultPermission = options.defaultPermission ?? true;
    this.userPermissions = options.userPermissions || [];
    this.botPermissions = options.botPermissions || [];
    this.guildOnly = options.guildOnly ?? false;
    this.ownerOnly = options.ownerOnly ?? false;
    this.cooldown = options.cooldown ?? 0;
    this.execute = options.execute;
  }

  public toJSON(): ApplicationCommandData {
    // Remove defaultPermission as it's not part of ApplicationCommandData
    return {
      name: this.name,
      description: this.description,
      options: this.options,
      // defaultPermission has been removed in Discord.js v14
    };
  }
}

// Event handler types
export interface EventOptions {
  name: string;
  once?: boolean;
}

export interface Event extends EventOptions {
  execute: (...args: unknown[]) => Promise<void> | void;
  [key: string]: unknown; // Allow additional properties
}

// Cooldown types
export interface CooldownData {
  userId: string;
  command: string;
  timestamp: number;
  duration: number;
}

// Error types
export class CommandError extends Error {
  public userMessage: string;
  public isUserFacing: boolean;

  constructor(message: string, userMessage?: string, isUserFacing = true) {
    super(message);
    this.name = 'CommandError';
    this.userMessage = userMessage || message;
    this.isUserFacing = isUserFacing;
  }
}

// Context types
// Import Logger type from logger module
import type { Logger } from '../utils/logger.types.js';

export interface CommandContext {
  interaction: CommandInteraction;
  logger: Logger;
}
