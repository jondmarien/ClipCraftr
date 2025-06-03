import { FastifyInstance } from 'fastify';
import { emitClipUpdate } from '../websocket';

export const registerClipRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get all clips
  app.get('/api/clips', async (_request, _reply) => {
    return { message: 'List of clips' };
  });

  // Get a single clip
  app.get('/api/clips/:id', async (request, _reply) => {
    const { id } = request.params as { id: string };
    return { id, message: 'Clip details' };
  });

  // Upload a new clip
  app.post('/api/clips', async (_request, _reply) => {
    // TODO: Emit with real clip data
    emitClipUpdate({ type: 'created', clip: {/* ...clip data... */} });
    return { message: 'Clip uploaded' };
  });

  // Delete a clip
  app.delete('/api/clips/:id', async (request, _reply) => {
    const { id } = request.params as { id: string };
    // TODO: Emit with real clip data
    emitClipUpdate({ type: 'deleted', clipId: id });
    return { id, message: 'Clip deleted' };
  });
};
