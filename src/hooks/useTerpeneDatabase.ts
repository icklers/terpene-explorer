/**
 * useTerpeneDatabase Hook
 *
 * Custom hook for loading terpene data through the translation service.
 * Provides access to translated terpene data with fallback to English.
 *
 * This hook now uses the translation system to provide locale-appropriate data.
 * For the legacy data loader, see useTerpeneData.ts.
 *
 * @see specs/002-terpene-data-model/contracts/data-service.md
 */

import { useCallback } from 'react';

import { useTerpeneTranslation } from './useTerpeneTranslation';
import type { UseTerpeneDataResult } from '../types/terpene';

/**
 * Custom React hook for loading and managing terpene data through the translation service
 *
 * @returns Object containing terpenes, loading state, error, and reload function
 *
 * @example
 * function TerpeneTable() {
 *   const { terpenes, loading, error, reload } = useTerpeneDatabase();
 *
 *   if (loading) return <CircularProgress />;
 *   if (error) return <ErrorBoundary error={error} onRetry={reload} />;
 *
 *   return <Table data={terpenes} />;
 * }
 */
export function useTerpeneDatabase(): UseTerpeneDataResult {
  const { getAllTerpenes, isLoading, error, language, switchLanguage } = useTerpeneTranslation();

  // Get the current translated terpenes
  const terpenes = getAllTerpenes();

  // Reload function - just call switchLanguage with the current language to trigger refresh
  const reload = useCallback(async () => {
    try {
      await switchLanguage(language);
    } catch (err) {
      console.error('Error during reload:', err);
    }
  }, [language, switchLanguage]);

  return { terpenes, loading: isLoading, error, reload };
}
