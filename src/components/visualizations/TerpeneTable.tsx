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
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TerpeneDetailModal } from './TerpeneDetailModal';
import type { Terpene } from '../../models/Terpene';
import { getEffectMetadata } from '../../services/colorService';
import type { Terpene as NewTerpene } from '../../types/terpene';
import { toNewTerpene } from '../../utils/terpeneAdapter';

// TODO: Re-enable virtualization with react-window after fixing import issues
// import { FixedSizeList } from 'react-window';

/**
 * Component props
 */
export interface TerpeneTableProps {
  /** Terpenes to display */
  terpenes: Terpene[];
  /** Initial sort column */
  initialSortBy?: 'name' | 'aroma' | 'sources' | 'effects';
  /** Initial sort direction */
  initialSortDirection?: 'asc' | 'desc';
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc';
type SortColumn = 'name' | 'aroma' | 'sources' | 'effects';

/**
 * TerpeneTable component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function TerpeneTable({ terpenes, initialSortBy = 'name', initialSortDirection = 'asc' }: TerpeneTableProps): React.ReactElement {
  const { t, i18n } = useTranslation();
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
    const sorted = [...terpenes].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'aroma':
          aValue = a.aroma;
          bValue = b.aroma;
          break;
        case 'sources':
          aValue = a.sources.join(', ');
          bValue = b.sources.join(', ');
          break;
        case 'effects':
          aValue = a.effects.join(', ');
          bValue = b.effects.join(', ');
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      const comparison = aValue.localeCompare(bValue);
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
                active={sortBy === 'sources'}
                direction={sortBy === 'sources' ? sortDirection : 'asc'}
                onClick={() => handleSort('sources')}
                aria-sort={sortBy === 'sources' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
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
                {t('table.sources', 'Sources')}
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
              <TableCell>{terpene.name}</TableCell>
              <TableCell>{terpene.aroma}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {terpene.effects.map((effect) => {
                    // Get the translated effect metadata
                    const effectData = getEffectMetadata(effect);
                    // Use the current language's display name, falling back to the effect name itself if not found
                    const displayName = effectData.displayName[i18n.language as 'en' | 'de'] || effect;
                    return <Chip key={effect} label={displayName} size="small" sx={{ textTransform: 'capitalize' }} />;
                  })}
                </Box>
              </TableCell>
              <TableCell>{terpene.sources.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Detail Modal (T022) */}
      <TerpeneDetailModal open={modalOpen} terpene={selectedTerpene} onClose={handleModalClose} />
    </TableContainer>
  );
}
