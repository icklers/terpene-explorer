/**
 * TerpeneTable Component
 *
 * Sortable, virtualized table for displaying terpene data.
 * Uses Material UI Table with react-window for virtualization.
 *
 * @see tasks.md T068
 */

import React, { useState, useMemo } from 'react';
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
import { FixedSizeList as List } from 'react-window';
import { useTranslation } from 'react-i18next';
import type { Terpene } from '../../models/Terpene';

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
export function TerpeneTable({
  terpenes,
  initialSortBy = 'name',
  initialSortDirection = 'asc',
}: TerpeneTableProps): React.ReactElement {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortColumn>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

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

  // Use virtualization for large datasets (>100 rows)
  const useVirtualization = sortedTerpenes.length > 100;

  // Row renderer for virtualization
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const terpene = sortedTerpenes[index];

    return (
      <TableRow
        key={terpene.id}
        style={style}
        sx={{
          '&:hover': { backgroundColor: 'action.hover' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TableCell sx={{ flex: '1 1 20%', minWidth: 150 }}>{terpene.name}</TableCell>
        <TableCell sx={{ flex: '1 1 15%', minWidth: 100 }}>{terpene.aroma}</TableCell>
        <TableCell sx={{ flex: '1 1 35%', minWidth: 200 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {terpene.effects.map((effect) => (
              <Chip
                key={effect}
                label={effect}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Box>
        </TableCell>
        <TableCell sx={{ flex: '1 1 30%', minWidth: 150 }}>
          {terpene.sources.join(', ')}
        </TableCell>
      </TableRow>
    );
  };

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
                aria-sort={
                  sortBy === 'name'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {t('table.name', 'Name')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'aroma'}
                direction={sortBy === 'aroma' ? sortDirection : 'asc'}
                onClick={() => handleSort('aroma')}
                aria-sort={
                  sortBy === 'aroma'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {t('table.aroma', 'Aroma')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'effects'}
                direction={sortBy === 'effects' ? sortDirection : 'asc'}
                onClick={() => handleSort('effects')}
                aria-sort={
                  sortBy === 'effects'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {t('table.effects', 'Effects')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'sources'}
                direction={sortBy === 'sources' ? sortDirection : 'asc'}
                onClick={() => handleSort('sources')}
                aria-sort={
                  sortBy === 'sources'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {t('table.sources', 'Sources')}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {useVirtualization ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ p: 0, border: 'none' }}>
                <List
                  height={600}
                  itemCount={sortedTerpenes.length}
                  itemSize={80}
                  width="100%"
                >
                  {Row}
                </List>
              </TableCell>
            </TableRow>
          ) : (
            sortedTerpenes.map((terpene) => (
              <TableRow
                key={terpene.id}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{terpene.name}</TableCell>
                <TableCell>{terpene.aroma}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {terpene.effects.map((effect) => (
                      <Chip
                        key={effect}
                        label={effect}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{terpene.sources.join(', ')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
