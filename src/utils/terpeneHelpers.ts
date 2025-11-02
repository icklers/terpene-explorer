export { getTherapeuticColor } from '../constants/therapeuticColors';

import type { Effect } from './terpeneSchema';
import { EFFECT_CATEGORY_MAPPING, EFFECT_CATEGORIES, type EffectCategory } from '../constants/effectCategories';

/**
 * Get color for effect category
 * Maps effect categories to Material UI theme colors
 */
export const getEffectCategoryColor = (categoryId: string): string => {
  const categoryColors: Record<string, string> = {
    mood: '#FFA726', // orange[400] - Mood & Energy
    cognitive: '#42A5F5', // blue[400] - Cognitive Enhancement
    relaxation: '#AB47BC', // purple[400] - Relaxation & Anxiety
    physical: '#66BB6A', // green[400] - Physical & Physiological
  };

  return categoryColors[categoryId] || '#9E9E9E'; // grey[500] as fallback
};

/**
 * Get color for a specific effect based on its category
 */
export const getEffectColor = (effect: Effect | string): string => {
  const categoryId = EFFECT_CATEGORY_MAPPING[effect];
  return categoryId ? getEffectCategoryColor(categoryId) : '#9E9E9E';
};

/**
 * Get explanatory tooltip text for concentration labels
 * T223-T225: Context-aware tooltips for concentration percentiles
 */
export const getConcentrationTooltip = (label: 'High' | 'Moderate' | 'Low' | 'Trace', category: 'Core' | 'Secondary' | 'Minor'): string => {
  const tooltips: Record<'High' | 'Moderate' | 'Low' | 'Trace', string> = {
    High: `High concentration - top 25% for ${category} terpenes. Likely to have significant therapeutic effects.`,
    Moderate: `Moderate concentration - 40-75% range for ${category} terpenes. Should provide noticeable benefits.`,
    Low: `Low concentration - 10-40% range for ${category} terpenes. May provide subtle effects.`,
    Trace: `Trace concentration - below 10% for ${category} terpenes. Minimal therapeutic impact expected.`,
  };

  return tooltips[label];
};

export interface ConcentrationData {
  min: number;
  max: number;
  percentile: number;
  label: 'High' | 'Moderate' | 'Low' | 'Trace';
  displayText: string;
}

export const parseConcentration = (range: string, category: 'Core' | 'Secondary' | 'Minor'): ConcentrationData => {
  // Parse concentration range using regex
  const match = range.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);

  if (!match) {
    return {
      min: 0,
      max: 0,
      percentile: 0,
      label: 'Low',
      displayText: range,
    };
  }

  const min = parseFloat(match[1] || '0');
  const max = parseFloat(match[2] || '0');

  // Category-specific maximums for percentile calculation
  const categoryMax = {
    Core: 2.0,
    Secondary: 1.0,
    Minor: 0.5,
  }[category];

  // Calculate percentile based on max value, capped at 100%
  const rawPercentile = (max / categoryMax) * 100;
  const percentile = Math.min(100, rawPercentile);

  // Determine label based on percentile thresholds
  let label: 'High' | 'Moderate' | 'Low' | 'Trace';
  if (percentile >= 75) {
    label = 'High';
  } else if (percentile >= 40) {
    label = 'Moderate';
  } else if (percentile >= 10) {
    label = 'Low';
  } else {
    label = 'Trace';
  }

  return {
    min,
    max,
    percentile,
    label,
    displayText: range,
  };
};

export const getSourceIcon = (source: string): string => {
  // Source-to-icon mapping for natural sources
  const sourceIcons: Record<string, string> = {
    'Lemon peel': '🍋',
    Lemon: '🍋',
    'Orange rind': '🍊',
    Orange: '🍊',
    Lavender: '🌿',
    'Pine needles': '🌲',
    Pine: '🌲',
    'Black pepper': '🌶️',
    Pepper: '🌶️',
    Hops: '🍺',
    Grapefruit: '🍊',
    Lemongrass: '🌿',
    'Copaiba oil': '🌿',
  };

  // Check for exact match first
  if (sourceIcons[source]) {
    return sourceIcons[source];
  }

  // Check for partial matches (case-insensitive)
  const lowerSource = source.toLowerCase();
  for (const [key, icon] of Object.entries(sourceIcons)) {
    if (lowerSource.includes(key.toLowerCase())) {
      return icon;
    }
  }

  // Default fallback
  return '🌿';
};

export const copyToClipboard = async (text: string, onSuccess?: () => void, onError?: (error: Error) => void): Promise<void> => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (onSuccess) onSuccess();
      return;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      // Use deprecated but widely supported execCommand
      const successful = document.execCommand('copy');
      if (successful) {
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Copy command failed');
      }
    } finally {
      document.body.removeChild(textArea);
    }
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    } else if (onError) {
      onError(new Error('Failed to copy to clipboard'));
    }
  }
};

export const categorizeEffects = (effects: string[], showAll: boolean = false): EffectCategory[] => {
  // Initialize categories with empty effects arrays
  const categories = EFFECT_CATEGORIES.map((cat) => ({
    ...cat,
    effects: [] as string[],
  }));

  // Group effects by category
  effects.forEach((effect) => {
    const categoryId = EFFECT_CATEGORY_MAPPING[effect];
    if (categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
        category.effects.push(effect);
      }
    }
  });

  // Apply length limit for Basic View (showAll = false)
  if (!showAll) {
    categories.forEach((category) => {
      if (category.effects.length > 3) {
        category.effects = category.effects.slice(0, 3);
      }
    });
  }

  // Filter out empty categories
  return categories.filter((category) => category.effects.length > 0);
};
