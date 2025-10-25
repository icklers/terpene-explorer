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
  effects: z.array(z.string()).min(1),
  therapeuticProperties: z.array(z.string()),
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
});

// Export schemas
export { TerpeneSchema, TerpeneDatabaseSchema, MolecularDataSchema, ReferenceSchema, ResearchTierSchema };

// Export inferred types
export type Terpene = z.infer<typeof TerpeneSchema>;
export type TerpeneDatabase = z.infer<typeof TerpeneDatabaseSchema>;
export type MolecularData = z.infer<typeof MolecularDataSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type ResearchTier = z.infer<typeof ResearchTierSchema>;
