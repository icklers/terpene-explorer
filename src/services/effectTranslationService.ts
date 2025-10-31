/**
 * Effect Translation Service
 *
 * Provides utilities for building properly structured Effect objects with bilingual support.
 * Maintains canonical English effect names for filtering while providing translations for display.
 *
 * @see specs/006-bilingual-data-support
 */

import type { Effect } from '../models/Effect';
import type { Terpene } from '../models/Terpene';

/**
 * Effect translation mapping: canonical English name -> { en, de }
 */
export interface EffectTranslations {
  [canonicalName: string]: {
    en: string;
    de: string;
  };
}

/**
 * Cache for effect translations loaded from terpene-translations-de.json
 */
let effectTranslationsCache: EffectTranslations | null = null;

/**
 * Load effect translations from effect-translations.json
 * This is a central mapping of all effect names to their translations
 *
 * @returns Promise resolving to EffectTranslations mapping
 */
export async function loadEffectTranslations(): Promise<EffectTranslations> {
  // Return cached translations if available
  if (effectTranslationsCache !== null) {
    return effectTranslationsCache;
  }

  try {
    // Load effect translations from dedicated file
    const response = await fetch('/data/effect-translations.json');
    if (!response.ok) {
      console.warn('[EffectTranslation] Failed to load effect translations, using English only');
      return {};
    }

    const data = await response.json();
    const translations: EffectTranslations = data.effects || {};

    effectTranslationsCache = translations;
    return translations;
  } catch (error) {
    console.error('[EffectTranslation] Error loading effect translations:', error);
    return {};
  }
}

/**
 * Build Effect list with proper bilingual support
 * Extracts unique effects from base terpenes (English canonical names) and applies translations
 *
 * @param baseTerpenes - Array of base terpenes with English effect names
 * @param effectTranslations - Optional pre-loaded effect translations (if not provided, will use cache or return English-only)
 * @returns Array of Effect objects with canonical names and bilingual displayNames
 */
export function buildEffectsList(baseTerpenes: Terpene[], effectTranslations?: EffectTranslations): Effect[] {
  const translations = effectTranslations || effectTranslationsCache || {};

  // Count effects from base terpenes (canonical English names)
  const effectCounts = new Map<string, number>();
  baseTerpenes.forEach((terpene) => {
    terpene.effects.forEach((effect) => {
      effectCounts.set(effect, (effectCounts.get(effect) || 0) + 1);
    });
  });

  // Build Effect objects with canonical names and translations
  return Array.from(effectCounts.entries())
    .map(([canonicalName, count]) => {
      const translation = translations[canonicalName] || { en: canonicalName, de: canonicalName };

      // Get category color from theme palette (will be applied in component)
      // Using a default color here - actual color comes from theme
      // Note: getCategoryForEffect(canonicalName) is used by components to derive category and color
      const color = '#4caf50'; // Default primary green

      return {
        name: canonicalName, // Canonical English name for filter matching
        displayName: {
          en: translation.en,
          de: translation.de,
        },
        color,
        terpeneCount: count,
        // Note: Category is implicitly derived via getCategoryForEffect(name)
      } satisfies Effect;
    })
    .sort((a, b) => a.displayName.en.localeCompare(b.displayName.en));
}

/**
 * Get translation for a specific effect
 *
 * @param canonicalName - Canonical English effect name
 * @param language - Target language ('en' or 'de')
 * @returns Translated effect name or canonical name if translation not found
 */
export function getEffectTranslation(canonicalName: string, language: 'en' | 'de'): string {
  const translations = effectTranslationsCache || {};
  const translation = translations[canonicalName];

  if (!translation) {
    return canonicalName;
  }

  return translation[language] || canonicalName;
}

/**
 * Clear the effect translations cache (useful for testing)
 */
export function clearEffectTranslationsCache(): void {
  effectTranslationsCache = null;
}
