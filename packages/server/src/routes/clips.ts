import { FastifyInstance } from 'fastify';
import { emitClipUpdate } from '../websocket';
import auditLogger from '../utils/auditLogger';
import { ClipSchema } from '../../../shared/src/types';
import { zodToJsonSchema } from 'zod-to-json-schema';

const clipJsonSchema = zodToJsonSchema(ClipSchema, 'Clip');

export const registerClipRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get all clips
  app.get('/api/clips', {
    schema: {
      description: 'Get a list of all clips',
      tags: ['clips'],
      response: {
        200: {
          description: 'A list of clips',
          type: 'object',
          properties: {
            message: { type: 'string' },
            clips: {
              type: 'array',
              items: clipJsonSchema.definitions?.Clip || clipJsonSchema,
              description: 'Array of clip objects'
            }
          },
          example: {
            message: 'List of clips',
            clips: [
              { id: 'abc123', userId: 'user1', guildId: 'guild1', channelId: 'chan1', originalUrl: 'https://example.com/clip1.mp4', filename: 'clip1.mp4', fileSize: 123456, duration: 12.3, status: 'PROCESSED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'def456', userId: 'user2', guildId: 'guild2', channelId: 'chan2', originalUrl: 'https://example.com/clip2.mp4', filename: 'clip2.mp4', fileSize: 654321, duration: 10.1, status: 'PENDING', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            ]
          }
        }
      }
    }
  }, async (_request, _reply) => {
    return { message: 'List of clips', clips: [] };
  });

  // Get a single clip
  app.get('/api/clips/:id', {
    schema: {
      description: 'Get a single clip by ID',
      tags: ['clips'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Clip ID' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Clip details',
          type: 'object',
          properties: {
            clip: clipJsonSchema.definitions?.Clip || clipJsonSchema
          },
          example: {
            clip: { id: 'abc123', userId: 'user1', guildId: 'guild1', channelId: 'chan1', originalUrl: 'https://example.com/clip1.mp4', filename: 'clip1.mp4', fileSize: 123456, duration: 12.3, status: 'PROCESSED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          }
        },
        404: {
          description: 'Clip not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Clip not found' }
        }
      }
    }
  }, async (request, _reply) => {
    const { id } = request.params as { id: string };
    return { clip: { id, userId: 'user1', guildId: 'guild1', channelId: 'chan1', originalUrl: 'https://example.com/clip1.mp4', filename: 'clip1.mp4', fileSize: 123456, duration: 12.3, status: 'PROCESSED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
  });

  // Upload a new clip
  app.post('/api/clips', {
    schema: {
      description: 'Upload a new clip',
      tags: ['clips'],
      body: clipJsonSchema.definitions?.Clip || clipJsonSchema,
      response: {
        200: {
          description: 'Upload result',
          type: 'object',
          properties: {
            message: { type: 'string' },
            clip: clipJsonSchema.definitions?.Clip || clipJsonSchema
          },
          example: {
            message: 'Clip uploaded',
            clip: { id: 'abc123', userId: 'user1', guildId: 'guild1', channelId: 'chan1', originalUrl: 'https://example.com/clip1.mp4', filename: 'clip1.mp4', fileSize: 123456, duration: 12.3, status: 'PROCESSED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          }
        }
      }
    }
  }, async (request, _reply) => {
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
    return { message: 'Clip uploaded', clip };
  });

  // Delete a clip
  app.delete('/api/clips/:id', {
    schema: {
      description: 'Delete a clip by ID',
      tags: ['clips'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Clip ID' }
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
          example: { id: 'abc123', message: 'Clip deleted' }
        },
        404: {
          description: 'Clip not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Clip not found' }
        }
      }
    }
  }, async (request, _reply) => {
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
