"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 font-semibold rounded transition gradient-bg border border-gray-300 dark:border-gray-700 text-red-600 dark:text-red-400 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Sign Out
    </button>
  );
}
