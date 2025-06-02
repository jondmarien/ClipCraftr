'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push('/api/auth/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mb-6 text-gray-700">
          An error occurred during authentication. You will be redirected to the login page shortly.
        </p>
        <button
          onClick={() => router.push('/api/auth/signin')}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}
