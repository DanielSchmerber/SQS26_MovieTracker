import { defineConfig } from 'vitest/config'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => {
  const isTest = mode === 'test'

  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      !isTest && devtools(),
      !isTest &&
        nitro({
          rollupConfig: { external: [/^@sentry\//] },
          routeRules: {
            '/api/**': { proxy: 'http://127.0.0.1:8000/api/**' },
          },
        }),
      tailwindcss(),
      !isTest && tanstackStart(),
      viteReact(),
    ],
    test: {
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'json'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/routeTree.gen.ts',
          'src/router.tsx',
          'src/routes/**',
          'src/client/axios.ts',
          'src/components/ui/**',
          'src/features/**/*.model.ts',
          'src/integrations/tanstack-query/**',
          'src/**/*.d.ts',
        ],
      },
    },
  }
})

export default config
