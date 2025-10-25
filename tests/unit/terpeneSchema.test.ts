import { describe, it, expect } from 'vitest';
import { TerpeneSchema } from '../../src/utils/terpeneSchema';

describe('TerpeneSchema (Zod)', () => {
  it('parses a valid terpene object (happy path)', () => {
    const valid = {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'α-Bisabolol',
      isomerOf: null,
      isomerType: 'Optical',
      category: 'Secondary',
      aroma: 'Floral',
      taste: 'Sweet',
      description: 'Soothing terpene',
      effects: ['Calming'],
      therapeuticProperties: ['Anti-inflammatory'],
      notableDifferences: 'Notable',
      concentrationRange: 'trace-0.5%',
      molecularData: {
        molecularFormula: 'C15H26O',
        molecularWeight: 222,
        boilingPoint: 315,
        class: 'Sesquiterpenoid',
      },
      sources: ['Chamomile'],
      references: [{ source: 'PubMed 35278524', type: 'Peer-reviewed' }],
      researchTier: { dataQuality: 'Good', evidenceSummary: 'Supported' },
    };

    const parsed = TerpeneSchema.parse(valid);
    expect(parsed).toBeDefined();
    expect(parsed.id).toBe(valid.id);
    expect(parsed.molecularData.molecularFormula).toBe(valid.molecularData.molecularFormula);
  });

  it('throws on invalid terpene (bad id) (sad path)', () => {
    const invalid = {
      // invalid UUID
      id: 'not-a-uuid',
      name: 'Bad',
      isomerOf: null,
      isomerType: 'Optical',
      category: 'Core',
      aroma: 'None',
      taste: 'None',
      description: 'Bad',
      effects: ['X'],
      therapeuticProperties: [],
      molecularData: { molecularFormula: 'C10H16', molecularWeight: 136, boilingPoint: 176, class: 'Monoterpene' },
      sources: [],
      references: [],
      researchTier: { dataQuality: 'Limited', evidenceSummary: 'None' },
    };

    expect(() => TerpeneSchema.parse(invalid)).toThrow();
  });
});
