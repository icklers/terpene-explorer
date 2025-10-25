# Component Contracts: Categorized Effect Filters

**Feature**: 003-categorized-effect-filters  
**Date**: 2025-10-26  
**Type**: React Component Interfaces (TypeScript)

## Overview

This document defines the component interfaces, props contracts, and interaction patterns for the categorized effect filters feature. All
components use Material UI primitives and follow existing patterns from the FilterControls component.

---

## 1. CategoryFilterGroup Component

**Purpose**: Renders a single effect category with header, checkbox, and effect chips. Adapts to accordion on mobile.

**File**: `src/components/filters/CategoryFilterGroup.tsx`

### Props Contract

```typescript
interface CategoryFilterGroupProps {
  // Category data from database
  category: EffectCategory;

  // UI configuration (emoticon, ARIA labels)
  uiConfig: CategoryUIConfig;

  // Filter state
  isCategorySelected: boolean;
  selectedEffects: Effect[];

  // Event handlers
  onCategoryToggle: (categoryId: EffectCategoryId) => void;
  onEffectToggle: (effect: Effect) => void;

  // Responsive behavior
  isMobile: boolean; // From useMediaQuery(theme.breakpoints.down('sm'))

  // Accessibility
  'aria-labelledby'?: string;
}
```

### Example Usage

```typescript
<CategoryFilterGroup
  category={{
    id: 'mood',
    name: 'Mood & Energy',
    displayOrder: 1,
    description: 'Daytime energizing effects...',
  }}
  uiConfig={{
    emoticon: '⚡',
    fallbackLetter: 'M',
    ariaLabel: 'Mood and Energy category',
  }}
  isCategorySelected={true}
  selectedEffects={['Energizing', 'Uplifting']}
  onCategoryToggle={(id) => console.log('Toggle category:', id)}
  onEffectToggle={(effect) => console.log('Toggle effect:', effect)}
  isMobile={false}
/>
```

### Behavior Contracts

1. **Desktop (isMobile: false)**:
   - Always expanded (no accordion)
   - Category header with checkbox visible at top
   - Effect chips displayed in flex-wrap grid below header
   - Divider rendered between categories (not before first)

2. **Mobile (isMobile: true)**:
   - Wrapped in Material UI `<Accordion>` component
   - Category header becomes `<AccordionSummary>` with expand icon
   - Effect chips in `<AccordionDetails>`
   - Collapsed by default, expands on tap

3. **Category Checkbox**:
   - Checked when `isCategorySelected === true`
   - Indeterminate when some (but not all) effects selected
   - Calls `onCategoryToggle(category.id)` on click

4. **Effect Chips**:
   - Colored using `theme.category[category.id]`
   - Outlined when not selected, filled when selected
   - Calls `onEffectToggle(effect)` on click

---

## 2. CategoryEmoticon Component

**Purpose**: Renders category emoticon with fallback and ARIA label for accessibility.

**File**: `src/components/filters/CategoryEmoticon.tsx`

### Props Contract

```typescript
interface CategoryEmoticonProps {
  // Category UI config
  emoticon: string; // Unicode emoticon (e.g., '⚡')
  fallbackLetter: string; // Single letter (e.g., 'M')
  ariaLabel: string; // Screen reader label (e.g., 'Mood and Energy category')
  categoryId: EffectCategoryId; // For color styling on fallback

  // Optional sizing
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
}
```

### Example Usage

```typescript
<CategoryEmoticon
  emoticon="⚡"
  fallbackLetter="M"
  ariaLabel="Mood and Energy category"
  categoryId="mood"
  size="medium"
/>
```

### Behavior Contracts

1. **Emoticon Rendering**:
   - Attempts to render Unicode emoticon
   - Uses canvas-based feature detection to check support
   - Falls back to colored circle with letter if emoticon fails

2. **Fallback Display**:
   - Circular background with `theme.category[categoryId]` color
   - Contrasting text color using `theme.palette.getContrastText()`
   - Single letter centered (e.g., "M")

3. **Accessibility**:
   - `role="img"` on emoticon element
   - `aria-label` with therapeutic context (not technical emoticon name)
   - Fallback letter also has `aria-label`

---

## 3. FilterControls Component (Modified)

**Purpose**: Main filter panel component. Extended to include category-based filtering UI.

**File**: `src/components/filters/FilterControls.tsx` (MODIFY EXISTING)

### Additional Props

```typescript
interface FilterControlsProps {
  // Existing props (not shown)
  // ...

  // NEW: Category filter state
  categoryFilters: EffectCategoryId[];
  onCategoryFilterToggle: (categoryId: EffectCategoryId) => void;

  // NEW: Effect categories from database
  effectCategories: EffectCategory[];
  effectCategoryMapping: EffectCategoryMapping;
}
```

### Component Structure

```typescript
function FilterControls(props: FilterControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load UI config
  const categoryUIConfig = CATEGORY_UI_CONFIG;

  return (
    <Box>
      {/* Existing filter sections (aroma, intensity, etc.) */}

      {/* NEW: Category-based effect filters */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Effect Categories
        </Typography>

        {effectCategories
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((category, index) => (
            <React.Fragment key={category.id}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <CategoryFilterGroup
                category={category}
                uiConfig={categoryUIConfig[category.id]}
                isCategorySelected={props.categoryFilters.includes(category.id)}
                selectedEffects={props.effectFilters}
                onCategoryToggle={props.onCategoryFilterToggle}
                onEffectToggle={props.onEffectToggle}
                isMobile={isMobile}
              />
            </React.Fragment>
          ))}
      </Box>
    </Box>
  );
}
```

---

## 4. Filter Service Interface

**File**: `src/services/filterService.ts` (MODIFY EXISTING)

### Function Contracts

#### `applyEffectFilters`

```typescript
/**
 * Applies category and effect filters to terpene array using OR/AND logic.
 *
 * Logic:
 * - Multiple category filters: OR (show terpenes matching ANY category)
 * - Multiple effect filters: OR (show terpenes with ANY effect)
 * - Category + effect filters: OR (show terpenes matching category OR effect)
 *
 * @param terpenes - Array of terpenes to filter
 * @param filters - Current filter state (category + effect selections)
 * @param effectCategoryMapping - Effect→category lookup map from database
 * @returns Filtered array of terpenes
 */
export function applyEffectFilters(
  terpenes: Terpene[],
  filters: FilterState,
  effectCategoryMapping: EffectCategoryMapping
): Terpene[];
```

**Implementation Contract**:

```typescript
export function applyEffectFilters(
  terpenes: Terpene[],
  filters: FilterState,
  effectCategoryMapping: EffectCategoryMapping
): Terpene[] {
  const { categoryFilters, effectFilters } = filters;

  // No filters = show all
  if (categoryFilters.length === 0 && effectFilters.length === 0) {
    return terpenes;
  }

  return terpenes.filter((terpene) => {
    // Check category filters (OR logic)
    const matchesCategoryFilter =
      categoryFilters.length === 0 ||
      categoryFilters.some((categoryId) => {
        return terpene.effects.some((effect) => effectCategoryMapping[effect] === categoryId);
      });

    // Check individual effect filters (OR logic)
    const matchesEffectFilter = effectFilters.length === 0 || effectFilters.some((effectId) => terpene.effects.includes(effectId));

    // Combine: OR logic when both filter types active
    if (categoryFilters.length > 0 && effectFilters.length > 0) {
      return matchesCategoryFilter || matchesEffectFilter;
    } else {
      return matchesCategoryFilter && matchesEffectFilter;
    }
  });
}
```

#### `syncCategoryFilters`

```typescript
/**
 * Auto-deselects category filters when all their effects are manually deselected (FR-020).
 *
 * Example: User has category "mood" selected. User then deselects all mood effects
 * (Energizing, Uplifting, etc.). This function removes "mood" from categoryFilters.
 *
 * @param filters - Current filter state
 * @param effectCategoryMapping - Effect→category lookup map from database
 * @returns Updated filter state with synced category filters
 */
export function syncCategoryFilters(filters: FilterState, effectCategoryMapping: EffectCategoryMapping): FilterState;
```

**Implementation Contract**:

```typescript
export function syncCategoryFilters(filters: FilterState, effectCategoryMapping: EffectCategoryMapping): FilterState {
  const updatedCategoryFilters = filters.categoryFilters.filter((categoryId) => {
    // Keep category selected if ANY of its effects are still selected
    return filters.effectFilters.some((effectId) => effectCategoryMapping[effectId] === categoryId);
  });

  return {
    ...filters,
    categoryFilters: updatedCategoryFilters,
  };
}
```

---

## 5. Hook Interface: useFilters

**File**: `src/hooks/useFilters.ts` (MODIFY EXISTING)

### Extended Hook Contract

```typescript
interface UseFiltersReturn {
  // Existing return values
  filters: FilterState;
  setFilters: (filters: FilterState) => void;

  // NEW: Category filter methods
  toggleCategoryFilter: (categoryId: EffectCategoryId) => void;

  // MODIFIED: Effect filter method (now auto-syncs categories)
  toggleEffectFilter: (effect: Effect) => void;

  // Existing methods
  clearFilters: () => void;
  // ... other filter methods
}
```

### Implementation Contract

```typescript
export function useFilters(effectCategoryMapping: EffectCategoryMapping): UseFiltersReturn {
  const [filters, setFilters] = useLocalStorage<FilterState>('filterState', {
    categoryFilters: [],
    effectFilters: [],
    // ... other filters
  });

  const toggleCategoryFilter = useCallback(
    (categoryId: EffectCategoryId) => {
      setFilters((prev) => {
        const isSelected = prev.categoryFilters.includes(categoryId);
        const newCategoryFilters = isSelected
          ? prev.categoryFilters.filter((id) => id !== categoryId)
          : [...prev.categoryFilters, categoryId];

        return {
          ...prev,
          categoryFilters: newCategoryFilters,
        };
      });
    },
    [setFilters]
  );

  const toggleEffectFilter = useCallback(
    (effect: Effect) => {
      setFilters((prev) => {
        const isSelected = prev.effectFilters.includes(effect);
        const newEffectFilters = isSelected ? prev.effectFilters.filter((e) => e !== effect) : [...prev.effectFilters, effect];

        // Auto-sync category filters (FR-020)
        return syncCategoryFilters(
          {
            ...prev,
            effectFilters: newEffectFilters,
          },
          effectCategoryMapping
        );
      });
    },
    [setFilters, effectCategoryMapping]
  );

  return {
    filters,
    setFilters,
    toggleCategoryFilter,
    toggleEffectFilter,
    clearFilters: () => setFilters({ categoryFilters: [], effectFilters: [] }),
    // ... other methods
  };
}
```

---

## Testing Contracts

### Unit Tests

**File**: `tests/unit/components/CategoryFilterGroup.test.tsx`

```typescript
describe('CategoryFilterGroup', () => {
  it('should render category name and emoticon', () => {
    // Verify category header displays correctly
  });

  it('should render as accordion on mobile', () => {
    // Verify accordion wrapper when isMobile=true
  });

  it('should call onCategoryToggle when checkbox clicked', () => {
    // Verify event handler invoked with correct categoryId
  });

  it('should render effect chips with category color', () => {
    // Verify chips have correct background color from theme
  });

  it('should show indeterminate checkbox when some effects selected', () => {
    // Verify checkbox indeterminate state
  });
});
```

**File**: `tests/unit/services/filterService.test.ts`

```typescript
describe('applyEffectFilters', () => {
  it('should apply OR logic for multiple category filters', () => {
    // categoryFilters: ['mood', 'cognitive']
    // Result should include terpenes with ANY mood OR cognitive effects
  });

  it('should apply OR logic when both category and effect filters active', () => {
    // categoryFilters: ['mood'], effectFilters: ['Pain relief']
    // Result should include mood effects OR pain relief
  });

  it('should return all terpenes when no filters active', () => {
    // categoryFilters: [], effectFilters: []
    // Result should equal input array
  });
});

describe('syncCategoryFilters', () => {
  it('should auto-deselect category when all effects deselected', () => {
    // categoryFilters: ['mood'], effectFilters: ['Energizing']
    // After deselecting 'Energizing' → categoryFilters: []
  });

  it('should keep category selected if any effect still selected', () => {
    // categoryFilters: ['mood'], effectFilters: ['Energizing', 'Uplifting']
    // After deselecting 'Energizing' → categoryFilters: ['mood'] (Uplifting still selected)
  });
});
```

### Integration Tests

**File**: `tests/integration/us4-category-filter-flow.test.tsx`

```typescript
describe('User Story 4: Category-Level Filtering', () => {
  it('should filter terpenes by category selection', () => {
    // Click "Mood & Energy" category checkbox
    // Verify only terpenes with mood effects displayed
  });

  it('should combine category and effect filters with OR logic', () => {
    // Select "Mood & Energy" category + "Pain relief" effect
    // Verify results include mood effects OR pain relief
  });

  it('should auto-deselect category when effects manually deselected', () => {
    // Select "Mood & Energy" category (all mood effects selected)
    // Deselect each mood effect individually
    // Verify category checkbox auto-unchecks after last effect
  });
});
```

### E2E Tests

**File**: `tests/e2e/filter-categories.spec.ts`

```typescript
test('User can filter by effect category', async ({ page }) => {
  await page.goto('/');

  // Click category checkbox
  await page.getByRole('checkbox', { name: /mood.*energy/i }).click();

  // Verify filtered results
  const terpenes = await page.locator('[data-testid="terpene-card"]').all();
  expect(terpenes.length).toBeGreaterThan(0);

  // Verify each terpene has at least one mood effect
  for (const terpene of terpenes) {
    const effects = await terpene.locator('[data-testid="effect-badge"]').allTextContents();
    const hasMoodEffect = effects.some((e) => ['Energizing', 'Mood enhancing', 'Mood stabilizing', 'Uplifting'].includes(e));
    expect(hasMoodEffect).toBe(true);
  }
});

test('Mobile accordion expands/collapses categories', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

  // Category should be collapsed initially
  await expect(page.getByText('Energizing')).not.toBeVisible();

  // Click accordion header
  await page.getByRole('button', { name: /mood.*energy/i }).click();

  // Effects should be visible
  await expect(page.getByText('Energizing')).toBeVisible();
});
```

---

## Performance Contracts

### Render Optimization

```typescript
// Memoize category groups to prevent unnecessary re-renders
const MemoizedCategoryFilterGroup = React.memo(CategoryFilterGroup, (prevProps, nextProps) => {
  return (
    prevProps.isCategorySelected === nextProps.isCategorySelected &&
    prevProps.selectedEffects.length === nextProps.selectedEffects.length &&
    prevProps.isMobile === nextProps.isMobile
  );
});
```

### Filter Performance

```typescript
// Memoize filtered terpenes
const filteredTerpenes = useMemo(() => {
  return applyEffectFilters(terpenes, filters, effectCategoryMapping);
}, [terpenes, filters, effectCategoryMapping]);

// Performance target: <100ms for 500 terpenes
```

---

## Accessibility Contracts

### Keyboard Navigation

- All category checkboxes: `Tab` to focus, `Space` to toggle
- All effect chips: `Tab` to focus, `Enter`/`Space` to toggle
- Accordion expand: `Tab` to header, `Enter`/`Space` to expand/collapse

### Screen Reader Announcements

- Category checkbox: "Mood and Energy category, checkbox, checked"
- Effect chip: "Energizing effect, selected"
- Accordion: "Mood and Energy category, button, collapsed"

### ARIA Attributes

- Category checkbox: `aria-label="Filter by {category name}"`
- Effect chip: `aria-label="{effect name} effect"`
- Accordion: `aria-controls="{categoryId}-content"`, `aria-expanded="true|false"`

---

## Summary

This contract defines:

1. ✅ **3 new components**: CategoryFilterGroup, CategoryEmoticon, modified FilterControls
2. ✅ **2 service functions**: applyEffectFilters, syncCategoryFilters
3. ✅ **1 modified hook**: useFilters with category filter methods
4. ✅ **Testing contracts**: Unit, integration, E2E test specifications
5. ✅ **Performance contracts**: Memoization strategies, render optimization
6. ✅ **Accessibility contracts**: Keyboard navigation, screen reader support, ARIA attributes

All interfaces are type-safe via TypeScript and follow Material UI + React best practices.
