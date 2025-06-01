/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enable SWC minification
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['localhost'],
  },
  // appDir is now enabled by default in Next.js 13+
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:4000'}/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors
    ignoreDuringBuilds: true,
  },
  // Configure webpack if needed
  webpack: (config) => {
    // Add custom webpack configurations here
    return config;
  },
};

module.exports = nextConfig;
