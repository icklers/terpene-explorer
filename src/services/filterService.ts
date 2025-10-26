/**
 * Filter Service
 *
 * Service for filtering terpenes with AND/OR logic (FR-013).
 * Implements search across name, aroma, and effects.
 *
 * @see tasks.md T044
 */

import type { FilterState } from '../models/FilterState';
import type { Terpene } from '../models/Terpene';

// Define category mappings inline for now (TBD: refactor to separate file)
const CATEGORY_DEFINITIONS = {
  mood: {
    name: 'Mood & Energy',
    effects: ['Energizing', 'Mood enhancing', 'Mood stabilizing', 'Uplifting'],
  },
  cognitive: {
    name: 'Cognitive & Mental Enhancement',
    effects: ['Alertness', 'Cognitive enhancement', 'Focus', 'Memory-enhancement'],
  },
  relaxation: {
    name: 'Relaxation & Anxiety Management',
    effects: ['Anxiety relief', 'Relaxing', 'Sedative', 'Stress relief', 'Couch-lock'],
  },
  physical: {
    name: 'Physical & Physiological Management',
    effects: ['Anti-inflammatory', 'Appetite suppressant', 'Breathing support', 'Muscle relaxant', 'Pain relief', 'Seizure related'],
  },
};

/**
 * Filter terpenes based on filter state
 *
 * @param terpenes - Array of terpenes to filter
 * @param filterState - Current filter state
 * @returns Filtered array of terpenes
 */
export function filterTerpenes(terpenes: Terpene[], filterState: FilterState): Terpene[] {
  let filtered = [...terpenes];

  // Apply search query filter
  if (filterState.searchQuery && filterState.searchQuery.trim()) {
    const query = filterState.searchQuery.trim().toLowerCase();
    filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
  }

  // Apply category filters first (if any)
  if (filterState.categoryFilters.length > 0) {
    // Get all effects that belong to the selected categories
    const categoryEffects = getEffectsInCategories(filterState.categoryFilters);
    // Apply category filtering as an additional layer
    if (categoryEffects.length > 0) {
      filtered = filtered.filter((terpene) => matchesAnyEffect(terpene, categoryEffects));
    }
  }

  // Apply effect filters
  if (filterState.selectedEffects.length > 0) {
    if (filterState.effectFilterMode === 'any') {
      filtered = filtered.filter((terpene) => matchesAnyEffect(terpene, filterState.selectedEffects));
    } else {
      filtered = filtered.filter((terpene) => matchesAllEffects(terpene, filterState.selectedEffects));
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

  return name.includes(query) || aroma.includes(query) || effects.includes(query);
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

/**
 * Get all effect names that belong to specified categories
 *
 * @param categories - Array of category IDs
 * @returns Array of effect names that belong to these categories
 */
export function getEffectsInCategories(categories: string[]): string[] {
  const allEffects = new Set<string>();

  categories.forEach((category) => {
    const categoryDef = CATEGORY_DEFINITIONS[category as keyof typeof CATEGORY_DEFINITIONS];
    if (categoryDef) {
      categoryDef.effects.forEach((effect) => allEffects.add(effect));
    }
  });

  return Array.from(allEffects);
}

/**
 * Get category id for a given effect name.
 * Returns the category key (mood|cognitive|relaxation|physical) or undefined if not found.
 */
export function getCategoryForEffect(effect: string): string | undefined {
  const name = effect.trim().toLowerCase();

  for (const key of Object.keys(CATEGORY_DEFINITIONS)) {
    const def = CATEGORY_DEFINITIONS[key as keyof typeof CATEGORY_DEFINITIONS];
    if (def.effects.some((e) => e.toLowerCase() === name)) {
      return key;
    }
  }

  return undefined;
}
