/**
 * Sunburst Transform Utility Tests
 *
 * Unit tests for sunburst data transformation utility.
 * Following TDD protocol: these tests should FAIL initially (red 🔴).
 *
 * @see tasks.md T057
 */

import { describe, it, expect } from 'vitest';

import type { Terpene } from '../../../src/models/Terpene';
import {
  transformToSunburstData,
  type SunburstNode,
} from '../../../src/utils/sunburstTransform';

describe('sunburstTransform', () => {
  const mockTerpenes: Terpene[] = [
    {
      id: '1',
      name: 'Limonene',
      aroma: 'Citrus',
      description: 'A citrus-scented terpene',
      effects: ['energizing', 'mood-enhancing'],
      sources: ['Lemon', 'Orange'],
    },
    {
      id: '2',
      name: 'Myrcene',
      aroma: 'Earthy',
      description: 'An earthy terpene',
      effects: ['sedative', 'muscle-relaxant'],
      sources: ['Mango', 'Hops'],
    },
    {
      id: '3',
      name: 'Pinene',
      aroma: 'Pine',
      description: 'A pine-scented terpene',
      effects: ['focus', 'energizing'],
      sources: ['Pine', 'Rosemary'],
    },
    {
      id: '4',
      name: 'Linalool',
      aroma: 'Floral',
      description: 'A floral terpene',
      effects: ['calming', 'sedative'],
      sources: ['Lavender', 'Mint'],
    },
  ];

  describe('transformToSunburstData', () => {
    it('should create root node with name "Terpenes"', () => {
      const result = transformToSunburstData(mockTerpenes);

      expect(result).toBeDefined();
      expect(result.name).toBe('Terpenes');
    });

    it('should create hierarchy with effects as first level children', () => {
      const result = transformToSunburstData(mockTerpenes);

      expect(result.children).toBeDefined();
      expect(result.children!.length).toBeGreaterThan(0);

      // Check that all children are effects
      result.children!.forEach((child) => {
        expect(child.name).toBeTruthy();
        expect(child.type).toBe('effect');
      });
    });

    it('should create unique effect nodes (no duplicates)', () => {
      const result = transformToSunburstData(mockTerpenes);

      const effectNames = result.children!.map((c) => c.name);
      const uniqueEffects = new Set(effectNames);

      expect(effectNames.length).toBe(uniqueEffects.size);
    });

    it('should group terpenes under their effects', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );

      expect(energizingNode).toBeDefined();
      expect(energizingNode!.children).toBeDefined();
      expect(energizingNode!.children!.length).toBe(2); // Limonene and Pinene
    });

    it('should set terpene nodes as leaf nodes with type "terpene"', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );
      const terpeneNode = energizingNode!.children![0];

      expect(terpeneNode.type).toBe('terpene');
      expect(terpeneNode.children).toBeUndefined();
    });

    it('should assign colors to effect nodes from effect metadata', () => {
      const result = transformToSunburstData(mockTerpenes);

      result.children!.forEach((effectNode) => {
        expect(effectNode.color).toBeDefined();
        expect(effectNode.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should inherit color from parent effect to terpene nodes', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );
      const terpeneNode = energizingNode!.children![0];

      expect(terpeneNode.color).toBe(energizingNode!.color);
    });

    it('should set value to 1 for all leaf nodes (terpenes)', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );

      energizingNode!.children!.forEach((terpeneNode) => {
        expect(terpeneNode.value).toBe(1);
      });
    });

    it('should calculate aggregate value for effect nodes (sum of children)', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );

      // Energizing has 2 terpenes: Limonene and Pinene
      expect(energizingNode!.value).toBe(2);
    });

    it('should include terpene ID in leaf nodes for click handling', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );
      const terpeneNode = energizingNode!.children![0];

      expect(terpeneNode.id).toBeDefined();
      expect(['1', '3']).toContain(terpeneNode.id); // Limonene or Pinene
    });

    it('should handle terpenes with multiple effects (appear under each)', () => {
      const result = transformToSunburstData(mockTerpenes);

      const energizingNode = result.children!.find(
        (c) => c.name === 'energizing'
      );
      const sedativeNode = result.children!.find((c) => c.name === 'sedative');

      // Limonene appears under energizing
      expect(
        energizingNode!.children!.some((t) => t.name === 'Limonene')
      ).toBe(true);

      // Myrcene appears under sedative
      expect(
        sedativeNode!.children!.some((t) => t.name === 'Myrcene')
      ).toBe(true);
    });

    it('should handle empty terpene array', () => {
      const result = transformToSunburstData([]);

      expect(result.name).toBe('Terpenes');
      expect(result.children).toEqual([]);
    });

    it('should handle terpene with no effects', () => {
      const terpeneNoEffects: Terpene = {
        id: '5',
        name: 'Unknown',
        aroma: 'Unknown',
        description: 'Unknown terpene',
        effects: [],
        sources: [],
      };

      const result = transformToSunburstData([terpeneNoEffects]);

      // Should have no effect nodes since terpene has no effects
      expect(result.children).toEqual([]);
    });

    it('should handle terpene with duplicate effects (no duplicates in result)', () => {
      const terpeneWithDuplicates: Terpene = {
        id: '6',
        name: 'Test',
        aroma: 'Test',
        description: 'Test',
        effects: ['calming', 'calming', 'calming'],
        sources: [],
      };

      const result = transformToSunburstData([terpeneWithDuplicates]);

      // Should have only one calming node
      expect(result.children!.length).toBe(1);
      expect(result.children![0].name).toBe('calming');
      expect(result.children![0].children!.length).toBe(1);
    });

    it('should sort effect nodes by terpene count (descending)', () => {
      const result = transformToSunburstData(mockTerpenes);

      // Verify that effects are sorted by count
      for (let i = 0; i < result.children!.length - 1; i++) {
        const currentCount = result.children![i].value || 0;
        const nextCount = result.children![i + 1].value || 0;
        expect(currentCount).toBeGreaterThanOrEqual(nextCount);
      }
    });

    it('should sort terpenes alphabetically within each effect', () => {
      const result = transformToSunburstData(mockTerpenes);

      result.children!.forEach((effectNode) => {
        const terpeneNames = effectNode.children!.map((t) => t.name);

        // Check if sorted
        const sorted = [...terpeneNames].sort();
        expect(terpeneNames).toEqual(sorted);
      });
    });

    it('should handle special characters in terpene names', () => {
      const specialTerpene: Terpene = {
        id: '7',
        name: 'α-Pinene',
        aroma: 'Pine',
        description: 'Alpha-pinene',
        effects: ['focus'],
        sources: [],
      };

      const result = transformToSunburstData([specialTerpene]);

      const focusNode = result.children![0];
      const terpeneNode = focusNode.children![0];

      expect(terpeneNode.name).toBe('α-Pinene');
    });

    it('should handle very long terpene lists (performance)', () => {
      const largeTerpeneSet: Terpene[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          id: `${i}`,
          name: `Terpene ${i}`,
          aroma: `Aroma ${i % 10}`,
          description: `Description ${i}`,
          effects: [`effect-${i % 20}`],
          sources: [`Source ${i}`],
        })
      );

      const startTime = performance.now();
      const result = transformToSunburstData(largeTerpeneSet);
      const duration = performance.now() - startTime;

      // Should complete within 500ms (SC-005)
      expect(duration).toBeLessThan(500);
      expect(result.children!.length).toBe(20); // 20 unique effects
    });

    it('should create valid D3 hierarchy structure', () => {
      const result = transformToSunburstData(mockTerpenes);

      // Check structure matches D3 hierarchy requirements
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('children');

      // All nodes should have name
      const checkNode = (node: SunburstNode) => {
        expect(node.name).toBeDefined();

        if (node.children) {
          node.children.forEach(checkNode);
        }
      };

      checkNode(result);
    });

    it('should assign effect metadata (displayName, color) correctly', () => {
      const result = transformToSunburstData(mockTerpenes);

      const calmingNode = result.children!.find((c) => c.name === 'calming');

      expect(calmingNode).toBeDefined();
      expect(calmingNode!.color).toBeDefined();
      expect(calmingNode!.displayName).toBeDefined();
    });
  });
});
