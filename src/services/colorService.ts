/**
 * Color Service
 *
 * Service for managing effect colors with WCAG AA compliance.
 * Provides consistent color assignment and metadata for effects.
 *
 * @see tasks.md T045
 */

import type { Effect } from '../models/Effect';
import { EFFECT_COLORS, EFFECT_METADATA } from '../utils/constants';

/**
 * Get color for an effect
 *
 * @param effectName - Name of the effect
 * @returns Hex color code
 */
export function getEffectColor(effectName: string): string {
  const normalizedName = effectName.toLowerCase().trim();

  // Return predefined color if available
  const color = EFFECT_COLORS[normalizedName];
  if (color) {
    return color;
  }

  // Generate fallback color based on effect name hash
  return generateFallbackColor(normalizedName);
}

/**
 * Get complete metadata for an effect
 *
 * @param effectName - Name of the effect
 * @param terpeneCount - Optional terpene count
 * @returns Effect metadata
 */
export function getEffectMetadata(
  effectName: string,
  terpeneCount?: number
): Effect {
  const normalizedName = effectName.toLowerCase().trim();

  // Get predefined metadata if available
  const metadata = EFFECT_METADATA[normalizedName];

  if (metadata) {
    return terpeneCount !== undefined
      ? { ...metadata, terpeneCount }
      : metadata;
  }

  // Create fallback metadata
  const displayName = effectName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const fallbackEffect: Effect = {
    name: normalizedName,
    displayName: {
      en: displayName,
      de: displayName, // Use same as English for unknown effects
    },
    color: generateFallbackColor(normalizedName),
  };

  return terpeneCount !== undefined
    ? { ...fallbackEffect, terpeneCount }
    : fallbackEffect;
}

/**
 * Get all predefined effect colors as a Map
 *
 * @returns Map of effect names to colors
 */
export function getAllEffectColors(): Map<string, string> {
  return new Map(Object.entries(EFFECT_COLORS));
}

/**
 * Validate contrast ratio for WCAG AA compliance (4.5:1)
 *
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns True if contrast ratio meets WCAG AA
 */
export function validateContrastRatio(
  foreground: string,
  background: string
): boolean {
  try {
    const fgLuminance = getRelativeLuminance(foreground);
    const bgLuminance = getRelativeLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // WCAG AA requires 4.5:1 for normal text
    return contrastRatio >= 4.5;
  } catch {
    return false;
  }
}

/**
 * Calculate relative luminance for a color
 * Based on WCAG 2.1 formula
 *
 * @param color - Hex color code
 * @returns Relative luminance (0-1)
 */
function getRelativeLuminance(color: string): number {
  // Remove # if present
  const hex = color.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Generate fallback color for unknown effects
 * Uses simple hash to ensure consistency
 *
 * @param effectName - Effect name
 * @returns Hex color code
 */
function generateFallbackColor(effectName: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < effectName.length; i++) {
    hash = effectName.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate color with reasonable saturation and lightness
  const hue = Math.abs(hash % 360);
  const saturation = 60; // Medium saturation
  const lightness = 50; // Medium lightness

  return hslToHex(hue, saturation, lightness);
}

/**
 * Convert HSL to Hex color
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color code
 */
function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, '0');
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, '0');
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
