/**
 * Theme and User Preference Models
 *
 * Defines the structure for theme configuration and user preferences
 * that persist across browser sessions via localStorage.
 *
 * @see data-model.md for complete validation rules and state transitions
 */

/**
 * Theme State
 *
 * Represents the current theme and localization preferences.
 * Integrates with Material UI's theming system.
 */
export interface ThemeState {
  /**
   * Theme mode
   * - 'light': Light color scheme
   * - 'dark': Dark color scheme
   * - 'system': Follow system preference
   * @default 'system'
   */
  mode: 'light' | 'dark' | 'system';

  /**
   * Detected system preference (read-only)
   * Auto-detected via Material UI useMediaQuery
   */
  systemPreference?: 'light' | 'dark';

  /**
   * Current language selection
   * @default Browser language or 'en'
   */
  language: 'en' | 'de';
}

/**
 * Stored Preferences
 *
 * User preferences persisted to localStorage.
 * Subset of application state that should be restored on app reload.
 */
export interface StoredPreferences {
  /**
   * Persisted theme mode
   * @default 'system'
   */
  theme: 'light' | 'dark' | 'system';

  /**
   * Persisted language selection
   * @default 'en'
   */
  language: 'en' | 'de';

  /**
   * Last selected view mode
   * Optional - if not set, defaults to 'sunburst'
   */
  lastViewMode?: 'sunburst' | 'table';

  /**
   * Persisted filter mode (AND/OR logic for multiple effects)
   * Optional - if not set, defaults to 'any'
   * @since v1.1 (FR-014)
   */
  filterMode?: 'any' | 'all';
}

/**
 * Default theme state
 */
export const DEFAULT_THEME_STATE: ThemeState = {
  mode: 'system',
  language: 'en',
};

/**
 * Default stored preferences
 */
export const DEFAULT_STORED_PREFERENCES: StoredPreferences = {
  theme: 'system',
  language: 'en',
};

/**
 * localStorage key for storing user preferences
 */
export const PREFERENCES_STORAGE_KEY = 'terpene-map-preferences';

/**
 * Type guard to check if an object is a valid ThemeState
 */
export function isThemeState(obj: unknown): obj is ThemeState {
  if (!obj || typeof obj !== 'object') return false;

  const t = obj as Record<string, unknown>;

  return (
    ['light', 'dark', 'system'].includes(t.mode as string) &&
    ['en', 'de'].includes(t.language as string)
  );
}

/**
 * Type guard to check if an object is a valid StoredPreferences
 */
export function isStoredPreferences(obj: unknown): obj is StoredPreferences {
  if (!obj || typeof obj !== 'object') return false;

  const p = obj as Record<string, unknown>;

  return (
    ['light', 'dark', 'system'].includes(p.theme as string) &&
    ['en', 'de'].includes(p.language as string) &&
    (p.lastViewMode === undefined ||
      ['sunburst', 'table'].includes(p.lastViewMode as string)) &&
    (p.filterMode === undefined || ['any', 'all'].includes(p.filterMode as string))
  );
}
