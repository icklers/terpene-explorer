import { defineConfig as defineVitestConfig, configDefaults } from 'vitest/config';
import { mergeConfig } from 'vite';
// Import your main Vite config
import viteConfig from './vite.config';

// viteConfig is a function, so we call it with the test mode
const baseViteConfig = viteConfig({ mode: 'test', command: 'serve' });

export default mergeConfig(
  baseViteConfig,
  defineVitestConfig({
    test: {
      // ----------------------------------------------------
      // START: VITEST SPEED OPTIMIZATIONS
      // ----------------------------------------------------
      globals: true,
      environment: 'happy-dom',
      typecheck: {
        enabled: false,
      },
      pool: 'threads',
      // ----------------------------------------------------
      // END: VITEST SPEED OPTIMIZATIONS
      // ----------------------------------------------------

      setupFiles: ['./src/test/setup.ts'],

      include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],

      // THE PRIMARY FIX: Use default excludes + your own
      exclude: [...configDefaults.exclude, 'tests/e2e', 'backups', 'data', 'docs', 'specs'],

      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/main.tsx', 'src/vite-env.d.ts', 'src/test/**'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },

      // Dependency pre-bundling
      deps: {
        experimentalOptimizer: {
          include: ['react', '@mui/material', '@testing-library/react'],
        },
        include: [
          /^@emotion\/(react|styled)/,
          /^clsx$/,
          /^lodash-es$/,
          '@mui/material',
          '@mui/icons-material',
          '@testing-library/react',
          '@testing-library/user-event',
        ],
      } as unknown as any,
    },
    // We no longer need 'plugins' or 'resolve' here,
    // as they are inherited from vite.config.ts
  })
);
