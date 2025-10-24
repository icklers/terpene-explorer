/**
 * AppBar Component
 *
 * Application header bar with theme toggle and language selector.
 * Displays app branding and preference controls.
 *
 * @see tasks.md T082
 */

import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import type { ThemeMode } from '../../hooks/useTheme';

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
}: AppBarProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <MuiAppBar position="static" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* App Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            {t('app.title', 'Terpene Explorer')}
          </Typography>

          {/* Preference Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Language Selector */}
            <LanguageSelector language={language} onChange={onLanguageChange} />

            {/* Theme Toggle */}
            <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
