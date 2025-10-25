/**
 * useTerpeneDatabase Hook
 *
 * Custom hook for loading terpene data from the new terpene-database.json.
 * Uses Zod validation and provides type-safe access to terpene data.
 *
 * This hook is specifically for the enhanced data model (002-terpene-data-model).
 * For the legacy data loader, see useTerpeneData.ts.
 *
 * @see specs/002-terpene-data-model/contracts/data-service.md
 */

import { useState, useEffect, useCallback } from 'react';
import { loadTerpeneDatabase } from '../services/terpeneData';
import type { Terpene, UseTerpeneDataResult } from '../types/terpene';

/**
 * Custom React hook for loading and managing terpene data from terpene-database.json
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
  const [terpenes, setTerpenes] = useState<Terpene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadTerpeneDatabase();
      setTerpenes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { terpenes, loading, error, reload: load };
}
