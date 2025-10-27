/**
 * Unit tests for filterService.ts
 *
 * Tests the OR logic for category and effect filtering per FR-015, FR-016, FR-017.
 *
 * @see tasks.md T048-T053
 */

import { describe, expect, it } from 'vitest';

import type { FilterState } from '../../../src/models/FilterState';
import type { Terpene } from '../../../src/models/Terpene';
import { applyEffectFilters, syncCategoryFilters, getEffectsInCategories } from '../../../src/services/filterService';

const TEST_TERPEMES: Terpene[] = [
  {
    id: '01',
    name: 'Myrcene',
    description: 'Earthy musky terpene',
    aroma: 'earthy, musky, fruity',
    effects: ['Sedative', 'Muscle relaxant', 'Anti-inflammatory'],
    sources: [],
  },
  {
    id: '02',
    name: 'Limonene',
    description: 'Citrus terpene',
    aroma: 'citrus, lemon',
    effects: ['Uplifting', 'Mood enhancing', 'Energizing'],
    sources: [],
  },
  {
    id: '03',
    name: 'Caryophyllene',
    description: 'Peppery terpene',
    aroma: 'peppery, spicy',
    effects: ['Anti-inflammatory', 'Pain relief', 'Anxiety relief'],
    sources: [],
  },
  {
    id: '04',
    name: 'Pinene',
    description: 'Pine terpene',
    aroma: 'piney, fresh',
    effects: ['Alertness', 'Memory-enhancement', 'Breathing support'],
    sources: [],
  },
];

const EMPTY_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedEffects: [],
  effectFilterMode: 'any',
  viewMode: 'table',
  sortBy: 'name',
  sortDirection: 'asc',
  categoryFilters: [],
};

/**
 * Tests that verify OR logic for filtering as defined in user stories and FR requirements
 */
describe('applyEffectFilters - OR Logic (T048-T051)', () => {
  describe('T048: Multiple category filtering with OR logic', () => {
    it('should show terpenes matching ANY of the selected categories', () => {
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: ['relaxation'],
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      // Should include Myrcene (relaxation + physical) and Caryophyllene (relaxation only)
      expect(result.map((t) => t.name)).toEqual(expect.arrayContaining(['Myrcene', 'Caryophyllene']));
      // Should NOT include Pinene (cognitive/physical only - no relaxation)
      expect(result.map((t) => t.name)).not.toContain('Pinene');
    });

    it('should return union of results when multiple categories selected (OR logic)', () => {
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: ['mood', 'cognitive', 'relaxation'],
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      // Should include all terpenes since they all match at least one category
      expect(result).toHaveLength(TEST_TERPEMES.length);
      expect(result.map((t) => t.name).sort()).toEqual(expect.arrayContaining(['Myrcene', 'Limonene', 'Caryophyllene', 'Pinene']));
    });

    it('should return all terpenes when category filter is empty', () => {
      const result = applyEffectFilters(TEST_TERPEMES, EMPTY_FILTER_STATE);

      expect(result).toHaveLength(TEST_TERPEMES.length);
    });
  });

  describe('T049: OR logic when both category and effect filters active', () => {
    it('should return terpenes matching EITHER category OR effect filters', () => {
      // Select relaxation category and cognitive individual effects
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: ['relaxation'], // Myrcene, Caryophyllene
        selectedEffects: ['Alertness', 'Memory-enhancement'], // Pinene, should match cognitive category
        effectFilterMode: 'any',
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      // Should include Myrcene, Caryophyllene (relaxation) AND Pinene (cognitive via effects)
      expect(result.map((t) => t.name)).toEqual(expect.arrayContaining(['Myrcene', 'Caryophyllene', 'Pinene']));
      // Should NOT include Limonene (mood only)
      expect(result.map((t) => t.name)).not.toContain('Limonene');
    });

    it('should work correctly when same category effects are selected', () => {
      // Select relaxation category AND specific relaxation effects
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: ['relaxation'],
        selectedEffects: ['Sedative', 'Anxiety relief'],
        effectFilterMode: 'any',
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      // All relaxation terpenes should be included
      expect(result.map((t) => t.name)).toEqual(expect.arrayContaining(['Myrcene', 'Caryophyllene']));
    });
  });

  describe('T050: applyEffectFilters returns all terpenes when no filters active', () => {
    it('should return all terpenes when both category and effect filters are empty', () => {
      const result = applyEffectFilters(TEST_TERPEMES, EMPTY_FILTER_STATE);
      expect(result).toEqual(TEST_TERPEMES);
    });

    it('should preserve terpene order when returning all', () => {
      const result = applyEffectFilters(TEST_TERPEMES, EMPTY_FILTER_STATE);
      expect(result).toEqual(TEST_TERPEMES);
    });
  });

  describe('T050.5: AND logic for same-category effects', () => {
    it('should filter by individual effects within same category using AND logic', () => {
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: [],
        selectedEffects: ['Uplifting', 'Mood enhancing', 'Energizing'], // Myrcene mood effects
        effectFilterMode: 'all',
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Limonene');
    });
  });

  describe('T051: syncCategoryFilters auto-deselect', () => {
    it('should remove category filters when all their effects are deselected', () => {
      const selectedEffects = ['Uplifting', 'Mood enhancing', 'Energizing', 'Mood stabilizing']; // Mood effects
      const result = syncCategoryFilters(selectedEffects);
      expect(result).toContain('mood');

      // Remove all mood effects
      const updatedSelectedEffects = ['Sedative', 'Anxiety relief']; // Relaxation only
      const updatedResult = syncCategoryFilters(updatedSelectedEffects);
      expect(updatedResult).not.toContain('mood');
      expect(updatedResult).toContain('relaxation');
    });

    it('should keep category selected if ANY of its effects are selected', () => {
      const selectedEffects = ['Uplifting', 'Muscle relaxant']; // Both mood and physical
      const result = syncCategoryFilters(selectedEffects);
      expect(result).toContain('mood');
      expect(result).toContain('physical');
    });
  });

  describe('T052: syncCategoryFilters keeps category if effect still selected', () => {
    it('should preserve category filter when some but not all effects deselected', () => {
      // Start with all mood effects selected
      let selectedEffects = ['Uplifting', 'Mood enhancing', 'Energizing', 'Mood stabilizing'];
      expect(syncCategoryFilters(selectedEffects)).toContain('mood');

      // Deselect some effects
      selectedEffects = ['Uplifting', 'Mood enhancing'];
      expect(syncCategoryFilters(selectedEffects)).toContain('mood');

      // Deselect most effects
      selectedEffects = ['Mood stabilizing'];
      expect(syncCategoryFilters(selectedEffects)).toContain('mood');
    });

    it('should remove category when no effects from that category are selected', () => {
      const selectedEffects = ['Anti-inflammatory', 'Muscle relaxant']; // Physical \u0026 relaxation
      const result = syncCategoryFilters(selectedEffects);
      // Anti-inflammatory and Muscle relaxant should map to physical category based on data mapping
      expect(result).toContain('physical');
      expect(result).not.toContain('mood');
      expect(result).not.toContain('relaxation'); // These effects are physical, not relaxation
    });
  });

  describe('getEffectsInCategories helper', () => {
    it('should return all effects for selected categories', () => {
      const effects = getEffectsInCategories(['mood']);
      expect(effects).toContain('Energizing');
      expect(effects).toContain('Mood enhancing');
      expect(effects.length).toBeGreaterThan(0);
    });

    it('should return unique effects for multiple categories', () => {
      const effects = getEffectsInCategories(['mood', 'cognitive']);
      expect(effects.length).toBeGreaterThan(0);
      expect(effects.length).toBe(new Set(effects).size); // All unique
    });

    it('should return empty array for empty categories', () => {
      const effects = getEffectsInCategories([]);
      expect(effects).toEqual([]);
    });
  });

  describe('Edge cases and filtering scenarios', () => {
    it('should handle empty categories array', () => {
      const result = applyEffectFilters(TEST_TERPEMES, {
        ...EMPTY_FILTER_STATE,
        categoryFilters: [],
      });
      expect(result).toEqual(TEST_TERPEMES);
    });

    it('should handle both category and individual effect filters on same category', () => {
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: ['relaxation'],
        selectedEffects: ['Anxiety relief', 'Sedative'],
        effectFilterMode: 'any',
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      // Should return Myrcene and Caryophyllene (both have relaxation effects)
      expect(result.map((t) => t.name)).toEqual(expect.arrayContaining(['Myrcene', 'Caryophyllene']));
    });

    it('should filter correctly with search query plus category filters', () => {
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        searchQuery: 'limonene',
        categoryFilters: ['mood'],
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Limonene');
    });

    it('should return empty array when no matches', () => {
      const state: FilterState = {
        ...EMPTY_FILTER_STATE,
        categoryFilters: ['unknown-category'],
      };

      const result = applyEffectFilters(TEST_TERPEMES, state);

      expect(result).toEqual([]);
    });
  });
});
