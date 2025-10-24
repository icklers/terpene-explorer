/**
 * App Component
 *
 * Root application component that sets up providers and global layout.
 * Integrates Material UI theming, i18n, and error handling.
 * Phase 5: Theme and language preference management with persistence.
 *
 * @see tasks.md T086, T087
 */

import { useEffect, Suspense } from 'react';
import { CssBaseline, GlobalStyles, ThemeProvider, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingIndicator } from './components/common/LoadingIndicator';
import { AppBar } from './components/layout/AppBar';
import { Home } from './pages/Home';
import { lightTheme, darkTheme } from './theme/themeConfig';
import { globalAccessibilityStyles } from './theme/themeConfig';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';

/**
 * Main App Component
 *
 * Sets up the application with:
 * - Material UI ThemeProvider for theming
 * - i18next for internationalization
 * - ErrorBoundary for error handling
 * - Global accessibility styles
 * - Theme and language persistence (T083-T088)
 */
export const App: React.FC = () => {
  const { i18n } = useTranslation();

  // Theme management with localStorage persistence (T083, T086)
  const { mode: themeMode, toggleMode: toggleTheme } = useTheme();

  // Language management with localStorage persistence (T084)
  const [language, setLanguage] = useLocalStorage<string>('language', 'en');

  // Sync i18next with stored language preference
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language).catch((error) => {
        console.warn('Failed to change language:', error);
      });
    }
  }, [language, i18n]);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage).catch((error) => {
      console.warn('Failed to change language:', error);
    });
  };

  // Get the appropriate theme based on mode
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ErrorBoundary>
      <ThemeProvider theme={currentTheme}>
        {/* Reset browser default styles */}
        <CssBaseline />

        {/* Global accessibility styles */}
        <GlobalStyles styles={globalAccessibilityStyles} />

        {/* App Layout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* App Bar with Theme & Language Controls (T087) */}
          <AppBar
            themeMode={themeMode}
            onThemeToggle={toggleTheme}
            language={language}
            onLanguageChange={handleLanguageChange}
          />

          {/* Main Content with Suspense for i18n loading */}
          <Suspense fallback={<LoadingIndicator message="Loading application..." />}>
            <Home />
          </Suspense>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
