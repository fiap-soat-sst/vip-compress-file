import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      enabled: true,
      reporter: ['lcov', 'cobertura', 'text'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/UseCases/*',
        '**/Gateways/*',
        'src/@Shared/*',
        'src/index.ts',
      ],
    },
  },
})
