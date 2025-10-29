import { useState, useEffect, useCallback } from 'react';

import { Terpene } from '@/models/Terpene';
import { TranslatedTerpene, TerpeneTranslation } from '@/models/TerpeneTranslation';
import { TranslationService } from '@/services/translationService';

/**
 * Hook for accessing translated terpene data
 *
 * @param terpeneId - Optional terpene ID to load specific terpene
 * @returns Translation utilities and data
 */
export function useTerpeneTranslation(terpeneId?: string) {
  const [translationService] = useState(() => new TranslationService());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [language, setLanguage] = useState('en');
  const [translatedTerpene, setTranslatedTerpene] = useState<TranslatedTerpene | undefined>(undefined);

  // Initialize the translation service
  useEffect(() => {
    const initService = async () => {
      try {
        setIsLoading(true);
        await translationService.initialize(language);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    initService();
  }, [language, translationService]);

  // If a specific terpene ID is provided, load that terpene
  useEffect(() => {
    if (!terpeneId || isLoading) return;

    let mounted = true;

    (async () => {
      try {
        const terpene = await Promise.resolve(translationService.getTranslatedTerpene(terpeneId, language));
        if (mounted) setTranslatedTerpene(terpene);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [terpeneId, language, isLoading, translationService]);

  const getTerpene = useCallback(
    (id: string): TranslatedTerpene | undefined => {
      if (id === terpeneId) {
        return translatedTerpene;
      }
      try {
        return translationService.getTranslatedTerpene(id, language);
      } catch (err) {
        console.error(`Error getting terpene with ID ${id}:`, err);
        return undefined;
      }
    },
    [terpeneId, translatedTerpene, language, translationService]
  );

  const getAllTerpenes = useCallback((): TranslatedTerpene[] => {
    try {
      return translationService.getAllTranslatedTerpenes(language);
    } catch (err) {
      console.error('Error getting all terpenes:', err);
      return [];
    }
  }, [language, translationService]);

  const getField = useCallback(
    (id: string, field: keyof TerpeneTranslation): string | string[] | undefined => {
      try {
        return translationService.getTranslatedField(id, field, language);
      } catch (err) {
        console.error(`Error getting field ${field} for terpene with ID ${id}:`, err);
        return undefined;
      }
    },
    [language, translationService]
  );

  const isFullyTranslated = useCallback(
    (id: string): boolean => {
      try {
        return translationService.isFullyTranslated(id, language);
      } catch (err) {
        console.error(`Error checking if terpene with ID ${id} is fully translated:`, err);
        return false;
      }
    },
    [language, translationService]
  );

  const getFallbackFields = useCallback(
    (id: string): string[] => {
      try {
        return translationService.getFallbackFields(id, language);
      } catch (err) {
        console.error(`Error getting fallback fields for terpene with ID ${id}:`, err);
        return [];
      }
    },
    [language, translationService]
  );

  const switchLanguage = useCallback(
    async (lang: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        await translationService.switchLanguage(lang);
        setLanguage(lang);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    },
    [translationService]
  );

  const search = useCallback(
    (query: string): TranslatedTerpene[] => {
      try {
        return translationService.search(query, language);
      } catch (err) {
        console.error('Error during search:', err);
        return [];
      }
    },
    [language, translationService]
  );

  const searchFields = useCallback(
    (query: string, fields: Array<keyof Terpene>): TranslatedTerpene[] => {
      try {
        return translationService.searchFields(query, fields, language);
      } catch (err) {
        console.error('Error during field-specific search:', err);
        return [];
      }
    },
    [language, translationService]
  );

  return {
    getTerpene,
    getAllTerpenes,
    getField,
    isFullyTranslated,
    getFallbackFields,
    language,
    switchLanguage,
    isLoading,
    error,
    search,
    searchFields,
  };
}
