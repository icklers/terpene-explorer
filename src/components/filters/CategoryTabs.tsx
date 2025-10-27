/**
 * CategoryTabs Component
 *
 * Displays category tabs for effect categorization with emoticons, colors, and accessibility support.
 * Includes tab navigation, ARIA labels, and category state management.
 *
 * @see specs/003-categorized-effect-filters
 */

import { Box, Button, useMediaQuery, useTheme, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { CATEGORY_UI_CONFIG, CATEGORY_DEFINITIONS } from '../../utils/categoryUIConfig';
import type { Effect } from '../../models/Effect';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Mobile accordion version
  if (isMobile) {
    return (
      <Box>
        {/* Label */}
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Box
            component="h2"
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

              <AccordionDetails sx={{ p: 0, pt: 1, m: 0 }}>
                {/* Effect chips for this category */}
                {(() => {
                  const categoryEffects = categorizedEffects?.[tab.id];
                  if ((categoryEffects?.length ?? 0) > 0) {
                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          pl: 1,
                          pb: 1,
                        }}
                      >
                        {categoryEffects!.map((effect) => {
                          const isSelectedEffect = selectedEffects?.includes(effect.name) || false;
                          const displayName = effect.displayName?.en || effect.name;
                          const count = effect.terpeneCount;
                          const categoryPalette = (theme.palette as unknown as { category?: Record<string, string> }).category;
                          const categoryColor = categoryPalette?.[tab.id] || theme.palette.primary.main;
                          const contrastText = theme.palette.getContrastText?.(categoryColor) || '#ffffff';

                          return (
                            <Button
                              key={effect.name}
                              size="small"
                              variant={isSelectedEffect ? 'contained' : 'outlined'}
                              onClick={() => onToggleEffect?.(effect.name)}
                              sx={{
                                fontSize: '0.75rem',
                                minHeight: 24,
                                backgroundColor: isSelectedEffect ? categoryColor : 'transparent',
                                borderColor: categoryColor,
                                color: isSelectedEffect ? contrastText : categoryColor,
                                opacity: isSelectedEffect ? 1 : 0.8,
                                '&:hover': {
                                  opacity: 1,
                                  backgroundColor: isSelectedEffect ? categoryColor : `${categoryColor}20`,
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
                  }
                  return null;
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
        <Box
          component="h2"
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
