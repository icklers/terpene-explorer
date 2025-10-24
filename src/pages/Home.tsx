/**
 * Home Page
 *
 * Main page for User Stories 1 & 3: View, Filter, and Visualize Terpene Data.
 * Integrates data loading, filtering, search, and visualization components.
 *
 * @see tasks.md T051, T071-T074
 */

import React, { lazy, Suspense } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stack,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTerpeneData } from '../hooks/useTerpeneData';
import { useFilters } from '../hooks/useFilters';
import { filterTerpenes } from '../services/filterService';
import { transformToSunburstData } from '../utils/sunburstTransform';
import { SearchBar } from '../components/filters/SearchBar';
import { FilterControls } from '../components/filters/FilterControls';
import { FilterModeToggle } from '../components/filters/FilterModeToggle';
import { ViewModeToggle } from '../components/common/ViewModeToggle';
import { TerpeneList } from '../components/visualizations/TerpeneList';
import { WarningSnackbar } from '../components/common/WarningSnackbar';

// Code splitting for visualization components (T074)
const SunburstChart = lazy(() =>
  import('../components/visualizations/SunburstChart').then((module) => ({
    default: module.SunburstChart,
  }))
);
const TerpeneTable = lazy(() =>
  import('../components/visualizations/TerpeneTable').then((module) => ({
    default: module.TerpeneTable,
  }))
);

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
    setViewMode,
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
          {/* Search Input (T071) */}
          <SearchBar
            value={filterState.searchQuery}
            onChange={setSearchQuery}
            placeholder={t(
              'pages.home.searchPlaceholder',
              'Search terpenes by name, aroma, or effects...'
            )}
            ariaLabel={t('pages.home.searchAriaLabel', 'Search terpenes')}
            resultsCount={filteredTerpenes.length}
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

          {/* View Mode Toggle (T072) */}
          <ViewModeToggle
            mode={filterState.viewMode}
            onChange={setViewMode}
          />

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
        {/* Loading State */}
        {isLoading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Skeleton variant="rectangular" width="100%" height={600} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {t('pages.home.loading', 'Loading terpene data...')}
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <TerpeneList
            terpenes={[]}
            isLoading={false}
            error={error}
            warnings={warnings}
            onRetry={retry}
          />
        )}

        {/* Conditional Visualization Rendering (T073-T074) */}
        {!isLoading && !error && (
          <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={600} />}>
            {filterState.viewMode === 'sunburst' ? (
              <SunburstChart
                data={transformToSunburstData(filteredTerpenes)}
                onSliceClick={(node) => {
                  if (node.type === 'effect') {
                    toggleEffect(node.name);
                  }
                }}
              />
            ) : (
              <TerpeneTable terpenes={filteredTerpenes} />
            )}
          </Suspense>
        )}
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
