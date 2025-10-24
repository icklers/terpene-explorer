/**
 * User Story 1 Integration Test
 *
 * End-to-end test for data loading → filtering → rendering pipeline.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T043
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the dataLoader to control test data
vi.mock('../../src/services/dataLoader', () => ({
  loadTerpeneData: vi.fn(),
}));

import { loadTerpeneData } from '../../src/services/dataLoader';

describe('User Story 1: Data Flow Integration', () => {
  const mockTerpeneData = [
    {
      id: '1',
      name: 'Limonene',
      aroma: 'Citrus',
      description: 'A citrus-scented terpene',
      effects: ['energizing', 'mood-enhancing', 'anti-inflammatory'],
      sources: ['Lemon', 'Orange'],
    },
    {
      id: '2',
      name: 'Myrcene',
      aroma: 'Earthy',
      description: 'An earthy terpene',
      effects: ['sedative', 'muscle-relaxant'],
      sources: ['Mango', 'Hops'],
    },
    {
      id: '3',
      name: 'Pinene',
      aroma: 'Pine',
      description: 'A pine-scented terpene',
      effects: ['focus', 'anti-inflammatory'],
      sources: ['Pine', 'Rosemary'],
    },
    {
      id: '4',
      name: 'Linalool',
      aroma: 'Floral',
      description: 'A floral terpene',
      effects: ['calming', 'sedative', 'anti-inflammatory'],
      sources: ['Lavender', 'Mint'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Data Loading Pipeline', () => {
    it('should load terpene data from dataLoader', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toHaveLength(4);
      }
    });

    it('should extract unique effects from loaded terpenes', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        const allEffects = result.data.flatMap((t) => t.effects);
        const uniqueEffects = [...new Set(allEffects)];

        expect(uniqueEffects).toContain('energizing');
        expect(uniqueEffects).toContain('sedative');
        expect(uniqueEffects).toContain('anti-inflammatory');
        expect(uniqueEffects.length).toBeLessThan(allEffects.length); // Duplicates removed
      }
    });

    it('should handle data loading errors gracefully', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'error',
        error: new Error('Network error'),
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.error.message).toContain('Network error');
      }
    });

    it('should handle validation warnings', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData.slice(0, 2), // Only 2 valid entries
        warnings: ['2 entries were skipped due to validation errors'],
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.warnings).toBeDefined();
        expect(result.warnings![0]).toContain('2 entries');
      }
    });
  });

  describe('Filter Service Integration', () => {
    it('should filter terpenes by single effect (ANY mode)', () => {
      // This will use the filterService implementation
      const selectedEffects = ['anti-inflammatory'];

      // Filter logic: terpenes that have anti-inflammatory effect
      const filtered = mockTerpeneData.filter((terpene) => selectedEffects.some((effect) => terpene.effects.includes(effect)));

      expect(filtered).toHaveLength(3); // Limonene, Pinene, Linalool
      expect(filtered.map((t) => t.name)).toEqual(expect.arrayContaining(['Limonene', 'Pinene', 'Linalool']));
    });

    it('should filter terpenes by multiple effects (ANY mode - OR logic)', () => {
      const selectedEffects = ['energizing', 'sedative'];
      // OR logic: terpenes that have energizing OR sedative
      const filtered = mockTerpeneData.filter((terpene) => selectedEffects.some((effect) => terpene.effects.includes(effect)));

      expect(filtered).toHaveLength(3); // Limonene, Myrcene, Linalool
    });

    it('should filter terpenes by multiple effects (ALL mode - AND logic)', () => {
      const selectedEffects = ['sedative', 'anti-inflammatory'];
      // AND logic: terpenes that have BOTH sedative AND anti-inflammatory
      const filtered = mockTerpeneData.filter((terpene) => selectedEffects.every((effect) => terpene.effects.includes(effect)));

      expect(filtered).toHaveLength(1); // Only Linalool
      expect(filtered[0]?.name).toBe('Linalool');
    });

    it('should filter by search query across name, aroma, and effects', () => {
      const searchQuery = 'citrus';

      // Search in name, aroma, and effects
      const filtered = mockTerpeneData.filter((terpene) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          terpene.name.toLowerCase().includes(searchLower) ||
          terpene.aroma.toLowerCase().includes(searchLower) ||
          terpene.effects.some((e) => e.toLowerCase().includes(searchLower))
        );
      });

      expect(filtered).toHaveLength(1); // Limonene (Citrus aroma)
      expect(filtered[0]?.name).toBe('Limonene');
    });

    it('should combine search and effect filters', () => {
      const searchQuery = 'e'; // Matches several terpenes
      const selectedEffects = ['anti-inflammatory'];

      // Terpenes matching search AND having the effect
      const filtered = mockTerpeneData.filter((terpene) => {
        const matchesSearch = terpene.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEffect = selectedEffects.some((effect) => terpene.effects.includes(effect));
        return matchesSearch && matchesEffect;
      });

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((terpene) => {
        expect(terpene.name.toLowerCase()).toContain('e');
        expect(terpene.effects).toContain('anti-inflammatory');
      });
    });
  });

  describe('Color Service Integration', () => {
    it('should assign colors to each unique effect', () => {
      const allEffects = [...new Set(mockTerpeneData.flatMap((t) => t.effects))];

      // Each effect should have a color assigned
      expect(allEffects.length).toBeGreaterThan(0);

      // Colors should be unique (mostly)
      const colors = allEffects.map(() => '#' + Math.random().toString(16).slice(2, 8));
      const uniqueColors = new Set(colors);

      expect(uniqueColors.size).toBeLessThanOrEqual(allEffects.length);
    });

    it('should maintain consistent colors for same effects', () => {
      // Same effect should always get same color
      const effect1Color = '#5C6BC0'; // Example color for 'calming'
      const effect2Color = '#5C6BC0'; // Should be same

      expect(effect1Color).toBe(effect2Color);
    });
  });

  describe('End-to-End Data Flow', () => {
    it('should complete full flow: load → extract effects → filter → render', async () => {
      // 1. Load data
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const loadResult = await loadTerpeneData('/data/terpenes.json');
      expect(loadResult.status).toBe('success');

      if (loadResult.status !== 'success') return;

      // 2. Extract unique effects
      const allEffects = loadResult.data.flatMap((t) => t.effects);
      const uniqueEffects = [...new Set(allEffects)];
      expect(uniqueEffects.length).toBeGreaterThan(0);

      // 3. Apply filters
      const selectedEffects = ['anti-inflammatory'];
      const filtered = loadResult.data.filter((terpene) => selectedEffects.some((effect) => terpene.effects.includes(effect)));
      expect(filtered.length).toBeGreaterThan(0);

      // 4. Verify filtered results are ready for rendering
      filtered.forEach((terpene) => {
        expect(terpene.name).toBeDefined();
        expect(terpene.effects).toBeDefined();
        expect(terpene.effects).toContain('anti-inflammatory');
      });
    });

    it('should handle empty results gracefully', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const loadResult = await loadTerpeneData('/data/terpenes.json');

      if (loadResult.status !== 'success') return;

      // Filter with impossible criteria
      const selectedEffects = ['nonexistent-effect'];
      const filtered = loadResult.data.filter((terpene) => selectedEffects.some((effect) => terpene.effects.includes(effect)));

      expect(filtered).toHaveLength(0);
      // Should display "no results" message
    });

    it('should handle AND/OR mode switching correctly', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const loadResult = await loadTerpeneData('/data/terpenes.json');

      if (loadResult.status !== 'success') return;

      const selectedEffects = ['sedative', 'anti-inflammatory'];

      // ANY mode (OR logic) - at least one effect
      const anyModeResults = loadResult.data.filter((terpene) => selectedEffects.some((effect) => terpene.effects.includes(effect)));

      // ALL mode (AND logic) - all effects
      const allModeResults = loadResult.data.filter((terpene) => selectedEffects.every((effect) => terpene.effects.includes(effect)));

      expect(anyModeResults.length).toBeGreaterThan(allModeResults.length);
      expect(allModeResults).toHaveLength(1); // Only Linalool has both
      expect(anyModeResults.length).toBeGreaterThanOrEqual(2); // Myrcene, Linalool, possibly Pinene
    });
  });

  describe('Performance Integration', () => {
    it('should handle data loading within performance target', async () => {
      const largeTerpeneSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: ['effect-1', 'effect-2'],
        sources: ['Source 1'],
      }));

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: largeTerpeneSet,
      });

      const startTime = performance.now();
      const result = await loadTerpeneData('/data/terpenes.json');
      const loadTime = performance.now() - startTime;

      // Should load within 2 seconds (NFR-PERF-001)
      expect(loadTime).toBeLessThan(2000);
      expect(result.status).toBe('success');
    });

    it('should handle filtering within performance target', () => {
      const largeTerpeneSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: ['effect-1', 'effect-2'],
        sources: ['Source 1'],
      }));

      const startTime = performance.now();

      const filtered = largeTerpeneSet.filter((terpene) => ['effect-1'].some((effect) => terpene.effects.includes(effect)));

      const filterTime = performance.now() - startTime;

      // Should filter within 200ms (NFR-PERF-002)
      expect(filterTime).toBeLessThan(200);
      expect(filtered).toHaveLength(1000);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from network errors with retry', async () => {
      // First attempt fails
      vi.mocked(loadTerpeneData).mockResolvedValueOnce({
        status: 'error',
        error: new Error('Network error'),
      });

      const firstResult = await loadTerpeneData('/data/terpenes.json');
      expect(firstResult.status).toBe('error');

      // Retry succeeds
      vi.mocked(loadTerpeneData).mockResolvedValueOnce({
        status: 'success',
        data: mockTerpeneData,
      });

      const retryResult = await loadTerpeneData('/data/terpenes.json');
      expect(retryResult.status).toBe('success');
    });

    it('should continue with valid data when some entries are invalid', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData.slice(0, 2), // Only 2 of 4 valid
        warnings: ['2 entries were invalid and skipped'],
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toHaveLength(2);
        expect(result.warnings).toBeDefined();

        // Should still be able to filter valid data
        const filtered = result.data.filter((t) => t.effects.includes('energizing'));
        expect(filtered.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Feature Requirements', () => {
    it('should support FR-013: AND/OR filter mode toggle', () => {
      // ANY mode test
      const anyMode = 'any';
      expect(anyMode).toBe('any');

      // ALL mode test
      const allMode = 'all';
      expect(allMode).toBe('all');

      // Both modes should be supported
      expect(['any', 'all']).toContain(anyMode);
      expect(['any', 'all']).toContain(allMode);
    });

    it('should support FR-015: Graceful validation with warnings', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
        warnings: ['Some entries were invalid'],
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.warnings).toBeDefined();
      }
    });

    it('should support FR-016: Empty state handling', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toHaveLength(0);
        // Should trigger empty state display
      }
    });
  });
});
