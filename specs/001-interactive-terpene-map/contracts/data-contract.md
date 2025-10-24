# Data Contract: Terpene Data Files

**Feature**: 001-interactive-terpene-map
**Date**: 2025-10-23
**Contract Type**: Static Data Schema
**Version**: 1.0.0

## Overview

This contract defines the expected structure and format of the static terpene data files (`terpenes.json` and `terpenes.yaml`) that serve as the data source for the Interactive Terpene Map application.

---

## Data File Locations

- **Primary Source**: `/data/terpenes.json`
- **Alternative Source**: `/data/terpenes.yaml`
- **Format**: JSON array or YAML sequence of Terpene objects

---

## Schema Definition

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Terpene Dataset",
  "type": "array",
  "items": {
    "$ref": "#/definitions/Terpene"
  },
  "definitions": {
    "Terpene": {
      "type": "object",
      "required": ["id", "name", "description", "aroma", "effects", "sources"],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid",
          "description": "Unique identifier (UUID v4)"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100,
          "description": "Display name of the terpene"
        },
        "description": {
          "type": "string",
          "minLength": 10,
          "maxLength": 1000,
          "description": "Detailed description of the terpene"
        },
        "aroma": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100,
          "description": "Characteristic aroma"
        },
        "effects": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "maxItems": 10,
          "description": "Array of effect names"
        },
        "sources": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "maxItems": 20,
          "description": "Natural sources of the terpene"
        },
        "boilingPoint": {
          "type": "number",
          "minimum": -200,
          "maximum": 300,
          "description": "Boiling point in Celsius (optional)"
        },
        "molecularFormula": {
          "type": "string",
          "pattern": "^[A-Z][a-z]?\\d*",
          "description": "Chemical formula (optional)"
        }
      },
      "additionalProperties": false
    }
  }
}
```

---

## TypeScript Type Definition

```typescript
/**
 * Represents a single terpene compound
 */
export interface Terpene {
  /** Unique identifier (UUID v4 format) */
  id: string;

  /** Display name (e.g., "Limonene") */
  name: string;

  /** Detailed description (10-1000 characters) */
  description: string;

  /** Characteristic aroma (e.g., "Citrus") */
  aroma: string;

  /** Array of effect names (1-10 items) */
  effects: string[];

  /** Natural sources (1-20 items) */
  sources: string[];

  /** Boiling point in Celsius (optional, -200 to 300) */
  boilingPoint?: number;

  /** Chemical formula (optional) */
  molecularFormula?: string;
}

/**
 * Root data structure
 */
export type TerpeneDataset = Terpene[];
```

---

## Example Data

### JSON Format (`/data/terpenes.json`)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Limonene",
    "description": "Limonene is a monoterpene commonly found in citrus fruits. It has a strong citrus aroma and is associated with mood elevation and stress relief.",
    "aroma": "Citrus",
    "effects": ["uplifting", "stress-relief", "focus"],
    "sources": ["Lemon peel", "Orange peel", "Grapefruit", "Juniper"],
    "boilingPoint": 176,
    "molecularFormula": "C10H16"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "name": "Myrcene",
    "description": "Myrcene is one of the most common terpenes in cannabis. It has an earthy, musky aroma with notes of cloves and is known for its sedative and muscle-relaxing properties.",
    "aroma": "Earthy, Musky",
    "effects": ["relaxing", "sedative", "calming"],
    "sources": ["Mango", "Lemongrass", "Thyme", "Hops"],
    "boilingPoint": 167,
    "molecularFormula": "C10H16"
  },
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Pinene",
    "description": "Alpha-pinene and beta-pinene are the two main varieties of this terpene. Pinene has a fresh, piney aroma and is associated with alertness and memory retention.",
    "aroma": "Pine, Fresh",
    "effects": ["alertness", "memory-enhancement", "focus"],
    "sources": ["Pine needles", "Rosemary", "Basil", "Parsley"],
    "boilingPoint": 155
  }
]
```

### YAML Format (`/data/terpenes.yaml`)

```yaml
- id: 550e8400-e29b-41d4-a716-446655440000
  name: Limonene
  description: Limonene is a monoterpene commonly found in citrus fruits. It has a strong citrus aroma and is associated with mood elevation and stress relief.
  aroma: Citrus
  effects:
    - uplifting
    - stress-relief
    - focus
  sources:
    - Lemon peel
    - Orange peel
    - Grapefruit
    - Juniper
  boilingPoint: 176
  molecularFormula: C10H16

- id: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
  name: Myrcene
  description: Myrcene is one of the most common terpenes in cannabis. It has an earthy, musky aroma with notes of cloves and is known for its sedative and muscle-relaxing properties.
  aroma: Earthy, Musky
  effects:
    - relaxing
    - sedative
    - calming
  sources:
    - Mango
    - Lemongrass
    - Thyme
    - Hops
  boilingPoint: 167
  molecularFormula: C10H16
```

---

## Validation Rules

### Field-Level Validation

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| `id` | Yes | string | Valid UUID v4, unique across dataset |
| `name` | Yes | string | 1-100 chars, unique across dataset |
| `description` | Yes | string | 10-1000 chars |
| `aroma` | Yes | string | 1-100 chars |
| `effects` | Yes | string[] | 1-10 items, each item 1-50 chars |
| `sources` | Yes | string[] | 1-20 items, each item 1-100 chars |
| `boilingPoint` | No | number | -200 to 300 (Celsius) |
| `molecularFormula` | No | string | Valid chemical formula pattern |

### Dataset-Level Validation

- Array must contain at least 1 terpene
- Maximum dataset size: 500 terpenes (performance constraint)
- All `id` values must be unique
- All `name` values must be unique
- All effect names referenced must be consistent (case-insensitive)

---

## Error Handling

### Validation Errors

**Schema Validation Failure:**

```typescript
{
  "error": "SCHEMA_VALIDATION_ERROR",
  "message": "Data does not conform to expected schema",
  "details": [
    {
      "path": "[0].effects",
      "message": "Must contain at least 1 effect"
    }
  ]
}
```

**Missing Required Field:**

```typescript
{
  "error": "MISSING_FIELD",
  "message": "Required field missing",
  "field": "name",
  "terpeneId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Duplicate Entry:**

```typescript
{
  "error": "DUPLICATE_ENTRY",
  "message": "Duplicate terpene name or ID found",
  "field": "name",
  "value": "Limonene",
  "conflictingIds": ["550e8400-e29b-41d4-a716-446655440000", "7c9e6679-7425-40de-944b-e07fc1f90ae7"]
}
```

### File Loading Errors

- **File Not Found**: Fallback from JSON to YAML, then show error
- **Parse Error**: Show user-friendly error message
- **Network Error**: Show retry option

---

## Effect Configuration Contract

Since effects are referenced from terpene data, a separate configuration file defines effect metadata.

**File**: `/src/config/effects.config.ts`

```typescript
export interface EffectConfig {
  /** Unique effect identifier (lowercase, kebab-case) */
  name: string;

  /** Localized display names */
  displayName: {
    en: string;
    de: string;
  };

  /** Color for visualization (hex code, WCAG AA compliant) */
  color: string;

  /** Optional icon identifier */
  icon?: string;
}

export const EFFECT_CONFIGS: EffectConfig[] = [
  {
    name: "uplifting",
    displayName: { en: "Uplifting", de: "Aufmunternd" },
    color: "#FFC107" // Amber
  },
  {
    name: "stress-relief",
    displayName: { en: "Stress Relief", de: "Stressabbau" },
    color: "#4CAF50" // Green
  },
  {
    name: "focus",
    displayName: { en: "Focus", de: "Konzentration" },
    color: "#2196F3" // Blue
  },
  {
    name: "relaxing",
    displayName: { en: "Relaxing", de: "Entspannend" },
    color: "#9C27B0" // Purple
  },
  {
    name: "sedative",
    displayName: { en: "Sedative", de: "Beruhigend" },
    color: "#673AB7" // Deep Purple
  },
  {
    name: "calming",
    displayName: { en: "Calming", de: "Besänftigend" },
    color: "#00BCD4" // Cyan
  },
  {
    name: "alertness",
    displayName: { en: "Alertness", de: "Wachsamkeit" },
    color: "#FF5722" // Deep Orange
  },
  {
    name: "memory-enhancement",
    displayName: { en: "Memory Enhancement", de: "Gedächtnisverbesserung" },
    color: "#795548" // Brown
  }
];
```

---

## Service Interfaces

### DataLoaderService

**Purpose**: Load and validate terpene data from static files

```typescript
interface DataLoaderService {
  /**
   * Load terpene data from JSON or YAML file
   * @returns Promise resolving to validated terpene array
   * @throws DataLoadError if loading or validation fails
   */
  loadTerpenes(): Promise<Terpene[]>;

  /**
   * Validate terpene dataset against schema
   * @param data - Raw data to validate
   * @returns Validated terpene array
   * @throws ValidationError if data is invalid
   */
  validateTerpenes(data: unknown): Terpene[];
}
```

### FilterService

**Purpose**: Filter and search terpene data

```typescript
interface FilterService {
  /**
   * Filter terpenes by search query and effect filters
   * @param terpenes - Full terpene dataset
   * @param query - Search query (searches name, aroma, effects)
   * @param effects - Effect names to filter by
   * @param mode - 'any' or 'all' effects matching
   * @returns Filtered terpene array
   */
  filterTerpenes(
    terpenes: Terpene[],
    query: string,
    effects: string[],
    mode: 'any' | 'all'
  ): Terpene[];

  /**
   * Sort terpenes by specified field and direction
   * @param terpenes - Terpenes to sort
   * @param sortBy - Field to sort by
   * @param direction - Sort direction
   * @returns Sorted terpene array
   */
  sortTerpenes(
    terpenes: Terpene[],
    sortBy: 'name' | 'aroma' | 'effects' | 'sources',
    direction: 'asc' | 'desc'
  ): Terpene[];
}
```

### ColorService

**Purpose**: Manage effect colors with Material UI theme integration

```typescript
interface ColorService {
  /**
   * Get color for an effect category
   * @param effectName - Name of the effect
   * @returns Hex color code
   * @throws Error if effect not found
   */
  getEffectColor(effectName: string): string;

  /**
   * Get all effect colors as a map
   * @returns Map of effect names to colors
   */
  getEffectColorMap(): Map<string, string>;

  /**
   * Validate that color meets WCAG AA contrast requirements
   * @param color - Hex color code
   * @param background - Background color (light or dark theme)
   * @returns true if contrast ratio >= 4.5:1
   */
  validateContrast(color: string, background: 'light' | 'dark'): boolean;
}
```

---

## Performance Contract

### Load Time

- **Initial data load**: < 500ms for 500 terpenes
- **Parsing and validation**: < 200ms
- **Total time to interactive**: < 1000ms

### File Size

- **Maximum dataset size**: 500 terpenes
- **Expected file size**: ~100-200KB uncompressed
- **Gzipped size**: ~20-40KB

### Memory Usage

- **Loaded dataset in memory**: < 5MB
- **Including derived state**: < 10MB

---

## Versioning

### Data Format Version

Current version: `1.0.0`

Breaking changes require major version bump and migration guide.

### Backward Compatibility

- Adding optional fields: Minor version bump
- Adding new effect types: Minor version bump
- Changing required fields: Major version bump
- Removing fields: Major version bump

---

## Testing Contract

### Unit Test Coverage

```typescript
describe('Terpene Data Contract', () => {
  test('validates correct terpene object', () => {
    const terpene: Terpene = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Limonene',
      description: 'A citrus terpene',
      aroma: 'Citrus',
      effects: ['uplifting'],
      sources: ['Lemon peel']
    };
    expect(validateTerpene(terpene)).toBe(true);
  });

  test('rejects terpene with missing required field', () => {
    const invalidTerpene = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Limonene'
      // missing other required fields
    };
    expect(() => validateTerpene(invalidTerpene)).toThrow();
  });

  test('rejects terpene with invalid UUID', () => {
    const invalidTerpene = {
      id: 'not-a-uuid',
      name: 'Limonene',
      description: 'A citrus terpene',
      aroma: 'Citrus',
      effects: ['uplifting'],
      sources: ['Lemon peel']
    };
    expect(() => validateTerpene(invalidTerpene)).toThrow();
  });
});
```

---

## Migration Path

If the data format changes in the future:

1. Version the data files (e.g., `terpenes.v1.json`, `terpenes.v2.json`)
2. Provide migration utility to convert old format to new
3. Support both formats during transition period
4. Document breaking changes in changelog

---

## References

- Data Model: `data-model.md`
- Feature Specification: `spec.md`
- JSON Schema Specification: <https://json-schema.org/>
- UUID v4 Specification: <https://tools.ietf.org/html/rfc4122>
