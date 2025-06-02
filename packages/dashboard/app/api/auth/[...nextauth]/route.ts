import NextAuth from 'next-auth';
import { authOptions } from '../auth-options';

// Create the auth handler with all the options
const handler = NextAuth(authOptions);

// Only export GET and POST for NextAuth API route
export { handler as GET, handler as POST };

// Re-export auth options for use in other files
export { authOptions };
