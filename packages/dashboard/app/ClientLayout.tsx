'use client';

import { Providers } from './providers';
import { aeonik } from './fonts';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${aeonik.variable} font-sans`}>
      <body className="min-h-screen bg-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
