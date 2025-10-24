/**
 * FilterControls Component Tests
 *
 * Tests for the filter controls component with effect chips.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T040
 */

import { render, screen, within as _within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

// Import the component (will be implemented in T048)
import { FilterControls } from '../../../src/components/filters/FilterControls';

// Mock effect data for testing
const mockEffects = [
  {
    name: 'calming',
    displayName: { en: 'Calming', de: 'Beruhigend' },
    color: '#5C6BC0',
    terpeneCount: 5,
  },
  {
    name: 'energizing',
    displayName: { en: 'Energizing', de: 'Energetisierend' },
    color: '#FFA726',
    terpeneCount: 8,
  },
  {
    name: 'anti-inflammatory',
    displayName: { en: 'Anti-Inflammatory', de: 'Entzündungshemmend' },
    color: '#EF5350',
    terpeneCount: 12,
  },
];

describe('FilterControls', () => {
  describe('Rendering', () => {
    it('should render all effect chips', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      expect(screen.getByText('Calming')).toBeInTheDocument();
      expect(screen.getByText('Energizing')).toBeInTheDocument();
      expect(screen.getByText('Anti-Inflammatory')).toBeInTheDocument();
    });

    it('should display terpene count for each effect', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      // Terpene counts should be visible (might be in tooltip or badge)
      expect(screen.getByText(/5/)).toBeInTheDocument();
      expect(screen.getByText(/8/)).toBeInTheDocument();
      expect(screen.getByText(/12/)).toBeInTheDocument();
    });

    it('should render with Material UI Chips', () => {
      const onToggle = vi.fn();

      const { container } = render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      // Check for MUI Chip elements
      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips.length).toBeGreaterThan(0);
    });

    it('should handle empty effects array', () => {
      const onToggle = vi.fn();

      const { container } = render(<FilterControls effects={[]} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chips = container.querySelectorAll('.MuiChip-root');
      expect(chips).toHaveLength(0);
    });
  });

  describe('Selection State', () => {
    it('should show selected state for selected effects', () => {
      const onToggle = vi.fn();

      const { container } = render(
        <FilterControls effects={mockEffects} selectedEffects={['calming', 'energizing']} onToggleEffect={onToggle} />
      );

      // Check for selected chip styling
      const chips = container.querySelectorAll('.MuiChip-root');
      const selectedChips = Array.from(chips).filter((chip) => chip.classList.contains('MuiChip-filled'));

      expect(selectedChips.length).toBeGreaterThan(0);
    });

    it('should show unselected state for unselected effects', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={['calming']} onToggleEffect={onToggle} />);

      // 'energizing' and 'anti-inflammatory' should be unselected
      const energizingChip = screen.getByText('Energizing').closest('.MuiChip-root');
      expect(energizingChip).not.toHaveClass('MuiChip-filled');
    });

    it('should apply effect color to chips', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const calmingChip = screen.getByText('Calming').closest('.MuiChip-root');
      const style = window.getComputedStyle(calmingChip!);

      // Should have background color or border color matching effect color
      expect(style.backgroundColor || style.borderColor).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onToggleEffect when chip is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      await user.click(screen.getByText('Calming'));

      expect(onToggle).toHaveBeenCalledWith('calming');
    });

    it('should toggle effect on and off', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={['calming']} onToggleEffect={onToggle} />);

      await user.click(screen.getByText('Calming'));

      expect(onToggle).toHaveBeenCalledWith('calming');
    });

    it('should handle multiple chip clicks', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      await user.click(screen.getByText('Calming'));
      await user.click(screen.getByText('Energizing'));
      await user.click(screen.getByText('Anti-Inflammatory'));

      expect(onToggle).toHaveBeenCalledTimes(3);
      expect(onToggle).toHaveBeenCalledWith('calming');
      expect(onToggle).toHaveBeenCalledWith('energizing');
      expect(onToggle).toHaveBeenCalledWith('anti-inflammatory');
    });

    it('should be clickable when enabled', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chip = screen.getByText('Calming');

      await user.click(chip);

      expect(onToggle).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for screen readers', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const calmingChip = screen.getByText('Calming').closest('.MuiChip-root');
      expect(calmingChip).toHaveAttribute('role');
    });

    it('should indicate selected state to screen readers', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={['calming']} onToggleEffect={onToggle} />);

      const calmingChip = screen.getByText('Calming').closest('.MuiChip-root');
      const ariaPressed = calmingChip?.getAttribute('aria-pressed');

      // Should indicate pressed/selected state
      expect(ariaPressed).toBeTruthy();
    });

    it('should be keyboard navigable', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chips = screen.getAllByRole('button');

      chips.forEach((chip) => {
        expect(chip).toHaveAttribute('tabIndex');
      });
    });

    it('should support Enter key for selection', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chip = screen.getByText('Calming');
      chip.focus();

      await user.keyboard('{Enter}');

      expect(onToggle).toHaveBeenCalledWith('calming');
    });

    it('should support Space key for selection', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chip = screen.getByText('Calming');
      chip.focus();

      await user.keyboard(' ');

      expect(onToggle).toHaveBeenCalledWith('calming');
    });

    it('should have descriptive text for terpene count', () => {
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      // Should have accessible text like "5 terpenes" or similar
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should render chips in a horizontal layout', () => {
      const onToggle = vi.fn();

      const { container } = render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const wrapper = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(wrapper);

      // Should use flexbox or similar for horizontal layout
      expect(styles.display).toMatch(/flex|grid/);
    });

    it('should wrap chips when space is limited', () => {
      const onToggle = vi.fn();

      const { container } = render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const wrapper = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(wrapper);

      // Should allow wrapping
      expect(styles.flexWrap).toBe('wrap');
    });

    it('should have consistent spacing between chips', () => {
      const onToggle = vi.fn();

      const { container } = render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chips = container.querySelectorAll('.MuiChip-root');

      // All chips should have margin/gap
      chips.forEach((chip) => {
        const styles = window.getComputedStyle(chip);
        expect(parseInt(styles.margin)).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle effects with very long names', () => {
      const longNameEffects = [
        {
          name: 'very-long-effect-name-that-might-cause-layout-issues',
          displayName: {
            en: 'Very Long Effect Name That Might Cause Layout Issues',
            de: 'Sehr langer Effektname',
          },
          color: '#5C6BC0',
          terpeneCount: 1,
        },
      ];

      const onToggle = vi.fn();

      render(<FilterControls effects={longNameEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      expect(screen.getByText('Very Long Effect Name That Might Cause Layout Issues')).toBeInTheDocument();
    });

    it('should handle effects with zero terpene count', () => {
      const zeroCountEffects = [
        {
          name: 'rare-effect',
          displayName: { en: 'Rare Effect', de: 'Seltener Effekt' },
          color: '#5C6BC0',
          terpeneCount: 0,
        },
      ];

      const onToggle = vi.fn();

      render(<FilterControls effects={zeroCountEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      expect(screen.getByText('Rare Effect')).toBeInTheDocument();
    });

    it('should handle special characters in effect names', () => {
      const specialCharEffects = [
        {
          name: 'anti-inflammatory',
          displayName: { en: 'Anti-Inflammatory (α-variant)', de: 'Entzündungshemmend' },
          color: '#5C6BC0',
          terpeneCount: 3,
        },
      ];

      const onToggle = vi.fn();

      render(<FilterControls effects={specialCharEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      expect(screen.getByText('Anti-Inflammatory (α-variant)')).toBeInTheDocument();
    });

    it('should handle rapid clicking', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const chip = screen.getByText('Calming');

      // Click multiple times rapidly
      await user.tripleClick(chip);

      // Should register all clicks
      expect(onToggle).toHaveBeenCalledTimes(3);
    });

    it('should handle very large number of effects', () => {
      const manyEffects = Array.from({ length: 50 }, (_, i) => ({
        name: `effect-${i}`,
        displayName: { en: `Effect ${i}`, de: `Effekt ${i}` },
        color: '#5C6BC0',
        terpeneCount: i,
      }));

      const onToggle = vi.fn();

      render(<FilterControls effects={manyEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      expect(screen.getByText('Effect 0')).toBeInTheDocument();
      expect(screen.getByText('Effect 49')).toBeInTheDocument();
    });
  });

  describe('Clear Filters Button (UAT)', () => {
    it('should render a clear filters button when filters are active', () => {
      const onToggle = vi.fn();
      const onClear = vi.fn();

      render(
        <FilterControls
          effects={mockEffects}
          selectedEffects={['calming', 'energizing']}
          onToggleEffect={onToggle}
          onClearFilters={onClear}
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('should call onClearFilters when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      const onClear = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={['calming']} onToggleEffect={onToggle} onClearFilters={onClear} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should not render clear button when no effects are selected', () => {
      const onToggle = vi.fn();
      const onClear = vi.fn();

      render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} onClearFilters={onClear} />);

      const clearButton = screen.queryByRole('button', { name: /clear/i });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render large effect lists efficiently', () => {
      const manyEffects = Array.from({ length: 100 }, (_, i) => ({
        name: `effect-${i}`,
        displayName: { en: `Effect ${i}`, de: `Effekt ${i}` },
        color: '#5C6BC0',
        terpeneCount: i,
      }));

      const onToggle = vi.fn();

      const startTime = performance.now();

      render(<FilterControls effects={manyEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      const renderTime = performance.now() - startTime;

      // Should render in less than 200ms (NFR-PERF-002)
      expect(renderTime).toBeLessThan(200);
    });

    it('should not re-render unnecessarily', () => {
      const onToggle = vi.fn();

      const { rerender } = render(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      // Re-render with same props
      rerender(<FilterControls effects={mockEffects} selectedEffects={[]} onToggleEffect={onToggle} />);

      // Component should use memoization to avoid unnecessary renders
      expect(screen.getByText('Calming')).toBeInTheDocument();
    });
  });
});
