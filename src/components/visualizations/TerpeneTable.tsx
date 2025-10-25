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

import type { Terpene } from '../../models/Terpene';
import { TerpeneDetailModal } from './TerpeneDetailModal';
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
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortColumn>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  // State for detail modal (T020)
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

  // Handle row click to open detail modal (T019, T022)
  const handleRowClick = (terpene: Terpene) => {
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
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label={t('table.ariaLabel', 'Terpenes table')}>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? sortDirection : 'asc'}
                onClick={() => handleSort('name')}
                aria-sort={sortBy === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                {t('table.name', 'Name')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'aroma'}
                direction={sortBy === 'aroma' ? sortDirection : 'asc'}
                onClick={() => handleSort('aroma')}
                aria-sort={sortBy === 'aroma' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                {t('table.aroma', 'Aroma')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'effects'}
                direction={sortBy === 'effects' ? sortDirection : 'asc'}
                onClick={() => handleSort('effects')}
                aria-sort={sortBy === 'effects' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                {t('table.effects', 'Effects')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'sources'}
                direction={sortBy === 'sources' ? sortDirection : 'asc'}
                onClick={() => handleSort('sources')}
                aria-sort={sortBy === 'sources' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
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
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                '&:focus': { backgroundColor: 'action.focus', outline: '2px solid primary.main', outlineOffset: '-2px' },
              }}
            >
              <TableCell>{terpene.name}</TableCell>
              <TableCell>{terpene.aroma}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {terpene.effects.map((effect) => (
                    <Chip key={effect} label={effect} size="small" sx={{ textTransform: 'capitalize' }} />
                  ))}
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
