import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IUser, User } from '../models/User';
import { IClip, Clip } from '../models/Clip';
import { IMontage, Montage } from '../models/Montage';

export class DatabaseService {
  // User Methods
  static async findOrCreateUser(userData: {
    discordId: string;
    username: string;
    discriminator: string;
    avatar?: string;
  }): Promise<IUser> {
    const { discordId, ...rest } = userData;
    return User.findOneAndUpdate(
      { discordId },
      { $set: rest },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }

  // Clip Methods
  static async createClip(clipData: Omit<IClip, keyof Document>): Promise<IClip> {
    const clip = new Clip(clipData);
    return clip.save();
  }

  static async findClipById(id: string): Promise<IClip | null> {
    return Clip.findById(id).populate('userId', 'discordId username').exec();
  }

  static async findClips(query: FilterQuery<IClip> = {}, limit = 10, skip = 0): Promise<IClip[]> {
    return Clip.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'discordId username')
      .exec();
  }

  static async updateClip(id: string, update: UpdateQuery<IClip>): Promise<IClip | null> {
    return Clip.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  // Montage Methods
  static async createMontage(montageData: Omit<IMontage, keyof Document>): Promise<IMontage> {
    const montage = new Montage(montageData);
    return montage.save();
  }

  static async findMontageById(id: string): Promise<IMontage | null> {
    return Montage.findById(id).populate('userId', 'discordId username').populate('clipIds').exec();
  }

  static async findMontagesByUser(userId: string, limit = 10, skip = 0): Promise<IMontage[]> {
    return Montage.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'discordId username')
      .populate('clipIds')
      .exec();
  }

  static async updateMontage(id: string, update: UpdateQuery<IMontage>): Promise<IMontage | null> {
    return Montage.findByIdAndUpdate(id, update, { new: true }).exec();
  }
}
