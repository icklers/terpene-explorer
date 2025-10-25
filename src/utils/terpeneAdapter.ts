/**
 * Adapter between legacy `models/Terpene` shape and the new `types/terpene` shape.
 *
 * Provides two helpers:
 * - toNewTerpene(legacy) -> converts legacy model to new typed shape (best-effort)
 * - toLegacyTerpene(newT) -> converts new typed shape to legacy model used across UI
 */

import type { Terpene as LegacyTerpene } from '../models/Terpene';
import type { Terpene as NewTerpene } from '../types/terpene';

export function toNewTerpene(legacy: LegacyTerpene): NewTerpene {
  // Map fields conservatively. Provide safe defaults for missing newer fields.
  return {
    id: legacy.id,
    name: legacy.name,
    description: legacy.description || '',
    aroma: legacy.aroma || '',
    taste: legacy.molecularFormula ? '' : '',
    effects: Array.isArray(legacy.effects) ? legacy.effects : [],
    therapeuticProperties: [],
    notableDifferences: undefined,
    concentrationRange: undefined,
    molecularData: {
      molecularFormula: legacy.molecularFormula || '',
      molecularWeight: 0,
      boilingPoint: typeof legacy.boilingPoint === 'number' ? legacy.boilingPoint : null,
      class: '',
    },
    sources: Array.isArray(legacy.sources) ? legacy.sources : [],
    references: [],
    researchTier: {
      dataQuality: 'Limited',
      evidenceSummary: 'Converted from legacy data model',
    },
  } as unknown as NewTerpene;
}

export function toLegacyTerpene(n: NewTerpene): LegacyTerpene {
  return {
    id: n.id,
    name: n.name,
    description: n.description || '',
    aroma: n.aroma || '',
    effects: Array.isArray(n.effects) ? n.effects : [],
    sources: Array.isArray(n.sources) ? n.sources : [],
    boilingPoint: n.molecularData?.boilingPoint ?? undefined,
    molecularFormula: n.molecularData?.molecularFormula ?? undefined,
  } as LegacyTerpene;
}

export function toLegacyArray(newArr: NewTerpene[]): LegacyTerpene[] {
  return newArr.map(toLegacyTerpene);
}
