import { z } from 'zod';

// Nested schemas (bottom-up approach)
const MolecularDataSchema = z.object({
  // Allow common element-token style formulas like C10H16O2 or C10H16
  molecularFormula: z.string().regex(/^([A-Z][a-z]?\d*)+$/),
  molecularWeight: z.number().positive(),
  boilingPoint: z.number().min(-273).nullable(),
  class: z.string().min(1),
});

const ReferenceSchema = z.object({
  source: z.string().min(1),
  type: z.string().min(1),
});

const ResearchTierSchema = z.object({
  dataQuality: z.enum(['Excellent', 'Good', 'Moderate', 'Limited']),
  evidenceSummary: z.string().min(1),
});

// Define normalized effect types (user-friendly terms)
const EffectEnum = z.enum([
  'Alertness',
  'Anti-inflammatory',
  'Anxiety relief',
  'Appetite suppressant',
  'Breathing support',
  'Cognitive enhancement',
  'Couch-lock',
  'Energizing',
  'Focus',
  'Memory-enhancement',
  'Mood enhancing',
  'Mood stabilizing',
  'Muscle relaxant',
  'Pain relief',
  'Relaxing',
  'Sedative',
  'Seizure related',
  'Stress relief',
  'Uplifting',
]);

// Define therapeutic properties (mix of clinical and user-friendly terms)
const TherapeuticPropertyEnum = z.enum([
  'Analgesic',
  'Anesthetic',
  'Anti-epileptic',
  'Anti-inflammatory',
  'Antibacterial',
  'Anticancer',
  'Anticonvulsant',
  'Antidepressant',
  'Antidiabetic',
  'Antifungal',
  'Antihyperalgesic',
  'Antimicrobial',
  'Antioxidant',
  'Antiparasitic',
  'Antiseptic',
  'Antispasmodic',
  'Antiviral',
  'Anxiolytic',
  'Appetite suppressant',
  'Bone regeneration',
  'Bronchodilator',
  'CB2 agonist',
  'Cardiovascular support',
  'Decongestant',
  'Digestive',
  'Gastroprotective',
  'Immune-modulating',
  'Insecticidal',
  'Lipid metabolism',
  'Memory aid',
  'Mood stabilizing',
  'Mucolytic',
  'Muscle relaxant',
  'Neuroprotective',
  'Sedative',
  'Wound healing',
]);

// Effect category schema
const EffectCategoryIdEnum = z.enum(['mood', 'cognitive', 'relaxation', 'physical']);

const EffectCategorySchema = z.object({
  id: EffectCategoryIdEnum,
  name: z.string().min(1),
  displayOrder: z.number().int().positive(),
  description: z.string().min(1),
});

// Effect-to-category mapping schema
const EffectCategoryMappingSchema = z.record(EffectEnum, EffectCategoryIdEnum);

// Main Terpene schema
const TerpeneSchema = z.object({
  // IDs in the database use UUIDs; validate explicitly for safety
  id: z.string().uuid(),
  name: z.string().min(1),
  isomerOf: z.string().nullable(),
  // Constrain isomer types to a known set for data consistency
  isomerType: z.enum(['Optical', 'Optical (Enantiomer)', 'Positional', 'Structural', 'Oxidized derivative']).nullable(),
  category: z.enum(['Core', 'Secondary', 'Minor']),
  aroma: z.string().min(1),
  taste: z.string().min(1),
  description: z.string().min(1),
  effects: z.array(EffectEnum).min(1),
  therapeuticProperties: z.array(TherapeuticPropertyEnum),
  notableDifferences: z.string().optional(),
  concentrationRange: z.string().optional(),
  molecularData: MolecularDataSchema,
  sources: z.array(z.string()),
  references: z.array(ReferenceSchema),
  researchTier: ResearchTierSchema,
});

// Database container schema
const TerpeneDatabaseSchema = z.object({
  version: z.string(),
  created: z.string(),
  description: z.string().min(1),
  categorization_tiers: z.record(z.string()),
  schema_fields: z.record(z.any()),
  implementation_guidelines: z.record(z.any()),
  entries: z.array(TerpeneSchema).min(1),
  effectCategories: z.array(EffectCategorySchema).length(4),
  effectCategoryMapping: EffectCategoryMappingSchema,
});

// Export schemas
export {
  TerpeneSchema,
  TerpeneDatabaseSchema,
  MolecularDataSchema,
  ReferenceSchema,
  ResearchTierSchema,
  EffectEnum,
  TherapeuticPropertyEnum,
  EffectCategoryIdEnum,
  EffectCategorySchema,
  EffectCategoryMappingSchema,
};

// Export inferred types
export type Terpene = z.infer<typeof TerpeneSchema>;
export type TerpeneDatabase = z.infer<typeof TerpeneDatabaseSchema>;
export type MolecularData = z.infer<typeof MolecularDataSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type ResearchTier = z.infer<typeof ResearchTierSchema>;
export type Effect = z.infer<typeof EffectEnum>;
export type TherapeuticProperty = z.infer<typeof TherapeuticPropertyEnum>;
export type EffectCategoryId = z.infer<typeof EffectCategoryIdEnum>;
export type EffectCategory = z.infer<typeof EffectCategorySchema>;
export type EffectCategoryMapping = z.infer<typeof EffectCategoryMappingSchema>;
