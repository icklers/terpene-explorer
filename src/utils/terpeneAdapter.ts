/**
 * Adapter for Terpene shape transformations.
 *
 * Provides helpers for converting between different Terpene representations.
 * This is needed to maintain compatibility as we add bilingual functionality.
 */

import type { Terpene } from '@/models/Terpene';
import type { Terpene as CurrentTerpene } from '@/types/terpene';

// Helper type for a basic terpene shape (may be used in legacy code)
interface BasicTerpene {
  id: string;
  name: string;
  description?: string;
  aroma?: string;
  effects: string[];
  sources: string[];
  boilingPoint?: number;  // Original format
  molecularFormula?: string;
}

export function toNewTerpene(legacy: Terpene): CurrentTerpene {
  // Map fields conservatively. Provide safe defaults for missing newer fields.
  return {
    id: legacy.id,
    name: legacy.name,
    isomerOf: legacy.isomerOf,
    isomerType: legacy.isomerType as "Optical" | "Optical (Enantiomer)" | "Positional" | "Structural" | "Oxidized derivative" | null, // Cast to satisfy type system
    category: legacy.category as "Core" | "Secondary" | "Minor", // Cast to satisfy type system
    aroma: legacy.aroma,
    taste: legacy.taste,
    description: legacy.description,
    effects: legacy.effects as CurrentTerpene['effects'], // Cast to satisfy type system
    therapeuticProperties: legacy.therapeuticProperties as ("Mood stabilizing" | "Sedative" | "Anti-inflammatory" | "Appetite suppressant" | "Muscle relaxant" | "Analgesic" | "Anesthetic" | "Anti-epileptic" | "Antibacterial" | "Anticancer" | "Anticonvulsant" | "Antidepressant" | "Antidiabetic" | "Antifungal" | "Antihyperalgesic" | "Antimicrobial" | "Antioxidant" | "Antiparasitic" | "Antiseptic" | "Antispasmodic" | "Antiviral" | "Anxiolytic" | "Appetite suppressant" | "Bone regeneration" | "Bronchodilator" | "Cardiovascular support" | "Decongestant" | "Digestive" | "Gastroprotective" | "Immune-modulating" | "Insecticidal" | "Lipid metabolism" | "Memory aid" | "Mood stabilizing" | "Mucolytic" | "Muscle relaxant" | "Neuroprotective" | "Sedative" | "Wound healing")[],
    notableDifferences: legacy.notableDifferences,
    concentrationRange: legacy.concentrationRange,
    molecularData: {
      molecularFormula: legacy.molecularData.molecularFormula,
      molecularWeight: legacy.molecularData.molecularWeight,
      boilingPoint: legacy.molecularData.boilingPoint,
      class: legacy.molecularData.class,
    },
    sources: legacy.sources,
    references: legacy.references,
    researchTier: {
      dataQuality: legacy.researchTier.dataQuality as "Excellent" | "Good" | "Moderate" | "Limited", // Cast to satisfy type system
      evidenceSummary: legacy.researchTier.evidenceSummary,
    },
  };
}

export function toLegacyTerpene(n: CurrentTerpene): BasicTerpene {
  return {
    id: n.id,
    name: n.name,
    description: n.description,
    aroma: n.aroma,
    effects: Array.isArray(n.effects) ? n.effects : [],
    sources: Array.isArray(n.sources) ? n.sources : [],
    boilingPoint: n.molecularData?.boilingPoint ?? undefined,  // Convert null to undefined for compatibility
    molecularFormula: n.molecularData?.molecularFormula,
  };
}

export function toLegacyArray(newArr: CurrentTerpene[]): CurrentTerpene[] {
  return newArr; // For now, return as-is since we're using the canonical type
}

// Helper to ensure backward compatibility if needed
export function ensureFullTerpeneStructure(terpene: Partial<CurrentTerpene>): CurrentTerpene {
  return {
    id: terpene.id || '',
    name: terpene.name || '',
    isomerOf: terpene.isomerOf || null,
    isomerType: terpene.isomerType || null,
    category: terpene.category || 'Minor',
    description: terpene.description || '',
    aroma: terpene.aroma || '',
    taste: terpene.taste || '',
    effects: terpene.effects || [],
    therapeuticProperties: terpene.therapeuticProperties || [],
    notableDifferences: terpene.notableDifferences ?? '',
    concentrationRange: terpene.concentrationRange ?? '',
    molecularData: terpene.molecularData || {
      molecularFormula: '',
      molecularWeight: 0,
      boilingPoint: null,
      class: ''
    },
    sources: terpene.sources || [],
    references: terpene.references || [],
    researchTier: terpene.researchTier || {
      dataQuality: 'Limited',
      evidenceSummary: 'Default evidence summary'
    }
  };
}
