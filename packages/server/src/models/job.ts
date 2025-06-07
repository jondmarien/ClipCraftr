import mongoose, { Schema, Document } from 'mongoose';
import { JobStatus } from '../../../shared/src/types/job';

export interface JobDocument extends Document {
  type: string;
  payload: Record<string, unknown>;
  status: typeof JobStatus._type;
  result?: Record<string, unknown>;
  userId: string;
  guildId: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<JobDocument>({
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: JobStatus.options, default: 'pending', required: true },
  result: { type: Schema.Types.Mixed },
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
}, { timestamps: true });

export const Job = mongoose.model<JobDocument>('Job', JobSchema);
