# Data Model: Table Filter Bar Extension

**Feature**: Table Filter Bar Extension  
**Branch**: `005-table-filter-bar`  
**Created**: 2025-10-28

## Overview

This document describes the data model changes (if any) required for the multi-attribute filter bar extension. Since this feature extends existing filtering logic without modifying the core data structure, **no schema changes are required**.

## Existing Data Model (No Changes)

### Terpene Entity

The existing `Terpene` interface already contains all required fields for multi-attribute search:

```typescript
export interface Terpene {
  id: string;                           // UUID v4
  name: string;                          // Searchable (existing)
  description: string;                   // Not searchable
  aroma: string;                         // Searchable (existing)
  taste?: string;                        // Searchable (NEW for this feature)
  effects: string[];                     // Searchable (existing)
  therapeuticProperties?: string[];      // Searchable (NEW for this feature)
  sources: string[];                     // Not searchable
  boilingPoint?: number;                 // Not searchable
  molecularFormula?: string;             // Not searchable
}
```

**Key Points**:
- `taste` field already exists as optional string (e.g., "Citrus, sweet, tangy")
- `therapeuticProperties` already exists as optional string array (e.g., ["Anti-inflammatory", "Analgesic"])
- No new fields required
- No schema migrations needed

### FilterState Interface (No Changes)

The existing `FilterState` interface remains unchanged:

```typescript
export interface FilterState {
  searchQuery: string;                   // Used for multi-attribute search
  selectedEffects: string[];             // Effect category filters
  effectFilterMode: 'any' | 'all';       // AND/OR logic for effects
  categoryFilters: string[];             // Effect category filters
}
```

**Key Points**:
- `searchQuery` already stores the filter text
- No new properties needed
- Multi-attribute search logic is encapsulated in `filterService.ts`

## Data Flow

### Filtering Pipeline

```
User Input (SearchBar)
  ↓
  debounce (300ms)
  ↓
  sanitization (XSS prevention)
  ↓
  FilterState.searchQuery updated
  ↓
  applyEffectFilters() called
  ↓
  matchesSearchQuery() checks:
    - terpene.name
    - terpene.aroma
    - terpene.taste (NEW)
    - terpene.effects
    - terpene.therapeuticProperties (NEW)
  ↓
  Filtered Results (Terpene[])
  ↓
  TerpeneTable renders
```

### Searchable Attributes

| Attribute | Type | Example | Notes |
|-----------|------|---------|-------|
| `name` | string | "Limonene" | Existing, always present |
| `aroma` | string | "Citrus, lemon" | Existing, always present |
| `taste` | string? | "Sweet, tangy" | Optional, NEW search target |
| `effects` | string[] | ["Energizing", "Mood enhancing"] | Existing array |
| `therapeuticProperties` | string[]? | ["Anti-inflammatory", "Anxiolytic"] | Optional array, NEW search target |

**Null/Undefined Handling**: Optional fields (`taste`, `therapeuticProperties`) are handled gracefully with fallback to empty string/array.

## Validation Rules

### Search Query Constraints

| Rule | Value | Enforcement |
|------|-------|-------------|
| Minimum length | 2 characters | `applyEffectFilters()` short-circuit |
| Maximum length | 100 characters | HTML `input` `maxLength` + SearchBar prop |
| Character encoding | UTF-8 | Native browser support |
| XSS sanitization | Applied | `sanitizeSearchQuery()` utility |
| Case sensitivity | Insensitive | `.toLowerCase()` applied to all comparisons |

### Data Quality Assumptions

- All terpenes have `name`, `aroma`, and `effects` (required fields)
- `taste` may be null/undefined for some terpenes (backward compatibility)
- `therapeuticProperties` may be null/undefined or empty array
- Search should work even if optional fields are missing

## Performance Considerations

### Search Complexity

- **Algorithm**: Simple substring matching (O(n × m) where n = terpene count, m = query length)
- **Dataset Size**: 100-500 terpenes (typical), up to 200 in performance tests
- **Expected Latency**: <50ms for 500 terpenes with 5-attribute search
- **Optimization**: Short-circuit on first match per terpene (OR logic)

### Memory Footprint

- No additional data structures required
- No search indices or caches
- Filtered array is temporary (garbage collected after render)
- **Estimated Impact**: ~0KB (reuses existing data)

## Data Integrity

### Backward Compatibility

- Terpenes without `taste` field: Filter treats as empty string (no match)
- Terpenes without `therapeuticProperties`: Filter treats as empty array (no match)
- Existing name/aroma/effects search behavior: Unchanged
- No database migrations needed (static JSON file)

### Testing Data Requirements

For comprehensive testing, ensure test data includes:

1. Terpene with all searchable fields populated
2. Terpene with only required fields (no taste/therapeutic properties)
3. Terpene with `taste` but no `therapeuticProperties`
4. Terpene with `therapeuticProperties` but no `taste`
5. Edge cases: empty strings, very long strings, special characters

**Example Test Data**:

```json
[
  {
    "id": "test-001",
    "name": "Test Terpene A",
    "aroma": "Floral",
    "taste": "Sweet",
    "effects": ["Relaxing"],
    "therapeuticProperties": ["Anti-inflammatory"],
    "description": "Full data",
    "sources": ["Test source"]
  },
  {
    "id": "test-002",
    "name": "Test Terpene B",
    "aroma": "Woody",
    "effects": ["Energizing"],
    "description": "Minimal data (no taste/therapeutic)",
    "sources": ["Test source"]
  }
]
```

## Data Model Change Summary

**Status**: ✅ No Changes Required

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `Terpene` interface | None | All fields already exist |
| `FilterState` interface | None | Existing `searchQuery` field sufficient |
| `terpene-database.json` | None | Data already contains required fields |
| Database schema | N/A | Static JSON, no migrations |
| TypeScript types | None | No new types needed |

**Conclusion**: The existing data model already supports all requirements for multi-attribute filtering. No schema changes, migrations, or new data structures are needed. This demonstrates excellent forward compatibility in the original data model design.

