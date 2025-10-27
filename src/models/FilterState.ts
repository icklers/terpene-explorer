/**
 * FilterState
 *
 * Represents the current state of user-applied filters and search.
 * This is the core state for filtering and displaying terpene data.
 *
 * @see data-model.md for validation rules and state transitions
 */
export interface FilterState {
  /**
   * Free-text search query
   * Searches across name, aroma, and effects fields
   * @minLength 0
   * @maxLength 200
   */
  searchQuery: string;

  /**
   * Array of selected effect names to filter by
   * Each string should correspond to a valid Effect.name
   */
  selectedEffects: string[];

  /**
   * Filter mode for multiple effect selection
   * - 'any': Show terpenes matching ANY of the selected effects (OR logic)
   * - 'all': Show terpenes matching ALL of the selected effects (AND logic)
   * @default 'any'
   */
  effectFilterMode: 'any' | 'all';

  /**
   * Current visualization mode
   * @default 'sunburst'
   */
  viewMode: 'sunburst' | 'table';

  /**
   * Column to sort by (only applies to table view)
   * @default 'name'
   */
  sortBy: 'name' | 'aroma' | 'effects' | 'sources';

  /**
   * Sort direction
   * @default 'asc'
   */
  sortDirection: 'asc' | 'desc';

  /**
   * Category filters - IDs of active category filters
   * Used for category-level filtering in addition to individual effect filters
   * @default []
   */
  categoryFilters: string[];
}

/**
 * Default initial filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedEffects: [],
  effectFilterMode: 'any',
  viewMode: 'sunburst',
  sortBy: 'name',
  sortDirection: 'asc',
  categoryFilters: [],
};

/**
 * Type guard to check if an object is a valid FilterState
 */
export function isFilterState(obj: unknown): obj is FilterState {
  if (!obj || typeof obj !== 'object') return false;

  const f = obj as Record<string, unknown>;

  return (
    typeof f.searchQuery === 'string' &&
    Array.isArray(f.selectedEffects) &&
    f.selectedEffects.every((e) => typeof e === 'string') &&
    (f.effectFilterMode === 'any' || f.effectFilterMode === 'all') &&
    (f.viewMode === 'sunburst' || f.viewMode === 'table') &&
    ['name', 'aroma', 'effects', 'sources'].includes(f.sortBy as string) &&
    (f.sortDirection === 'asc' || f.sortDirection === 'desc') &&
    Array.isArray(f.categoryFilters) &&
    f.categoryFilters.every((c) => typeof c === 'string')
  );
}
