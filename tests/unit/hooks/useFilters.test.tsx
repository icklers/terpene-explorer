import React, { useEffect } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { useFilters } from '../../../src/hooks/useFilters';

function Harness({ action }: { action: 'toggleCategory' | 'toggleEffect' }) {
  const { filterState, toggleCategoryFilter, toggleEffect } = useFilters();

  useEffect(() => {
    if (action === 'toggleCategory') {
      toggleCategoryFilter('mood');
    } else if (action === 'toggleEffect') {
      toggleEffect('Energizing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <pre data-testid="state">{JSON.stringify(filterState)}</pre>;
}

describe('useFilters hook (integration smoke)', () => {
  it('toggleCategoryFilter sets categoryFilters and selectedEffects', async () => {
    render(<Harness action="toggleCategory" />);

    await waitFor(() => {
      const node = screen.getByTestId('state');
      const json = JSON.parse(node.textContent || '{}');
      expect(json.categoryFilters).toContain('mood');
      // selecting category should also populate selectedEffects for that category
      expect(Array.isArray(json.selectedEffects)).toBe(true);
      expect(json.selectedEffects.length).toBeGreaterThan(0);
    });
  });

  it('toggleEffect selects effect and syncs categoryFilters', async () => {
    render(<Harness action="toggleEffect" />);

    await waitFor(() => {
      const node = screen.getByTestId('state');
      const json = JSON.parse(node.textContent || '{}');
      expect(json.selectedEffects).toContain('Energizing');
      expect(json.categoryFilters).toContain('mood');
    });
  });
});
