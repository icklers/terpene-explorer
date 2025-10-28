# Translation Service Contracts

**Feature**: 006-bilingual-data-support  
**Date**: 2025-10-28

## Overview

This document defines the TypeScript interfaces and contracts for the translation service layer that handles bilingual terpene data operations.

## Core Service Interface

### TranslationService

Main service responsible for loading, caching, and retrieving translated terpene data.

```typescript
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
  getTranslatedField(
    terpeneId: string,
    field: keyof TerpeneTranslation,
    language: string
  ): string | string[] | undefined;

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
}
```

## Data Loader Interface

### TranslationLoader

Responsible for loading translation files from disk.

```typescript
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
```

## Search Service Interface

### TranslationSearchService

Handles cross-language search operations.

```typescript
/**
 * Service for cross-language search in terpene data
 */
export interface ITranslationSearchService {
  /**
   * Build search index for all terpenes with translations
   * 
   * @param terpenes - Base terpene data
   * @param translations - Translation data for all languages
   */
  buildSearchIndex(
    terpenes: Terpene[],
    translations: Map<string, Record<string, TerpeneTranslation>>
  ): void;

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
  searchFields(
    query: string,
    fields: Array<keyof Terpene>,
    language: string
  ): TranslatedTerpene[];

  /**
   * Clear search index (for rebuilding)
   */
  clearIndex(): void;
}
```

## React Hook Interfaces

### useTerpeneTranslation

Custom hook for accessing translated terpene data in React components.

```typescript
/**
 * Hook for accessing translated terpene data
 * 
 * @param terpeneId - Optional terpene ID to load specific terpene
 * @returns Translation utilities and data
 */
export function useTerpeneTranslation(terpeneId?: string): {
  /** Get translated terpene by ID */
  getTerpene: (id: string) => TranslatedTerpene | undefined;
  
  /** Get all translated terpenes */
  getAllTerpenes: () => TranslatedTerpene[];
  
  /** Get translated field value with fallback */
  getField: (id: string, field: keyof TerpeneTranslation) => string | string[] | undefined;
  
  /** Check if terpene is fully translated */
  isFullyTranslated: (id: string) => boolean;
  
  /** Get fallback fields for terpene */
  getFallbackFields: (id: string) => string[];
  
  /** Current language */
  language: string;
  
  /** Change language */
  switchLanguage: (lang: string) => Promise<void>;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error state */
  error: Error | null;
};
```

## Component Props Interfaces

### LanguageBadge

Props for the language fallback indicator component.

```typescript
/**
 * Props for LanguageBadge component
 * Displays language indicator for fallback content
 */
export interface LanguageBadgeProps {
  /** Language code to display (e.g., "EN", "DE") */
  language: string;
  
  /** Size variant */
  size?: 'small' | 'medium';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Accessibility label */
  ariaLabel?: string;
}
```

### TranslatedText

Props for wrapper component that handles fallback styling.

```typescript
/**
 * Props for TranslatedText component
 * Wraps text with fallback styling if needed
 */
export interface TranslatedTextProps {
  /** Text content to display */
  children: React.ReactNode;
  
  /** Whether this text is using fallback */
  isFallback: boolean;
  
  /** Fallback language code */
  fallbackLanguage?: string;
  
  /** Typography variant (Material UI) */
  variant?: TypographyProps['variant'];
  
  /** Additional props passed to Typography */
  TypographyProps?: Partial<TypographyProps>;
}
```

## Utility Function Interfaces

### Translation Helpers

```typescript
/**
 * Normalize string for diacritic-insensitive search
 * 
 * @param text - Input text
 * @returns Normalized text (ä→a, ö→o, ü→u, ß→ss)
 */
export function normalizeDiacritics(text: string): string;

/**
 * Merge base terpene with translation data
 * 
 * @param baseTerpene - Base English terpene data
 * @param translation - Translation data (may be partial)
 * @param language - Target language code
 * @returns TranslatedTerpene with merged data and metadata
 */
export function mergeTerpeneTranslation(
  baseTerpene: Terpene,
  translation: TerpeneTranslation | undefined,
  language: string
): TranslatedTerpene;

/**
 * Get translatable field names from Terpene interface
 * 
 * @returns Array of field names that can be translated
 */
export function getTranslatableFields(): Array<keyof TerpeneTranslation>;

/**
 * Check if a field value is an array type
 * 
 * @param field - Field name
 * @returns true if field contains array value
 */
export function isArrayField(field: keyof TerpeneTranslation): boolean;
```

## Type Definitions

### LanguageInfo

```typescript
/**
 * Metadata about a supported language
 */
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isComplete: boolean;
  completionPercentage: number;
}
```

### TranslationLoadResult

```typescript
/**
 * Result of translation loading operation
 */
export interface TranslationLoadResult {
  success: boolean;
  language: string;
  terpeneCount: number;
  error?: Error;
}
```

### TranslationStats

```typescript
/**
 * Statistics about translation completeness
 */
export interface TranslationStats {
  language: string;
  totalTerpenes: number;
  fullyTranslated: number;
  partiallyTranslated: number;
  untranslated: number;
  completionPercentage: number;
}
```

## Error Types

```typescript
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
```

## API Contract Examples

### Example 1: Get Translated Terpene

```typescript
// Request
const translatedTerpene = translationService.getTranslatedTerpene(
  '550e8400-e29b-41d4-a716-446655440001',
  'de'
);

// Response
{
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Limonen', // German
  description: 'Zitrus-Terpen...', // German
  aroma: 'Citrus, Lemon, Orange', // English (fallback)
  effects: ['Stimmungsaufhellend', 'Stressabbau'], // German
  // ... other fields
  translationStatus: {
    language: 'de',
    isFullyTranslated: false,
    fallbackFields: ['aroma']
  }
}
```

### Example 2: Search Across Languages

```typescript
// Request
const results = searchService.search('Zitrone', 'de');

// Response
[
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Limonen',
    // ... matches because "Zitrone" appears in German sources
    translationStatus: { ... }
  }
]
```

### Example 3: React Hook Usage

```tsx
function TerpeneDetailPage({ terpeneId }: Props) {
  const {
    getTerpene,
    isFullyTranslated,
    getFallbackFields,
    language,
    isLoading
  } = useTerpeneTranslation();

  if (isLoading) return <LoadingSpinner />;

  const terpene = getTerpene(terpeneId);
  const fallbackFields = getFallbackFields(terpeneId);

  return (
    <div>
      <h1>{terpene.name}</h1>
      <TranslatedText isFallback={fallbackFields.includes('description')}>
        {terpene.description}
      </TranslatedText>
    </div>
  );
}
```

## Performance Contracts

All service methods must meet these performance requirements:

| Method | Max Execution Time | Notes |
|--------|-------------------|-------|
| `getTranslatedTerpene` | < 1ms | O(1) map lookup |
| `getAllTranslatedTerpenes` | < 50ms | O(n) iteration with merge |
| `search` | < 100ms | O(n) search with early exit |
| `initialize` | < 500ms | Includes file loading and parsing |
| `switchLanguage` | < 500ms | Includes reload and index rebuild |

## Testing Contracts

Each interface must have corresponding test coverage:

- **Unit Tests**: All service methods with mock dependencies
- **Integration Tests**: Service + loader + real translation files
- **E2E Tests**: Full user flows with language switching

Minimum coverage: 80% for all translation service code.
