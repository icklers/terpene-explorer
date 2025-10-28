# Quickstart Guide: Table Filter Bar Extension

**Feature**: Table Filter Bar Extension  
**Branch**: `005-table-filter-bar`  
**Created**: 2025-10-28  
**Estimated Time**: 3-5 hours

## Prerequisites

- ✅ Branch `005-table-filter-bar` checked out
- ✅ Dependencies installed (`pnpm install`)
- ✅ Existing tests pass (`pnpm test`)
- ✅ Dev server runs (`pnpm dev`)

## Overview

This guide walks through implementing multi-attribute filtering for the terpene filter bar following the TDD protocol (RED → GREEN → REFACTOR).

## Implementation Steps

### Step 1: Write Failing Tests (RED Phase) - 30 minutes

#### 1.1: Filter Service Tests

**File**: `tests/unit/services/filterService.test.ts`

Add new test suite:

```typescript
describe('matchesSearchQuery - Extended Multi-Attribute Search', () => {
  const mockTerpene: Terpene = {
    id: 'test-001',
    name: 'Test Terpene',
    aroma: 'Citrus',
    taste: 'Sweet, tangy',
    effects: ['Energizing', 'Mood enhancing'],
    therapeuticProperties: ['Anti-inflammatory', 'Antioxidant'],
    description: 'Test description',
    sources: ['Test source'],
  };

  it('should match search query in taste field', () => {
    const result = matchesSearchQuery(mockTerpene, 'sweet');
    expect(result).toBe(true);
  });

  it('should match search query in therapeuticProperties field', () => {
    const result = matchesSearchQuery(mockTerpene, 'anti-inflammatory');
    expect(result).toBe(true);
  });

  it('should match partial text in therapeuticProperties', () => {
    const result = matchesSearchQuery(mockTerpene, 'anti');
    expect(result).toBe(true);
  });

  it('should handle terpene with undefined taste gracefully', () => {
    const terpeneNoTaste = { ...mockTerpene, taste: undefined };
    const result = matchesSearchQuery(terpeneNoTaste, 'sweet');
    expect(result).toBe(false);
  });

  it('should handle terpene with undefined therapeuticProperties gracefully', () => {
    const terpeneNoTherapeutic = { ...mockTerpene, therapeuticProperties: undefined };
    const result = matchesSearchQuery(terpeneNoTherapeutic, 'anti');
    expect(result).toBe(false);
  });
});

describe('applyEffectFilters - 2-Character Minimum', () => {
  it('should not filter when query length is 1', () => {
    const filterState: FilterState = {
      searchQuery: 'a',
      selectedEffects: [],
      effectFilterMode: 'any',
      categoryFilters: [],
    };
    const result = applyEffectFilters(mockTerpenes, filterState);
    expect(result).toHaveLength(mockTerpenes.length); // All terpenes visible
  });

  it('should filter when query length is 2+', () => {
    const filterState: FilterState = {
      searchQuery: 'ci',
      selectedEffects: [],
      effectFilterMode: 'any',
      categoryFilters: [],
    };
    const result = applyEffectFilters(mockTerpenes, filterState);
    expect(result.length).toBeLessThan(mockTerpenes.length); // Some filtered out
  });
});
```

**Run Tests** (should FAIL):
```bash
pnpm vitest tests/unit/services/filterService.test.ts --run
```

#### 1.2: SearchBar Component Tests

**File**: `tests/unit/components/SearchBar.test.tsx`

Add new test cases:

```typescript
describe('SearchBar - Maximum Length', () => {
  it('should enforce maxLength prop on input', () => {
    render(<SearchBar value="" onChange={vi.fn()} maxLength={100} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(100);
  });

  it('should truncate pasted text exceeding maxLength', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} maxLength={10} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const longText = 'a'.repeat(20); // 20 characters
    
    await userEvent.paste(input, longText);
    
    vi.advanceTimersByTime(300); // Debounce
    
    // Browser native maxLength truncates to 10 chars
    expect(input.value.length).toBeLessThanOrEqual(10);
  });
});

describe('SearchBar - Placeholder Text', () => {
  it('should display multi-attribute placeholder text', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', expect.stringContaining('taste'));
    expect(input).toHaveAttribute('placeholder', expect.stringContaining('therapeutic'));
  });
});
```

**Run Tests** (should FAIL):
```bash
pnpm vitest tests/unit/components/SearchBar.test.tsx --run
```

---

### Step 2: Implement Core Logic (GREEN Phase) - 45 minutes

#### 2.1: Extend `matchesSearchQuery()` Function

**File**: `src/services/filterService.ts`

**Before** (lines ~91-98):
```typescript
function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  const name = terpene.name.toLowerCase();
  const aroma = terpene.aroma.toLowerCase();
  const effects = terpene.effects.map((e) => e.toLowerCase()).join(' ');

  return name.includes(query) || aroma.includes(query) || effects.includes(query);
}
```

**After**:
```typescript
function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  const name = terpene.name.toLowerCase();
  const aroma = terpene.aroma.toLowerCase();
  const taste = (terpene.taste || '').toLowerCase();
  const therapeuticProps = (terpene.therapeuticProperties || [])
    .map((t) => t.toLowerCase())
    .join(' ');
  const effects = terpene.effects.map((e) => e.toLowerCase()).join(' ');

  return (
    name.includes(query) ||
    aroma.includes(query) ||
    taste.includes(query) ||
    therapeuticProps.includes(query) ||
    effects.includes(query)
  );
}
```

**Key Changes**:
- Added `taste` field search (with null/undefined handling via `|| ''`)
- Added `therapeuticProperties` field search (with null/undefined handling via `|| []`)
- Maintained OR logic (returns true if ANY attribute matches)

#### 2.2: Add 2-Character Minimum Check

**File**: `src/services/filterService.ts`

**Location**: Inside `applyEffectFilters()` function (~line 55)

**Before**:
```typescript
if (filterState.searchQuery && filterState.searchQuery.trim()) {
  const query = filterState.searchQuery.trim().toLowerCase();
  filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
}
```

**After**:
```typescript
if (filterState.searchQuery && filterState.searchQuery.trim()) {
  const query = filterState.searchQuery.trim().toLowerCase();
  
  // Only apply search filtering if query is 2+ characters
  if (query.length >= 2) {
    filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
  }
  // If query < 2 characters: show all results (no filtering applied)
}
```

**Key Changes**:
- Added length check before applying `matchesSearchQuery()`
- Queries with 0-1 characters skip filtering (all results shown)

#### 2.3: Add Constants (Optional but Recommended)

**File**: `src/services/filterService.ts`

**Add near top of file** (after imports):
```typescript
/**
 * Minimum search query length before filtering activates
 */
export const MIN_SEARCH_LENGTH = 2;

/**
 * Maximum search query length (enforced at UI level)
 */
export const MAX_SEARCH_LENGTH = 100;
```

**Update usage**:
```typescript
if (query.length >= MIN_SEARCH_LENGTH) {
  filtered = filtered.filter((terpene) => matchesSearchQuery(terpene, query));
}
```

**Run Tests** (should PASS):
```bash
pnpm vitest tests/unit/services/filterService.test.ts --run
```

---

### Step 3: Update UI Components (GREEN Phase) - 30 minutes

#### 3.1: Update Translation Files

**File**: `src/i18n/locales/en/translation.json`

**Find** `"search"` object and **update**:
```json
{
  "search": {
    "placeholder": "Filter terpenes by name, effect, aroma, taste, therapeutic properties...",
    "ariaLabel": "Filter terpenes by multiple attributes",
    "clear": "Clear filter",
    "oneResult": "1 result found",
    "resultsCount": "{{count}} results found"
  }
}
```

**File**: `src/i18n/locales/de/translation.json`

**Find** `"search"` object and **update**:
```json
{
  "search": {
    "placeholder": "Terpene nach Name, Effekt, Aroma, Geschmack, therapeutischen Eigenschaften filtern...",
    "ariaLabel": "Terpene nach mehreren Attributen filtern",
    "clear": "Filter löschen",
    "oneResult": "1 Ergebnis gefunden",
    "resultsCount": "{{count}} Ergebnisse gefunden"
  }
}
```

#### 3.2: Add maxLength to SearchBar Usage

**File**: `src/pages/Home.tsx`

**Find** `<SearchBar` component usage (likely around line 160-170) and **add** `maxLength` prop:

**Before**:
```tsx
<SearchBar
  value={searchQuery}
  onChange={handleSearchChange}
  resultsCount={filteredTerpenes.length}
/>
```

**After**:
```tsx
<SearchBar
  value={searchQuery}
  onChange={handleSearchChange}
  maxLength={100}
  resultsCount={filteredTerpenes.length}
/>
```

**Run Component Tests** (should PASS):
```bash
pnpm vitest tests/unit/components/SearchBar.test.tsx --run
```

---

### Step 4: Verify Integration (GREEN Phase) - 30 minutes

#### 4.1: Run All Unit Tests

```bash
pnpm vitest --run
```

**Expected**: All tests pass, including:
- Existing filter service tests (backward compatibility)
- New multi-attribute search tests
- Existing SearchBar tests
- New SearchBar maxLength tests

#### 4.2: Manual Testing in Browser

**Start dev server**:
```bash
pnpm dev
```

**Test Scenarios**:
1. **Name Search** (existing): Type "limonene" → verify works
2. **Effect Search** (existing): Type "relaxing" → verify works
3. **Taste Search** (NEW): Type "sweet" → verify matches terpenes with sweet taste
4. **Therapeutic Search** (NEW): Type "anti-inflammatory" → verify matches
5. **Partial Match**: Type "anti" → verify matches "anti-inflammatory"
6. **1 Character**: Type "a" → verify all terpenes visible (no filtering)
7. **2 Characters**: Type "ci" → verify filtering activates
8. **100 Character Limit**: Paste 150 characters → verify truncated to 100
9. **Empty State**: Type "xyzabc123" (nonexistent) → verify empty state message
10. **Language Toggle**: Switch to German → verify placeholder updated

---

### Step 5: Refactor & Improve (REFACTOR Phase) - 45 minutes

#### 5.1: Extract Helper Functions (If Needed)

**File**: `src/services/filterService.ts`

**Optional**: Extract string normalization logic:
```typescript
/**
 * Normalize array of strings to lowercase joined string for searching
 */
function normalizeStringArray(arr: string[] | undefined): string {
  return (arr || []).map((s) => s.toLowerCase()).join(' ');
}

// Usage in matchesSearchQuery():
const therapeuticProps = normalizeStringArray(terpene.therapeuticProperties);
const effects = normalizeStringArray(terpene.effects);
```

#### 5.2: Add JSDoc Comments

**File**: `src/services/filterService.ts`

**Update** `matchesSearchQuery()` JSDoc:
```typescript
/**
 * Check if terpene matches search query across multiple attributes
 * 
 * Searches across:
 * - name (string)
 * - aroma (string)
 * - taste (string, optional)
 * - effects (string array)
 * - therapeuticProperties (string array, optional)
 * 
 * @param terpene - Terpene to check
 * @param query - Search query (lowercase, sanitized)
 * @returns True if terpene matches query in ANY attribute (OR logic)
 */
function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  // ... implementation
}
```

#### 5.3: Integration Tests

**File**: `tests/integration/filter-flow.test.ts`

Add integration test scenarios:
```typescript
describe('Multi-Attribute Search Integration', () => {
  it('should filter by taste field', () => {
    const filterState: FilterState = {
      searchQuery: 'sweet',
      selectedEffects: [],
      effectFilterMode: 'any',
      categoryFilters: [],
    };
    
    const filtered = applyEffectFilters(mockTerpenes, filterState);
    
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((terpene) => {
      const hasTaste = terpene.taste?.toLowerCase().includes('sweet');
      expect(hasTaste || /* other fields match */).toBe(true);
    });
  });

  it('should combine search with effect filters', () => {
    const filterState: FilterState = {
      searchQuery: 'citrus',
      selectedEffects: ['Energizing'],
      effectFilterMode: 'any',
      categoryFilters: [],
    };
    
    const filtered = applyEffectFilters(mockTerpenes, filterState);
    
    // Results should match BOTH search AND effect filter
    filtered.forEach((terpene) => {
      const matchesSearch = /* search logic */;
      const matchesEffect = terpene.effects.includes('Energizing');
      expect(matchesSearch && matchesEffect).toBe(true);
    });
  });
});
```

---

### Step 6: E2E Tests (Optional) - 30 minutes

**File**: `tests/e2e/filter-terpenes.spec.ts`

Add Playwright E2E test:
```typescript
test('should filter by taste attribute', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tbody tr', { timeout: 5000 });
  
  const searchInput = page.locator('input[placeholder*="Filter"]');
  await searchInput.fill('sweet');
  
  await page.waitForTimeout(500); // Debounce + filter
  
  const rows = await page.locator('tbody tr').count();
  expect(rows).toBeGreaterThan(0);
  
  // Verify at least one result contains "sweet" in visible text
  const firstRow = page.locator('tbody tr').first();
  await expect(firstRow).toBeVisible();
});

test('should show all results when typing 1 character', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('tbody tr', { timeout: 5000 });
  
  const initialCount = await page.locator('tbody tr').count();
  
  const searchInput = page.locator('input[placeholder*="Filter"]');
  await searchInput.fill('a');
  
  await page.waitForTimeout(500); // Debounce
  
  const afterFilterCount = await page.locator('tbody tr').count();
  expect(afterFilterCount).toBe(initialCount); // No filtering applied
});
```

**Run E2E tests**:
```bash
pnpm playwright test
```

---

### Step 7: Final Validation - 30 minutes

#### 7.1: Run Full Test Suite

```bash
pnpm run type-check && pnpm test && pnpm run lint && pnpm run build
```

**Expected**: All checks pass

#### 7.2: Verify Accessibility

**Run jest-axe** (if available):
```bash
pnpm vitest tests/unit/components/SearchBar.test.tsx --grep "accessibility" --run
```

**Manual check**:
- Tab to SearchBar → should focus input
- Type → should hear results count announced (screen reader)
- Clear button → should be keyboard accessible

#### 7.3: Performance Check

**In browser dev tools** (Performance tab):
1. Start recording
2. Type 2-character query
3. Stop recording
4. Verify filter operation < 50ms

#### 7.4: Verify No Regressions

**Run existing tests without modifications**:
```bash
git stash # Temporarily hide changes
pnpm test
git stash pop
```

**Compare**: Existing tests should pass before and after changes

---

## Checklist

- [ ] **Step 1**: Failing tests written (RED) ✅
- [ ] **Step 2**: Core logic implemented (GREEN) ✅
- [ ] **Step 3**: UI components updated (GREEN) ✅
- [ ] **Step 4**: Integration verified (GREEN) ✅
- [ ] **Step 5**: Code refactored (REFACTOR) ✅
- [ ] **Step 6**: E2E tests added (Optional) ✅
- [ ] **Step 7**: Final validation complete ✅
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass (if run)
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Accessibility verified (keyboard + screen reader)
- [ ] Performance < 300ms for 200 terpenes
- [ ] No regressions in existing functionality
- [ ] Both English and German translations updated
- [ ] Manual testing in browser complete

---

## Troubleshooting

### Tests Fail with "Cannot find module 'Terpene'"

**Solution**: Ensure TypeScript paths are configured correctly in `tsconfig.json`

### maxLength Not Working in Tests

**Solution**: Use `userEvent.paste()` instead of `userEvent.type()` to test browser-native truncation

### Translation Keys Not Updating

**Solution**: Restart dev server to reload i18next translations

### Filter Service Returns Empty Results

**Debug**: Add console.log to `matchesSearchQuery()` to verify query and field values

---

## Next Steps

After completion:
1. **Commit changes**: Follow conventional commits format
2. **Push branch**: `git push origin 005-table-filter-bar`
3. **Create PR**: Link to spec.md and plan.md
4. **Request review**: Tag team members
5. **Run CI/CD**: Verify all automated checks pass

**Estimated Total Time**: 3-5 hours (including testing and validation)

