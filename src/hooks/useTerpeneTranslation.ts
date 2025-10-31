import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const [translationService] = useState(() => new TranslationService());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [translatedTerpene, setTranslatedTerpene] = useState<TranslatedTerpene | undefined>(undefined);

  // Initialize the translation service with the current i18next language
  useEffect(() => {
    const initService = async () => {
      try {
        setIsLoading(true);
        // Use the current i18next language
        const currentLanguage = i18n.language || 'en';
        await translationService.initialize(currentLanguage);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    initService();
  }, [i18n.language, translationService]);

  // Listen to i18next language changes and update the translation service
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await translationService.switchLanguage(lng);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    // Subscribe to language change events
    i18n.on('languageChanged', handleLanguageChanged);

    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, translationService]);

  // If a specific terpene ID is provided, load that terpene
  useEffect(() => {
    if (!terpeneId || isLoading) return;

    let mounted = true;

    (async () => {
      try {
        const terpene = await Promise.resolve(translationService.getTranslatedTerpene(terpeneId, i18n.language || 'en'));
        if (mounted) setTranslatedTerpene(terpene);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [terpeneId, isLoading, i18n.language, translationService]);

  const getTerpene = useCallback(
    (id: string): TranslatedTerpene | undefined => {
      if (id === terpeneId) {
        return translatedTerpene;
      }
      if (!translationService.isInitialized()) {
        console.warn('TranslationService not initialized. Cannot get terpene.');
        return undefined;
      }
      try {
        return translationService.getTranslatedTerpene(id, i18n.language || 'en');
      } catch (err) {
        console.error(`Error getting terpene with ID ${id}:`, err);
        return undefined;
      }
    },
    [terpeneId, translatedTerpene, i18n.language, translationService]
  );

  const getAllTerpenes = useCallback((): TranslatedTerpene[] => {
    if (!translationService.isInitialized()) {
      console.warn('TranslationService not initialized. Returning empty array.');
      return [];
    }
    try {
      return translationService.getAllTranslatedTerpenes(i18n.language || 'en');
    } catch (err) {
      console.error('Error getting all terpenes:', err);
      return [];
    }
  }, [i18n.language, translationService]);

  const getField = useCallback(
    (id: string, field: keyof TerpeneTranslation): string | string[] | undefined => {
      if (!translationService.isInitialized()) {
        console.warn('TranslationService not initialized. Cannot get field.');
        return undefined;
      }
      try {
        return translationService.getTranslatedField(id, field, i18n.language || 'en');
      } catch (err) {
        console.error(`Error getting field ${field} for terpene with ID ${id}:`, err);
        return undefined;
      }
    },
    [i18n.language, translationService]
  );

  const isFullyTranslated = useCallback(
    (id: string): boolean => {
      if (!translationService.isInitialized()) {
        console.warn('TranslationService not initialized. Cannot check translation status.');
        return false;
      }
      try {
        return translationService.isFullyTranslated(id, i18n.language || 'en');
      } catch (err) {
        console.error(`Error checking if terpene with ID ${id} is fully translated:`, err);
        return false;
      }
    },
    [i18n.language, translationService]
  );

  const getFallbackFields = useCallback(
    (id: string): string[] => {
      if (!translationService.isInitialized()) {
        console.warn('TranslationService not initialized. Cannot get fallback fields.');
        return [];
      }
      try {
        return translationService.getFallbackFields(id, i18n.language || 'en');
      } catch (err) {
        console.error(`Error getting fallback fields for terpene with ID ${id}:`, err);
        return [];
      }
    },
    [i18n.language, translationService]
  );

  const switchLanguage = useCallback(
    async (lang: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        await translationService.switchLanguage(lang);
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
      if (!translationService.isInitialized()) {
        console.warn('TranslationService not initialized. Cannot perform search.');
        return [];
      }
      try {
        return translationService.search(query, i18n.language || 'en');
      } catch (err) {
        console.error('Error during search:', err);
        return [];
      }
    },
    [i18n.language, translationService]
  );

  const searchFields = useCallback(
    (query: string, fields: Array<keyof Terpene>): TranslatedTerpene[] => {
      if (!translationService.isInitialized()) {
        console.warn('TranslationService not initialized. Cannot perform field-specific search.');
        return [];
      }
      try {
        return translationService.searchFields(query, fields, i18n.language || 'en');
      } catch (err) {
        console.error('Error during field-specific search:', err);
        return [];
      }
    },
    [i18n.language, translationService]
  );

  return {
    getTerpene,
    getAllTerpenes,
    getField,
    isFullyTranslated,
    getFallbackFields,
    language: i18n.language || 'en',
    switchLanguage,
    isLoading,
    error,
    search,
    searchFields,
  };
}
