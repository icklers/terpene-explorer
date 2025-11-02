# Implementation Plan: Therapeutic-Focused Terpene Details Modal

**Branch**: `008-therapeutic-modal-refactor` | **Date**: 2025-10-31 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/008-therapeutic-modal-refactor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**COMPLETE REFACTOR**: This feature completely removes and replaces the existing modal implementation at `src/components/visualizations/TerpeneDetailModal.tsx` with a new therapeutic-focused design.

Refactor the terpene details modal to prioritize therapeutic information for medical cannabis patients using a hybrid Basic/Expert view toggle. The modal will display therapeutic properties, categorized effects, and concentration data in an accessible, patient-friendly interface in Basic View, with scientific depth (molecular data, research evidence) available on demand in Expert View. Implementation uses React 19.2 with Material UI 6.3 components, TypeScript 5.7 strict mode, and follows WCAG 2.1 AA accessibility standards.

**Current Implementation to Remove**:
- File: `src/components/visualizations/TerpeneDetailModal.tsx` (182 lines)
- Current approach: Simple dialog with 7 fields in linear order (Effects, Taste, Description, Therapeutic Properties, Notable Differences, Boiling Point, Natural Sources)
- Limitations: No view modes, not optimized for medical patient workflow, no categorization of effects, no concentration visualization

**New Implementation**:
- File: `src/components/TerpeneDetailModal.tsx` (new location, moving out of visualizations/)
- New approach: Hybrid Basic/Expert view with therapeutic information prioritized, categorized effects, concentration visualization, accordion-based Expert View
- Enhancements: Patient-focused UX, clickable chips for filtering, skeleton loading states, copy-to-clipboard, enhanced accessibility

## Technical Context

**Language/Version**: TypeScript 5.7.2, ES2022 target  
**Primary Dependencies**: React 19.2.0, Material UI 6.3.0, Emotion 11.13.5 (styling), i18next 25.6.0 (localization)  
**Storage**: Static JSON data from existing `data/terpene-database.json` (client-side only)  
**Testing**: Vitest (unit tests), Playwright (E2E tests), jest-axe (accessibility tests)  
**Target Platform**: Web (static site), responsive mobile/tablet/desktop (320px-1920px+)  
**Project Type**: Web application (frontend only, no backend)  
**Performance Goals**: 
- <100ms modal render (measured from user click to modal content visible using Chrome DevTools Performance tab)
- <200ms toggle animation between Basic/Expert views (measured from click to animation complete using Chrome DevTools Performance tab, 60fps target)
- Cumulative Layout Shift (CLS) <0.1 (measured using Chrome DevTools Performance tab, no layout shifts during content loading or view transitions)
- Smooth accordion animations at 60fps (measured using Chrome DevTools Rendering tab, frame rate maintained during expand/collapse)  
**Constraints**: WCAG 2.1 AA compliance, 4.5:1 contrast ratio, 48x48px touch targets, 80%+ test coverage  
**Scale/Scope**: Single modal component with 4 sub-components, 5 user stories, 57 functional requirements

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Gate 1: Accessibility Requirements**

- [x] WCAG 2.1 Level AA compliance documented (FR-044 to FR-051, SC-005)
- [x] 4.5:1 contrast ratio specified for all color choices (FR-047, therapeutic property color mapping)
- [x] Keyboard navigation plan documented (FR-045: Tab/Enter/Escape, focus trap)
- [x] Screen reader support considered (FR-048, FR-049, FR-050: ARIA labels, announcements)
- [x] jest-axe tool included in test strategy (specified in Technical Context)
- [x] prefers-reduced-motion support (FR-051: disable animations when enabled)

✅ **Gate 2: Performance Budgets**

- [x] Lighthouse score targets defined (SC-005: Accessibility ≥95 implied by WCAG AA)
- [x] Response time targets specified (FR-052: <100ms render, FR-053: <200ms toggle, SC-002, SC-008)
- [x] Bundle size budget considered (constitution target ~500KB gzipped, lazy-load Expert View per FR-054)
- [x] Virtualization plan for large lists (N/A - modal displays single terpene, not lists >100 items)
- [x] Layout stability target (SC-011: CLS score <0.1)

✅ **Gate 3: Testing Strategy**

- [x] Unit test framework identified (Vitest - existing infrastructure)
- [x] E2E test framework identified (Playwright - existing infrastructure)
- [x] Accessibility test tool identified (jest-axe - specified in Technical Context)
- [x] Test coverage target defined (≥80% per constitution, referenced in spec Success Criteria)

✅ **Gate 4: Component Reuse**

- [x] Material UI components specified for UI elements:
  - Dialog (modal container)
  - ToggleButtonGroup (Basic/Expert view toggle)
  - Accordion (Expert View sections)
  - Chip (therapeutic properties, effects, aromas, sources)
  - LinearProgress (concentration bar)
  - Alert (notable differences callout)
  - IconButton (close, copy-to-clipboard)
  - Typography, Box, Grid (layout)
- [x] Custom components justified:
  - CategoryBadge (Core/Secondary/Minor - domain-specific visual element)
  - DataQualityBadge (research tier visualization - domain-specific)
  - TerpeneDetailModal (feature-specific composition)
- [x] No reinvention of existing Material UI components

✅ **Gate 5: Static Architecture**

- [x] No backend server dependencies (client-side React only)
- [x] Data source is static files (existing `data/terpene-database.json`)
- [x] Deployment target is static hosting (Vercel/Netlify/GitHub Pages per constitution)
- [x] No database or API required (modal operates on data passed via props)

✅ **Gate 6: Internationalization**

- [x] i18next internationalization library included (existing infrastructure at v25.6.0)
- [x] Supported languages specified (English and German per spec Assumptions #4)
- [x] Translation files location documented (existing `src/i18n/locales/`)
- [x] No hard-coded user-facing strings (all UI text must use i18next keys)

**Status**: ✅ ALL GATES PASSED - No violations, ready for Phase 0 research.

## Test-Driven Development (TDD) Workflow

**MANDATORY**: This feature MUST be implemented using strict Test-Driven Development with RED→GREEN→REFACTOR cycles.

### TDD Principles

**Red-Green-Refactor Cycle**:
1. **🔴 RED**: Write a failing test first (test what the code should do)
2. **🟢 GREEN**: Write minimal code to make the test pass (make it work)
3. **🔵 REFACTOR**: Improve code quality without changing behavior (make it clean)

**Rules**:
- ❌ NO production code without a failing test first
- ❌ NO skipping tests to "implement quickly"
- ❌ NO testing after implementation
- ✅ Write tests BEFORE implementation
- ✅ Run tests after each change
- ✅ Commit after each successful RED→GREEN→REFACTOR cycle

### TDD Implementation Order

Follow this strict sequence for each feature:

#### Phase 1: Helper Functions (Pure Logic)
**Start here - easiest to test**

1. **getTherapeuticColor()**
   - 🔴 Write test: `it('returns blue[500] for Anxiolytic')`
   - 🟢 Implement: Return color from map
   - 🔵 Refactor: Extract constant map
   - Repeat for all therapeutic properties

2. **categorizeEffects()**
   - 🔴 Write test: `it('groups effects by category')`
   - 🟢 Implement: Filter and group logic
   - 🔵 Refactor: Extract category mappings
   - 🔴 Write test: `it('limits to 3 effects when showAll=false')`
   - 🟢 Implement: Slice logic
   - 🔵 Refactor: Clean up

3. **parseConcentration()**
   - 🔴 Write test: `it('parses "0.003-1.613 mg/g" correctly')`
   - 🟢 Implement: Regex parsing
   - 🔵 Refactor: Extract regex pattern
   - 🔴 Write test: `it('calculates percentile for Core category')`
   - 🟢 Implement: Percentile calculation
   - 🔵 Refactor: Extract category maximums

4. **getSourceIcon()** & **copyToClipboard()**
   - Follow same RED→GREEN→REFACTOR pattern

#### Phase 2: Simple Components (UI Elements)

5. **CategoryBadge**
   - 🔴 Write test: `it('renders "Core" with primary color')`
   - 🟢 Implement: Basic component with color logic
   - 🔵 Refactor: Extract color mapping
   - 🔴 Write test: `it('shows tooltip on hover')`
   - 🟢 Implement: Tooltip integration
   - 🔵 Refactor: Clean up

6. **DataQualityBadge**
   - 🔴 Write test: `it('renders "Excellent" with green badge')`
   - 🟢 Implement: Badge component
   - 🔵 Refactor: Extract quality config
   - Repeat for all quality levels

#### Phase 3: Main Modal (Complex Component)

7. **TerpeneDetailModal - Basic View**
   - 🔴 Test: `it('renders terpene name')`
   - 🟢 Implement: Modal shell + title
   - 🔵 Refactor: Extract header component logic
   
   - 🔴 Test: `it('displays therapeutic properties as chips')`
   - 🟢 Implement: Map properties to chips
   - 🔵 Refactor: Extract chip rendering logic
   
   - 🔴 Test: `it('calls onTherapeuticPropertyClick when chip clicked')`
   - 🟢 Implement: Click handler
   - 🔵 Refactor: Clean up event handling
   
   - 🔴 Test: `it('shows categorized effects')`
   - 🟢 Implement: Use categorizeEffects helper
   - 🔵 Refactor: Extract effect rendering
   
   - Continue for each Basic View section...

8. **TerpeneDetailModal - Toggle**
   - 🔴 Test: `it('defaults to basic view')`
   - 🟢 Implement: State initialization
   - 🔵 Refactor: Extract state management
   
   - 🔴 Test: `it('switches to expert view when toggled')`
   - 🟢 Implement: Toggle handler
   - 🔵 Refactor: Clean up

9. **TerpeneDetailModal - Expert View**
   - 🔴 Test: `it('shows three accordions in expert view')`
   - 🟢 Implement: Accordion structure
   - 🔵 Refactor: Extract accordion components
   
   - 🔴 Test: `it('expands Therapeutic Details by default')`
   - 🟢 Implement: defaultExpanded prop
   - 🔵 Refactor: Extract accordion config
   
   - Continue for each accordion section...

10. **TerpeneDetailModal - Accessibility**
    - 🔴 Test: `it('traps focus when open')`
    - 🟢 Implement: Focus trap (Material UI provides)
    - 🔵 Refactor: Verify accessibility
    
    - 🔴 Test: `it('closes on Escape key')`
    - 🟢 Implement: onClose handler
    - 🔵 Refactor: Clean up
    
    - 🔴 Test: `it('respects prefers-reduced-motion')`
    - 🟢 Implement: Motion detection
    - 🔵 Refactor: Extract motion hook

#### Phase 4: Integration Tests

11. **Modal + Filter Integration**
    - 🔴 Test: `it('filters table when therapeutic property clicked')`
    - 🟢 Implement: Callback integration
    - 🔵 Refactor: Clean up
    
    - 🔴 Test: `it('modal stays open after filter applied')`
    - 🟢 Verify: Callback doesn't close modal
    - 🔵 Refactor: Clarify behavior

12. **Modal + Parent Component**
    - 🔴 Test: `it('opens when table row clicked')`
    - 🟢 Integrate: Wire up open state
    - 🔵 Refactor: Clean up state management

#### Phase 5: E2E Tests (User Journeys)

13. **User Story Tests** (use playwright-planner and playwright-generator agents)
    - 🔴 Test: US1 - Quick Therapeutic Assessment
    - 🟢 Verify: Full flow works
    - 🔵 Refactor: Optimize interactions
    
    - Repeat for US2-US5

### TDD Commands

**Run tests continuously during development**:
```bash
# Watch mode - run in separate terminal
pnpm test:watch

# Run specific test file
pnpm test src/utils/terpeneHelpers.test.ts

# Run with coverage
pnpm test:coverage
```

**TDD Workflow Example**:
```bash
# 1. RED: Write failing test
vim src/utils/terpeneHelpers.test.ts
# Add: it('returns blue[500] for Anxiolytic', ...)
pnpm test src/utils/terpeneHelpers.test.ts
# ❌ Test fails (expected)

# 2. GREEN: Make it pass
vim src/utils/terpeneHelpers.ts
# Add: export const getTherapeuticColor = ...
pnpm test src/utils/terpeneHelpers.test.ts
# ✅ Test passes

# 3. REFACTOR: Improve code
vim src/utils/terpeneHelpers.ts
# Extract THERAPEUTIC_COLORS to constants/therapeuticColors.ts
pnpm test src/utils/terpeneHelpers.test.ts
# ✅ Test still passes

# 4. Commit
git add .
git commit -m "feat: add getTherapeuticColor with semantic color mapping"

# Repeat cycle...
```

### TDD Success Criteria

**Before marking feature complete, verify**:
- [ ] Every function has tests written BEFORE implementation
- [ ] Every component has tests written BEFORE JSX rendering
- [ ] Test coverage ≥ 80% achieved through TDD (not retrofitted)
- [ ] All tests pass (`pnpm test`)
- [ ] No untested production code exists
- [ ] Git history shows RED→GREEN→REFACTOR pattern in commits

### Realistic TDD Expectations

**TDD Cycle Count Analysis**:
- **270 total tasks** ÷ **~2.5 tasks per TDD cycle** = **90-110 cycles**
- **Helper functions** (Phase 2): 5 functions × 3-4 cycles each = 15-20 cycles
- **Component development** (Phases 3-7): 15 components × 4-6 cycles each = 60-90 cycles  
- **Integration & E2E** (Phase 8): 10-15 cycles for complex interactions
- **Edge case handling**: 5-10 additional cycles for error states

**Time Estimates**:
- **MVP (US1)**: 107 tasks ÷ 3 tasks/day = 35-40 cycles over 12-15 days
- **Full feature**: 270 tasks ÷ 2.5 tasks/day = 90-110 cycles over 35-45 days
- **Parallel execution**: 94 [P] tasks can reduce timeline by 25-30% with multiple developers

**Quality Metrics**:
- Target: 90%+ test coverage through TDD (not retrofitted)
- Commit pattern: RED→GREEN→REFACTOR visible in git history
- No production code without corresponding test coverage

### TDD Benefits for This Feature

1. **Complex Logic**: Helper functions (categorizeEffects, parseConcentration) benefit from test-first approach
2. **Component Interactions**: Modal callbacks and state management easier to test incrementally
3. **Accessibility**: ARIA attributes and keyboard navigation verified through tests
4. **Regression Prevention**: Refactoring protected by comprehensive test suite
5. **Documentation**: Tests serve as living documentation of expected behavior
6. **Confidence**: Deploy knowing every feature is tested

**REMEMBER**: Tests are not a burden - they are your safety net for confident refactoring! 🎯

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── TerpeneDetailModal.tsx          # NEW: Main modal component (replaces visualizations/TerpeneDetailModal.tsx)
│   ├── TerpeneDetailModal.test.tsx     # NEW: Unit tests
│   ├── CategoryBadge.tsx               # NEW: Category badge component
│   ├── CategoryBadge.test.tsx          # NEW: Unit tests
│   ├── DataQualityBadge.tsx            # NEW: Data quality badge component
│   ├── DataQualityBadge.test.tsx       # NEW: Unit tests
│   └── visualizations/
│       ├── TerpeneTable.tsx            # MODIFIED: Update import path for new modal location
│       └── TerpeneDetailModal.tsx      # REMOVE: Old modal implementation (182 lines) - DELETE THIS FILE
├── utils/
│   ├── terpeneHelpers.ts               # NEW: Helper functions (categorizeEffects, etc.)
│   └── terpeneHelpers.test.ts          # NEW: Unit tests
├── constants/
│   ├── therapeuticColors.ts            # NEW: Therapeutic property color mapping
│   └── effectCategories.ts             # EXISTING: Effect category configuration
├── hooks/
│   └── useLocalStorage.ts              # EXISTING: (reference only, not modified)
├── i18n/
│   └── locales/
│       ├── en/
│       │   └── translation.json        # MODIFIED: Add modal text keys
│       └── de/
│           └── translation.json        # MODIFIED: Add modal text keys
├── types/
│   └── terpene.ts                      # MODIFIED: Update TerpeneDetailModalProps interface
└── theme/
    └── index.ts                        # EXISTING: Material UI theme (reference)

data/
└── terpene-database.json               # EXISTING: Source data (not modified)

tests/
├── unit/
│   └── components/
│       ├── TerpeneDetailModal.test.ts  # NEW: Component unit tests
│       ├── CategoryBadge.test.ts       # NEW: Badge unit tests
│       └── DataQualityBadge.test.ts    # NEW: Badge unit tests
├── integration/
│   └── terpene-modal-interactions.test.ts # NEW: Integration tests
└── e2e/
    └── terpene-modal-flows.spec.ts     # NEW: Playwright E2E tests (use playwright generator agent)
```

**Structure Decision**: Web application (frontend only). This is a **COMPLETE REFACTOR** that removes and replaces the existing modal implementation. The old modal at `src/components/visualizations/TerpeneDetailModal.tsx` (182 lines) will be **DELETED** and replaced with a new implementation at `src/components/TerpeneDetailModal.tsx` (moved to components/ root). The parent component `TerpeneTable.tsx` will need its import updated from `'./TerpeneDetailModal'` to `'../TerpeneDetailModal'`. The `TerpeneDetailModalProps` interface in `src/types/terpene.ts` will be updated to include the new callback props. No backend changes required. The new modal integrates with existing infrastructure (i18n, theme, data service).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| TDD Cycle Count (90-110)   | Complex feature with 270 tasks | 40 cycles insufficient for comprehensive test coverage of 270 tasks across 8 phases |
| Task Count Discrepancy (270 vs 94) | Initial estimate missed detailed TDD breakdown | Original 94 tasks didn't account for RED→GREEN→REFACTOR cycle granularity |
| Missing Error Handling Tasks | Critical for production readiness | Edge cases like clipboard failures, broken links, loading states essential for robust UX |
| Expert View vs KISS Principle | Medical professionals require scientific depth | Basic View alone insufficient for clinical decision-making; Expert View provides necessary pharmacological data |
| Skeleton UI Performance Budget | CLS <0.1 requirement conflicts with immediate content display | Skeleton loading required to prevent layout shifts while maintaining <100ms render target; trade-off accepted for better perceived performance |
