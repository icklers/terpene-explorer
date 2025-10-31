/**
 * Integration Test: Search Functionality
 *
 * Tests that the search functionality works correctly across all attributes
 * including name, aroma, taste, effects, and therapeutic properties.
 */

import { describe, it, expect } from 'vitest';

import type { FilterState } from '../../models/FilterState';
import type { Terpene } from '../../models/Terpene';
import { filterTerpenes } from '../../services/filterService';

// Mock data for testing
const mockTerpenes: Terpene[] = [
  {
    id: '1',
    name: 'Linalool',
    isomerOf: null,
    isomerType: null,
    category: 'Core',
    description: 'Floral monoterpene with calming properties',
    aroma: 'Floral, Lavender',
    taste: 'Floral with sweet notes',
    effects: ['Relaxing', 'Anxiety relief', 'Pain relief', 'Sedative'],
    therapeuticProperties: ['Anxiolytic', 'Sedative', 'Analgesic', 'Anti-epileptic'],
    molecularData: {
      molecularFormula: 'C10H18O',
      molecularWeight: 154,
      boilingPoint: 198,
      class: 'Monoterpenoid',
    },
    sources: ['Lavender', 'Mint'],
    references: [],
    researchTier: {
      dataQuality: 'Excellent',
      evidenceSummary: 'Clinically validated',
    },
  },
  {
    id: '2',
    name: 'Limonene',
    isomerOf: null,
    isomerType: 'Optical',
    category: 'Core',
    description: 'Citrus terpene with uplifting properties',
    aroma: 'Citrus, Lemon',
    taste: 'Bright citrus with slight sweetness',
    effects: ['Mood enhancing', 'Stress relief', 'Energizing'],
    therapeuticProperties: ['Antidepressant', 'Anti-inflammatory', 'Anxiolytic'],
    molecularData: {
      molecularFormula: 'C10H16',
      molecularWeight: 136,
      boilingPoint: 176,
      class: 'Monoterpene',
    },
    sources: ['Lemon peel', 'Orange rind'],
    references: [],
    researchTier: {
      dataQuality: 'Excellent',
      evidenceSummary: 'Confirmed across multiple chemovars',
    },
  },
  {
    id: '3',
    name: 'α-Pinene',
    isomerOf: 'Pinene',
    isomerType: 'Structural',
    category: 'Core',
    description: 'Pine-scented terpene with memory enhancement',
    aroma: 'Pine, Fresh, Turpentine',
    taste: 'Sharp pine, woody',
    effects: ['Alertness', 'Memory-enhancement', 'Focus', 'Energizing', 'Breathing support'],
    therapeuticProperties: ['Anti-inflammatory', 'Bronchodilator', 'Memory aid', 'Antiseptic'],
    molecularData: {
      molecularFormula: 'C10H16',
      molecularWeight: 136,
      boilingPoint: 155,
      class: 'Monoterpene',
    },
    sources: ['Pine needles', 'Rosemary'],
    references: [],
    researchTier: {
      dataQuality: 'Excellent',
      evidenceSummary: 'Widely documented cognitive enhanced terpene',
    },
  },
];

describe('Search Functionality', () => {
  it('should search by terpene name', () => {
    const filterState: FilterState = {
      searchQuery: 'linalool',
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe('Linalool');
  });

  it('should search by effect', () => {
    const filterState: FilterState = {
      searchQuery: 'pain relief',
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe('Linalool');
    expect(filtered[0]?.effects).toContain('Pain relief');
  });

  it('should search by aroma', () => {
    const filterState: FilterState = {
      searchQuery: 'pine',
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe('α-Pinene');
    expect(filtered[0]?.aroma).toContain('Pine');
  });

  it('should search by taste', () => {
    const filterState: FilterState = {
      searchQuery: 'floral',
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe('Linalool');
    expect(filtered[0]?.taste).toContain('Floral');
  });

  it('should search by therapeutic properties', () => {
    const filterState: FilterState = {
      searchQuery: 'analgesic',
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe('Linalool');
    expect(filtered[0]?.therapeuticProperties).toContain('Analgesic');
  });

  it('should handle minimum search length (2 characters)', () => {
    const filterState: FilterState = {
      searchQuery: 'a', // 1 character - should not filter
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(3); // Should show all results when query < 2 characters
  });

  it('should handle empty search query', () => {
    const filterState: FilterState = {
      searchQuery: '', // Empty query - should not filter
      selectedEffects: [],
      effectFilterMode: 'any',
      viewMode: 'table',
      sortBy: 'name',
      sortDirection: 'asc',
      categoryFilters: [],
    };

    const filtered = filterTerpenes(mockTerpenes, filterState);
    expect(filtered).toHaveLength(3); // Should show all results when query is empty
  });
});
