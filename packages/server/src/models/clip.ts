import mongoose, { Schema, Document } from 'mongoose';
import { ClipStatus } from '../../../shared/src/types/clip';

export interface ClipDocument extends Document {
  userId: string;
  guildId: string;
  channelId: string;
  messageId?: string;
  originalUrl: string;
  filename: string;
  fileSize: number;
  duration: number;
  status: typeof ClipStatus._type;
  metadata?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClipSchema = new Schema<ClipDocument>({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String },
  originalUrl: { type: String, required: true },
  filename: { type: String, required: true },
  fileSize: { type: Number, required: true },
  duration: { type: Number, required: true },
  status: { type: String, enum: ClipStatus.options, required: true },
  metadata: { type: Schema.Types.Mixed },
  error: { type: String },
}, { timestamps: true });

export const Clip = mongoose.model<ClipDocument>('Clip', ClipSchema); 