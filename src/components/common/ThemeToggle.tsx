/**
 * ThemeToggle Component
 *
 * IconButton that toggles between light and dark themes.
 * Displays appropriate icon (sun/moon) and ARIA label for accessibility.
 *
 * @see tasks.md T080
 */

import { Brightness4, Brightness7 } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ThemeMode } from '../../hooks/useTheme';

/**
 * Component props
 */
export interface ThemeToggleProps {
  /** Current theme mode */
  mode: ThemeMode;
  /** Callback when theme is toggled */
  onToggle: () => void;
}

/**
 * ThemeToggle component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function ThemeToggle({ mode, onToggle }: ThemeToggleProps): React.ReactElement {
  const { t } = useTranslation();

  const label =
    mode === 'dark'
      ? t('theme.switchToLight', 'Switch to light mode')
      : t('theme.switchToDark', 'Switch to dark mode');

  const icon = mode === 'dark' ? <Brightness7 /> : <Brightness4 />;

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={onToggle}
        color="inherit"
        aria-label={label}
        sx={{
          '&:focus-visible': {
            outline: '2px solid currentColor',
            outlineOffset: 2,
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
