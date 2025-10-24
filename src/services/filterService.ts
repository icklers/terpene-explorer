/**
 * Filter Service
 *
 * Service for filtering terpenes with AND/OR logic (FR-013).
 * Implements search across name, aroma, and effects.
 *
 * @see tasks.md T044
 */

import type { Terpene } from '../models/Terpene';
import type { FilterState } from '../models/FilterState';

/**
 * Filter terpenes based on filter state
 *
 * @param terpenes - Array of terpenes to filter
 * @param filterState - Current filter state
 * @returns Filtered array of terpenes
 */
export function filterTerpenes(
  terpenes: Terpene[],
  filterState: FilterState
): Terpene[] {
  let filtered = [...terpenes];

  // Apply search query filter
  if (filterState.searchQuery && filterState.searchQuery.trim()) {
    const query = filterState.searchQuery.trim().toLowerCase();
    filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
  }

  // Apply effect filters
  if (filterState.selectedEffects.length > 0) {
    if (filterState.effectFilterMode === 'any') {
      filtered = filtered.filter((terpene) =>
        matchesAnyEffect(terpene, filterState.selectedEffects)
      );
    } else {
      filtered = filtered.filter((terpene) =>
        matchesAllEffects(terpene, filterState.selectedEffects)
      );
    }
  }

  return filtered;
}

/**
 * Check if terpene matches search query
 * Searches across name, aroma, and effects
 *
 * @param terpene - Terpene to check
 * @param query - Search query (lowercase)
 * @returns True if terpene matches query
 */
function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  const name = terpene.name.toLowerCase();
  const aroma = terpene.aroma.toLowerCase();
  const effects = terpene.effects.map((e) => e.toLowerCase()).join(' ');

  return (
    name.includes(query) ||
    aroma.includes(query) ||
    effects.includes(query)
  );
}

/**
 * Check if terpene has at least one of the specified effects (OR logic)
 *
 * @param terpene - Terpene to check
 * @param effects - Array of effect names to match
 * @returns True if terpene has at least one matching effect
 */
export function matchesAnyEffect(terpene: Terpene, effects: string[]): boolean {
  // Empty effects array means no filter
  if (effects.length === 0) {
    return true;
  }

  return effects.some((effect) => terpene.effects.includes(effect));
}

/**
 * Check if terpene has all of the specified effects (AND logic)
 *
 * @param terpene - Terpene to check
 * @param effects - Array of effect names to match
 * @returns True if terpene has all matching effects
 */
export function matchesAllEffects(terpene: Terpene, effects: string[]): boolean {
  // Empty effects array means no filter
  if (effects.length === 0) {
    return true;
  }

  return effects.every((effect) => terpene.effects.includes(effect));
}
