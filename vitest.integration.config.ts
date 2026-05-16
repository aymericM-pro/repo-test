import { defineConfig } from 'vitest/config';
import path from 'path';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals:      true,
    environment:  'node',
    globalSetup:  'tests/global-setup.ts',
    setupFiles:   ['tests/integration/setup.ts'],
    include:      ['tests/integration/**/*.spec.ts'],
    pool:         'forks',
    poolOptions:  { forks: { singleFork: true } },
    testTimeout:  30_000,
  },
});
