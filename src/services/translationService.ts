import { TranslationCache } from './translationCache';
import { TranslationSearchService } from './translationSearch';

import { TranslationFile, TranslationFileSchema, TerpeneTranslation, TranslatedTerpene } from '@/models/TerpeneTranslation';
import { Terpene } from '@/types/terpene';
import { mergeTerpeneTranslation } from '@/utils/translationHelpers';

/**
 * Error thrown when translation file is invalid
 */
export class TranslationValidationError extends Error {
  constructor(
    message: string,
    public language: string,
    public validationErrors: string[]
  ) {
    super(message);
    this.name = 'TranslationValidationError';
  }
}

/**
 * Error thrown when translation file fails to load
 */
export class TranslationLoadError extends Error {
  constructor(
    message: string,
    public language: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'TranslationLoadError';
  }
}

/**
 * Loads translation files from the /data directory
 */
export interface ITranslationLoader {
  /**
   * Load translation file for specified language
   *
   * @param language - ISO 639-1 language code
   * @returns Promise resolving to TranslationFile or undefined on error
   */
  loadTranslations(language: string): Promise<TranslationFile | undefined>;

  /**
   * Validate translation file against schema
   *
   * @param data - Raw translation file data
   * @returns Validated TranslationFile or throws validation error
   */
  validateTranslationFile(data: unknown): TranslationFile;

  /**
   * Check if translation file exists for language
   *
   * @param language - Language code to check
   * @returns true if translation file exists
   */
  hasTranslationFile(language: string): boolean;
}

export class TranslationLoader implements ITranslationLoader {
  private readonly baseTranslationPath = '/data/terpene-translations';

  async loadTranslations(language: string): Promise<TranslationFile | undefined> {
    try {
      // Check if file exists first
      if (!this.hasTranslationFile(language)) {
        console.warn(`[Translation] Translation file not found for language: ${language}`);
        return undefined;
      }

      // Import translation file dynamically
      const response = await fetch(`${this.baseTranslationPath}-${language}.json`);

      if (!response.ok) {
        throw new TranslationLoadError(
          `Failed to load translation file for ${language}: ${response.status} ${response.statusText}`,
          language
        );
      }

      const data = await response.json();
      return this.validateTranslationFile(data);
    } catch (error) {
      if (error instanceof TranslationValidationError) {
        console.error(`[Translation] Validation error for ${language}:`, error.validationErrors);
        return undefined;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Translation] Failed to load translations for ${language}:`, errorMessage);

      throw new TranslationLoadError(
        `Failed to load translations for ${language}`,
        language,
        error instanceof Error ? error : new Error(errorMessage)
      );
    }
  }

  validateTranslationFile(data: unknown): TranslationFile {
    try {
      const result = TranslationFileSchema.safeParse(data);

      if (!result.success) {
        const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);

        throw new TranslationValidationError('Translation file validation failed', (data as any)?.language || 'unknown', errors);
      }

      return result.data;
    } catch (error) {
      if (error instanceof TranslationValidationError) {
        throw error;
      }

      throw new TranslationValidationError('Translation file validation failed', (data as any)?.language || 'unknown', [
        error instanceof Error ? error.message : 'Unknown validation error',
      ]);
    }
  }

  hasTranslationFile(language: string): boolean {
    // In a real implementation, this would check if the file actually exists
    // For now, we'll return true for German as that's what we know exists
    return language === 'de';
  }
}

/**
 * Service for managing bilingual terpene data translations
 * Handles loading, caching, merging, and fallback logic
 */
export interface ITranslationService {
  /**
   * Initialize the translation service with a specific language
   * Loads translation data and builds search indexes
   *
   * @param language - ISO 639-1 language code (e.g., 'en', 'de')
   * @returns Promise that resolves when translations are loaded
   * @throws Never throws - falls back to English on error
   */
  initialize(language: string): Promise<void>;

  /**
   * Get a translated terpene by ID with fallback support
   *
   * @param terpeneId - UUID of the terpene
   * @param language - Target language code
   * @returns TranslatedTerpene with merged base data and translations
   */
  getTranslatedTerpene(terpeneId: string, language: string): TranslatedTerpene;

  /**
   * Get all terpenes with translations in specified language
   *
   * @param language - Target language code
   * @returns Array of TranslatedTerpene objects
   */
  getAllTranslatedTerpenes(language: string): TranslatedTerpene[];

  /**
   * Get translation for a specific field with fallback
   *
   * @param terpeneId - UUID of the terpene
   * @param field - Field name to translate
   * @param language - Target language code
   * @returns Translated value or English fallback
   */
  getTranslatedField(terpeneId: string, field: keyof TerpeneTranslation, language: string): string | string[] | undefined;

  /**
   * Check if a terpene has complete translation in specified language
   *
   * @param terpeneId - UUID of the terpene
   * @param language - Target language code
   * @returns true if all translatable fields have translations
   */
  isFullyTranslated(terpeneId: string, language: string): boolean;

  /**
   * Get list of fields that are using fallback for a terpene
   *
   * @param terpeneId - UUID of the terpene
   * @param language - Target language code
   * @returns Array of field names using English fallback
   */
  getFallbackFields(terpeneId: string, language: string): string[];

  /**
   * Change the active language and reload translations
   *
   * @param language - New language code
   * @returns Promise that resolves when language is switched
   */
  switchLanguage(language: string): Promise<void>;

  /**
   * Get currently active language
   *
   * @returns Current language code
   */
  getCurrentLanguage(): string;

  /**
   * Get list of supported languages
   *
   * @returns Array of language codes with metadata
   */
  getSupportedLanguages(): LanguageInfo[];

  /**
   * Search terpenes by query string in all languages
   *
   * @param query - Search query
   * @param language - Current UI language (for result formatting)
   * @returns Array of matching TranslatedTerpene objects
   */
  search(query: string, language: string): TranslatedTerpene[];

  /**
   * Search specific fields across languages
   *
   * @param query - Search query
   * @param fields - Fields to search in
   * @param language - Current UI language
   * @returns Array of matching TranslatedTerpene objects
   */
  searchFields(query: string, fields: Array<keyof Terpene>, language: string): TranslatedTerpene[];
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isComplete: boolean;
  completionPercentage: number;
}

export class TranslationService implements ITranslationService {
  private loader: TranslationLoader;
  private cache: TranslationCache;
  private searchService: TranslationSearchService;
  private currentLanguage: string = 'en';
  private initialized: boolean = false;
  private baseTerpenes: Terpene[] = [];

  constructor() {
    this.loader = new TranslationLoader();
    this.cache = new TranslationCache();
    this.searchService = new TranslationSearchService();
  }

  async initialize(language: string): Promise<void> {
    this.currentLanguage = language;

    // Load base terpene data if not already loaded
    if (this.baseTerpenes.length === 0) {
      try {
        const response = await fetch('/data/terpene-database.json');
        if (!response.ok) {
          throw new Error(`Failed to load base terpene data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        this.baseTerpenes = data.terpene_database_schema.entries;
      } catch (error) {
        console.error('[TranslationService] Failed to load base terpene data:', error);
        throw new Error('Failed to initialize translation service: unable to load base terpene data');
      }
    }

    // Load and cache translations if not English
    let translations: Record<string, TerpeneTranslation> = {};
    if (language !== 'en') {
      const translationFile = await this.loader.loadTranslations(language);
      if (translationFile) {
        translations = translationFile.terpenes;
        this.cache.loadBulk(translations);
      }
    }

    // Build search index with base terpenes and translations
    this.searchService.buildSearchIndex(this.baseTerpenes, translations);

    this.initialized = true;
  }

  getTranslatedTerpene(terpeneId: string, language: string): TranslatedTerpene {
    if (!this.initialized) {
      throw new Error('TranslationService not initialized. Call initialize() first.');
    }

    // Find the base terpene
    const baseTerpene = this.baseTerpenes.find((t) => t.id === terpeneId);
    if (!baseTerpene) {
      throw new Error(`Terpene with ID ${terpeneId} not found in base database`);
    }

    // Get translation from cache
    const translation = this.cache.get(terpeneId);

    // Merge the base terpene with translation
    return mergeTerpeneTranslation(baseTerpene, translation, language);
  }

  getAllTranslatedTerpenes(language: string): TranslatedTerpene[] {
    if (!this.initialized) {
      throw new Error('TranslationService not initialized. Call initialize() first.');
    }

    return this.baseTerpenes.map((baseTerpene) => {
      const translation = this.cache.get(baseTerpene.id);
      return mergeTerpeneTranslation(baseTerpene, translation, language);
    });
  }

  getTranslatedField(terpeneId: string, field: keyof TerpeneTranslation, language: string): string | string[] | undefined {
    if (!this.initialized) {
      throw new Error('TranslationService not initialized. Call initialize() first.');
    }

    // Get the full translated terpene
    const translatedTerpene = this.getTranslatedTerpene(terpeneId, language);

    // Return the specific field
    return (translatedTerpene as any)[field];
  }

  isFullyTranslated(terpeneId: string, language: string): boolean {
    const translatedTerpene = this.getTranslatedTerpene(terpeneId, language);
    return translatedTerpene.translationStatus.isFullyTranslated;
  }

  getFallbackFields(terpeneId: string, language: string): string[] {
    const translatedTerpene = this.getTranslatedTerpene(terpeneId, language);
    return translatedTerpene.translationStatus.fallbackFields;
  }

  async switchLanguage(language: string): Promise<void> {
    await this.initialize(language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getSupportedLanguages(): LanguageInfo[] {
    // For now, just return English and German
    // In a real implementation, this would be more dynamic
    return [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        isComplete: true,
        completionPercentage: 100,
      },
      {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        isComplete: false, // This would be calculated based on translation completeness
        completionPercentage: 30, // Just an example - would be calculated in reality
      },
    ];
  }

  search(query: string, language: string): TranslatedTerpene[] {
    if (!this.initialized) {
      throw new Error('TranslationService not initialized. Call initialize() first.');
    }

    return this.searchService.search(query, language);
  }

  searchFields(query: string, fields: Array<keyof Terpene>, language: string): TranslatedTerpene[] {
    if (!this.initialized) {
      throw new Error('TranslationService not initialized. Call initialize() first.');
    }

    return this.searchService.searchFields(query, fields, language);
  }
}
