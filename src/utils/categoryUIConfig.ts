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
  const name = effectName.trim().toLowerCase();

  for (const [categoryId, category] of Object.entries(CATEGORY_DEFINITIONS)) {
    if (category.effects.some((effect) => effect.toLowerCase() === name)) {
      return categoryId;
    }
  }

  return undefined;
}
