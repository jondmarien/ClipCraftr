import NextAuth from 'next-auth';
import type { DefaultSession } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { MongoDBAdapter as MongoAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Session = {
  user: User & DefaultSession['user'];
  expires: string;
};

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

// Extend the built-in user type

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

// Using type assertion to avoid complex type imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authOptions: any = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter: MongoAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB || 'clipcraftr',
  }),
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export { authOptions };
