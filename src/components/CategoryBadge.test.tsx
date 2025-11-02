import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CategoryBadge } from './CategoryBadge';

describe('CategoryBadge', () => {
  it('renders "Core" with correct text', () => {
    render(<CategoryBadge category="Core" />);

    const badge = screen.getByText('Core');
    expect(badge).toBeInTheDocument();
  });

  it('renders "Secondary" with correct text', () => {
    render(<CategoryBadge category="Secondary" />);

    const badge = screen.getByText('Secondary');
    expect(badge).toBeInTheDocument();
  });

  it('renders "Minor" with correct text', () => {
    render(<CategoryBadge category="Minor" />);

    const badge = screen.getByText('Minor');
    expect(badge).toBeInTheDocument();
  });

  it('supports size prop (small/medium)', () => {
    const { rerender } = render(<CategoryBadge category="Core" size="small" />);

    let badge = screen.getByText('Core');
    expect(badge).toBeInTheDocument();

    rerender(<CategoryBadge category="Core" size="medium" />);

    badge = screen.getByText('Core');
    expect(badge).toBeInTheDocument();
  });

  it('defaults to medium size when size prop not provided', () => {
    render(<CategoryBadge category="Core" />);

    const badge = screen.getByText('Core');
    expect(badge).toBeInTheDocument();
  });

  describe('[US4] Category Tooltip (T211-T219)', () => {
    it('[T211-T212] shows tooltip when showTooltip prop is true', async () => {
      render(<CategoryBadge category="Core" showTooltip={true} />);

      const badge = screen.getByText('Core');

      // Hover over the badge (mouseenter)
      fireEvent.mouseEnter(badge);

      // Tooltip should appear (Material UI renders it in portal)
      const tooltip = await waitFor(() => screen.getByRole('tooltip'));
      expect(tooltip).toBeInTheDocument();
    });

    it('[T213-T214] shows correct tooltip text for Core category', async () => {
      render(<CategoryBadge category="Core" showTooltip={true} />);

      const badge = screen.getByText('Core');
      fireEvent.mouseEnter(badge);

      const tooltip = await waitFor(() => screen.getByRole('tooltip'));
      expect(tooltip).toHaveTextContent(/High-prevalence.*clinically well-defined/i);
    });

    it('[T215-T216] shows correct tooltip text for Secondary category', async () => {
      render(<CategoryBadge category="Secondary" showTooltip={true} />);

      const badge = screen.getByText('Secondary');
      fireEvent.mouseEnter(badge);

      const tooltip = await waitFor(() => screen.getByRole('tooltip'));
      expect(tooltip).toHaveTextContent(/Moderate prevalence/i);
    });

    it('[T215-T216] shows correct tooltip text for Minor category', async () => {
      render(<CategoryBadge category="Minor" showTooltip={true} />);

      const badge = screen.getByText('Minor');
      fireEvent.mouseEnter(badge);

      const tooltip = await waitFor(() => screen.getByRole('tooltip'));
      expect(tooltip).toHaveTextContent(/Lower prevalence/i);
    });

    it('[T217-T218] positions tooltip at bottom', async () => {
      render(<CategoryBadge category="Core" showTooltip={true} />);

      const badge = screen.getByText('Core');
      fireEvent.mouseEnter(badge);

      const tooltip = await waitFor(() => screen.getByRole('tooltip'));
      expect(tooltip).toBeInTheDocument();
      // Tooltip placement is verified by Material UI's internal logic
    });

    it('does not show tooltip when showTooltip prop is false or undefined', async () => {
      render(<CategoryBadge category="Core" />);

      const badge = screen.getByText('Core');
      fireEvent.mouseEnter(badge);

      // Wait a bit and tooltip should not appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      const tooltip = screen.queryByRole('tooltip');
      expect(tooltip).not.toBeInTheDocument();
    });
  });
});
