/**
 * Effect category configuration for terpene effects
 * Used for categorizing and displaying effects in the modal
 */

export interface EffectCategory {
  id: 'mood' | 'cognitive' | 'relaxation' | 'physical';
  name: string;
  icon: string;
  effects: string[];
}

// Effect category mapping from the database schema
export const EFFECT_CATEGORY_MAPPING: Record<string, string> = {
  // Mood & Energy
  Energizing: 'mood',
  'Mood enhancing': 'mood',
  'Mood stabilizing': 'mood',
  Uplifting: 'mood',

  // Cognitive Enhancement
  Alertness: 'cognitive',
  'Cognitive enhancement': 'cognitive',
  Focus: 'cognitive',
  'Memory-enhancement': 'cognitive',

  // Relaxation & Anxiety
  'Anxiety relief': 'relaxation',
  Relaxing: 'relaxation',
  Sedative: 'relaxation',
  'Stress relief': 'relaxation',
  'Couch-lock': 'relaxation',

  // Physical & Physiological
  'Anti-inflammatory': 'physical',
  'Appetite suppressant': 'physical',
  'Breathing support': 'physical',
  'Muscle relaxant': 'physical',
  'Pain relief': 'physical',
  'Seizure related': 'physical',
} as const;

// Category metadata for display
export const EFFECT_CATEGORIES: EffectCategory[] = [
  {
    id: 'mood',
    name: 'Mood & Energy',
    icon: '🌞',
    effects: [],
  },
  {
    id: 'cognitive',
    name: 'Cognitive Enhancement',
    icon: '🧠',
    effects: [],
  },
  {
    id: 'relaxation',
    name: 'Relaxation & Anxiety',
    icon: '🧘',
    effects: [],
  },
  {
    id: 'physical',
    name: 'Physical & Physiological',
    icon: '🏃',
    effects: [],
  },
];
