/**
 * useTerpeneData Hook
 *
 * Custom hook for loading and managing terpene data.
 * Extracts unique effects with metadata and provides retry functionality.
 *
 * @see tasks.md T046
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadTerpeneData } from '../services/dataLoader';
import { getEffectMetadata } from '../services/colorService';
import type { Terpene } from '../models/Terpene';
import type { Effect } from '../models/Effect';

/**
 * Hook return type
 */
export interface UseTerpeneDataResult {
  terpenes: Terpene[];
  effects: Effect[];
  isLoading: boolean;
  error: Error | null;
  warnings: string[] | null;
  retry: () => void;
}

/**
 * Custom hook for loading terpene data
 *
 * @param dataPath - Optional custom path to data file
 * @returns Terpene data, effects, loading state, error, and retry function
 */
export function useTerpeneData(
  dataPath: string = '/data/terpenes.json'
): UseTerpeneDataResult {
  const [terpenes, setTerpenes] = useState<Terpene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [warnings, setWarnings] = useState<string[] | null>(null);

  // Load data function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loadTerpeneData(dataPath);

      if (result.status === 'success') {
        setTerpenes(result.data);
        setWarnings(result.warnings || null);
        setError(null);
      } else {
        setTerpenes([]);
        setError(result.error);
        setWarnings(null);
      }
    } catch (err) {
      setTerpenes([]);
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
      setWarnings(null);
    } finally {
      setIsLoading(false);
    }
  }, [dataPath]);

  // Load data on mount and when dataPath changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Retry function
  const retry = useCallback(() => {
    loadData();
  }, [loadData]);

  // Extract unique effects with metadata
  const effects = useMemo(() => {
    if (terpenes.length === 0) {
      return [];
    }

    // Count terpenes for each effect
    const effectCounts = new Map<string, number>();

    terpenes.forEach((terpene) => {
      terpene.effects.forEach((effect) => {
        effectCounts.set(effect, (effectCounts.get(effect) || 0) + 1);
      });
    });

    // Create effect objects with metadata
    const effectsArray: Effect[] = [];

    effectCounts.forEach((count, effectName) => {
      const metadata = getEffectMetadata(effectName, count);
      effectsArray.push(metadata);
    });

    // Sort by name for consistency
    return effectsArray.sort((a, b) => a.name.localeCompare(b.name));
  }, [terpenes]);

  return {
    terpenes,
    effects,
    isLoading,
    error,
    warnings,
    retry,
  };
}
