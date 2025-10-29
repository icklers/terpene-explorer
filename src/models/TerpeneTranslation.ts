

/**
 * Translation data for a single terpene
 * All fields are optional to support partial translations
 */
export interface TerpeneTranslation {
  name?: string;
  description?: string;
  aroma?: string;
  taste?: string;
  effects?: string[];
  therapeuticProperties?: string[];
  sources?: string[];
  notableDifferences?: string;
}

/**
 * Structure of a translation file (e.g., terpene-translations-de.json)
 */
export interface TranslationFile {
  language: string;
  version: string;
  terpenes: Record<string, TerpeneTranslation>;
}

/**
 * Translation status metadata for a terpene
 */
export interface TranslationStatus {
  language: string;
  isFullyTranslated: boolean;
  fallbackFields: string[];
}

// Import necessary dependencies
import { z } from 'zod';

// Zod schema for TerpeneTranslation
export const TerpeneTranslationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  aroma: z.string().min(1).max(100).optional(),
  taste: z.string().min(1).max(200).optional(),
  effects: z.array(z.string().min(1).max(100)).min(1).max(10).optional(),
  therapeuticProperties: z.array(z.string().min(1).max(100)).min(1).max(20).optional(),
  sources: z.array(z.string().min(1).max(100)).min(1).max(20).optional(),
  notableDifferences: z.string().min(1).max(500).optional(),
});

// Zod schema for TranslationFile
export const TranslationFileSchema = z.object({
  language: z.string().regex(/^[a-z]{2}$/, 'Must be ISO 639-1 language code'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be semantic version'),
  terpenes: z.record(
    z.string().uuid('Terpene ID must be valid UUID'),
    TerpeneTranslationSchema
  ).refine((terpenes) => Object.keys(terpenes).length > 0, {
    message: 'At least one translation data entry required',
  }),
});

// TranslatedTerpene interface extending the base Terpene interface with translation metadata
// Using the canonical schema-based Terpene type to ensure compatibility
import { Terpene } from '@/types/terpene';

export interface TranslatedTerpene extends Terpene {
  translationStatus: TranslationStatus;
}

