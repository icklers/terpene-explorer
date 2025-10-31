# Quickstart Guide: Therapeutic-Focused Terpene Details Modal

**Feature**: 008-therapeutic-modal-refactor  
**Date**: 2025-10-31  
**Branch**: `008-therapeutic-modal-refactor`

This guide provides everything you need to start developing the therapeutic-focused terpene details modal feature.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 24+ LTS installed
- ✅ pnpm package manager installed
- ✅ Repository cloned and on the correct branch (`008-therapeutic-modal-refactor`)
- ✅ Dependencies installed (`pnpm install`)
- ✅ Familiarity with TypeScript, React 19, and Material UI 6

---

## Quick Reference

### Key Documents

- **Specification**: `specs/008-therapeutic-modal-refactor/spec.md` - What we're building
- **Plan**: `specs/008-therapeutic-modal-refactor/plan.md` - How we're building it
- **Research**: `specs/008-therapeutic-modal-refactor/research.md` - Technical decisions
- **Data Model**: `specs/008-therapeutic-modal-refactor/data-model.md` - Type definitions
- **Contracts**: `specs/008-therapeutic-modal-refactor/contracts/components.md` - Component interfaces

### Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:5173)

# Type checking
pnpm type-check             # Run TypeScript compiler

# Linting & Formatting
pnpm lint                   # Check for lint errors
pnpm lint:fix               # Auto-fix lint errors
pnpm format                 # Format code with Prettier

# Testing
pnpm test                   # Run all Vitest unit tests
pnpm test:ui                # Run Vitest with UI
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Generate coverage report
pnpm test:e2e               # Run Playwright E2E tests
pnpm test:e2e:ui            # Run Playwright with UI

# Build
pnpm build                  # Production build
pnpm preview                # Preview production build

# Full validation
pnpm run type-check && pnpm run format && pnpm run lint:fix && pnpm run build
```

---

## Development Workflow

### Step 1: Remove Old Modal & Create New Files

**⚠️ IMPORTANT**: This is a COMPLETE REFACTOR. Delete the old implementation first.

**Delete old modal**:

```bash
# Remove the old modal implementation (182 lines)
rm src/components/visualizations/TerpeneDetailModal.tsx
```

**Create new files**:

```bash
# Components (new location: src/components/, not src/components/visualizations/)
touch src/components/TerpeneDetailModal.tsx
touch src/components/TerpeneDetailModal.test.tsx
touch src/components/CategoryBadge.tsx
touch src/components/CategoryBadge.test.tsx
touch src/components/DataQualityBadge.tsx
touch src/components/DataQualityBadge.test.tsx

# Utilities
touch src/utils/terpeneHelpers.ts
touch src/utils/terpeneHelpers.test.ts

# Constants
touch src/constants/therapeuticColors.ts
```

**Update parent component import**:

```bash
# In src/components/visualizations/TerpeneTable.tsx
# Change: import { TerpeneDetailModal } from './TerpeneDetailModal';
# To:     import { TerpeneDetailModal } from '../TerpeneDetailModal';
```

### Step 2: Follow TDD Workflow (RED→GREEN→REFACTOR)

**⚠️ MANDATORY**: Use strict Test-Driven Development. Write tests BEFORE implementation.

**TDD Rules**:
- 🔴 **RED**: Write a failing test first
- 🟢 **GREEN**: Write minimal code to make it pass
- 🔵 **REFACTOR**: Improve code quality
- ❌ **NO** production code without a failing test first

**Implementation Order** (following TDD):

#### Phase 1: Helper Functions (Pure Logic)
**Start here - easiest to test with TDD**

1. **getTherapeuticColor()** (TDD Cycle 1)
   ```bash
   # 🔴 RED: Write failing test
   vim src/utils/terpeneHelpers.test.ts
   pnpm test src/utils/terpeneHelpers.test.ts  # ❌ Fails
   
   # 🟢 GREEN: Make it pass
   vim src/utils/terpeneHelpers.ts
   pnpm test src/utils/terpeneHelpers.test.ts  # ✅ Passes
   
   # 🔵 REFACTOR: Extract constants
   vim src/constants/therapeuticColors.ts
   pnpm test src/utils/terpeneHelpers.test.ts  # ✅ Still passes
   
   git commit -m "feat: add getTherapeuticColor with semantic colors"
   ```

2. **categorizeEffects()** (TDD Cycle 2)
   - 🔴 Test: Groups effects by category
   - 🟢 Implement: Filter and group
   - 🔵 Refactor: Extract mappings

3. **parseConcentration()** (TDD Cycle 3)
   - 🔴 Test: Parses range string
   - 🟢 Implement: Regex parsing
   - 🔵 Refactor: Extract category maximums

4. **getSourceIcon()** & **copyToClipboard()** (TDD Cycles 4-5)

#### Phase 2: Simple Components

5. **CategoryBadge** (TDD Cycle 6)
   - 🔴 Test: Renders with correct color
   - 🟢 Implement: Badge component
   - 🔵 Refactor: Extract color logic

6. **DataQualityBadge** (TDD Cycle 7)
   - 🔴 Test: Shows quality indicator
   - 🟢 Implement: Badge component
   - 🔵 Refactor: Extract quality config

#### Phase 3: Main Modal (Incremental TDD)

7. **TerpeneDetailModal - Basic View** (TDD Cycles 8-15)
   - 🔴 Test: Renders terpene name
   - 🟢 Implement: Modal shell
   - 🔵 Refactor: Clean structure
   - (Repeat for each section: therapeutic properties, effects, concentration, sources)

8. **TerpeneDetailModal - Toggle** (TDD Cycles 16-17)
   - 🔴 Test: Defaults to basic view
   - 🟢 Implement: State management
   - 🔵 Refactor: Extract hooks

9. **TerpeneDetailModal - Expert View** (TDD Cycles 18-25)
   - 🔴 Test: Shows accordions
   - 🟢 Implement: Accordion structure
   - 🔵 Refactor: Extract components

10. **Accessibility** (TDD Cycles 26-30)
    - 🔴 Test: Focus trap, Escape key, prefers-reduced-motion
    - 🟢 Implement: Handlers and hooks
    - 🔵 Refactor: Extract accessibility logic

#### Phase 4: Integration (TDD Cycles 31-35)

11. **Modal + Filter Integration**
    - 🔴 Test: Filters table on chip click
    - 🟢 Integrate: Wire callbacks
    - 🔵 Refactor: Clean integration

#### Phase 5: E2E (TDD Cycles 36-40)

12. **User Story Tests** (use playwright-planner agent)
    - 🔴 Test: Each user story flow
    - 🟢 Verify: Full feature works
    - 🔵 Refactor: Optimize UX

**Priority Mapping**:
- **P1**: Cycles 1-15 (Helpers + Basic View)
- **P2**: Cycles 16-30 (Toggle + Expert View + Filter)
- **P3**: Cycles 31-40 (Accessibility + Integration + E2E)

### Step 3: TDD Validation (Continuous)

**⚠️ Run tests DURING development, not after!**

**Watch Mode** (run in separate terminal):
```bash
pnpm test:watch  # Auto-runs tests on file changes
```

**After Each TDD Cycle**:
```bash
# After each RED→GREEN→REFACTOR cycle
pnpm test src/utils/terpeneHelpers.test.ts  # ✅ Must pass
git add .
git commit -m "feat: [describe what test now passes]"
```

**Integration Tests** (after Phase 4):
```bash
pnpm test tests/integration/terpene-modal-interactions.test.ts
```

**E2E Tests** (after Phase 5):
```bash
pnpm test:e2e tests/e2e/terpene-modal-flows.spec.ts
```

**Accessibility Tests** (after Phase 3):
```bash
# Run jest-axe in unit tests
pnpm test -- --grep="accessibility"

# Manual testing
# - Keyboard: Tab, Shift+Tab, Enter, Escape
# - Screen readers: NVDA (Windows), VoiceOver (Mac)
# - Motion: Enable prefers-reduced-motion in browser
```

### Step 4: Validate Before PR

**TDD Verification Checklist**:

**TDD Process** (MANDATORY):
- [ ] All tests written BEFORE implementation (RED first)
- [ ] No production code without failing test first
- [ ] Git history shows RED→GREEN→REFACTOR pattern
- [ ] Test coverage ≥ 80% achieved through TDD (not retrofitted)
- [ ] Every function has corresponding test file
- [ ] Every component has corresponding test file

**Code Quality**:
- [ ] TypeScript compiles without errors (`pnpm type-check`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] All unit tests pass (`pnpm test`)
- [ ] All E2E tests pass (`pnpm test:e2e`)
- [ ] Test coverage report shows ≥ 80% (`pnpm test:coverage`)
- [ ] Build succeeds (`pnpm build`)

**Feature Completeness**:
  - [ ] Modal opens/closes correctly
  - [ ] Toggle switches between views
  - [ ] Therapeutic property chips clickable
  - [ ] Accordions expand/collapse
  - [ ] Copy button works
  - [ ] Responsive on mobile (full-screen)
  - [ ] Keyboard navigation works
  - [ ] Screen reader announces content
  - [ ] Respects prefers-reduced-motion

---

## Code Scaffolding

### Basic Component Structure

```typescript
// src/components/TerpeneDetailModal.tsx
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Alert,
  AlertTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';
import type { Terpene } from '@/types/terpene';
import { CategoryBadge } from './CategoryBadge';
import { DataQualityBadge } from './DataQualityBadge';
import {
  categorizeEffects,
  parseConcentration,
  getSourceIcon,
  copyToClipboard,
} from '@/utils/terpeneHelpers';
import { getTherapeuticColor } from '@/constants/therapeuticColors';

export interface TerpeneDetailModalProps {
  open: boolean;
  terpene: Terpene | null;
  onClose: () => void;
  onTherapeuticPropertyClick?: (property: string) => void;
  onEffectClick?: (effect: string) => void;
}

export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps> = ({
  open,
  terpene,
  onClose,
  onTherapeuticPropertyClick,
  onEffectClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [viewMode, setViewMode] = useState<'basic' | 'expert'>('basic');
  const [expandedDescription, setExpandedDescription] = useState(false);
  
  // Memoize expensive computations
  const categorizedEffects = useMemo(
    () => terpene ? categorizeEffects(terpene.effects, viewMode === 'expert') : [],
    [terpene, viewMode]
  );
  
  if (!terpene) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="terpene-modal-title"
      aria-describedby="terpene-modal-description"
    >
      <DialogTitle id="terpene-modal-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h2" fontWeight="bold">
            {terpene.name}
          </Typography>
          <CategoryBadge category={terpene.category} />
        </Box>
        <IconButton
          aria-label={t('modal.terpeneDetail.close')}
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {/* Basic View Content */}
        {/* TODO: Implement sections per research.md */}
        
        {/* Toggle */}
        <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            aria-label={t('modal.terpeneDetail.viewMode.label')}
            sx={{ width: '100%', maxWidth: 400 }}
          >
            <ToggleButton value="basic" sx={{ flex: 1 }}>
              {t('modal.terpeneDetail.viewMode.basic')}
            </ToggleButton>
            <ToggleButton value="expert" sx={{ flex: 1 }}>
              {t('modal.terpeneDetail.viewMode.expert')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {/* Expert View Content */}
        {viewMode === 'expert' && (
          <Box sx={{ mt: 3 }}>
            {/* TODO: Implement accordions per research.md */}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
```

### Test Scaffold

```typescript
// src/components/TerpeneDetailModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TerpeneDetailModal } from './TerpeneDetailModal';
import type { Terpene } from '@/types/terpene';

const mockTerpene: Terpene = {
  name: 'Limonene',
  category: 'Core',
  aroma: 'Citrus, Lemon, Orange',
  description: 'Citrus terpene responsible for uplifting properties',
  therapeuticProperties: ['Antidepressant', 'Anti-inflammatory', 'Anxiolytic'],
  effects: ['Mood enhancing', 'Energizing', 'Stress relief'],
  concentrationRange: '0.003-1.613 mg/g',
  sources: ['Lemon peel', 'Orange rind', 'Grapefruit'],
  // ... (complete mock per Terpene interface)
};

describe('TerpeneDetailModal', () => {
  it('renders with terpene data', () => {
    render(
      <TerpeneDetailModal
        open={true}
        terpene={mockTerpene}
        onClose={vi.fn()}
      />
    );
    
    expect(screen.getByText('Limonene')).toBeInTheDocument();
  });
  
  it('calls onClose when X button clicked', () => {
    const onClose = vi.fn();
    render(
      <TerpeneDetailModal
        open={true}
        terpene={mockTerpene}
        onClose={onClose}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });
  
  // TODO: Add more tests per contracts/components.md
});
```

---

## Integration Points

### 1. Existing Filter Service

The modal callbacks integrate with the existing filter service:

```typescript
// In parent component (e.g., TerpeneTable.tsx)
import { useFilterService } from '@/services/filterService';

const { setTherapeuticProperty, setEffect } = useFilterService();

<TerpeneDetailModal
  onTherapeuticPropertyClick={(property) => {
    setTherapeuticProperty(property);
    showSnackbar(`Showing terpenes with ${property} properties`);
  }}
  onEffectClick={(effect) => {
    setEffect(effect);
    showSnackbar(`Showing terpenes with '${effect}' effect`);
  }}
/>
```

### 2. i18n Translation Files

Add keys to existing translation files:

```typescript
// src/i18n/locales/en/translation.json
{
  "modal": {
    "terpeneDetail": {
      "title": "Terpene Details",
      "close": "Close",
      "viewMode": {
        "basic": "Basic View",
        "expert": "Expert View"
      },
      // ... (see contracts/components.md for complete list)
    }
  }
}
```

### 3. Material UI Theme

The modal respects the existing theme:

- Colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `grey`
- Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`
- Typography: `h4`, `h6`, `body1`, `body2`, `caption`
- Dark/Light mode: Automatically adapts

---

## Common Pitfalls & Solutions

### Pitfall 1: Modal Not Closing on Backdrop Click

**Solution**: Ensure `onClose` is properly wired to Dialog:

```typescript
<Dialog
  open={open}
  onClose={onClose}  // ← This handles backdrop click and Escape
  // ...
>
```

### Pitfall 2: Accordion Animations Causing Layout Shift

**Solution**: Use `TransitionProps` to respect `prefers-reduced-motion`:

```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

<Accordion
  TransitionProps={{ timeout: prefersReducedMotion ? 0 : 200 }}
>
```

### Pitfall 3: Concentration Percentile Incorrect

**Solution**: Normalize by category (Core/Secondary/Minor have different scales):

```typescript
const categoryMax = {
  Core: 2.0,
  Secondary: 1.0,
  Minor: 0.5,
}[category];

const percentile = Math.min(100, (maxValue / categoryMax) * 100);
```

### Pitfall 4: Therapeutic Property Colors Not Accessible

**Solution**: All colors from `therapeuticColors.ts` have been pre-validated for 4.5:1 contrast. Use Material UI color palette values (`blue[500]`, etc.) which have built-in contrast.

### Pitfall 5: Focus Not Trapped in Modal

**Solution**: Material UI Dialog handles focus trap automatically. Just ensure no `disableEnforceFocus` prop is set.

---

## Debugging Tips

### TypeScript Errors

```bash
# Check specific file
pnpm type-check -- --noEmit src/components/TerpeneDetailModal.tsx

# Watch mode
pnpm type-check -- --watch
```

### Test Failures

```bash
# Run single test file
pnpm test src/components/TerpeneDetailModal.test.tsx

# Run with debugging
pnpm test -- --inspect-brk

# Update snapshots (if using)
pnpm test -- -u
```

### Accessibility Issues

```bash
# Run jest-axe in tests
pnpm test -- --grep="accessibility"

# Manual testing:
# 1. Open browser DevTools
# 2. Go to Lighthouse tab
# 3. Run Accessibility audit
# 4. Check for issues
```

### Performance Problems

```bash
# Profile component
import { Profiler } from 'react';

<Profiler id="TerpeneModal" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}}>
  <TerpeneDetailModal {...props} />
</Profiler>
```

---

## Resources

### Documentation

- **React 19**: https://react.dev/
- **Material UI 6**: https://mui.com/material-ui/getting-started/
- **TypeScript 5.7**: https://www.typescriptlang.org/docs/
- **Vitest**: https://vitest.dev/
- **Playwright**: https://playwright.dev/
- **i18next**: https://www.i18next.com/

### Project-Specific

- **Constitution**: `.specify/memory/constitution.md` - Project principles
- **AGENTS.md**: `AGENTS.md` - Agent guidelines and active technologies
- **Database Schema**: `src/utils/terpeneSchema.ts` - Terpene type definitions
- **Effect Categories**: `data/terpene-database.json` → `effectCategories` section

### Getting Help

1. **Check the spec**: `specs/008-therapeutic-modal-refactor/spec.md`
2. **Check research**: `specs/008-therapeutic-modal-refactor/research.md`
3. **Check contracts**: `specs/008-therapeutic-modal-refactor/contracts/components.md`
4. **Check similar components**: Look at existing Material UI Dialog usage in codebase
5. **Ask the team**: Create GitHub issue or discussion

---

## Success Checklist

Before marking this feature complete, verify:

### Functional

- [ ] All 5 user stories pass acceptance scenarios
- [ ] Basic View displays therapeutic information prominently
- [ ] Expert View provides scientific depth via accordions
- [ ] Toggle switches between views smoothly
- [ ] Therapeutic property chips trigger filter callbacks
- [ ] Effect chips trigger filter callbacks
- [ ] Modal stays open after filter applied
- [ ] Category badge shows tooltip on hover
- [ ] Concentration bar shows tooltip on hover
- [ ] Copy button copies molecular formula
- [ ] Modal closes via X, Escape, and backdrop click

### Technical

- [ ] TypeScript strict mode (no errors)
- [ ] ESLint passes (no warnings)
- [ ] Prettier formatted
- [ ] Test coverage ≥ 80%
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass

### Performance

- [ ] Modal renders in <100ms (FR-052)
- [ ] Toggle animation <200ms (FR-053)
- [ ] CLS score <0.1 (SC-011)
- [ ] Lighthouse performance score ≥90

### Accessibility

- [ ] WCAG 2.1 AA compliant (SC-005)
- [ ] Color contrast ≥4.5:1 (FR-047)
- [ ] Full keyboard navigation (FR-045)
- [ ] Screen reader compatible (FR-048, FR-049)
- [ ] Touch targets ≥48px mobile (FR-042)
- [ ] Respects prefers-reduced-motion (FR-051)

### Internationalization

- [ ] All text uses i18n keys (no hard-coded strings)
- [ ] English translations complete
- [ ] German translations complete
- [ ] Modal works in both languages

---

## Next Steps After Quickstart

1. **Review the spec thoroughly**: `spec.md` contains all requirements
2. **Study the research document**: `research.md` explains all technical decisions
3. **Understand the data model**: `data-model.md` defines all types
4. **Review component contracts**: `contracts/components.md` specifies interfaces
5. **Start with Priority 1**: Implement Basic View first (Quick Therapeutic Assessment)
6. **Test as you go**: Write tests alongside implementation
7. **Iterate**: Get feedback early and often

**Ready to start? Run `pnpm dev` and begin with `TerpeneDetailModal.tsx`!** 🚀
