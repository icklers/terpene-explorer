/**
 * App Component
 *
 * Root application component that sets up providers and global layout.
 * Integrates Material UI theming, i18n, and error handling.
 *
 * @see plan.md - Phase 2 application bootstrap
 */

import { useState, useEffect, Suspense } from 'react';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingIndicator } from './components/common/LoadingIndicator';
import { lightTheme, darkTheme } from './theme/themeConfig';
import { detectSystemPreference, watchSystemPreference } from './theme/themeConfig';
import { globalAccessibilityStyles } from './theme/themeConfig';
import type { StoredPreferences } from './models/Preferences';
import { PREFERENCES_STORAGE_KEY } from './models/Preferences';

/**
 * Load stored preferences from localStorage
 */
function loadPreferences(): StoredPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredPreferences;
    }
  } catch (error) {
    console.warn('Failed to load preferences from localStorage:', error);
  }

  // Default preferences
  return {
    theme: 'system',
    language: 'en',
  };
}

/**
 * Main App Component
 *
 * Sets up the application with:
 * - Material UI CssVarsProvider for theming
 * - i18next for internationalization
 * - ErrorBoundary for error handling
 * - Global accessibility styles
 * - System preference detection
 */
export const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [preferences] = useState<StoredPreferences>(loadPreferences);
  // TODO: setPreferences will be used in Phase 3 for theme/language toggles
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(
    detectSystemPreference()
  );

  // Initialize language from preferences
  useEffect(() => {
    if (preferences.language && i18n.language !== preferences.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language, i18n]);

  // Watch for system preference changes
  useEffect(() => {
    const cleanup = watchSystemPreference((newPreference) => {
      setSystemPreference(newPreference);
    });

    return cleanup;
  }, []);

  // Determine effective theme mode
  const effectiveMode: 'light' | 'dark' =
    preferences.theme === 'system' ? systemPreference : preferences.theme;

  // Get the appropriate theme based on mode
  const currentTheme = effectiveMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ErrorBoundary>
      <ThemeProvider theme={currentTheme}>
        {/* Reset browser default styles */}
        <CssBaseline />

        {/* Global accessibility styles */}
        <GlobalStyles styles={globalAccessibilityStyles} />

        {/* App content with Suspense for i18n loading */}
        <Suspense fallback={<LoadingIndicator message="Loading application..." />}>
          {/* Placeholder for main content */}
          {/* This will be replaced with actual components in Phase 3 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <h1>Interactive Terpene Map</h1>
            <p>Application bootstrap complete. Ready for component implementation.</p>
            <p style={{ fontSize: '0.875rem', color: 'gray', marginTop: '1rem' }}>
              Current theme: {effectiveMode} | Language: {i18n.language}
            </p>
          </div>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
