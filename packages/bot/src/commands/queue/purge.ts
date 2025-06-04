import { Command } from '../../types/index.js';
import { Clip } from '../../models/Clip.js';
import { CommandInteraction, CacheType } from 'discord.js';



export default new Command({
  name: 'purgeclips',
  description: '[INTERNAL] Purge all clips from the database (dangerous)',
  category: 'queue',
  defaultPermission: false,
  options: [],
  execute: async (interaction: CommandInteraction<CacheType>) => {
    console.log('[DEBUG] BOT_OWNER_ID:', process.env.BOT_OWNER_ID);
    const ownerId = process.env.BOT_OWNER_ID;
    console.log('[DEBUG] BOT_OWNER_ID (in execute):', ownerId);
    if (!ownerId) {
      await interaction.reply({
        content: 'BOT_OWNER_ID is not set in the environment variables.',
        ephemeral: true
      });
      return;
    }
    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true
      });
      return;
    }
    try {
      const result = await Clip.deleteMany({});
      const msg = `Purged ${result.deletedCount} clips from the database.`;
      console.log(msg);
      await interaction.reply({
        content: msg,
        ephemeral: true
      });
    } catch (error: any) {
      const msg = `Failed to purge clips: ${error.message}`;
      console.error(msg);
      await interaction.reply({
        content: msg,
        ephemeral: true
      });
    }
  }
});
