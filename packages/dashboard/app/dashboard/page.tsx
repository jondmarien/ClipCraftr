import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/auth-options";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import SignOutButton from "../components/SignOutButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const typedSession = session as Session | null;

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <SignOutButton />
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <span className="text-green-600 font-bold">Welcome, </span>
                <span className="text-orange-500 italic">{typedSession?.user?.name || 'User'}</span>
                <span className="text-orange-500">!</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You are now logged in with Discord.
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Session Data:
                </h3>
                <pre className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-auto text-gray-800 dark:text-gray-200">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
