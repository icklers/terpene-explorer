/**
 * useLocalStorage Hook
 *
 * Generic hook for localStorage CRUD operations with Safari private mode fallback.
 * Supports synchronization across hook instances and browser tabs.
 *
 * @see tasks.md T079
 */

import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Safely parse JSON from localStorage
 *
 * @param value - Raw value from localStorage
 * @param initialValue - Fallback value
 * @returns Parsed value or initial value
 */
function safeParseJSON<T>(value: string | null, initialValue: T): T {
  if (!value) {
    return initialValue;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return initialValue;
  }
}

/**
 * Safely read from localStorage
 *
 * @param key - Storage key
 * @param initialValue - Fallback value
 * @returns Stored value or initial value
 */
function safeGetItem<T>(key: string, initialValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return safeParseJSON(item, initialValue);
  } catch {
    return initialValue;
  }
}

/**
 * Safely write to localStorage
 *
 * @param key - Storage key
 * @param value - Value to store
 */
function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Safari private mode or quota exceeded - fail silently
  }
}

/**
 * Safely remove from localStorage
 *
 * @param key - Storage key
 */
function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Safari private mode - fail silently
  }
}

/**
 * useLocalStorage hook
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if no stored value exists
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  // Initialize state with stored value or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return safeGetItem(key, initialValue);
  });

  /**
   * Set value in state and localStorage
   */
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value: SetStateAction<T>) => {
      setStoredValue((prev) => {
        // Handle function updates
        const valueToStore = value instanceof Function ? value(prev) : value;

        // Save to localStorage
        safeSetItem(key, valueToStore);

        return valueToStore;
      });
    },
    [key]
  );

  /**
   * Remove value from state and localStorage
   */
  const removeValue = useCallback(() => {
    safeRemoveItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  /**
   * Listen for storage events from other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only update if the changed key matches our key
      if (e.key === key && e.storageArea === localStorage) {
        if (e.newValue === null) {
          // Key was removed
          setStoredValue(initialValue);
        } else {
          // Key was updated
          setStoredValue(safeParseJSON(e.newValue, initialValue));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
