/**
 * Footer Component
 *
 * Application footer with accessibility information, copyright, and branding.
 * Implements WCAG 2.1 Level AA compliance information display.
 *
 * @see tasks.md T089
 */

import { Box, Container, Typography, Link } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getFormattedVersion } from '../../utils/version';

/**
 * Footer component
 *
 * @returns Rendered component
 */
export function Footer(): React.ReactElement {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      role="contentinfo"
      aria-label={t('footer.ariaLabel', 'Site footer')}
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]),
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
          }}
        >
          {/* Copyright and Branding */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} {t('footer.appName', 'Terpene Explorer')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('footer.tagline', 'Discover terpenes and their effects')}
            </Typography>
          </Box>

          {/* Accessibility Information */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              {t('footer.accessibility', 'Accessibility')}: WCAG 2.1 Level AA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('footer.wcagDescription', 'Built with accessibility in mind')}
            </Typography>
          </Box>
        </Box>

        {/* Additional Links (if any) */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('footer.version', 'Version {{version}}', { version: getFormattedVersion() })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Link
              href="https://github.com/icklers/terpene-explorer/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              underline="hover"
              aria-label={t('footer.license', 'View license information')}
            >
              License
            </Link>{' '}
            • {t('footer.openSource', 'Open source project')} •{' '}
            <Link
              href="https://github.com/icklers/terpene-explorer"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              underline="hover"
              aria-label={t('footer.githubLink', 'View source code on GitHub')}
            >
              GitHub
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
