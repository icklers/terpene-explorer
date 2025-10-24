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

  // Name: 1-100 characters
  name: z.string().min(1, 'Name must not be empty').max(100, 'Name must not exceed 100 characters'),

  // Description: 10-1000 characters
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must not exceed 1000 characters'),

  // Aroma: 1-100 characters
  aroma: z.string().min(1, 'Aroma must not be empty').max(100, 'Aroma must not exceed 100 characters'),

  // Effects: 1-10 effect names
  effects: z.array(z.string()).min(1, 'Must have at least one effect').max(10, 'Cannot have more than 10 effects'),

  // Sources: 1-20 source names
  sources: z.array(z.string()).min(1, 'Must have at least one source').max(20, 'Cannot have more than 20 sources'),

  // Optional: Boiling point (-200 to 300 Celsius)
  boilingPoint: z.number().min(-200, 'Boiling point must be at least -200°C').max(300, 'Boiling point must not exceed 300°C').optional(),

  // Optional: Molecular formula pattern
  molecularFormula: z
    .string()
    .regex(/^[A-Z][a-z]?\d*/, 'Molecular formula must match chemical formula pattern (e.g., C10H16)')
    .optional(),
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
