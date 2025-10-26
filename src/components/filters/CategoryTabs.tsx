/**
 * CategoryTabs Component
 *
 * Displays category tabs for effect categorization with emoticons, colors, and accessibility support.
 * Includes tab navigation, ARIA labels, and category state management.
 *
 * @see specs/003-categorized-effect-filters
 */

import { Box, Button, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CATEGORY_UI_CONFIG, CATEGORY_DEFINITIONS } from '../../utils/categoryUIConfig';

export interface CategoryTabsProps {
  /** Currently selected category IDs */
  selectedCategories: string[];
  /** Callback when category selection changes */
  onCategoryToggle: (category: string) => void;
  /** Optional label */
  label?: string;
}

export function CategoryTabs({ selectedCategories, onCategoryToggle, label }: CategoryTabsProps): React.ReactElement {
  const { t } = useTranslation();
  const theme = useTheme();

  const defaultLabel = t('filters.categoriesLabel', 'Filter by Categories');

  const handleCategoryToggle = (categoryId: string) => {
    if (onCategoryToggle) {
      onCategoryToggle(categoryId);
    }
  };

  // Get category tabs sorted by display order
  const categoryTabs = React.useMemo(() => {
    return Object.entries(CATEGORY_DEFINITIONS)
      .sort(([, a], [, b]) => a.displayOrder - b.displayOrder)
      .map(([categoryId, category]) => {
        const config = CATEGORY_UI_CONFIG[categoryId as keyof typeof CATEGORY_UI_CONFIG];
        const isSelected = selectedCategories.includes(categoryId);
        // Safely access extended category palette without using `any`
        const categoryPalette = (theme.palette as unknown as { category?: Record<string, string> }).category;
        const categoryColor = categoryPalette?.[categoryId] || theme.palette.primary.main;

        const contrastTextRaw = theme.palette.getContrastText ? theme.palette.getContrastText(categoryColor) : '#ffffff';
        // Prefer a dark text for selected tabs when contrastText is light (keep consistency with effect chips)
        const contrastText = /^#?f{3,6}$/i.test(contrastTextRaw.replace('#', '')) ? theme.palette.text.primary : contrastTextRaw;

        return {
          id: categoryId,
          label: t(`filters.categories.${categoryId}`, category.name),
          emoticon: config?.emoticon || '',
          ariaLabel: config?.ariaLabel || category.name,
          categoryColor,
          contrastText,
          isSelected,
        };
      });
  }, [selectedCategories, theme.palette, t]);

  return (
    <Box>
      {/* Label */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Box
          component="h3"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: '1.25rem',
            margin: 0,
            color: 'text.primary',
          }}
          id="category-filter-label"
        >
          {label || defaultLabel}
        </Box>
      </Box>

      {/* Category Tabs */}
      <Box
        role="tablist"
        aria-labelledby="category-filter-label"
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {categoryTabs.map((tab) => (
          <Button
            key={tab.id}
            role="tab"
            aria-selected={tab.isSelected}
            aria-label={tab.ariaLabel}
            id={`category-tab-${tab.id}`}
            aria-controls={`category-panel-${tab.id}`}
            onClick={() => handleCategoryToggle(tab.id)}
            variant={tab.isSelected ? 'contained' : 'outlined'}
            sx={{
              minHeight: 32,
              fontWeight: tab.isSelected ? 600 : 400,
              backgroundColor: tab.isSelected ? tab.categoryColor : 'transparent',
              borderColor: tab.categoryColor,
              color: tab.isSelected ? tab.contrastText : tab.categoryColor,
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: tab.isSelected ? tab.categoryColor : `${tab.categoryColor}20`,
              },
              '&:selected': {
                outline: `2px solid ${tab.categoryColor}`,
                outlineOffset: 2,
              },
            }}
          >
            {tab.emoticon} {tab.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
