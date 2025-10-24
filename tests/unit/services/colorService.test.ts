/**
 * Color Service Tests
 *
 * Tests for effect category color assignment and WCAG contrast validation.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T037
 */

import { describe, it, expect } from 'vitest';

// Import the colorService functions (will be implemented in T045)
import { getEffectColor, getEffectMetadata, validateContrastRatio, getAllEffectColors } from '../../../src/services/colorService';

describe('colorService', () => {
  describe('getEffectColor', () => {
    it('should return a valid hex color for known effects', () => {
      const color = getEffectColor('calming');

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should return consistent colors for the same effect', () => {
      const color1 = getEffectColor('energizing');
      const color2 = getEffectColor('energizing');

      expect(color1).toBe(color2);
    });

    it('should return different colors for different effects', () => {
      const calmingColor = getEffectColor('calming');
      const energizingColor = getEffectColor('energizing');

      expect(calmingColor).not.toBe(energizingColor);
    });

    it('should handle all predefined effect categories', () => {
      const effects = [
        'calming',
        'sedative',
        'anxiolytic',
        'muscle-relaxant',
        'anticonvulsant',
        'energizing',
        'mood-enhancing',
        'anti-stress',
        'uplifting',
        'focus',
        'anti-inflammatory',
        'analgesic',
        'anti-cancer',
        'antioxidant',
        'neuroprotective',
        'antimicrobial',
        'antifungal',
        'antibacterial',
        'antiviral',
        'bronchodilator',
        'gastroprotective',
        'appetite-stimulant',
        'appetite-suppressant',
      ];

      effects.forEach((effect) => {
        const color = getEffectColor(effect);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should return a fallback color for unknown effects', () => {
      const color = getEffectColor('unknown-effect-xyz');

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(color).toBeDefined();
    });

    it('should handle empty string effect', () => {
      const color = getEffectColor('');

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should be case-insensitive', () => {
      const lowerCase = getEffectColor('calming');
      const upperCase = getEffectColor('CALMING');
      const mixedCase = getEffectColor('CaLmInG');

      expect(lowerCase).toBe(upperCase);
      expect(lowerCase).toBe(mixedCase);
    });
  });

  describe('getEffectMetadata', () => {
    it('should return metadata with color and display names', () => {
      const metadata = getEffectMetadata('calming');

      expect(metadata).toHaveProperty('name', 'calming');
      expect(metadata).toHaveProperty('color');
      expect(metadata).toHaveProperty('displayName');
      expect(metadata.displayName).toHaveProperty('en');
      expect(metadata.displayName).toHaveProperty('de');
    });

    it('should return proper localized display names', () => {
      const metadata = getEffectMetadata('energizing');

      expect(metadata.displayName.en).toBe('Energizing');
      expect(metadata.displayName.de).toBe('Energetisierend');
    });

    it('should handle unknown effects with fallback', () => {
      const metadata = getEffectMetadata('unknown-effect');

      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('color');
      expect(metadata).toHaveProperty('displayName');
    });

    it('should include terpeneCount when provided', () => {
      const metadata = getEffectMetadata('anti-inflammatory', 5);

      expect(metadata).toHaveProperty('terpeneCount', 5);
    });

    it('should not include terpeneCount when not provided', () => {
      const metadata = getEffectMetadata('anti-inflammatory');

      expect(metadata).not.toHaveProperty('terpeneCount');
    });
  });

  describe('getAllEffectColors', () => {
    it('should return a map of all effect colors', () => {
      const colors = getAllEffectColors();

      expect(colors).toBeInstanceOf(Map);
      expect(colors.size).toBeGreaterThan(20);
    });

    it('should contain all predefined effects', () => {
      const colors = getAllEffectColors();

      expect(colors.has('calming')).toBe(true);
      expect(colors.has('energizing')).toBe(true);
      expect(colors.has('anti-inflammatory')).toBe(true);
    });

    it('should have unique colors for each effect', () => {
      const colors = getAllEffectColors();
      const colorValues = Array.from(colors.values());
      const uniqueColors = new Set(colorValues);

      // Most colors should be unique (allow some overlap for large sets)
      expect(uniqueColors.size).toBeGreaterThan(colorValues.length * 0.8);
    });

    it('should return valid hex colors', () => {
      const colors = getAllEffectColors();

      colors.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('validateContrastRatio', () => {
    it('should validate WCAG AA compliance (4.5:1) on white background', () => {
      // Test dark colors that should pass AA on white
      expect(validateContrastRatio('#000000', '#FFFFFF')).toBe(true); // Black on white
      expect(validateContrastRatio('#333333', '#FFFFFF')).toBe(true); // Dark grey on white
    });

    it('should reject colors that fail WCAG AA on white background', () => {
      // Test light colors that should fail AA on white
      expect(validateContrastRatio('#FFFFFF', '#FFFFFF')).toBe(false); // White on white
      expect(validateContrastRatio('#EEEEEE', '#FFFFFF')).toBe(false); // Very light grey on white
    });

    it('should validate WCAG AA compliance on dark background', () => {
      // Test light colors that should pass AA on dark
      expect(validateContrastRatio('#FFFFFF', '#000000')).toBe(true); // White on black
      expect(validateContrastRatio('#E0E0E0', '#121212')).toBe(true); // Light grey on dark
    });

    it('should handle colors without # prefix', () => {
      expect(validateContrastRatio('000000', 'FFFFFF')).toBe(true);
    });

    it('should handle lowercase and uppercase hex values', () => {
      expect(validateContrastRatio('#000000', '#ffffff')).toBe(true);
      expect(validateContrastRatio('#FFFFFF', '#000000')).toBe(true);
    });

    it('should validate all predefined effect colors meet WCAG AA on light background', () => {
      const colors = getAllEffectColors();
      const lightBackground = '#FAFAFA'; // Grey 50 from lightTheme

      let passCount = 0;
      colors.forEach((color) => {
        if (validateContrastRatio(color, lightBackground)) {
          passCount++;
        }
      });

      // All effect colors should meet WCAG AA on light background
      expect(passCount).toBe(colors.size);
    });

    it('should validate all predefined effect colors meet WCAG AA on dark background', () => {
      const colors = getAllEffectColors();
      const darkBackground = '#121212'; // Very dark grey from darkTheme

      let passCount = 0;
      colors.forEach((color) => {
        if (validateContrastRatio(color, darkBackground)) {
          passCount++;
        }
      });

      // Most effect colors should meet WCAG AA on dark background
      // (Some might be adjusted for dark mode specifically)
      expect(passCount).toBeGreaterThan(colors.size * 0.8);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long effect names', () => {
      const longEffectName = 'a'.repeat(100);
      const color = getEffectColor(longEffectName);

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should handle effect names with special characters', () => {
      const specialEffect = 'anti-inflammatory-extra';
      const color = getEffectColor(specialEffect);

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should handle effect names with numbers', () => {
      const numberedEffect = 'effect-123';
      const color = getEffectColor(numberedEffect);

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should handle effect names with spaces', () => {
      const spacedEffect = 'anti inflammatory';
      const color = getEffectColor(spacedEffect);

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should handle repeated calls efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        getEffectColor('calming');
        getEffectColor('energizing');
        getEffectColor('anti-inflammatory');
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 3000 calls should complete in well under 1 second
      expect(duration).toBeLessThan(1000);
    });

    it('should handle null-like values gracefully', () => {
      // TypeScript will prevent this at compile time, but test runtime behavior
      const color1 = getEffectColor(undefined as any);
      const color2 = getEffectColor(null as any);

      expect(color1).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(color2).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should validate contrast ratio with invalid color formats', () => {
      // Should handle gracefully (either return false or throw)
      expect(() => validateContrastRatio('invalid', '#FFFFFF')).not.toThrow();
      expect(() => validateContrastRatio('#FFFFFF', 'invalid')).not.toThrow();
    });

    it('should return consistent metadata across multiple calls', () => {
      const meta1 = getEffectMetadata('calming');
      const meta2 = getEffectMetadata('calming');

      expect(meta1).toEqual(meta2);
      expect(meta1.color).toBe(meta2.color);
      expect(meta1.displayName.en).toBe(meta2.displayName.en);
    });
  });

  describe('Color Uniqueness', () => {
    it('should minimize color collisions for common effects', () => {
      const commonEffects = [
        'calming',
        'energizing',
        'anti-inflammatory',
        'sedative',
        'focus',
        'analgesic',
        'anxiolytic',
        'mood-enhancing',
        'uplifting',
        'anti-stress',
      ];

      const colors = commonEffects.map((effect) => getEffectColor(effect));
      const uniqueColors = new Set(colors);

      // All common effects should have unique colors
      expect(uniqueColors.size).toBe(commonEffects.length);
    });

    it('should distribute colors well across the color spectrum', () => {
      const effects = ['calming', 'energizing', 'anti-inflammatory', 'sedative', 'focus'];

      const colors = effects.map((effect) => getEffectColor(effect));

      // Convert hex to RGB and check distribution
      const rgbColors = colors.map((hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
      });

      // Check that we have variation in each channel
      const rValues = rgbColors.map((c) => c.r);
      const gValues = rgbColors.map((c) => c.g);
      const bValues = rgbColors.map((c) => c.b);

      const rRange = Math.max(...rValues) - Math.min(...rValues);
      const gRange = Math.max(...gValues) - Math.min(...gValues);
      const bRange = Math.max(...bValues) - Math.min(...bValues);

      // At least one channel should have significant variation
      expect(Math.max(rRange, gRange, bRange)).toBeGreaterThan(50);
    });
  });
});
