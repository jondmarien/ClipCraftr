import { FastifyInstance } from 'fastify';

export const registerAuthRoutes = async (app: FastifyInstance): Promise<void> => {
  // Login
  app.post('/api/auth/login', async (_request, _reply) => {
    return { message: 'Login successful' };
  });

  // Logout
  app.post('/api/auth/logout', async (_request, _reply) => {
    return { message: 'Logout successful' };
  });

  // Get current user
  app.get('/api/auth/me', async (_request, _reply) => {
    return { user: { id: '1', username: 'admin' } };
  });
};
