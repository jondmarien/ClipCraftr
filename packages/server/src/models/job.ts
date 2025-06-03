import mongoose, { Schema, Document } from 'mongoose';

export interface JobDocument extends Document {
  type: 'queue' | 'montage';
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<JobDocument>({
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  result: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const Job = mongoose.model<JobDocument>('Job', JobSchema);
