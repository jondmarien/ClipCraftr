import { z } from 'zod';

export const JobStatus = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
]);

export type JobStatus = z.infer<typeof JobStatus>;

export const JobSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  status: JobStatus,
  payload: z.record(z.unknown()),
  result: z.record(z.unknown()).optional(),
  userId: z.string(),
  guildId: z.string(),
  createdAt: z.date().or(z.string().pipe(z.coerce.date())),
  updatedAt: z.date().or(z.string().pipe(z.coerce.date())),
});

export type Job = z.infer<typeof JobSchema>; 