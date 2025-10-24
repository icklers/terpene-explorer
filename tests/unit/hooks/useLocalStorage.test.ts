/**
 * useLocalStorage Hook Tests
 *
 * Tests for localStorage CRUD operations, Safari private mode fallback, and edge cases.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T076
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Import the hook (will be implemented in T079)
import { useLocalStorage } from '../../../src/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial Value', () => {
    it('should return initial value when key does not exist', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('default');
    });

    it('should return stored value when key exists', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('stored-value');
    });

    it('should handle complex objects as initial value', () => {
      const defaultValue = { theme: 'dark', language: 'en' };
      const { result } = renderHook(() => useLocalStorage('preferences', defaultValue));

      expect(result.current[0]).toEqual(defaultValue);
    });

    it('should handle arrays as initial value', () => {
      const defaultValue = ['item1', 'item2', 'item3'];
      const { result } = renderHook(() => useLocalStorage('items', defaultValue));

      expect(result.current[0]).toEqual(defaultValue);
    });

    it('should handle null as initial value', () => {
      const { result } = renderHook(() => useLocalStorage('nullable', null));

      expect(result.current[0]).toBeNull();
    });

    it('should handle undefined as initial value', () => {
      const { result } = renderHook(() => useLocalStorage<string | undefined>('optional', undefined));

      expect(result.current[0]).toBeUndefined();
    });
  });

  describe('Setting Values', () => {
    it('should update value and save to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated');
    });

    it('should handle function updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(6);
    });

    it('should update complex objects', () => {
      const initial = { name: 'John', age: 30 };
      const { result } = renderHook(() => useLocalStorage('user', initial));

      act(() => {
        result.current[1]({ name: 'Jane', age: 25 });
      });

      expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual({ name: 'Jane', age: 25 });
    });

    it('should update arrays', () => {
      const { result } = renderHook(() => useLocalStorage('list', [1, 2, 3]));

      act(() => {
        result.current[1]([4, 5, 6]);
      });

      expect(result.current[0]).toEqual([4, 5, 6]);
    });
  });

  describe('Removing Values', () => {
    it('should remove value and clear from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('value'));

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('default');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should handle remove when key does not exist', () => {
      const { result } = renderHook(() => useLocalStorage('nonexistent', 'default'));

      expect(() => {
        act(() => {
          result.current[2]();
        });
      }).not.toThrow();

      expect(result.current[0]).toBe('default');
    });
  });

  describe('Safari Private Mode Fallback', () => {
    it('should handle localStorage.setItem throwing QuotaExceededError', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      expect(() => {
        act(() => {
          result.current[1]('updated');
        });
      }).not.toThrow();

      // Value should still update in state even if localStorage fails
      expect(result.current[0]).toBe('updated');

      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle localStorage.getItem throwing', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('Access denied');
      });

      const { result } = renderHook(() => useLocalStorage('test', 'fallback'));

      // Should not throw and should use initial value
      expect(result.current[0]).toBe('fallback');

      Storage.prototype.getItem = originalGetItem;
    });

    it('should handle localStorage.removeItem throwing', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = vi.fn(() => {
        throw new Error('Access denied');
      });

      const { result } = renderHook(() => useLocalStorage('test', 'default'));

      expect(() => {
        act(() => {
          result.current[2]();
        });
      }).not.toThrow();

      Storage.prototype.removeItem = originalRemoveItem;
    });
  });

  describe('JSON Parsing', () => {
    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem('corrupted', '{invalid json}');

      const { result } = renderHook(() => useLocalStorage('corrupted', 'default'));

      // Should fall back to initial value when JSON is invalid
      expect(result.current[0]).toBe('default');
    });

    it('should handle empty string in localStorage', () => {
      localStorage.setItem('empty', '');

      const { result } = renderHook(() => useLocalStorage('empty', 'default'));

      expect(result.current[0]).toBe('default');
    });

    it('should correctly serialize and deserialize booleans', () => {
      const { result } = renderHook(() => useLocalStorage('flag', false));

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
      expect(JSON.parse(localStorage.getItem('flag')!)).toBe(true);
    });

    it('should correctly serialize and deserialize numbers', () => {
      const { result } = renderHook(() => useLocalStorage('count', 0));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
      expect(JSON.parse(localStorage.getItem('count')!)).toBe(42);
    });
  });

  describe('Synchronization Across Hook Instances', () => {
    it('should keep multiple instances with same key in sync', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('shared', 'initial'));
      const { result: result2 } = renderHook(() => useLocalStorage('shared', 'initial'));

      act(() => {
        result1.current[1]('updated');
      });

      // Both instances should have updated value
      expect(result1.current[0]).toBe('updated');
      expect(result2.current[0]).toBe('updated');
    });

    it('should handle storage events from other tabs', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      // Simulate storage event from another tab
      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test',
            newValue: JSON.stringify('from-other-tab'),
            oldValue: JSON.stringify('initial'),
            storageArea: localStorage,
          })
        );
      });

      expect(result.current[0]).toBe('from-other-tab');
    });

    it('should ignore storage events for different keys', () => {
      const { result } = renderHook(() => useLocalStorage('key1', 'value1'));

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'key2',
            newValue: JSON.stringify('value2'),
            oldValue: null,
            storageArea: localStorage,
          })
        );
      });

      // Value should remain unchanged
      expect(result.current[0]).toBe('value1');
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      const { result, rerender } = renderHook(() => {
        renderCount++;
        return useLocalStorage('test', 'initial');
      });

      const initialCount = renderCount;

      // Setting to same value should not cause re-render
      act(() => {
        result.current[1]('initial');
      });

      expect(renderCount).toBe(initialCount + 1); // Only one re-render for the set action
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should maintain type safety for string values', () => {
      const { result } = renderHook(() => useLocalStorage<string>('str', 'test'));

      expect(typeof result.current[0]).toBe('string');
    });

    it('should maintain type safety for object values', () => {
      interface User {
        name: string;
        age: number;
      }

      const { result } = renderHook(() =>
        useLocalStorage<User>('user', { name: 'John', age: 30 })
      );

      expect(result.current[0]).toHaveProperty('name');
      expect(result.current[0]).toHaveProperty('age');
    });
  });
});
