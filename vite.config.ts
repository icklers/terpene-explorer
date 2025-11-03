import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import fs from 'fs';
import type { Plugin } from 'vite';

/**
 * Content Security Policy Plugin
 *
 * Adds CSP headers to HTML for security (T094 - NFR-SEC-001)
 */
function generateSecurityHeaders(base: string): Record<string, string> {
  const baseUri = base === '/' ? "'self'" : `'self' ${base}`;
  return {
    'Content-Security-Policy': [
      `default-src 'self' ${base}`,
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      `base-uri ${baseUri}`,
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        const headers = generateSecurityHeaders('/');
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        const headers = generateSecurityHeaders('/');
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        next();
      });
    },
  };
}

/**
 * Copy Azure SWA config, data files and create 404.html
 */
function azureSwaPlugin(): Plugin {
  return {
    name: 'azure-swa-config',
    writeBundle() {
      // Copy staticwebapp.config.json to dist
      const configPath = path.resolve('staticwebapp.config.json');
      const distConfigPath = path.resolve('dist/staticwebapp.config.json');
      if (fs.existsSync(configPath)) {
        fs.copyFileSync(configPath, distConfigPath);
        console.log('✅ Copied staticwebapp.config.json to dist/');
      }

      // Create 404.html as a copy of index.html for SPA routing
      const indexPath = path.resolve('dist/index.html');
      const notFoundPath = path.resolve('dist/404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        console.log('✅ Created 404.html for SPA routing');
      }
    },
  };
}

/**
 * Copy data files to public directory
 */
function copyDataFilesPlugin(): Plugin {
  return {
    name: 'copy-data-files',
    writeBundle() {
      // Ensure public/data directory exists
      const publicDataDir = path.resolve('dist/data');
      if (!fs.existsSync(publicDataDir)) {
        fs.mkdirSync(publicDataDir, { recursive: true });
        console.log('✅ Created dist/data directory');
      }

      // Copy terpene database file to public/data
      const terpeneDataPath = path.resolve('data/terpene-database.json');
      const distDataPath = path.resolve('dist/data/terpene-database.json');
      if (fs.existsSync(terpeneDataPath)) {
        fs.copyFileSync(terpeneDataPath, distDataPath);
        console.log('✅ Copied terpene-database.json to dist/data/');
      }

      // Copy German translation file to public/data
      const germanTranslationPath = path.resolve('data/terpene-translations-de.json');
      const distGermanTranslationPath = path.resolve('dist/data/terpene-translations-de.json');
      if (fs.existsSync(germanTranslationPath)) {
        fs.copyFileSync(germanTranslationPath, distGermanTranslationPath);
        console.log('✅ Copied terpene-translations-de.json to dist/data/');
      }

      // Copy effect translations file to dist/data
      const effectTranslationsPath = path.resolve('data/effect-translations.json');
      const distEffectTranslationsPath = path.resolve('dist/data/effect-translations.json');
      if (fs.existsSync(effectTranslationsPath)) {
        fs.copyFileSync(effectTranslationsPath, distEffectTranslationsPath);
        console.log('✅ Copied effect-translations.json to dist/data/');
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      // T008: PWA Plugin with service worker and manifest
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Terpene Explorer',
          short_name: 'Terpenes',
          description: 'Explore cannabis terpenes, their effects, and therapeutic properties',
          theme_color: '#4caf50', // Brand green
          background_color: '#121212', // Dark mode background
          display: 'standalone',
          orientation: 'portrait-primary',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/data\/.*\.json$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'terpene-data-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false, // Disable PWA in development for faster iteration
        },
      }),
      securityHeadersPlugin(), // Add security headers
      azureSwaPlugin(), // Copy Azure SWA config and create 404.html
      copyDataFilesPlugin(), // Copy data files to public directory
    ],
    base: env.VITE_APP_BASE || '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2022',
      rollupOptions: {
        output: {
          // T009: Manual chunking for optimal bundle size
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
            'vendor-mui-icons': ['@mui/icons-material'],
            'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            'vendor-utils': ['zod'],
            // D3 separate chunk (only loaded for advanced visualizations)
            'vendor-d3': ['d3-hierarchy', 'd3-scale', 'd3-shape'],
          },
        },
      },
      // T009: Performance budgets (JS ≤200KB, CSS ≤50KB per spec FR-069-071)
      chunkSizeWarningLimit: 200, // Stricter 200KB warning threshold
      cssCodeSplit: true, // Split CSS for better caching
      copyPublicDir: true,
      minify: 'esbuild', // Fast minification
      sourcemap: false, // Disable sourcemaps in production for smaller bundle
    },
    publicDir: 'public',
    server: {
      port: 5173,
      open: true,
      // Add security headers in dev mode
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    preview: {
      port: 4173,
      // Add security headers in preview mode
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  };
});
