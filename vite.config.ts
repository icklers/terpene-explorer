import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
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
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'mui-vendor': ['@mui/material', '@mui/icons-material'],
            'd3-vendor': ['d3-hierarchy', 'd3-scale', 'd3-shape'],
            'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          },
        },
      },
      // Performance budgets
      chunkSizeWarningLimit: 500, // 500KB warning threshold
      copyPublicDir: true,
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
