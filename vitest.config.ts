import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Jest compatibility
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    include: [
      'packages/*/src/**/*.test.{ts,js}',
      'packages/*/src/**/__tests__/*.{ts,js}'
    ],
  },
});
