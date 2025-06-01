'use client';

import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';
import { type Session } from 'next-auth';

type Props = {
  children: ReactNode;
  session?: Session | null;
};

export function Providers({ children, session = null }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
