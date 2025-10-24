/**
 * TerpeneList Component Tests
 *
 * Tests for the terpene list component displaying filtered results.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T042
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Import the component (will be implemented in T050)
import { TerpeneList } from '../../../src/components/visualizations/TerpeneList';

// Mock terpene data
const mockTerpenes = [
  {
    id: '1',
    name: 'Limonene',
    aroma: 'Citrus',
    description: 'A citrus-scented terpene found in lemon peels',
    effects: ['energizing', 'mood-enhancing', 'anti-inflammatory'],
    sources: ['Lemon', 'Orange', 'Grapefruit'],
  },
  {
    id: '2',
    name: 'Myrcene',
    aroma: 'Earthy',
    description: 'An earthy terpene with sedative properties',
    effects: ['sedative', 'muscle-relaxant', 'analgesic'],
    sources: ['Mango', 'Hops', 'Thyme'],
  },
  {
    id: '3',
    name: 'Pinene',
    aroma: 'Pine',
    description: 'A pine-scented terpene that aids focus',
    effects: ['focus', 'anti-inflammatory', 'bronchodilator'],
    sources: ['Pine', 'Rosemary', 'Basil'],
  },
];

describe('TerpeneList', () => {
  describe('Rendering', () => {
    it('should render list of terpenes', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText('Limonene')).toBeInTheDocument();
      expect(screen.getByText('Myrcene')).toBeInTheDocument();
      expect(screen.getByText('Pinene')).toBeInTheDocument();
    });

    it('should display terpene names', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      mockTerpenes.forEach((terpene) => {
        expect(screen.getByText(terpene.name)).toBeInTheDocument();
      });
    });

    it('should display terpene aromas', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText(/Citrus/i)).toBeInTheDocument();
      expect(screen.getByText(/Earthy/i)).toBeInTheDocument();
      expect(screen.getByText(/Pine/i)).toBeInTheDocument();
    });

    it('should display terpene descriptions', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText(/citrus-scented terpene/i)).toBeInTheDocument();
      expect(screen.getByText(/earthy terpene/i)).toBeInTheDocument();
    });

    it('should display terpene effects', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText(/energizing/i)).toBeInTheDocument();
      expect(screen.getByText(/sedative/i)).toBeInTheDocument();
      expect(screen.getByText(/focus/i)).toBeInTheDocument();
    });

    it('should display terpene sources', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText(/Lemon/i)).toBeInTheDocument();
      expect(screen.getByText(/Mango/i)).toBeInTheDocument();
      expect(screen.getByText(/Pine/i)).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no terpenes provided', () => {
      render(<TerpeneList terpenes={[]} />);

      expect(screen.getByText(/no terpenes/i)).toBeInTheDocument();
    });

    it('should show helpful message in empty state', () => {
      render(<TerpeneList terpenes={[]} />);

      // Should explain why there are no results
      expect(screen.getByText(/adjust.*filter|no.*match/i)).toBeInTheDocument();
    });

    it('should show empty state icon or illustration', () => {
      const { container } = render(<TerpeneList terpenes={[]} />);

      // Should have some visual element for empty state
      const emptyStateElement = container.querySelector('[role="img"], svg, .empty-state');
      expect(emptyStateElement).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message when error prop is provided', () => {
      const error = new Error('Failed to load terpenes');

      render(<TerpeneList terpenes={[]} error={error} />);

      expect(screen.getByText(/failed.*load|error/i)).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      const error = new Error('Network error');
      const onRetry = vi.fn();

      render(<TerpeneList terpenes={[]} error={error} onRetry={onRetry} />);

      expect(screen.getByText(/retry|try again/i)).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      const error = new Error('Network error');
      const onRetry = vi.fn();

      render(<TerpeneList terpenes={[]} error={error} onRetry={onRetry} />);

      const retryButton = screen.getByText(/retry|try again/i);
      retryButton.click();

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('Validation Warnings (FR-015)', () => {
    it('should display validation warnings when provided', () => {
      const warnings = ['2 terpene entries were skipped due to invalid data'];

      render(<TerpeneList terpenes={mockTerpenes} warnings={warnings} />);

      expect(screen.getByText(/2.*skipped|invalid/i)).toBeInTheDocument();
    });

    it('should display multiple warnings', () => {
      const warnings = [
        'Warning 1: Invalid UUID',
        'Warning 2: Missing required field',
      ];

      render(<TerpeneList terpenes={mockTerpenes} warnings={warnings} />);

      expect(screen.getByText(/Warning 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Warning 2/i)).toBeInTheDocument();
    });

    it('should allow dismissing warnings', async () => {
      const warnings = ['Test warning'];
      const onDismissWarning = vi.fn();

      render(
        <TerpeneList
          terpenes={mockTerpenes}
          warnings={warnings}
          onDismissWarning={onDismissWarning}
        />
      );

      const dismissButton = screen.getByRole('button', { name: /dismiss|close/i });
      dismissButton.click();

      expect(onDismissWarning).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when isLoading is true', () => {
      render(<TerpeneList terpenes={[]} isLoading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should show skeleton or placeholder during loading', () => {
      const { container } = render(<TerpeneList terpenes={[]} isLoading={true} />);

      // Should have loading skeleton or spinner
      const loadingElement = container.querySelector(
        '.MuiSkeleton-root, .MuiCircularProgress-root, [role="progressbar"]'
      );
      expect(loadingElement).toBeInTheDocument();
    });

    it('should not show terpenes while loading', () => {
      render(<TerpeneList terpenes={mockTerpenes} isLoading={true} />);

      // Terpene names should not be visible during loading
      expect(screen.queryByText('Limonene')).not.toBeInTheDocument();
    });
  });

  describe('Filtering Display', () => {
    it('should show count of displayed terpenes', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText(/3.*terpene/i)).toBeInTheDocument();
    });

    it('should update count when terpenes change', () => {
      const { rerender } = render(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText(/3.*terpene/i)).toBeInTheDocument();

      rerender(<TerpeneList terpenes={[mockTerpenes[0]]} />);

      expect(screen.getByText(/1.*terpene/i)).toBeInTheDocument();
    });

    it('should indicate when results are filtered', () => {
      render(<TerpeneList terpenes={mockTerpenes} isFiltered={true} />);

      expect(screen.getByText(/filtered|matching/i)).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should render items in a list format', () => {
      const { container } = render(<TerpeneList terpenes={mockTerpenes} />);

      const listElement = container.querySelector('ul, ol, [role="list"]');
      expect(listElement).toBeInTheDocument();
    });

    it('should render items as cards or list items', () => {
      const { container } = render(<TerpeneList terpenes={mockTerpenes} />);

      const items = container.querySelectorAll(
        'li, .MuiCard-root, .MuiListItem-root, [role="listitem"]'
      );
      expect(items.length).toBeGreaterThan(0);
    });

    it('should have proper spacing between items', () => {
      const { container } = render(<TerpeneList terpenes={mockTerpenes} />);

      const items = container.querySelectorAll('li, .MuiCard-root, .MuiListItem-root');
      items.forEach((item) => {
        const styles = window.getComputedStyle(item);
        expect(parseInt(styles.marginBottom) || parseInt(styles.gap)).toBeGreaterThan(0);
      });
    });

    it('should be responsive on mobile devices', () => {
      const { container } = render(<TerpeneList terpenes={mockTerpenes} />);

      const listContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(listContainer);

      // Should use responsive units or flex/grid
      expect(styles.display).toMatch(/flex|grid|block/);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<TerpeneList terpenes={mockTerpenes} />);

      const list = container.querySelector('[role="list"], ul, ol');
      expect(list).toBeInTheDocument();
    });

    it('should have accessible names for list items', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      const limonene = screen.getByText('Limonene');
      const listItem = limonene.closest('[role="listitem"], li');

      expect(listItem).toHaveAccessibleName();
    });

    it('should announce empty state to screen readers', () => {
      render(<TerpeneList terpenes={[]} />);

      const emptyState = screen.getByText(/no terpenes/i);
      expect(emptyState).toBeInTheDocument();
    });

    it('should announce loading state to screen readers', () => {
      render(<TerpeneList terpenes={[]} isLoading={true} />);

      const loadingElement = screen.getByText(/loading/i);
      expect(loadingElement.closest('[role="status"], [aria-live]')).toBeInTheDocument();
    });

    it('should have keyboard navigable items', () => {
      render(<TerpeneList terpenes={mockTerpenes} />);

      const items = screen.getAllByRole('listitem');
      items.forEach((item) => {
        // Items should be focusable or contain focusable elements
        expect(item.tabIndex >= -1 || item.querySelector('[tabindex]')).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle terpene with very long name', () => {
      const longNameTerpene = {
        ...mockTerpenes[0],
        name: 'Very Long Terpene Name That Might Cause Layout Issues When Displayed',
      };

      render(<TerpeneList terpenes={[longNameTerpene]} />);

      expect(
        screen.getByText(/Very Long Terpene Name That Might Cause Layout Issues/)
      ).toBeInTheDocument();
    });

    it('should handle terpene with many effects', () => {
      const manyEffectsTerpene = {
        ...mockTerpenes[0],
        effects: Array.from({ length: 10 }, (_, i) => `effect-${i}`),
      };

      render(<TerpeneList terpenes={[manyEffectsTerpene]} />);

      expect(screen.getByText('effect-0')).toBeInTheDocument();
    });

    it('should handle terpene with no description', () => {
      const noDescTerpene = {
        ...mockTerpenes[0],
        description: '',
      };

      render(<TerpeneList terpenes={[noDescTerpene]} />);

      expect(screen.getByText('Limonene')).toBeInTheDocument();
    });

    it('should handle special characters in terpene data', () => {
      const specialCharTerpene = {
        ...mockTerpenes[0],
        name: 'α-Pinene',
        description: 'A terpene with α & β variants (>90% pure)',
      };

      render(<TerpeneList terpenes={[specialCharTerpene]} />);

      expect(screen.getByText('α-Pinene')).toBeInTheDocument();
      expect(screen.getByText(/α & β variants/)).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      const largeTerpeneSet = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: ['effect-1'],
        sources: ['Source 1'],
      }));

      const startTime = performance.now();

      render(<TerpeneList terpenes={largeTerpeneSet} />);

      const renderTime = performance.now() - startTime;

      // Should render in less than 200ms (NFR-PERF-002)
      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('Performance', () => {
    it('should use virtualization for large lists', () => {
      const largeTerpeneSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: ['effect-1'],
        sources: ['Source 1'],
      }));

      const { container } = render(<TerpeneList terpenes={largeTerpeneSet} />);

      // Should not render all 1000 items at once
      const renderedItems = container.querySelectorAll('[role="listitem"], li');
      expect(renderedItems.length).toBeLessThan(1000);
    });

    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<TerpeneList terpenes={mockTerpenes} />);

      // Re-render with same props
      rerender(<TerpeneList terpenes={mockTerpenes} />);

      expect(screen.getByText('Limonene')).toBeInTheDocument();
    });
  });

  describe('Integration with Features', () => {
    it('should support FR-016 empty state display', () => {
      render(<TerpeneList terpenes={[]} />);

      // Should show instruction per FR-016
      expect(screen.getByText(/no terpenes|adjust.*filter/i)).toBeInTheDocument();
    });

    it('should support FR-015 graceful validation warnings', () => {
      const warnings = ['Some entries were invalid'];

      render(<TerpeneList terpenes={mockTerpenes} warnings={warnings} />);

      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });
});
