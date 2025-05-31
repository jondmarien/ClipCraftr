import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

# Set up intents
intents = discord.Intents.default()
intents.message_content = True

# Initialize bot
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')
    try:
        synced = await bot.tree.sync()
        print(f"Synced {len(synced)} command(s)")
    except Exception as e:
        print(f"Error syncing commands: {e}")

@bot.tree.command(name="ping", description="Check if the bot is alive")
async def ping(interaction: discord.Interaction):
    await interaction.response.send_message("Pong! 🏓")

@bot.tree.command(name="clip", description="Upload a clip for montage creation")
async def clip(interaction: discord.Interaction, clip: discord.Attachment):
    if not clip.content_type.startswith('video/'):
        await interaction.response.send_message("Please upload a video file.", ephemeral=True)
        return
    
    await interaction.response.send_message(f"Clip received! 🎥 ({clip.filename})")
    # TODO: Add clip processing logic

# Run the bot
if __name__ == "__main__":
    if not TOKEN:
        print("Error: No Discord token found. Please set the DISCORD_TOKEN environment variable.")
    else:
        bot.run(TOKEN)
