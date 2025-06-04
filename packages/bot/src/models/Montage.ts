import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User.js';
import { IClip } from './Clip.js';

export type MontageStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface IProcessingStep {
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  duration?: number; // in seconds
}

export interface IOutputSettings {
  resolution: string; // e.g., '1920x1080'
  aspectRatio: string; // e.g., '16:9'
  frameRate: number; // e.g., 30
  videoCodec: string; // e.g., 'libx264'
  audioCodec: string; // e.g., 'aac'
  bitrate: string; // e.g., '8M'
  format: string; // e.g., 'mp4'
}

export interface ITransitionSettings {
  type: 'fade' | 'slide' | 'wipe' | 'zoom' | 'none';
  duration: number; // in seconds
  easing: string; // e.g., 'linear', 'ease-in-out'
}

export interface IAudioSettings {
  enabled: boolean;
  trackUrl?: string;
  volume: number; // 0.0 to 1.0
  fadeIn: number; // in seconds
  fadeOut: number; // in seconds
}

export interface IMontage extends Document {
  title: string;
  description?: string;
  clips: Array<{
    clipId: Types.ObjectId | IClip;
    startTime?: number; // in seconds
    endTime?: number; // in seconds
    order: number;
  }>;
  userId: Types.ObjectId | IUser;
  status: MontageStatus;
  priority: number; // Higher number = higher priority

  // Processing information
  processingSteps: IProcessingStep[];
  currentStep?: string;
  progress: number; // 0 to 100

  // Output information
  outputPath?: string;
  outputUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  duration: number; // in seconds
  fileSize?: number; // in bytes

  // Settings
  settings: {
    output: IOutputSettings;
    transitions: ITransitionSettings;
    audio: IAudioSettings;
    watermark?: {
      enabled: boolean;
      imageUrl?: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      opacity: number; // 0.0 to 1.0
    };
    metadata?: Record<string, unknown>;
  };

  // Error handling
  error?: string;
  errorDetails?: unknown;

  // Timestamps
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const processingStepSchema = new Schema<IProcessingStep>(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed'],
      default: 'pending',
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    error: { type: String },
    duration: { type: Number },
  },
  { _id: false }
);

const outputSettingsSchema = new Schema<IOutputSettings>(
  {
    resolution: { type: String, default: '1920x1080' },
    aspectRatio: { type: String, default: '16:9' },
    frameRate: { type: Number, default: 30 },
    videoCodec: { type: String, default: 'libx264' },
    audioCodec: { type: String, default: 'aac' },
    bitrate: { type: String, default: '8M' },
    format: { type: String, default: 'mp4' },
  },
  { _id: false }
);

const transitionSettingsSchema = new Schema<ITransitionSettings>(
  {
    type: {
      type: String,
      enum: ['fade', 'slide', 'wipe', 'zoom', 'none'],
      default: 'fade',
    },
    duration: { type: Number, default: 0.5, min: 0, max: 5 },
    easing: { type: String, default: 'ease-in-out' },
  },
  { _id: false }
);

const audioSettingsSchema = new Schema<IAudioSettings>(
  {
    enabled: { type: Boolean, default: false },
    trackUrl: { type: String },
    volume: { type: Number, default: 0.8, min: 0, max: 1 },
    fadeIn: { type: Number, default: 1, min: 0 },
    fadeOut: { type: Number, default: 1, min: 0 },
  },
  { _id: false }
);

const watermarkSettingsSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    imageUrl: { type: String },
    position: {
      type: String,
      enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      default: 'bottom-right',
    },
    opacity: { type: Number, default: 0.7, min: 0, max: 1 },
  },
  { _id: false }
);

const montageSchema = new Schema<IMontage>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    clips: [
      {
        clipId: {
          type: Schema.Types.ObjectId,
          ref: 'Clip',
          required: true,
        },
        startTime: { type: Number, min: 0 },
        endTime: { type: Number, min: 0 },
        order: { type: Number, required: true, min: 0 },
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'queued',
      index: true,
    },
    priority: {
      type: Number,
      default: 0,
      min: -10,
      max: 10,
    },
    processingSteps: [processingStepSchema],
    currentStep: { type: String },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    outputPath: { type: String },
    outputUrl: { type: String },
    thumbnailUrl: { type: String },
    previewUrl: { type: String },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    fileSize: { type: Number, min: 0 },
    settings: {
      output: { type: outputSettingsSchema, required: true, default: () => ({}) },
      transitions: { type: transitionSettingsSchema, required: true, default: () => ({}) },
      audio: { type: audioSettingsSchema, required: true, default: () => ({}) },
      watermark: { type: watermarkSettingsSchema },
      metadata: { type: Schema.Types.Mixed },
    },
    error: { type: String },
    errorDetails: { type: Schema.Types.Mixed },
    queuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    failedAt: { type: Date },
    cancelledAt: { type: Date },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
montageSchema.index({ userId: 1, status: 1 });
montageSchema.index({ status: 1, priority: -1, queuedAt: 1 });
montageSchema.index({ 'clips.clipId': 1 });
montageSchema.index({ 'settings.output.format': 1 });

// Virtual for formatted duration (HH:MM:SS)
montageSchema.virtual('formattedDuration').get(function (this: IMontage) {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = Math.floor(this.duration % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Update the updatedAt timestamp before saving
montageSchema.pre<IMontage>('save', function (next) {
  this.updatedAt = new Date();

  // Update status timestamps
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'processing':
        this.startedAt = this.startedAt || now;
        break;
      case 'completed':
        this.completedAt = now;
        this.progress = 100;
        break;
      case 'failed':
        this.failedAt = now;
        break;
      case 'cancelled':
        this.cancelledAt = now;
        break;
    }
  }

  next();
});

// Method to add a processing step
montageSchema.methods.addProcessingStep = function (
  this: IMontage,
  name: string,
  status: IProcessingStep['status'] = 'pending'
) {
  const step: IProcessingStep = {
    name,
    status,
  };

  if (status === 'in-progress') {
    step.startedAt = new Date();
  } else if (status === 'completed' || status === 'failed') {
    step.completedAt = new Date();
    if (step.startedAt) {
      step.duration = (step.completedAt.getTime() - step.startedAt.getTime()) / 1000;
    }
  }

  this.processingSteps.push(step);
  this.currentStep = name;

  return this.save();
};

// Method to update the current processing step
montageSchema.methods.updateProcessingStep = function (
  this: IMontage,
  name: string,
  updates: Partial<IProcessingStep>
) {
  const step = this.processingSteps.find((s) => s.name === name);
  if (!step) {
    throw new Error(`Processing step '${name}' not found`);
  }

  Object.assign(step, updates);

  // Update timestamps for status changes
  if (updates.status === 'in-progress' && !step.startedAt) {
    step.startedAt = new Date();
  } else if ((updates.status === 'completed' || updates.status === 'failed') && !step.completedAt) {
    step.completedAt = new Date();
    if (step.startedAt) {
      step.duration = (step.completedAt.getTime() - step.startedAt.getTime()) / 1000;
    }
  }

  return this.save();
};

export const Montage = model<IMontage>('Montage', montageSchema);
