import { Job, JobDocument } from '../models/job';
import { Clip, ClipDocument } from '../models/clip';
import auditLogger from './auditLogger';
import { emitQueueUpdate } from '../websocket';
import { CreateClipInput, CreateClipInput as CreateClipInputSchema } from '../../../shared/src/types/clip';
import { CreateMontageInput, CreateMontageInput as CreateMontageInputSchema } from '../../../shared/src/types/montage';
import { MontageStatus } from '../../../shared/src/types/montage';
import { ClipStatus } from '../../../shared/src/types/clip';

// Type Definitions
// ----------------
type QueueJobPayload = CreateClipInput & { _id: string };
type MontageJobPayload = CreateMontageInput;

// Validation Helpers
// ------------------
function validateQueueJobPayload(payload: unknown): asserts payload is QueueJobPayload {
  CreateClipInputSchema.parse(payload);
}

function validateMontageJobPayload(payload: unknown): asserts payload is MontageJobPayload {
  CreateMontageInputSchema.parse(payload);
}

// Main Job Dispatcher
// -------------------
export async function dispatchJob(job: JobDocument) {
  try {
    // Mark job as processing
    await Job.findByIdAndUpdate(job._id, { status: 'processing' });
    auditLogger.info('Queue job started', {
      jobId: job._id,
      type: job.type,
      timestamp: new Date(),
    });
    emitQueueUpdate({ type: 'started', jobId: job._id });

    let result: any = {};

    // --- Queue Job Logic ---
    if (job.type === 'queue') {
      validateQueueJobPayload(job.payload);
      const payload = job.payload as QueueJobPayload;

      // Fetch the clip by _id
      const clip = await Clip.findById(payload._id);
      if (!clip) throw new Error(`Clip not found: ${payload._id}`);

      // Update status to PROCESSING
      clip.status = ClipStatus.enum.PROCESSING;
      await clip.save();

      // TODO: File validation, processing, etc.
      // Simulate processing
      await new Promise((res) => setTimeout(res, 500));

      // On success:
      clip.status = ClipStatus.enum.PROCESSED;
      await clip.save();

      result = { message: 'Clip processed', clipId: clip._id };
      // On error, catch below and set FAILED
    }

    // --- Montage Job Logic ---
    else if (job.type === 'montage') {
      validateMontageJobPayload(job.payload);
      const payload = job.payload as MontageJobPayload;

      // TODO: Fetch clips, run FFmpeg, update montage record
      // Simulate montage processing
      await new Promise((res) => setTimeout(res, 1000));

      // Placeholder: update montage status if you have a Montage model
      result = { message: 'Montage processed', montagePayload: payload };
    }

    // --- Unknown Job Type ---
    else {
      throw new Error(`Unknown job type: ${job.type}`);
    }

    // Mark job as completed
    await Job.findByIdAndUpdate(job._id, { status: 'completed', result });
    auditLogger.info('Queue job completed', {
      jobId: job._id,
      result,
      timestamp: new Date(),
    });
    emitQueueUpdate({ type: 'completed', jobId: job._id, result });
  } catch (err: any) {
    // If it's a queue job, set the clip status to FAILED
    if (job.type === 'queue' && job.payload?._id) {
      const clip = await Clip.findById(job.payload._id);
      if (clip) {
        clip.status = ClipStatus.enum.FAILED;
        clip.error = err.message;
        await clip.save();
      }
    }
    await Job.findByIdAndUpdate(job._id, { status: 'failed', result: { error: err.message } });
    auditLogger.error('Queue job failed', {
      jobId: job._id,
      error: err.message,
      timestamp: new Date(),
    });
    emitQueueUpdate({ type: 'failed', jobId: job._id, error: err.message });
  }
}

// Job Recovery
// ------------
export async function recoverQueueJobs() {
  const jobs = await Job.find({ type: 'queue', status: { $in: ['pending', 'processing'] } });
  for (const job of jobs) {
    if (job.status === 'processing') {
      job.status = 'pending';
      await job.save();
    }
    dispatchJob(job);
  }
}

// Utility: Convert Job to API Format
// ----------------------------------
export function jobToAPI(job: JobDocument | any) {
  const obj = job.toObject ? job.toObject() : job;
  return { ...obj, id: obj._id?.toString?.() || obj._id };
} 