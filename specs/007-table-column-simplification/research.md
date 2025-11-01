# Research: Table Column Simplification

**Feature**: 007-table-column-simplification  
**Date**: 2025-11-01  
**Status**: Complete

## Overview

This document consolidates research findings for implementing table column simplification, including category-based sorting,
column visibility changes, and visual styling for importance tiers.

## Research Tasks Completed

### 1. Category Sorting Implementation

**Decision**: Use predefined importance ranking (Core=1, Secondary=2, Minor=3, Uncategorized=4) with secondary
alphabetical sort by name within each category group.

**Rationale**:

- Alphabetical category sorting ("Core" < "Minor" < "Secondary") would be confusing and not meaningful to users
- Importance ranking provides intuitive ordering from most important to least important terpenes
- Secondary alphabetical sort ensures predictable ordering within each category
- Matches user mental model: "Show me the most important terpenes first"

**Alternatives Considered**:

1. **Alphabetical string comparison** ("Core" < "Minor" < "Secondary")
   - **Rejected**: Results in "Core", "Minor", "Secondary" order which is semantically incorrect
   - Minor terpenes would appear before Secondary terpenes, violating importance hierarchy
2. **Manual category ordering without secondary sort**
   - **Rejected**: Within each category, terpenes would appear in arbitrary order (insertion order)
   - Makes it harder for users to find specific terpenes within a category
3. **Database order preservation**
   - **Rejected**: Relies on implicit ordering in JSON file which is not guaranteed to be stable
   - Violates principle of explicit, predictable behavior

**Implementation Approach**:

```typescript
const CATEGORY_RANK = {
  Core: 1,
  Secondary: 2,
  Minor: 3,
  Uncategorized: 4,
} as const;

function sortByCategory(terpenes: Terpene[]): Terpene[] {
  return [...terpenes].sort((a, b) => {
    const categoryA = a.category || 'Uncategorized';
    const categoryB = b.category || 'Uncategorized';

    const rankA = CATEGORY_RANK[categoryA as keyof typeof CATEGORY_RANK];
    const rankB = CATEGORY_RANK[categoryB as keyof typeof CATEGORY_RANK];

    // Primary sort by category rank
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // Secondary sort by name (alphabetical)
    return a.name.localeCompare(b.name);
  });
}
```

---

### 2. Missing Category Handling

**Decision**: Display "Uncategorized" label for terpenes with missing or invalid category values, sorted after Minor
(rank=4).

**Rationale**:

- Explicit labeling makes data quality issues visible to users and developers
- Prevents silent failures or confusing empty cells in the table
- Maintains sort stability by assigning a predictable rank (4) to uncategorized items
- Allows future data quality improvements by identifying problematic entries

**Alternatives Considered**:

1. **Default to "Minor" category**
   - **Rejected**: Masks data quality issues by silently assigning a category
   - Could mislead users about which terpenes have been properly categorized
2. **Display blank/empty cell**
   - **Rejected**: Poor UX, creates visual inconsistency in the table
   - Screen readers may skip empty cells or announce them confusingly
3. **Throw error and prevent table rendering**
   - **Rejected**: Too aggressive, breaks user experience for a data quality issue
   - Violates principle of graceful degradation

**Implementation Approach**:

```typescript
function getCategoryDisplay(category: string | undefined | null): string {
  const validCategories = ['Core', 'Secondary', 'Minor'];
  if (!category || !validCategories.includes(category)) {
    console.warn(`Invalid or missing category: ${category}`);
    return 'Uncategorized';
  }
  return category;
}
```

---

### 3. Category Visual Styling

**Decision**: Display Core terpene names in bold font weight (in Name column); display category labels as plain text
without special styling.

**Rationale**:

- Bold name styling provides immediate visual distinction for most important terpenes
- Avoids color-based distinction (WCAG requirement: color must not be sole means of conveying information)
- Plain text category labels maintain clean, scannable table layout
- Category column already provides explicit categorization, so additional styling is redundant
- Bold text has 4.5:1 contrast minimum (same as regular text) for accessibility

**Alternatives Considered**:

1. **Color-coded badges for categories**
   - **Rejected**: Violates WCAG 2.1 Level AA requirement (SC 1.4.1: Use of Color)
   - Would require additional visual indicators beyond color
   - Adds visual clutter to the table
2. **Icons for categories**
   - **Rejected**: Requires additional icon assets and i18n for alt text
   - Increases cognitive load by requiring users to learn icon meanings
   - Not necessary when text labels are already clear
3. **Bold styling for category labels**
   - **Rejected**: Redundant with category column already being explicit
   - Would make the table visually heavy with too much bold text
4. **Background color for rows based on category**
   - **Rejected**: Conflicts with existing zebra striping pattern
   - Reduces readability, especially in dark mode
   - Violates WCAG color requirements if used as sole indicator

**Implementation Approach**:

```typescript
<TableCell>
  <Typography sx={{ fontWeight: terpene.category === 'Core' ? 700 : 400 }}>{terpene.name}</Typography>
</TableCell>
<TableCell>{terpene.category || 'Uncategorized'}</TableCell>
```

---

### 4. Table Column Selection

**Decision**: Display exactly four columns: Name, Aroma, Effects, Category. Remove Sources column entirely from table
view (Sources remain available in detail modal).

**Rationale**:

- Simplifies table layout, reducing horizontal scrolling on smaller screens
- Category provides more actionable information than Sources for quick scanning
- Sources are botanical/chemical references better suited for detail view
- User request explicitly specified this column set
- Reduces cognitive load by focusing on user-relevant attributes

**Alternatives Considered**:

1. **Keep all 5 columns (Name, Aroma, Effects, Sources, Category)**
   - **Rejected**: Contradicts explicit user requirement
   - Adds unnecessary horizontal scrolling on tablets and smaller displays
2. **Make Sources column collapsible/toggleable**
   - **Rejected**: Adds UI complexity (toggle button, state management)
   - Violates YAGNI principle (no evidence users need optional Sources column)
3. **Replace Sources with both Category and Molecular Class**
   - **Rejected**: Adds cognitive load, requires understanding of chemistry terms
   - Category alone provides sufficient importance classification

---

### 5. Material UI TableSortLabel Best Practices

**Decision**: Use Material UI's `<TableSortLabel>` component with `active` and `direction` props for category sorting,
maintaining consistency with existing table implementation.

**Rationale**:

- Existing table already uses `TableSortLabel` for Name, Aroma, Effects, Sources columns
- Component provides built-in ARIA attributes for accessibility (`aria-sort`, `aria-label`)
- Visual feedback (sort arrow icons) is automatically handled
- No need for custom sort UI components (DRY principle)
- Material UI 6.3.0 fully supports custom sort comparators

**Best Practices Applied**:

1. **Active state management**: Set `active={sortBy === 'category'}` to highlight current sort column
2. **Direction prop**: Pass `direction={sortBy === 'category' ? sortDirection : 'asc'}` for correct arrow display
3. **ARIA attributes**: Use `aria-sort` attribute for screen reader support
4. **Click handler**: Toggle sort direction on same column click, reset to ascending on new column
5. **Styling consistency**: Maintain existing `primary.contrastText` color scheme for table headers

**Documentation Reference**:

- [Material UI TableSortLabel API](https://mui.com/material-ui/api/table-sort-label/)
- Existing implementation in `TerpeneTable.tsx` lines 162-240

---

### 6. Internationalization for Category Labels

**Decision**: Add translation keys for category column header and category values (Core, Secondary, Minor,
Uncategorized) in both English and German.

**Rationale**:

- Maintains consistency with existing i18n approach (all user-facing text translated)
- Category labels are domain terminology that should be properly translated
- German speakers should see "Kategorie", "Kern", "Sekundär", "Gering", "Unkategorisiert"
- Prevents hard-coded strings (constitution requirement)

**Translation Keys Required**:

```json
{
  "table": {
    "category": "Category",
    "categoryCore": "Core",
    "categorySecondary": "Secondary",
    "categoryMinor": "Minor",
    "categoryUncategorized": "Uncategorized"
  }
}
```

German translations:

```json
{
  "table": {
    "category": "Kategorie",
    "categoryCore": "Kern",
    "categorySecondary": "Sekundär",
    "categoryMinor": "Gering",
    "categoryUncategorized": "Unkategorisiert"
  }
}
```

**Alternatives Considered**:

1. **Leave category values in English only**
   - **Rejected**: Violates i18n constitution requirement
   - Inconsistent with translated effect names and other UI elements
2. **Use single translation key with interpolation**
   - **Rejected**: German translations require different word forms
   - Separate keys provide better translation flexibility

---

### 7. Performance Implications

**Decision**: No performance optimization needed beyond existing implementation; removal of Sources column actually
reduces rendering complexity.

**Rationale**:

- Current table renders <50 terpenes (well below 100-item threshold for virtualization)
- Category sorting is O(n log n) with efficient comparator (importance rank lookup + string comparison)
- Removing Sources column reduces DOM nodes per row (one fewer `<TableCell>`)
- Material UI's `useMemo` for sort results prevents unnecessary re-renders
- Existing performance targets (<500ms render, <100ms sort) easily met

**Measurements**:

- Current table with 5 columns: ~50 terpenes × 5 cells = 250 DOM nodes
- New table with 4 columns: ~50 terpenes × 4 cells = 200 DOM nodes (20% reduction)
- Sort complexity: O(n log n) = O(50 × 5.64) ≈ 282 comparisons (negligible)

**No Action Required**: Existing performance infrastructure is sufficient.

---

## Summary

All technical unknowns from the Technical Context section have been resolved:

- ✅ Category sorting uses importance ranking (Core=1, Secondary=2, Minor=3, Uncategorized=4) with secondary
  alphabetical sort
- ✅ Missing categories display as "Uncategorized" (rank=4) with warning logged
- ✅ Category visual styling: Core terpene names in bold; category labels in plain text
- ✅ Four columns displayed: Name, Aroma, Effects, Category (Sources removed from table)
- ✅ Material UI TableSortLabel component used for category sorting (consistent with existing implementation)
- ✅ Internationalization: Category column header and labels translated (en, de)
- ✅ Performance: No optimization needed; removal of Sources column reduces DOM complexity

**Next Steps**: Proceed to Phase 1 (Design & Contracts) to define data model updates and component contracts.
