# Research: Table Filter Bar Extension Technical Decisions

**Feature**: Table Filter Bar Extension  
**Branch**: `005-table-filter-bar`  
**Created**: 2025-10-28

## Overview

This document consolidates research findings for extending the existing terpene filter functionality to support multi-attribute search across name, effects, aroma, taste, and therapeutic properties. All decisions prioritize backward compatibility, performance, and the existing static-first architecture.

## 1. Multi-Attribute Search Implementation

### Decision: Extend Existing `matchesSearchQuery()` Function

**Rationale**:
- The existing `filterService.ts` already has a `matchesSearchQuery()` function that searches across name, aroma, and effects
- Current implementation: `name.includes(query) || aroma.includes(query) || effects.includes(query)`
- Extension approach maintains backward compatibility and follows existing patterns
- No new abstractions needed - simple extension of boolean OR logic

**Implementation Strategy**:
```typescript
// BEFORE (current):
function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  const name = terpene.name.toLowerCase();
  const aroma = terpene.aroma.toLowerCase();
  const effects = terpene.effects.map((e) => e.toLowerCase()).join(' ');
  return name.includes(query) || aroma.includes(query) || effects.includes(query);
}

// AFTER (extended):
function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  const name = terpene.name.toLowerCase();
  const aroma = terpene.aroma.toLowerCase();
  const taste = (terpene.taste || '').toLowerCase();
  const therapeuticProps = (terpene.therapeuticProperties || []).map((t) => t.toLowerCase()).join(' ');
  const effects = terpene.effects.map((e) => e.toLowerCase()).join(' ');
  
  return name.includes(query) || 
         aroma.includes(query) || 
         taste.includes(query) ||
         therapeuticProps.includes(query) ||
         effects.includes(query);
}
```

**Alternatives Considered**:
- **Option A**: Create separate search functions for each attribute
  - Rejected: Violates DRY principle, increases maintenance burden
- **Option B**: Use a weighted search algorithm (exact match > partial match)
  - Rejected: Spec clarifies "maintain original table order" - no ranking needed
- **Option C**: Implement fuzzy matching or Levenshtein distance
  - Rejected: Unnecessary complexity for 100-200 terpenes, no requirement for spell correction

**Performance Impact**: Negligible. Adding 2 more string comparisons per terpene (~2-5ms for 200 terpenes)

---

## 2. Data Model Fields for New Search Attributes

### Decision: Use Existing `taste` and `therapeuticProperties` Fields from Terpene Model

**Rationale**:
- `terpene-database.json` already contains these fields:
  - `taste`: String field (e.g., "Citrus, sweet")
  - `therapeuticProperties`: Array of strings (e.g., ["Anti-inflammatory", "Analgesic"])
- No schema changes required
- Fields follow same pattern as existing `aroma` (string) and `effects` (array)

**Data Structure Verification**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Limonene",
  "aroma": "Citrus, lemon, fresh",
  "taste": "Citrus, sweet, tangy",
  "effects": ["Mood enhancing", "Energizing"],
  "therapeuticProperties": ["Anti-inflammatory", "Antioxidant", "Anxiolytic"]
}
```

**Alternatives Considered**:
- **Option A**: Create a unified `searchableAttributes` array combining all fields
  - Rejected: Requires data transformation, violates existing schema, unnecessary complexity
- **Option B**: Create a normalized search index on component mount
  - Rejected: Premature optimization for small dataset, increases memory footprint

---

## 3. Minimum Character Count Implementation

### Decision: Implement 2-Character Minimum via Short-Circuit in `applyEffectFilters()`

**Rationale**:
- Spec clarifies: "2 characters minimum" before filter activates
- Current implementation already has short-circuit logic for empty query
- Extension: Add length check before calling `matchesSearchQuery()`
- Maintains performance by avoiding unnecessary iteration

**Implementation Strategy**:
```typescript
// In applyEffectFilters():
if (filterState.searchQuery && filterState.searchQuery.trim()) {
  const query = filterState.searchQuery.trim().toLowerCase();
  
  // NEW: Skip filtering if less than 2 characters
  if (query.length >= 2) {
    filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
  }
  // If < 2 characters: show all results (no filtering applied)
}
```

**User Experience**: When user types 1 character, all terpenes remain visible. Filter activates at 2 characters.

**Alternatives Considered**:
- **Option A**: Implement in SearchBar component to prevent onChange calls
  - Rejected: Separates validation from business logic, makes testing harder
- **Option B**: Show a UI hint "Type 2+ characters to filter"
  - Rejected: Not required by spec, placeholder text already guides user

---

## 4. Debounce Delay Configuration

### Decision: Maintain Existing 300ms Debounce in SearchBar Component

**Rationale**:
- SearchBar already implements 300ms debounce (default value)
- Spec confirms: "300ms delay" matches existing implementation
- No changes needed - already optimal balance between responsiveness and performance

**Current Implementation**:
```typescript
// SearchBar.tsx already has:
debounceMs?: number;  // default: 300

debounceTimerRef.current = setTimeout(() => {
  const sanitized = sanitize(newValue);
  onChange(sanitized);
}, debounceMs);
```

**No Action Required**: Existing implementation already meets specification.

---

## 5. Maximum Character Limit Implementation

### Decision: Add `maxLength` Prop to SearchBar (Already Supported)

**Rationale**:
- SearchBar component already has `maxLength` prop (unused in current implementation)
- HTML `input` element natively supports `maxLength` attribute
- Spec requires: "100 characters maximum"

**Implementation Strategy**:
```typescript
// In Home.tsx or parent component:
<SearchBar
  value={searchQuery}
  onChange={handleSearchChange}
  placeholder={t('search.placeholder')}
  maxLength={100}  // NEW: Add this prop
/>
```

**Browser Support**: Native `maxLength` supported by all target browsers (Chrome 90+, Firefox 88+, Safari 14+)

**Alternatives Considered**:
- **Option A**: Implement custom validation in onChange handler
  - Rejected: Reinvents browser native functionality
- **Option B**: Show character count indicator
  - Rejected: Not required by spec, adds UI complexity

---

## 6. Empty State Message Implementation

### Decision: Update Existing Empty State Logic in TerpeneTable

**Rationale**:
- TerpeneTable already shows empty state when `terpenes.length === 0`
- Current message: "No terpenes to display"
- Spec requires: "No match found for your filter"
- Update translation keys to use context-aware messaging

**Implementation Strategy**:
```typescript
// TerpeneTable.tsx already has:
if (terpenes.length === 0) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary">
        {t('table.noTerpenes', 'No terpenes to display')}
      </Typography>
    </Box>
  );
}
```

**Enhancement Needed**: Pass filter context to distinguish between "no data" vs "no matches"

**Alternatives Considered**:
- **Option A**: Create separate empty state component
  - Rejected: Overengineering for simple text change
- **Option B**: Show last valid results with overlay message
  - Rejected: Confusing UX, not specified in requirements

---

## 7. Placeholder Text Updates

### Decision: Update Translation Keys for Multi-Attribute Search

**Rationale**:
- SearchBar already uses i18next for placeholder: `t('search.placeholder')`
- Current text: "Search terpenes by name, aroma, or effects..."
- Required text: "Filter terpenes by name, effect, aroma, taste..."
- Requires updates to both `en/translation.json` and `de/translation.json`

**Implementation Strategy**:
```json
// src/i18n/locales/en/translation.json
{
  "search": {
    "placeholder": "Filter terpenes by name, effect, aroma, taste, therapeutic properties...",
    "ariaLabel": "Filter terpenes by multiple attributes",
    "clear": "Clear filter"
  }
}

// src/i18n/locales/de/translation.json
{
  "search": {
    "placeholder": "Terpene nach Name, Effekt, Aroma, Geschmack, therapeutischen Eigenschaften filtern...",
    "ariaLabel": "Terpene nach mehreren Attributen filtern",
    "clear": "Filter löschen"
  }
}
```

**Accessibility Note**: Update `ariaLabel` to reflect multi-attribute capability for screen readers.

---

## 8. Filter Bar Location Verification

### Decision: Verify Current Location, Relocate if Needed

**Rationale**:
- Spec requires: "filter bar in filter area (not in header)"
- Current implementation needs verification
- If SearchBar is in Header component, move to filter area in Home.tsx

**Verification Steps**:
1. Check `src/components/layout/Header.tsx` for SearchBar usage
2. Check `src/pages/Home.tsx` for filter area structure
3. If SearchBar is in Header, refactor to place in filter section of Home.tsx

**Current Architecture**: Based on code review, SearchBar appears to be used in Home.tsx filter area already. Verification task needed during implementation.

**No Major Changes Expected**: Likely already correct based on existing layout.

---

## 9. Maintain Original Table Order

### Decision: No Sorting Logic Changes Required

**Rationale**:
- Spec clarifies: "Maintain original table order (no re-sorting)"
- Current `filterService.ts` returns filtered array without sorting
- TerpeneTable component has sorting controls, but those are user-initiated, not filter-initiated
- Filter operation should preserve original data order

**Implementation Verification**:
```typescript
// Current implementation already correct:
export function applyEffectFilters(terpenes: Terpene[], filterState: FilterState): Terpene[] {
  let filtered = [...terpenes];  // Preserves original order
  
  // Apply filters (order maintained)
  filtered = filtered.filter(...);
  
  return filtered;  // Returns in original order
}
```

**No Action Required**: Existing implementation already meets specification.

---

## 10. TDD Protocol: RED, GREEN, REFACTOR

### Decision: Follow Established Testing Patterns in Project

**Rationale**:
- Project already uses TDD with Vitest for unit tests
- Existing test files follow RED-GREEN-REFACTOR cycle
- Example: `tests/unit/components/SearchBar.test.tsx` and `tests/unit/services/filterService.test.ts`

**Testing Strategy**:

**RED Phase** (Write failing tests first):
1. Test `matchesSearchQuery()` with taste field
2. Test `matchesSearchQuery()` with therapeuticProperties field
3. Test 2-character minimum in `applyEffectFilters()`
4. Test 100-character maximum in SearchBar
5. Test placeholder text update

**GREEN Phase** (Implement minimum code to pass):
1. Extend `matchesSearchQuery()` function
2. Add length check in `applyEffectFilters()`
3. Pass `maxLength={100}` to SearchBar
4. Update translation files

**REFACTOR Phase** (Improve code quality):
1. Extract constants (e.g., `MIN_SEARCH_LENGTH = 2`, `MAX_SEARCH_LENGTH = 100`)
2. Add JSDoc comments for new logic
3. Ensure test coverage ≥80%

**Existing Tests to Refactor/Extend**:
- `tests/unit/services/filterService.test.ts` - Add multi-attribute search tests
- `tests/unit/components/SearchBar.test.tsx` - Add maxLength and 2-char min tests
- `tests/integration/filter-flow.test.ts` - Add end-to-end multi-attribute scenarios
- `tests/e2e/filter-terpenes.spec.ts` - Add Playwright E2E for new functionality

---

## 11. Backward Compatibility Strategy

### Decision: Additive Changes Only - No Breaking Changes

**Rationale**:
- Spec explicitly states: "Maintain existing name filtering capability without any regression"
- All changes are additive (extending search, not modifying existing logic)
- Existing tests must continue to pass

**Compatibility Checklist**:
- ✅ Existing `matchesSearchQuery()` name/aroma/effects logic unchanged (only extended)
- ✅ SearchBar API unchanged (maxLength prop already exists)
- ✅ FilterState interface unchanged
- ✅ No data model schema changes
- ✅ All existing unit tests continue to pass without modification

**Validation**: Run existing test suite before implementation to establish baseline.

---

## Summary of Technical Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Multi-Attribute Search** | Extend `matchesSearchQuery()` | Follows existing patterns, minimal changes |
| **Data Fields** | Use existing `taste` and `therapeuticProperties` | No schema changes needed |
| **Minimum Characters** | 2-character check in `applyEffectFilters()` | Business logic layer, testable |
| **Debounce Delay** | Keep existing 300ms | Already optimal, no changes needed |
| **Maximum Length** | Use existing `maxLength` prop | Native HTML support, simple |
| **Empty State** | Update translation keys | Context-aware messaging |
| **Placeholder Text** | Update i18next translations | Multi-language support maintained |
| **Filter Bar Location** | Verify current placement | Likely already correct |
| **Table Ordering** | No changes | Already maintains original order |
| **Testing Approach** | TDD with existing patterns | Follows project standards |
| **Compatibility** | Additive changes only | Zero breaking changes |

**Implementation Complexity**: Low. Extension of existing functionality with established patterns.

**Estimated Effort**: 3-5 hours (2 hours implementation, 1-2 hours testing, 1 hour documentation/review)

**Risk Assessment**: Low. All changes are well-understood, tested patterns with strong backward compatibility.

