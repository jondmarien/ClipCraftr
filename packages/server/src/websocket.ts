import { FastifyInstance } from 'fastify';

export const setupWebSocket = async (app: FastifyInstance): Promise<void> => {
  app.get('/ws', { websocket: true }, (connection, _req) => {
    // Handle WebSocket connection
    app.log.info('Client connected');

    connection.socket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        app.log.info('Received message:', data);

        // Handle different message types
        switch (data.type) {
          case 'ping':
            connection.socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          // Add more message handlers as needed
        }
      } catch (error) {
        app.log.error('Error handling WebSocket message:', error);
      }
    });

    connection.socket.on('close', () => {
      app.log.info('Client disconnected');
    });
  });
};
