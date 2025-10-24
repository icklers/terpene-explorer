/**
 * Theme Configuration
 *
 * Integrates Material UI themes with application preferences.
 * Supports light, dark, and system preference modes per FR-006.
 *
 * @see data-model.md for Material UI CssVarsProvider integration
 */

import type { Theme } from '@mui/material/styles';

import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';

/**
 * Theme mode type
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Get theme based on mode
 *
 * @param mode - Theme mode ('light', 'dark', or 'system')
 * @param systemPreference - System color scheme preference
 * @returns Material UI theme object
 */
export function getTheme(
  mode: ThemeMode,
  systemPreference: 'light' | 'dark' = 'light'
): Theme {
  // If system mode, use system preference
  if (mode === 'system') {
    return systemPreference === 'dark' ? darkTheme : lightTheme;
  }

  // Otherwise use explicit mode
  return mode === 'dark' ? darkTheme : lightTheme;
}

/**
 * Detect system color scheme preference
 *
 * @returns 'light' or 'dark' based on system preference
 */
export function detectSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Listen to system color scheme changes
 *
 * @param callback - Function to call when system preference changes
 * @returns Cleanup function to remove listener
 */
export function watchSystemPreference(
  callback: (preference: 'light' | 'dark') => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches ? 'dark' : 'light');
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Fallback for older browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}

/**
 * CSS class for screen-reader only content
 * Used by accessibility utilities
 */
export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
} as const;

/**
 * Global CSS for accessibility
 * Should be injected into the application
 */
export const globalAccessibilityStyles = `
  /* Screen reader only class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Focus visible styles for keyboard navigation */
  :focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    * {
      border-color: currentColor;
    }
  }

  /* Smooth scrolling for non-reduced-motion */
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
`;

/**
 * Export default themes for direct use
 */
export { lightTheme, darkTheme };

/**
 * Theme configuration object
 */
export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  getTheme,
  detectSystemPreference,
  watchSystemPreference,
  srOnlyStyles,
  globalAccessibilityStyles,
} as const;

export default themeConfig;
