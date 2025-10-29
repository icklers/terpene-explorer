/**
 * useTerpeneData Hook
 *
 * Custom hook for loading and managing terpene data.
 * Extracts unique effects with metadata and provides retry functionality.
 * Updated to integrate with translation service for bilingual support.
 *
 * @see tasks.md T046
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

import { useTerpeneTranslation } from './useTerpeneTranslation';
import type { Effect } from '../models/Effect';
import { TranslatedTerpene } from '../models/TerpeneTranslation';
import { getEffectMetadata } from '../services/colorService';
import { loadTerpeneData } from '../services/dataLoader';

/**
 * Hook return type
 */
export interface UseTerpeneDataResult {
  terpenes: TranslatedTerpene[]; // Updated to use translated terpenes
  effects: Effect[];
  isLoading: boolean;
  error: Error | null;
  warnings: string[] | null;
  retry: () => void;
  language: string;
  switchLanguage: (lang: string) => Promise<void>;
}

/**
 * Custom hook for loading terpene data with translation support
 *
 * @param dataPath - Optional custom path to data file
 * @returns Terpene data, effects, loading state, error, language controls and retry function
 */
export function useTerpeneData(dataPath: string = '/data/terpene-database.json'): UseTerpeneDataResult {
  // Use the translation hook to get translated data
  const { 
    getAllTerpenes, 
    isLoading, 
    error, 
    language, 
    switchLanguage 
  } = useTerpeneTranslation();
  
  const [warnings, setWarnings] = useState<string[] | null>(null);

  // Load data function from the old implementation
  const loadData = useCallback(async () => {
    try {
      const result = await loadTerpeneData(dataPath);
      
      if (result.status === 'error') {
        setWarnings(null);
        return;
      }

      setWarnings(result.warnings || null);
    } catch (error) {
      console.warn('[TerpeneData] Failed to load warnings:', error);
      setWarnings(null);
    }
  }, [dataPath]);

  // Load data on mount and when dataPath changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get the translated terpenes
  const terpenes = getAllTerpenes();

  // Extract unique effects with metadata - now using translated terpenes
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

  // Retry function - just reloads the data
  const retry = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    terpenes,
    effects,
    isLoading,
    error: error,
    warnings,
    retry,
    language,
    switchLanguage,
  };
}
