/**
 * Data Loader Service
 *
 * Handles loading and parsing terpene data from JSON/YAML files.
 * Integrates validation with graceful error handling per FR-015.
 *
 * @see data-model.md for data transformation pipeline
 */

import { load as loadYaml } from 'js-yaml';

import type { Terpene } from '../models/Terpene';
import { validateTerpeneData, type ValidationResult } from '../utils/validation';

/**
 * Load result discriminated union
 * Provides type-safe handling of success/error states
 */
export type LoadResult =
  | {
      status: 'success';
      data: Terpene[];
      warnings?: string[];
    }
  | {
      status: 'error';
      error: Error;
    };

/**
 * Loads and validates terpene data from JSON or YAML file
 *
 * Data transformation pipeline (per data-model.md):
 * 1. Load raw data from file
 * 2. Parse JSON/YAML
 * 3. Validate schema (Zod)
 * 4. Filter out invalid entries (graceful degradation)
 * 5. Return valid entries with warnings
 *
 * @param filePath - Path to data file (JSON or YAML)
 * @returns LoadResult with validated terpene data or error
 *
 * @example
 * const result = await loadTerpeneData('/data/terpenes.json');
 * if (result.status === 'success') {
 *   console.log(`Loaded ${result.data.length} terpenes`);
 *   if (result.warnings) {
 *     result.warnings.forEach(w => console.warn(w));
 *   }
 * }
 */
export async function loadTerpeneData(filePath: string): Promise<LoadResult> {
  try {
    // Step 1: Fetch the file
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Unable to load terpene data. Please check that the file exists at ${filePath}.`);
    }

    const rawText = await response.text();

    // Step 2: Parse based on file extension
    const isYaml = filePath.endsWith('.yaml') || filePath.endsWith('.yml');
    let rawData: unknown;

    try {
      if (isYaml) {
        rawData = loadYaml(rawText);
      } else {
        rawData = JSON.parse(rawText);
      }
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';

      throw new Error(`Data format is invalid. ${isYaml ? 'YAML' : 'JSON'} parsing failed: ${errorMessage}`);
    }

    // Handle the nested structure in the terpene database
    let terpeneData: unknown;
    if (typeof rawData === 'object' && rawData !== null && 'terpene_database_schema' in rawData) {
      const schemaData = (rawData as any).terpene_database_schema;
      if (schemaData && 'entries' in schemaData) {
        terpeneData = schemaData.entries;
      } else {
        terpeneData = rawData;
      }
    } else {
      terpeneData = rawData;
    }

    // Step 3-4: Validate and filter
    const validationResult: ValidationResult = validateTerpeneData(terpeneData);

    // Step 5: Return with warnings if any entries were skipped
    const warnings: string[] = [];

    if (validationResult.invalidCount > 0) {
      warnings.push(
        `${validationResult.invalidCount} terpene ${
          validationResult.invalidCount === 1 ? 'entry was' : 'entries were'
        } skipped due to invalid data.`
      );

      // Optionally include detailed errors in development mode
      if (import.meta.env.DEV) {
        warnings.push(...validationResult.errors.slice(0, 5)); // Limit to first 5 errors
        if (validationResult.errors.length > 5) {
          warnings.push(`... and ${validationResult.errors.length - 5} more errors`);
        }
      }
    }

    return {
      status: 'success',
      data: validationResult.validTerpenes,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    // Convert any error to user-friendly Error object
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while loading terpene data.';

    return {
      status: 'error',
      error: new Error(errorMessage),
    };
  }
}

/**
 * Loads terpene data with fallback logic
 *
 * Attempts to load from primary file, falls back to alternative if it fails.
 * Useful for trying both JSON and YAML formats.
 *
 * @param primaryPath - Primary data file path
 * @param fallbackPath - Fallback data file path
 * @returns LoadResult from whichever file succeeds first
 *
 * @example
 * const result = await loadWithFallback(
 *   '/data/terpenes.json',
 *   '/data/terpenes.yaml'
 * );
 */
export async function loadWithFallback(primaryPath: string, fallbackPath: string): Promise<LoadResult> {
  const primaryResult = await loadTerpeneData(primaryPath);

  if (primaryResult.status === 'success') {
    return primaryResult;
  }

  console.warn(`Primary data source failed, trying fallback: ${fallbackPath}`);

  return await loadTerpeneData(fallbackPath);
}

/**
 * Preloads terpene data and caches it
 *
 * Can be used for eager loading during app initialization
 * to improve perceived performance.
 *
 * @param filePath - Path to data file
 * @returns Promise that resolves when data is loaded
 */
export async function preloadTerpeneData(filePath: string): Promise<void> {
  await loadTerpeneData(filePath);
  // In a real implementation, this would cache the result
  // For now, it just triggers the load
}
