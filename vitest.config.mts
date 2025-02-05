import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    exclude: ['tests/integration/*.spec.ts'],
    testTimeout: 30000,
    poolOptions: {
      threads: {
        maxThreads: 1,
      },
    },
  },
})
