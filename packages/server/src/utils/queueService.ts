import { Job, JobDocument } from '../models/job';
import auditLogger from './auditLogger';
import { emitQueueUpdate } from '../websocket';
import { CreateClipInput, CreateClipInput as CreateClipInputSchema } from '../../../shared/src/types/clip';
import { CreateMontageInput, CreateMontageInput as CreateMontageInputSchema } from '../../../shared/src/types/montage';

// Use shared types for payloads
// (TypeScript type only)
type QueueJobPayload = CreateClipInput;
type MontageJobPayload = CreateMontageInput;

// Runtime validation helpers
function validateQueueJobPayload(payload: unknown): asserts payload is QueueJobPayload {
  CreateClipInputSchema.parse(payload);
}

function validateMontageJobPayload(payload: unknown): asserts payload is MontageJobPayload {
  CreateMontageInputSchema.parse(payload);
}

// Dispatcher: process a queue job
export async function dispatchJob(job: JobDocument) {
    try {
      await Job.findByIdAndUpdate(job._id, { status: 'processing' });
      auditLogger.info('Queue job started', { jobId: job._id, type: job.type, timestamp: new Date() });
      emitQueueUpdate({ type: 'started', jobId: job._id });
  
      let result: any = {};
  
      if (job.type === 'queue') {
        validateQueueJobPayload(job.payload);
        const payload = job.payload as QueueJobPayload;
        // TODO: Implement real clip creation logic here
        result = { message: 'Clip processed', payload };
      } else if (job.type === 'montage') {
        validateMontageJobPayload(job.payload);
        const payload = job.payload as MontageJobPayload;
        // TODO: Implement real montage creation logic here
        result = { message: 'Montage processed', payload };
      } else {
        throw new Error(`Unknown job type: ${job.type}`);
      }
  
      await Job.findByIdAndUpdate(job._id, { status: 'completed', result });
      auditLogger.info('Queue job completed', { jobId: job._id, result, timestamp: new Date() });
      emitQueueUpdate({ type: 'completed', jobId: job._id, result });
    } catch (err: any) {
      await Job.findByIdAndUpdate(job._id, { status: 'failed', result: { error: err.message } });
      auditLogger.error('Queue job failed', { jobId: job._id, error: err.message, timestamp: new Date() });
      emitQueueUpdate({ type: 'failed', jobId: job._id, error: err.message });
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

export function jobToAPI(job: JobDocument | any) {
  const obj = job.toObject ? job.toObject() : job;
  return { ...obj, id: obj._id?.toString?.() || obj._id };
} 