import { z } from 'zod';
import { ClipSchema } from './clip';

export const MontageStatus = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

export type MontageStatus = z.infer<typeof MontageStatus>;

export const MontageTransition = z.enum([
  'fade',
  'slide',
  'zoom',
  'none',
]);

export type MontageTransition = z.infer<typeof MontageTransition>;

export const MontageSettings = z.object({
  transition: MontageTransition.default('fade'),
  transitionDuration: z.number().min(0.1).max(5).default(0.5),
  outputFormat: z.enum(['mp4', 'mov', 'mkv']).default('mp4'),
  resolution: z.enum(['1080p', '720p', '480p']).default('1080p'),
  fps: z.number().min(24).max(60).default(30),
  addWatermark: z.boolean().default(false),
  customText: z.string().optional(),
});

export type MontageSettings = z.infer<typeof MontageSettings>;

export const MontageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  messageId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  clips: z.array(z.string().uuid()),
  status: MontageStatus,
  settings: MontageSettings,
  outputUrl: z.string().url().optional(),
  fileSize: z.number().int().positive().optional(),
  duration: z.number().positive().optional(),
  thumbnailUrl: z.string().url().optional(),
  error: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  createdAt: z.date().or(z.string().pipe(z.coerce.date())),
  updatedAt: z.date().or(z.string().pipe(z.coerce.date())),
});

export type Montage = z.infer<typeof MontageSchema>;

export const CreateMontageInput = MontageSchema.pick({
  userId: true,
  guildId: true,
  channelId: true,
  messageId: true,
  title: true,
  description: true,
  clips: true,
  settings: true,
});

export type CreateMontageInput = z.infer<typeof CreateMontageInput>;

export const UpdateMontageInput = MontageSchema.partial().required({ id: true });
export type UpdateMontageInput = z.infer<typeof UpdateMontageInput>;
