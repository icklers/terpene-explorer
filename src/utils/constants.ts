/**
 * Application Constants
 *
 * Centralized configuration for effect colors, app settings, and feature flags.
 * Effect colors must meet WCAG 2.1 Level AA contrast requirements (4.5:1 ratio).
 *
 * @see data-model.md for color requirements and constraints
 */

import type { Effect } from '../models/Effect';

/**
 * Effect color palette
 *
 * Each effect category is assigned a unique, distinct color that meets
 * WCAG 2.1 Level AA contrast requirements (4.5:1) against both light
 * and dark backgrounds.
 *
 * Colors are from Material Design palette for consistency with Material UI.
 */
export const EFFECT_COLORS: Record<string, string> = {
  // Calming & Sedative (Cool blues and purples)
  'calming': '#5C6BC0', // Indigo 400
  'sedative': '#7E57C2', // Deep Purple 400
  'anxiolytic': '#42A5F5', // Blue 400
  'muscle-relaxant': '#26C6DA', // Cyan 400
  'anticonvulsant': '#66BB6A', // Green 400

  // Energizing & Uplifting (Warm oranges and yellows)
  'energizing': '#FFA726', // Orange 400
  'mood-enhancing': '#FFCA28', // Amber 400
  'anti-stress': '#FDD835', // Yellow 600
  'uplifting': '#F57C00', // Orange 700
  'focus': '#FF7043', // Deep Orange 400

  // Anti-inflammatory & Analgesic (Earth tones)
  'anti-inflammatory': '#8D6E63', // Brown 400
  'analgesic': '#A1887F', // Brown 300
  'pain-relief': '#D7CCC8', // Brown 100 (adjusted for contrast)
  'neuroprotective': '#BCAAA4', // Brown 200

  // Cognitive & Memory (Teals and greens)
  'memory-retention': '#26A69A', // Teal 400
  'bronchodilator': '#66BB6A', // Green 400
  'antioxidant': '#9CCC65', // Light Green 400

  // Antimicrobial & Immune (Purples and pinks)
  'antimicrobial': '#AB47BC', // Purple 400
  'antibacterial': '#BA68C8', // Purple 300
  'antiviral': '#EC407A', // Pink 400
  'antifungal': '#F06292', // Pink 300

  // Digestive & Metabolic (Warm earth tones)
  'appetite-suppressant': '#FF8A65', // Deep Orange 300
  'decongestant': '#FFB74D', // Orange 300

  // Default fallback color (neutral gray)
  'default': '#78909C', // Blue Grey 400
};

/**
 * Effect metadata with localized display names
 *
 * This configuration combines color assignments with localized names
 * for all known effect categories.
 */
export const EFFECT_METADATA: Record<string, Omit<Effect, 'terpeneCount'>> = {
  'calming': {
    name: 'calming',
    displayName: { en: 'Calming', de: 'Beruhigend' },
    color: EFFECT_COLORS['calming'],
  },
  'sedative': {
    name: 'sedative',
    displayName: { en: 'Sedative', de: 'Beruhigungsmittel' },
    color: EFFECT_COLORS['sedative'],
  },
  'anxiolytic': {
    name: 'anxiolytic',
    displayName: { en: 'Anti-Anxiety', de: 'Angstlösend' },
    color: EFFECT_COLORS['anxiolytic'],
  },
  'muscle-relaxant': {
    name: 'muscle-relaxant',
    displayName: { en: 'Muscle Relaxant', de: 'Muskelentspannend' },
    color: EFFECT_COLORS['muscle-relaxant'],
  },
  'anticonvulsant': {
    name: 'anticonvulsant',
    displayName: { en: 'Anticonvulsant', de: 'Krampflösend' },
    color: EFFECT_COLORS['anticonvulsant'],
  },
  'energizing': {
    name: 'energizing',
    displayName: { en: 'Energizing', de: 'Energetisierend' },
    color: EFFECT_COLORS['energizing'],
  },
  'mood-enhancing': {
    name: 'mood-enhancing',
    displayName: { en: 'Mood Enhancing', de: 'Stimmungsaufhellend' },
    color: EFFECT_COLORS['mood-enhancing'],
  },
  'anti-stress': {
    name: 'anti-stress',
    displayName: { en: 'Anti-Stress', de: 'Anti-Stress' },
    color: EFFECT_COLORS['anti-stress'],
  },
  'uplifting': {
    name: 'uplifting',
    displayName: { en: 'Uplifting', de: 'Aufmunternd' },
    color: EFFECT_COLORS['uplifting'],
  },
  'focus': {
    name: 'focus',
    displayName: { en: 'Focus', de: 'Fokus' },
    color: EFFECT_COLORS['focus'],
  },
  'anti-inflammatory': {
    name: 'anti-inflammatory',
    displayName: { en: 'Anti-Inflammatory', de: 'Entzündungshemmend' },
    color: EFFECT_COLORS['anti-inflammatory'],
  },
  'analgesic': {
    name: 'analgesic',
    displayName: { en: 'Pain Relief', de: 'Schmerzlindernd' },
    color: EFFECT_COLORS['analgesic'],
  },
  'pain-relief': {
    name: 'pain-relief',
    displayName: { en: 'Pain Relief', de: 'Schmerzlinderung' },
    color: EFFECT_COLORS['pain-relief'],
  },
  'neuroprotective': {
    name: 'neuroprotective',
    displayName: { en: 'Neuroprotective', de: 'Neuroprotektiv' },
    color: EFFECT_COLORS['neuroprotective'],
  },
  'memory-retention': {
    name: 'memory-retention',
    displayName: { en: 'Memory Enhancement', de: 'Gedächtnisverbessernd' },
    color: EFFECT_COLORS['memory-retention'],
  },
  'bronchodilator': {
    name: 'bronchodilator',
    displayName: { en: 'Bronchodilator', de: 'Bronchienerweiternd' },
    color: EFFECT_COLORS['bronchodilator'],
  },
  'antioxidant': {
    name: 'antioxidant',
    displayName: { en: 'Antioxidant', de: 'Antioxidans' },
    color: EFFECT_COLORS['antioxidant'],
  },
  'antimicrobial': {
    name: 'antimicrobial',
    displayName: { en: 'Antimicrobial', de: 'Antimikrobiell' },
    color: EFFECT_COLORS['antimicrobial'],
  },
  'antibacterial': {
    name: 'antibacterial',
    displayName: { en: 'Antibacterial', de: 'Antibakteriell' },
    color: EFFECT_COLORS['antibacterial'],
  },
  'antiviral': {
    name: 'antiviral',
    displayName: { en: 'Antiviral', de: 'Antiviral' },
    color: EFFECT_COLORS['antiviral'],
  },
  'antifungal': {
    name: 'antifungal',
    displayName: { en: 'Antifungal', de: 'Antimykotisch' },
    color: EFFECT_COLORS['antifungal'],
  },
  'appetite-suppressant': {
    name: 'appetite-suppressant',
    displayName: { en: 'Appetite Suppressant', de: 'Appetitzügler' },
    color: EFFECT_COLORS['appetite-suppressant'],
  },
  'decongestant': {
    name: 'decongestant',
    displayName: { en: 'Decongestant', de: 'Abschwellend' },
    color: EFFECT_COLORS['decongestant'],
  },
};

/**
 * Gets effect metadata with fallback for unknown effects
 *
 * @param effectName - Effect name (internal key)
 * @returns Effect metadata with color and display names
 */
export function getEffectMetadata(effectName: string): Omit<Effect, 'terpeneCount'> {
  return (
    EFFECT_METADATA[effectName] || {
      name: effectName,
      displayName: {
        en: effectName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        de: effectName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      },
      color: EFFECT_COLORS['default'],
    }
  );
}

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  /** Default data file paths */
  DATA_PATHS: {
    PRIMARY: '/data/terpenes.json',
    FALLBACK: '/data/terpenes.yaml',
  },

  /** Performance thresholds (NFR-PERF-001, NFR-PERF-002) */
  PERFORMANCE: {
    /** Target initial load time in milliseconds */
    INITIAL_LOAD_TARGET: 2000,

    /** Target interaction response time in milliseconds */
    INTERACTION_TARGET: 200,

    /** Maximum terpenes to handle smoothly */
    MAX_TERPENES: 500,
  },

  /** Accessibility settings (WCAG 2.1 Level AA) */
  ACCESSIBILITY: {
    /** Minimum contrast ratio for colors */
    MIN_CONTRAST_RATIO: 4.5,

    /** Debounce time for search input (ms) */
    SEARCH_DEBOUNCE: 300,
  },

  /** localStorage key for user preferences (FR-014) */
  STORAGE_KEY: 'terpene-map-preferences',

  /** Supported languages */
  LANGUAGES: {
    EN: 'en' as const,
    DE: 'de' as const,
  },

  /** Default view mode */
  DEFAULT_VIEW_MODE: 'sunburst' as const,

  /** Default filter mode (FR-013) */
  DEFAULT_FILTER_MODE: 'any' as const,
} as const;

/**
 * Feature flags for toggling functionality
 */
export const FEATURE_FLAGS = {
  /** Enable debug logging in development */
  DEBUG_LOGGING: import.meta.env.DEV,

  /** Enable performance monitoring */
  PERFORMANCE_MONITORING: import.meta.env.DEV,

  /** Enable detailed validation error messages (FR-015) */
  DETAILED_VALIDATION_ERRORS: import.meta.env.DEV,
} as const;

/**
 * API endpoints (currently unused, reserved for future)
 */
export const API_ENDPOINTS = {
  // Reserved for future backend integration
} as const;
