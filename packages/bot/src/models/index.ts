export * from './User.js';
export * from './Clip.js';
export * from './Montage.js';

export type { IUser } from './User.js';
export type { IClip, ClipStatus } from './Clip.js';
export type {
  IMontage,
  MontageStatus,
  IProcessingStep,
  IOutputSettings,
  ITransitionSettings,
  IAudioSettings,
} from './Montage.js';

// Re-export mongoose for convenience
export { Types } from 'mongoose';
