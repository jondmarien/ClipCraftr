/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enable SWC minification
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Enable experimental features if needed
    // serverComponentsExternalPackages: [],
  },
  images: {
    // Configure image optimization
    domains: [],
  },
  // Enable TypeScript type checking during build
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
