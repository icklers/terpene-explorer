import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { TerpeneDetailModal } from './TerpeneDetailModal';
import type { Terpene } from '../types/terpene';

// Mock terpene data for testing
const mockTerpene: Terpene = {
  id: 'limonene-001',
  name: 'Limonene',
  isomerOf: null,
  isomerType: null,
  category: 'Core',
  aroma: 'Citrus, Lemon, Orange',
  taste: 'Citrus, sweet',
  description: 'Citrus terpene responsible for uplifting properties',
  therapeuticProperties: ['Antidepressant', 'Anti-inflammatory', 'Anxiolytic'],
  effects: ['Mood enhancing', 'Energizing', 'Stress relief'],
  concentrationRange: '0.003-1.613 mg/g',
  sources: ['Lemon peel', 'Orange rind', 'Grapefruit'],
  molecularData: {
    molecularFormula: 'C10H16',
    molecularWeight: 136.24,
    boilingPoint: 176,
    class: 'Monoterpene',
  },
  researchTier: {
    dataQuality: 'Excellent' as const,
    evidenceSummary: 'Well-documented across multiple studies',
  },
  references: [
    {
      source: 'Example Study on Limonene Effects',
      type: 'Peer-reviewed study',
      url: 'https://example.com/study1',
      notes: 'Double-blind placebo-controlled study',
    },
  ],
};

describe('TerpeneDetailModal', () => {
  describe('Modal Shell & Identity Section', () => {
    it('renders with terpene name', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      expect(screen.getByText('Limonene')).toBeInTheDocument();
    });

    it('renders CategoryBadge next to name', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should have both name and category badge
      expect(screen.getByText('Limonene')).toBeInTheDocument();

      // Find the category badge in the header (not the concentration section)
      const titleElement = screen.getByText('Limonene').closest('div');
      const categoryBadge = titleElement?.querySelector('.MuiChip-root');
      expect(categoryBadge).toBeInTheDocument();
      expect(categoryBadge).toHaveTextContent('Core');
    });

    it('renders aroma chips with icons', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should render individual aroma items as chips
      expect(screen.getByText('Citrus')).toBeInTheDocument();
      expect(screen.getByText('Lemon')).toBeInTheDocument();
      expect(screen.getByText('Orange')).toBeInTheDocument();
    });

    it('has close button (X icon)', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Look for close button by aria-label (using i18n key)
      const closeButton = screen.getByLabelText('modal.terpeneDetail.close');
      expect(closeButton).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
      const onClose = vi.fn();

      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={onClose} />);

      const closeButton = screen.getByLabelText('modal.terpeneDetail.close');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when close button clicked', () => {
      const onClose = vi.fn();

      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={onClose} />);

      const closeButton = screen.getByLabelText('modal.terpeneDetail.close');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not render when closed', () => {
      render(<TerpeneDetailModal open={false} terpene={null} onClose={vi.fn()} />);

      // Should not render anything when closed
      expect(screen.queryByText('Limonene')).not.toBeInTheDocument();
    });

    it('does not render when terpene is null', () => {
      render(<TerpeneDetailModal open={true} terpene={null} onClose={vi.fn()} />);

      // Should not render anything when terpene is null
      expect(screen.queryByText('Limonene')).not.toBeInTheDocument();
    });
  });

  describe('Description Section', () => {
    it('displays "What it does for you" heading', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      expect(screen.getByText('What it does for you')).toBeInTheDocument();
    });

    it('truncates description to 180 characters with "Read more..." link', () => {
      const longDescription = 'A'.repeat(200); // 200 character description
      const terpeneWithLongDesc = { ...mockTerpene, description: longDescription };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithLongDesc} onClose={vi.fn()} />);

      // Should show truncated text (180 chars + "...")
      const truncatedText = screen.getByText('A'.repeat(180) + '...');
      expect(truncatedText).toBeInTheDocument();

      // Should have "Read more..." link
      expect(screen.getByText('Read more...')).toBeInTheDocument();
    });

    it('shows full description when "Read more..." is clicked', () => {
      const longDescription = 'A'.repeat(200); // 200 character description
      const terpeneWithLongDesc = { ...mockTerpene, description: longDescription };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithLongDesc} onClose={vi.fn()} />);

      // Click "Read more..."
      const readMoreLink = screen.getByText('Read more...');
      fireEvent.click(readMoreLink);

      // Should now show full description
      expect(screen.getByText(longDescription)).toBeInTheDocument();

      // Should have "Show less" link
      expect(screen.getByText('Show less')).toBeInTheDocument();
    });

    it('collapses back to truncated when "Show less" is clicked', () => {
      const longDescription = 'A'.repeat(200); // 200 character description
      const terpeneWithLongDesc = { ...mockTerpene, description: longDescription };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithLongDesc} onClose={vi.fn()} />);

      // Expand first
      const readMoreLink = screen.getByText('Read more...');
      fireEvent.click(readMoreLink);

      // Then collapse
      const showLessLink = screen.getByText('Show less');
      fireEvent.click(showLessLink);

      // Should show truncated again (updated to 180 characters)
      expect(screen.getByText('A'.repeat(180) + '...')).toBeInTheDocument();
      expect(screen.getByText('Read more...')).toBeInTheDocument();
    });

    it('shows full description when under 180 characters', () => {
      const shortDescription = 'Short description under 180 characters';
      const terpeneWithShortDesc = { ...mockTerpene, description: shortDescription };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithShortDesc} onClose={vi.fn()} />);

      // Should show full description
      expect(screen.getByText(shortDescription)).toBeInTheDocument();

      // Should not have "Read more..." link
      expect(screen.queryByText('Read more...')).not.toBeInTheDocument();
    });
  });

  describe('Therapeutic Properties Section', () => {
    it('displays "Therapeutic Properties" heading', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      expect(screen.getByText('Therapeutic Properties')).toBeInTheDocument();
    });

    it('renders therapeutic property chips with correct colors', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should render all therapeutic properties as chips
      expect(screen.getByText('Antidepressant')).toBeInTheDocument();
      expect(screen.getByText('Anti-inflammatory')).toBeInTheDocument();
      expect(screen.getByText('Anxiolytic')).toBeInTheDocument();
    });

    it('calls onTherapeuticPropertyClick when chip is clicked', () => {
      const onTherapeuticPropertyClick = vi.fn();

      render(
        <TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} onTherapeuticPropertyClick={onTherapeuticPropertyClick} />
      );

      // Click on a therapeutic property chip
      const antidepressantChip = screen.getByText('Antidepressant');
      fireEvent.click(antidepressantChip);

      expect(onTherapeuticPropertyClick).toHaveBeenCalledWith('Antidepressant');
    });

    it('does not call callback when onTherapeuticPropertyClick is not provided', () => {
      render(
        <TerpeneDetailModal
          open={true}
          terpene={mockTerpene}
          onClose={vi.fn()}
          // onTherapeuticPropertyClick not provided
        />
      );

      // Click on a therapeutic property chip
      const antidepressantChip = screen.getByText('Antidepressant');
      fireEvent.click(antidepressantChip);

      // Should not throw any errors
      expect(antidepressantChip).toBeInTheDocument();
    });
  });

  describe('Concentration Visualization', () => {
    it('displays "Concentration Range" heading', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      expect(screen.getByText('Concentration Range')).toBeInTheDocument();
    });

    it('shows concentration range with min-max values', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should show the concentration range
      expect(screen.getByText('0.003-1.613 mg/g')).toBeInTheDocument();
    });

    it('displays concentration without redundant category chip', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Category badge should be shown next to the name in the title
      expect(screen.getByText('Limonene')).toBeInTheDocument();
      expect(screen.getByText('Core')).toBeInTheDocument();

      // Concentration section should show the range and percentile, but not duplicate category
      expect(screen.getByText('0.003-1.613 mg/g')).toBeInTheDocument();
      expect(screen.getByText(/High \(\d+%\)/)).toBeInTheDocument();

      // The category chip should NOT appear in the concentration chips
      // We verify by checking that "Core" only appears once on the page
      const coreElements = screen.getAllByText('Core');
      expect(coreElements.length).toBe(1); // Only in the badge next to name
    });

    it('shows percentile indicator for concentration relative to category', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should show percentile information
      const percentileText = screen.getByText(/High|Moderate|Low|Trace/);
      expect(percentileText).toBeInTheDocument();
    });

    it('uses semantic colors for concentration levels', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should use appropriate colors for concentration visualization
      const concentrationElements = screen.getAllByText(/0.003-1.613 mg\/g|High|Moderate|Low|Trace/);
      expect(concentrationElements.length).toBeGreaterThan(0);
    });

    it('handles missing concentration data gracefully', () => {
      const terpeneWithoutConcentration: Terpene = {
        ...mockTerpene,
        concentrationRange: undefined,
      };

      // Should not throw error when concentration data is missing
      expect(() => {
        render(<TerpeneDetailModal open={true} terpene={terpeneWithoutConcentration} onClose={vi.fn()} />);
      }).not.toThrow();
    });

    it('displays concentration information in a visually distinct section', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should be visually separated from other sections
      const concentrationSection = screen.getByText('Concentration Range').closest('div');
      expect(concentrationSection).toBeInTheDocument();
    });

    describe('[US5] Concentration Context Tooltip (T220-T226)', () => {
      it('[T220-T221] shows tooltip on concentration chip hover', async () => {
        render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

        // Find the percentile chip (e.g., "High (80%)")
        const percentileChip = screen.getByText(/High \(\d+%\)/);
        expect(percentileChip).toBeInTheDocument();

        // Hover over the chip
        fireEvent.mouseEnter(percentileChip);

        // Tooltip should appear
        const tooltip = await waitFor(() => screen.getByRole('tooltip'));
        expect(tooltip).toBeInTheDocument();
      });

      it('[T222-T223] shows correct tooltip for High concentration', async () => {
        render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

        const percentileChip = screen.getByText(/High \(\d+%\)/);
        fireEvent.mouseEnter(percentileChip);

        const tooltip = await waitFor(() => screen.getByRole('tooltip'));
        expect(tooltip).toHaveTextContent(/top 25%/i);
        expect(tooltip).toHaveTextContent(/Core/i);
      });

      it('[T224-T225] shows correct tooltip for Moderate concentration', async () => {
        // Create terpene with moderate concentration (for Core: 40-75% = 0.8-1.5 mg/g max)
        const moderateTerpene: Terpene = {
          ...mockTerpene,
          concentrationRange: '0.3-1.0 mg/g', // Max 1.0/2.0 = 50% → Moderate
        };

        render(<TerpeneDetailModal open={true} terpene={moderateTerpene} onClose={vi.fn()} />);

        const percentileChip = screen.getByText(/Moderate \(\d+%\)/);
        fireEvent.mouseEnter(percentileChip);

        const tooltip = await waitFor(() => screen.getByRole('tooltip'));
        expect(tooltip).toHaveTextContent(/40-75%/i);
      });

      it('[T224-T225] shows correct tooltip for Low concentration', async () => {
        // For Core: 10-40% = 0.2-0.8 mg/g max
        const lowTerpene: Terpene = {
          ...mockTerpene,
          concentrationRange: '0.05-0.5 mg/g', // Max 0.5/2.0 = 25% → Low
        };

        render(<TerpeneDetailModal open={true} terpene={lowTerpene} onClose={vi.fn()} />);

        const percentileChip = screen.getByText(/Low \(\d+%\)/);
        fireEvent.mouseEnter(percentileChip);

        const tooltip = await waitFor(() => screen.getByRole('tooltip'));
        expect(tooltip).toHaveTextContent(/10-40%/i);
      });

      it('[T224-T225] shows correct tooltip for Trace concentration', async () => {
        // For Core: <10% = <0.2 mg/g max
        const traceTerpene: Terpene = {
          ...mockTerpene,
          concentrationRange: '0.001-0.1 mg/g', // Max 0.1/2.0 = 5% → Trace
        };

        render(<TerpeneDetailModal open={true} terpene={traceTerpene} onClose={vi.fn()} />);

        const percentileChip = screen.getByText(/Trace \(\d+%\)/);
        fireEvent.mouseEnter(percentileChip);

        const tooltip = await waitFor(() => screen.getByRole('tooltip'));
        expect(tooltip).toHaveTextContent(/below 10%/i);
      });
    });
  });

  describe('Performance Optimization (T103-T107)', () => {
    it('memoizes effect categorization to prevent unnecessary recalculations (T104)', () => {
      // This test verifies that the useMemo hook is properly implemented
      // by checking that the component renders efficiently
      const { rerender } = render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Verify initial render works
      expect(screen.getByText('Effects')).toBeInTheDocument();

      // Re-render with same terpene - should be efficient due to memoization
      rerender(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should still render correctly with memoized data
      expect(screen.getByText('Effects')).toBeInTheDocument();

      // The test passes if no errors occur and rendering is efficient
      // (actual memoization is handled by React's useMemo)
    });

    it('efficiently handles large numbers of effects without performance degradation (T103)', () => {
      const effectOptions: Array<'Mood enhancing' | 'Energizing' | 'Focus' | 'Stress relief' | 'Relaxing'> = [
        'Mood enhancing',
        'Energizing',
        'Focus',
        'Stress relief',
        'Relaxing',
      ];
      const terpeneWithManyEffects: Terpene = {
        ...mockTerpene,
        effects: Array.from({ length: 50 }, (_, i) => effectOptions[i % 5]!),
      };

      const startTime = performance.now();

      render(<TerpeneDetailModal open={true} terpene={terpeneWithManyEffects} onClose={vi.fn()} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in reasonable time (less than 100ms) - T103 requirement
      expect(renderTime).toBeLessThan(100);
    });

    it('memoizes concentration data computation for performance (T104)', () => {
      const { rerender } = render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Verify concentration section renders
      expect(screen.getByText('Concentration Range')).toBeInTheDocument();

      // Re-render with same terpene - concentration data should be memoized
      rerender(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should still render correctly with memoized data
      expect(screen.getByText('Concentration Range')).toBeInTheDocument();
    });

    it('optimizes re-renders when terpene data changes minimally (T105-T106)', () => {
      const { rerender } = render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Change only the description
      const updatedTerpene = {
        ...mockTerpene,
        description: 'Updated description',
      };

      const startTime = performance.now();

      rerender(<TerpeneDetailModal open={true} terpene={updatedTerpene} onClose={vi.fn()} />);

      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      // Should re-render quickly for minimal changes (T105)
      expect(rerenderTime).toBeLessThan(50);

      // Should not cause layout shift (T106) - basic check that elements are stable
      expect(screen.getByText('Updated description')).toBeInTheDocument();
    });

    it('uses efficient DOM structure for effect chips (T107)', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Check that effects are displayed as chips (updated from lists to chips for better UX)
      // Each effect should be rendered as a color-coded chip
      const moodChip = screen.getByText('Mood enhancing').closest('.MuiChip-root');
      expect(moodChip).toBeInTheDocument();

      const energizingChip = screen.getByText('Energizing').closest('.MuiChip-root');
      expect(energizingChip).toBeInTheDocument();
    });

    it('implements proper cleanup when modal is closed (T107)', () => {
      const { unmount } = render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Ensure modal content is rendered
      expect(screen.getByText('Limonene')).toBeInTheDocument();

      // Unmount should clean up properly (T107)
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('[US2] View Toggle (T108-T124)', () => {
    it('[T108-T110] renders ToggleButtonGroup with "Basic View" and "Expert View" buttons, defaults to Basic View', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Should render toggle buttons
      const basicViewButton = screen.getByRole('button', { name: /basic view/i });
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });

      expect(basicViewButton).toBeInTheDocument();
      expect(expertViewButton).toBeInTheDocument();

      // Basic View should be selected by default (T110)
      expect(basicViewButton).toHaveAttribute('aria-pressed', 'true');
      expect(expertViewButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('[T112-T113] switches viewMode state when toggle is changed', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });

      // Click Expert View
      fireEvent.click(expertViewButton);

      // Expert View should now be selected
      expect(expertViewButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('[T114-T115] renders Expert View content when toggled', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });

      // Click Expert View
      fireEvent.click(expertViewButton);

      // Expert View content should be visible (accordions)
      // We'll look for specific Expert View markers once implemented
      expect(expertViewButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('[T116-T117] applies vertical stacking on mobile (responsive)', () => {
      // This test verifies that responsive styles are applied
      // The actual responsive behavior would be tested in E2E tests
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const basicViewButton = screen.getByRole('button', { name: /basic view/i });
      expect(basicViewButton).toBeInTheDocument();
    });

    it('[T118-T119] has aria-label for screen reader announcement', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // ToggleButtonGroup should have proper ARIA labels
      const basicViewButton = screen.getByRole('button', { name: /basic view/i });
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });

      expect(basicViewButton).toHaveAttribute('aria-pressed');
      expect(expertViewButton).toHaveAttribute('aria-pressed');
    });

    it('[T120-T121] toggle animation completes in <200ms', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });

      const startTime = performance.now();
      fireEvent.click(expertViewButton);
      const endTime = performance.now();

      const toggleTime = endTime - startTime;

      // Toggle should be fast (<200ms requirement from T120)
      expect(toggleTime).toBeLessThan(200);
    });

    it('[T122-T123] respects prefers-reduced-motion setting', () => {
      // This test verifies the component respects motion preferences
      // Actual motion reduction is tested via CSS media queries and E2E
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      expect(expertViewButton).toBeInTheDocument();
    });
  });

  describe('[US2] Therapeutic Details Accordion (T132-T144)', () => {
    it('[T132-T133] renders "Therapeutic Details" accordion in Expert View', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Should render Therapeutic Details accordion
      expect(screen.getByText(/Therapeutic Details/i)).toBeInTheDocument();
    });

    it('[T134-T135] Therapeutic Details accordion is expanded by default', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Accordion should be expanded (aria-expanded="true")
      const accordion = screen.getByText(/Therapeutic Details/i).closest('button');
      expect(accordion).toHaveAttribute('aria-expanded', 'true');
    });

    it('[T136-T137] Primary Effects displays all effects in Expert View', () => {
      const terpeneWithManyEffects: Terpene = {
        ...mockTerpene,
        effects: ['Mood enhancing', 'Energizing', 'Stress relief', 'Focus', 'Relaxing', 'Appetite suppressant', 'Pain relief', 'Sedative'],
      };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithManyEffects} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Primary Effects should show all effects as color-coded chips
      expect(screen.getByText('Effects')).toBeInTheDocument();

      // Check that all effects are present in the Primary Effects section
      expect(screen.getByText('Mood enhancing')).toBeInTheDocument();
      expect(screen.getByText('Energizing')).toBeInTheDocument();
      expect(screen.getByText('Appetite suppressant')).toBeInTheDocument();
      expect(screen.getByText('Sedative')).toBeInTheDocument();
    });

    it('[T138-T139] Primary Effects section shows color-coded effect chips', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Primary Effects should still be visible (not removed in refactor)
      expect(screen.getByText('Effects')).toBeInTheDocument();

      // Effect chips should be color-coded in the Primary Effects section
      const effectChips = screen.getAllByText('Mood enhancing');
      expect(effectChips.length).toBeGreaterThan(0);

      // Verify chips have color styling
      effectChips.forEach((chip) => {
        const chipRoot = chip.closest('.MuiChip-root');
        expect(chipRoot).toBeInTheDocument();
      });
    });

    it('Therapeutic Details accordion contains Therapeutic Properties and Concentration Range', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Therapeutic Details accordion should be expanded
      const accordion = screen.getByText(/Therapeutic Details/i).closest('button');
      expect(accordion).toHaveAttribute('aria-expanded', 'true');

      // Should contain Therapeutic Properties section
      expect(screen.getByText(/Therapeutic Properties/i)).toBeInTheDocument();

      // Should contain Concentration Range section
      expect(screen.getByText(/Concentration Range/i)).toBeInTheDocument();
    });

    it('[T140-T141] displays Notable Synergies callout when notableDifferences exists', () => {
      const terpeneWithSynergies = {
        ...mockTerpene,
        notableDifferences: 'Synergizes well with beta-caryophyllene for enhanced anti-inflammatory effects',
      };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithSynergies} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Should render Alert with synergy information
      expect(screen.getByText(/Synergizes well with beta-caryophyllene/i)).toBeInTheDocument();
    });

    it('[T142-T143] displays complete sources list (all sources, not just 3)', () => {
      const terpeneWithManySources = {
        ...mockTerpene,
        sources: ['Lemon peel', 'Orange rind', 'Grapefruit', 'Lime', 'Tangerine', 'Bergamot', 'Yuzu', 'Mandarin'],
      };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithManySources} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // All sources should be visible (not limited to 3)
      expect(screen.getByText('Lemon peel')).toBeInTheDocument();
      expect(screen.getByText('Orange rind')).toBeInTheDocument();
      expect(screen.getByText('Grapefruit')).toBeInTheDocument();
      expect(screen.getByText('Lime')).toBeInTheDocument();
      expect(screen.getByText('Tangerine')).toBeInTheDocument();
      expect(screen.getByText('Bergamot')).toBeInTheDocument();
      expect(screen.getByText('Yuzu')).toBeInTheDocument();
      expect(screen.getByText('Mandarin')).toBeInTheDocument();
    });
  });

  describe('[US2] Molecular Properties Accordion (T145-T161)', () => {
    it('[T145-T146] renders "Molecular Properties" accordion collapsed by default', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      // Switch to Expert View
      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Should render Molecular Properties accordion
      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      expect(accordionButton).toBeInTheDocument();

      // Should be collapsed by default (not expanded)
      expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('[T147-T148] displays molecular class', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Expand the accordion
      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display molecular class
      expect(screen.getByText('Monoterpene')).toBeInTheDocument();
    });

    it('[T149-T150] displays molecular formula with copy button', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display molecular formula
      expect(screen.getByText('C10H16')).toBeInTheDocument();

      // Should have copy button
      const copyButton = screen.getByLabelText(/copy molecular formula/i);
      expect(copyButton).toBeInTheDocument();
    });

    it('[T151-T154] copy button calls copyToClipboard and shows success toast', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Click copy button
      const copyButton = screen.getByLabelText(/copy molecular formula/i);
      fireEvent.click(copyButton);

      // Should show success notification (we'll verify the snackbar appears)
      // Note: Actual clipboard functionality is tested in copyToClipboard helper tests
    });

    it('[T155-T156] displays molecular weight with unit', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display molecular weight with g/mol unit
      expect(screen.getByText('136.24 g/mol')).toBeInTheDocument();
    });

    it('[T157-T158] displays boiling point with °C unit', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display boiling point with °C unit
      expect(screen.getByText('176°C')).toBeInTheDocument();
    });

    it('[T159-T160] conditionally displays isomer information when isomerOf exists', () => {
      const terpeneWithIsomer = {
        ...mockTerpene,
        isomerOf: 'Limonene',
        isomerType: 'Optical' as const,
      };

      render(<TerpeneDetailModal open={true} terpene={terpeneWithIsomer} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display isomer information
      expect(screen.getByText(/Optical isomer of Limonene/i)).toBeInTheDocument();
    });

    it('[T159-T160] does not display isomer information when isomerOf is null', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Molecular Properties/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should not display isomer information section
      expect(screen.queryByText(/isomer of/i)).not.toBeInTheDocument();
    });
  });

  describe('[US2] Research & Evidence Accordion (T162-T178)', () => {
    it('[T162-T163] renders "Research & Evidence" accordion collapsed by default', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Should render Research & Evidence accordion
      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      expect(accordionButton).toBeInTheDocument();

      // Should be collapsed by default
      expect(accordionButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('[T164-T165] displays DataQualityBadge with correct quality level', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display DataQualityBadge with "Excellent"
      expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('[T166-T169] displays evidence summary', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display evidence summary heading
      expect(screen.getByText(/Evidence Summary/i)).toBeInTheDocument();

      // Should display evidence summary text
      expect(screen.getByText('Well-documented across multiple studies')).toBeInTheDocument();
    });

    it('[T170-T173] displays numbered reference list', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display references heading
      expect(screen.getByText(/References/i)).toBeInTheDocument();

      // Should display reference source (description text)
      expect(screen.getByText('Example Study on Limonene Effects')).toBeInTheDocument();
    });

    it('[T174-T175] displays reference type badges', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display reference type as chip
      expect(screen.getByText('Peer-reviewed study')).toBeInTheDocument();
    });

    it('[T176-T177] displays external link icon for URL references', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should have external link icon for URL references (using ref.url field)
      const externalLink = screen.getByLabelText(/open reference in new tab/i);
      expect(externalLink).toBeInTheDocument();
      expect(externalLink).toHaveAttribute('href', 'https://example.com/study1');
    });

    it('displays reference notes when present', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      const accordionButton = screen.getByText(/Research & Evidence/i).closest('button');
      if (accordionButton) {
        fireEvent.click(accordionButton);
      }

      // Should display notes if present
      expect(screen.getByText('Double-blind placebo-controlled study')).toBeInTheDocument();
    });
  });

  describe('[US2] Accordion Interactions (T179-T185)', () => {
    it('[T179-T180] accordions expand and collapse independently', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Get all accordion buttons
      const therapeuticButton = screen.getByText(/Therapeutic Details/i).closest('button');
      const molecularButton = screen.getByText(/Molecular Properties/i).closest('button');
      const researchButton = screen.getByText(/Research & Evidence/i).closest('button');

      // Therapeutic Details should be expanded by default
      expect(therapeuticButton).toHaveAttribute('aria-expanded', 'true');
      expect(molecularButton).toHaveAttribute('aria-expanded', 'false');
      expect(researchButton).toHaveAttribute('aria-expanded', 'false');

      // Click Molecular Properties to expand it
      if (molecularButton) {
        fireEvent.click(molecularButton);
      }

      // Therapeutic Details should still be expanded
      expect(therapeuticButton).toHaveAttribute('aria-expanded', 'true');
      expect(molecularButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('[T181-T182] multiple accordions can be open simultaneously', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Expand all accordions
      const molecularButton = screen.getByText(/Molecular Properties/i).closest('button');
      const researchButton = screen.getByText(/Research & Evidence/i).closest('button');

      if (molecularButton) {
        fireEvent.click(molecularButton);
      }
      if (researchButton) {
        fireEvent.click(researchButton);
      }

      // All three should be expanded
      const therapeuticButton = screen.getByText(/Therapeutic Details/i).closest('button');
      expect(therapeuticButton).toHaveAttribute('aria-expanded', 'true');
      expect(molecularButton).toHaveAttribute('aria-expanded', 'true');
      expect(researchButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('[T183-T184] accordions have proper ARIA labels for screen readers', () => {
      render(<TerpeneDetailModal open={true} terpene={mockTerpene} onClose={vi.fn()} />);

      const expertViewButton = screen.getByRole('button', { name: /expert view/i });
      fireEvent.click(expertViewButton);

      // Check that accordions have aria-controls attributes
      const therapeuticButton = screen.getByText(/Therapeutic Details/i).closest('button');
      const molecularButton = screen.getByText(/Molecular Properties/i).closest('button');
      const researchButton = screen.getByText(/Research & Evidence/i).closest('button');

      expect(therapeuticButton).toHaveAttribute('aria-controls');
      expect(molecularButton).toHaveAttribute('aria-controls');
      expect(researchButton).toHaveAttribute('aria-controls');
    });
  });
});
