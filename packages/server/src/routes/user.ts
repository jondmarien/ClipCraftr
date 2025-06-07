import { FastifyInstance } from 'fastify';
import { UserSchema } from '../../../shared/src/types';
import { zodToJsonSchema } from 'zod-to-json-schema';

const userJsonSchema = zodToJsonSchema(UserSchema, 'User');

export const registerUserRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/api/users/:id', {
    schema: {
      description: 'Get a user by ID',
      tags: ['users'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'User ID' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'User details',
          type: 'object',
          properties: {
            user: userJsonSchema.definitions?.User || userJsonSchema
          },
          example: {
            user: {
              id: 'user1',
              discordId: '123456789',
              username: 'testuser',
              discriminator: '0001',
              avatar: null,
              email: 'test@example.com',
              roles: ['USER'],
              permissions: [],
              preferences: {},
              isActive: true,
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        },
        404: {
          description: 'User not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'User not found' }
        }
      }
    }
  }, async (request, _reply) => {
    const { id } = request.params as { id: string };
    // Return a mock user for demonstration
    return {
      user: {
        id,
        discordId: '123456789',
        username: 'testuser',
        discriminator: '0001',
        avatar: null,
        email: 'test@example.com',
        roles: ['USER'],
        permissions: [],
        preferences: {},
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  });
}; 