/**
 * FilterControls Component
 *
 * Displays effect filter chips with selection state and terpene counts.
 * Implements keyboard navigation and ARIA labels for accessibility.
 *
 * @see tasks.md T048
 */

import ClearIcon from '@mui/icons-material/Clear';
import { Box, Chip, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryTabs } from './CategoryTabs';
import type { Effect } from '../../models/Effect';
import { getCategoryForEffect } from '../../services/filterService';

/**
 * Component props
 */
export interface FilterControlsProps {
  /** Available effects with metadata */
  effects: Effect[];
  /** Currently selected effect names */
  selectedEffects: string[];
  /** Currently selected category IDs for categorized filtering */
  selectedCategories?: string[];
  /** Callback when category selection changes */
  onCategoryToggle?: (category: string) => void;
  /** Callback when effect is toggled */
  onToggleEffect: (effect: string) => void;
  /** Callback when clear filters button is clicked (UAT) */
  onClearFilters?: () => void;
  /** Optional label */
  label?: string;
  /** Results count for ARIA live region (T090) */
  resultsCount?: number;
}

/**
 * FilterControls component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function FilterControls({
  effects,
  selectedEffects,
  selectedCategories = [],
  onCategoryToggle,
  onToggleEffect,
  onClearFilters,
  label,
  resultsCount,
}: FilterControlsProps): React.ReactElement {
  const { t } = useTranslation();
  const theme = useTheme(); // Get theme for contrast text calculation
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const defaultLabel = t('filters.effectsLabel', 'Filter by Effects');
  const hasSelection = selectedEffects.length > 0;

  /**
   * Group effects by category for categorized filter display
   * Used by CategoryTabs to organize effects by therapeutic category
   *
   * @returns Object mapping category IDs to arrays of effects
   */
  // Group effects by category for CategoryTabs accordion functionality
  const categorizedEffects = React.useMemo(() => {
    const grouped: Record<string, Effect[]> = {};
    effects.forEach((effect) => {
      const categoryId = getCategoryForEffect(effect.name);
      if (categoryId) {
        if (!grouped[categoryId]) {
          grouped[categoryId] = [];
        }
        grouped[categoryId].push(effect);
      }
    });
    return grouped;
  }, [effects]);

  return (
    <Box>
      {/* Category Tabs */}
      {onCategoryToggle && (
        <Box sx={{ mb: 2 }}>
          <CategoryTabs
            selectedCategories={selectedCategories}
            onCategoryToggle={onCategoryToggle}
            label={t('filters.categoriesLabel', 'Filter by Categories')}
            categorizedEffects={categorizedEffects}
            selectedEffects={selectedEffects}
            onToggleEffect={onToggleEffect}
          />
        </Box>
      )}

      {/* Label with Clear Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" component="label" id="effect-filter-label" sx={{ fontWeight: 600 }}>
          {label || defaultLabel}
        </Typography>

        {/* Clear Filters Button (UAT) - Only show when effects are selected */}
        {hasSelection && onClearFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            aria-label={t('filters.clearFilters', 'Clear all filters')}
          >
            {t('filters.clear', 'Clear')}
          </Button>
        )}
      </Box>

      {/* Effect Chips */}
      {/* Effect Chips - Hidden on mobile since they are shown in category accordions */}
      {!isMobile && (
        <Box
          role="group"
          aria-labelledby="effect-filter-label"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {effects.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('filters.noEffects', 'No effects available')}
            </Typography>
          ) : (
            effects.map((effect) => {
              const isSelected = selectedEffects.includes(effect.name);
              const displayName = effect.displayName.en || effect.name;
              const count = effect.terpeneCount;
              // Get category ID and color for effect
              const categoryId = getCategoryForEffect(effect.name);
              const categoryPalette = (theme.palette as unknown as { category?: Record<string, string> }).category;
              const categoryColor = categoryId && categoryPalette ? categoryPalette[categoryId] : theme.palette.primary.main;
              const contrastText = theme.palette.getContrastText ? 
                (categoryId && categoryPalette && categoryPalette[categoryId] ? 
                  theme.palette.getContrastText(categoryPalette[categoryId]) : 
                  theme.palette.getContrastText(theme.palette.primary.main)) : 
                '#ffffff';

              return (
                <Chip
                  key={effect.name}
                  label={count !== undefined ? `${displayName} (${count})` : displayName}
                  onClick={() => onToggleEffect(effect.name)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onToggleEffect(effect.name);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={
                    count !== undefined
                      ? t('filters.effectChipWithCount', {
                          defaultValue: `${displayName}, ${count} terpenes`,
                          effect: displayName,
                          count,
                        })
                      : displayName
                  }
                  clickable
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
                    // Dual indicator pattern for filter chips:
                    // 1. Background color using category-specific colors
                    // 2. Border color using category-specific colors to maintain visual consistency
                    backgroundColor: isSelected ? categoryColor : 'transparent', // Selected: category color, Unselected: transparent
                    border: '2px solid',
                    borderColor: categoryColor, // Use category color for border
                    color: isSelected ? contrastText : categoryColor, // Selected: contrast text, Unselected: category color
                    fontWeight: isSelected ? 600 : 400,
                    '&:hover': {
                      backgroundColor: isSelected ? categoryColor : `${categoryColor}20`, // Slight opacity for unselected
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'secondary.main', // Use orange for focus as per spec
                      outlineOffset: 2,
                    },
                  }}
                />
              );
            })
          )}
        </Box>
      )}

      {/* ARIA live region for results count (T090) */}
      {resultsCount !== undefined && hasSelection && (
        <Box
          role="status"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {resultsCount === 0
            ? t('filters.noResultsFound', 'No terpenes match the selected filters')
            : resultsCount === 1
              ? t('filters.oneResult', '1 terpene found')
              : t('filters.resultsCount', {
                  defaultValue: '{{count}} terpenes found',
                  count: resultsCount,
                })}
        </Box>
      )}
    </Box>
  );
}
