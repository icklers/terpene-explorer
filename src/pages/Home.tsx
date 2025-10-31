/**
 * Home Page
 *
 * Main page for User Stories 1 & 3: View, Filter, and Visualize Terpene Data.
 * Integrates data loading, filtering, search, and visualization components.
 *
 * @see tasks.md T051, T071-T074
 */

import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Container, Box, Typography, Paper, Stack, Skeleton, Collapse, IconButton } from '@mui/material';
import React, { lazy, Suspense, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ViewModeToggle } from '../components/common/ViewModeToggle';
import { WarningSnackbar } from '../components/common/WarningSnackbar';
import { FilterControls } from '../components/filters/FilterControls';
import { FilterModeToggle } from '../components/filters/FilterModeToggle';
import { TerpeneList } from '../components/visualizations/TerpeneList';
import { useFilters } from '../hooks/useFilters';
import { useTerpeneData } from '../hooks/useTerpeneData';
import { useTerpeneDatabase } from '../hooks/useTerpeneDatabase';
import { buildEffectsList, loadEffectTranslations } from '../services/effectTranslationService';
import { filterTerpenes } from '../services/filterService';
import { toLegacyArray } from '../utils/terpeneAdapter';

// Code splitting for visualization components (T074)
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
export interface HomeProps {
  searchQuery: string;
}

export function Home({ searchQuery }: HomeProps): React.ReactElement {
  const { t } = useTranslation();

  // Load translated terpene data (for both views)
  const { terpenes: newTerpenes, loading: newLoading, error: newError, reload } = useTerpeneDatabase();

  // Load data for warnings only
  const { warnings } = useTerpeneData();

  // Determine which data source to use based on view mode
  const {
    filterState,
    // setSearchQuery, // Removed - search is handled by header bar
    toggleEffect,
    toggleFilterMode,
    setViewMode,
    clearAllFilters,
    toggleCategoryFilter,
    hasActiveFilters,
  } = useFilters();

  const handleCategoryToggle = (category: string) => {
    toggleCategoryFilter(category);
  };

  // Use new translated data for both views
  // Convert new schema to legacy model for existing UI components
  const terpenes = toLegacyArray(newTerpenes);
  const isLoading = newLoading;
  const error = newError;

  // Load base terpene data and effect translations
  const [baseTerpenes, setBaseTerpenes] = React.useState<Array<{ id: string; effects: string[] }>>([]);
  const [effectTranslationsLoaded, setEffectTranslationsLoaded] = React.useState(false);

  // Load base terpene data on mount
  React.useEffect(() => {
    const loadBaseTerpenes = async () => {
      try {
        const response = await fetch('/data/terpene-database.json');
        if (response.ok) {
          const data = await response.json();
          const entries = data.terpene_database_schema?.entries || data.entries || [];
          setBaseTerpenes(entries);
        }
      } catch (err) {
        console.error('Failed to load base terpene data:', err);
      }
    };

    loadBaseTerpenes();
  }, []);

  // State for effect translations
  const [effectTranslations, setEffectTranslations] = React.useState<Record<string, { en: string; de: string }>>({});

  // Load effect translations on mount
  React.useEffect(() => {
    const loadTranslations = async () => {
      const translations = await loadEffectTranslations();
      setEffectTranslations(translations);
      setEffectTranslationsLoaded(true);
    };

    loadTranslations();
  }, []);

  // Extract effects from BASE terpenes (English canonical names) with translations
  const effects = React.useMemo(() => {
    if (!effectTranslationsLoaded || baseTerpenes.length === 0) {
      return [];
    }
    return buildEffectsList(baseTerpenes as never[], effectTranslations);
  }, [baseTerpenes, effectTranslationsLoaded, effectTranslations]);

  // Snackbar state for validation warnings
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  // Collapsible filters state (collapsed by default)
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  // Ref for visualization container (T091 - Focus management)
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Show snackbar when warnings appear
  React.useEffect(() => {
    if (warnings && warnings.length > 0) {
      setSnackbarOpen(true);
    }
  }, [warnings]);

  // Focus management when view mode changes (T091 - NFR-A11Y-003)
  // Use a ref to track the previous view mode to prevent unwanted focus on language changes
  const prevViewModeRef = useRef(filterState.viewMode);

  useEffect(() => {
    // Only focus if view mode actually changed (not just re-render from language change)
    if (prevViewModeRef.current !== filterState.viewMode && visualizationRef.current && !isLoading && !error) {
      // Move focus to visualization container when view mode changes
      visualizationRef.current.focus();
    }
    prevViewModeRef.current = filterState.viewMode;
  }, [filterState.viewMode, isLoading, error]);

  // Apply filters to translated terpenes
  const filteredTerpenes = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return filterTerpenes(terpenes, filterState);
  }, [terpenes, filterState, isLoading, error]);

  // Apply search query to filter terpenes
  const searchedTerpenes = React.useMemo(() => {
    if (!searchQuery) return filteredTerpenes;
    return filteredTerpenes.filter((terpene) => terpene.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, filteredTerpenes]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        {/* <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {t('pages.home.title', 'Terpene Explorer')}
        </Typography> */}
        <Typography variant="subtitle1" color="text.secondary">
          {t('pages.home.subtitle', 'Discover and filter terpenes by their effects and properties')}
        </Typography>
      </Box>

      {/* Filter Controls - Floating Card */}
      <Paper
        sx={{
          bgcolor: 'background.paper', // Card surface background
          borderRadius: 2, // 8px corners (2 * 4px base unit)
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Elevation shadow
          p: 3, // 24px internal padding
          mb: 3, // 24px margin bottom
        }}
        role="search"
        aria-label={t('pages.home.filtersLabel', 'Filter controls')}
      >
        {/* Collapsible Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {t('pages.home.filtersTitle', 'Filters')}
            {hasActiveFilters && (
              <Typography component="span" variant="caption" color="primary" sx={{ ml: 2, fontWeight: 600 }}>
                ({t('pages.home.filtersActive', 'Active')})
              </Typography>
            )}
          </Typography>
          <IconButton
            sx={{
              transform: filtersExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
            aria-expanded={filtersExpanded}
            aria-label={
              filtersExpanded ? t('pages.home.collapseFilters', 'Collapse filters') : t('pages.home.expandFilters', 'Expand filters')
            }
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Collapsible Content */}
        <Collapse in={filtersExpanded}>
          <Box sx={{ p: 3, pt: 0 }}>
            <Stack spacing={3}>
              {/* Effect Chips */}
              <FilterControls
                effects={effects}
                selectedEffects={filterState.selectedEffects}
                selectedCategories={filterState.categoryFilters}
                onCategoryToggle={handleCategoryToggle}
                onToggleEffect={toggleEffect}
                onClearFilters={clearAllFilters}
                resultsCount={searchedTerpenes.length}
              />

              {/* Filter Mode Toggle (only show when effects are selected) */}
              {filterState.selectedEffects.length > 1 && (
                <FilterModeToggle mode={filterState.effectFilterMode} onChange={toggleFilterMode} />
              )}

              {/* View Mode Toggle (T072) */}
              <ViewModeToggle mode={filterState.viewMode} onChange={setViewMode} />
            </Stack>
          </Box>
        </Collapse>
      </Paper>

      {/* Results */}
      <Box
        ref={visualizationRef}
        role="region"
        aria-label={t('pages.home.resultsLabel', 'Search results')}
        tabIndex={-1}
        sx={{ outline: 'none' }}
      >
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
        {error && !isLoading && <TerpeneList terpenes={[]} isLoading={false} error={error} warnings={warnings} onRetry={reload} />}

        {/* Conditional Visualization Rendering (T073-T074) */}
        {!isLoading && !error && (
          <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={600} />}>
            {filterState.viewMode === 'sunburst' ? (
              // Placeholder for future sunburst chart implementation
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Sunburst chart view coming soon
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In the meantime, use the table view to explore terpene data
                </Typography>
              </Box>
            ) : (
              // T011e: Pass filtered translated terpenes from new data source
              <TerpeneTable terpenes={searchedTerpenes} />
            )}
          </Suspense>
        )}
      </Box>

      {/* Validation Warning Snackbar (T054 - FR-015) */}
      <WarningSnackbar warnings={warnings} open={snackbarOpen} onClose={() => setSnackbarOpen(false)} />
    </Container>
  );
}
