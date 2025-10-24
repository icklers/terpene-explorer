/**
 * Filter Service Tests
 *
 * Tests for terpene filtering logic with AND/OR modes.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T036
 */

import { describe, it, expect } from 'vitest';
import type { FilterState } from '../../../src/models/FilterState';
import type { Terpene } from '../../../src/models/Terpene';
import {
  filterTerpenes,
  matchesAnyEffect,
  matchesAllEffects,
} from '../../../src/services/filterService';

/**
 * Sample test data
 */
const createMockTerpene = (
  id: string,
  name: string,
  effects: string[],
  aroma: string = 'Test aroma',
  sources: string[] = ['Test source']
): Terpene => ({
  id,
  name,
  aroma,
  description: `Test description for ${name}`,
  effects,
  sources,
});

const mockTerpenes: Terpene[] = [
  createMockTerpene('1', 'Limonene', ['energizing', 'mood-enhancing', 'anti-inflammatory']),
  createMockTerpene('2', 'Myrcene', ['sedative', 'muscle-relaxant', 'analgesic']),
  createMockTerpene('3', 'Pinene', ['focus', 'anti-inflammatory', 'bronchodilator']),
  createMockTerpene('4', 'Linalool', ['calming', 'sedative', 'anxiolytic']),
  createMockTerpene('5', 'Caryophyllene', ['anti-inflammatory', 'analgesic', 'gastroprotective']),
];

describe('filterService', () => {
  describe('filterTerpenes', () => {
    it('should return all terpenes when no filters are applied', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(5);
      expect(result).toEqual(mockTerpenes);
    });

    it('should filter by search query (case insensitive)', () => {
      const filterState: FilterState = {
        searchQuery: 'limo',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('Limonene');
    });

    it('should filter by search query across name, aroma, and effects', () => {
      const terpenes: Terpene[] = [
        createMockTerpene('1', 'Alpha', ['calming'], 'citrus'),
        createMockTerpene('2', 'Beta', ['energizing'], 'pine'),
        createMockTerpene('3', 'Gamma', ['sedative'], 'woody'),
      ];

      // Search by aroma
      const filterState: FilterState = {
        searchQuery: 'citrus',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };
      let result = filterTerpenes(terpenes, filterState);
      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('Alpha');

      // Search by effect
      filterState.searchQuery = 'energizing';
      result = filterTerpenes(terpenes, filterState);
      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('Beta');
    });

    it('should filter by single effect with ANY mode', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['anti-inflammatory'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(3);
      expect(result.map((t) => t.name)).toEqual(
        expect.arrayContaining(['Limonene', 'Pinene', 'Caryophyllene'])
      );
    });

    it('should filter by multiple effects with ANY mode (OR logic)', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['sedative', 'calming'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(2);
      expect(result.map((t) => t.name)).toEqual(expect.arrayContaining(['Myrcene', 'Linalool']));
    });

    it('should filter by multiple effects with ALL mode (AND logic)', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['anti-inflammatory', 'analgesic'],
        effectFilterMode: 'all',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      // Only Caryophyllene has both effects
      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('Caryophyllene');
    });

    it('should combine search query and effect filters', () => {
      const filterState: FilterState = {
        searchQuery: 'e', // Matches Limonene, Myrcene, Pinene, Caryophyllene
        selectedEffects: ['anti-inflammatory'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      // Matches: Limonene, Pinene, Caryophyllene (all have 'e' and anti-inflammatory)
      expect(result).toHaveLength(3);
      expect(result.map((t) => t.name)).toEqual(
        expect.arrayContaining(['Limonene', 'Pinene', 'Caryophyllene'])
      );
    });

    it('should return empty array when no terpenes match filters', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['nonexistent-effect'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle empty terpene array', () => {
      const filterState: FilterState = {
        searchQuery: 'test',
        selectedEffects: ['calming'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes([], filterState);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle ALL mode with no terpenes matching all effects', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['energizing', 'sedative'], // Conflicting effects
        effectFilterMode: 'all',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(0);
    });

    it('should be case-insensitive for search queries', () => {
      const filterState: FilterState = {
        searchQuery: 'LIMONENE',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('Limonene');
    });

    it('should trim whitespace from search query', () => {
      const filterState: FilterState = {
        searchQuery: '  Limonene  ',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('Limonene');
    });
  });

  describe('matchesAnyEffect', () => {
    it('should return true if terpene has at least one matching effect', () => {
      const terpene = mockTerpenes[0]!; // Limonene with energizing, mood-enhancing, anti-inflammatory

      expect(matchesAnyEffect(terpene, ['energizing'])).toBe(true);
      expect(matchesAnyEffect(terpene, ['anti-inflammatory', 'sedative'])).toBe(true);
    });

    it('should return false if terpene has no matching effects', () => {
      const terpene = mockTerpenes[0]!; // Limonene

      expect(matchesAnyEffect(terpene, ['sedative'])).toBe(false);
      expect(matchesAnyEffect(terpene, ['calming', 'sedative'])).toBe(false);
    });

    it('should return true if no effects specified (empty array)', () => {
      const terpene = mockTerpenes[0]!;

      expect(matchesAnyEffect(terpene, [])).toBe(true);
    });
  });

  describe('matchesAllEffects', () => {
    it('should return true if terpene has all specified effects', () => {
      const terpene = mockTerpenes[4]!; // Caryophyllene with anti-inflammatory, analgesic, gastroprotective

      expect(matchesAllEffects(terpene, ['anti-inflammatory'])).toBe(true);
      expect(matchesAllEffects(terpene, ['anti-inflammatory', 'analgesic'])).toBe(true);
      expect(
        matchesAllEffects(terpene, ['anti-inflammatory', 'analgesic', 'gastroprotective'])
      ).toBe(true);
    });

    it('should return false if terpene is missing any specified effect', () => {
      const terpene = mockTerpenes[4]!; // Caryophyllene

      expect(matchesAllEffects(terpene, ['anti-inflammatory', 'sedative'])).toBe(false);
      expect(matchesAllEffects(terpene, ['energizing'])).toBe(false);
    });

    it('should return true if no effects specified (empty array)', () => {
      const terpene = mockTerpenes[0]!;

      expect(matchesAllEffects(terpene, [])).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle terpenes with empty effects array', () => {
      const terpeneWithNoEffects = createMockTerpene('99', 'NoEffects', []);

      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['calming'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes([terpeneWithNoEffects], filterState);

      expect(result).toHaveLength(0);
    });

    it('should handle special characters in search query', () => {
      const terpenes: Terpene[] = [
        createMockTerpene('1', 'α-Pinene', ['focus']),
        createMockTerpene('2', 'β-Caryophyllene', ['anti-inflammatory']),
      ];

      const filterState: FilterState = {
        searchQuery: 'α',
        selectedEffects: [],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(terpenes, filterState);

      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('α-Pinene');
    });

    it('should handle very long effect lists', () => {
      const manyEffects = Array.from({ length: 10 }, (_, i) => `effect-${i}`);
      const terpene = createMockTerpene('999', 'ManyEffects', manyEffects);

      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['effect-5'],
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes([terpene], filterState);

      expect(result).toHaveLength(1);
  expect(result[0]!.name).toBe('ManyEffects');
    });

    it('should handle duplicate effects in filter selection', () => {
      const filterState: FilterState = {
        searchQuery: '',
        selectedEffects: ['anti-inflammatory', 'anti-inflammatory'], // Duplicate
        effectFilterMode: 'any',
        viewMode: 'sunburst',
        sortBy: 'name',
        sortDirection: 'asc',
      };

      const result = filterTerpenes(mockTerpenes, filterState);

      // Should still work correctly
      expect(result).toHaveLength(3);
      expect(result.map((t) => t.name)).toEqual(
        expect.arrayContaining(['Limonene', 'Pinene', 'Caryophyllene'])
      );
    });
  });
});
