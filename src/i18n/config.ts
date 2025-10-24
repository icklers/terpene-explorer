/**
 * i18next Configuration
 *
 * Configures internationalization with language detection and resource loading.
 * Supports English (en) and German (de) per FR-007, FR-008.
 *
 * @see data-model.md for i18n strategy
 */

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
import deTranslations from './locales/de.json';
import enTranslations from './locales/en.json';

/**
 * Initialize i18next with configuration
 */
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Resources
    resources: {
      en: {
        translation: enTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },

    // Language settings
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],

    // Detection options
    detection: {
      // Order of language detection methods
      order: [
        'localStorage',      // Check localStorage first (FR-014)
        'navigator',         // Then browser language
        'htmlTag',           // Then HTML lang attribute
      ],

      // Cache user language preference
      caches: ['localStorage'],

      // localStorage key
      lookupLocalStorage: 'terpene-map-language',
    },

    // React options
    react: {
      // Use Suspense for loading translations
      useSuspense: true,
    },

    // Interpolation
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },

    // Development options
    debug: import.meta.env.DEV,

    // Load all namespaces at once
    load: 'languageOnly',

    // Key separator
    keySeparator: '.',

    // Namespace separator
    nsSeparator: ':',
  });

export default i18n;

/**
 * Helper function to change language programmatically
 *
 * @param lng - Language code ('en' or 'de')
 * @returns Promise that resolves when language is changed
 */
export async function changeLanguage(lng: 'en' | 'de'): Promise<void> {
  await i18n.changeLanguage(lng);
}

/**
 * Get current language
 *
 * @returns Current language code
 */
export function getCurrentLanguage(): 'en' | 'de' {
  const lang = i18n.language;
  return lang === 'de' ? 'de' : 'en';
}

/**
 * Translation key type for type safety
 */
export type TranslationKey = keyof typeof enTranslations;
