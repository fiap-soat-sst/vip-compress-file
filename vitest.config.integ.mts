import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/*.spec.ts'],
    poolOptions: {
      threads: {
        maxThreads: 1,
      },
    },
  },
})
