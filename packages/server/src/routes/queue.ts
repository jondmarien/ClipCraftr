import { FastifyInstance } from 'fastify';
import { emitQueueUpdate } from '../websocket';
import auditLogger from '../utils/auditLogger';
import { Job, JobDocument } from '../models/job';

let missionStatus: 'idle' | 'processing' | 'error' = 'idle';

// Dispatcher: process a queue job
async function dispatchJob(job: JobDocument) {
  try {
    await Job.findByIdAndUpdate(job._id, { status: 'processing' });
    // Example job processing logic based on type
    if (job.type === 'queue') {
      // Simulate processing a clip queue job
      // e.g., fetch related resources, validate payload, etc.
      // Processing logic for 'queue' jobs goes here
      // For demonstration, add a short artificial delay
      await new Promise((res) => setTimeout(res, 500));
    } else if (job.type === 'montage') {
      // Simulate processing a montage job
      // e.g., kick off FFmpeg montage, update progress, etc.
      await new Promise((res) => setTimeout(res, 1000));
    } else {
      throw new Error(`Unknown job type: ${job.type}`);
    }
    await Job.findByIdAndUpdate(job._id, { status: 'completed', result: { success: true } });
    auditLogger.info('Queue job completed', {
      jobId: job._id,
      action: 'complete',
      collection: 'jobs',
      timestamp: new Date(),
    });
  } catch (err: any) {
    await Job.findByIdAndUpdate(job._id, { status: 'failed', result: { error: err.message } });
    auditLogger.error('Queue job failed', {
      jobId: job._id,
      action: 'fail',
      collection: 'jobs',
      error: err.message,
      timestamp: new Date(),
    });
  }
}

// On startup: recover jobs
export async function recoverQueueJobs() {
  const jobs = await Job.find({ type: 'queue', status: { $in: ['pending', 'processing'] } });
  for (const job of jobs) {
    // Optionally reset 'processing' to 'pending' if needed
    if (job.status === 'processing') {
      job.status = 'pending';
      await job.save();
    }
    dispatchJob(job);
  }
}

function jobToAPI(job: JobDocument | any) {
  const obj = job.toObject ? job.toObject() : job;
  return { ...obj, id: obj._id?.toString?.() || obj._id };
}

export const registerQueueRoutes = async (app: FastifyInstance): Promise<void> => {
  // Get current queue (pending jobs)
  app.get('/api/queue', async (_req, _reply) => {
    const jobs = await Job.find({ type: 'queue', status: { $in: ['pending', 'processing'] } }).sort({ createdAt: 1 });
    return { queue: jobs.map(jobToAPI) };
  });

  // Add to queue
  app.post('/api/queue', async (req, _reply) => {
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
  app.delete('/api/queue/:id', async (req, _reply) => {
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
  app.get('/api/mission-status', async (_req, _reply) => {
    return { missionStatus };
  });

  // Set mission status (for testing/demo)
  app.post('/api/mission-status', async (req, _reply) => {
    const { status } = req.body as { status: typeof missionStatus };
    missionStatus = status;
    emitQueueUpdate({ type: 'status', missionStatus });
    return { message: 'Mission status updated', missionStatus };
  });
};
