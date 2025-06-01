import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  /**
   * Extend the built-in user types
   */
  interface User extends DefaultUser {
    id: string;
    // Add any additional fields your user object might have
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    id: string;
    // Add any additional fields your JWT might have
  }
}
