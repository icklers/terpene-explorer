/**
 * Application Entry Point
 *
 * Initializes i18n and renders the React application.
 * Sets up the root element with React 18 concurrent features.
 *
 * @see plan.md - Phase 2 application bootstrap
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './i18n/config'; // Initialize i18next

/**
 * Get root element from DOM
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Ensure your HTML file includes <div id="root"></div>'
  );
}

/**
 * Create React root and render application
 * Using React 18's createRoot for concurrent features
 */
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Report web vitals in development mode
 * Uncomment to enable performance monitoring
 */
// if (import.meta.env.DEV) {
//   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//     getCLS(console.log);
//     getFID(console.log);
//     getFCP(console.log);
//     getLCP(console.log);
//     getTTFB(console.log);
//   });
// }
