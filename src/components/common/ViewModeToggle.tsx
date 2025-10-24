/**
 * ViewModeToggle Component
 *
 * Toggle button for switching between sunburst and table view modes.
 * Uses Material UI ToggleButtonGroup for consistent styling.
 *
 * @see tasks.md T064
 */

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import TableChartIcon from '@mui/icons-material/TableChart';
import { ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component props
 */
export interface ViewModeToggleProps {
  /** Current view mode */
  mode: 'sunburst' | 'table';
  /** Callback when mode changes */
  onChange: (mode: 'sunburst' | 'table') => void;
  /** Optional label */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * ViewModeToggle component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function ViewModeToggle({ mode, onChange, label, disabled = false }: ViewModeToggleProps): React.ReactElement {
  const { t } = useTranslation();

  const defaultLabel = t('viewMode.label', 'View Mode');

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newMode: 'sunburst' | 'table' | null) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  return (
    <Box>
      {/* Label */}
      <Typography variant="subtitle2" component="label" id="view-mode-label" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
        {label || defaultLabel}
      </Typography>

      {/* Toggle Buttons */}
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        aria-labelledby="view-mode-label"
        aria-label={t('viewMode.ariaLabel', 'Select visualization mode')}
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
        <ToggleButton value="sunburst" aria-label={t('viewMode.sunburst', 'Sunburst chart view')} aria-pressed={mode === 'sunburst'}>
          <DonutLargeIcon sx={{ mr: 1 }} />
          {t('viewMode.sunburstLabel', 'Sunburst')}
        </ToggleButton>
        <ToggleButton value="table" aria-label={t('viewMode.table', 'Table view')} aria-pressed={mode === 'table'}>
          <TableChartIcon sx={{ mr: 1 }} />
          {t('viewMode.tableLabel', 'Table')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
