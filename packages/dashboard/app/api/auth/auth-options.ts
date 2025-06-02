import type { DefaultSession, NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
    accessToken?: string;
    refreshToken?: string;
  }
}

// Extend the built-in user type
declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// MongoDB connection
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  throw new Error('Discord OAuth credentials are not set in environment variables');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set in environment variables');
}

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export const authOptions: NextAuthConfig = {
  // Ensure we're using the correct base URL
  basePath: '/api/auth',
  // Use the secure cookie flag in production
  useSecureCookies: process.env.NODE_ENV === 'production',
  // Trust the host header (needed for Vercel and other platforms)
  trustHost: true,
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'identify email',
        },
      },
    }),
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: MongoDBAdapter(clientPromise as any, {
    databaseName: process.env.MONGODB_DB || 'clipcraftr',
  }),
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Return access_token and refresh_token in the JWT
        return {
          ...token,
          id: user.id,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined,
        };
      }

      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // If the token has expired, you might want to refresh it here
      // For now, just return the current token
      return token;
    },
    async session({ session, token }) {
      // Ensure the session has a user object
      if (session.user) {
        // Add the user ID to the session
        if (token.sub) {
          session.user.id = token.sub;
        } else if (token.id) {
          session.user.id = token.id as string;
        }

        // Add the access token and other token data to the session
        if (token.accessToken) {
          session.accessToken = token.accessToken as string;
        }
        if (token.refreshToken) {
          session.refreshToken = token.refreshToken as string;
        }

        // Set the session expiry from the token if it exists
        if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number') {
          // The session will automatically handle the expiration
          // We don't need to set it manually as it's handled by NextAuth
        }
      }

      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // DEBUG: Log all incoming redirect callback URLs
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[NextAuth Redirect Callback]', { url, baseUrl });
      }
      // Normalize to path
      let path: string;
      try {
        path = new URL(url, baseUrl).pathname;
      } catch {
        path = url;
      }
      if (
        path === '/login' ||
        path === '/' ||
        path === '/api/auth/signin' ||
        path === '/api/auth/login'
      ) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[NextAuth Redirect Callback] Redirecting to /dashboard');
        }
        return `${baseUrl}/dashboard`;
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        // Handle callback URLs
        return new URL(url, baseUrl).toString();
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  logger: {
    error: (error: Error) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Auth error:', error);
      }
    },
    warn: (code: string) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Auth warning:', code);
      }
    },
    debug: (code: string, metadata: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('Auth debug:', code, metadata);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
