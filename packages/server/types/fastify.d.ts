import 'fastify';
import type { User } from '@clipcraftr/shared/types/user';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
} 