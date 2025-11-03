/**
 * CategoryTabs Component
 *
 * Displays category tabs for effect categorization with emoticons, colors, and accessibility support.
 * Includes tab navigation, ARIA labels, and category state management.
 *
 * @see specs/003-categorized-effect-filters
 */

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Typography, useMediaQuery, useTheme, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Effect } from '../../models/Effect';
import { CATEGORY_UI_CONFIG, CATEGORY_DEFINITIONS } from '../../utils/categoryUIConfig';

export interface CategoryTabsProps {
  /** Currently selected category IDs */
  selectedCategories: string[];
  /** Callback when category selection changes */
  onCategoryToggle: (category: string) => void;
  /** Optional label */
  label?: string;
  /** Available effects organized by category */
  categorizedEffects?: Record<string, Effect[]>;
  /** Selected effect names for effect chips */
  selectedEffects?: string[];
  /** Callback when effect is toggled */
  onToggleEffect?: (effect: string) => void;
}

export function CategoryTabs({
  selectedCategories,
  onCategoryToggle,
  label,
  categorizedEffects,
  selectedEffects = [],
  onToggleEffect,
}: CategoryTabsProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const defaultLabel = t('filters.categoriesLabel', 'Filter by Categories');

  /**
   * Handle category toggle event
   *
   * @param categoryId - The ID of the category to toggle
   */
  const handleCategoryToggle = (categoryId: string) => {
    if (onCategoryToggle) {
      onCategoryToggle(categoryId);
    }
  };

  /**
   * Get category tabs sorted by display order with color and accessibility data
   * Creates tab configuration with emoticons, ARIA labels, and theme colors
   *
   * @returns Array of category tabs with display configuration
   */
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

  /**
   * Mobile Accordion version
   * Displays categories as collapsible accordion panels with category checkboxes in headers and effect chips in details
   * Supports expand/collapse with keyboard navigation and swipe gestures
   */
  // Mobile accordion version
  if (isMobile) {
    return (
      <Box>
        {/* Label */}
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 600 }} id="category-filter-label">
            {label || defaultLabel}
          </Typography>
        </Box>

        {/* Mobile Accordion Categories */}
        <Box>
          {categoryTabs.map((tab) => (
            <Accordion
              key={tab.id}
              defaultExpanded={false}
              data-testid="category-accordion"
              slotProps={{
                root: {
                  role: 'group',
                  'aria-labelledby': `category-tab-${tab.id}`,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: tab.isSelected ? tab.contrastText : tab.categoryColor }} />}
                sx={{
                  backgroundColor: tab.isSelected ? tab.categoryColor : 'transparent',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: tab.categoryColor,
                  '&:hover': {
                    backgroundColor: tab.isSelected ? tab.categoryColor : `${tab.categoryColor}20`,
                  },
                }}
              >
                <Button
                  role="tab"
                  aria-selected={tab.isSelected}
                  aria-label={tab.ariaLabel}
                  id={`category-tab-${tab.id}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion from toggling when clicking the button
                    handleCategoryToggle(tab.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      handleCategoryToggle(tab.id);
                    }
                  }}
                  variant={tab.isSelected ? 'text' : 'text'}
                  sx={{
                    minHeight: 32,
                    fontWeight: tab.isSelected ? 600 : 400,
                    color: tab.isSelected ? tab.contrastText : tab.categoryColor,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    marginLeft: 2,
                    p: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    flex: 1,
                  }}
                  size="small"
                >
                  {tab.emoticon} {tab.label}
                </Button>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  p: 2, // UAT Fix: Add padding for better spacing
                  // UAT Fix: Enable scrolling for long effect lists
                  maxHeight: 300,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  // UAT Fix: Ensure background is visible
                  backgroundColor: 'background.paper',
                }}
              >
                {/* Effect chips for this category */}
                {(() => {
                  const categoryEffects = categorizedEffects?.[tab.id];
                  // UAT Fix: Show message if no effects exist
                  if (!categoryEffects || categoryEffects.length === 0) {
                    return (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, px: 1 }}>
                        {t('filters.noEffectsInCategory', 'No effects in this category')}
                      </Typography>
                    );
                  }
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1, // UAT Fix: Larger gap for better spacing
                      }}
                    >
                      {categoryEffects!.map((effect) => {
                        const isSelectedEffect = selectedEffects?.includes(effect.name) || false;
                        const displayName = effect.displayName[i18n.language as 'en' | 'de'] || effect.displayName.en || effect.name;
                        const count = effect.terpeneCount;
                        // Use the category color that's already defined for the tab
                        const categoryColor = tab.categoryColor;
                        const contrastText = tab.contrastText;

                        return (
                          <Button
                            key={effect.name}
                            size="small"
                            variant={isSelectedEffect ? 'contained' : 'outlined'}
                            onClick={() => onToggleEffect?.(effect.name)}
                            sx={{
                              // UAT Fix: Improve visibility and touch targets on mobile
                              fontSize: '0.875rem', // Larger text for readability
                              minHeight: 48, // WCAG AA touch target size
                              px: 2, // Horizontal padding
                              // UAT Fix: Ensure color coding is visible
                              backgroundColor: isSelectedEffect ? categoryColor : 'transparent',
                              borderWidth: 2, // Thicker border for visibility
                              borderStyle: 'solid',
                              borderColor: categoryColor,
                              color: isSelectedEffect ? contrastText : categoryColor,
                              fontWeight: isSelectedEffect ? 600 : 400,
                              textTransform: 'none',
                              '&:hover': {
                                backgroundColor: isSelectedEffect ? categoryColor : `${categoryColor}20`,
                              },
                              // Ensure text is always visible
                              '& .MuiButton-label': {
                                color: isSelectedEffect ? contrastText : categoryColor,
                              },
                            }}
                          >
                            {displayName}
                            {count !== undefined && ` (${count})`}
                          </Button>
                        );
                      })}
                    </Box>
                  );
                })()}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    );
  }

  // Desktop tab version
  return (
    <Box>
      {/* Label */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 600 }} id="category-filter-label">
          {label || defaultLabel}
        </Typography>
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
