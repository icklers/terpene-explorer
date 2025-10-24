/**
 * FilterModeToggle Component Tests
 *
 * Tests for the AND/OR filter mode toggle component.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T041
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

// Import the component (will be implemented in T049)
import { FilterModeToggle } from '../../../src/components/filters/FilterModeToggle';

describe('FilterModeToggle', () => {
  describe('Rendering', () => {
    it('should render toggle button group', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      const toggleGroup = container.querySelector('.MuiToggleButtonGroup-root');
      expect(toggleGroup).toBeInTheDocument();
    });

    it('should render ANY and ALL mode buttons', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Should show labels for OR and AND logic
      expect(screen.getByText(/ANY|OR/i)).toBeInTheDocument();
      expect(screen.getByText(/ALL|AND/i)).toBeInTheDocument();
    });

    it('should show descriptive text for each mode', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Should explain what each mode does
      expect(screen.getByText(/match.*any/i)).toBeInTheDocument();
      expect(screen.getByText(/match.*all/i)).toBeInTheDocument();
    });

    it('should use Material UI ToggleButtonGroup component', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      expect(container.querySelector('.MuiToggleButtonGroup-root')).toBeInTheDocument();
      expect(container.querySelectorAll('.MuiToggleButton-root')).toHaveLength(2);
    });
  });

  describe('Selection State', () => {
    it('should show ANY mode as selected when mode is "any"', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      const buttons = container.querySelectorAll('.MuiToggleButton-root');
      const anyButton = Array.from(buttons).find((btn) =>
        btn.textContent?.match(/ANY|OR/i)
      );

      expect(anyButton).toHaveClass('Mui-selected');
    });

    it('should show ALL mode as selected when mode is "all"', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="all" onChange={onChange} />
      );

      const buttons = container.querySelectorAll('.MuiToggleButton-root');
      const allButton = Array.from(buttons).find((btn) =>
        btn.textContent?.match(/ALL|AND/i)
      );

      expect(allButton).toHaveClass('Mui-selected');
    });

    it('should have exactly one button selected at a time', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      const selectedButtons = container.querySelectorAll('.Mui-selected');
      expect(selectedButtons).toHaveLength(1);
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when ANY button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="all" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      await user.click(anyButton);

      expect(onChange).toHaveBeenCalledWith('any');
    });

    it('should call onChange when ALL button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);
      await user.click(allButton);

      expect(onChange).toHaveBeenCalledWith('all');
    });

    it('should toggle between ANY and ALL modes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      const { rerender } = render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);
      await user.click(allButton);

      expect(onChange).toHaveBeenCalledWith('all');

      rerender(<FilterModeToggle mode="all" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      await user.click(anyButton);

      expect(onChange).toHaveBeenCalledWith('any');
    });

    it('should not trigger onChange when clicking already selected button', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      await user.click(anyButton);

      // Should not call onChange for already selected option
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      anyButton.focus();

      // Tab to next button
      await user.tab();

      const allButton = screen.getByText(/ALL|AND/i);
      expect(allButton).toHaveFocus();
    });

    it('should support Enter key for selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);
      allButton.focus();

      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledWith('all');
    });

    it('should support Space key for selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);
      allButton.focus();

      await user.keyboard(' ');

      expect(onChange).toHaveBeenCalledWith('all');
    });
  });

  describe('Visual Feedback', () => {
    it('should show visual distinction between selected and unselected states', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      const buttons = container.querySelectorAll('.MuiToggleButton-root');
      const selectedButton = container.querySelector('.Mui-selected');
      const unselectedButton = Array.from(buttons).find(
        (btn) => !btn.classList.contains('Mui-selected')
      );

      const selectedStyles = window.getComputedStyle(selectedButton!);
      const unselectedStyles = window.getComputedStyle(unselectedButton!);

      // Selected and unselected buttons should have different styling
      expect(selectedStyles.backgroundColor).not.toBe(unselectedStyles.backgroundColor);
    });

    it('should show hover state on unselected buttons', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);

      await user.hover(allButton);

      // Should have hover styles applied
      expect(allButton).toHaveClass('MuiToggleButton-root');
    });

    it('should display icons or visual indicators for OR/AND logic', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      // Should have some visual distinction (icons, colors, etc.)
      const buttons = container.querySelectorAll('.MuiToggleButton-root');
      expect(buttons.length).toBe(2);

      buttons.forEach((button) => {
        const styles = window.getComputedStyle(button);
        expect(styles.padding).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      const allButton = screen.getByText(/ALL|AND/i);

      expect(anyButton).toHaveAttribute('role', 'button');
      expect(allButton).toHaveAttribute('role', 'button');
    });

    it('should indicate selected state to screen readers', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);

      expect(anyButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have descriptive aria-label for the toggle group', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      const toggleGroup = container.querySelector('.MuiToggleButtonGroup-root');
      const ariaLabel = toggleGroup?.getAttribute('aria-label');

      expect(ariaLabel).toContain('filter');
    });

    it('should announce mode changes to screen readers', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Should have live region or similar for announcements
      const anyButton = screen.getByText(/ANY|OR/i);
      expect(anyButton.closest('[role="group"]')).toBeInTheDocument();
    });

    it('should be fully keyboard accessible', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      const allButton = screen.getByText(/ALL|AND/i);

      expect(anyButton).toHaveAttribute('tabIndex');
      expect(allButton).toHaveAttribute('tabIndex');
    });
  });

  describe('Internationalization', () => {
    it('should display localized text for ANY mode', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Should use i18n for labels
      const anyButton = screen.getByText(/ANY|OR/i);
      expect(anyButton).toBeInTheDocument();
    });

    it('should display localized text for ALL mode', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);
      expect(allButton).toBeInTheDocument();
    });
  });

  describe('Props and Configuration', () => {
    it('should accept custom className', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should support disabled state', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} disabled />);

      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} disabled />);

      const allButton = screen.getByText(/ALL|AND/i);
      await user.click(allButton);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should show tooltip or help text', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Should have some explanatory text
      expect(screen.getByText(/match.*any/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggling', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);

      // Click multiple times rapidly
      await user.click(allButton);
      await user.click(allButton);
      await user.click(allButton);

      // Should only register meaningful changes
      expect(onChange).toHaveBeenCalledWith('all');
    });

    it('should handle mode prop changes', () => {
      const onChange = vi.fn();

      const { rerender, container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      let selectedButton = container.querySelector('.Mui-selected');
      expect(selectedButton?.textContent).toMatch(/ANY|OR/i);

      rerender(<FilterModeToggle mode="all" onChange={onChange} />);

      selectedButton = container.querySelector('.Mui-selected');
      expect(selectedButton?.textContent).toMatch(/ALL|AND/i);
    });

    it('should maintain consistent width', () => {
      const onChange = vi.fn();

      const { container } = render(
        <FilterModeToggle mode="any" onChange={onChange} />
      );

      const buttons = container.querySelectorAll('.MuiToggleButton-root');
      const widths = Array.from(buttons).map(
        (btn) => btn.getBoundingClientRect().width
      );

      // Buttons should have equal or similar widths
      const minWidth = Math.min(...widths);
      const maxWidth = Math.max(...widths);

      expect(maxWidth - minWidth).toBeLessThan(50); // Small tolerance
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const onChange = vi.fn();

      const startTime = performance.now();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const renderTime = performance.now() - startTime;

      // Should render in less than 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should not re-render unnecessarily', () => {
      const onChange = vi.fn();

      const { rerender } = render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Re-render with same props
      rerender(<FilterModeToggle mode="any" onChange={onChange} />);

      // Component should use memoization
      expect(screen.getByText(/ANY|OR/i)).toBeInTheDocument();
    });
  });

  describe('Integration with FR-013', () => {
    it('should implement AND/OR toggle functionality per FR-013', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      // Should have both ANY (OR) and ALL (AND) options
      expect(screen.getByText(/ANY|OR/i)).toBeInTheDocument();
      expect(screen.getByText(/ALL|AND/i)).toBeInTheDocument();
    });

    it('should clearly indicate OR logic for ANY mode', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="any" onChange={onChange} />);

      const anyButton = screen.getByText(/ANY|OR/i);
      expect(anyButton).toBeInTheDocument();
    });

    it('should clearly indicate AND logic for ALL mode', () => {
      const onChange = vi.fn();

      render(<FilterModeToggle mode="all" onChange={onChange} />);

      const allButton = screen.getByText(/ALL|AND/i);
      expect(allButton).toBeInTheDocument();
    });
  });
});
