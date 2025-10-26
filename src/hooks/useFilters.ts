/**
 * useFilters Hook
 *
 * Custom hook for managing filter state including AND/OR toggle (FR-013).
 * Provides functions for updating search, effects, mode, and view settings.
 * T085: Adds localStorage persistence for viewMode and filterMode.
 *
 * @see tasks.md T047, T085
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
  toggleCategoryFilter: (category: string) => void;
  clearCategoryFilters: () => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Default filter state
 * UAT: Default view mode changed to 'table' for better UX
 */
const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedEffects: [],
  effectFilterMode: 'any',
  viewMode: 'table',
  sortBy: 'name',
  sortDirection: 'asc',
  categoryFilters: [],
};

/**
 * Safely read from localStorage
 *
 * @param key - Storage key
 * @returns Stored value or null
 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely write to localStorage
 *
 * @param key - Storage key
 * @param value - Value to store
 */
function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Safari private mode or quota exceeded - fail silently (T088)
  }
}

/**
 * Custom hook for managing filter state
 *
 * @param initialState - Optional initial filter state
 * @returns Filter state and update functions
 */
export function useFilters(initialState?: Partial<FilterState>): UseFiltersResult {
  // Load persisted preferences (T085)
  const loadPersistedState = useCallback((): FilterState => {
    const viewMode = safeGetItem('viewMode');
    const filterMode = safeGetItem('filterMode');

    return {
      ...DEFAULT_FILTER_STATE,
      viewMode: viewMode === 'sunburst' || viewMode === 'table' ? viewMode : DEFAULT_FILTER_STATE.viewMode,
      effectFilterMode: filterMode === 'any' || filterMode === 'all' ? filterMode : DEFAULT_FILTER_STATE.effectFilterMode,
      ...initialState,
    };
  }, [initialState]);

  const [filterState, setFilterState] = useState<FilterState>(loadPersistedState);

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
        selectedEffects: isSelected ? prev.selectedEffects.filter((e) => e !== effect) : [...prev.selectedEffects, effect],
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

  // Toggle between ANY and ALL modes (T085: persist to localStorage)
  const toggleFilterMode = useCallback(() => {
    setFilterState((prev) => {
      const newMode = prev.effectFilterMode === 'any' ? 'all' : 'any';
      safeSetItem('filterMode', newMode);
      return {
        ...prev,
        effectFilterMode: newMode,
      };
    });
  }, []);

  // Set specific filter mode (T085: persist to localStorage)
  const setFilterMode = useCallback((mode: 'any' | 'all') => {
    setFilterState((prev) => ({
      ...prev,
      effectFilterMode: mode,
    }));
    safeSetItem('filterMode', mode);
  }, []);

  // Set view mode (T085: persist to localStorage)
  const setViewMode = useCallback((mode: 'sunburst' | 'table') => {
    setFilterState((prev) => ({
      ...prev,
      viewMode: mode,
    }));
    safeSetItem('viewMode', mode);
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
      categoryFilters: [],
    }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filterState.searchQuery.trim() !== '' || filterState.selectedEffects.length > 0 || filterState.categoryFilters.length > 0;
  }, [filterState.searchQuery, filterState.selectedEffects, filterState.categoryFilters]);

  // Toggle category filter selection
  const toggleCategoryFilter = useCallback((category: string) => {
    if (!category || category.trim() === '') {
      return; // Ignore empty categories
    }

    setFilterState((prev) => {
      const isSelected = prev.categoryFilters.includes(category);

      return {
        ...prev,
        categoryFilters: isSelected ? prev.categoryFilters.filter((c) => c !== category) : [...prev.categoryFilters, category],
      };
    });
  }, []);

  // Clear all category filters
  const clearCategoryFilters = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      categoryFilters: [],
    }));
  }, []);

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
    toggleCategoryFilter,
    clearCategoryFilters,
    clearAllFilters,
    hasActiveFilters,
  };
}
