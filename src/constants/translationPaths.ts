/**
 * Constants for translation file paths
 */

export const TRANSLATION_PATHS = {
  BASE_DATA: '/data/terpene-database.json',
  TRANSLATION_PATTERN: '/data/terpene-translations-{lang}.json',
  GERMAN_TRANSLATION: '/data/terpene-translations-de.json',
} as const;

export type LanguageCode = 'en' | 'de';