import { z } from 'zod';

export const ClipStatus = z.enum([
  'PENDING',
  'PROCESSING',
  'PROCESSED',
  'FAILED',
  'QUEUED',
  'CANCELLED',
]);

export type ClipStatus = z.infer<typeof ClipStatus>;

export const ClipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  messageId: z.string().optional(),
  originalUrl: z.string().url(),
  filename: z.string(),
  fileSize: z.number().int().positive(),
  duration: z.number().positive(),
  status: ClipStatus,
  metadata: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  createdAt: z.date().or(z.string().pipe(z.coerce.date())),
  updatedAt: z.date().or(z.string().pipe(z.coerce.date())),
});

export type Clip = z.infer<typeof ClipSchema>;

export const CreateClipInput = ClipSchema.pick({
  userId: true,
  guildId: true,
  channelId: true,
  messageId: true,
  originalUrl: true,
  filename: true,
  fileSize: true,
  duration: true,
  metadata: true,
});

export type CreateClipInput = z.infer<typeof CreateClipInput>;

export const UpdateClipInput = ClipSchema.partial().required({ id: true });
export type UpdateClipInput = z.infer<typeof UpdateClipInput>;
