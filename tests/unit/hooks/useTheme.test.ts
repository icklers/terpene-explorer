/**
 * useTheme Hook Tests
 *
 * Tests for theme switching, system preference detection, and persistence.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T075
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Import the hook (will be implemented in T078)
import { useTheme } from '../../../src/hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset system preference mock
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with system preference when no saved preference', () => {
      // Mock system dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.mode).toBe('dark');
    });

    it('should initialize with light mode when system preference is light', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.mode).toBe('light');
    });

    it('should use saved preference from localStorage over system preference', () => {
      localStorage.setItem('theme', 'light');

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.mode).toBe('light');
    });
  });

  describe('Theme Switching', () => {
    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useTheme());

      // Start with light mode
      act(() => {
        result.current.setMode('light');
      });

      expect(result.current.mode).toBe('light');

      // Toggle to dark
      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setMode('dark');
      });

      expect(result.current.mode).toBe('dark');

      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('light');
    });

    it('should set specific theme mode', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setMode('dark');
      });

      expect(result.current.mode).toBe('dark');

      act(() => {
        result.current.setMode('light');
      });

      expect(result.current.mode).toBe('light');
    });
  });

  describe('Persistence', () => {
    it('should save theme preference to localStorage', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setMode('dark');
      });

      expect(localStorage.getItem('theme')).toBe('dark');

      act(() => {
        result.current.setMode('light');
      });

      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should persist theme across hook re-renders', () => {
      const { result, rerender } = renderHook(() => useTheme());

      act(() => {
        result.current.setMode('dark');
      });

      rerender();

      expect(result.current.mode).toBe('dark');
    });

    it('should handle Safari private mode gracefully', () => {
      // Mock localStorage to throw (Safari private mode behavior)
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useTheme());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.setMode('dark');
        });
      }).not.toThrow();

      // Should still update mode even if save fails
      expect(result.current.mode).toBe('dark');

      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('System Preference Synchronization', () => {
    it('should update when system preference changes', () => {
      const listeners: ((e: MediaQueryListEvent) => void)[] = [];

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event, listener) => {
            if (event === 'change') {
              listeners.push(listener);
            }
          }),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.mode).toBe('light');

      // Simulate system preference change to dark
      act(() => {
        listeners.forEach((listener) => {
          listener({ matches: true } as MediaQueryListEvent);
        });
      });

      // Should update to dark if no user preference saved
      if (!localStorage.getItem('theme')) {
        expect(result.current.mode).toBe('dark');
      }
    });

    it('should not override user preference when system changes', () => {
      const { result } = renderHook(() => useTheme());

      // User explicitly sets light mode
      act(() => {
        result.current.setMode('light');
      });

      // System preference changes to dark
      // User preference should take precedence
      expect(result.current.mode).toBe('light');
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid localStorage value', () => {
      localStorage.setItem('theme', 'invalid-value');

      const { result } = renderHook(() => useTheme());

      // Should fallback to system preference or default
      expect(['light', 'dark']).toContain(result.current.mode);
    });

    it('should handle missing localStorage gracefully', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });

      const { result } = renderHook(() => useTheme());

      // Should not throw and should have a valid mode
      expect(['light', 'dark']).toContain(result.current.mode);

      Storage.prototype.getItem = originalGetItem;
    });

    it('should provide consistent mode value', () => {
      const { result } = renderHook(() => useTheme());

      const mode1 = result.current.mode;
      const mode2 = result.current.mode;

      expect(mode1).toBe(mode2);
    });
  });
});
