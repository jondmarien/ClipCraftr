import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export interface VideoMetadata {
  duration: number;
  width: number | undefined;
  height: number | undefined;
  codec: string | undefined;
  format: string | undefined;
}

export async function extractVideoMetadata(url: string, filename: string): Promise<VideoMetadata> {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, filename);
  try {
    const ffmpegPath: string = (await import('ffmpeg-static')).default as unknown as string;
    // Download
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download');
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

    // Use FFmpeg from ffmpeggy to run ffprobe
    const ffmpeggy = await import('ffmpeggy');
    const ffmpeg = new ffmpeggy.({ ffprobePath: ffmpegPath.replace(/ffmpeg(?:\.exe)?$/, 'ffprobe$1') });
    const result = await ffmpeg.ffprobe([
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      tempFilePath
    ]);
    const probeData = JSON.parse(result.stdout);
    const videoStream = probeData.streams?.find((s: any) => s.codec_type === 'video');
    const duration = Number(probeData.format?.duration) || 0;
    const width = videoStream?.width;
    const height = videoStream?.height;
    const codec = videoStream?.codec_name;
    const format = probeData.format?.format_name;

    await fs.unlink(tempFilePath);

    return { duration, width, height, codec, format };

  } catch (err: any) {
    // Logging error to logs/errors
    try {
      const logsDir = path.resolve(process.cwd(), 'logs', 'errors');
      await fs.mkdir(logsDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const logPath = path.join(logsDir, `error-${timestamp}.log`);
      const errorMsg = `extractVideoMetadata error @ ${timestamp}\n` +
        `${err.stack || err.message || err}\n`;
      await fs.writeFile(logPath, errorMsg, { encoding: 'utf-8' });
    } catch (logErr) {
      console.error('Failed to write error log:', logErr);
    }
    throw err;
  }
}

