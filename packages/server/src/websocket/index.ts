import { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const setupWebSocket = (app: FastifyInstance): void => {
  app.ready(() => {
    if (!io) {
      io = new SocketIOServer(app.server, {
        cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },
        path: '/socket.io',
      });
      io.on('connection', (socket) => {
        app.log.info(`Socket.io client connected: ${socket.id}`);
        socket.on('disconnect', () => {
          app.log.info(`Socket.io client disconnected: ${socket.id}`);
        });
      });
    }
  });
};

export const getSocketIoInstance = (): SocketIOServer | null => io;

export const emitQueueUpdate = (data: any) => {
  if (io) io.emit('queueUpdate', data);
};

export const emitClipUpdate = (data: any) => {
  if (io) io.emit('clipUpdate', data);
};
export const emitMontageUpdate = (data: any) => {
  if (io) io.emit('montageUpdate', data);
};
