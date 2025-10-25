import { describe, it, expect } from 'vitest';
import { toNewTerpene, toLegacyTerpene, toLegacyArray } from '../../src/utils/terpeneAdapter';

describe('terpeneAdapter', () => {
  it('converts legacy -> new -> legacy (happy path)', () => {
    const legacy: any = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Limonene',
      description: 'Citrus terpene',
      aroma: 'Citrus, Lemon',
      effects: ['Mood-enhancing'],
      sources: ['Lemon peel'],
      boilingPoint: 176,
      molecularFormula: 'C10H16',
    };

    const n = toNewTerpene(legacy);
    expect(n).toBeDefined();
    expect(n.id).toBe(legacy.id);
    expect(n.effects).toEqual(legacy.effects);
    expect(n.molecularData.molecularFormula).toBe(legacy.molecularFormula);

    const back = toLegacyTerpene(n);
    expect(back.id).toBe(n.id);
    expect(back.name).toBe(n.name);
    expect(Array.isArray(back.sources)).toBe(true);
  });

  it('handles incomplete legacy objects without throwing (sad path)', () => {
    const incomplete: any = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Unknown',
      // missing effects, sources
    };

    const n = toNewTerpene(incomplete);
    expect(n).toBeDefined();
    expect(n.id).toBe(incomplete.id);
    expect(Array.isArray(n.effects)).toBe(true);
    // converting back should produce a legacy-looking object
    const back = toLegacyTerpene(n);
    expect(back.id).toBe(n.id);
  });

  it('converts array of new terpenes to legacy array', () => {
    const legacy: any = {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Myrcene',
      description: 'Herbal',
      aroma: 'Herbal',
      effects: ['Relaxing'],
      sources: ['Hops'],
      molecularFormula: 'C10H16',
    };

    const n = toNewTerpene(legacy);
    const arr = toLegacyArray([n]);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr[0].id).toBe(n.id);
  });
});
