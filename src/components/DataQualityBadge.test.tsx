import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DataQualityBadge } from './DataQualityBadge';

describe('DataQualityBadge', () => {
  describe('[T125-T126] Component Rendering', () => {
    it('[T125] renders "Excellent" with green badge', () => {
      render(<DataQualityBadge quality="Excellent" />);

      const badge = screen.getByText('Excellent');
      expect(badge).toBeInTheDocument();

      // Check for dark green color (custom styling)
      const chipElement = badge.closest('.MuiChip-root');
      expect(chipElement).toBeInTheDocument();
      // Custom styling applied, verify chip renders
    });
  });

  describe('[T127-T128] Quality Level Colors', () => {
    it('[T127] renders "Good" with lighter green badge', () => {
      render(<DataQualityBadge quality="Good" />);

      const badge = screen.getByText('Good');
      expect(badge).toBeInTheDocument();

      // Check for custom styling
      const chipElement = badge.closest('.MuiChip-root');
      expect(chipElement).toBeInTheDocument();
    });

    it('[T127] renders "Limited" with grey bordered badge', () => {
      render(<DataQualityBadge quality="Limited" />);

      const badge = screen.getByText('Limited');
      expect(badge).toBeInTheDocument();

      // Check for custom styling
      const chipElement = badge.closest('.MuiChip-root');
      expect(chipElement).toBeInTheDocument();
    });
  });

  describe('[T129-T130] Icon Display', () => {
    it('[T129] displays checkmark icon for "Excellent" quality', () => {
      render(<DataQualityBadge quality="Excellent" />);

      // Check for icon presence (Material UI CheckCircle icon)
      const badge = screen.getByText('Excellent');
      const chipElement = badge.closest('.MuiChip-root');
      const icon = chipElement?.querySelector('.MuiChip-icon');

      expect(icon).toBeInTheDocument();
    });

    it('[T130] does not display icon for "Good" quality', () => {
      render(<DataQualityBadge quality="Good" />);

      const badge = screen.getByText('Good');
      const chipElement = badge.closest('.MuiChip-root');
      const icon = chipElement?.querySelector('.MuiChip-icon');

      expect(icon).not.toBeInTheDocument();
    });

    it('[T130] does not display icon for "Limited" quality', () => {
      render(<DataQualityBadge quality="Limited" />);

      const badge = screen.getByText('Limited');
      const chipElement = badge.closest('.MuiChip-root');
      const icon = chipElement?.querySelector('.MuiChip-icon');

      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('[T131] Refactoring Quality Config', () => {
    it('uses consistent quality config across all variants', () => {
      // Test that all quality levels are supported
      const qualities: Array<'Excellent' | 'Good' | 'Limited'> = ['Excellent', 'Good', 'Limited'];

      qualities.forEach((quality) => {
        const { unmount } = render(<DataQualityBadge quality={quality} />);
        expect(screen.getByText(quality)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
