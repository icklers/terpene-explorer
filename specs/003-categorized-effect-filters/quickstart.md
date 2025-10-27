# Quickstart Guide: Categorized Effect Filters

**Feature**: 003-categorized-effect-filters  
**Branch**: `003-categorized-effect-filters` (based on `002-terpene-data-model`)  
**Estimated Effort**: 8-12 hours (medium complexity)

## Overview

This guide provides step-by-step instructions for implementing the categorized effect filters feature. Follow this checklist to ensure all requirements from `spec.md` are met.

**Goal**: Enable users to filter terpenes by therapeutic effect categories (Mood, Cognitive, Relaxation, Physical) with visual grouping, mobile-friendly accordions, and auto-syncing filter logic.

---

## Prerequisites

### Environment

- **Node.js**: 22.13+ (LTS)
- **Package Manager**: pnpm 9.15+
- **TypeScript**: 5.7+
- **React**: 19.2+
- **Material UI**: 6.3+

### Required Reading

1. `specs/003-categorized-effect-filters/spec.md` (requirements)
2. `specs/003-categorized-effect-filters/research.md` (technical decisions)
3. `specs/003-categorized-effect-filters/data-model.md` (entity definitions)
4. `specs/003-categorized-effect-filters/contracts/component-contracts.md` (interfaces)

### Database Changes (Already Complete)

✅ `data/terpene-database.json` updated with:
- `effectCategories` array (4 category objects)
- `effectCategoryMapping` object (19 effect→category mappings)

✅ Zod schemas updated in `src/utils/terpeneSchema.ts`:
- `EffectCategoryIdEnum`, `EffectCategorySchema`, `EffectCategoryMappingSchema`

---

## Setup

### 1. Install Dependencies (if not already installed)

```bash
pnpm install
```

**Required packages** (already in `package.json`):
- `@mui/material@^6.3.0`
- `@mui/icons-material@^6.3.0`
- `zod@^3.24.1`
- `react@^19.2.0`

### 2. Verify Database Schema

```bash
# Check effectCategories
jq '.effectCategories' data/terpene-database.json

# Check effectCategoryMapping
jq '.effectCategoryMapping' data/terpene-database.json
```

**Expected Output**:
- 4 category objects (mood, cognitive, relaxation, physical)
- 19 effect mappings (e.g., "Energizing" → "mood")

### 3. Verify TypeScript Compilation

```bash
pnpm type-check
```

**Expected**: No errors. Zod schema types should be exported from `src/utils/terpeneSchema.ts`.

---

## Implementation Checklist

### Phase 1: Frontend Constants (1-2 hours)

**File**: Create `src/utils/categoryUIConfig.ts`

- [ ] **Step 1.1**: Define `CategoryUIConfig` interface

```typescript
export interface CategoryUIConfig {
  emoticon: string; // Unicode emoticon
  fallbackLetter: string; // Single letter for fallback
  ariaLabel: string; // Screen reader label
}
```

- [ ] **Step 1.2**: Create `CATEGORY_UI_CONFIG` constant

```typescript
export const CATEGORY_UI_CONFIG: Record<EffectCategoryId, CategoryUIConfig> = {
  mood: {
    emoticon: '⚡',
    fallbackLetter: 'M',
    ariaLabel: 'Mood and Energy category',
  },
  cognitive: {
    emoticon: '🧠',
    fallbackLetter: 'C',
    ariaLabel: 'Cognitive and Focus category',
  },
  relaxation: {
    emoticon: '😌',
    fallbackLetter: 'R',
    ariaLabel: 'Relaxation and Sleep category',
  },
  physical: {
    emoticon: '💪',
    fallbackLetter: 'P',
    ariaLabel: 'Physical Relief category',
  },
};
```

- [ ] **Step 1.3**: Add unit tests

```bash
# Create test file
touch src/utils/__tests__/categoryUIConfig.test.ts
```

**Test cases**:
- Config keys match `EffectCategoryId` enum values
- All emoticons are valid Unicode strings
- All fallback letters are single uppercase characters
- All ARIA labels are non-empty strings

---

### Phase 2: Theme Tokens (1 hour)

**File**: Modify `src/theme/themeConfig.ts`

- [ ] **Step 2.1**: Add category color tokens to `lightTheme`

```typescript
// src/theme/lightTheme.ts
export const lightTheme = createTheme({
  palette: {
    // ... existing palette
    category: {
      mood: '#FF6B6B', // Energetic red
      cognitive: '#4ECDC4', // Focus teal
      relaxation: '#95E1D3', // Calm mint
      physical: '#F38181', // Relief coral
    },
  },
});
```

- [ ] **Step 2.2**: Add tokens to `darkTheme`

```typescript
// src/theme/darkTheme.ts
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // ... existing palette
    category: {
      mood: '#FF8787', // Lighter for dark mode
      cognitive: '#6FD9D1',
      relaxation: '#AAE8DB',
      physical: '#F59A9A',
    },
  },
});
```

- [ ] **Step 2.3**: Extend TypeScript theme types

```typescript
// src/theme/themeConfig.ts
declare module '@mui/material/styles' {
  interface Palette {
    category: {
      mood: string;
      cognitive: string;
      relaxation: string;
      physical: string;
    };
  }
  interface PaletteOptions {
    category?: {
      mood?: string;
      cognitive?: string;
      relaxation?: string;
      physical?: string;
    };
  }
}
```

- [ ] **Step 2.4**: Verify theme compilation

```bash
pnpm type-check
```

---

### Phase 3: CategoryEmoticon Component (1-2 hours)

**File**: Create `src/components/filters/CategoryEmoticon.tsx`

- [ ] **Step 3.1**: Create component file

```bash
mkdir -p src/components/filters
touch src/components/filters/CategoryEmoticon.tsx
```

- [ ] **Step 3.2**: Implement emoticon rendering with fallback

```typescript
import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import type { EffectCategoryId } from '@/utils/terpeneSchema';

interface CategoryEmoticonProps {
  emoticon: string;
  fallbackLetter: string;
  ariaLabel: string;
  categoryId: EffectCategoryId;
  size?: 'small' | 'medium' | 'large';
}

export const CategoryEmoticon: React.FC<CategoryEmoticonProps> = ({
  emoticon,
  fallbackLetter,
  ariaLabel,
  categoryId,
  size = 'medium',
}) => {
  const theme = useTheme();
  const [isEmoticonSupported, setIsEmoticonSupported] = useState(true);

  useEffect(() => {
    // Canvas-based emoticon detection
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillText(emoticon, 0, 0);
    const imgData = ctx.getImageData(0, 0, 1, 1).data;
    const isTransparent = imgData[3] === 0;
    setIsEmoticonSupported(!isTransparent);
  }, [emoticon]);

  const sizeMap = {
    small: '1.25rem',
    medium: '1.5rem',
    large: '2rem',
  };

  if (isEmoticonSupported) {
    return (
      <Box
        role="img"
        aria-label={ariaLabel}
        sx={{ fontSize: sizeMap[size], lineHeight: 1 }}
      >
        {emoticon}
      </Box>
    );
  }

  // Fallback: colored circle with letter
  return (
    <Box
      role="img"
      aria-label={ariaLabel}
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.category[categoryId],
        color: theme.palette.getContrastText(theme.palette.category[categoryId]),
        fontWeight: 'bold',
        fontSize: '0.875rem',
      }}
    >
      {fallbackLetter}
    </Box>
  );
};
```

- [ ] **Step 3.3**: Create unit tests

```bash
touch src/components/filters/__tests__/CategoryEmoticon.test.tsx
```

**Test cases**:
- Renders emoticon when supported
- Falls back to letter when emoticon not supported
- Uses correct category color from theme
- Has proper ARIA label

---

### Phase 4: Filter Service Functions (2-3 hours)

**File**: Modify `src/services/filterService.ts`

- [ ] **Step 4.1**: Add `applyEffectFilters` function

```typescript
import type { Terpene, FilterState, EffectCategoryMapping } from '@/types';

export function applyEffectFilters(
  terpenes: Terpene[],
  filters: FilterState,
  effectCategoryMapping: EffectCategoryMapping
): Terpene[] {
  const { categoryFilters, effectFilters } = filters;

  if (categoryFilters.length === 0 && effectFilters.length === 0) {
    return terpenes;
  }

  return terpenes.filter((terpene) => {
    const matchesCategoryFilter =
      categoryFilters.length === 0 ||
      categoryFilters.some((categoryId) =>
        terpene.effects.some((effect) => effectCategoryMapping[effect] === categoryId)
      );

    const matchesEffectFilter =
      effectFilters.length === 0 ||
      effectFilters.some((effectId) => terpene.effects.includes(effectId));

    if (categoryFilters.length > 0 && effectFilters.length > 0) {
      return matchesCategoryFilter || matchesEffectFilter;
    } else {
      return matchesCategoryFilter && matchesEffectFilter;
    }
  });
}
```

- [ ] **Step 4.2**: Add `syncCategoryFilters` function

```typescript
export function syncCategoryFilters(
  filters: FilterState,
  effectCategoryMapping: EffectCategoryMapping
): FilterState {
  const updatedCategoryFilters = filters.categoryFilters.filter((categoryId) =>
    filters.effectFilters.some((effectId) => effectCategoryMapping[effectId] === categoryId)
  );

  return {
    ...filters,
    categoryFilters: updatedCategoryFilters,
  };
}
```

- [ ] **Step 4.3**: Create unit tests

```bash
touch src/services/__tests__/filterService.test.ts
```

**Test cases**:
- `applyEffectFilters`: OR logic for multiple categories
- `applyEffectFilters`: OR logic for category + effect filters
- `applyEffectFilters`: Returns all when no filters active
- `syncCategoryFilters`: Auto-deselects category when effects cleared
- `syncCategoryFilters`: Keeps category when effects still selected

---

### Phase 5: CategoryFilterGroup Component (3-4 hours)

**File**: Create `src/components/filters/CategoryFilterGroup.tsx`

- [ ] **Step 5.1**: Create component with desktop/mobile variants

```typescript
import React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { EffectCategory, Effect, EffectCategoryId, CategoryUIConfig } from '@/types';
import { CategoryEmoticon } from './CategoryEmoticon';

interface CategoryFilterGroupProps {
  category: EffectCategory;
  uiConfig: CategoryUIConfig;
  isCategorySelected: boolean;
  selectedEffects: Effect[];
  onCategoryToggle: (categoryId: EffectCategoryId) => void;
  onEffectToggle: (effect: Effect) => void;
  isMobile: boolean;
}

export const CategoryFilterGroup: React.FC<CategoryFilterGroupProps> = ({
  category,
  uiConfig,
  isCategorySelected,
  selectedEffects,
  onCategoryToggle,
  onEffectToggle,
  isMobile,
}) => {
  const theme = useTheme();

  // Determine checkbox state
  const categoryEffects = Object.entries(effectCategoryMapping)
    .filter(([_, catId]) => catId === category.id)
    .map(([effect]) => effect as Effect);

  const selectedInCategory = categoryEffects.filter((e) => selectedEffects.includes(e));
  const isIndeterminate = selectedInCategory.length > 0 && selectedInCategory.length < categoryEffects.length;

  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Checkbox
        checked={isCategorySelected}
        indeterminate={isIndeterminate}
        onChange={() => onCategoryToggle(category.id)}
        aria-label={`Filter by ${category.name}`}
      />
      <CategoryEmoticon {...uiConfig} categoryId={category.id} />
      <Typography variant="subtitle1">{category.name}</Typography>
    </Box>
  );

  const effectChips = (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {categoryEffects.map((effect) => (
        <Chip
          key={effect}
          label={effect}
          onClick={() => onEffectToggle(effect)}
          variant={selectedEffects.includes(effect) ? 'filled' : 'outlined'}
          sx={{
            bgcolor: selectedEffects.includes(effect)
              ? theme.palette.category[category.id]
              : 'transparent',
            borderColor: theme.palette.category[category.id],
          }}
          aria-label={`${effect} effect`}
        />
      ))}
    </Box>
  );

  if (isMobile) {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>{header}</AccordionSummary>
        <AccordionDetails>{effectChips}</AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box>
      {header}
      {effectChips}
    </Box>
  );
};
```

- [ ] **Step 5.2**: Create unit tests

**Test file**: `src/components/filters/__tests__/CategoryFilterGroup.test.tsx`

**Test cases**:
- Renders desktop layout when `isMobile=false`
- Renders accordion when `isMobile=true`
- Checkbox shows indeterminate when some effects selected
- Calls `onCategoryToggle` when checkbox clicked
- Calls `onEffectToggle` when chip clicked

---

### Phase 6: Modify useFilters Hook (1-2 hours)

**File**: Modify `src/hooks/useFilters.ts`

- [ ] **Step 6.1**: Add category filter state to `FilterState`

```typescript
export interface FilterState {
  categoryFilters: EffectCategoryId[];
  effectFilters: Effect[];
  // ... other filter fields
}
```

- [ ] **Step 6.2**: Add `toggleCategoryFilter` method

```typescript
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
```

- [ ] **Step 6.3**: Modify `toggleEffectFilter` to auto-sync categories

```typescript
const toggleEffectFilter = useCallback(
  (effect: Effect) => {
    setFilters((prev) => {
      const isSelected = prev.effectFilters.includes(effect);
      const newEffectFilters = isSelected
        ? prev.effectFilters.filter((e) => e !== effect)
        : [...prev.effectFilters, effect];

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
```

- [ ] **Step 6.4**: Create unit tests

**Test file**: `src/hooks/__tests__/useFilters.test.ts`

**Test cases**:
- `toggleCategoryFilter` adds/removes category
- `toggleEffectFilter` syncs category filters (FR-020)
- Filter state persists to localStorage

---

### Phase 7: Integrate into FilterControls (1 hour)

**File**: Modify `src/components/filters/FilterControls.tsx`

- [ ] **Step 7.1**: Import new components and hooks

```typescript
import { CategoryFilterGroup } from './CategoryFilterGroup';
import { CATEGORY_UI_CONFIG } from '@/utils/categoryUIConfig';
import { useTerpeneDatabase } from '@/hooks/useTerpeneDatabase';
```

- [ ] **Step 7.2**: Add category filters section

```typescript
function FilterControls(props: FilterControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { effectCategories, effectCategoryMapping } = useTerpeneDatabase();

  return (
    <Box>
      {/* Existing filter sections */}

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
                uiConfig={CATEGORY_UI_CONFIG[category.id]}
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

### Phase 8: Update Data Loading Hook (1 hour)

**File**: Modify `src/hooks/useTerpeneDatabase.ts`

- [ ] **Step 8.1**: Load category data from database

```typescript
export function useTerpeneDatabase() {
  const [data, setData] = useState<TerpeneDatabase | null>(null);

  useEffect(() => {
    fetch('/data/terpene-database.json')
      .then((res) => res.json())
      .then((json) => {
        const validated = TerpeneDatabaseSchema.parse(json);
        setData(validated);
      });
  }, []);

  return {
    terpenes: data?.terpenes ?? [],
    effectCategories: data?.effectCategories ?? [],
    effectCategoryMapping: data?.effectCategoryMapping ?? {},
  };
}
```

- [ ] **Step 8.2**: Create unit tests

**Test cases**:
- Fetches database from `/data/terpene-database.json`
- Validates data with Zod schema
- Returns effectCategories and effectCategoryMapping

---

## Testing

### Run Unit Tests

```bash
pnpm test:unit
```

**Expected**: All tests pass (components, services, hooks)

### Run Integration Tests

```bash
pnpm test:integration
```

**Expected**: User Story 4 flow passes (category filter → terpene list updates)

### Run E2E Tests

```bash
pnpm test:e2e
```

**Expected**: Playwright tests pass:
- Desktop category filter interaction
- Mobile accordion expand/collapse
- Filter persistence across page reload

### Run Accessibility Tests

```bash
pnpm test:a11y
```

**Expected**: No WCAG violations (vitest-axe checks keyboard nav, ARIA labels)

---

## Performance Validation

### Bundle Size Check

```bash
pnpm build
pnpm analyze
```

**Target**: Zero increase in main bundle size (category data should be in JSON, not JS bundle)

### Filter Response Time

```bash
# Open browser dev tools → Performance tab
# Apply category filter with 500+ terpenes loaded
# Measure time from click to UI update
```

**Target**: <100ms response time

### Lighthouse Score

```bash
pnpm lighthouse
```

**Target**: No regression in Performance, Accessibility, Best Practices scores

---

## Manual Testing Checklist

### Desktop Browser (Chrome/Firefox/Safari)

- [ ] Category checkboxes render correctly
- [ ] Emoticons display (or fallback letters if unsupported)
- [ ] Category checkbox goes indeterminate when some effects selected
- [ ] Clicking category checkbox selects/deselects all effects in category
- [ ] Effect chips use category color from theme
- [ ] Multiple category filters use OR logic (show terpenes matching ANY category)
- [ ] Category + effect filters use OR logic (show terpenes matching category OR effect)
- [ ] Auto-deselect: Category unchecks when all effects manually deselected
- [ ] Keyboard navigation works (Tab to focus, Space to toggle)
- [ ] Screen reader announces category names correctly

### Mobile Browser (iOS Safari, Chrome Android)

- [ ] Categories render as accordions
- [ ] Accordions are collapsed by default
- [ ] Tapping accordion header expands/collapses content
- [ ] Category checkbox visible in accordion header
- [ ] Effect chips visible in accordion details
- [ ] All desktop filter logic works on mobile

### Theme Switching

- [ ] Category colors adapt to light/dark theme
- [ ] Text contrast meets WCAG AA (4.5:1 ratio)
- [ ] Emoticon fallback letters use contrasting colors

### Language Switching (if i18n active)

- [ ] Category names translate correctly
- [ ] Effect names translate correctly
- [ ] ARIA labels translate correctly

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (unit, integration, E2E, accessibility)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (no new warnings)
- [ ] Bundle size within target (<1% increase)
- [ ] Performance targets met (<100ms filter response)
- [ ] Accessibility audit passed (no WCAG violations)

### Database Migration

- [ ] `data/terpene-database.json` deployed with effectCategories
- [ ] `public/data/terpene-database.json` synced
- [ ] Database schema version incremented (if using versioning)

### Documentation

- [ ] Update README.md with new filter feature
- [ ] Update ACCESSIBILITY.md with category filter keyboard shortcuts
- [ ] Update CHANGELOG.md with feature release notes

### Monitoring

- [ ] Set up analytics event for category filter usage
- [ ] Monitor Sentry/error logs for filter-related errors
- [ ] Track performance metrics (filter response time)

---

## Troubleshooting

### Issue: Emoticons not rendering

**Cause**: Browser doesn't support Unicode emoticons  
**Solution**: Fallback letters should display automatically via canvas detection

### Issue: Category checkbox not syncing when effects deselected

**Cause**: `syncCategoryFilters` not called in `toggleEffectFilter`  
**Solution**: Verify `toggleEffectFilter` calls `syncCategoryFilters` before setting state

### Issue: Filter response time >100ms

**Cause**: Inefficient filter algorithm or missing memoization  
**Solution**:
- Wrap `applyEffectFilters` in `useMemo`
- Memoize `CategoryFilterGroup` with `React.memo`
- Use `useCallback` for event handlers

### Issue: Tests failing after database update

**Cause**: Mock data doesn't include effectCategories  
**Solution**: Update test fixtures in `src/test/fixtures.ts` with category data

---

## Success Criteria Validation

**From `spec.md`**:

- [ ] **SC-001**: Visual separation of categories (desktop: dividers, mobile: accordions)
- [ ] **SC-002**: Category filters persist across sessions (localStorage)
- [ ] **SC-003**: Keyboard navigation works (Tab, Space, Enter)
- [ ] **SC-004**: Screen reader compatibility (ARIA labels)
- [ ] **SC-005**: Mobile accordion UX (tap to expand, collapsed by default)
- [ ] **SC-006**: No bundle size increase (categories in JSON)
- [ ] **SC-007**: <100ms filter response time
- [ ] **SC-008**: Multi-category filter works (OR logic)
- [ ] **SC-009**: Category-level filtering works (User Story 4)
- [ ] **SC-010**: Category + effect combination uses OR logic

---

## Next Steps

After completing this implementation:

1. **Create Pull Request**: Merge `003-categorized-effect-filters` into `002-terpene-data-model`
2. **Code Review**: Tag reviewers for accessibility, performance, TypeScript checks
3. **QA Testing**: Run through manual testing checklist on staging
4. **Documentation**: Update user-facing docs with new filter capabilities
5. **Analytics**: Monitor category filter adoption rates

---

## Resources

- **Spec**: `specs/003-categorized-effect-filters/spec.md`
- **Research**: `specs/003-categorized-effect-filters/research.md`
- **Data Model**: `specs/003-categorized-effect-filters/data-model.md`
- **Contracts**: `specs/003-categorized-effect-filters/contracts/component-contracts.md`
- **Material UI Docs**: https://mui.com/material-ui/
- **React Testing Library**: https://testing-library.com/react
- **Playwright**: https://playwright.dev/

---

**Estimated Total Time**: 8-12 hours  
**Complexity**: Medium  
**Risk Level**: Low (additive feature, no breaking changes)
