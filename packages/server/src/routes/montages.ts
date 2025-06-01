import { FastifyInstance } from 'fastify';

export const registerMontageRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get all montages
  app.get('/api/montages', async (_request, _reply) => {
    return { message: 'List of montages' };
  });

  // Get a single montage
  app.get('/api/montages/:id', async (_request, _reply) => {
    const { id } = _request.params as { id: string };
    return { id, message: 'Montage details' };
  });

  // Create a new montage
  app.post('/api/montages', async (_request, _reply) => {
    return { message: 'Montage created' };
  });

  // Delete a montage
  app.delete('/api/montages/:id', async (request, _reply) => {
    const { id } = request.params as { id: string };
    return { id, message: 'Montage deleted' };
  });
};
