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
  // Anxiety relief & Sedative (Cool blues and purples)
  'anxiety relief': '#5C6BC0', // Indigo 400
  sedative: '#7E57C2', // Deep Purple 400
  anxiolytic: '#42A5F5', // Blue 400
  'muscle relaxant': '#26C6DA', // Cyan 400
  'seizure related': '#66BB6A', // Green 400

  // Energizing & Uplifting (Warm oranges and yellows)
  energizing: '#FFA726', // Orange 400
  'mood enhancing': '#FFCA28', // Amber 400
  'mood stabilizing': '#FDD835', // Yellow 600
  'stress relief': '#F57C00', // Orange 700
  uplifting: '#F57C00', // Orange 700
  focus: '#FF7043', // Deep Orange 400

  // Anti-inflammatory & Analgesic (Earth tones)
  'anti-inflammatory': '#8D6E63', // Brown 400
  'pain relief': '#A1887F', // Brown 300
  'breathing support': '#D7CCC8', // Brown 100 (adjusted for contrast)

  // Cognitive & Memory (Teals and greens)
  'memory-enhancement': '#26A69A', // Teal 400
  'cognitive enhancement': '#26A69A', // Teal 400
  alertness: '#66BB6A', // Green 400
  antioxidant: '#9CCC65', // Light Green 400

  // Antimicrobial & Immune (Purples and pinks)
  antimicrobial: '#AB47BC', // Purple 400
  antibacterial: '#BA68C8', // Purple 300
  antiviral: '#EC407A', // Pink 400
  antifungal: '#F06292', // Pink 300

  // Digestive & Metabolic (Warm earth tones)
  'appetite suppressant': '#FF8A65', // Deep Orange 300 (normalized term)
  decongestant: '#FFB74D', // Orange 300

  // Additional effects sharing colors
  relaxing: '#7E57C2', // Share with sedative
  'couch-lock': '#7E57C2', // Share with sedative
  balancing: '#FDD835', // Share with mood stabilizing
  grounding: '#5C6BC0', // Share with anxiety relief
  'immune-modulating': '#AB47BC', // Share with antimicrobial

  // Default fallback color (neutral gray)
  default: '#78909C', // Blue Grey 400
};

/**
 * Effect metadata with localized display names
 *
 * This configuration combines color assignments with localized names
 * for all known effect categories.
 */
export const EFFECT_METADATA: Record<string, Omit<Effect, 'terpeneCount'>> = {
  // Updated to match normalized database terms
  'anxiety relief': {
    name: 'anxiety relief',
    displayName: { en: 'Anxiety Relief', de: 'Angstlinderung' },
    color: EFFECT_COLORS['anxiety relief']!,
  },
  sedative: {
    name: 'sedative',
    displayName: { en: 'Sedative', de: 'Beruhigungsmittel' },
    color: EFFECT_COLORS['sedative']!,
  },
  'muscle relaxant': {
    name: 'muscle relaxant',
    displayName: { en: 'Muscle Relaxant', de: 'Muskelentspannend' },
    color: EFFECT_COLORS['muscle relaxant']!,
  },
  'seizure related': {
    name: 'seizure related',
    displayName: { en: 'Seizure Related', de: 'Krampfbezogen' },
    color: EFFECT_COLORS['seizure related']!,
  },
  energizing: {
    name: 'energizing',
    displayName: { en: 'Energizing', de: 'Energetisierend' },
    color: EFFECT_COLORS['energizing']!,
  },
  'mood enhancing': {
    name: 'mood enhancing',
    displayName: { en: 'Mood Enhancing', de: 'Stimmungsaufhellend' },
    color: EFFECT_COLORS['mood enhancing']!,
  },
  'mood stabilizing': {
    name: 'mood stabilizing',
    displayName: { en: 'Mood Stabilizing', de: 'Stimmungsstabilisierend' },
    color: EFFECT_COLORS['mood stabilizing']!,
  },
  'stress relief': {
    name: 'stress relief',
    displayName: { en: 'Stress Relief', de: 'Stressabbau' },
    color: EFFECT_COLORS['stress relief']!,
  },
  uplifting: {
    name: 'uplifting',
    displayName: { en: 'Uplifting', de: 'Aufmunternd' },
    color: EFFECT_COLORS['uplifting']!,
  },
  focus: {
    name: 'focus',
    displayName: { en: 'Focus', de: 'Fokus' },
    color: EFFECT_COLORS['focus']!,
  },
  'anti-inflammatory': {
    name: 'anti-inflammatory',
    displayName: { en: 'Anti-Inflammatory', de: 'Entzündungshemmend' },
    color: EFFECT_COLORS['anti-inflammatory']!,
  },
  'pain relief': {
    name: 'pain relief',
    displayName: { en: 'Pain Relief', de: 'Schmerzlinderung' },
    color: EFFECT_COLORS['pain relief']!,
  },
  'breathing support': {
    name: 'breathing support',
    displayName: { en: 'Breathing Support', de: 'Atemunterstützung' },
    color: EFFECT_COLORS['breathing support']!,
  },
  'memory-enhancement': {
    name: 'memory-enhancement',
    displayName: { en: 'Memory Enhancement', de: 'Gedächtnisverbessernd' },
    color: EFFECT_COLORS['memory-enhancement']!,
  },
  'cognitive enhancement': {
    name: 'cognitive enhancement',
    displayName: { en: 'Cognitive Enhancement', de: 'Kognitive Verbesserung' },
    color: EFFECT_COLORS['cognitive enhancement']!,
  },
  alertness: {
    name: 'alertness',
    displayName: { en: 'Alertness', de: 'Wachsamkeit' },
    color: EFFECT_COLORS['alertness']!,
  },
  antioxidant: {
    name: 'antioxidant',
    displayName: { en: 'Antioxidant', de: 'Antioxidans' },
    color: EFFECT_COLORS['antioxidant']!,
  },
  antimicrobial: {
    name: 'antimicrobial',
    displayName: { en: 'Antimicrobial', de: 'Antimikrobiell' },
    color: EFFECT_COLORS['antimicrobial']!,
  },
  antibacterial: {
    name: 'antibacterial',
    displayName: { en: 'Antibacterial', de: 'Antibakteriell' },
    color: EFFECT_COLORS['antibacterial']!,
  },
  antiviral: {
    name: 'antiviral',
    displayName: { en: 'Antiviral', de: 'Antiviral' },
    color: EFFECT_COLORS['antiviral']!,
  },
  antifungal: {
    name: 'antifungal',
    displayName: { en: 'Antifungal', de: 'Antimykotisch' },
    color: EFFECT_COLORS['antifungal']!,
  },
  'appetite suppressant': {
    name: 'appetite suppressant',
    displayName: { en: 'Appetite Suppressant', de: 'Appetitzügler' },
    color: EFFECT_COLORS['appetite suppressant'] || EFFECT_COLORS['default']!,
  },
  decongestant: {
    name: 'decongestant',
    displayName: { en: 'Decongestant', de: 'Abschwellend' },
    color: EFFECT_COLORS['decongestant']!,
  },
  // Additional normalized effects from database
  relaxing: {
    name: 'relaxing',
    displayName: { en: 'Relaxing', de: 'Entspannend' },
    color: EFFECT_COLORS['sedative']!, // Share color with sedative
  },
  'Couch-lock': {
    name: 'Couch-lock',
    displayName: { en: 'Couch-lock', de: 'Couchfesselung' },
    color: EFFECT_COLORS['sedative']!, // Share color with sedative
  },
  balancing: {
    name: 'balancing',
    displayName: { en: 'Balancing', de: 'Ausgleichend' },
    color: EFFECT_COLORS['mood stabilizing']!, // Share color with mood stabilizing
  },
  grounding: {
    name: 'grounding',
    displayName: { en: 'Grounding', de: 'Erdend' },
    color: EFFECT_COLORS['anxiety relief']!, // Share color with anxiety relief
  },
  'immune-modulating': {
    name: 'immune-modulating',
    displayName: { en: 'Immune Modulating', de: 'Immunmodulierend' },
    color: EFFECT_COLORS['antimicrobial']!, // Share color with antimicrobial
  },
};

/**
 * Gets effect metadata with fallback for unknown effects
 *
 * @param effectName - Effect name (internal key)
 * @returns Effect metadata with color and display names
 */
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

/**
 * Effect category mapping
 *
 * Maps effect names to their categories.
 * Used for determining which category an effect belongs to for styling and filtering.
 */
export const EFFECT_CATEGORY_MAPPING: Record<string, string> = {
  // Mood & Energy effects
  Energizing: 'mood',
  'Mood enhancing': 'mood',
  'Mood stabilizing': 'mood',
  Uplifting: 'mood',

  // Cognitive & Mental Enhancement effects
  Alertness: 'cognitive',
  'Cognitive enhancement': 'cognitive',
  Focus: 'cognitive',
  'Memory-enhancement': 'cognitive',

  // Relaxation & Anxiety Management effects
  'Anxiety relief': 'relaxation',
  Relaxing: 'relaxation',
  Sedative: 'relaxation',
  'Stress relief': 'relaxation',
  'Couch-lock': 'relaxation',

  // Physical & Physiological Management effects
  'Anti-inflammatory': 'physical',
  'Appetite suppressant': 'physical',
  'Breathing support': 'physical',
  'Muscle relaxant': 'physical',
  'Pain relief': 'physical',
  'Seizure related': 'physical',
};
