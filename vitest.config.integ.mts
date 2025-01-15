import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['tests/setup.ts'],
        include: ['tests/integration/*.spec.ts'],
        poolOptions: {
            threads: {
                maxThreads: 1,
            },
        },
    },
})
