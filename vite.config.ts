import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Content Security Policy Plugin
 *
 * Adds CSP headers to HTML for security (T094 - NFR-SEC-001)
 */
function cspPlugin(): Plugin {
  return {
    name: 'html-csp',
    transformIndexHtml(html) {
      // Add CSP meta tag to HTML
      const cspMeta = `
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: https:;
      connect-src 'self';
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    ">`;

      return html.replace('<head>', `<head>${cspMeta}`);
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
    cspPlugin(), // Add CSP headers (T094)
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
  },
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
