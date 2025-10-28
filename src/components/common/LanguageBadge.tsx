import { Chip, ChipProps } from '@mui/material';
import React from 'react';

export interface LanguageBadgeProps extends Omit<ChipProps, 'language'> {
  /** Language code to display (e.g., "EN", "DE") */
  language: string;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label override */
  ariaLabel?: string;
}

/**
 * Displays a language indicator badge for fallback content
 */
export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language, ariaLabel, className, ...chipProps }) => {
  return (
    <Chip
      label={language.toUpperCase()}
      size="small"
      variant="outlined"
      className={className}
      aria-label={ariaLabel || `Content in ${language.toUpperCase()}`}
      {...chipProps}
    />
  );
};
