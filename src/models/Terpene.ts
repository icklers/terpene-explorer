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
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  id: string;

  /**
   * Primary terpene name including optical or structural designation
   * @example "Limonene", "α-Bisabolol"
   */
  name: string;

  /**
   * If the compound is an isomer variant, specify its parent compound
   * @example "Limonene", null
   */
  isomerOf: string | null;

  /**
   * Type of isomerism - 'Optical', 'Positional', 'Structural', or null if not relevant
   * @example "Optical", "Positional", null
   */
  isomerType: string | null;

  /**
   * Categorization tier: 'Core', 'Secondary', or 'Minor'
   * @example "Core", "Secondary", "Minor"
   */
  category: string;

  /**
   * Detailed description of the terpene and its properties
   */
  description: string;

  /**
   * Characteristic aroma profile as comma-separated descriptors
   * @example "Citrus, Lemon, Orange"
   */
  aroma: string;

  /**
   * Flavor descriptors relevant to cultivar taste expression
   * @example "Bright citrus with slight sweetness"
   */
  taste: string;

  /**
   * Array of effect names associated with this terpene
   * @example ["Mood enhancing", "Stress relief", "Energizing"]
   */
  effects: string[];

  /**
   * Array of therapeutic pharmacological actions
   * @example ["Antidepressant", "Anti-inflammatory", "Anxiolytic"]
   */
  therapeuticProperties: string[];

  /**
   * Summarized differences supported by data
   * @example "Only known CB2 agonist among terpenes"
   */
  notableDifferences?: string;

  /**
   * Typical concentration range in cannabis dry flower
   * @example "0.003-1.613 mg/g"
   */
  concentrationRange?: string;

  /**
   * Molecular data object containing chemical properties
   */
  molecularData: {
    /**
     * Standard chemical formula
     * @example "C10H16"
     */
    molecularFormula: string;

    /**
     * Molecular weight in atomic mass units (g/mol)
     * @example 136
     */
    molecularWeight: number;

    /**
     * Boiling point in degrees Celsius
     * @example 176
     */
    boilingPoint: number | null;

    /**
     * Chemical classification
     * @example "Monoterpene", "Sesquiterpene", "Monoterpenoid"
     */
    class: string;
  };

  /**
   * Natural sources beyond cannabis
   * @example ["Lemon peel", "Orange rind"]
   */
  sources: string[];

  /**
   * Reference citations for the terpene data
   * @example [{"source": "PubMed 35278524", "type": "Peer-reviewed"}]
   */
  references: Array<{
    source: string;
    type: string;
  }>;

  /**
   * Research data quality assessment
   */
  researchTier: {
    /**
     * Data quality rating
     * @example "Excellent", "Good", "Moderate", "Limited"
     */
    dataQuality: string;

    /**
     * Summary of evidence and dataset scope
     * @example "Confirmed across multiple chemovars with therapeutic validation"
     */
    evidenceSummary: string;
  };
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
    typeof t.category === 'string' &&
    typeof t.description === 'string' &&
    typeof t.aroma === 'string' &&
    typeof t.taste === 'string' &&
    Array.isArray(t.effects) &&
    t.effects.every((e) => typeof e === 'string') &&
    Array.isArray(t.therapeuticProperties) &&
    t.therapeuticProperties.every((tp) => typeof tp === 'string') &&
    (t.concentrationRange === undefined || typeof t.concentrationRange === 'string') &&
    (t.notableDifferences === undefined || typeof t.notableDifferences === 'string') &&
    t.molecularData !== undefined &&
    typeof t.molecularData === 'object' &&
    t.molecularData !== null &&
    'molecularFormula' in t.molecularData &&
    typeof (t.molecularData as Record<string, unknown>).molecularFormula === 'string' &&
    'molecularWeight' in t.molecularData &&
    typeof (t.molecularData as Record<string, unknown>).molecularWeight === 'number' &&
    'boilingPoint' in t.molecularData &&
    (typeof (t.molecularData as Record<string, unknown>).boilingPoint === 'number' ||
      (t.molecularData as Record<string, unknown>).boilingPoint === null) &&
    'class' in t.molecularData &&
    typeof (t.molecularData as Record<string, unknown>).class === 'string' &&
    Array.isArray(t.sources) &&
    t.sources.every((s) => typeof s === 'string') &&
    Array.isArray(t.references) &&
    t.references.every((ref) => typeof ref.source === 'string' && typeof ref.type === 'string') &&
    t.researchTier !== undefined &&
    typeof t.researchTier === 'object' &&
    t.researchTier !== null &&
    'dataQuality' in t.researchTier &&
    typeof (t.researchTier as Record<string, unknown>).dataQuality === 'string' &&
    'evidenceSummary' in t.researchTier &&
    typeof (t.researchTier as Record<string, unknown>).evidenceSummary === 'string'
  );
}
