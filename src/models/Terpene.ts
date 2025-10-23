/**
 * Terpene Entity
 *
 * Represents a single terpene compound with its properties, effects, and sources.
 * This interface defines the structure of terpene data throughout the application.
 *
 * @see data-model.md for complete validation rules and constraints
 */
export interface Terpene {
  /**
   * Unique identifier for the terpene
   * @format UUID v4
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;

  /**
   * Display name of the terpene
   * @minLength 1
   * @maxLength 100
   * @example "Limonene"
   */
  name: string;

  /**
   * Detailed description of the terpene and its properties
   * @minLength 10
   * @maxLength 1000
   */
  description: string;

  /**
   * Characteristic aroma profile
   * @minLength 1
   * @maxLength 100
   * @example "Citrus, Lemon, Fresh"
   */
  aroma: string;

  /**
   * Array of effect names associated with this terpene
   * References Effect entity by name
   * @minItems 1
   * @maxItems 10
   * @example ["calming", "anxiolytic", "sedative"]
   */
  effects: string[];

  /**
   * Natural sources where this terpene can be found
   * @minItems 1
   * @maxItems 20
   * @example ["Lemon peel", "Orange rind", "Grapefruit"]
   */
  sources: string[];

  /**
   * Boiling point in Celsius (optional)
   * @minimum -200
   * @maximum 300
   * @example 176
   */
  boilingPoint?: number;

  /**
   * Chemical molecular formula (optional)
   * @pattern ^[A-Z][a-z]?\\d*
   * @example "C10H16"
   */
  molecularFormula?: string;
}

/**
 * Type guard to check if an object is a valid Terpene
 * Note: This is a runtime check for basic structure only.
 * For full validation, use the Zod schema in utils/validation.ts
 */
export function isTerpene(obj: unknown): obj is Terpene {
  if (!obj || typeof obj !== 'object') return false;

  const t = obj as Record<string, unknown>;

  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    typeof t.description === 'string' &&
    typeof t.aroma === 'string' &&
    Array.isArray(t.effects) &&
    t.effects.every((e) => typeof e === 'string') &&
    Array.isArray(t.sources) &&
    t.sources.every((s) => typeof s === 'string')
  );
}
