# Quickstart Guide: Enhanced Terpene Data Model

**Feature**: 002-terpene-data-model
**Audience**: Developers implementing this feature
**Prerequisites**: Familiarity with React, TypeScript, Material UI, and Zod

## Overview

This guide provides a step-by-step walkthrough for implementing the enhanced terpene data model feature. Follow these steps in order to ensure all components integrate correctly.

## Implementation Steps

### Step 1: Create Zod Schema (15 minutes)

**File**: `src/utils/terpeneSchema.ts`

1. Create the file with imports:
```typescript
import { z } from 'zod';
```

2. Define nested schemas first (bottom-up):
```typescript
const MolecularDataSchema = z.object({
  molecularFormula: z.string().regex(/^C\d+H\d+O?\d*$/),
  molecularWeight: z.number().positive(),
  boilingPoint: z.number().min(-273).nullable(),
  class: z.string().min(1),
});

const ReferenceSchema = z.object({
  source: z.string().min(1),
  type: z.string().min(1),
});

const ResearchTierSchema = z.object({
  dataQuality: z.enum(['Excellent', 'Good', 'Moderate', 'Limited']),
  evidenceSummary: z.string().min(1),
});
```

3. Define main Terpene schema:
```typescript
const TerpeneSchema = z.object({
  id: z.string().regex(/^terp-\d{3}$/),
  name: z.string().min(1),
  isomerOf: z.string().nullable(),
  isomerType: z.enum(['Optical', 'Positional', 'Structural']).nullable(),
  category: z.enum(['Core', 'Secondary', 'Minor']),
  aroma: z.string().min(1),
  taste: z.string().min(1),
  description: z.string().min(1),
  effects: z.array(z.string()).min(1),
  therapeuticProperties: z.array(z.string()),
  notableDifferences: z.string().optional(),
  concentrationRange: z.string().optional(),
  molecularData: MolecularDataSchema,
  sources: z.array(z.string()),
  references: z.array(ReferenceSchema),
  researchTier: ResearchTierSchema,
});
```

4. Define database container schema:
```typescript
const TerpeneDatabaseSchema = z.object({
  version: z.string(),
  created: z.string(),
  description: z.string().min(1),
  categorization_tiers: z.record(z.string()),
  schema_fields: z.record(z.any()),
  implementation_guidelines: z.record(z.any()),
  entries: z.array(TerpeneSchema).min(1),
});
```

5. Export schemas and types:
```typescript
export {
  TerpeneSchema,
  TerpeneDatabaseSchema,
  MolecularDataSchema,
  ReferenceSchema,
  ResearchTierSchema,
};

export type Terpene = z.infer<typeof TerpeneSchema>;
export type TerpeneDatabase = z.infer<typeof TerpeneDatabaseSchema>;
export type MolecularData = z.infer<typeof MolecularDataSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type ResearchTier = z.infer<typeof ResearchTierSchema>;
```

**Test**: Run `pnpm test src/utils/terpeneSchema.test.ts` (create test first)

---

### Step 2: Update Type Definitions (10 minutes)

**File**: `src/types/terpene.ts`

1. Re-export types from schema:
```typescript
export type {
  Terpene,
  TerpeneDatabase,
  MolecularData,
  Reference,
  ResearchTier,
} from '../utils/terpeneSchema';
```

2. Add UI-specific interfaces:
```typescript
export interface TerpeneDetailModalProps {
  open: boolean;
  terpene: Terpene | null;
  onClose: () => void;
}

export interface SearchOptions {
  fields?: ('name' | 'aroma' | 'effects' | 'therapeuticProperties')[];
  caseSensitive?: boolean;
}
```

---

### Step 3: Implement Data Service (20 minutes)

**File**: `src/services/terpeneData.ts`

1. Create load function:
```typescript
import { TerpeneDatabaseSchema, type Terpene } from '../utils/terpeneSchema';

export async function loadTerpeneDatabase(): Promise<Terpene[]> {
  try {
    // Dynamic import for code splitting
    const data = await import('../../data/terpene-database.json');

    // Validate entire database
    const validated = TerpeneDatabaseSchema.parse(data);

    return validated.entries;
  } catch (error) {
    console.error('Failed to load terpene database:', error);
    // Specific error message per clarification (2025-10-25)
    throw new Error('Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues');
  }
}
```

2. Add helper functions:
```typescript
export function getTerpeneById(
  terpenes: Terpene[],
  id: string
): Terpene | undefined {
  return terpenes.find((t) => t.id === id);
}

export function searchTerpenes(
  terpenes: Terpene[],
  query: string,
  options?: SearchOptions
): Terpene[] {
  if (!query.trim()) return terpenes;

  const normalizedQuery = options?.caseSensitive
    ? query
    : query.toLowerCase();

  const searchFields = options?.fields || [
    'name',
    'aroma',
    'effects',
    'therapeuticProperties',
  ];

  return terpenes.filter((terpene) => {
    return searchFields.some((field) => {
      if (field === 'effects' || field === 'therapeuticProperties') {
        return terpene[field].some((item) =>
          (options?.caseSensitive ? item : item.toLowerCase()).includes(
            normalizedQuery
          )
        );
      }
      const value = terpene[field];
      return (options?.caseSensitive ? value : value.toLowerCase()).includes(
        normalizedQuery
      );
    });
  });
}
```

**Test**: Run `pnpm test src/services/terpeneData.test.ts`

---

### Step 4: Create React Hook (15 minutes)

**File**: `src/hooks/useTerpeneData.ts`

```typescript
import { useState, useEffect } from 'react';
import { loadTerpeneDatabase } from '../services/terpeneData';
import type { Terpene } from '../types/terpene';

interface UseTerpeneDataResult {
  terpenes: Terpene[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useTerpeneData(): UseTerpeneDataResult {
  const [terpenes, setTerpenes] = useState<Terpene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadTerpeneDatabase();
      setTerpenes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { terpenes, loading, error, reload: load };
}
```

**Test**: Run `pnpm test src/hooks/useTerpeneData.test.ts`

---

### Step 5: Create Detail Modal Component (30 minutes)

**File**: `src/components/visualizations/TerpeneDetailModal.tsx`

1. Create **controlled** component structure (clarification: in-place content updates):
```typescript
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Divider,
  Box,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TerpeneDetailModalProps } from '../../types/terpene';

export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps> = ({
  open,
  terpene,
  onClose,
}) => {
  const { t } = useTranslation('terpene-details');

  // IMPORTANT: Don't return null - modal must remain mounted for in-place updates
  // When terpene is null, Dialog's open=false will hide it

  return (
    <Dialog
      open={open && terpene !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="terpene-detail-title"
      aria-describedby="terpene-detail-description"
      // Keep modal mounted for smooth content transitions (clarification 2025-10-25)
      keepMounted
    >
      <DialogTitle id="terpene-detail-title">{terpene.name}</DialogTitle>

      <DialogContent>
        {/* Effects Section */}
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            {t('fields.effects')}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {terpene.effects.map((effect) => (
              <Chip key={effect} label={effect} color="primary" />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Taste Section */}
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            {t('fields.taste')}
          </Typography>
          <Typography>{terpene.taste}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Description Section */}
        <Box mb={2} id="terpene-detail-description">
          <Typography variant="h6" gutterBottom>
            {t('fields.description')}
          </Typography>
          <Typography>{terpene.description}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Therapeutic Properties Section */}
        {terpene.therapeuticProperties.length > 0 && (
          <>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {t('fields.therapeuticProperties')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {terpene.therapeuticProperties.map((prop) => (
                  <Chip key={prop} label={prop} color="secondary" />
                ))}
              </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Notable Differences Section */}
        {terpene.notableDifferences && (
          <>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {t('fields.notableDifferences')}
              </Typography>
              <Typography>{terpene.notableDifferences}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Boiling Point Section */}
        {terpene.molecularData.boilingPoint !== null && (
          <>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {t('fields.boilingPoint')}
              </Typography>
              <Typography>
                {terpene.molecularData.boilingPoint}°C
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Sources Section */}
        {terpene.sources.length > 0 && (
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              {t('fields.sources')}
            </Typography>
            <ul>
              {terpene.sources.map((source, index) => (
                <li key={index}>
                  <Typography>{source}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('actions.close', { defaultValue: 'Close' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

**Test**: Run `pnpm test src/components/visualizations/TerpeneDetailModal.test.tsx`

---

### Step 6: Update TerpeneTable Component (20 minutes)

**File**: `src/components/visualizations/TerpeneTable.tsx`

1. Add state for selected terpene:
```typescript
const [selectedTerpene, setSelectedTerpene] = useState<Terpene | null>(null);
const [modalOpen, setModalOpen] = useState(false);
```

2. Add row click handler:
```typescript
const handleRowClick = (terpene: Terpene) => {
  setSelectedTerpene(terpene);
  setModalOpen(true);
};
```

3. Update TableRow to be clickable:
```typescript
<TableRow
  hover
  onClick={() => handleRowClick(terpene)}
  sx={{ cursor: 'pointer' }}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick(terpene);
    }
  }}
>
```

4. Remove Sources column (delete the TableCell for sources)

5. Add modal at end of component:
```typescript
<TerpeneDetailModal
  open={modalOpen}
  terpene={selectedTerpene}
  onClose={() => setModalOpen(false)}
/>
```

**Test**: Run `pnpm test:integration` for table click flow

---

### Step 7: Move SearchBar to Header (15 minutes)

**File**: `src/components/layout/Header.tsx`

1. Import SearchBar component
2. Lift search state to parent container if needed
3. Add SearchBar to header AppBar/Toolbar:
```typescript
<AppBar position="sticky">
  <Toolbar>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      Terpene Explorer
    </Typography>
    <SearchBar
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search terpenes..."
    />
  </Toolbar>
</AppBar>
```

4. Remove SearchBar from previous location

**Test**: Manual testing in browser

---

### Step 8: Add i18n Translations (10 minutes)

**File**: `src/i18n/locales/en/terpene-details.json`

```json
{
  "fields": {
    "effects": "Effects",
    "taste": "Taste",
    "description": "Description",
    "therapeuticProperties": "Therapeutic Properties",
    "notableDifferences": "Notable Differences",
    "boilingPoint": "Boiling Point",
    "sources": "Natural Sources"
  },
  "actions": {
    "close": "Close"
  }
}
```

**File**: `src/i18n/locales/de/terpene-details.json`

```json
{
  "fields": {
    "effects": "Wirkungen",
    "taste": "Geschmack",
    "description": "Beschreibung",
    "therapeuticProperties": "Therapeutische Eigenschaften",
    "notableDifferences": "Bemerkenswerte Unterschiede",
    "boilingPoint": "Siedepunkt",
    "sources": "Natürliche Quellen"
  },
  "actions": {
    "close": "Schließen"
  }
}
```

**Test**: Switch language in app and verify translations

---

### Step 9: Write Tests (45 minutes)

Create the following test files:

1. **Unit Tests**:
   - `src/utils/terpeneSchema.test.ts` - Test Zod schemas
   - `src/services/terpeneData.test.ts` - Test data loading/search
   - `src/components/visualizations/TerpeneDetailModal.test.tsx` - Test modal rendering

2. **Integration Tests**:
   - `tests/integration/terpene-workflow.test.tsx` - Test table click → modal flow

3. **E2E Tests**:
   - `tests/e2e/terpene-details.spec.ts` - Test complete user journey

**Run All Tests**: `pnpm test:all`

---

### Step 10: Verify Performance (15 minutes)

1. Build production bundle:
```bash
pnpm build
```

2. Check bundle size:
```bash
ls -lh dist/assets/*.js
```
- Should be ≤500KB gzipped total

3. Run Lighthouse audit:
```bash
pnpm preview
# Open in Chrome, run Lighthouse
```
- Performance ≥90
- Accessibility ≥95

4. Test response times:
- Search: <200ms (use browser DevTools)
- Detail modal open: <300ms
- Table render: <500ms

---

## Verification Checklist

Before marking this feature complete, verify:

- [ ] All Zod schemas are defined and exported
- [ ] Data loads correctly from `terpene-database.json`
- [ ] Table displays Name, Aroma, Effects (no Sources column)
- [ ] Clicking table row opens detail modal
- [ ] Detail modal displays all 7 fields in order
- [ ] Modal is keyboard accessible (Tab, Enter, ESC)
- [ ] Search bar is in header
- [ ] Search still functions correctly
- [ ] All translations exist (en, de)
- [ ] All tests pass (`pnpm test:all`)
- [ ] Bundle size ≤500KB gzipped
- [ ] Lighthouse Performance ≥90
- [ ] Lighthouse Accessibility ≥95
- [ ] No console errors or warnings

## Common Issues & Solutions

### Issue: Zod validation fails

**Cause**: JSON data doesn't match schema
**Solution**: Check console for detailed Zod error messages, update schema or fix data

### Issue: Modal doesn't open

**Cause**: State not updating correctly
**Solution**: Check `onClick` handler and state setter, verify `open` prop is true

### Issue: Performance degradation

**Cause**: Too many re-renders or missing memoization
**Solution**: Use React.memo on modal, ensure table rows are memoized

### Issue: Accessibility errors

**Cause**: Missing ARIA labels or keyboard support
**Solution**: Run vitest-axe tests, add required ARIA attributes

## Next Steps

After completing this implementation:

1. **Run `/speckit.tasks`** to generate task breakdown for implementation
2. **Create feature branch**: `git checkout -b 002-terpene-data-model`
3. **Implement in order**: Follow steps 1-10 sequentially
4. **Test continuously**: Run tests after each step
5. **Create PR**: When all verification checklist items pass

## Resources

- [Zod Documentation](https://zod.dev/)
- [Material UI Dialog](https://mui.com/material-ui/react-dialog/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Estimated Time

- **Step 1-4** (Schema, Types, Service, Hook): ~60 minutes
- **Step 5-7** (UI Components): ~65 minutes
- **Step 8** (i18n): ~10 minutes
- **Step 9** (Tests): ~45 minutes
- **Step 10** (Performance): ~15 minutes
- **Total**: ~3 hours

Actual time may vary based on familiarity with the codebase and technologies.
