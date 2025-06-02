export * from './User';
export * from './Clip';
export * from './Montage';

export type { IUser } from './User';
export type { IClip, ClipStatus } from './Clip';
export type {
  IMontage,
  MontageStatus,
  IProcessingStep,
  IOutputSettings,
  ITransitionSettings,
  IAudioSettings,
} from './Montage';

// Re-export mongoose for convenience
export { Types } from 'mongoose';
