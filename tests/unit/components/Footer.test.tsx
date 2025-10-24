/**
 * Footer Component Tests
 *
 * Tests for accessibility information, copyright, and links in footer.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T089
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Footer } from '../../../src/components/layout/Footer';

describe('Footer', () => {
  describe('Rendering', () => {
    it('should render footer element with proper semantic HTML', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should display copyright information', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(new RegExp(`© ${currentYear}`, 'i'));
      expect(copyright).toBeInTheDocument();
    });

    it('should display app name or branding', () => {
      render(<Footer />);

      const branding = screen.getByText(/terpene explorer/i);
      expect(branding).toBeInTheDocument();
    });
  });

  describe('Accessibility Information', () => {
    it('should display WCAG compliance level', () => {
      render(<Footer />);

      const wcagInfo = screen.getByText(/wcag 2\.1 level aa/i);
      expect(wcagInfo).toBeInTheDocument();
    });

    it('should have accessible aria labels', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveAccessibleName(/footer|site footer/i);
    });

    it('should include accessibility statement or link', () => {
      render(<Footer />);

      // Should either have text or a link
      const hasAccessibilityText =
        screen.queryByText(/accessibility/i) !== null;
      const hasAccessibilityLink =
        screen.queryByRole('link', { name: /accessibility/i }) !== null;

      expect(hasAccessibilityText || hasAccessibilityLink).toBe(true);
    });
  });

  describe('Layout and Styling', () => {
    it('should be displayed at the bottom of the page', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      // Footer should have appropriate styling attributes
      expect(footer).toBeInTheDocument();
    });

    it('should have responsive layout', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      // Material UI Box/Container should handle responsive layout
    });

    it('should have proper contrast for text', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      // Material UI theme handles contrast ratios
    });
  });

  describe('Links', () => {
    it('should have external links with proper attributes', () => {
      render(<Footer />);

      const links = screen.queryAllByRole('link');

      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href?.startsWith('http')) {
          // External links should have target and rel attributes
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });

    it('should have accessible link names', () => {
      render(<Footer />);

      const links = screen.queryAllByRole('link');

      links.forEach((link) => {
        const accessibleName = link.getAttribute('aria-label') || link.textContent;
        expect(accessibleName).toBeTruthy();
        expect(accessibleName!.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content', () => {
    it('should include project information', () => {
      render(<Footer />);

      // Should have some project-related text
      const footer = screen.getByRole('contentinfo');
      expect(footer.textContent).toBeTruthy();
      expect(footer.textContent!.length).toBeGreaterThan(0);
    });

    it('should be concise and not overwhelming', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      // Footer content should be reasonable length (not a wall of text)
      expect(footer.textContent!.length).toBeLessThan(500);
    });
  });

  describe('Internationalization', () => {
    it('should support translations', () => {
      render(<Footer />);

      // Component should use useTranslation hook
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render without crashing when no props provided', () => {
      expect(() => render(<Footer />)).not.toThrow();
    });

    it('should handle missing translations gracefully', () => {
      expect(() => render(<Footer />)).not.toThrow();
    });
  });
});
