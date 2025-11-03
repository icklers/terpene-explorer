/**
 * TerpeneTable Component
 *
 * Sortable, virtualized table for displaying terpene data.
 * Uses Material UI Table with react-window for virtualization.
 *
 * @see tasks.md T068
 */

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TerpeneCardGrid } from './TerpeneCardGrid';
import type { Terpene } from '../../models/Terpene';
import { getEffectMetadata } from '../../services/colorService';
import { getCategoryForEffect } from '../../services/filterService';
import type { Terpene as NewTerpene } from '../../types/terpene';
import { toNewTerpene } from '../../utils/terpeneAdapter';
import { TerpeneDetailModal } from '../TerpeneDetailModal';

// TODO: Re-enable virtualization with react-window after fixing import issues
// import { FixedSizeList } from 'react-window';

/**
 * Get display name for category with translation
 */
function getCategoryDisplay(category: string | undefined | null, t: (key: string, defaultValue: string) => string): string {
  switch (category) {
    case 'Core':
      return t('table.categoryCore', 'Core');
    case 'Secondary':
      return t('table.categorySecondary', 'Secondary');
    case 'Minor':
      return t('table.categoryMinor', 'Minor');
    default:
      if (category && category !== 'Uncategorized') {
        console.warn(`Invalid category: ${category}`);
      }
      return t('table.categoryUncategorized', 'Uncategorized');
  }
}

/**
 * Component props
 */
export interface TerpeneTableProps {
  /** Terpenes to display */
  terpenes: Terpene[];
  /** Initial sort column */
  initialSortBy?: 'name' | 'aroma' | 'effects' | 'category';
  /** Initial sort direction */
  initialSortDirection?: 'asc' | 'desc';
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc';
type SortColumn = 'name' | 'aroma' | 'effects' | 'category';

/**
 * TerpeneTable component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function TerpeneTable({
  terpenes,
  initialSortBy = 'category',
  initialSortDirection = 'asc',
}: TerpeneTableProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortBy, setSortBy] = useState<SortColumn>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  // State for detail modal (T020) and row selection (US3)
  const [selectedTerpeneId, setSelectedTerpeneId] = useState<string | null>(null);
  const [selectedTerpene, setSelectedTerpene] = useState<NewTerpene | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle sort
  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to asc
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Handle row click to open detail modal and update selection (US3)
  const handleRowClick = (terpene: Terpene) => {
    // Update selected row for visual feedback
    setSelectedTerpeneId(terpene.id);

    // Convert legacy model to the new terpene shape for the detail modal
    const newTerpene = toNewTerpene(terpene);
    setSelectedTerpene(newTerpene);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    // Keep selectedTerpene for potential re-open animation
  };

  // Handle keyboard navigation (T021)
  const handleRowKeyDown = (event: React.KeyboardEvent, terpene: Terpene) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRowClick(terpene);
    }
  };

  // Sort terpenes
  const sortedTerpenes = useMemo(() => {
    // Define category ranking for sorting
    const CATEGORY_RANK = {
      Core: 1,
      Secondary: 2,
      Minor: 3,
      Uncategorized: 4,
    } as const;

    const sorted = [...terpenes].sort((a, b) => {
      let comparison: number;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'aroma':
          comparison = a.aroma.localeCompare(b.aroma);
          break;
        case 'effects':
          comparison = a.effects.join(', ').localeCompare(b.effects.join(', '));
          break;
        case 'category': {
          const categoryA = (a.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;
          const categoryB = (b.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;

          const rankA = CATEGORY_RANK[categoryA];
          const rankB = CATEGORY_RANK[categoryB];

          // Primary sort by category rank
          if (rankA !== rankB) {
            comparison = rankA - rankB;
          } else {
            // Secondary sort by name (alphabetical)
            comparison = a.name.localeCompare(b.name);
          }
          break;
        }
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [terpenes, sortBy, sortDirection]);

  // Empty state
  if (terpenes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t('table.noTerpenes', 'No terpenes to display')}
        </Typography>
      </Box>
    );
  }

  // T002: Conditional rendering - CardGrid on mobile, Table on desktop
  if (isMobile) {
    // Convert legacy Terpene[] to NewTerpene[] for CardGrid
    const newTerpenes = sortedTerpenes.map(toNewTerpene);

    const handleCardClick = (terpene: NewTerpene) => {
      setSelectedTerpeneId(terpene.id);
      setSelectedTerpene(terpene);
      setModalOpen(true);
    };

    return (
      <>
        <TerpeneCardGrid terpenes={newTerpenes} onTerpeneClick={handleCardClick} />
        <TerpeneDetailModal open={modalOpen} terpene={selectedTerpene} onClose={handleModalClose} />
      </>
    );
  }

  // TODO: Re-enable virtualization after fixing react-window import
  // const useVirtualization = sortedTerpenes.length > 100;

  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2, // 8px corners
        overflow: 'hidden', // Contain table within rounded corners
        mb: 3, // 24px margin bottom
      }}
    >
      <Table stickyHeader aria-label={t('table.ariaLabel', 'Terpenes table')}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600 }}>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? sortDirection : 'asc'}
                onClick={() => handleSort('name')}
                aria-sort={sortBy === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                sx={{
                  color: 'primary.contrastText',
                  '&.Mui-active': {
                    color: 'primary.contrastText',
                  },
                  '&:hover': {
                    color: 'primary.contrastText',
                  },
                }}
              >
                {t('table.name', 'Name')}
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600 }}>
              <TableSortLabel
                active={sortBy === 'aroma'}
                direction={sortBy === 'aroma' ? sortDirection : 'asc'}
                onClick={() => handleSort('aroma')}
                aria-sort={sortBy === 'aroma' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                sx={{
                  color: 'primary.contrastText',
                  '&.Mui-active': {
                    color: 'primary.contrastText',
                  },
                  '&:hover': {
                    color: 'primary.contrastText',
                  },
                }}
              >
                {t('table.aroma', 'Aroma')}
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600 }}>
              <TableSortLabel
                active={sortBy === 'effects'}
                direction={sortBy === 'effects' ? sortDirection : 'asc'}
                onClick={() => handleSort('effects')}
                aria-sort={sortBy === 'effects' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                sx={{
                  color: 'primary.contrastText',
                  '&.Mui-active': {
                    color: 'primary.contrastText',
                  },
                  '&:hover': {
                    color: 'primary.contrastText',
                  },
                }}
              >
                {t('table.effects', 'Effects')}
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600 }}>
              <TableSortLabel
                active={sortBy === 'category'}
                direction={sortBy === 'category' ? sortDirection : 'asc'}
                onClick={() => handleSort('category')}
                aria-sort={sortBy === 'category' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                sx={{
                  color: 'primary.contrastText',
                  '&.Mui-active': {
                    color: 'primary.contrastText',
                  },
                  '&:hover': {
                    color: 'primary.contrastText',
                  },
                }}
              >
                {t('table.category', 'Category')}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTerpenes.map((terpene) => (
            <TableRow
              key={terpene.id}
              onClick={() => handleRowClick(terpene)}
              onKeyDown={(e) => handleRowKeyDown(e, terpene)}
              tabIndex={0}
              role="button"
              aria-label={t('table.viewDetailsFor', { name: terpene.name, defaultValue: `View details for ${terpene.name}` })}
              selected={selectedTerpeneId === terpene.id} // Add selected prop for visual indication
              sx={{
                cursor: 'pointer',
                // Zebra striping
                '&:nth-of-type(odd)': {
                  bgcolor: 'action.hover', // Subtle background for odd rows
                },
                '&:nth-of-type(even)': {
                  bgcolor: 'transparent', // Default background for even rows
                },
                // Hover state with transition for performance target (SC-008: 100ms)
                '&:hover': {
                  bgcolor: 'action.selected', // Lighter background on hover
                  transition: 'background-color 100ms ease',
                },
                // Selected state with orange left border as per spec
                '&.Mui-selected': {
                  bgcolor: 'action.selected', // Selected background
                  borderLeft: '4px solid', // Left border indicator
                  borderColor: 'secondary.main', // Orange color for border
                },
                // Selected + hover (prevent darker color on hover when selected)
                '&.Mui-selected:hover': {
                  bgcolor: 'action.selected',
                  transition: 'background-color 100ms ease',
                },
              }}
            >
              <TableCell>
                <Typography sx={{ fontWeight: terpene.category === 'Core' ? 700 : 400 }}>{terpene.name}</Typography>
              </TableCell>
              <TableCell>{terpene.aroma}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {terpene.effects.map((effect) => {
                    // Get the translated effect metadata
                    const effectData = getEffectMetadata(effect);
                    // Use the current language's display name, falling back to the effect name itself if not found
                    let displayName = effectData.displayName[i18n.language as 'en' | 'de'] || effect;
                    // Capitalize the effect name if not already translated
                    if (!effectData.displayName[i18n.language as 'en' | 'de']) {
                      displayName = displayName
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                    }

                    // Get category ID and color for effect (like in FilterControls)
                    const categoryId = getCategoryForEffect(effect);
                    const categoryPalette = (theme.palette as unknown as { category?: Record<string, string> }).category;
                    const categoryColor = categoryId && categoryPalette ? categoryPalette[categoryId] : theme.palette.primary.main;

                    return (
                      <Chip
                        key={effect}
                        label={displayName}
                        size="small"
                        sx={{
                          backgroundColor: `${categoryColor}20`, // 20% opacity for background
                          borderColor: categoryColor,
                          color: categoryColor,
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          '& .MuiChip-label': {
                            color: categoryColor,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </TableCell>
              <TableCell>{getCategoryDisplay(terpene.category, t)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Detail Modal (T022) */}
      <TerpeneDetailModal open={modalOpen} terpene={selectedTerpene} onClose={handleModalClose} />
    </TableContainer>
  );
}
