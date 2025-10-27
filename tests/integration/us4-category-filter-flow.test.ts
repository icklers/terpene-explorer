import { describe, it, expect, beforeEach } from 'vitest';
import { filterTerpenes, getEffectsInCategories, syncCategoryFilters } from '../../src/services/filterService';
import type { Terpene } from '../../src/models/Terpene';
import type { FilterState } from '../../src/models/FilterState';

describe('User Story 4: Category-Level Filtering Integration', () => {
  const createMockTerpene = (name: string, effects: string[], additionalProps: Partial<Terpene> = {}): Terpene => ({
    id: Math.random().toString(36).substr(2, 9),
    name,
    description: `Mock description for ${name}`,
    aroma: `Mock aroma for ${name}`,
    effects,
    sources: [`Mock source for ${name}`],
    ...additionalProps,
  });

  const mockTerpeneData: Terpene[] = [
    createMockTerpene('Limonene', ['Energizing', 'Mood enhancing', 'Anti-inflammatory'], {
      aroma: 'Citrus',
      sources: ['Lemon', 'Orange'],
    }),
    createMockTerpene('Myrcene', ['Sedative', 'Muscle relaxant'], {
      aroma: 'Earthy',
      sources: ['Mango', 'Hops'],
      boilingPoint: 166,
    }),
    createMockTerpene('Pinene', ['Focus', 'Memory-enhancement', 'Breathing support', 'Anti-inflammatory'], {
      aroma: 'Pine',
      sources: ['Pine', 'Rosemary'],
      molecularFormula: 'C10H16',
      boilingPoint: 155,
    }),
  ];

  beforeEach(() => {
    // Any setup needed
  });

  describe('T055: Category Selection Filters Terpenes', () => {
    it('should verify OR logic for category filters', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
        categoryFilters: ['mood'],
      };

      const filtered = filterTerpenes(mockTerpeneData, filterState);

      // Should include only Limonene (has mood effects: 'Energizing', 'Mood enhancing')
      // Pinene has 'Focus' which maps to 'cognitive', not 'mood'
      expect(filtered).toHaveLength(1);
      expect(filtered.map((t) => t.name)).toEqual(['Limonene']);
    });

    it('should verify combined category and effect filtering', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['Anti-inflammatory'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
        categoryFilters: ['mood'],
      };

      const filtered = filterTerpenes(mockTerpeneData, filterState);

      // Should include Limonene (has mood category) and Pinene (has Anti-inflammatory)
      expect(filtered).toHaveLength(2);
      expect(filtered.map((t) => t.name).sort()).toEqual(['Limonene', 'Pinene']);
    });
  });

  describe('T056: Multiple Category Filters', () => {
    it('should return terpenes matching any category with OR logic', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
        categoryFilters: ['mood', 'relaxation'],
      };

      const filtered = filterTerpenes(mockTerpeneData, filterState);

      expect(filtered).toHaveLength(2); // Limonene (mood) + Myrcene (relaxation)
      expect(filtered.map((t) => t.name).sort()).toEqual(['Limonene', 'Myrcene']);
    });
  });

  describe('T057: Category Synchronization', () => {
    it('should sync categories based on selected effects', () => {
      const syncedCategories = syncCategoryFilters(['Energizing', 'Mood enhancing', 'Focus']);

      // Energizing + Mood enhancing = mood category
      // Focus = cognitive category
      expect(syncedCategories.sort()).toEqual(['cognitive', 'mood']);
    });

    it('should sync categories after removing effects', () => {
      // Start with mood effects and some of its effects selected
      const syncedCategories = syncCategoryFilters(['Energizing']);

      // Should only include mood category now
      expect(syncedCategories).toEqual(['mood']);
    });
  });

  describe('getEffectsInCategories Tests', () => {
    it('should return unique effects for multiple categories', () => {
      const effects = getEffectsInCategories(['mood', 'cognitive']);

      // Both categories have 'Focus' effect, should only appear once
      const focusCount = effects.filter((e) => e === 'Focus').length;
      expect(focusCount).toBe(1);
    });

    it('should handle empty category list', () => {
      const effects = getEffectsInCategories([]);
      expect(effects).toEqual([]);
    });

    it('should handle invalid category', () => {
      const effects = getEffectsInCategories(['invalid-category']);
      expect(effects).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty category filters', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
        categoryFilters: [],
      };

      const result = filterTerpenes(mockTerpeneData, filterState);
      expect(result).toHaveLength(mockTerpeneData.length);
    });

    it('should handle unknown effects gracefully', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['Unknown Effect'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
        categoryFilters: [],
      };

      const result = filterTerpenes(mockTerpeneData, filterState);
      expect(result).toHaveLength(0);
    });
  });
});
