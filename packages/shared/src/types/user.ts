import { z } from 'zod';

export const UserRole = z.enum([
  'USER',
  'EDITOR',
  'ADMIN',
  'SUPER_ADMIN',
]);

export type UserRole = z.infer<typeof UserRole>;

export const UserSchema = z.object({
  id: z.string(),
  discordId: z.string(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  email: z.string().email().optional(),
  roles: z.array(UserRole).default(['USER']),
  permissions: z.array(z.string()).default([]),
  preferences: z.record(z.unknown()).default({}),
  isActive: z.boolean().default(true),
  lastLogin: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  createdAt: z.date().or(z.string().pipe(z.coerce.date())),
  updatedAt: z.date().or(z.string().pipe(z.coerce.date())),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserInput = UserSchema.pick({
  discordId: true,
  username: true,
  discriminator: true,
  avatar: true,
  email: true,
  roles: true,
  preferences: true,
}).partial({
  roles: true,
  preferences: true,
});

export type CreateUserInput = z.infer<typeof CreateUserInput>;

export const UpdateUserInput = UserSchema.partial().required({ id: true });
export type UpdateUserInput = z.infer<typeof UpdateUserInput>;

export const UserPreferences = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    discord: z.boolean().default(true),
    push: z.boolean().default(false),
  }),
  privacy: z.object({
    showEmail: z.boolean().default(false),
    showActivity: z.boolean().default(true),
  }),
});

export type UserPreferences = z.infer<typeof UserPreferences>;
