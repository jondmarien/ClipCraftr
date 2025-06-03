import { FastifyInstance } from 'fastify';
import { registerClipRoutes } from '@/routes/clips';
import { registerMontageRoutes } from '@/routes/montages';
import { registerAuthRoutes } from '@/routes/auth';
import { registerQueueRoutes } from '@/routes/queue';

export const registerRoutes = async (app: FastifyInstance): Promise<void> => {
  // Health check endpoint
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register route modules
  await registerClipRoutes(app);
  await registerMontageRoutes(app);
  await registerAuthRoutes(app);
  await registerQueueRoutes(app);
};
