import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientLayout } from './ClientLayout';

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'ClipCraftr - Dashboard',
  description: 'Manage your video clips and create amazing montages',
  appleWebApp: {
    title: 'ClipCraftr',
    statusBarStyle: 'black-translucent',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
