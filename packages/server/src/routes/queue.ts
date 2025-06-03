import { FastifyInstance } from 'fastify';
import { emitQueueUpdate } from '../websocket';

// Simple in-memory queue and mission status (replace with DB in production)
let queue: { id: string; payload: any }[] = [];
let missionStatus: 'idle' | 'processing' | 'error' = 'idle';

export const registerQueueRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get current queue
  app.get('/api/queue', async (_req, _reply) => {
    return { queue };
  });

  // Add to queue
  app.post('/api/queue', async (req, _reply) => {
    const payload = req.body;
    const id = Math.random().toString(36).slice(2, 10);
    const item = { id, payload };
    queue.push(item);
    emitQueueUpdate({ type: 'added', item, queue });
    return { message: 'Added to queue', item };
  });

  // Remove from queue
  app.delete('/api/queue/:id', async (req, _reply) => {
    const { id } = req.params as { id: string };
    queue = queue.filter((item) => item.id !== id);
    emitQueueUpdate({ type: 'removed', id, queue });
    return { message: 'Removed from queue', id };
  });

  // Get mission status
  app.get('/api/mission-status', async (_req, _reply) => {
    return { missionStatus };
  });

  // Set mission status (for testing/demo)
  app.post('/api/mission-status', async (req, _reply) => {
    const { status } = req.body as { status: typeof missionStatus };
    missionStatus = status;
    emitQueueUpdate({ type: 'status', missionStatus });
    return { message: 'Mission status updated', missionStatus };
  });
};
