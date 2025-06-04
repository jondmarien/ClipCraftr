declare module 'ffmpeggy' {
  export interface FFprobeOptions {
    ffprobePath?: string;
    [key: string]: any;
  }

  export interface FFprobeStream {
    codec_type?: string;
    width?: number;
    height?: number;
    codec_name?: string;
    [key: string]: any;
  }

  export interface FFprobeFormat {
    duration?: string | number;
    format_name?: string;
    [key: string]: any;
  }

  export interface FFprobeResult {
    streams?: FFprobeStream[];
    format?: FFprobeFormat;
    [key: string]: any;
  }

  export function ffprobe(
    filePath: string,
    options?: FFprobeOptions
  ): Promise<FFprobeResult>;
}
