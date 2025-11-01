# Component Contract: TerpeneTable

**Feature**: 007-table-column-simplification  
**Date**: 2025-11-01  
**Component**: `TerpeneTable`  
**Path**: `src/components/visualizations/TerpeneTable.tsx`

## Overview

This contract defines the interface, behavior, and interactions for the modified TerpeneTable component, which displays
terpene data in a sortable table with four columns: Name, Aroma, Effects, and Category.

---

## Component Interface

### Props

```typescript
export interface TerpeneTableProps {
  /** Array of terpenes to display in the table */
  terpenes: Terpene[];

  /** Initial column to sort by (default: 'category') */
  initialSortBy?: 'name' | 'aroma' | 'effects' | 'category';

  /** Initial sort direction (default: 'asc') */
  initialSortDirection?: 'asc' | 'desc';
}
```

### Prop Specifications

| Prop                    | Type                                          | Required | Default      | Description                                                                          |
| ----------------------- | --------------------------------------------- | -------- | ------------ | ------------------------------------------------------------------------------------ |
| `terpenes`              | `Terpene[]`                                   | Yes      | -            | Array of terpene objects to display in the table                                     |
| `initialSortBy`         | `'name' \| 'aroma' \| 'effects' \| 'category'`| No       | `'category'` | Column to sort by when table first renders                                           |
| `initialSortDirection`  | `'asc' \| 'desc'`                             | No       | `'asc'`      | Sort direction when table first renders                                              |

### Return Type

```typescript
React.ReactElement
```

---

## Component Behavior

### 1. Rendering

#### Column Headers

The table MUST display exactly four column headers in this order:

1. **Name** - Translated via `t('table.name', 'Name')`
2. **Aroma** - Translated via `t('table.aroma', 'Aroma')`
3. **Effects** - Translated via `t('table.effects', 'Effects')`
4. **Category** - Translated via `t('table.category', 'Category')`

Each column header MUST:

- Use Material UI `<TableSortLabel>` component
- Display sort direction arrow when active (`active={sortBy === column}`)
- Set ARIA attributes for accessibility (`aria-sort`)
- Use theme color `primary.contrastText` for header text
- Be clickable to trigger sort

#### Table Rows

Each row MUST display:

1. **Name Cell**:
   - Display `terpene.name`
   - Apply **bold font weight** (700) if `terpene.category === 'Core'`
   - Apply regular font weight (400) for all other categories
   - Ensure minimum 4.5:1 contrast ratio (inherited from theme)

2. **Aroma Cell**:
   - Display `terpene.aroma` as plain text

3. **Effects Cell**:
   - Display `terpene.effects` as Material UI `<Chip>` components
   - Use translated effect names via `getEffectMetadata(effect).displayName[language]`
   - Apply `size="small"` and `textTransform: 'capitalize'`
   - Wrap chips in flex container with `gap: 0.5`

4. **Category Cell**:
   - Display translated category name via helper function:
     - `'Core'` → `t('table.categoryCore', 'Core')`
     - `'Secondary'` → `t('table.categorySecondary', 'Secondary')`
     - `'Minor'` → `t('table.categoryMinor', 'Minor')`
     - `undefined/null/invalid` → `t('table.categoryUncategorized', 'Uncategorized')`
   - Display as plain text (no bold, color, or icons)

#### Row Interactions

Each row MUST:

- Be clickable to open the terpene detail modal
- Support keyboard navigation (Enter/Space to open modal)
- Display hover state (background: `action.selected`, transition: 100ms)
- Display selected state (orange left border: `borderColor: 'secondary.main'`)
- Maintain zebra striping (odd rows: `bgcolor: 'action.hover'`, even rows: transparent)
- Set `role="button"` and `tabIndex={0}` for accessibility
- Provide ARIA label: `t('table.viewDetailsFor', { name: terpene.name })`

#### Empty State

If `terpenes.length === 0`, the component MUST:

- Display centered message: `t('table.noTerpenes', 'No terpenes to display')`
- Use `Typography` variant `h6` with `color="text.secondary"`
- Apply vertical padding (`py: 8`)

---

### 2. Sorting Behavior

#### Default Sort

On initial render, the table MUST:

- Sort by `initialSortBy` prop (default: `'category'`)
- Apply `initialSortDirection` (default: `'asc'`)
- For category sorting, use importance ranking:
  - Core = 1
  - Secondary = 2
  - Minor = 3
  - Uncategorized = 4
- Within each category, apply secondary alphabetical sort by `name`

#### Sort Toggle

When a column header is clicked, the table MUST:

1. **If the clicked column is currently active**:
   - Toggle sort direction (`'asc'` ↔ `'desc'`)
   - Maintain the same column as active

2. **If the clicked column is not currently active**:
   - Set the clicked column as active
   - Reset sort direction to `'asc'`
   - Update visual indicators (arrow icon, active state)

#### Sort Implementation

**Name Sort**:

```typescript
aValue = a.name;
bValue = b.name;
comparison = aValue.localeCompare(bValue);
```

**Aroma Sort**:

```typescript
aValue = a.aroma;
bValue = b.aroma;
comparison = aValue.localeCompare(bValue);
```

**Effects Sort**:

```typescript
aValue = a.effects.join(', ');
bValue = b.effects.join(', ');
comparison = aValue.localeCompare(bValue);
```

**Category Sort** (NEW):

```typescript
const CATEGORY_RANK = { Core: 1, Secondary: 2, Minor: 3, Uncategorized: 4 };
const categoryA = (a.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;
const categoryB = (b.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;

const rankA = CATEGORY_RANK[categoryA];
const rankB = CATEGORY_RANK[categoryB];

// Primary: compare category ranks
if (rankA !== rankB) {
  return sortDirection === 'asc' ? rankA - rankB : rankB - rankA;
}

// Secondary: alphabetical by name
return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
```

#### Sort Performance

- Sort operations MUST complete in <100ms for datasets up to 100 terpenes
- Use `useMemo` to memoize sorted results and prevent unnecessary re-sorts
- Dependencies: `[terpenes, sortBy, sortDirection]`

---

### 3. Accessibility

The component MUST comply with WCAG 2.1 Level AA:

#### Keyboard Navigation

- **Tab**: Navigate between sortable column headers and table rows
- **Enter/Space**: Activate sort on focused column header OR open detail modal on focused row
- **Arrow keys**: (Handled by browser's native table navigation)

#### ARIA Attributes

- **Table**: `aria-label={t('table.ariaLabel', 'Terpenes table')}`
- **Column Headers**: `aria-sort={sortBy === column ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}`
- **Rows**: `aria-label={t('table.viewDetailsFor', { name: terpene.name })}`
- **Sort Labels**: Inherit ARIA from Material UI `<TableSortLabel>` component

#### Color Contrast

- Header text: `primary.contrastText` on `primary.dark` background (≥4.5:1 contrast)
- Body text: Default theme text colors (≥4.5:1 contrast)
- Bold Core names: Maintain same contrast ratio as regular text

#### Screen Reader Support

- Table semantics: `<Table>`, `<TableHead>`, `<TableBody>`, `<TableRow>`, `<TableCell>`
- Sort state announced via `aria-sort` attribute
- Row interaction announced via `aria-label` and `role="button"`

---

### 4. Internationalization

The component MUST support English (en) and German (de) languages:

#### Translation Keys

| Key                            | English                        | German                         |
| ------------------------------ | ------------------------------ | ------------------------------ |
| `table.name`                   | Name                           | Name                           |
| `table.aroma`                  | Aroma                          | Aroma                          |
| `table.effects`                | Effects                        | Effekte                        |
| `table.category`               | Category                       | Kategorie                      |
| `table.categoryCore`           | Core                           | Kern                           |
| `table.categorySecondary`      | Secondary                      | Sekundär                       |
| `table.categoryMinor`          | Minor                          | Gering                         |
| `table.categoryUncategorized`  | Uncategorized                  | Unkategorisiert                |
| `table.noTerpenes`             | No terpenes to display         | Keine Terpene anzuzeigen       |
| `table.ariaLabel`              | Terpenes table                 | Terpene Tabelle                |
| `table.viewDetailsFor`         | View details for {name}        | Details anzeigen für {name}    |

#### Language Detection

- Use `i18n.language` from `useTranslation()` hook
- Automatically switch translations when language changes
- Effect names use `getEffectMetadata(effect).displayName[i18n.language as 'en' | 'de']`

---

### 5. Performance Requirements

The component MUST meet these performance targets:

| Metric                          | Target       | Measurement Method                                      |
| ------------------------------- | ------------ | ------------------------------------------------------- |
| Initial render time             | <500ms       | `performance.now()` before/after render                 |
| Sort operation time             | <100ms       | `performance.now()` before/after sort comparator        |
| Re-render on sort toggle        | <100ms       | React DevTools Profiler                                 |
| Memory usage                    | <50MB        | Chrome DevTools Memory Profiler                         |

**Optimization Strategies**:

- Use `useMemo` for sorted terpene array
- Use `useState` for local sort state (avoid unnecessary parent re-renders)
- Minimize DOM nodes by removing Sources column (20% reduction)
- Defer virtualization (react-window) until dataset exceeds 100 items

---

## Integration Points

### 1. Data Source

**Input**: `terpenes` prop receives data from parent component (typically `TerpeneExplorer` page)

**Expected Structure**:

```typescript
const terpenes: Terpene[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Limonene',
    category: 'Core',
    aroma: 'Citrus, sweet',
    effects: ['Mood enhancing', 'Energizing'],
    sources: ['Lemon', 'Orange'],
    // ... other fields
  },
  // ... more terpenes
];
```

**Data Validation**:

- Component assumes `terpenes` array is already validated by Zod schema
- Missing/invalid `category` values handled gracefully (display "Uncategorized")
- Empty array (`terpenes.length === 0`) triggers empty state UI

---

### 2. Detail Modal Integration

**Component**: `<TerpeneDetailModal>` (existing)

**Behavior**:

- When a table row is clicked, the component:
  1. Updates `selectedTerpeneId` state (for visual selection indicator)
  2. Converts legacy `Terpene` model to new `Terpene` type using `toNewTerpene()` adapter
  3. Sets `selectedTerpene` state
  4. Opens modal by setting `modalOpen={true}`

**Props Passed**:

```typescript
<TerpeneDetailModal open={modalOpen} terpene={selectedTerpene} onClose={handleModalClose} />
```

**Close Behavior**:

- Modal close button calls `onClose` prop
- `handleModalClose` sets `modalOpen={false}`
- Selected terpene state persists (not cleared) for potential re-open

---

### 3. Theme Integration

**Material UI Theme**: Component uses theme values from `src/theme/darkTheme.ts` and `lightTheme.ts`

**Theme Tokens Used**:

- `primary.dark` - Table header background
- `primary.contrastText` - Header text color
- `secondary.main` - Selected row border color (orange)
- `action.hover` - Zebra striping (odd rows)
- `action.selected` - Hover/selected row background
- `background.paper` - Table container background
- `text.secondary` - Empty state text color

**Responsive Behavior**:

- No horizontal scrolling on desktop (≥1024px width) with 4 columns
- Sticky header (`stickyHeader` prop on `<Table>`)
- Table container has rounded corners (`borderRadius: 2`)

---

### 4. Translation Integration

**i18next Configuration**: Component uses `useTranslation()` hook from `react-i18next`

**Translation Files**:

- `src/i18n/locales/en.json` (English translations)
- `src/i18n/locales/de.json` (German translations)

**Effect Translation**:

- Uses `getEffectMetadata(effect)` from `src/services/colorService.ts`
- Returns object with `displayName: { en: string, de: string }`
- Dynamically selects display name based on current language

---

## Testing Contract

### Unit Tests (Vitest)

**File**: `tests/unit/components/TerpeneTable.test.tsx`

**Test Coverage Requirements**:

1. **Rendering**:
   - ✅ Renders table with 4 column headers (Name, Aroma, Effects, Category)
   - ✅ Displays all terpene data correctly
   - ✅ Handles empty terpene array (empty state)
   - ✅ Applies bold font to Core terpene names
   - ✅ Displays plain text category labels

2. **Sorting**:
   - ✅ Sorts by category (importance ranking) by default
   - ✅ Applies secondary alphabetical sort by name within categories
   - ✅ Toggles sort direction on same column click
   - ✅ Resets to ascending when new column clicked
   - ✅ Handles missing/invalid category values (Uncategorized)

3. **Interactions**:
   - ✅ Opens detail modal on row click
   - ✅ Supports keyboard navigation (Enter/Space)
   - ✅ Displays hover state on row hover
   - ✅ Displays selected state on row selection

4. **Accessibility**:
   - ✅ Has proper ARIA labels and attributes
   - ✅ Supports keyboard navigation
   - ✅ Passes vitest-axe accessibility checks

5. **Internationalization**:
   - ✅ Displays translated column headers
   - ✅ Displays translated category labels
   - ✅ Displays translated effect names

### Integration Tests (Vitest)

**File**: `tests/integration/us5-table-interactions.test.tsx`

**Test Coverage Requirements**:

- ✅ Table renders with correct structure (4 columns)
- ✅ All columns are sortable
- ✅ Row click opens detail modal
- ✅ Keyboard navigation works end-to-end

### E2E Tests (Playwright)

**File**: `tests/e2e/table-sorting.spec.ts` (NEW)

**Test Scenarios**:

1. **Default Category Sort**:
   - Navigate to terpene table page
   - Verify first row contains a Core terpene
   - Verify Core terpenes appear before Secondary terpenes
   - Verify Secondary terpenes appear before Minor terpenes

2. **Category Sort Toggle**:
   - Click Category column header
   - Verify sort direction reverses (Minor → Secondary → Core)
   - Click again to restore ascending order

3. **Name Sort**:
   - Click Name column header
   - Verify terpenes are sorted alphabetically by name
   - Verify category sorting is disabled

4. **Visual Regression**:
   - Take screenshot of table with 4 columns
   - Compare against baseline screenshot
   - Verify Sources column is not present

---

## Breaking Changes

### Removed Features

1. **Sources Column**: No longer displayed in table
   - **Migration**: Sources are still available in the detail modal (no data loss)
   - **Impact**: Users who relied on Sources column for quick reference must click row to see sources

2. **Default Sort Changed**: Default sort changed from `'name'` (ascending) to `'category'` (ascending)
   - **Migration**: To restore previous behavior, pass `initialSortBy="name"` prop
   - **Impact**: Table now displays Core terpenes first by default (intentional UX improvement)

### Modified Interfaces

1. **TerpeneTableProps.initialSortBy**: Type changed from `'name' | 'aroma' | 'sources' | 'effects'` to
   `'name' | 'aroma' | 'effects' | 'category'`
   - **Migration**: Replace `initialSortBy="sources"` with `initialSortBy="category"` or another valid column
   - **Impact**: TypeScript compilation error if `"sources"` is passed

2. **SortColumn Type**: Changed from `'name' | 'aroma' | 'sources' | 'effects'` to
   `'name' | 'aroma' | 'effects' | 'category'`
   - **Migration**: Update any code that references `"sources"` as a sort column
   - **Impact**: Internal type change (minimal impact on external consumers)

---

## Success Criteria

The component implementation is considered complete when:

1. ✅ All 4 columns (Name, Aroma, Effects, Category) are displayed
2. ✅ Sources column is removed from table view
3. ✅ Category column displays translated labels (en, de)
4. ✅ Core terpene names are displayed in bold font weight
5. ✅ Default sort is by category (importance ranking) with secondary alphabetical sort by name
6. ✅ All columns are sortable with proper visual indicators
7. ✅ Missing/invalid categories display as "Uncategorized" (rank=4)
8. ✅ All unit tests pass with ≥80% coverage
9. ✅ All integration tests pass
10. ✅ All E2E tests pass
11. ✅ Accessibility audit (vitest-axe) passes with zero violations
12. ✅ Performance targets met (<500ms render, <100ms sort)
13. ✅ No horizontal scrolling on desktop (≥1024px)
14. ✅ Existing table interactions (modal, hover, keyboard) still work

---

## Appendix: Example Usage

### Basic Usage

```typescript
import { TerpeneTable } from '@/components/visualizations/TerpeneTable';
import { useTerpeneData } from '@/hooks/useTerpeneData';

export function TerpeneExplorerPage() {
  const { terpenes, loading, error } = useTerpeneData();

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return <TerpeneTable terpenes={terpenes} />;
}
```

### Custom Initial Sort

```typescript
<TerpeneTable terpenes={terpenes} initialSortBy="name" initialSortDirection="asc" />
```

### With Filtered Data

```typescript
const filteredTerpenes = terpenes.filter((t) => t.category === 'Core');

<TerpeneTable terpenes={filteredTerpenes} initialSortBy="category" />;
```

---

**Contract Version**: 1.0.0  
**Last Updated**: 2025-11-01  
**Status**: Ready for Implementation
