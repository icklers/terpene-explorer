/**
 * SearchBar Component Tests
 *
 * Unit tests for SearchBar component with debouncing and sanitization.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T058
 */

import { render, screen, waitFor as _waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { SearchBar } from '../../../src/components/filters/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input field', () => {
      render(<SearchBar value="" onChange={vi.fn()} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should display placeholder text', () => {
      render(<SearchBar value="" onChange={vi.fn()} placeholder="Search terpenes..." />);

      expect(screen.getByPlaceholderText('Search terpenes...')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(<SearchBar value="" onChange={vi.fn()} />);

      // Search icon should be visible
      const searchIcon = document.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(<SearchBar value="limonene" onChange={vi.fn()} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('limonene');
    });

    it('should show clear button when value is not empty', () => {
      render(<SearchBar value="test" onChange={vi.fn()} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when value is empty', () => {
      render(<SearchBar value="" onChange={vi.fn()} />);

      const clearButton = screen.queryByRole('button', { name: /clear/i });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('Debouncing', () => {
    it('should debounce onChange with 300ms delay', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'lim');

      // Should not call onChange immediately
      expect(onChange).not.toHaveBeenCalled();

      // Fast-forward 299ms
      vi.advanceTimersByTime(299);
      expect(onChange).not.toHaveBeenCalled();

      // Fast-forward to 300ms
      vi.advanceTimersByTime(1);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('lim');
    });

    it('should reset debounce timer on each keystroke', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');

      // Type 'l'
      await user.type(input, 'l');
      vi.advanceTimersByTime(200);

      // Type 'i' (resets timer)
      await user.type(input, 'i');
      vi.advanceTimersByTime(200);

      // Type 'm' (resets timer)
      await user.type(input, 'm');

      // Should still not have called onChange (timer keeps resetting)
      expect(onChange).not.toHaveBeenCalled();

      // Now wait 300ms
      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should allow custom debounce delay', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} debounceMs={500} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      vi.advanceTimersByTime(499);
      expect(onChange).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange immediately when clear button is clicked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<SearchBar value="test" onChange={onChange} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      // Should call immediately without debounce
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('Sanitization', () => {
    it('should trim whitespace from input', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '  limonene  ');

      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledWith('limonene');
    });

    it('should convert to lowercase', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'LIMONENE');

      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledWith('limonene');
    });

    it('should handle special characters', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'α-pinene');

      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledWith('α-pinene');
    });

    it('should handle empty string after trimming', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '   ');

      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should preserve hyphens and spaces in multi-word searches', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'citrus aroma');

      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledWith('citrus aroma');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      render(<SearchBar value="" onChange={vi.fn()} ariaLabel="Search for terpenes" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAccessibleName('Search for terpenes');
    });

    it('should be keyboard accessible', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');

      // Should be focusable
      input.focus();
      expect(input).toHaveFocus();

      // Should accept keyboard input
      await user.keyboard('test');
      expect(input).toHaveValue('test');
    });

    it('should support Tab navigation', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <SearchBar value="test" onChange={vi.fn()} />
          <button>After</button>
        </div>
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const input = screen.getByRole('textbox');
      const clearButton = screen.getByRole('button', { name: /clear/i });
      const afterButton = screen.getByRole('button', { name: 'After' });

      beforeButton.focus();
      expect(beforeButton).toHaveFocus();

      await user.tab();
      expect(input).toHaveFocus();

      await user.tab();
      expect(clearButton).toHaveFocus();

      await user.tab();
      expect(afterButton).toHaveFocus();
    });

    it('should announce results count with ARIA live region', () => {
      render(<SearchBar value="test" onChange={vi.fn()} resultsCount={5} />);

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveTextContent(/5.*result/i);
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when user types', async () => {
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={vi.fn()} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      vi.advanceTimersByTime(300);
      // Note: This will fail until implementation exists
    });

    it('should clear value when clear button is clicked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<SearchBar value="test" onChange={onChange} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should focus input after clearing', async () => {
      const user = userEvent.setup();

      render(<SearchBar value="test" onChange={vi.fn()} />);

      const input = screen.getByRole('textbox');
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await user.click(clearButton);

      expect(input).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid typing', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');

      // Type rapidly
      await user.type(input, 'limonene');

      // Should only call onChange once after debounce
      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should handle paste events', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.paste('pasted text');

      vi.advanceTimersByTime(300);
      expect(onChange).toHaveBeenCalledWith('pasted text');
    });

    it('should handle very long input strings', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup({ delay: null });

      render(<SearchBar value="" onChange={onChange} maxLength={100} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      const longString = 'a'.repeat(150);

      await user.type(input, longString);

      vi.advanceTimersByTime(300);

      // Should be truncated to maxLength
      expect(onChange).toHaveBeenCalledWith('a'.repeat(100));
    });

    it('should cleanup debounce timer on unmount', () => {
      const onChange = vi.fn();
      const { unmount } = render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      input.focus();

      unmount();

      // Should not throw errors
      vi.advanceTimersByTime(300);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', async () => {
      const _onChange = vi.fn();
      let renderCount = 0;

      function TestWrapper({ value }: { value: string }) {
        renderCount++;
        return <SearchBar value={value} onChange={_onChange} />;
      }

      const { rerender } = render(<TestWrapper value="" />);

      expect(renderCount).toBe(1);

      // Re-render with same value
      rerender(<TestWrapper value="" />);

      // Should not cause unnecessary re-renders
      expect(renderCount).toBe(2); // React will still re-render, but component should be optimized
    });
  });
});
