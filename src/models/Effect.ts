/**
 * Effect Entity
 *
 * Represents a category of effect that terpenes can have.
 * Effects are used to categorize and filter terpenes.
 *
 * @see data-model.md for complete validation rules and color requirements
 */
export interface Effect {
  /**
   * Unique identifier for the effect (serves as both ID and internal key)
   * @minLength 1
   * @maxLength 50
   * @pattern ^[a-z0-9-]+$
   * @example "calming"
   */
  name: string;

  /**
   * Localized display names for the effect
   */
  displayName: {
    /** English display name */
    en: string;
    /** German display name */
    de: string;
  };

  /**
   * Hex color code for visual representation
   * Must meet WCAG 2.1 Level AA contrast requirements (4.5:1 ratio)
   * against both light and dark backgrounds
   * @pattern ^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
   * @example "#2196F3"
   */
  color: string;

  /**
   * Number of terpenes associated with this effect (computed)
   * This is derived data, not stored in the data source
   * @minimum 0
   */
  terpeneCount?: number;
}

/**
 * Type guard to check if an object is a valid Effect
 */
export function isEffect(obj: unknown): obj is Effect {
  if (!obj || typeof obj !== 'object') return false;

  const e = obj as Record<string, unknown>;

  return (
    typeof e.name === 'string' &&
    typeof e.displayName === 'object' &&
    e.displayName !== null &&
    typeof (e.displayName as Record<string, unknown>).en === 'string' &&
    typeof (e.displayName as Record<string, unknown>).de === 'string' &&
    typeof e.color === 'string' &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(e.color)
  );
}
