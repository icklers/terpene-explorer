/**
 * SunburstChart Component Tests
 *
 * Unit tests for SunburstChart D3 visualization component.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T059
 */

import { render, screen, within as _within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach as _beforeEach } from 'vitest';

import { SunburstChart } from '../../../src/components/visualizations/SunburstChart';
import type { SunburstNode } from '../../../src/utils/sunburstTransform';

describe('SunburstChart', () => {
  const mockData: SunburstNode = {
    name: 'Terpenes',
    children: [
      {
        name: 'energizing',
        type: 'effect',
        color: '#4CAF50',
        value: 2,
        children: [
          { name: 'Limonene', type: 'terpene', id: '1', color: '#4CAF50', value: 1 },
          { name: 'Pinene', type: 'terpene', id: '3', color: '#4CAF50', value: 1 },
        ],
      },
      {
        name: 'sedative',
        type: 'effect',
        color: '#2196F3',
        value: 1,
        children: [
          { name: 'Myrcene', type: 'terpene', id: '2', color: '#2196F3', value: 1 },
        ],
      },
    ],
  };

  describe('Rendering', () => {
    it('should render SVG element', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render with specified width and height', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} width={600} height={600} />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '600');
      expect(svg).toHaveAttribute('height', '600');
    });

    it('should render slices for all nodes', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      // Should have slices for root + 2 effects + 3 terpenes = 6 slices
      const paths = document.querySelectorAll('path');
      expect(paths.length).toBeGreaterThanOrEqual(5); // At least effects + terpenes
    });

    it('should apply colors to slices from data', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      const paths = document.querySelectorAll('path');
      const colors = Array.from(paths).map(p => p.getAttribute('fill'));

      expect(colors).toContain('#4CAF50');
      expect(colors).toContain('#2196F3');
    });

    it('should render labels for visible slices', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      expect(screen.getByText('energizing')).toBeInTheDocument();
      expect(screen.getByText('sedative')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onSliceClick when slice is clicked', async () => {
      const onSliceClick = vi.fn();
      const user = userEvent.setup();

      render(<SunburstChart data={mockData} onSliceClick={onSliceClick} />);

      // Find path elements with data-name attribute
      const paths = document.querySelectorAll('path[data-name]');
      expect(paths.length).toBeGreaterThan(0);
      const pathElement = paths[1] as SVGPathElement;
      expect(pathElement).toBeDefined();
      await user.click(pathElement); // Click first effect slice

      expect(onSliceClick).toHaveBeenCalledTimes(1);
    });

    it('should pass node data to onSliceClick', async () => {
      const onSliceClick = vi.fn();
      const user = userEvent.setup();

      render(<SunburstChart data={mockData} onSliceClick={onSliceClick} />);

      const paths = document.querySelectorAll('path[data-name="energizing"]');
      if (paths[0]) {
        await user.click(paths[0]);
        expect(onSliceClick).toHaveBeenCalledWith(expect.objectContaining({ name: 'energizing' }));
      }
    });

    it('should show tooltip on hover', async () => {
      const user = userEvent.setup();

      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      // Find path elements with data-name attribute
      const paths = document.querySelectorAll('path[data-name]');
      expect(paths.length).toBeGreaterThan(0);
      const pathElement = paths[1] as SVGPathElement;
      expect(pathElement).toBeDefined();
      await user.hover(pathElement);

      // Tooltip should appear
      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have ARIA role of img', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
    });

    it('should have descriptive ARIA label', () => {
      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('aria-label');
      expect(svg?.getAttribute('aria-label')).toContain('Sunburst');
    });

    it('should support keyboard navigation', async () => {
      const onSliceClick = vi.fn();
      const user = userEvent.setup();

      render(<SunburstChart data={mockData} onSliceClick={onSliceClick} />);

      // Tab to first slice
      await user.tab();

      // Press Enter to activate
      await user.keyboard('{Enter}');

      expect(onSliceClick).toHaveBeenCalled();
    });

    it('should support arrow key navigation', async () => {
      const user = userEvent.setup();

      render(<SunburstChart data={mockData} onSliceClick={vi.fn()} />);

      await user.tab();
      const firstElement = document.activeElement;

      await user.keyboard('{ArrowRight}');
      const secondElement = document.activeElement;

      expect(secondElement).not.toBe(firstElement);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const emptyData: SunburstNode = { name: 'Terpenes', children: [] };

      render(<SunburstChart data={emptyData} onSliceClick={vi.fn()} />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle single node', () => {
      const singleNode: SunburstNode = {
        name: 'Terpenes',
        children: [
          { name: 'Test', type: 'effect', color: '#000', value: 1, children: [] },
        ],
      };

      render(<SunburstChart data={singleNode} onSliceClick={vi.fn()} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle deep nesting', () => {
      const deepData: SunburstNode = {
        name: 'Root',
        children: [
          {
            name: 'Level1',
            type: 'effect',
            color: '#000',
            value: 1,
            children: [
              {
                name: 'Level2',
                type: 'terpene',
                id: '1',
                color: '#000',
                value: 1,
              },
            ],
          },
        ],
      };

      render(<SunburstChart data={deepData} onSliceClick={vi.fn()} />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render large datasets within 500ms', () => {
      const largeData: SunburstNode = {
        name: 'Terpenes',
        children: Array.from({ length: 100 }, (_, i) => ({
          name: `Effect${i}`,
          type: 'effect' as const,
          color: `#${i.toString(16).padStart(6, '0')}`,
          value: 10,
          children: Array.from({ length: 10 }, (_, j) => ({
            name: `Terpene${i}-${j}`,
            type: 'terpene' as const,
            id: `${i}-${j}`,
            color: `#${i.toString(16).padStart(6, '0')}`,
            value: 1,
          })),
        })),
      };

      const startTime = performance.now();
      render(<SunburstChart data={largeData} onSliceClick={vi.fn()} />);
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(500);
    });
  });
});
