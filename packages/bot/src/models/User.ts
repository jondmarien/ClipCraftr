import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  isAdmin: boolean;
  queueLimit: number;
  maxClipDuration: number; // in seconds
  maxMontageDuration: number; // in seconds
  clips: Types.ObjectId[];
  montages: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    discordId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    avatar: { type: String },
    isAdmin: { type: Boolean, default: false },
    queueLimit: { type: Number, default: 10, min: 1 },
    maxClipDuration: { type: Number, default: 300, min: 1 }, // 5 minutes default
    maxMontageDuration: { type: Number, default: 600, min: 1 }, // 10 minutes default
    clips: [{ type: Schema.Types.ObjectId, ref: 'Clip' }],
    montages: [{ type: Schema.Types.ObjectId, ref: 'Montage' }],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
userSchema.index({ username: 1 });
userSchema.index({ isAdmin: 1 });

export const User = model<IUser>('User', userSchema);
