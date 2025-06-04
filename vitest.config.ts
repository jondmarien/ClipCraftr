import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\/(.*)$/,
        replacement: path.resolve(__dirname, 'packages/server/src/$1'),
      },
      {
        find: /^@bot\/(.*)$/,
        replacement: path.resolve(__dirname, 'packages/bot/src/$1'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    include: [
      'packages/*/src/**/*.test.{ts,js}',
      'packages/*/src/**/__tests__/*.{ts,js}',
    ],
    // Optional: help Vitest find workspace deps if you use custom dirs
    deps: {
      moduleDirectories: ['node_modules', path.resolve(__dirname, 'packages')],
    },
  },
});