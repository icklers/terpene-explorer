/**
 * useFilters Hook Tests
 *
 * Tests for the custom hook that manages filter state including AND/OR toggle.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T039
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Import the hook (will be implemented in T047)
import { useFilters } from '../../../src/hooks/useFilters';

describe('useFilters', () => {
  describe('Initial State', () => {
    it('should initialize with default filter state', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.filterState.searchQuery).toBe('');
      expect(result.current.filterState.selectedEffects).toEqual([]);
      expect(result.current.filterState.effectFilterMode).toBe('any');
      expect(result.current.filterState.viewMode).toBe('table'); // UAT: Default should be table view
      expect(result.current.filterState.sortBy).toBe('name');
      expect(result.current.filterState.sortDirection).toBe('asc');
    });

    it('should allow custom initial state', () => {
      const initialState = {
        searchQuery: 'limonene',
        selectedEffects: ['energizing'],
        effectFilterMode: 'all' as const,
        viewMode: 'table' as const,
        sortBy: 'aroma' as const,
        sortDirection: 'desc' as const,
      };

      const { result } = renderHook(() => useFilters(initialState));

      expect(result.current.filterState).toEqual(initialState);
    });
  });

  describe('Search Query Management', () => {
    it('should update search query', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('limonene');
      });

      expect(result.current.filterState.searchQuery).toBe('limonene');
    });

    it('should trim whitespace from search query', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('  limonene  ');
      });

      expect(result.current.filterState.searchQuery).toBe('limonene');
    });

    it('should handle empty search query', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('test');
      });

      expect(result.current.filterState.searchQuery).toBe('test');

      act(() => {
        result.current.setSearchQuery('');
      });

      expect(result.current.filterState.searchQuery).toBe('');
    });

    it('should clear search query', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('limonene');
      });

      expect(result.current.filterState.searchQuery).toBe('limonene');

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.filterState.searchQuery).toBe('');
    });
  });

  describe('Effect Selection Management', () => {
    it('should add effect to selection', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('energizing');
      });

      expect(result.current.filterState.selectedEffects).toContain('energizing');
    });

    it('should remove effect from selection when toggled again', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('energizing');
      });

      expect(result.current.filterState.selectedEffects).toContain('energizing');

      act(() => {
        result.current.toggleEffect('energizing');
      });

      expect(result.current.filterState.selectedEffects).not.toContain('energizing');
    });

    it('should add multiple effects', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('energizing');
        result.current.toggleEffect('calming');
        result.current.toggleEffect('anti-inflammatory');
      });

      expect(result.current.filterState.selectedEffects).toHaveLength(3);
      expect(result.current.filterState.selectedEffects).toEqual(
        expect.arrayContaining(['energizing', 'calming', 'anti-inflammatory'])
      );
    });

    it('should clear all selected effects', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('energizing');
        result.current.toggleEffect('calming');
      });

      expect(result.current.filterState.selectedEffects).toHaveLength(2);

      act(() => {
        result.current.clearEffects();
      });

      expect(result.current.filterState.selectedEffects).toHaveLength(0);
    });

    it('should not add duplicate effects', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('energizing');
        result.current.toggleEffect('energizing'); // Toggle off
        result.current.toggleEffect('energizing'); // Toggle on again
      });

      const energizingCount = result.current.filterState.selectedEffects.filter(
        (e) => e === 'energizing'
      ).length;

      expect(energizingCount).toBe(1);
    });
  });

  describe('Filter Mode Toggle (AND/OR)', () => {
    it('should toggle between ANY and ALL modes', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.filterState.effectFilterMode).toBe('any');

      act(() => {
        result.current.toggleFilterMode();
      });

      expect(result.current.filterState.effectFilterMode).toBe('all');

      act(() => {
        result.current.toggleFilterMode();
      });

      expect(result.current.filterState.effectFilterMode).toBe('any');
    });

    it('should set specific filter mode', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setFilterMode('all');
      });

      expect(result.current.filterState.effectFilterMode).toBe('all');

      act(() => {
        result.current.setFilterMode('any');
      });

      expect(result.current.filterState.effectFilterMode).toBe('any');
    });

    it('should maintain filter mode when effects change', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setFilterMode('all');
        result.current.toggleEffect('energizing');
      });

      expect(result.current.filterState.effectFilterMode).toBe('all');
      expect(result.current.filterState.selectedEffects).toContain('energizing');
    });
  });

  describe('View Mode Management', () => {
    it('should toggle between sunburst and table views', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.filterState.viewMode).toBe('sunburst');

      act(() => {
        result.current.setViewMode('table');
      });

      expect(result.current.filterState.viewMode).toBe('table');

      act(() => {
        result.current.setViewMode('sunburst');
      });

      expect(result.current.filterState.viewMode).toBe('sunburst');
    });
  });

  describe('Sort Configuration', () => {
    it('should change sort column', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSortBy('aroma');
      });

      expect(result.current.filterState.sortBy).toBe('aroma');
    });

    it('should change sort direction', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSortDirection('desc');
      });

      expect(result.current.filterState.sortDirection).toBe('desc');
    });

    it('should toggle sort direction when clicking same column', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.filterState.sortBy).toBe('name');
      expect(result.current.filterState.sortDirection).toBe('desc'); // Toggle from default 'asc'

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.filterState.sortDirection).toBe('asc');
    });

    it('should reset to ascending when changing columns', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSortBy('name');
        result.current.setSortDirection('desc');
      });

      act(() => {
        result.current.handleSort('aroma');
      });

      expect(result.current.filterState.sortBy).toBe('aroma');
      expect(result.current.filterState.sortDirection).toBe('asc');
    });
  });

  describe('Clear All Filters', () => {
    it('should clear all filters at once', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('limonene');
        result.current.toggleEffect('energizing');
        result.current.toggleEffect('calming');
        result.current.setFilterMode('all');
      });

      expect(result.current.filterState.searchQuery).toBe('limonene');
      expect(result.current.filterState.selectedEffects).toHaveLength(2);
      expect(result.current.filterState.effectFilterMode).toBe('all');

      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.filterState.searchQuery).toBe('');
      expect(result.current.filterState.selectedEffects).toHaveLength(0);
      expect(result.current.filterState.effectFilterMode).toBe('any');
    });

    it('should not clear view mode and sort settings', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setViewMode('table');
        result.current.setSortBy('aroma');
        result.current.setSortDirection('desc');
        result.current.setSearchQuery('test');
        result.current.toggleEffect('energizing');
      });

      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.filterState.viewMode).toBe('table');
      expect(result.current.filterState.sortBy).toBe('aroma');
      expect(result.current.filterState.sortDirection).toBe('desc');
    });
  });

  describe('Active Filters Indicator', () => {
    it('should indicate when filters are active', () => {
      const { result } = renderHook(() => useFilters());

      expect(result.current.hasActiveFilters).toBe(false);

      act(() => {
        result.current.setSearchQuery('test');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should indicate when effect filters are active', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('energizing');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should be false when all filters are cleared', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('test');
        result.current.toggleEffect('energizing');
      });

      expect(result.current.hasActiveFilters).toBe(true);

      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long search queries', () => {
      const { result } = renderHook(() => useFilters());
      const longQuery = 'a'.repeat(1000);

      act(() => {
        result.current.setSearchQuery(longQuery);
      });

      expect(result.current.filterState.searchQuery).toBe(longQuery);
    });

    it('should handle special characters in search query', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('α-Pinene (β-variant)');
      });

      expect(result.current.filterState.searchQuery).toBe('α-Pinene (β-variant)');
    });

    it('should handle many selected effects efficiently', () => {
      const { result } = renderHook(() => useFilters());

      const effects = Array.from({ length: 50 }, (_, i) => `effect-${i}`);

      act(() => {
        effects.forEach((effect) => {
          result.current.toggleEffect(effect);
        });
      });

      expect(result.current.filterState.selectedEffects).toHaveLength(50);
    });

    it('should handle rapid filter changes', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.setSearchQuery(`query-${i}`);
        }
      });

      expect(result.current.filterState.searchQuery).toBe('query-99');
    });

    it('should handle empty effect name', () => {
      const { result } = renderHook(() => useFilters());

      act(() => {
        result.current.toggleEffect('');
      });

      // Should not add empty string to effects
      expect(result.current.filterState.selectedEffects).not.toContain('');
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across re-renders', () => {
      const { result, rerender } = renderHook(() => useFilters());

      act(() => {
        result.current.setSearchQuery('limonene');
        result.current.toggleEffect('energizing');
      });

      rerender();

      expect(result.current.filterState.searchQuery).toBe('limonene');
      expect(result.current.filterState.selectedEffects).toContain('energizing');
    });

    it('should provide stable function references', () => {
      const { result, rerender } = renderHook(() => useFilters());

      const initialSetSearchQuery = result.current.setSearchQuery;
      const initialToggleEffect = result.current.toggleEffect;

      rerender();

      expect(result.current.setSearchQuery).toBe(initialSetSearchQuery);
      expect(result.current.toggleEffect).toBe(initialToggleEffect);
    });
  });

  describe('Performance', () => {
    it('should handle filter updates efficiently', () => {
      const { result } = renderHook(() => useFilters());

      const startTime = Date.now();

      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.toggleEffect(`effect-${i % 10}`);
        }
      });

      const endTime = Date.now();

      // Should complete in less than 200ms (NFR-PERF-002)
      expect(endTime - startTime).toBeLessThan(200);
    });
  });
});
