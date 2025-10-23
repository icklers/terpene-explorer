/**
 * Unit tests for accessibility utilities
 * Tests ARIA label generation, focus management, keyboard navigation helpers
 *
 * TDD: These tests should FAIL initially (red 🔴)
 * Implementation in src/utils/accessibility.ts will make them pass (green 🟢)
 */

import { describe, it, expect } from 'vitest';
import {
  generateAriaLabel,
  generateTerpeneAriaLabel,
  generateEffectAriaLabel,
  announceLiveRegion,
  trapFocus,
} from '../../../src/utils/accessibility';

describe('Accessibility utilities', () => {
  describe('generateAriaLabel', () => {
    it('should generate a basic aria-label from object properties', () => {
      const label = generateAriaLabel({
        name: 'Limonene',
        type: 'terpene',
      });

      expect(label).toContain('Limonene');
      expect(label).toContain('terpene');
    });

    it('should handle empty or undefined values', () => {
      const label = generateAriaLabel({
        name: undefined,
        description: '',
      });

      expect(label).toBeTruthy();
      expect(typeof label).toBe('string');
    });

    it('should create readable concatenation', () => {
      const label = generateAriaLabel({
        category: 'effect',
        name: 'calming',
      });

      // Should be human-readable, not "categorycalming"
      expect(label).toMatch(/effect.*calming/i);
    });
  });

  describe('generateTerpeneAriaLabel', () => {
    it('should generate comprehensive label for terpene', () => {
      const terpene = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Limonene',
        description: 'A citrus-scented terpene.',
        aroma: 'Citrus',
        effects: ['energizing', 'mood-enhancing'],
        sources: ['Lemon peel', 'Orange'],
      };

      const label = generateTerpeneAriaLabel(terpene);

      expect(label).toContain('Limonene');
      expect(label).toContain('Citrus');
      expect(label).toContain('energizing');
      expect(label).toContain('mood-enhancing');
    });

    it('should handle terpene with single effect and source', () => {
      const terpene = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Myrcene',
        description: 'An earthy terpene.',
        aroma: 'Earthy',
        effects: ['sedative'],
        sources: ['Mango'],
      };

      const label = generateTerpeneAriaLabel(terpene);

      expect(label).toContain('Myrcene');
      expect(label).toContain('sedative');
      expect(label).toContain('Mango');
    });

    it('should handle multiple effects grammatically', () => {
      const terpene = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Test',
        description: 'Test terpene.',
        aroma: 'Test',
        effects: ['effect1', 'effect2', 'effect3'],
        sources: ['source1'],
      };

      const label = generateTerpeneAriaLabel(terpene);

      // Should use proper grammar for lists (e.g., "effect1, effect2, and effect3")
      expect(label).toContain('effect1');
      expect(label).toContain('effect2');
      expect(label).toContain('effect3');
    });

    it('should be screen-reader friendly', () => {
      const terpene = {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Pinene',
        description: 'A pine-scented terpene.',
        aroma: 'Pine',
        effects: ['focus'],
        sources: ['Pine needles'],
      };

      const label = generateTerpeneAriaLabel(terpene);

      // Should not contain raw technical data like IDs
      expect(label).not.toContain('550e8400');
      // Should be descriptive
      expect(label.length).toBeGreaterThan(20);
    });
  });

  describe('generateEffectAriaLabel', () => {
    it('should generate label for effect with count', () => {
      const effect = {
        name: 'calming',
        displayName: { en: 'Calming', de: 'Beruhigend' },
        color: '#2196F3',
        terpeneCount: 5,
      };

      const label = generateEffectAriaLabel(effect, 'en');

      expect(label).toContain('Calming');
      expect(label).toContain('5');
      expect(label).toMatch(/terpene/i);
    });

    it('should use correct language for display name', () => {
      const effect = {
        name: 'energizing',
        displayName: { en: 'Energizing', de: 'Energetisierend' },
        color: '#FF9800',
      };

      const labelEn = generateEffectAriaLabel(effect, 'en');
      const labelDe = generateEffectAriaLabel(effect, 'de');

      expect(labelEn).toContain('Energizing');
      expect(labelDe).toContain('Energetisierend');
    });

    it('should handle effect without count', () => {
      const effect = {
        name: 'sedative',
        displayName: { en: 'Sedative', de: 'Beruhigungsmittel' },
        color: '#9C27B0',
      };

      const label = generateEffectAriaLabel(effect, 'en');

      expect(label).toContain('Sedative');
      expect(label).toBeTruthy();
    });

    it('should pluralize terpene count correctly', () => {
      const effectSingle = {
        name: 'test',
        displayName: { en: 'Test', de: 'Test' },
        color: '#000000',
        terpeneCount: 1,
      };

      const effectMultiple = {
        name: 'test',
        displayName: { en: 'Test', de: 'Test' },
        color: '#000000',
        terpeneCount: 5,
      };

      const labelSingle = generateEffectAriaLabel(effectSingle, 'en');
      const labelMultiple = generateEffectAriaLabel(effectMultiple, 'en');

      // Should use singular for 1, plural for >1
      expect(labelSingle).toMatch(/1 terpene(?!s)/i);
      expect(labelMultiple).toMatch(/5 terpenes/i);
    });
  });

  describe('announceLiveRegion', () => {
    it('should return announcement text for filter changes', () => {
      const announcement = announceLiveRegion('filter', {
        count: 5,
        action: 'filtered',
      });

      expect(announcement).toContain('5');
      expect(announcement).toMatch(/found|result|terpene/i);
    });

    it('should return announcement for search results', () => {
      const announcement = announceLiveRegion('search', {
        count: 3,
        query: 'lemon',
      });

      expect(announcement).toContain('3');
      expect(announcement).toContain('lemon');
    });

    it('should handle zero results gracefully', () => {
      const announcement = announceLiveRegion('filter', {
        count: 0,
        action: 'filtered',
      });

      expect(announcement).toMatch(/no.*result|0.*terpene/i);
    });

    it('should announce view mode changes', () => {
      const announcement = announceLiveRegion('viewChange', {
        mode: 'table',
      });

      expect(announcement).toContain('table');
      expect(announcement).toMatch(/view|mode|switched/i);
    });

    it('should announce errors accessibly', () => {
      const announcement = announceLiveRegion('error', {
        message: 'Unable to load data',
      });

      expect(announcement).toContain('error');
      expect(announcement).toContain('Unable to load data');
    });
  });

  describe('trapFocus', () => {
    it('should return focus trap utilities', () => {
      const mockContainer = document.createElement('div');
      const focusTrap = trapFocus(mockContainer);

      expect(focusTrap).toHaveProperty('activate');
      expect(focusTrap).toHaveProperty('deactivate');
      expect(typeof focusTrap.activate).toBe('function');
      expect(typeof focusTrap.deactivate).toBe('function');
    });

    it('should handle activation and deactivation', () => {
      const mockContainer = document.createElement('div');
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');

      mockContainer.appendChild(button1);
      mockContainer.appendChild(button2);

      const focusTrap = trapFocus(mockContainer);

      expect(() => focusTrap.activate()).not.toThrow();
      expect(() => focusTrap.deactivate()).not.toThrow();
    });

    it('should return focusable elements list', () => {
      const mockContainer = document.createElement('div');
      const button = document.createElement('button');
      const link = document.createElement('a');
      link.href = '#';

      mockContainer.appendChild(button);
      mockContainer.appendChild(link);

      const focusTrap = trapFocus(mockContainer);

      expect(focusTrap).toHaveProperty('getFocusableElements');
      if (focusTrap.getFocusableElements) {
        const elements = focusTrap.getFocusableElements();
        expect(Array.isArray(elements)).toBe(true);
      }
    });
  });
});
