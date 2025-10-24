/**
 * FilterModeToggle Component
 *
 * Toggle button for switching between ANY (OR) and ALL (AND) filter modes (FR-013).
 * Implements keyboard navigation and ARIA labels for accessibility.
 *
 * @see tasks.md T049
 */

import { ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component props
 */
export interface FilterModeToggleProps {
  /** Current filter mode */
  mode: 'any' | 'all';
  /** Callback when mode changes */
  onChange: (mode: 'any' | 'all') => void;
  /** Optional label */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * FilterModeToggle component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function FilterModeToggle({
  mode,
  onChange,
  label,
  disabled = false,
}: FilterModeToggleProps): React.ReactElement {
  const { t } = useTranslation();

  const defaultLabel = t(
    'filters.filterModeLabel',
    'Effect Matching Mode'
  );

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'any' | 'all' | null
  ) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  return (
    <Box>
      {/* Label */}
      <Typography
        variant="subtitle2"
        component="label"
        id="filter-mode-label"
        sx={{ mb: 1, display: 'block', fontWeight: 600 }}
      >
        {label || defaultLabel}
      </Typography>

      {/* Toggle Buttons */}
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        aria-labelledby="filter-mode-label"
        aria-label={t('filters.filterModeAriaLabel', 'Select effect matching mode')}
        disabled={disabled}
        sx={{
          '& .MuiToggleButton-root': {
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
          },
        }}
      >
        <ToggleButton
          value="any"
          aria-label={t(
            'filters.anyModeAriaLabel',
            'Match any effect (OR logic)'
          )}
          aria-pressed={mode === 'any'}
        >
          {t('filters.anyMode', 'Match ANY')}
        </ToggleButton>
        <ToggleButton
          value="all"
          aria-label={t(
            'filters.allModeAriaLabel',
            'Match all effects (AND logic)'
          )}
          aria-pressed={mode === 'all'}
        >
          {t('filters.allMode', 'Match ALL')}
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Help Text */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, display: 'block' }}
      >
        {mode === 'any'
          ? t(
              'filters.anyModeHelp',
              'Show terpenes with at least one selected effect'
            )
          : t(
              'filters.allModeHelp',
              'Show terpenes with all selected effects'
            )}
      </Typography>
    </Box>
  );
}
