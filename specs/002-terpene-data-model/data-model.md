# Data Model: Enhanced Terpene Data Model

**Feature**: 002-terpene-data-model
**Date**: 2025-10-25
**Phase**: 1 (Design & Contracts)

## Overview

This document defines the data entities, relationships, and validation rules for the enhanced terpene data model. All data is sourced from `data/terpene-database.json` and validated using Zod schemas.

## Core Entities

### 1. Terpene

**Description**: Represents a single terpene compound with comprehensive chemical, biological, and research data.

**Source**: `terpene_database_schema.entries[]` in `data/terpene-database.json`

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | Pattern: `terp-\d{3}` | Unique stable identifier (e.g., "terp-001") |
| `name` | string | Yes | Min length: 1 | Primary terpene name with optical/structural designation |
| `isomerOf` | string \| null | No | - | Parent compound name if this is an isomer variant |
| `isomerType` | enum \| null | No | One of: "Optical", "Positional", "Structural" | Type of isomerism |
| `category` | enum | Yes | One of: "Core", "Secondary", "Minor" | Categorization tier based on prevalence |
| `aroma` | string | Yes | Min length: 1 | Comma-separated sensory descriptors |
| `taste` | string | Yes | Min length: 1 | Flavor descriptors for cultivar taste |
| `description` | string | Yes | Min length: 1 | Literature-based summary of terpene |
| `effects` | string[] | Yes | Min items: 1 | Empirically supported physiological/psychoactive effects |
| `therapeuticProperties` | string[] | Yes | Min items: 0 | Recognized therapeutic pharmacological actions |
| `notableDifferences` | string | No | - | Summarized differences supported by data |
| `concentrationRange` | string | No | - | Typical concentration in cannabis (mg/g or %) |
| `molecularData` | MolecularData | Yes | - | Chemical properties (see below) |
| `sources` | string[] | Yes | Min items: 0 | Natural origins beyond cannabis |
| `references` | Reference[] | Yes | Min items: 0 | Research citations |
| `researchTier` | ResearchTier | Yes | - | Data quality assessment |

**Relationships**:
- One Terpene → One MolecularData (embedded)
- One Terpene → Many References (embedded array)
- One Terpene → One ResearchTier (embedded)

**State Transitions**: N/A (static data, no state changes)

**Validation Rules**:
1. `id` must be unique across all terpenes
2. `name` must not be empty
3. If `isomerOf` is not null, `isomerType` should also be specified (warning, not error)
4. `effects` array must not be empty
5. `category` must be one of the defined tiers
6. All array fields default to empty arrays if missing

### 2. MolecularData

**Description**: Chemical properties of a terpene compound.

**Source**: Embedded in `Terpene.molecularData`

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `molecularFormula` | string | Yes | Pattern: `C\d+H\d+O?\d*` | Standard chemical formula (e.g., "C10H16") |
| `molecularWeight` | number | Yes | Min: 1 | Molecular weight in g/mol |
| `boilingPoint` | number \| null | No | Min: -273 (absolute zero) | Boiling point in Celsius |
| `class` | string | Yes | Non-empty | Chemical classification (e.g., "Monoterpene") |

**Validation Rules**:
1. `molecularWeight` must be positive
2. `boilingPoint` must be physically plausible (above absolute zero if specified)

### 3. Reference

**Description**: Research citation for terpene data.

**Source**: Embedded in `Terpene.references[]`

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `source` | string | Yes | Min length: 1 | Citation number, URL, or reference identifier |
| `type` | string | Yes | Min length: 1 | Source type (e.g., "Peer-reviewed", "Industry report") |

**Validation Rules**:
1. Both fields must be non-empty strings

### 4. ResearchTier

**Description**: Assessment of data quality and evidence basis.

**Source**: Embedded in `Terpene.researchTier`

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `dataQuality` | enum | Yes | One of: "Excellent", "Good", "Moderate", "Limited" | Quality assessment |
| `evidenceSummary` | string | Yes | Min length: 1 | Summary of dataset scope and quality |

**Validation Rules**:
1. `dataQuality` must be one of the four defined levels
2. `evidenceSummary` must provide meaningful context

### 5. TerpeneDatabase (Container)

**Description**: Top-level container for the entire terpene dataset with metadata.

**Source**: Root of `data/terpene-database.json`

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `version` | string | Yes | Semver format | Schema version (e.g., "1.0.0") |
| `created` | string | Yes | ISO date format | Database creation date |
| `description` | string | Yes | Min length: 1 | Database description |
| `categorization_tiers` | object | Yes | - | Tier definitions (Core, Secondary, Minor) |
| `schema_fields` | object | Yes | - | Field documentation |
| `implementation_guidelines` | object | Yes | - | Usage guidelines |
| `entries` | Terpene[] | Yes | Min items: 1 | Array of all terpenes |

**Validation Rules**:
1. `entries` array must contain at least one terpene
2. All terpene IDs within `entries` must be unique

## UI-Specific Entities

### 6. TerpeneDetailModalProps

**Description**: Props interface for the detail view component (UI layer).

**Source**: React component props (not from JSON)

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `open` | boolean | Yes | - | Whether modal is open |
| `terpene` | Terpene \| null | Yes | - | Terpene to display (null when closed) |
| `onClose` | () => void | Yes | - | Callback when user closes modal |

### 7. TerpeneTableRow

**Description**: Simplified terpene data for table display (derived from Terpene).

**Source**: Derived from `Terpene` entity

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Terpene ID (for React key) |
| `name` | string | Display name |
| `aroma` | string | Aroma descriptors |
| `effects` | string[] | Effects array (for chips) |

**Note**: Sources column is explicitly excluded from table display per requirements.

## Data Flow

```
terpene-database.json (static file)
    ↓
services/terpeneData.ts (load & validate with Zod)
    ↓
hooks/useTerpeneData.ts (React hook for components)
    ↓
┌─────────────────────────────────────┐
│  TerpeneTable                       │
│  - Display: id, name, aroma, effects │
│  - onClick: select terpene          │
└─────────────────────────────────────┘
    ↓ (user clicks row)
┌─────────────────────────────────────┐
│  TerpeneDetailModal                 │
│  - Display all 7 detail fields      │
│  - Formatted layout with i18n labels│
└─────────────────────────────────────┘
```

## Validation Strategy

### Zod Schema Structure

```typescript
// utils/terpeneSchema.ts

const MolecularDataSchema = z.object({
  molecularFormula: z.string().regex(/^C\d+H\d+O?\d*$/),
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

const TerpeneSchema = z.object({
  id: z.string().regex(/^terp-\d{3}$/),
  name: z.string().min(1),
  isomerOf: z.string().nullable(),
  isomerType: z.enum(['Optical', 'Positional', 'Structural']).nullable(),
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

const TerpeneDatabaseSchema = z.object({
  version: z.string(),
  created: z.string(),
  description: z.string().min(1),
  categorization_tiers: z.record(z.string()),
  schema_fields: z.record(z.any()),
  implementation_guidelines: z.record(z.any()),
  entries: z.array(TerpeneSchema).min(1),
});

// Type exports (automatic inference)
export type Terpene = z.infer<typeof TerpeneSchema>;
export type MolecularData = z.infer<typeof MolecularDataSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type ResearchTier = z.infer<typeof ResearchTierSchema>;
export type TerpeneDatabase = z.infer<typeof TerpeneDatabaseSchema>;
```

### Error Handling

1. **Load Failure**: If JSON file cannot be loaded, show error boundary with user-friendly message
2. **Validation Failure**: If Zod validation fails, log detailed errors to console and show generic error to user
3. **Missing Data**: If optional fields are missing, gracefully hide those sections in UI
4. **Malformed Data**: Zod will throw with specific field errors - catch and display "Data format error"

## Data Transformation Rules

### From JSON to UI

1. **Array fields** (effects, therapeuticProperties, sources):
   - Render as Material UI Chips or bulleted lists
   - Empty arrays → hide section or show "Not available"

2. **Boiling Point**:
   - Always display with unit: `${boilingPoint}°C`
   - If null → "Not available"

3. **Notable Differences**:
   - If missing or empty → hide section
   - If present → display in dedicated section

4. **Aroma & Taste**:
   - Display as-is (already comma-separated strings)

### Search/Filter Indexing

For search functionality, index the following fields:
- `name` (primary)
- `aroma` (secondary)
- `effects` (joined array)
- `therapeuticProperties` (joined array)
- `category` (for filtering)

## Performance Considerations

1. **Data Size**: 30+ terpenes × ~1.5KB each ≈ 50KB total (well within budget)
2. **Validation Cost**: Zod validation runs once on load, not on every render
3. **Memoization**: Memo table row components to prevent unnecessary re-renders
4. **Search Debounce**: Existing 300ms debounce prevents excessive filtering

## Migration Notes

### Breaking Changes from Old Data Model

1. **New required fields**: `therapeuticProperties`, `notableDifferences`, `molecularData.boilingPoint`
2. **Renamed fields**: None (new schema is additive)
3. **Schema structure**: Nested objects (`molecularData`, `researchTier`) vs flat structure

### Backwards Compatibility

Not applicable - this is a new data source replacing the old one. No migration path needed.

## Summary

The data model consists of 7 entities: 4 from JSON schema (Terpene, MolecularData, Reference, ResearchTier), 1 container (TerpeneDatabase), and 2 UI-specific entities (TerpeneDetailModalProps, TerpeneTableRow). Validation is handled by Zod with comprehensive type safety. Data flows from static JSON through services/hooks to React components with proper error handling at each layer.
