/**
 * Home Page
 *
 * Main page for User Story 1: View and Filter Terpene Data.
 * Integrates data loading, filtering, and visualization components.
 *
 * @see tasks.md T051
 */

import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useTerpeneData } from '../hooks/useTerpeneData';
import { useFilters } from '../hooks/useFilters';
import { filterTerpenes } from '../services/filterService';
import { FilterControls } from '../components/filters/FilterControls';
import { FilterModeToggle } from '../components/filters/FilterModeToggle';
import { TerpeneList } from '../components/visualizations/TerpeneList';
import { WarningSnackbar } from '../components/common/WarningSnackbar';

/**
 * Home page component
 *
 * @returns Rendered component
 */
export function Home(): React.ReactElement {
  const { t } = useTranslation();

  // Load terpene data
  const { terpenes, effects, isLoading, error, warnings, retry } =
    useTerpeneData();

  // Manage filter state
  const {
    filterState,
    setSearchQuery,
    toggleEffect,
    toggleFilterMode,
    hasActiveFilters,
  } = useFilters();

  // Snackbar state for validation warnings
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  // Show snackbar when warnings appear
  React.useEffect(() => {
    if (warnings && warnings.length > 0) {
      setSnackbarOpen(true);
    }
  }, [warnings]);

  // Apply filters to terpenes
  const filteredTerpenes = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return filterTerpenes(terpenes, filterState);
  }, [terpenes, filterState, isLoading, error]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          {t('pages.home.title', 'Terpene Explorer')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t(
            'pages.home.subtitle',
            'Discover and filter terpenes by their effects and properties'
          )}
        </Typography>
      </Box>

      {/* Filter Controls */}
      <Paper
        elevation={1}
        sx={{ p: 3, mb: 3 }}
        role="search"
        aria-label={t('pages.home.filtersLabel', 'Filter controls')}
      >
        <Stack spacing={3}>
          {/* Search Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t(
              'pages.home.searchPlaceholder',
              'Search terpenes by name, aroma, or effects...'
            )}
            value={filterState.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            aria-label={t('pages.home.searchAriaLabel', 'Search terpenes')}
          />

          {/* Effect Chips */}
          <FilterControls
            effects={effects}
            selectedEffects={filterState.selectedEffects}
            onToggleEffect={toggleEffect}
          />

          {/* Filter Mode Toggle (only show when effects are selected) */}
          {filterState.selectedEffects.length > 1 && (
            <FilterModeToggle
              mode={filterState.effectFilterMode}
              onChange={toggleFilterMode}
            />
          )}

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 600 }}
              role="status"
              aria-live="polite"
            >
              {t('pages.home.filtersActive', 'Filters active')}
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* Results */}
      <Box role="region" aria-label={t('pages.home.resultsLabel', 'Search results')}>
        <TerpeneList
          terpenes={filteredTerpenes}
          isLoading={isLoading}
          error={error}
          warnings={warnings}
          onRetry={retry}
        />
      </Box>

      {/* Validation Warning Snackbar (T054 - FR-015) */}
      <WarningSnackbar
        warnings={warnings}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
}
