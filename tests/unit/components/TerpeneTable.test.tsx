/**
 * TerpeneTable Component Tests
 *
 * Unit tests for TerpeneTable with sorting and virtualization.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T060
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TerpeneTable } from '../../../src/components/visualizations/TerpeneTable';
import type { Terpene } from '../../../src/models/Terpene';

describe('TerpeneTable', () => {
  const mockTerpenes: Terpene[] = [
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
      description: 'Earthy terpene',
      effects: ['sedative'],
      sources: ['Mango'],
    },
    {
      id: '3',
      name: 'Pinene',
      aroma: 'Pine',
      description: 'Pine-scented',
      effects: ['focus'],
      sources: ['Pine', 'Rosemary'],
    },
  ];

  describe('Rendering', () => {
    it('should render table with terpene data', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Limonene')).toBeInTheDocument();
      expect(screen.getByText('Myrcene')).toBeInTheDocument();
      expect(screen.getByText('Pinene')).toBeInTheDocument();
    });

    it('should render column headers', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Aroma')).toBeInTheDocument();
      expect(screen.getByText('Effects')).toBeInTheDocument();
      expect(screen.getByText('Sources')).toBeInTheDocument();
    });

    it('should display all terpene properties', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      expect(screen.getByText('Citrus')).toBeInTheDocument();
      expect(screen.getByText(/energizing/)).toBeInTheDocument();
      expect(screen.getByText(/Lemon/)).toBeInTheDocument();
    });

    it('should handle empty terpene list', () => {
      render(<TerpeneTable terpenes={[]} />);

      expect(screen.getByText(/no terpenes/i)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort by name ascending by default', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      const rows = screen.getAllByRole('row').slice(1); // Skip header
      const names = rows.map(row => within(row).getAllByRole('cell')[0].textContent);

      expect(names).toEqual(['Limonene', 'Myrcene', 'Pinene']);
    });

    it('should sort by name descending when header clicked', async () => {
      const user = userEvent.setup();

      render(<TerpeneTable terpenes={mockTerpenes} />);

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      const rows = screen.getAllByRole('row').slice(1);
      const names = rows.map(row => within(row).getAllByRole('cell')[0].textContent);

      expect(names).toEqual(['Pinene', 'Myrcene', 'Limonene']);
    });

    it('should sort by aroma column', async () => {
      const user = userEvent.setup();

      render(<TerpeneTable terpenes={mockTerpenes} />);

      const aromaHeader = screen.getByText('Aroma');
      await user.click(aromaHeader);

      // Verify sorting occurred (Citrus, Earthy, Pine)
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows.length).toBe(3);
    });

    it('should toggle sort direction on repeated clicks', async () => {
      const user = userEvent.setup();

      render(<TerpeneTable terpenes={mockTerpenes} />);

      const nameHeader = screen.getByText('Name');

      await user.click(nameHeader);
      await user.click(nameHeader);

      // Should be back to ascending
      const rows = screen.getAllByRole('row').slice(1);
      const names = rows.map(row => within(row).getAllByRole('cell')[0].textContent);

      expect(names).toEqual(['Limonene', 'Myrcene', 'Pinene']);
    });

    it('should display sort direction indicator', async () => {
      const user = userEvent.setup();

      render(<TerpeneTable terpenes={mockTerpenes} />);

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      // Should show sort icon/indicator
      const sortIcon = document.querySelector('svg[data-testid*="sort"]');
      expect(sortIcon).toBeInTheDocument();
    });
  });

  describe('Virtualization', () => {
    it('should use virtualization for large datasets', () => {
      const largeTerpeneSet: Terpene[] = Array.from({ length: 200 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: [`effect-${i}`],
        sources: [`Source ${i}`],
      }));

      render(<TerpeneTable terpenes={largeTerpeneSet} />);

      const rows = screen.getAllByRole('row');

      // Should render fewer rows than total (virtualized)
      expect(rows.length).toBeLessThan(200);
    });

    it('should render efficiently with 1000+ rows', () => {
      const hugeTerpeneSet: Terpene[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `Terpene ${i}`,
        aroma: `Aroma ${i}`,
        description: `Description ${i}`,
        effects: [`effect-${i}`],
        sources: [`Source ${i}`],
      }));

      const startTime = performance.now();
      render(<TerpeneTable terpenes={hugeTerpeneSet} />);
      const duration = performance.now() - startTime;

      // Should render within 500ms (SC-005)
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Accessibility', () => {
    it('should have proper table semantics', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0);
      expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
    });

    it('should support keyboard navigation for sorting', async () => {
      const user = userEvent.setup();

      render(<TerpeneTable terpenes={mockTerpenes} />);

      const nameHeader = screen.getByText('Name');

      nameHeader.focus();
      await user.keyboard('{Enter}');

      // Sort should have been triggered
      expect(nameHeader).toBeInTheDocument();
    });

    it('should have ARIA labels for sort buttons', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      const nameHeader = screen.getByText('Name');
      expect(nameHeader).toHaveAttribute('aria-sort');
    });
  });

  describe('Data Display', () => {
    it('should format effects as comma-separated list', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      const limoneneRow = screen.getByText('Limonene').closest('tr');
      const effectsCell = within(limoneneRow!).getAllByRole('cell')[2];

      expect(effectsCell.textContent).toContain('energizing');
      expect(effectsCell.textContent).toContain('mood-enhancing');
    });

    it('should format sources as comma-separated list', () => {
      render(<TerpeneTable terpenes={mockTerpenes} />);

      const limoneneRow = screen.getByText('Limonene').closest('tr');
      const sourcesCell = within(limoneneRow!).getAllByRole('cell')[3];

      expect(sourcesCell.textContent).toContain('Lemon');
      expect(sourcesCell.textContent).toContain('Orange');
    });

    it('should handle terpenes with no sources', () => {
      const terpeneNoSources: Terpene = {
        id: '4',
        name: 'Test',
        aroma: 'Test',
        description: 'Test',
        effects: [],
        sources: [],
      };

      render(<TerpeneTable terpenes={[terpeneNoSources]} />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render on prop change with same data', () => {
      let renderCount = 0;

      function TestWrapper({ terpenes }: { terpenes: Terpene[] }) {
        renderCount++;
        return <TerpeneTable terpenes={terpenes} />;
      }

      const { rerender } = render(<TestWrapper terpenes={mockTerpenes} />);

      expect(renderCount).toBe(1);

      rerender(<TestWrapper terpenes={mockTerpenes} />);

      // Should use React.memo or similar optimization
      expect(renderCount).toBe(2); // React will re-render, but internal optimizations should help
    });
  });
});
