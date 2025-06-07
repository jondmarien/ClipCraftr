import { FastifyInstance } from 'fastify';
import { emitQueueUpdate } from '../websocket';
import auditLogger from '../utils/auditLogger';
import { JobSchema } from '../../../shared/src/types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Job } from '../models/job';
import { dispatchJob, recoverQueueJobs, jobToAPI } from '@/utils/queueService';

const jobJsonSchema = zodToJsonSchema(JobSchema, 'Job');

let missionStatus: 'idle' | 'processing' | 'error' = 'idle';

export const registerQueueRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get current queue (pending jobs)
  app.get('/api/queue', {
    schema: {
      description: 'Get the current queue of pending jobs',
      tags: ['queue'],
      response: {
        200: {
          description: 'Current queue',
          type: 'object',
          properties: {
            queue: {
              type: 'array',
              items: jobJsonSchema.definitions?.Job || jobJsonSchema,
              description: 'Array of job objects'
            }
          },
          example: {
            queue: [
              { id: 'job1', type: 'queue', status: 'pending', payload: {}, userId: 'user1', guildId: 'guild1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'job2', type: 'queue', status: 'processing', payload: {}, userId: 'user2', guildId: 'guild2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            ]
          }
        }
      }
    }
  }, async (_req, _reply) => {
    const jobs = await Job.find({ type: 'queue', status: { $in: ['pending', 'processing'] } }).sort({ createdAt: 1 });
    return { queue: jobs.map(jobToAPI) };
  });

  // Add to queue
  app.post('/api/queue', {
    schema: {
      description: 'Add a new job to the queue',
      tags: ['queue'],
      body: jobJsonSchema.definitions?.Job || jobJsonSchema,
      response: {
        200: {
          description: 'Job added to queue',
          type: 'object',
          properties: {
            message: { type: 'string' },
            item: jobJsonSchema.definitions?.Job || jobJsonSchema
          },
          example: {
            message: 'Added to queue',
            item: { id: 'job1', type: 'queue', status: 'pending', payload: {}, userId: 'user1', guildId: 'guild1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          }
        }
      }
    }
  }, async (req, _reply) => {
    const payload = req.body;
    const user = req.user?.id || 'anonymous';
    const job = new Job({ type: 'queue', payload, status: 'pending' });
    await job.save();
    auditLogger.info('Queue item added', {
      user,
      action: 'add',
      collection: 'queue',
      details: job,
      timestamp: new Date(),
    });
    const jobs = await Job.find({ type: 'queue', status: { $in: ['pending', 'processing'] } }).sort({ createdAt: 1 });
    emitQueueUpdate({ type: 'added', item: jobToAPI(job), queue: jobs.map(jobToAPI) });
    dispatchJob(job);
    return { message: 'Added to queue', item: jobToAPI(job) };
  });

  // Remove from queue
  app.delete('/api/queue/:id', {
    schema: {
      description: 'Remove a job from the queue by ID',
      tags: ['queue'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Job ID' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Job removed from queue',
          type: 'object',
          properties: {
            message: { type: 'string' },
            id: { type: 'string' }
          },
          example: { message: 'Removed from queue', id: 'job1' }
        },
        404: {
          description: 'Job not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          example: { message: 'Job not found' }
        }
      }
    }
  }, async (req, _reply) => {
    const { id } = req.params as { id: string };
    const user = req.user?.id || 'anonymous';
    const job = await Job.findByIdAndDelete(id);
    auditLogger.info('Queue item removed', {
      user,
      action: 'remove',
      collection: 'queue',
      documentId: id,
      timestamp: new Date(),
    });
    const queue = await Job.find({ type: 'queue', status: { $in: ['pending', 'processing'] } }).sort({ createdAt: 1 });
    emitQueueUpdate({ type: 'removed', id, queue: queue.map(jobToAPI) });
    return { message: 'Removed from queue', id };
  });

  // Get mission status
  app.get('/api/mission-status', {
    schema: {
      description: 'Get the current mission status',
      tags: ['queue'],
      response: {
        200: {
          description: 'Current mission status',
          type: 'object',
          properties: {
            missionStatus: { type: 'string', enum: ['idle', 'processing', 'error'] }
          },
          example: { missionStatus: 'idle' }
        }
      }
    }
  }, async (_req, _reply) => {
    return { missionStatus };
  });

  // Set mission status (for testing/demo)
  app.post('/api/mission-status', {
    schema: {
      description: 'Set the current mission status',
      tags: ['queue'],
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['idle', 'processing', 'error'], description: 'New mission status' }
        },
        required: ['status']
      },
      response: {
        200: {
          description: 'Mission status updated',
          type: 'object',
          properties: {
            message: { type: 'string' },
            missionStatus: { type: 'string', enum: ['idle', 'processing', 'error'] }
          },
          example: { message: 'Mission status updated', missionStatus: 'processing' }
        }
      }
    }
  }, async (req, _reply) => {
    const { status } = req.body as { status: typeof missionStatus };
    missionStatus = status;
    emitQueueUpdate({ type: 'status', missionStatus });
    return { message: 'Mission status updated', missionStatus };
  });
};
