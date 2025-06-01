import { Command } from '../../types/index.js';
export default new Command({
  name: 'ping',
  description: 'Replies with Pong!',
  category: 'general',
  async execute(interaction) {
    await interaction.reply('Pong! 🏓');
  },
});
