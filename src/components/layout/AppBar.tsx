/**
 * AppBar Component
 *
 * Application header bar with theme toggle and language selector.
 * Displays app branding and preference controls.
 *
 * @see tasks.md T082
 */

import { AppBar as MuiAppBar, Toolbar, Typography, Box, Container, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ThemeMode } from '../../hooks/useTheme';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle } from '../common/ThemeToggle';
import { SearchBar } from '../filters/SearchBar';

/**
 * Component props
 */
export interface AppBarProps {
  /** Current theme mode */
  themeMode: ThemeMode;
  /** Callback when theme is toggled */
  onThemeToggle: () => void;
  /** Current language code */
  language: string;
  /** Callback when language changes */
  onLanguageChange: (language: string) => void;
  /** Search query (Phase 5: T036) */
  searchQuery: string;
  /** Callback when search changes (Phase 5: T036) */
  onSearchChange: (query: string) => void;
}

/**
 * AppBar component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function AppBar({
  themeMode,
  onThemeToggle,
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
}: AppBarProps): React.ReactElement {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MuiAppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.appBar,
        bgcolor: 'primary.dark', // Dark green background as per spec
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Elevation shadow
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            gap: 2,
            alignItems: 'center',
            px: { xs: 2, md: 4 }, // Responsive horizontal padding: 16px mobile, 32px desktop
            py: { xs: 1, md: 0 },
          }}
        >
          {/* App Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              flexShrink: 0,
            }}
          >
            {t('app.title', 'Terpene Explorer')}
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Search Bar (Phase 5: T036, T038) - Aligned with controls */}
          <Box
            sx={{
              width: { xs: '100%', sm: 350, md: 400 },
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  height: '40px', // Smaller height
                  fontSize: '0.875rem',
                },
              },
            }}
          >
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              maxLength={100}
              placeholder={t('search.placeholder', 'Search terpenes...')}
              ariaLabel={t('search.ariaLabel', 'Search for terpenes')}
            />
          </Box>

          {/* Preference Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            {/* Language Selector */}
            {!isMobile && <LanguageSelector language={language} onChange={onLanguageChange} />}

            {/* Theme Toggle */}
            <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
