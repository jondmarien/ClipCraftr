import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export type ClipStatus = 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';

export interface IClip extends Document {
  originalName: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number; // in bytes
  duration: number; // in seconds
  mimeType: string;
  userId: Types.ObjectId | IUser;
  status: ClipStatus;
  error?: string;
  metadata: {
    width: number;
    height: number;
    fps: number;
    codec: string;
    bitrate: number;
    aspectRatio: string;
  };
  isPublic: boolean;
  tags: string[];
  usedInMontages: Types.ObjectId[];
  uploadedAt: Date;
  processedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const clipSchema = new Schema<IClip>(
  {
    originalName: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, unique: true },
    filePath: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true, min: 1 },
    duration: { type: Number, required: true, min: 0.1 }, // Minimum 100ms
    mimeType: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['uploading', 'processing', 'ready', 'error', 'deleted'],
      default: 'uploading',
      index: true,
    },
    error: { type: String },
    metadata: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      fps: { type: Number, required: true },
      codec: { type: String, required: true },
      bitrate: { type: Number, required: true },
      aspectRatio: { type: String, required: true },
    },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String, trim: true, lowercase: true }],
    usedInMontages: [{ type: Schema.Types.ObjectId, ref: 'Montage' }],
    uploadedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
clipSchema.index({ userId: 1, status: 1 });
clipSchema.index({ status: 1, isPublic: 1 });
clipSchema.index({ tags: 1 });
clipSchema.index({ 'metadata.width': 1, 'metadata.height': 1 });
clipSchema.index({ duration: 1 });

// Text index for search
clipSchema.index(
  { originalName: 'text', tags: 'text' },
  { weights: { originalName: 10, tags: 5 } }
);

// Virtual for formatted duration (MM:SS)
clipSchema.virtual('formattedDuration').get(function (this: IClip) {
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Update the updatedAt timestamp before saving
clipSchema.pre<IClip>('save', function (next) {
  this.updatedAt = new Date();
  next();
});
clipSchema.index({ tags: 1 });

export const Clip = model<IClip>('Clip', clipSchema);
