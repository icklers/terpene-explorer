# Service Contract: Filter Service Extension

**Feature**: Table Filter Bar Extension  
**Module**: `src/services/filterService.ts`  
**Created**: 2025-10-28

## Overview

This contract defines the extended behavior of the `filterService` module to support multi-attribute search across terpene name, effects, aroma, taste, and therapeutic properties.

## Function Signatures

### `matchesSearchQuery()` - Extended

**Purpose**: Check if a terpene matches the search query across multiple attributes

**Signature**:
```typescript
function matchesSearchQuery(terpene: Terpene, query: string): boolean
```

**Parameters**:
- `terpene: Terpene` - The terpene object to check
- `query: string` - Normalized search query (lowercase, sanitized)

**Returns**: `boolean`
- `true` if terpene matches query in ANY searchable attribute
- `false` otherwise

**Search Behavior**:
1. Searches across 5 attributes (OR logic):
   - `terpene.name` (string)
   - `terpene.aroma` (string)
   - `terpene.taste` (string, optional)
   - `terpene.effects` (string array)
   - `terpene.therapeuticProperties` (string array, optional)
2. Case-insensitive substring matching
3. Null-safe: handles undefined `taste` and `therapeuticProperties`
4. Short-circuit: returns `true` on first match

**Examples**:
```typescript
const terpene: Terpene = {
  id: "1",
  name: "Limonene",
  aroma: "Citrus",
  taste: "Tangy",
  effects: ["Energizing"],
  therapeuticProperties: ["Anti-inflammatory"],
  // ... other fields
};

matchesSearchQuery(terpene, "citrus");        // true (matches aroma)
matchesSearchQuery(terpene, "tangy");         // true (matches taste)
matchesSearchQuery(terpene, "energizing");    // true (matches effects)
matchesSearchQuery(terpene, "anti-inflam");   // true (matches therapeutic, partial)
matchesSearchQuery(terpene, "limo");          // true (matches name, partial)
matchesSearchQuery(terpene, "woody");         // false (no match)
```

**Performance**:
- Expected: <1ms per terpene
- Worst case: O(n) where n = total characters in all searchable fields

---

### `applyEffectFilters()` - Extended

**Purpose**: Apply search and effect filters to terpene array

**Signature**:
```typescript
export function applyEffectFilters(
  terpenes: Terpene[], 
  filterState: FilterState
): Terpene[]
```

**Parameters**:
- `terpenes: Terpene[]` - Full terpene dataset
- `filterState: FilterState` - Current filter state including `searchQuery`

**Returns**: `Terpene[]` - Filtered array

**Extended Behavior**:
1. If `searchQuery` exists and length >= 2:
   - Apply `matchesSearchQuery()` to each terpene
   - Filter out non-matching terpenes
2. If `searchQuery` length < 2:
   - Skip search filtering (show all results)
3. Then apply effect category filters (existing logic)
4. Maintain original array order (no sorting)

**Example**:
```typescript
const filterState: FilterState = {
  searchQuery: "anti-inflammatory",  // >= 2 chars
  selectedEffects: [],
  effectFilterMode: 'any',
  categoryFilters: []
};

const filtered = applyEffectFilters(allTerpenes, filterState);
// Returns terpenes where:
// - name contains "anti-inflammatory" OR
// - aroma contains "anti-inflammatory" OR
// - taste contains "anti-inflammatory" OR
// - effects array includes "anti-inflammatory" OR
// - therapeuticProperties array includes "anti-inflammatory"
```

**Performance**:
- Target: <50ms for 500 terpenes
- Measured: <300ms for 200 terpenes (per spec)

---

### `filterTerpenes()` - No Changes

**Purpose**: Alias for `applyEffectFilters()` (existing)

**Signature**:
```typescript
export function filterTerpenes(
  terpenes: Terpene[], 
  filterState: FilterState
): Terpene[]
```

**Status**: No changes required. Delegates to `applyEffectFilters()`.

---

## Configuration Constants

### New Constants (Recommended)

```typescript
/** Minimum search query length before filtering activates */
export const MIN_SEARCH_LENGTH = 2;

/** Maximum search query length (enforced at UI level) */
export const MAX_SEARCH_LENGTH = 100;
```

**Usage**:
```typescript
// In applyEffectFilters():
if (filterState.searchQuery && filterState.searchQuery.trim()) {
  const query = filterState.searchQuery.trim().toLowerCase();
  
  if (query.length >= MIN_SEARCH_LENGTH) {
    filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
  }
}
```

---

## Error Handling

### Null/Undefined Safety

| Scenario | Behavior |
|----------|----------|
| `terpene.taste` is `undefined` | Treat as empty string (no match) |
| `terpene.therapeuticProperties` is `undefined` | Treat as empty array (no match) |
| `filterState.searchQuery` is empty string | Skip search filtering |
| `filterState.searchQuery` is `null`/`undefined` | Skip search filtering |

### Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Query length = 0 | Show all terpenes (no filtering) |
| Query length = 1 | Show all terpenes (below minimum) |
| Query length = 2 | Apply filtering |
| Query length > 100 | Truncated at UI level (SearchBar `maxLength`) |
| Special characters in query | Sanitized by `sanitizeSearchQuery()` before reaching service |
| Unicode characters | Supported (UTF-8 encoding) |
| Very long taste/therapeutic strings | Performance acceptable for <1000 char fields |

---

## Testing Contract

### Unit Test Requirements

**Test File**: `tests/unit/services/filterService.test.ts`

**Required Test Cases**:
1. ✅ Search by name (existing - should still pass)
2. ✅ Search by aroma (existing - should still pass)
3. ✅ Search by effects (existing - should still pass)
4. 🆕 Search by taste field
5. 🆕 Search by therapeuticProperties field
6. 🆕 Search with 1 character (no filtering applied)
7. 🆕 Search with 2 characters (filtering applied)
8. 🆕 Search with undefined taste field (graceful handling)
9. 🆕 Search with undefined therapeuticProperties field (graceful handling)
10. 🆕 Search matching multiple attributes simultaneously
11. 🆕 Partial matching in taste field
12. 🆕 Partial matching in therapeuticProperties array
13. ✅ Case-insensitive matching (existing - verify still works)

**TDD Workflow**:
1. **RED**: Write failing tests for new behavior
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Extract constants, improve readability

### Integration Test Requirements

**Test File**: `tests/integration/filter-flow.test.ts`

**Required Scenarios**:
1. 🆕 User types 2+ characters matching taste field
2. 🆕 User types 2+ characters matching therapeutic property
3. 🆕 User types 1 character (all results visible)
4. 🆕 Combined: search + effect filters both active

---

## Backward Compatibility Guarantee

### Existing Behavior Preserved

| Existing Functionality | Status |
|------------------------|--------|
| Search by name | ✅ Unchanged |
| Search by aroma | ✅ Unchanged |
| Search by effects | ✅ Unchanged |
| Effect category filters | ✅ Unchanged |
| AND/OR effect filter mode | ✅ Unchanged |
| Original array order maintained | ✅ Unchanged |
| Empty query shows all results | ✅ Unchanged |

### API Stability

- **No breaking changes** to function signatures
- **No removal** of existing functions
- **No modification** of existing parameters
- **Additive only**: new search attributes, new constants

### Regression Testing

All existing tests in `tests/unit/services/filterService.test.ts` **MUST** continue to pass without modification. This validates backward compatibility.

---

## Performance Contract

### Benchmarks

| Metric | Target | Notes |
|--------|--------|-------|
| Single terpene search | <1ms | 5 attribute checks |
| 100 terpenes search | <20ms | Typical small dataset |
| 500 terpenes search | <50ms | Spec maximum |
| 200 terpenes with filters | <300ms | Includes debounce + render |

### Optimization Strategy

- Short-circuit on first match (OR logic)
- No regex or complex parsing
- Simple `.includes()` for substring matching
- No data structure transformations

---

## Dependencies

### Internal

- `../models/FilterState` - FilterState interface
- `../models/Terpene` - Terpene interface
- (Implicit) `sanitizeSearchQuery()` - Applied before service call

### External

- None (pure TypeScript, no external libraries)

---

## Change Summary

| Component | Change Type | Details |
|-----------|-------------|---------|
| `matchesSearchQuery()` | Modified | Add taste + therapeuticProperties search |
| `applyEffectFilters()` | Modified | Add 2-character minimum check |
| `filterTerpenes()` | Unchanged | Alias function preserved |
| Constants | New | `MIN_SEARCH_LENGTH`, `MAX_SEARCH_LENGTH` |
| Tests | Extended | 9 new test cases |

**Complexity Impact**: Low. Extends existing function with 2 additional OR conditions.

