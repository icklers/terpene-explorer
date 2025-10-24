/**
 * TerpeneList Component
 *
 * Displays filtered terpenes with loading, error, warning, and empty states.
 * Implements accessibility features and performance optimization.
 *
 * @see tasks.md T050
 */

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Card, CardContent, Typography, Chip, Alert, Button, Skeleton, Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Terpene } from '../../models/Terpene';

/**
 * Component props
 */
export interface TerpeneListProps {
  /** Terpenes to display */
  terpenes: Terpene[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Validation warnings */
  warnings?: string[] | null;
  /** Retry callback for errors */
  onRetry?: () => void;
  /** Warning dismiss callback */
  onDismissWarning?: () => void;
}

/**
 * TerpeneList component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function TerpeneList({
  terpenes,
  isLoading = false,
  error = null,
  warnings = null,
  onRetry,
  onDismissWarning,
}: TerpeneListProps): React.ReactElement {
  const { t } = useTranslation();

  // Loading state
  if (isLoading) {
    return (
      <Box role="status" aria-live="polite" aria-label={t('common.loading', 'Loading')}>
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={32} />
                  <Skeleton variant="rectangular" width={100} height={32} />
                  <Skeleton variant="rectangular" width={90} height={32} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon />}
        action={
          onRetry && (
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
              {t('common.retry', 'Retry')}
            </Button>
          )
        }
        role="alert"
        aria-live="assertive"
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {t('errors.dataLoadFailed', 'Failed to load terpene data')}
        </Typography>
        <Typography variant="body2">{error.message}</Typography>
      </Alert>
    );
  }

  // Empty state (FR-016)
  if (terpenes.length === 0) {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {t('terpenes.noResults', 'No terpenes found')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('terpenes.noResultsHelp', 'Try adjusting your filters or search query')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Validation Warnings (FR-015) */}
      {warnings && warnings.length > 0 && (
        <Alert severity="warning" onClose={onDismissWarning} sx={{ mb: 2 }} role="alert" aria-live="polite">
          <Typography variant="subtitle2" fontWeight={600}>
            {t('warnings.validationIssues', 'Data validation warnings')}
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
            {warnings.map((warning, index) => (
              <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                {warning}
              </Typography>
            ))}
          </Box>
        </Alert>
      )}

      {/* Result Count */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }} role="status" aria-live="polite">
        {t('terpenes.resultCount', {
          defaultValue: '{{count}} terpene(s) found',
          count: terpenes.length,
        })}
      </Typography>

      {/* Terpene Cards */}
      <Stack spacing={2} role="list" aria-label={t('terpenes.listLabel', 'Terpene list')}>
        {terpenes.map((terpene) => (
          <Card
            key={terpene.id}
            role="listitem"
            sx={{
              '&:hover': {
                boxShadow: 3,
              },
              transition: 'box-shadow 0.2s',
            }}
          >
            <CardContent>
              {/* Terpene Name */}
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                {terpene.name}
              </Typography>

              {/* Aroma */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>{t('terpenes.aroma', 'Aroma')}:</strong> {terpene.aroma}
              </Typography>

              {/* Description */}
              {terpene.description && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {terpene.description}
                </Typography>
              )}

              {/* Effects */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                  {t('terpenes.effects', 'Effects')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {terpene.effects.map((effect) => (
                    <Chip
                      key={effect}
                      label={effect}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Sources */}
              {terpene.sources && terpene.sources.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                    {t('terpenes.sources', 'Sources')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {terpene.sources.join(', ')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
