'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to ClipCraftr
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Sign in with Discord to continue</p>
          <button
            onClick={() => signIn('discord')}
            className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.3 4.6c-1.5-.7-3.1-1.2-4.8-1.5.2.5.3 1 .4 1.5 1.4-.2 2.8.1 4.1.6-.6-.9-1.4-1.7-2.3-2.2-1.1-.6-2.4-1-3.7-1-3.1 0-5.6 2.5-5.6 5.6 0 .4 0 .9.1 1.3-4.3-.2-8.1-2.3-10.6-5.5-.4.8-.7 1.7-.7 2.6 0 1.9.9 3.6 2.3 4.7-1.1 0-2.1-.3-3-.8v.1c0 2.7 1.9 5 4.4 5.5-.5.1-1 .2-1.5.2-.4 0-.7 0-1.1-.1.7 2.3 2.7 3.9 5.1 4-1.9 1.5-4.3 2.4-6.9 2.4-.4 0-.9 0-1.3-.1 2.5 1.6 5.5 2.6 8.7 2.6 10.4 0 16.1-8.6 16.1-16.1 0-.2 0-.5 0-.7 1.1-.8 2-1.8 2.8-2.9-.9.4-1.9.7-3 .8.6-.4 1.1-.9 1.5-1.5-.6.4-1.2.7-1.9.9z" />
            </svg>
            Sign in with Discord
          </button>
        </div>
      </div>
    </div>
  );
}
