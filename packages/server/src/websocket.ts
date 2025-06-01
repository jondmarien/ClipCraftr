/* eslint-disable no-console */
import { FastifyInstance } from 'fastify';

export const setupWebSocket = async (app: FastifyInstance): Promise<void> => {
  app.get('/ws', { websocket: true }, (connection, _req) => {
    // Handle WebSocket connection
    console.log('Client connected');

    connection.socket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle different message types
        switch (data.type) {
          case 'ping':
            connection.socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          // Add more message handlers as needed
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });

    connection.socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
};
