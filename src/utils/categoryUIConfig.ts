import { EFFECT_METADATA, EFFECT_CATEGORY_MAPPING } from '../utils/constants';

export interface CategoryUIConfig {
  emoticon: string;
  fallbackLetter: string;
  ariaLabel: string;
}

export interface CategoryUIConfigMap {
  [key: string]: CategoryUIConfig;
}

// UI configuration for effect categories with accessibility support
export const CATEGORY_UI_CONFIG: CategoryUIConfigMap = {
  mood: {
    emoticon: '⚡',
    fallbackLetter: 'M',
    ariaLabel: 'Mood and Energy category',
  },
  cognitive: {
    emoticon: '🧠',
    fallbackLetter: 'C',
    ariaLabel: 'Cognitive and Mental Enhancement category',
  },
  relaxation: {
    emoticon: '😌',
    fallbackLetter: 'R',
    ariaLabel: 'Relaxation and Anxiety Management category',
  },
  physical: {
    emoticon: '💪',
    fallbackLetter: 'P',
    ariaLabel: 'Physical and Physiological Management category',
  },
};

export default CATEGORY_UI_CONFIG;

export interface CategoryDefinition {
  name: string;
  effects: string[];
  displayOrder: number;
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  mood: {
    name: 'Mood & Energy',
    effects: ['Energizing', 'Mood enhancing', 'Mood stabilizing', 'Uplifting'],
    displayOrder: 1,
  },
  cognitive: {
    name: 'Cognitive & Mental Enhancement',
    effects: ['Alertness', 'Cognitive enhancement', 'Focus', 'Memory-enhancement'],
    displayOrder: 2,
  },
  relaxation: {
    name: 'Relaxation & Anxiety Management',
    effects: ['Anxiety relief', 'Relaxing', 'Sedative', 'Stress relief', 'Couch-lock'],
    displayOrder: 3,
  },
  physical: {
    name: 'Physical & Physiological Management',
    effects: ['Anti-inflammatory', 'Appetite suppressant', 'Breathing support', 'Muscle relaxant', 'Pain relief', 'Seizure related'],
    displayOrder: 4,
  },
};

/**
 * Get the category ID for a given effect name.
 * @param effectName - The name of the effect
 * @returns The category ID (mood|cognitive|relaxation|physical) or undefined if not found
 */
export function getCategoryForEffect(effectName: string): string | undefined {
  const name = effectName.trim();

  // First, try to find the effect in EFFECT_METADATA to get the English name
  const metadata = Object.values(EFFECT_METADATA).find(
    (meta) =>
      meta.name.toLowerCase() === name.toLowerCase() ||
      meta.displayName.en.toLowerCase() === name.toLowerCase() ||
      meta.displayName.de.toLowerCase() === name.toLowerCase()
  );

  // Get the English effect name (canonical name)
  const englishEffectName = metadata ? metadata.name : name;

  // Use the effect category mapping to find the category
  const category = EFFECT_CATEGORY_MAPPING[englishEffectName];
  if (category) {
    return category;
  }

  // Fallback to the original lookup method for backwards compatibility
  for (const [categoryId, categoryDef] of Object.entries(CATEGORY_DEFINITIONS)) {
    if (categoryDef.effects.some((effect) => effect.toLowerCase() === englishEffectName.toLowerCase())) {
      return categoryId;
    }
  }

  return undefined;
}
