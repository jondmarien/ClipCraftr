import { Command } from '../../types/index.js';
import { DatabaseService } from '../../services/DatabaseService.js';
import { CommandInteraction, CacheType } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { ClipStatus } from '../../models/Clip.js';


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

    // Prefer environment variables for ffmpeg/ffprobe paths, fallback to ffmpeg-static if not set
    const ffmpegPath = process.env.FFMPEG_PATH || (await import('ffmpeg-static')).default as string;
    const ffprobePath = process.env.FFPROBE_PATH || ffmpegPath.replace(/ffmpeg(\.exe)?$/, (m, ext) => `ffprobe${ext || ''}`);

    // Check if ffmpeg exists
    try {
      await fs.access(ffmpegPath);
    } catch {
      throw new Error('ffmpeg binary not found at the specified path. Please check FFMPEG_PATH in your .env.');
    }
    // Check if ffprobe exists
    try {
      await fs.access(ffprobePath);
    } catch {
      throw new Error('ffprobe binary not found at the specified path. Please check FFPROBE_PATH in your .env.');
    }

    const tempDir = os.tmpdir();
    const tempFileName = `clipcraftr_${user.id}_${Date.now()}_${attachment.name}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    try {
      // Download using native fetch
      const response = await fetch(attachment.url);
      if (!response.ok) throw new Error('Failed to download the file from Discord.');
      const arrayBuffer = await response.arrayBuffer();
      await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

      // Step 2: Extract metadata using fluent-ffmpeg and ffmpeg-static
      const ffmpeg = (await import('fluent-ffmpeg')).default;
      ffmpeg.setFfmpegPath(ffmpegPath);
      ffmpeg.setFfprobePath(ffprobePath);

      const probeData = await new Promise<any>((resolve, reject) => {
        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
          if (err) return reject(err);
          resolve(metadata);
        });
      });
      const videoStream = probeData.streams?.find((s: any) => s.codec_type === 'video');
      const duration = Number(probeData.format?.duration) || 0;
      const width = videoStream?.width;
      const height = videoStream?.height;
      const codec = videoStream?.codec_name;
      const format = probeData.format?.format_name;

      // Step 3: Clean up temp file
      await fs.unlink(tempFilePath);

      // Step 4: Store clip metadata in MongoDB
      try {
        // Find or create user (ensure user exists in DB)
        const dbUser = await DatabaseService.findOrCreateUser({
          discordId: user.id,
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar ?? undefined,
        });

        // Compose IClip data (adjust fields as needed)
        // Ensure dbUser._id is always a Types.ObjectId
        const { Types } = await import('mongoose');
        const userId = dbUser._id instanceof Types.ObjectId ? dbUser._id : new Types.ObjectId(String(dbUser._id));

        const clipData = {
          id: uuidv4(),
          originalName: attachment.name,
          fileName: tempFileName,
          filePath: tempFilePath, // temp path, but you may want to update to permanent storage after processing
          fileUrl: attachment.url,
          fileSize: attachment.size,
          duration,
          mimeType: attachment.contentType || '',
          userId, // always correct type
          status: 'uploading' as ClipStatus,
          metadata: {
            width: width || 0,
            height: height || 0,
            fps: videoStream?.r_frame_rate ? eval(videoStream.r_frame_rate) : 0,
            codec: codec || '',
            bitrate: videoStream?.bit_rate ? Number(videoStream.bit_rate) : 0,
            aspectRatio: videoStream?.display_aspect_ratio || '',
          },
          isPublic: false,
          tags: [],
          usedInMontages: [],
          uploadedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          // Do NOT set id here; let Mongoose generate _id
        };


        console.log('clipData to insert:', clipData);
        await DatabaseService.addClip(clipData);

        await interaction.reply({
          content: `Video metadata extracted and stored!\nDuration: ${duration}s\nResolution: ${width}x${height}\nCodec: ${codec}\nFormat: ${format}`,
          ephemeral: true,
        });
      } catch (dbError: any) {
        try { await fs.unlink(tempFilePath); } catch {}
        console.error('Failed to store clip in database:', dbError);
        await interaction.reply({ content: `Failed to store clip in database: ${dbError.message}`, ephemeral: true });
        return;
      }

      // TODO: Next steps - add to queue, return queue position
    } catch (error: any) {
      // Clean up temp file if it exists
      try { await fs.unlink(tempFilePath); } catch {}
      console.error('Failed to process video:', error);
      // Send a generic error to Discord (no paths, no sensitive info)
      await interaction.reply({
        content: 'Failed to process video: Required video tools (ffmpeg/ffprobe) are not installed or accessible. Please contact the server admin.',
        ephemeral: true,
      });
      return;
    }
  },
});
