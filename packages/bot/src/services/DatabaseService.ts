import { Document, FilterQuery, UpdateQuery, Types, ClientSession, startSession } from 'mongoose';
import { IUser, User } from '../models/User.js';
import { IClip, Clip, ClipStatus } from '../models/Clip.js';
import { IMontage, IProcessingStep, Montage, MontageStatus } from '../models/Montage.js';
import { logger } from '../utils/logger.js';

const serviceLogger = logger('DatabaseService');

// Type for documents with _id field - used internally
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WithId<T> = T & { _id: Types.ObjectId };

export class DatabaseService {
  // ==================== User Methods ====================

  /**
   * Find or create a user by Discord ID
   */
  static async findOrCreateUser(
    userData: {
      discordId: string;
      username: string;
      discriminator: string;
      avatar?: string;
    },
    session?: ClientSession
  ): Promise<IUser> {
    const { discordId, ...rest } = userData;
    const options = session ? { session } : {};
    const user = await User.findOneAndUpdate(
      { discordId },
      { $set: rest },
      {
        ...options,
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    serviceLogger.info(`User ${user._id} (${discordId}) found/created`);
    return user;
  }

  /**
   * Get a user by ID
   */
  static async getUserById(
    userId: string | Types.ObjectId,
    session?: ClientSession
  ): Promise<IUser | null> {
    const options = session ? { session } : {};
    return User.findById(userId, null, options)
      .populate('clips', 'originalName duration status')
      .populate('montages', 'title status duration')
      .exec();
  }

  /**
   * Get a user by Discord ID
   */
  static async getUserByDiscordId(
    discordId: string,
    session?: ClientSession
  ): Promise<IUser | null> {
    const options = session ? { session } : {};
    return User.findOne({ discordId }, null, options)
      .populate('clips', 'originalName duration status')
      .populate('montages', 'title status duration')
      .exec();
  }

  /**
   * Update user settings
   */
  static async updateUser(
    userId: string | Types.ObjectId,
    update: Partial<Omit<IUser, keyof Document>>,
    session?: ClientSession
  ): Promise<IUser | null> {
    const options = session ? { session, new: true } : { new: true };
    return User.findByIdAndUpdate(userId, update, options).exec();
  }

  // ==================== Clip Methods ====================

  /**
   * Create a new clip
   */
  /**
   * Add a new clip (formerly createClip)
   */
  static async addClip(
    clipData: Omit<IClip, keyof Document>,
    session?: ClientSession
  ): Promise<IClip> {
    const options = session ? { session } : {};
    const clip = new Clip(clipData);
    await clip.save(options);

    // Add clip to user's clips array
    await User.findByIdAndUpdate(clip.userId, { $push: { clips: clip._id } }, options).exec();

    serviceLogger.info(`Clip ${clip._id} created for user ${clip.userId}`);
    return clip;
  }


  /**
   * Get a clip by ID
   */
  static async getClipById(
    clipId: string | Types.ObjectId,
    session?: ClientSession
  ): Promise<IClip | null> {
    const options = session ? { session } : {};
    return Clip.findById(clipId, null, options)
      .populate('userId', 'discordId username')
      .populate('usedInMontages', 'title status')
      .exec();
  }

  /**
   * Find clips with pagination and filtering
   */
  static async findClips(
    query: FilterQuery<IClip> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      session?: ClientSession;
    } = {}
  ): Promise<{ clips: IClip[]; total: number }> {
    const { limit = 10, skip = 0, sort = { createdAt: -1 }, session } = options;

    const [clips, total] = await Promise.all([
      Clip.find(query, null, { session })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'discordId username')
        .populate('usedInMontages', 'title status')
        .exec(),
      Clip.countDocuments(query)
        .session(session || null)
        .exec(),
    ]);

    return { clips, total };
  }

  /**
   * Update a clip
   */
  static async updateClip(
    clipId: string | Types.ObjectId,
    update: UpdateQuery<IClip>,
    session?: ClientSession
  ): Promise<IClip | null> {
    const options = session ? { session, new: true } : { new: true };
    return Clip.findByIdAndUpdate(clipId, update, options).exec();
  }

  /**
   * Update clip status
   */
  static async updateClipStatus(
    clipId: string | Types.ObjectId,
    status: ClipStatus,
    error?: string,
    session?: ClientSession
  ): Promise<IClip | null> {
    const update: UpdateQuery<IClip> = { status };
    if (status === 'error' && error) {
      update.error = error;
    } else if (status === 'ready') {
      update.processedAt = new Date();
    }
    return this.updateClip(clipId, update, session);
  }

  // ==================== Montage Methods ====================

  /**
   * Create a new montage
   */
  static async createMontage(
    montageData: Omit<IMontage, keyof Document>,
    session?: ClientSession
  ): Promise<IMontage> {
    const options = session ? { session } : {};
    const montage = new Montage({
      ...montageData,
      status: 'queued',
      queuedAt: new Date(),
    });

    await montage.save(options);

    // Add montage to user's montages array
    await User.findByIdAndUpdate(
      montage.userId,
      { $push: { montages: montage._id } },
      options
    ).exec();

    // Add montage reference to used clips
    await Clip.updateMany(
      { _id: { $in: montage.clips.map((clip) => clip.clipId) } },
      { $addToSet: { usedInMontages: montage._id } },
      options
    ).exec();

    serviceLogger.info(`Montage ${montage._id} created for user ${montage.userId}`);
    return montage;
  }

  /**
   * Get a montage by ID with populated data
   */
  static async getMontageById(
    montageId: string | Types.ObjectId,
    session?: ClientSession
  ): Promise<IMontage | null> {
    const options = session ? { session } : {};
    return Montage.findById(montageId, null, options)
      .populate('userId', 'discordId username')
      .populate('clips.clipId', 'originalName duration metadata')
      .exec();
  }

  /**
   * Find montages with pagination and filtering
   */
  static async findMontages(
    query: FilterQuery<IMontage> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: Record<string, 1 | -1>;
      session?: ClientSession;
    } = {}
  ): Promise<{ montages: IMontage[]; total: number }> {
    const { limit = 10, skip = 0, sort = { queuedAt: -1 }, session } = options;

    const [montages, total] = await Promise.all([
      Montage.find(query, null, { session })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'discordId username')
        .populate('clips.clipId', 'originalName duration')
        .exec(),
      Montage.countDocuments(query)
        .session(session || null)
        .exec(),
    ]);

    return { montages, total };
  }

  /**
   * Update a montage
   */
  static async updateMontage(
    montageId: string | Types.ObjectId,
    update: UpdateQuery<IMontage>,
    session?: ClientSession
  ): Promise<IMontage | null> {
    const options = session ? { session, new: true } : { new: true };
    return Montage.findByIdAndUpdate(montageId, update, options).exec();
  }

  /**
   * Update montage status and handle related updates
   */
  static async updateMontageStatus(
    montageId: string | Types.ObjectId,
    status: MontageStatus,
    error?: string,
    session?: ClientSession
  ): Promise<IMontage | null> {
    const update: UpdateQuery<IMontage> = { status };

    if (status === 'processing') {
      update.startedAt = new Date();
    } else if (status === 'completed') {
      update.completedAt = new Date();
      update.progress = 100;
    } else if (status === 'failed' || status === 'cancelled') {
      update[status === 'failed' ? 'failedAt' : 'cancelledAt'] = new Date();
      if (error) {
        update.error = error;
      }
    }

    return this.updateMontage(montageId, update, session);
  }

  /**
   * Add a processing step to a montage
   */
  static async addMontageProcessingStep(
    montageId: string | Types.ObjectId,
    step: Omit<IProcessingStep, 'status'> & { status?: IProcessingStep['status'] },
    session?: ClientSession
  ): Promise<IMontage | null> {
    const processingStep: IProcessingStep = {
      ...step,
      status: step.status || 'in-progress',
    };

    if (processingStep.status === 'in-progress' && !processingStep.startedAt) {
      processingStep.startedAt = new Date();
    }

    return this.updateMontage(
      montageId,
      {
        $push: { processingSteps: processingStep },
        $set: { currentStep: step.name },
      },
      session
    );
  }

  /**
   * Update a processing step for a montage
   */
  static async updateMontageProcessingStep(
    montageId: string | Types.ObjectId,
    stepName: string,
    update: Partial<IProcessingStep>,
    session?: ClientSession
  ): Promise<IMontage | null> {
    const montage = await this.getMontageById(montageId, session);
    if (!montage) return null;

    const stepIndex = montage.processingSteps.findIndex((step) => step.name === stepName);
    if (stepIndex === -1) return null;

    // Create a new object with the step data and apply updates
    const step = {
      ...JSON.parse(JSON.stringify(montage.processingSteps[stepIndex])),
      ...update,
    };

    // Update timestamps based on status changes
    if (update.status === 'in-progress' && !step.startedAt) {
      step.startedAt = new Date();
    } else if ((update.status === 'completed' || update.status === 'failed') && !step.completedAt) {
      step.completedAt = new Date();
      if (step.startedAt) {
        step.duration = (step.completedAt.getTime() - step.startedAt.getTime()) / 1000;
      }
    }

    const updateQuery: Record<string, unknown> = {};
    updateQuery[`processingSteps.${stepIndex}`] = step;

    return this.updateMontage(montageId, { $set: updateQuery }, session);
  }

  // ==================== Queue Management ====================

  /**
   * Get the next queued montage for processing
   */
  static async getNextQueuedMontage(session?: ClientSession): Promise<IMontage | null> {
    const options = session ? { session } : {};

    return Montage.findOneAndUpdate(
      { status: 'queued' },
      { $set: { status: 'processing', startedAt: new Date() } },
      {
        ...options,
        sort: { priority: -1, queuedAt: 1 },
        new: true,
      }
    )
      .populate('userId', 'discordId username')
      .populate('clips.clipId', 'filePath duration metadata')
      .exec();
  }

  // ==================== Transaction Helpers ====================

  /**
   * Execute a function within a transaction
   */
  static async withTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
