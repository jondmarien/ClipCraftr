import { WebSocket } from 'ws';

declare module 'fastify' {
  interface FastifyInstance {
    websocketServer: WebSocket;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    socket: WebSocket;
  }
}
