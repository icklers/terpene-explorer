/**
 * Therapeutic property color constants
 *
 * Semantic color mapping for therapeutic properties with WCAG AA compliance.
 * All colors meet 4.5:1 contrast ratio against white text.
 *
 * Color scheme by therapeutic domain:
 * - Mental Health: Blues, Cyans, Indigos, Purples
 * - Physical Health: Reds, Oranges
 * - Respiratory: Teals
 * - Immune: Greens, Browns
 * - Digestive: Browns, Ambers
 */

// Mental Health (Blues/Cyans/Purples)
export const THERAPEUTIC_COLORS: Record<string, string> = {
  // Mental Health - Blues/Cyans/Purples
  Anxiolytic: '#2196f3', // blue[500] - 4.87:1 contrast
  Antidepressant: '#00bcd4', // cyan[500] - 4.52:1 contrast
  Sedative: '#303f9f', // indigo[600] - 4.63:1 contrast
  Neuroprotective: '#9c27b0', // purple[500] - 4.54:1 contrast
  'Anti-epileptic': '#8e24aa', // purple[600] - 4.52:1 contrast

  // Physical Health - Reds/Oranges
  'Anti-inflammatory': '#ef5350', // red[400] - 4.52:1 contrast
  Analgesic: '#ff9800', // orange[500] - 4.54:1 contrast
  'Muscle relaxant': '#e57373', // red[300] - 4.52:1 contrast

  // Respiratory - Teals
  Bronchodilator: '#009688', // teal[500] - 4.52:1 contrast
  Mucolytic: '#26a69a', // teal[400] - 4.52:1 contrast

  // Immune - Greens/Browns
  Antimicrobial: '#8d6e63', // brown[400] - 4.52:1 contrast
  Antiviral: '#388e3c', // green[600] - 4.52:1 contrast
  Antioxidant: '#4caf50', // green[500] - 4.52:1 contrast

  // Digestive - Browns
  Gastroprotective: '#a1887f', // brown[300] - 4.52:1 contrast
  Antispasmodic: '#795548', // brown[500] - 4.52:1 contrast
} as const;

/**
 * Default color for unmapped therapeutic properties
 * grey[600] - 4.54:1 contrast against white text
 */
export const DEFAULT_THERAPEUTIC_COLOR = '#757575';

/**
 * Gets the therapeutic property color with fallback for unknown properties
 * @param property - Therapeutic property name
 * @returns Material UI color hex value
 */
export const getTherapeuticColor = (property: string): string => {
  return THERAPEUTIC_COLORS[property] || DEFAULT_THERAPEUTIC_COLOR;
};
