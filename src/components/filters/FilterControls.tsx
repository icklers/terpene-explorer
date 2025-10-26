/**
 * FilterControls Component
 *
 * Displays effect filter chips with selection state and terpene counts.
 * Implements keyboard navigation and ARIA labels for accessibility.
 *
 * @see tasks.md T048
 */

import ClearIcon from '@mui/icons-material/Clear';
import { Box, Chip, Typography, Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryTabs } from './CategoryTabs';
import type { Effect } from '../../models/Effect';

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

  const defaultLabel = t('filters.effectsLabel', 'Filter by Effects');
  const hasSelection = selectedEffects.length > 0;

  return (
    <Box>
      {/* Category Tabs */}
      {onCategoryToggle && (
        <Box sx={{ mb: 2 }}>
          <CategoryTabs
            selectedCategories={selectedCategories}
            onCategoryToggle={onCategoryToggle}
            label={t('filters.categoriesLabel', 'Filter by Categories')}
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

            return (
              <Chip
                key={effect.name}
                label={count !== undefined ? `${displayName} (${count})` : displayName}
                onClick={() => onToggleEffect(effect.name)}
                onKeyDown={(e) => {
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
                  backgroundColor: isSelected ? effect.color : 'transparent',
                  borderColor: effect.color,
                  color: isSelected ? 'white' : effect.color,
                  fontWeight: isSelected ? 600 : 400,
                  '&:hover': {
                    backgroundColor: isSelected ? effect.color : `${effect.color}20`,
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${effect.color}`,
                    outlineOffset: 2,
                  },
                }}
              />
            );
          })
        )}
      </Box>

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
