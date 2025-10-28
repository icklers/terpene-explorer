import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

import { LanguageBadge } from './LanguageBadge';

export interface TranslatedTextProps {
  /** Text content to display */
  children: React.ReactNode;
  /** Whether this text is using fallback */
  isFallback: boolean;
  /** Fallback language code */
  fallbackLanguage?: string;
  /** Typography variant (Material UI) */
  variant?: TypographyProps['variant'];
  /** Additional props passed to Typography */
  typographyProps?: Partial<TypographyProps>;
}

/**
 * Wrapper component that handles fallback styling for translated text
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  isFallback,
  fallbackLanguage = 'en',
  variant,
  typographyProps = {},
}) => {
  if (isFallback) {
    return (
      <Typography
        component="em"
        variant={variant}
        sx={{
          fontStyle: 'italic',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          ...typographyProps?.sx,
        }}
        {...typographyProps}
      >
        {children}
        <LanguageBadge language={fallbackLanguage} />
      </Typography>
    );
  }

  return (
    <Typography variant={variant} {...typographyProps}>
      {children}
    </Typography>
  );
};
