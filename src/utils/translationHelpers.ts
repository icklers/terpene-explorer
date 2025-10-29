import { TerpeneTranslation, TranslatedTerpene } from '@/models/TerpeneTranslation';
import { Terpene } from '@/types/terpene';


/**
 * Normalize string for diacritic-insensitive search
 * 
 * @param text - Input text
 * @returns Normalized text (ä→a, ö→o, ü→u, ß→ss)
 */
export function normalizeDiacritics(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .replace(/ß/g, 'ss') // Special case for German ß
    .replace(/ae/g, 'ä') // In some cases, replace common combinations
    .replace(/oe/g, 'ö')
    .replace(/ue/g, 'ü');
}

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
): TranslatedTerpene {
  // If no translation, return base data with fallback metadata
  if (!translation) {
    return {
      ...baseTerpene,
      translationStatus: {
        language,
        isFullyTranslated: false,
        fallbackFields: getTranslatableFields()
      }
    };
  }

  // Start with base terpene data
  const result: Partial<TranslatedTerpene> = { ...baseTerpene };
  const fallbackFields: string[] = [];

  // List of translatable fields to check
  const translatableFields = getTranslatableFields();

  // Merge each translatable field
  for (const field of translatableFields) {
    // Use the translated value if available, otherwise use the base value
    if (translation[field] !== undefined) {
      (result as any)[field] = translation[field];
    } else {
      // Mark this field as using fallback
      fallbackFields.push(field);
    }
  }

  // Calculate if translation is complete
  const isFullyTranslated = fallbackFields.length === 0;

  // Return the merged result with translation metadata
  return {
    ...(result as Terpene),
    translationStatus: {
      language,
      isFullyTranslated,
      fallbackFields
    }
  };
}

/**
 * Get translatable field names from Terpene interface
 * 
 * @returns Array of field names that can be translated
 */
export function getTranslatableFields(): Array<keyof TerpeneTranslation> {
  return [
    'name',
    'description',
    'aroma',
    'taste',
    'effects',
    'therapeuticProperties',
    'sources',
    'notableDifferences'
  ];
}

/**
 * Check if a field value is an array type
 * 
 * @param field - Field name
 * @returns true if field contains array value
 */
export function isArrayField(field: keyof TerpeneTranslation): boolean {
  const arrayFields: Array<keyof TerpeneTranslation> = [
    'effects',
    'therapeuticProperties',
    'sources'
  ];
  
  return arrayFields.includes(field);
}