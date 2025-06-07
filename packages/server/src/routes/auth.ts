import { FastifyInstance } from 'fastify';
import { request } from 'undici';
import auditLogger from '../utils/auditLogger';

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
  app.post('/api/auth/login', {
    schema: {
      description: 'User login',
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', description: 'Username' },
          password: { type: 'string', description: 'Password' }
        },
        required: ['username', 'password']
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Login successful' }
        },
        401: {
          description: 'Invalid credentials',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Invalid credentials' }
        }
      }
    }
  }, async (request, _reply) => {
    const user = request.user?.id || 'anonymous';
    auditLogger.info('User login', {
      user,
      action: 'login',
      collection: 'users',
      timestamp: new Date(),
    });
    return { message: 'Login successful' };
  });

  // Logout
  app.post('/api/auth/logout', {
    schema: {
      description: 'User logout',
      tags: ['auth'],
      response: {
        200: {
          description: 'Logout successful',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Logout successful' }
        }
      }
    }
  }, async (request, _reply) => {
    const user = request.user?.id || 'anonymous';
    auditLogger.info('User logout', {
      user,
      action: 'logout',
      collection: 'users',
      timestamp: new Date(),
    });
    return { message: 'Logout successful' };
  });

  // Get current user
  app.get('/api/auth/me', {
    schema: {
      description: 'Get current authenticated user',
      tags: ['auth'],
      response: {
        200: {
          description: 'Current user info',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' }
              }
            }
          },
          example: { user: { id: '1', username: 'admin' } }
        },
        401: {
          description: 'Not authenticated',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Not authenticated' }
        }
      }
    }
  }, async (_request, _reply) => {
    return { user: { id: '1', username: 'admin' } };
  });
};
