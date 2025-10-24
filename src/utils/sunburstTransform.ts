/**
 * Sunburst Transform Utility
 *
 * Transforms flat terpene data into hierarchical structure for D3 sunburst chart.
 * Structure: Root → Effects → Terpenes
 *
 * @see tasks.md T062
 */

import { getEffectMetadata } from '../services/colorService';
import type { Terpene } from '../models/Terpene';
import type { Effect } from '../models/Effect';

/**
 * Sunburst node type
 */
export interface SunburstNode {
  /** Node name */
  name: string;
  /** Node type: root, effect, or terpene */
  type?: 'root' | 'effect' | 'terpene';
  /** Node ID (for terpenes) */
  id?: string;
  /** Node color (from effect metadata) */
  color?: string;
  /** Display name with localization */
  displayName?: Effect['displayName'];
  /** Node value (1 for leaves, sum for parents) */
  value?: number;
  /** Child nodes */
  children?: SunburstNode[];
}

/**
 * Transform terpene data to sunburst hierarchy
 *
 * @param terpenes - Array of terpenes to transform
 * @returns Root node of sunburst hierarchy
 */
export function transformToSunburstData(terpenes: Terpene[]): SunburstNode {
  // Handle empty array
  if (terpenes.length === 0) {
    return {
      name: 'Terpenes',
      type: 'root',
      children: [],
    };
  }

  // Build effect → terpenes mapping
  const effectMap = new Map<string, Set<Terpene>>();

  terpenes.forEach((terpene) => {
    // Deduplicate effects within terpene
    const uniqueEffects = [...new Set(terpene.effects)];

    uniqueEffects.forEach((effect) => {
      if (!effect || effect.trim() === '') {
        return; // Skip empty effects
      }

      if (!effectMap.has(effect)) {
        effectMap.set(effect, new Set());
      }
      effectMap.get(effect)!.add(terpene);
    });
  });

  // Create effect nodes with terpene children
  const effectNodes: SunburstNode[] = [];

  effectMap.forEach((terpeneSet, effectName) => {
    const terpeneArray = Array.from(terpeneSet);
    const effectMetadata = getEffectMetadata(effectName, terpeneArray.length);

    // Sort terpenes alphabetically
    const sortedTerpenes = terpeneArray.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Create terpene nodes
    const terpeneNodes: SunburstNode[] = sortedTerpenes.map((terpene) => ({
      name: terpene.name,
      type: 'terpene',
      id: terpene.id,
      color: effectMetadata.color,
      value: 1, // Each terpene has value 1
    }));

    // Create effect node
    effectNodes.push({
      name: effectName,
      type: 'effect',
      color: effectMetadata.color,
      displayName: effectMetadata.displayName,
      value: terpeneNodes.length, // Sum of children
      children: terpeneNodes,
    });
  });

  // Sort effects by terpene count (descending)
  effectNodes.sort((a, b) => (b.value || 0) - (a.value || 0));

  // Create root node
  return {
    name: 'Terpenes',
    type: 'root',
    children: effectNodes,
  };
}
