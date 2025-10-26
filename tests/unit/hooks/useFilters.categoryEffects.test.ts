import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useFilters } from '../../../src/hooks/useFilters';

describe('useFilters - category ↔ effect synchronization', () => {
  it('selecting a category selects its effects', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.toggleCategoryFilter('mood');
    });

    // CATEGORY_DEFINITIONS mood includes these effects (defined in filterService)
    expect(result.current.filterState.selectedEffects.length).toBeGreaterThan(0);
    expect(result.current.filterState.categoryFilters).toContain('mood');
  });

  it('deselecting a category removes its effects', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.toggleCategoryFilter('mood');
    });

    expect(result.current.filterState.categoryFilters).toContain('mood');
    expect(result.current.filterState.selectedEffects.length).toBeGreaterThan(0);

    act(() => {
      result.current.toggleCategoryFilter('mood');
    });

    expect(result.current.filterState.categoryFilters).not.toContain('mood');
    // Effects from the mood category should have been removed
    expect(result.current.filterState.selectedEffects.length).toBe(0);
  });
});
