import { describe, it, beforeAll, afterAll, vi, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import addCommand from '../add.js';
import { DatabaseService } from '../../../services/DatabaseService.js';
import type { CommandInteraction, Attachment, User } from 'discord.js';

// Mock ffmpeggy (ffprobe)
vi.mock('ffmpeggy', () => ({
  ffprobe: vi.fn().mockResolvedValue({
    streams: [{
      width: 1920,
      height: 1080,
      r_frame_rate: '30/1',
      codec_name: 'h264',
      bit_rate: '4000000',
      display_aspect_ratio: '16:9'
    }],
    format: { duration: 60, format_name: 'mp4' }
  })
}));

vi.mock('discord.js', () => ({
  CommandInteraction: {
    reply: vi.fn()
  }
}));

describe('/queue add command', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'test' });
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  it('calls DatabaseService.addClip with correct data', async () => {
    const interaction = {
      isChatInputCommand: () => true,
      options: {
        getSubcommand: () => 'add',
        getAttachment: () => ({
          name: 'Auto-clip-Reaction-clipping.mp4',
          url: 'https://cdn.discordapp.com/attachments/1216631999838687303/1378271525467328574/Auto-clip-Reaction-clipping.mp4?ex=68409c22&is=683f4aa2&hm=c192063dfed6751e2b7abbd608cfcd9aa32d12e85376e2df90d55843ff8db86e&',
          size: 1_000_000,
          contentType: 'video/mp4'
        }),
        getString: () => 'normal'
      },
      user: {
        id: '123',
        username: 'TestUser',
        discriminator: '0001',
        avatar: null
      } as User,
      reply: vi.fn()
    } as unknown as CommandInteraction;

    // Spy on addClip
    const addClipSpy = vi.spyOn(DatabaseService, 'addClip').mockResolvedValue({ _id: 'clipid' } as any);

    await addCommand.execute(interaction);

    expect(addClipSpy).toHaveBeenCalled();
    const callArg = addClipSpy.mock.calls[0][0];
    expect(callArg.originalName).toBe('Auto-clip-Reaction-clipping.mp4');
    expect(callArg.fileUrl).toBe('https://cdn.discordapp.com/attachments/1216631999838687303/1378271525467328574/Auto-clip-Reaction-clipping.mp4?ex=68409c22&is=683f4aa2&hm=c192063dfed6751e2b7abbd608cfcd9aa32d12e85376e2df90d55843ff8db86e&');
    expect(callArg.metadata.width).toBe(1920);
    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.stringContaining('Video metadata extracted and stored!') })
    );
  });
});