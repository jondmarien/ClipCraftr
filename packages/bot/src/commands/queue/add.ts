import { Command } from '../../types/index.js';
import { DatabaseService } from '../../services/DatabaseService.js';
import { CommandInteraction, CacheType } from 'discord.js';
import type { FFprobeOptions, FFprobeResult, FFprobeStream, FFprobeFormat } from 'ffmpeggy';

export default new Command({
  name: 'queue',
  description: 'Manage the video queue.',
  category: 'queue',
  options: [
    {
      name: 'add',
      description: 'Add a video clip to the queue.',
      type: 1, // SUB_COMMAND
      options: [
        {
          name: 'attachment',
          description: 'The video file to add.',
          type: 11, // ATTACHMENT
          required: true,
        },
        {
          name: 'priority',
          description: 'Priority of the clip.',
          type: 3, // STRING
          required: false,
          choices: [
            { name: 'Normal', value: 'normal' },
            { name: 'High', value: 'high' },
          ],
        },
      ],
    },
  ],
  execute: async (interaction: CommandInteraction<CacheType>) => {
    // Only handle subcommand 'add'
    if (!interaction.isChatInputCommand() || interaction.options.getSubcommand() !== 'add') return;

    const attachment = interaction.options.getAttachment('attachment', true);
    const priority = interaction.options.getString('priority') || 'normal';
    const user = interaction.user;

    // Basic validation: check file type (video/*) and size (<100MB for example)
    if (!attachment.contentType?.startsWith('video/')) {
      await interaction.reply({ content: 'Only video files are allowed.', ephemeral: true });
      return;
    }
    if (attachment.size > 100 * 1024 * 1024) { // 100MB limit
      await interaction.reply({ content: 'File size exceeds 100MB limit.', ephemeral: true });
      return;
    }

    // Step 1: Download the file to a temp directory
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');
    const { ffprobe } = await import('ffmpeggy');
    const ffmpegPath: string = (await import('ffmpeg-static')).default as unknown as string;

    const tempDir = os.tmpdir();
    const tempFileName = `clipcraftr_${user.id}_${Date.now()}_${attachment.name}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    try {
      // Download using native fetch
      const response = await fetch(attachment.url);
      if (!response.ok) throw new Error('Failed to download the file from Discord.');
      const arrayBuffer = await response.arrayBuffer();
      await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

      // Step 2: Extract metadata using ffprobe via ffmpeggy
      const probeData: FFprobeResult = await ffprobe(tempFilePath, {
        ffprobePath: ffmpegPath.replace(/ffmpeg(?:\.exe)?$/, 'ffprobe$1'), // get ffprobe path
      } as FFprobeOptions);
      const videoStream: FFprobeStream | undefined = probeData.streams?.find((s: FFprobeStream) => s.codec_type === 'video');
      const duration = Number(probeData.format?.duration) || 0;
      const width = videoStream?.width;
      const height = videoStream?.height;
      const codec = videoStream?.codec_name;
      const format = probeData.format?.format_name;

      // Step 3: Clean up temp file
      await fs.unlink(tempFilePath);

      // Step 4: Reply with extracted metadata (for now)
      await interaction.reply({
        content: `Video metadata extracted successfully!\nDuration: ${duration}s\nResolution: ${width}x${height}\nCodec: ${codec}\nFormat: ${format}`,
        ephemeral: true,
      });

      // TODO: Step 2/3/4 - Store clip metadata in MongoDB, add to queue, return queue position
    } catch (error: any) {
      // Clean up temp file if it exists
      try { await fs.unlink(tempFilePath); } catch {}
      await interaction.reply({ content: `Failed to process video: ${error.message}`, ephemeral: true });
    }
  },
});
