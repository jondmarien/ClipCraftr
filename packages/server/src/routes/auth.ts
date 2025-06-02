import { FastifyInstance } from 'fastify';
import { request } from 'undici';

export const registerAuthRoutes = async (app: FastifyInstance): Promise<void> => {
  // Only proxy /auth/* in production to avoid dev proxy loops and 404s
  if (process.env.NODE_ENV === 'production') {
    app.all('/auth/*', async (req, reply) => {
      // Prevent proxy loop: if request already has x-proxied-by-fastify, do not proxy again
      if (req.headers['x-proxied-by-fastify']) {
        reply.status(404).send({
          error: 'Proxy loop detected: refusing to forward request already proxied by Fastify.',
        });
        return;
      }

      const targetUrl = `http://localhost:3000/api${req.url}`;
      const { method, headers } = req.raw;

      // Clone headers and add x-proxied-by-fastify
      const proxyHeaders = { ...headers, 'x-proxied-by-fastify': 'true' };

      // Forward the request to Next.js
      const proxyRes = await request(targetUrl, {
        method: method as string,
        headers: proxyHeaders,
        body: ['GET', 'HEAD'].includes((method as string).toUpperCase()) ? undefined : req.raw,
      });

      reply.status(proxyRes.statusCode);
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        reply.header(key, value as string);
      }
      reply.send(proxyRes.body);
    });
  }

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
