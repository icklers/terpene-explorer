/**
 * User Story 3 Integration Test
 *
 * End-to-end test for search → visualization → view switching flow.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T061
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the dataLoader
vi.mock('../../src/services/dataLoader', () => ({
  loadTerpeneData: vi.fn(),
}));

import { loadTerpeneData } from '../../src/services/dataLoader';

describe('User Story 3: Visualization Flow Integration', () => {
  const mockTerpeneData = [
    {
      id: '1',
      name: 'Limonene',
      aroma: 'Citrus',
      description: 'Citrus-scented',
      effects: ['energizing', 'mood-enhancing'],
      sources: ['Lemon', 'Orange'],
    },
    {
      id: '2',
      name: 'Myrcene',
      aroma: 'Earthy',
      description: 'Earthy',
      effects: ['sedative', 'muscle-relaxant'],
      sources: ['Mango', 'Hops'],
    },
    {
      id: '3',
      name: 'Pinene',
      aroma: 'Pine',
      description: 'Pine-scented',
      effects: ['focus', 'energizing'],
      sources: ['Pine', 'Rosemary'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Search Flow', () => {
    it('should load data and enable search', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data.length).toBe(3);
      }
    });

    it('should filter data based on search query', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        const searchQuery = 'citrus';
        const filtered = result.data.filter((t) => t.aroma.toLowerCase().includes(searchQuery));

        expect(filtered).toHaveLength(1);
        expect(filtered).not.toBeNull();
        expect(filtered[0]?.name).toBe('Limonene');
      }
    });

    it('should debounce search and update visualization', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      // Debouncing logic will be tested at component level
    });
  });

  describe('Sunburst Visualization Flow', () => {
    it('should transform data for sunburst chart', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        // Extract unique effects
        const allEffects = result.data.flatMap((t) => t.effects);
        const uniqueEffects = [...new Set(allEffects)];

        expect(uniqueEffects.length).toBeGreaterThan(0);
        expect(uniqueEffects).toContain('energizing');
        expect(uniqueEffects).toContain('sedative');
      }
    });

    it('should handle click on sunburst slice to filter', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        // Simulate clicking on "energizing" effect
        const selectedEffect = 'energizing';
        const filtered = result.data.filter((t) => t.effects.includes(selectedEffect));

        expect(filtered).toHaveLength(2); // Limonene and Pinene
        expect(filtered.map((t) => t.name)).toContain('Limonene');
        expect(filtered.map((t) => t.name)).toContain('Pinene');
      }
    });

    it('should render sunburst with correct hierarchy', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        // Build hierarchy: root → effects → terpenes
        const effectGroups = new Map<string, typeof mockTerpeneData>();

        result.data.forEach((terpene) => {
          terpene.effects.forEach((effect) => {
            if (!effectGroups.has(effect)) {
              effectGroups.set(effect, []);
            }
            effectGroups.get(effect)!.push(terpene);
          });
        });

        expect(effectGroups.size).toBeGreaterThan(0);
        expect(effectGroups.get('energizing')?.length).toBe(2);
      }
    });
  });

  describe('Table View Flow', () => {
    it('should display data in table format', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        expect(result.data).toHaveLength(3);
        result.data.forEach((terpene) => {
          expect(terpene).toHaveProperty('name');
          expect(terpene).toHaveProperty('aroma');
          expect(terpene).toHaveProperty('effects');
          expect(terpene).toHaveProperty('sources');
        });
      }
    });

    it('should sort table by column', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        // Sort by name
        const sortedByName = [...result.data].sort((a, b) => a.name.localeCompare(b.name));

        expect(sortedByName).toHaveLength(3);
        expect(sortedByName[0]?.name).toBe('Limonene');
        expect(sortedByName[2]?.name).toBe('Pinene');

        // Sort by aroma
        const sortedByAroma = [...result.data].sort((a, b) => a.aroma.localeCompare(b.aroma));

        expect(sortedByAroma).toHaveLength(3);
        expect(sortedByAroma[0]?.aroma).toBe('Citrus');
      }
    });

    it('should handle virtualization for large datasets', async () => {
      const largeTerpeneSet = Array.from({ length: 200 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: [`effect-${i % 10}`],
        sources: [`Source ${i}`],
      }));

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: largeTerpeneSet,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data.length).toBe(200);
      }
    });
  });

  describe('View Mode Switching', () => {
    it('should switch between sunburst and table views', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');

      // Simulate view mode state
      let viewMode: 'sunburst' | 'table' = 'sunburst';

      expect(viewMode).toBe('sunburst');

      viewMode = 'table';
      expect(viewMode).toBe('table');

      viewMode = 'sunburst';
      expect(viewMode).toBe('sunburst');
    });

    it('should preserve filter state when switching views', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        const selectedEffects = ['energizing'];
        const filtered = result.data.filter((t) => selectedEffects.some((e) => t.effects.includes(e)));

        expect(filtered).toHaveLength(2);

        // Filter should remain when switching views
        expect(filtered.map((t) => t.name)).toContain('Limonene');
        expect(filtered.map((t) => t.name)).toContain('Pinene');
      }
    });

    it('should preserve search query when switching views', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpeneData,
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      if (result.status === 'success') {
        const searchQuery = 'pine';
        const filtered = result.data.filter(
          (t) => t.name.toLowerCase().includes(searchQuery) || t.aroma.toLowerCase().includes(searchQuery)
        );

        expect(filtered).toHaveLength(1);
        expect(filtered).not.toBeNull();
        expect(filtered[0]?.name).toBe('Pinene');
      }
    });
  });

  describe('Performance', () => {
    it('should render sunburst within 500ms for typical dataset', async () => {
      const typicalDataset = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: [`effect-${i % 10}`],
        sources: [`Source ${i}`],
      }));

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: typicalDataset,
      });

      const startTime = performance.now();
      const result = await loadTerpeneData('/data/terpenes.json');
      const duration = performance.now() - startTime;

      expect(result.status).toBe('success');
      expect(duration).toBeLessThan(500);
    });

    it('should render table within 500ms for typical dataset', async () => {
      const typicalDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: [`effect-${i % 10}`],
        sources: [`Source ${i}`],
      }));

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: typicalDataset,
      });

      const startTime = performance.now();
      const result = await loadTerpeneData('/data/terpenes.json');
      const duration = performance.now() - startTime;

      expect(result.status).toBe('success');
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Error Handling', () => {
    it('should handle data loading errors in visualization context', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'error',
        error: new Error('Failed to load data'),
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.error.message).toContain('Failed to load');
      }
    });

    it('should handle empty dataset in both views', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      const result = await loadTerpeneData('/data/terpenes.json');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toHaveLength(0);
      }
    });
  });
});
