# SWC Setup Guide for ClipCraftr

This document explains the SWC configuration and usage in the ClipCraftr monorepo. We've set up SWC as a faster alternative to Babel/TypeScript for building and testing.

## Table of Contents

- [Overview](#overview)
- [Packages Using SWC](#packages-using-swc)
- [Development Workflow](#development-workflow)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## Overview

SWC (Speedy Web Compiler) is a fast JavaScript/TypeScript compiler written in Rust. It's significantly faster than Babel and TypeScript's `tsc`, making development more efficient.

## Packages Using SWC

### 1. Bot Package (`@clipcraftr/bot`)

- Uses SWC for building and running the Discord bot
- Configuration: `.swcrc` in the package root
- Build output: `dist/` directory

### 2. Server Package (`@clipcraftr/server`)

- Uses SWC for building the backend server
- Configuration: `.swcrc` in the package root
- Build output: `dist/` directory

### 3. Dashboard (`@clipcraftr/dashboard`)

- Uses Next.js with built-in SWC support
- Configuration: `next.config.js`
- Build output: `.next/` directory

## Development Workflow

### Starting Development Servers

From the root directory:

```bash
# Start all services in development mode
pnpm dev

# Or start services individually
pnpm bot:dev      # Start bot
pnpm server:dev   # Start server
pnpm dashboard:dev # Start dashboard
```

### Development Features

- **Hot Reloading**: All packages support hot reloading during development
- **Type Checking**: TypeScript type checking runs in a separate process
- **Debugging**: Use VS Code's debugger with the provided launch configurations

## Running Tests

### Bot Package

```bash
cd packages/bot
pnpm test        # Run all tests
pnpm test:watch  # Run in watch mode
pnpm test:coverage # Generate coverage report
```

### Server Package

```bash
cd packages/server
pnpm test        # Run all tests
pnpm test:watch  # Run in watch mode
pnpm test:coverage # Generate coverage report
```

### Dashboard

```bash
cd packages/dashboard
pnpm test        # Run all tests
pnpm test:watch  # Run in watch mode
pnpm test:coverage # Generate coverage report
```

## Building for Production

### Building All Packages

```bash
# From the root directory
pnpm build
```

### Individual Package Builds

```bash
# Build bot
cd packages/bot
pnpm build  # Outputs to dist/

# Build server
cd ../server
pnpm build  # Outputs to dist/

# Build dashboard
cd ../dashboard
pnpm build  # Outputs to .next/
```

### Starting Production Builds

```bash
# From the root directory
pnpm start
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are installed (`pnpm install`)
   - Check for TypeScript errors
   - Verify Node.js version (requires Node.js 18+)

2. **Test Failures**
   - Clear Jest cache: `pnpm test --clearCache`
   - Ensure test environment variables are set

3. **Performance Issues**
   - Clear SWC cache: Delete `.swc` directory in the package
   - Restart the development server

### Debugging

- Set `DEBUG=swc:*` to enable SWC debug logs
- Use `NODE_OPTIONS='--inspect'` for Node.js debugging

## Additional Resources

- [SWC Documentation](https://swc.rs/)
- [Next.js SWC Documentation](https://nextjs.org/docs/advanced-features/compiler)
- [Jest with SWC](https://swc.rs/docs/usage/jest)
