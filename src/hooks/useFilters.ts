/**
 * useFilters Hook
 *
 * Custom hook for managing filter state including AND/OR toggle (FR-013).
 * Provides functions for updating search, effects, mode, and view settings.
 *
 * @see tasks.md T047
 */

import { useState, useCallback, useMemo } from 'react';
import type { FilterState } from '../models/FilterState';

/**
 * Hook return type
 */
export interface UseFiltersResult {
  filterState: FilterState;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  toggleEffect: (effect: string) => void;
  clearEffects: () => void;
  toggleFilterMode: () => void;
  setFilterMode: (mode: 'any' | 'all') => void;
  setViewMode: (mode: 'sunburst' | 'table') => void;
  setSortBy: (column: FilterState['sortBy']) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  handleSort: (column: FilterState['sortBy']) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Default filter state
 */
const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedEffects: [],
  effectFilterMode: 'any',
  viewMode: 'sunburst',
  sortBy: 'name',
  sortDirection: 'asc',
};

/**
 * Custom hook for managing filter state
 *
 * @param initialState - Optional initial filter state
 * @returns Filter state and update functions
 */
export function useFilters(
  initialState?: Partial<FilterState>
): UseFiltersResult {
  const [filterState, setFilterState] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
    ...initialState,
  });

  // Update search query
  const setSearchQuery = useCallback((query: string) => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: query.trim(),
    }));
  }, []);

  // Clear search query
  const clearSearch = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: '',
    }));
  }, []);

  // Toggle effect selection
  const toggleEffect = useCallback((effect: string) => {
    if (!effect || effect.trim() === '') {
      return; // Ignore empty effects
    }

    setFilterState((prev) => {
      const isSelected = prev.selectedEffects.includes(effect);

      return {
        ...prev,
        selectedEffects: isSelected
          ? prev.selectedEffects.filter((e) => e !== effect)
          : [...prev.selectedEffects, effect],
      };
    });
  }, []);

  // Clear all selected effects
  const clearEffects = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      selectedEffects: [],
    }));
  }, []);

  // Toggle between ANY and ALL modes
  const toggleFilterMode = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      effectFilterMode: prev.effectFilterMode === 'any' ? 'all' : 'any',
    }));
  }, []);

  // Set specific filter mode
  const setFilterMode = useCallback((mode: 'any' | 'all') => {
    setFilterState((prev) => ({
      ...prev,
      effectFilterMode: mode,
    }));
  }, []);

  // Set view mode
  const setViewMode = useCallback((mode: 'sunburst' | 'table') => {
    setFilterState((prev) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  // Set sort column
  const setSortBy = useCallback((column: FilterState['sortBy']) => {
    setFilterState((prev) => ({
      ...prev,
      sortBy: column,
    }));
  }, []);

  // Set sort direction
  const setSortDirection = useCallback((direction: 'asc' | 'desc') => {
    setFilterState((prev) => ({
      ...prev,
      sortDirection: direction,
    }));
  }, []);

  // Handle sort (toggle direction if same column, reset to asc if new column)
  const handleSort = useCallback((column: FilterState['sortBy']) => {
    setFilterState((prev) => {
      if (prev.sortBy === column) {
        // Toggle direction for same column
        return {
          ...prev,
          sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // New column, reset to ascending
        return {
          ...prev,
          sortBy: column,
          sortDirection: 'asc',
        };
      }
    });
  }, []);

  // Clear all filters (but keep view mode and sort settings)
  const clearAllFilters = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: '',
      selectedEffects: [],
      effectFilterMode: 'any',
    }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filterState.searchQuery.trim() !== '' ||
      filterState.selectedEffects.length > 0
    );
  }, [filterState.searchQuery, filterState.selectedEffects]);

  return {
    filterState,
    setSearchQuery,
    clearSearch,
    toggleEffect,
    clearEffects,
    toggleFilterMode,
    setFilterMode,
    setViewMode,
    setSortBy,
    setSortDirection,
    handleSort,
    clearAllFilters,
    hasActiveFilters,
  };
}
