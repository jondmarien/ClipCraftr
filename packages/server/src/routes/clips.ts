import { FastifyInstance } from 'fastify';
import { emitClipUpdate } from '../websocket';
import auditLogger from '../utils/auditLogger';

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
  app.post('/api/clips', async (request, _reply) => {
    // TODO: Emit with real clip data
    const user = request.user?.id || 'anonymous';
    const clip = {/* ...clip data... */};
    auditLogger.info('Clip created', {
      user,
      action: 'create',
      collection: 'clips',
      details: clip,
      timestamp: new Date(),
    });
    emitClipUpdate({ type: 'created', clip });
    return { message: 'Clip uploaded' };
  });

  // Delete a clip
  app.delete('/api/clips/:id', async (request, _reply) => {
    const { id } = request.params as { id: string };
    const user = request.user?.id || 'anonymous';
    auditLogger.info('Clip deleted', {
      user,
      action: 'delete',
      collection: 'clips',
      documentId: id,
      timestamp: new Date(),
    });
    // TODO: Emit with real clip data
    emitClipUpdate({ type: 'deleted', clipId: id });
    return { id, message: 'Clip deleted' };
  });
};
