// packages/bot/src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';

    MONGODB_URI: string;
    MONGODB_USER: string;
    MONGODB_PASSWORD: string;
    MONGODB_HOST: string;
    MONGODB_DATABASE: string;

    DISCORD_TOKEN: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_REDIRECT_URI: string;

    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;

    API_BASE_URL: string;
    API_PORT: string;

    FFMPEG_PATH: string;
  }
}
