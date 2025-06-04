import { io, Socket } from 'socket.io-client';
import setupApp from '../index';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

const PORT = 5001;
let server: any;

describe('WebSocket events', () => {
  let socket: Socket;

  let app: any;

  beforeAll(async () => {
    app = await setupApp();
    server = await app.listen({ port: PORT });
    socket = io(`http://localhost:${PORT}`);
    socket.on('connect', () => {});
  });

  afterAll(async () => {
    if (socket) socket.disconnect();
    if (server) await app.close();
  });

  it('should emit queueUpdate event on queue add', async () => {
    socket.once('queueUpdate', (data) => {
      expect(data.type).toBe('added');
    });
    await fetch(`http://localhost:${PORT}/api/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: { foo: 'baz' } }),
    });
  });
});
