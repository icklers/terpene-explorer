/**
 * Unit tests for validation schema
 * Tests Zod schema validation, graceful degradation, and edge cases (FR-015)
 *
 * TDD: These tests should FAIL initially (red 🔴)
 * Implementation in src/utils/validation.ts will make them pass (green 🟢)
 */

import { describe, it, expect } from 'vitest';

import { TerpeneSchema, validateTerpeneData, type ValidationResult } from '../../../src/utils/validation';

describe('TerpeneSchema', () => {
  const validTerpene = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Limonene',
    description: 'A citrus-scented terpene found in lemon peels.',
    aroma: 'Citrus',
    effects: ['mood-enhancing', 'energizing'],
    sources: ['Lemon peel', 'Orange'],
    boilingPoint: 176,
    molecularFormula: 'C10H16',
  };

  describe('Valid terpene validation', () => {
    it('should validate a complete valid terpene', () => {
      const result = TerpeneSchema.safeParse(validTerpene);
      expect(result.success).toBe(true);
    });

    it('should validate a terpene without optional fields', () => {
      const { ...minimalTerpene } = validTerpene;
      const result = TerpeneSchema.safeParse(minimalTerpene);
      expect(result.success).toBe(true);
    });

    it('should validate multiple effects (up to 10)', () => {
      const terpene = {
        ...validTerpene,
        effects: Array(10).fill('test-effect'),
      };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(true);
    });

    it('should validate multiple sources (up to 20)', () => {
      const terpene = {
        ...validTerpene,
        sources: Array(20).fill('test-source'),
      };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid terpene validation', () => {
    it('should reject terpene with invalid UUID', () => {
      const terpene = { ...validTerpene, id: 'not-a-uuid' };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with empty name', () => {
      const terpene = { ...validTerpene, name: '' };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with name exceeding 100 characters', () => {
      const terpene = { ...validTerpene, name: 'a'.repeat(101) };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with description under 10 characters', () => {
      const terpene = { ...validTerpene, description: 'Short' };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with description exceeding 1000 characters', () => {
      const terpene = { ...validTerpene, description: 'a'.repeat(1001) };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with empty effects array', () => {
      const terpene = { ...validTerpene, effects: [] };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with more than 10 effects', () => {
      const terpene = { ...validTerpene, effects: Array(11).fill('effect') };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with empty sources array', () => {
      const terpene = { ...validTerpene, sources: [] };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with more than 20 sources', () => {
      const terpene = { ...validTerpene, sources: Array(21).fill('source') };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with boilingPoint below -200', () => {
      const terpene = { ...validTerpene, boilingPoint: -201 };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with boilingPoint above 300', () => {
      const terpene = { ...validTerpene, boilingPoint: 301 };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });

    it('should reject terpene with missing required fields', () => {
      const terpene = { id: validTerpene.id, name: validTerpene.name };
      const result = TerpeneSchema.safeParse(terpene);
      expect(result.success).toBe(false);
    });
  });
});

describe('validateTerpeneData - Graceful validation (FR-015)', () => {
  it('should return all valid terpenes when all entries are valid', () => {
    const data = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Limonene',
        description: 'A citrus-scented terpene.',
        aroma: 'Citrus',
        effects: ['energizing'],
        sources: ['Lemon'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Myrcene',
        description: 'An earthy terpene.',
        aroma: 'Earthy',
        effects: ['sedative'],
        sources: ['Mango'],
      },
    ];

    const result: ValidationResult = validateTerpeneData(data);

    expect(result.validTerpenes).toHaveLength(2);
    expect(result.invalidCount).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should filter out invalid entries and return valid ones', () => {
    const data = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Limonene',
        description: 'A citrus-scented terpene.',
        aroma: 'Citrus',
        effects: ['energizing'],
        sources: ['Lemon'],
      },
      {
        id: 'invalid-uuid',
        name: 'InvalidTerpene',
        description: 'Invalid',
        aroma: 'Test',
        effects: ['test'],
        sources: ['test'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: '', // Invalid: empty name
        description: 'Test description',
        aroma: 'Test',
        effects: ['test'],
        sources: ['test'],
      },
    ];

    const result: ValidationResult = validateTerpeneData(data);

    expect(result.validTerpenes).toHaveLength(1);
    expect(result.validTerpenes[0]!.name).toBe('Limonene');
    expect(result.invalidCount).toBe(2);
    expect(result.errors).toHaveLength(2);
  });

  it('should handle empty dataset', () => {
    const result: ValidationResult = validateTerpeneData([]);

    expect(result.validTerpenes).toHaveLength(0);
    expect(result.invalidCount).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle completely invalid dataset', () => {
    const data = [{ invalid: 'data' }, { another: 'invalid' }, { totally: 'wrong' }];

    const result: ValidationResult = validateTerpeneData(data);

    expect(result.validTerpenes).toHaveLength(0);
    expect(result.invalidCount).toBe(3);
    expect(result.errors).toHaveLength(3);
  });

  it('should handle non-array input', () => {
    const result: ValidationResult = validateTerpeneData({ not: 'an array' } as any);

    expect(result.validTerpenes).toHaveLength(0);
    expect(result.invalidCount).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should provide error messages with entry index', () => {
    const data = [{ id: 'invalid-uuid', name: 'Test', description: 'Short', aroma: 'Test', effects: [], sources: [] }];

    const result: ValidationResult = validateTerpeneData(data);

    expect(result.errors[0]).toContain('Entry 1');
  });

  it('should handle entries with missing required fields', () => {
    const data = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Incomplete',
        // Missing description, aroma, effects, sources
      },
    ];

    const result: ValidationResult = validateTerpeneData(data);

    expect(result.validTerpenes).toHaveLength(0);
    expect(result.invalidCount).toBe(1);
    expect(result.errors).toHaveLength(1);
  });
});
