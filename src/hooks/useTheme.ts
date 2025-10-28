/**
 * useTheme Hook
 *
 * Manages theme mode (light/dark) with system preference detection and persistence.
 * Standalone hook that can be used with or without Material UI's useColorScheme.
 *
 * @see tasks.md T078
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Hook return type
 */
export interface UseThemeReturn {
  /** Current theme mode */
  mode: ThemeMode;
  /** Set specific theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark */
  toggleMode: () => void;
}

/**
 * Detect system color scheme preference
 *
 * @returns 'dark' if system prefers dark mode, 'light' otherwise
 */
// Commented until Light theme is fixed. now defaulting to dark.
// function getSystemPreference(): ThemeMode {
//   if (typeof window === 'undefined') {
//     return 'light';
//   }

//   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//   return mediaQuery.matches ? 'dark' : 'light';
// }

/**
 * Safely read from localStorage
 *
 * @param key - Storage key
 * @returns Stored value or null
 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely write to localStorage
 *
 * @param key - Storage key
 * @param value - Value to store
 */
function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Safari private mode or quota exceeded - fail silently
  }
}

/**
 * useTheme hook
 *
 * @returns Theme mode and control functions
 */
export function useTheme(): UseThemeReturn {
  // Initialize state with saved preference or default to dark
  // Previously the default fell back to system preference. Change: default to 'dark'
  // to ensure the app initializes in dark mode for users without a saved preference.
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = safeGetItem('theme');
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved;
    }
    // Get System Preference as soon as light theme is finished.

    // return getSystemPreference();
    // Default to dark mode when no user preference is stored
    return 'dark';
  });

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no user preference is saved
      const saved = safeGetItem('theme');
      if (!saved) {
        const newMode = e.matches ? 'dark' : 'light';
        setModeState(newMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Set theme mode
   */
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    safeSetItem('theme', newMode);
  }, []);

  /**
   * Toggle theme mode
   */
  const toggleMode = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [mode, setMode]);

  return {
    mode,
    setMode,
    toggleMode,
  };
}
