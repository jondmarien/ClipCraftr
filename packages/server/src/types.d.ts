// This file helps TypeScript understand our module paths
declare module './config/database';
declare module './routes';
declare module './websocket';
declare module './routes/clips';
declare module './routes/montages';
declare module './routes/auth';

import 'fastify';
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      username?: string;
      [key: string]: any;
    };
  }
}
