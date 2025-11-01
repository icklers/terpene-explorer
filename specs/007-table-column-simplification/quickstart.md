# Quickstart: Table Column Simplification

**Feature**: 007-table-column-simplification  
**Date**: 2025-11-01  
**Estimated Time**: 2-3 hours

## Overview

This guide provides step-by-step instructions for implementing the table column simplification feature. The goal is to
replace the Sources column with a Category column and implement category-based default sorting.

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 24+ and pnpm 10+ installed
- ✅ Repository cloned and dependencies installed (`pnpm install`)
- ✅ Familiarity with TypeScript, React 19, and Material UI 6
- ✅ Read the feature spec (`specs/007-table-column-simplification/spec.md`)
- ✅ Read the data model (`specs/007-table-column-simplification/data-model.md`)
- ✅ Read the component contract (`specs/007-table-column-simplification/contracts/terpene-table-component.md`)

---

## Implementation Steps

### Step 1: Update Translation Files (5 minutes)

Add translation keys for the Category column and category labels.

**File**: `src/i18n/locales/en.json`

```json
{
  "table": {
    "name": "Name",
    "aroma": "Aroma",
    "effects": "Effects",
    "category": "Category",
    "categoryCore": "Core",
    "categorySecondary": "Secondary",
    "categoryMinor": "Minor",
    "categoryUncategorized": "Uncategorized",
    "sources": "Sources",
    "noTerpenes": "No terpenes to display",
    "ariaLabel": "Terpenes table",
    "viewDetailsFor": "View details for {{name}}"
  }
}
```

**File**: `src/i18n/locales/de.json`

```json
{
  "table": {
    "name": "Name",
    "aroma": "Aroma",
    "effects": "Effekte",
    "category": "Kategorie",
    "categoryCore": "Kern",
    "categorySecondary": "Sekundär",
    "categoryMinor": "Gering",
    "categoryUncategorized": "Unkategorisiert",
    "sources": "Quellen",
    "noTerpenes": "Keine Terpene anzuzeigen",
    "ariaLabel": "Terpene Tabelle",
    "viewDetailsFor": "Details anzeigen für {{name}}"
  }
}
```

**Verification**: Run `pnpm run type-check` to ensure no TypeScript errors.

---

### Step 2: Modify TerpeneTable Component (45-60 minutes)

**File**: `src/components/visualizations/TerpeneTable.tsx`

#### 2.1: Update Type Definitions

**Replace**:

```typescript
type SortColumn = 'name' | 'aroma' | 'sources' | 'effects';

export interface TerpeneTableProps {
  terpenes: Terpene[];
  initialSortBy?: 'name' | 'aroma' | 'sources' | 'effects';
  initialSortDirection?: 'asc' | 'desc';
}
```

**With**:

```typescript
type SortColumn = 'name' | 'aroma' | 'effects' | 'category';

export interface TerpeneTableProps {
  terpenes: Terpene[];
  initialSortBy?: 'name' | 'aroma' | 'effects' | 'category';
  initialSortDirection?: 'asc' | 'desc';
}
```

#### 2.2: Update Default Props

**Replace**:

```typescript
export function TerpeneTable({ terpenes, initialSortBy = 'name', initialSortDirection = 'asc' }: TerpeneTableProps)
```

**With**:

```typescript
export function TerpeneTable({ terpenes, initialSortBy = 'category', initialSortDirection = 'asc' }: TerpeneTableProps)
```

#### 2.3: Add Category Ranking Constant

**Add** after the type definitions:

```typescript
const CATEGORY_RANK = {
  Core: 1,
  Secondary: 2,
  Minor: 3,
  Uncategorized: 4,
} as const;
```

#### 2.4: Add Category Display Helper Function

**Add** after the constants:

```typescript
function getCategoryDisplay(category: string | undefined | null, t: TFunction): string {
  switch (category) {
    case 'Core':
      return t('table.categoryCore', 'Core');
    case 'Secondary':
      return t('table.categorySecondary', 'Secondary');
    case 'Minor':
      return t('table.categoryMinor', 'Minor');
    default:
      if (category && category !== 'Uncategorized') {
        console.warn(`Invalid category: ${category}`);
      }
      return t('table.categoryUncategorized', 'Uncategorized');
  }
}
```

#### 2.5: Update Sort Logic in `sortedTerpenes` useMemo

**Replace** the `sortedTerpenes` useMemo with:

```typescript
const sortedTerpenes = useMemo(() => {
  const sorted = [...terpenes].sort((a, b) => {
    let comparison: number;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'aroma':
        comparison = a.aroma.localeCompare(b.aroma);
        break;
      case 'effects':
        comparison = a.effects.join(', ').localeCompare(b.effects.join(', '));
        break;
      case 'category': {
        const categoryA = (a.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;
        const categoryB = (b.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;

        const rankA = CATEGORY_RANK[categoryA];
        const rankB = CATEGORY_RANK[categoryB];

        // Primary sort by category rank
        if (rankA !== rankB) {
          comparison = rankA - rankB;
        } else {
          // Secondary sort by name (alphabetical)
          comparison = a.name.localeCompare(b.name);
        }
        break;
      }
      default:
        comparison = a.name.localeCompare(b.name);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return sorted;
}, [terpenes, sortBy, sortDirection]);
```

#### 2.6: Update Table Headers (Remove Sources, Add Category)

**Replace** the `<TableHead>` section:

**Remove** the Sources column header (lines ~220-240):

```typescript
<TableCell sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600 }}>
  <TableSortLabel
    active={sortBy === 'sources'}
    direction={sortBy === 'sources' ? sortDirection : 'asc'}
    onClick={() => handleSort('sources')}
    aria-sort={sortBy === 'sources' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
    sx={{
      color: 'primary.contrastText',
      '&.Mui-active': { color: 'primary.contrastText' },
      '&:hover': { color: 'primary.contrastText' },
    }}
  >
    {t('table.sources', 'Sources')}
  </TableSortLabel>
</TableCell>
```

**Add** the Category column header (after Effects column):

```typescript
<TableCell sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600 }}>
  <TableSortLabel
    active={sortBy === 'category'}
    direction={sortBy === 'category' ? sortDirection : 'asc'}
    onClick={() => handleSort('category')}
    aria-sort={sortBy === 'category' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
    sx={{
      color: 'primary.contrastText',
      '&.Mui-active': { color: 'primary.contrastText' },
      '&:hover': { color: 'primary.contrastText' },
    }}
  >
    {t('table.category', 'Category')}
  </TableSortLabel>
</TableCell>
```

#### 2.7: Update Table Body (Remove Sources Cell, Add Category Cell)

**In the `<TableBody>` section**, modify each row:

**Update Name Cell** to apply bold styling for Core terpenes:

```typescript
<TableCell>
  <Typography sx={{ fontWeight: terpene.category === 'Core' ? 700 : 400 }}>{terpene.name}</Typography>
</TableCell>
```

**Remove** the Sources cell:

```typescript
<TableCell>{terpene.sources.join(', ')}</TableCell>
```

**Add** the Category cell (after Effects cell):

```typescript
<TableCell>{getCategoryDisplay(terpene.category, t)}</TableCell>
```

**Verification**: Run `pnpm run type-check` and `pnpm run lint:fix` to ensure no errors.

---

### Step 3: Update Unit Tests (30-45 minutes)

**File**: `tests/unit/components/TerpeneTable.test.tsx`

#### 3.1: Update Mock Data

Ensure all mock terpenes have a `category` field:

```typescript
const mockTerpenes: Terpene[] = [
  {
    id: '1',
    name: 'Limonene',
    category: 'Core',
    aroma: 'Citrus',
    description: 'Citrus-scented',
    effects: ['energizing', 'mood-enhancing'],
    sources: ['Lemon', 'Orange'],
  },
  {
    id: '2',
    name: 'Myrcene',
    category: 'Core',
    aroma: 'Earthy',
    description: 'Earthy terpene',
    effects: ['sedative'],
    sources: ['Mango'],
  },
  {
    id: '3',
    name: 'Pinene',
    category: 'Secondary',
    aroma: 'Pine',
    description: 'Pine-scented',
    effects: ['focus'],
    sources: ['Pine', 'Rosemary'],
  },
];
```

#### 3.2: Update Column Header Tests

**Replace** the test checking for "Sources" header:

```typescript
it('should render column headers', () => {
  render(<TerpeneTable terpenes={mockTerpenes} />);

  expect(screen.getByText('Name')).toBeInTheDocument();
  expect(screen.getByText('Aroma')).toBeInTheDocument();
  expect(screen.getByText('Effects')).toBeInTheDocument();
  expect(screen.getByText('Category')).toBeInTheDocument();
  expect(screen.queryByText('Sources')).not.toBeInTheDocument();
});
```

#### 3.3: Add Category Sorting Tests

**Add** new test cases:

```typescript
describe('Category Sorting', () => {
  it('should sort by category (importance ranking) by default', () => {
    render(<TerpeneTable terpenes={mockTerpenes} />);

    const rows = screen.getAllByRole('row').slice(1); // Skip header
    const names = rows.map((row) => within(row).getAllByRole('cell')[0]!.textContent);

    // Core terpenes first (Limonene, Myrcene), then Secondary (Pinene)
    expect(names).toEqual(['Limonene', 'Myrcene', 'Pinene']);
  });

  it('should apply secondary alphabetical sort by name within categories', () => {
    const terpenes = [
      { ...mockTerpenes[0], name: 'Zeta' },
      { ...mockTerpenes[1], name: 'Alpha' },
      { ...mockTerpenes[2], name: 'Beta' },
    ];

    render(<TerpeneTable terpenes={terpenes} />);

    const rows = screen.getAllByRole('row').slice(1);
    const names = rows.map((row) => within(row).getAllByRole('cell')[0]!.textContent);

    // Core: Alpha, Zeta (alphabetical), then Secondary: Beta
    expect(names).toEqual(['Alpha', 'Zeta', 'Beta']);
  });

  it('should handle missing category as "Uncategorized" (rank=4)', () => {
    const terpenes = [
      { ...mockTerpenes[0], category: undefined },
      { ...mockTerpenes[1], category: 'Minor' },
    ];

    render(<TerpeneTable terpenes={terpenes} />);

    const rows = screen.getAllByRole('row').slice(1);
    const categories = rows.map((row) => within(row).getAllByRole('cell')[3]!.textContent);

    // Minor appears first (rank=3), Uncategorized appears last (rank=4)
    expect(categories).toEqual(['Minor', 'Uncategorized']);
  });
});
```

#### 3.4: Add Bold Name Styling Test

**Add**:

```typescript
it('should display Core terpene names in bold', () => {
  render(<TerpeneTable terpenes={mockTerpenes} />);

  const limoneneCell = screen.getByText('Limonene').closest('td');
  const limoneneTypography = within(limoneneCell!).getByText('Limonene');

  expect(limoneneTypography).toHaveStyle({ fontWeight: 700 });
});

it('should display non-Core terpene names in regular weight', () => {
  render(<TerpeneTable terpenes={mockTerpenes} />);

  const pineneCell = screen.getByText('Pinene').closest('td');
  const pineneTypography = within(pineneCell!).getByText('Pinene');

  expect(pineneTypography).toHaveStyle({ fontWeight: 400 });
});
```

**Verification**: Run `pnpm run test:unit` to ensure all tests pass.

---

### Step 4: Update Integration Tests (15-20 minutes)

**File**: `tests/integration/us5-table-interactions.test.tsx`

#### 4.1: Update Column Assertions

**Replace**:

```typescript
it('should render all table columns', () => {
  render(
    <ThemeProvider theme={darkTheme}>
      <TerpeneTable terpenes={mockTerpenes} />
    </ThemeProvider>
  );

  expect(screen.getByText('Name')).toBeInTheDocument();
  expect(screen.getByText('Aroma')).toBeInTheDocument();
  expect(screen.getByText('Effects')).toBeInTheDocument();
  expect(screen.getByText('Category')).toBeInTheDocument();
  expect(screen.queryByText('Sources')).not.toBeInTheDocument();
});
```

**Verification**: Run `pnpm run test:integration` to ensure all tests pass.

---

### Step 5: Create E2E Tests (30-45 minutes)

**File**: `tests/e2e/table-sorting.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Terpene Table - Category Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should display Core terpenes first by default', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    const categoryCell = firstRow.locator('td').nth(3);

    await expect(categoryCell).toHaveText(/Core|Kern/);
  });

  test('should sort terpenes by category importance ranking', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    let lastCategoryRank = 0;

    for (let i = 0; i < count; i++) {
      const categoryText = await rows.nth(i).locator('td').nth(3).textContent();
      const categoryRank = getCategoryRank(categoryText || '');

      // Ensure categories appear in ascending importance rank order
      expect(categoryRank).toBeGreaterThanOrEqual(lastCategoryRank);
      lastCategoryRank = categoryRank;
    }
  });

  test('should toggle category sort direction on header click', async ({ page }) => {
    const categoryHeader = page.locator('th:has-text("Category"), th:has-text("Kategorie")');
    await categoryHeader.click();

    // After one click, sort should reverse (Minor -> Secondary -> Core)
    const firstRow = page.locator('table tbody tr').first();
    const categoryCell = firstRow.locator('td').nth(3);

    await expect(categoryCell).toHaveText(/Minor|Gering/);
  });

  test('should display exactly 4 columns', async ({ page }) => {
    const headerCells = page.locator('th');
    await expect(headerCells).toHaveCount(4);
  });

  test('should not display Sources column', async ({ page }) => {
    const sourcesHeader = page.locator('th:has-text("Sources"), th:has-text("Quellen")');
    await expect(sourcesHeader).toHaveCount(0);
  });
});

function getCategoryRank(categoryText: string): number {
  if (categoryText.includes('Core') || categoryText.includes('Kern')) return 1;
  if (categoryText.includes('Secondary') || categoryText.includes('Sekundär')) return 2;
  if (categoryText.includes('Minor') || categoryText.includes('Gering')) return 3;
  return 4; // Uncategorized
}
```

**Verification**: Run `pnpm run test:e2e` to ensure all E2E tests pass.

---

### Step 6: Verify Accessibility (10 minutes)

**Run accessibility tests**:

```bash
pnpm run test:a11y
```

**Expected Results**:

- ✅ No axe-core violations detected
- ✅ Table has proper ARIA labels
- ✅ Column headers have `aria-sort` attributes
- ✅ Rows have `aria-label` attributes

**Manual Testing**:

1. Open the app in a browser
2. Navigate to the terpene table using only the keyboard (Tab, Enter, Space)
3. Verify all interactive elements are reachable and operable
4. Use a screen reader (NVDA/JAWS/VoiceOver) to verify table structure is announced correctly

---

### Step 7: Performance Testing (10 minutes)

**Run performance tests**:

```bash
pnpm run dev
```

**Open Chrome DevTools**:

1. Go to Performance tab
2. Record a session
3. Sort the table by clicking different column headers
4. Stop recording
5. Verify:
   - Initial render time: <500ms
   - Sort operation time: <100ms
   - No layout thrashing or forced reflows

**Lighthouse Audit**:

1. Open Chrome DevTools → Lighthouse tab
2. Run audit for Performance and Accessibility
3. Verify:
   - Performance score: ≥90
   - Accessibility score: ≥95

---

### Step 8: Visual Testing (5 minutes)

**Manual Visual Inspection**:

1. Open the app in both light and dark themes
2. Verify:
   - ✅ Category column is visible after Effects column
   - ✅ Sources column is not present
   - ✅ Core terpene names are bold
   - ✅ Category labels are plain text (no special styling)
   - ✅ Table layout looks clean and scannable
   - ✅ No horizontal scrolling on desktop (≥1024px)

**Cross-Browser Testing**:

- Test in Chrome, Firefox, Safari, and Edge
- Verify layout and sorting work consistently

---

## Verification Checklist

Before submitting a PR, ensure:

- ✅ All unit tests pass (`pnpm run test:unit`)
- ✅ All integration tests pass (`pnpm run test:integration`)
- ✅ All E2E tests pass (`pnpm run test:e2e`)
- ✅ Accessibility tests pass (`pnpm run test:a11y`)
- ✅ TypeScript compilation succeeds (`pnpm run type-check`)
- ✅ Linting passes (`pnpm run lint`)
- ✅ Code formatting is correct (`pnpm run format`)
- ✅ Build succeeds (`pnpm run build`)
- ✅ Visual inspection confirms correct layout
- ✅ Performance targets met (Lighthouse ≥90)

---

## Troubleshooting

### Issue: TypeScript error on `CATEGORY_RANK` lookup

**Error**: `Element implicitly has an 'any' type`

**Solution**: Add type assertion:

```typescript
const categoryA = (a.category || 'Uncategorized') as keyof typeof CATEGORY_RANK;
```

### Issue: Translation keys not found

**Error**: `Missing translation key: table.category`

**Solution**: Restart dev server after updating translation files:

```bash
pnpm run dev
```

### Issue: Tests failing due to missing category field

**Error**: `Cannot read property 'category' of undefined`

**Solution**: Add `category` field to all mock terpenes in test files.

### Issue: Bold styling not applying

**Error**: Core terpene names not appearing in bold

**Solution**: Wrap name in `<Typography>` component with `fontWeight` sx prop:

```typescript
<TableCell>
  <Typography sx={{ fontWeight: terpene.category === 'Core' ? 700 : 400 }}>{terpene.name}</Typography>
</TableCell>
```

---

## Next Steps

After completing this implementation:

1. **Run full test suite**: `pnpm run validate`
2. **Create PR**: Push branch `007-table-column-simplification` and open a PR against `main`
3. **Request review**: Tag team members for code review
4. **Update AGENTS.md**: Run `.specify/scripts/bash/update-agent-context.sh` to update agent context
5. **Deploy**: After PR merge, verify deployment to staging/production

---

**Estimated Total Time**: 2-3 hours  
**Complexity**: Low (existing component modification with clear requirements)  
**Risk Level**: Low (no data model changes, well-defined scope)
