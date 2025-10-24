/**
 * Loading Indicator Component
 *
 * Displays a pulsing cannabis leaf animation while data is loading.
 * Implements FR-012 (cannabis leaf loading indicator).
 *
 * @see plan.md - Phase 2 foundational components
 */

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingIndicatorProps {
  /**
   * Loading message to display (optional)
   */
  message?: string;
  /**
   * Whether to show the message (default: true)
   */
  showMessage?: boolean;
  /**
   * Size of the indicator ('small' | 'medium' | 'large')
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to center the indicator vertically (default: true)
   */
  fullHeight?: boolean;
}

/**
 * Cannabis leaf SVG path
 * Simplified cannabis leaf shape for loading animation
 */
const CannabisLeafPath = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Stem */}
    <path d="M50 85 L50 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

    {/* Center leaf */}
    <path d="M50 15 C52 20, 55 25, 50 50 C45 25, 48 20, 50 15 Z" fill="currentColor" />

    {/* Left leaves */}
    <path d="M50 30 C45 30, 35 35, 30 40 C35 38, 45 35, 50 35 Z" fill="currentColor" />
    <path d="M50 40 C43 40, 28 43, 20 50 C28 47, 43 43, 50 45 Z" fill="currentColor" />

    {/* Right leaves */}
    <path d="M50 30 C55 30, 65 35, 70 40 C65 38, 55 35, 50 35 Z" fill="currentColor" />
    <path d="M50 40 C57 40, 72 43, 80 50 C72 47, 57 43, 50 45 Z" fill="currentColor" />
  </svg>
);

/**
 * Loading Indicator Component
 *
 * Displays a pulsing cannabis leaf animation with optional message.
 * Accessible with ARIA labels and respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <LoadingIndicator message="Loading terpene data..." />
 * ```
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, showMessage = true, size = 'medium', fullHeight = true }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Size mapping
  const sizeMap = {
    small: 40,
    medium: 80,
    large: 120,
  };

  const iconSize = sizeMap[size];
  const defaultMessage = t('loading.indicator');

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullHeight ? '60vh' : 'auto',
        py: fullHeight ? 4 : 2,
      }}
    >
      {/* Pulsing cannabis leaf animation */}
      <Box
        sx={{
          position: 'relative',
          width: iconSize,
          height: iconSize,
          color: theme.palette.primary.main,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
          },
          // Respect reduced motion preference
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            opacity: 1,
          },
        }}
      >
        <CannabisLeafPath />
      </Box>

      {/* Alternative: Circular progress for users who prefer it */}
      {/* Uncomment to use Material UI CircularProgress instead of leaf */}
      {/*
      <CircularProgress
        size={iconSize}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      */}

      {/* Loading message */}
      {showMessage && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: 400,
            px: 2,
          }}
        >
          {message || defaultMessage}
        </Typography>
      )}

      {/* Screen reader only text */}
      <Box
        component="span"
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        {t('loading.pleaseWait')}
      </Box>
    </Box>
  );
};

export default LoadingIndicator;
