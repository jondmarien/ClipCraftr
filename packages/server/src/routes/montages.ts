import { FastifyInstance } from 'fastify';
import { emitMontageUpdate } from '../websocket';
import auditLogger from '../utils/auditLogger';
import { MontageSchema } from '../../../shared/src/types';
import { zodToJsonSchema } from 'zod-to-json-schema';

const montageJsonSchema = zodToJsonSchema(MontageSchema, 'Montage');

export const registerMontageRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get all montages
  app.get('/api/montages', {
    schema: {
      description: 'Get a list of all montages',
      tags: ['montages'],
      response: {
        200: {
          description: 'A list of montages',
          type: 'object',
          properties: {
            message: { type: 'string' },
            montages: {
              type: 'array',
              items: montageJsonSchema.definitions?.Montage || montageJsonSchema,
              description: 'Array of montage objects'
            }
          },
          example: {
            message: 'List of montages',
            montages: [
              { id: 'montage1', userId: 'user1', guildId: 'guild1', channelId: 'chan1', title: 'Epic Montage', clips: ['clip1', 'clip2'], status: 'COMPLETED', settings: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'montage2', userId: 'user2', guildId: 'guild2', channelId: 'chan2', title: 'Funny Moments', clips: ['clip3', 'clip4'], status: 'PENDING', settings: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            ]
          }
        }
      }
    }
  }, async (_request, _reply) => {
    return { message: 'List of montages', montages: [] };
  });

  // Get a single montage
  app.get('/api/montages/:id', {
    schema: {
      description: 'Get a single montage by ID',
      tags: ['montages'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Montage ID' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Montage details',
          type: 'object',
          properties: {
            montage: montageJsonSchema.definitions?.Montage || montageJsonSchema
          },
          example: {
            montage: { id: 'montage1', userId: 'user1', guildId: 'guild1', channelId: 'chan1', title: 'Epic Montage', clips: ['clip1', 'clip2'], status: 'COMPLETED', settings: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          }
        },
        404: {
          description: 'Montage not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Montage not found' }
        }
      }
    }
  }, async (_request, _reply) => {
    const { id } = _request.params as { id: string };
    return { montage: { id, userId: 'user1', guildId: 'guild1', channelId: 'chan1', title: 'Epic Montage', clips: ['clip1', 'clip2'], status: 'COMPLETED', settings: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
  });

  // Create a new montage
  app.post('/api/montages', {
    schema: {
      description: 'Create a new montage',
      tags: ['montages'],
      body: montageJsonSchema.definitions?.Montage || montageJsonSchema,
      response: {
        200: {
          description: 'Montage creation result',
          type: 'object',
          properties: {
            message: { type: 'string' },
            montage: montageJsonSchema.definitions?.Montage || montageJsonSchema
          },
          example: {
            message: 'Montage created',
            montage: { id: 'montage1', userId: 'user1', guildId: 'guild1', channelId: 'chan1', title: 'Epic Montage', clips: ['clip1', 'clip2'], status: 'COMPLETED', settings: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          }
        }
      }
    }
  }, async (request, _reply) => {
    // TODO: Emit with real montage data
    const user = request.user?.id || 'anonymous';
    const montage = {/* ...montage data... */};
    auditLogger.info('Montage created', {
      user,
      action: 'create',
      collection: 'montages',
      details: montage,
      timestamp: new Date(),
    });
    emitMontageUpdate({ type: 'created', montage });
    return { message: 'Montage created', montage };
  });

  // Delete a montage
  app.delete('/api/montages/:id', {
    schema: {
      description: 'Delete a montage by ID',
      tags: ['montages'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Montage ID' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Delete result',
          type: 'object',
          properties: {
            id: { type: 'string' },
            message: { type: 'string' }
          },
          example: { id: 'montage1', message: 'Montage deleted' }
        },
        404: {
          description: 'Montage not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Montage not found' }
        }
      }
    }
  }, async (request, _reply) => {
    const { id } = request.params as { id: string };
    const user = request.user?.id || 'anonymous';
    auditLogger.info('Montage deleted', {
      user,
      action: 'delete',
      collection: 'montages',
      documentId: id,
      timestamp: new Date(),
    });
    // TODO: Emit with real montage data
    emitMontageUpdate({ type: 'deleted', montageId: id });
    return { id, message: 'Montage deleted' };
  });
};
