import { describe, expect, it } from 'vitest';
import { extractVideoMetadata } from '../video.js';

describe('extractVideoMetadata', () => {
  it('extracts metadata from a sample Discord CDN video', async () => {
    const url = 'https://cdn.discordapp.com/attachments/1216631999838687303/1378272457764507718/ez-360-bruh.mp4?ex=68409d00&is=683f4b80&hm=fdbff20ca479b7a603de1b764da328b846066a32670d882b37fe36e63d703b69&';
    const filename = 'test_ez-360-bruh.mp4';
    const metadata = await extractVideoMetadata(url, filename);

    expect(metadata.duration).toBeGreaterThan(0);
    expect(metadata.width).toBeGreaterThan(0);
    expect(metadata.height).toBeGreaterThan(0);
    expect(metadata.codec).toBeDefined();
    expect(metadata.format).toBeDefined();
  }, 30000); // Increase timeout for network/ffprobe
});
