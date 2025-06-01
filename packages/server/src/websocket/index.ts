import { FastifyInstance } from 'fastify';

export const setupWebSocket = (app: FastifyInstance): void => {
  app.get('/ws', { websocket: true }, (connection, _req) => {
    app.log.info('WebSocket client connected');

    connection.socket.on('message', (message) => {
      app.log.info('Message received:', message);
      connection.socket.send('Message received!');
    });

    connection.socket.on('close', () => {
      app.log.info('WebSocket client disconnected');
    });
  });
};
