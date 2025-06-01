import { FastifyInstance } from 'fastify';

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
    return { message: 'Clip uploaded' };
  });

  // Delete a clip
  app.delete('/api/clips/:id', async (request, _reply) => {
    const { id } = request.params as { id: string };
    return { id, message: 'Clip deleted' };
  });
};
