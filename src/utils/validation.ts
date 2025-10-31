/**
 * Validation utilities using Zod schema
 *
 * Implements graceful validation per FR-015:
 * - Filters out invalid terpene entries
 * - Returns valid entries
 * - Provides warnings about skipped entries
 *
 * @see data-model.md for complete validation rules
 */

import { z } from 'zod';

import type { Terpene } from '../models/Terpene';

/**
 * Zod schema for Terpene validation
 * Enforces all validation rules from data-model.md
 */
export const TerpeneSchema = z.object({
  // UUID v4 format
  id: z.string().uuid('ID must be a valid UUID v4'),

  // Name
  name: z.string().min(1, 'Name must not be empty'),

  // Isomer info
  isomerOf: z.string().nullable(),

  // Isomer type
  isomerType: z.string().nullable(),

  // Category: Core, Secondary, or Minor
  category: z.string().min(1, 'Category must not be empty'),

  // Description
  description: z.string().min(10, 'Description must be at least 10 characters'),

  // Aroma
  aroma: z.string().min(1, 'Aroma must not be empty'),

  // Taste
  taste: z.string().min(1, 'Taste must not be empty'),

  // Effects: array of strings
  effects: z.array(z.string()).min(1, 'Must have at least one effect'),

  // Therapeutic properties
  therapeuticProperties: z.array(z.string()).min(1, 'Must have at least one therapeutic property'),

  // Notable differences
  notableDifferences: z.string().optional(),

  // Concentration range
  concentrationRange: z.string().optional(),

  // Molecular data object
  molecularData: z.object({
    molecularFormula: z.string(),
    molecularWeight: z.number(),
    boilingPoint: z.union([z.number(), z.null()]),
    class: z.string(),
  }),

  // Sources: array of strings
  sources: z.array(z.string()).min(1, 'Must have at least one source'),

  // References
  references: z.array(
    z.object({
      source: z.string(),
      type: z.string(),
    })
  ),

  // Research tier
  researchTier: z.object({
    dataQuality: z.string(),
    evidenceSummary: z.string(),
  }),
});

/**
 * Validation result structure
 * Used by dataLoader to report validation outcomes
 */
export interface ValidationResult {
  /** Array of valid terpenes that passed validation */
  validTerpenes: Terpene[];

  /** Count of invalid entries that were filtered out */
  invalidCount: number;

  /** Array of error messages describing why entries failed validation */
  errors: string[];
}

/**
 * Validates an array of terpene data with graceful degradation
 *
 * Per FR-015: Filters out invalid entries, displays valid ones,
 * and provides warning notifications about skipped entries.
 *
 * @param data - Raw data array from JSON/YAML file
 * @returns ValidationResult with valid terpenes, invalid count, and errors
 *
 * @example
 * const result = validateTerpeneData(rawData);
 * if (result.invalidCount > 0) {
 *   console.warn(`Skipped ${result.invalidCount} invalid entries`);
 * }
 * return result.validTerpenes;
 */
export function validateTerpeneData(data: unknown): ValidationResult {
  // Handle non-array input gracefully
  const rawData = Array.isArray(data) ? data : [];

  const validTerpenes: Terpene[] = [];
  const errors: string[] = [];

  rawData.forEach((item, index) => {
    const result = TerpeneSchema.safeParse(item);

    if (result.success) {
      validTerpenes.push(result.data as Terpene);
    } else {
      // Extract first error message for this entry
      const firstError = result.error.errors[0];
      const errorMessage = firstError
        ? `Entry ${index + 1}: ${firstError.path.join('.')} - ${firstError.message}`
        : `Entry ${index + 1}: Validation failed`;

      errors.push(errorMessage);
    }
  });

  return {
    validTerpenes,
    invalidCount: errors.length,
    errors,
  };
}

/**
 * Validates a single terpene entry
 *
 * @param terpene - Terpene object to validate
 * @returns Validation result with success flag and optional error
 */
export function validateTerpene(terpene: unknown): { success: true; data: Terpene } | { success: false; error: string } {
  const result = TerpeneSchema.safeParse(terpene);

  if (result.success) {
    return { success: true, data: result.data as Terpene };
  } else {
    const firstError = result.error.errors[0];
    const errorMessage = firstError ? `${firstError.path.join('.')}: ${firstError.message}` : 'Validation failed';

    return { success: false, error: errorMessage };
  }
}

/**
 * Type for validated terpene data
 * Ensures type safety after validation
 */
export type ValidatedTerpene = z.infer<typeof TerpeneSchema>;
