/**
 * useTerpeneData Hook Tests
 *
 * Tests for the custom hook that loads and manages terpene data.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T038
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTerpeneData } from '../../../src/hooks/useTerpeneData';
import { loadTerpeneData } from '../../../src/services/dataLoader';

// Mock the dataLoader service
vi.mock('../../../src/services/dataLoader', () => ({
  loadTerpeneData: vi.fn(),
}));

describe('useTerpeneData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should start with loading state', () => {
      vi.mocked(loadTerpeneData).mockReturnValue(
        new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useTerpeneData());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.terpenes).toEqual([]);
      expect(result.current.effects).toEqual([]);
    });

    it('should have empty data initially', () => {
      vi.mocked(loadTerpeneData).mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useTerpeneData());

      expect(result.current.terpenes).toHaveLength(0);
      expect(result.current.effects).toHaveLength(0);
    });
  });

  describe('Successful Data Loading', () => {
    it('should load terpene data successfully', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'A citrus-scented terpene',
          effects: ['energizing', 'mood-enhancing'],
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
      ];

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpenes,
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.terpenes).toHaveLength(2);
      expect(result.current.terpenes).toEqual(mockTerpenes);
      expect(result.current.error).toBeNull();
    });

    it('should extract unique effects from loaded terpenes', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'Test',
          effects: ['energizing', 'mood-enhancing'],
          sources: ['Lemon'],
        },
        {
          id: '2',
          name: 'Myrcene',
          aroma: 'Earthy',
          description: 'Test',
          effects: ['sedative', 'energizing'], // 'energizing' is duplicate
          sources: ['Mango'],
        },
      ];

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpenes,
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.effects).toHaveLength(3);
      expect(result.current.effects.map((e) => e.name)).toEqual(expect.arrayContaining(['energizing', 'mood-enhancing', 'sedative']));
    });

    it('should calculate terpene count for each effect', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'Test',
          effects: ['energizing'],
          sources: ['Lemon'],
        },
        {
          id: '2',
          name: 'Myrcene',
          aroma: 'Earthy',
          description: 'Test',
          effects: ['energizing', 'sedative'],
          sources: ['Mango'],
        },
      ];

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpenes,
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const energizingEffect = result.current.effects.find((e) => e.name === 'energizing');
      const sedativeEffect = result.current.effects.find((e) => e.name === 'sedative');

      expect(energizingEffect?.terpeneCount).toBe(2);
      expect(sedativeEffect?.terpeneCount).toBe(1);
    });

    it('should handle warnings from data loader', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'Test',
          effects: ['energizing'],
          sources: ['Lemon'],
        },
      ];

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpenes,
        warnings: ['2 entries were skipped due to validation errors'],
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.terpenes).toHaveLength(1);
      expect(result.current.warnings).toHaveLength(1);
      expect(result.current.warnings![0]).toContain('2 entries were skipped');
    });
  });

  describe('Error Handling', () => {
    it('should handle data loading errors', async () => {
      const errorMessage = 'Failed to load terpene data';

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'error',
        error: new Error(errorMessage),
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain(errorMessage);
      expect(result.current.terpenes).toHaveLength(0);
    });

    it('should handle network errors', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'error',
        error: new Error('Network error'),
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.terpenes).toHaveLength(0);
    });

    it('should handle JSON parse errors', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'error',
        error: new Error('Invalid JSON format'),
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toContain('JSON');
    });
  });

  describe('Empty Dataset Handling', () => {
    it('should handle empty terpene array', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.terpenes).toHaveLength(0);
      expect(result.current.effects).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });

    it('should handle dataset with all invalid entries', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
        warnings: ['All 10 entries were invalid'],
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.terpenes).toHaveLength(0);
      expect(result.current.warnings).toBeTruthy();
    });
  });

  describe('Retry Functionality', () => {
    it('should provide a retry function', () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      const { result } = renderHook(() => useTerpeneData());

      expect(result.current.retry).toBeDefined();
      expect(typeof result.current.retry).toBe('function');
    });

    it('should reload data when retry is called', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'Test',
          effects: ['energizing'],
          sources: ['Lemon'],
        },
      ];

      // First call fails
      vi.mocked(loadTerpeneData).mockResolvedValueOnce({
        status: 'error',
        error: new Error('Network error'),
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();

      // Second call succeeds
      vi.mocked(loadTerpeneData).mockResolvedValueOnce({
        status: 'success',
        data: mockTerpenes,
      });

      result.current.retry();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.terpenes).toHaveLength(1);
    });

    it('should reset loading state when retrying', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'error',
        error: new Error('Test error'),
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      vi.mocked(loadTerpeneData).mockReturnValue(
        new Promise(() => {}) // Never resolves
      );

      result.current.retry();

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Data Source Configuration', () => {
    it('should use default data source path', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(loadTerpeneData).toHaveBeenCalled();
      });

      expect(loadTerpeneData).toHaveBeenCalledWith(expect.stringContaining('terpenes'));
    });

    it('should allow custom data source path', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      renderHook(() => useTerpeneData('/custom/path/data.json'));

      await waitFor(() => {
        expect(loadTerpeneData).toHaveBeenCalled();
      });

      expect(loadTerpeneData).toHaveBeenCalledWith('/custom/path/data.json');
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', async () => {
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

      const startTime = Date.now();
      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const loadTime = Date.now() - startTime;

      expect(result.current.terpenes).toHaveLength(1000);
      // Should load within 2 seconds (NFR-PERF-001)
      expect(loadTime).toBeLessThan(2000);
    });

    it('should not reload data unnecessarily', async () => {
      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: [],
      });

      const { rerender } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(loadTerpeneData).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger reload
      rerender();

      await waitFor(() => {
        expect(loadTerpeneData).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Effect Metadata', () => {
    it('should include color information for effects', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'Test',
          effects: ['energizing'],
          sources: ['Lemon'],
        },
      ];

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpenes,
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const energizingEffect = result.current.effects.find((e) => e.name === 'energizing');

      expect(energizingEffect).toBeDefined();
      expect(energizingEffect?.color).toBeDefined();
      expect(energizingEffect?.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should include localized display names for effects', async () => {
      const mockTerpenes = [
        {
          id: '1',
          name: 'Limonene',
          aroma: 'Citrus',
          description: 'Test',
          effects: ['calming'],
          sources: ['Lemon'],
        },
      ];

      vi.mocked(loadTerpeneData).mockResolvedValue({
        status: 'success',
        data: mockTerpenes,
      });

      const { result } = renderHook(() => useTerpeneData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const calmingEffect = result.current.effects.find((e) => e.name === 'calming');

      expect(calmingEffect?.displayName).toBeDefined();
      expect(calmingEffect?.displayName.en).toBe('Calming');
      expect(calmingEffect?.displayName.de).toBe('Beruhigend');
    });
  });
});
