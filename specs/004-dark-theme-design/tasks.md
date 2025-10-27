# Tasks: Comfortably Dark Theme System

**Input**: Design documents from `/specs/004-dark-theme-design/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the specification - focusing on implementation tasks with accessibility testing

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-page React web application structure:
- `src/` at repository root for all application code
- `tests/` at repository root for all test files
- `specs/004-dark-theme-design/` for feature documentation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project infrastructure and prepare for theme implementation

- [ ] T001 Verify TypeScript 5.7.2 and React 19.2.0 are installed and configured
- [ ] T002 [P] Verify @mui/material 6.3.0, @emotion/react 11.13.5, and @emotion/styled 11.13.5 are available
- [ ] T003 [P] Verify testing dependencies (vitest 4.0.3, vitest-axe, @axe-core/playwright 1.49.1)
- [ ] T004 [P] Review existing theme structure in src/theme/ directory
- [ ] T005 Create feature branch 004-dark-theme-design from main

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update core theme configuration that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Update palette configuration in src/theme/darkTheme.ts with new color values (background.default: #121212, background.paper: #1e1e1e, primary.main: #4caf50, primary.dark: #388e3c, secondary.main: #ffb300)
- [ ] T007 Update text colors in src/theme/darkTheme.ts (text.primary: #ffffff, text.secondary: rgba(255,255,255,0.7))
- [ ] T008 Update action state colors in src/theme/darkTheme.ts (action.hover: rgba(255,255,255,0.08), action.selected: rgba(255,255,255,0.16))
- [ ] T009 Verify shape.borderRadius is set to 8 in src/theme/darkTheme.ts
- [ ] T010 [P] Add MuiButton focus indicator override in src/theme/darkTheme.ts components section (outline: 3px solid #ffb300, outlineOffset: 2px on :focus-visible)
- [ ] T011 [P] Add MuiTextField focus indicator override in src/theme/darkTheme.ts components section (borderColor and outline: #ffb300 on focus)
- [ ] T012 [P] Add MuiChip focus indicator override in src/theme/darkTheme.ts components section (outline: 2px solid #ffb300)
- [ ] T013 [P] Add MuiTableRow focus indicator override in src/theme/darkTheme.ts components section (outline: 2px solid #ffb300, outlineOffset: -2px)
- [ ] T014 Run type checking to verify theme configuration: pnpm run type-check
- [ ] T015 Run application in development mode and verify theme loads: pnpm run dev

**Checkpoint**: Foundation ready - theme configuration complete, user story implementation can now begin

---

## Phase 3: User Story 1 - View Application with Comfortable Dark Theme (Priority: P1) 🎯 MVP

**Goal**: Establish the foundational dark theme visual experience with floating card design across all major UI components

**Independent Test**: Open the application and verify: (1) Background is #121212, (2) All major elements (header, filter cards, tables) appear as floating cards with 8px rounded corners and elevation shadow, (3) Header and table headers use dark green (#388e3c), (4) Text is readable with proper contrast

### Implementation for User Story 1

- [ ] T016 [US1] Update main layout wrapper in src/pages/Home.tsx or src/components/layout/MainLayout.tsx to apply bgcolor: 'background.default' and responsive padding (xs: 2, md: 4)
- [ ] T017 [P] [US1] Update Header component in src/components/layout/Header.tsx with position: 'sticky', bgcolor: 'primary.dark', and box-shadow: '0 4px 8px rgba(0,0,0,0.3)'
- [ ] T018 [P] [US1] Update Header Toolbar in src/components/layout/Header.tsx with responsive padding (px: { xs: 2, md: 4 })
- [ ] T019 [US1] Wrap filter card component with Paper element applying bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', p: 3, mb: 3 (identify filter card file location first)
- [ ] T019a [P] [US1] Update Card component in src/components/common/Card.tsx (if exists) to use floating card styling: bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', p: 3
- [ ] T020 [US1] Wrap data table with Paper element in src/components/visualizations/DataTable.tsx applying bgcolor: '#272727', borderRadius: 2, overflow: 'hidden', mb: 3
- [ ] T021 [US1] Update table header cells in src/components/visualizations/DataTable.tsx with bgcolor: 'primary.dark', color: 'primary.contrastText', fontWeight: 600
- [ ] T022 [P] [US1] Create unit test for dark theme configuration in tests/unit/components/theme.test.ts verifying palette colors, border radius, and contrast ratios
- [ ] T023 [US1] Run accessibility test to verify WCAG contrast ratios: pnpm run test:a11y

**Checkpoint**: User Story 1 complete - Application displays with comfortable dark theme, floating cards, proper contrast

---

## Phase 4: User Story 2 - Navigate Active Interface Elements (Priority: P2)

**Goal**: Implement clear visual feedback for view mode toggles using bright green highlighting for active selections

**Independent Test**: Toggle between Sunburst and Table views - verify the active view shows bright green (#4caf50) background with white text

### Implementation for User Story 2

- [ ] T024 [US2] Locate view mode toggle component (likely in src/components/common/ or src/components/layout/)
- [ ] T025 [US2] Apply active state styling to toggle buttons: '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main' } }
- [ ] T026 [US2] Verify toggle button component uses ToggleButtonGroup with exclusive selection
- [ ] T027 [P] [US2] Create integration test in tests/integration/us2-view-toggle.test.tsx verifying toggle state changes and styling
- [ ] T028 [US2] Manual test: Toggle views and verify bright green highlight moves correctly

**Checkpoint**: User Story 2 complete - Active view mode is clearly identifiable with bright green highlighting

---

## Phase 5: User Story 3 - Identify Focus and Selection States (Priority: P2)

**Goal**: Ensure keyboard navigation and table row selection use vibrant orange (#ffb300) indicators for accessibility

**Independent Test**: (1) Tab through the interface with keyboard - verify orange focus rings appear on all interactive elements, (2) Click a table row - verify 4px orange left border appears and persists

### Implementation for User Story 3

- [ ] T029 [US3] Update SearchBar component in src/components/filters/SearchBar.tsx with focus styling: '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
- [ ] T030 [US3] Ensure SearchBar has borderRadius: 2 applied to MuiOutlinedInput-root in src/components/filters/SearchBar.tsx
- [ ] T031 [US3] Add row selection state management in src/components/visualizations/DataTable.tsx using useState for selectedTerpene
- [ ] T032 [US3] Apply onClick handler to TableRow components in src/components/visualizations/DataTable.tsx: onClick={() => setSelectedTerpene(row.id)}
- [ ] T033 [US3] Add selected prop to TableRow in src/components/visualizations/DataTable.tsx: selected={selectedTerpene === row.id}
- [ ] T034 [US3] Apply selection styling to TableRow in src/components/visualizations/DataTable.tsx: '&.Mui-selected': { bgcolor: 'action.selected', borderLeft: '4px solid', borderColor: 'secondary.main' }
- [ ] T035 [US3] Add selected hover state to TableRow: '&.Mui-selected:hover': { bgcolor: 'action.selected' }
- [ ] T036 [P] [US3] Update E2E accessibility test in tests/e2e/accessibility.spec.ts to verify focus indicators with axe-core
- [ ] T037 [US3] Manual keyboard navigation test: Tab through interface and verify orange focus rings

**Checkpoint**: User Story 3 complete - Focus and selection states clearly visible with orange indicators

---

## Phase 6: User Story 4 - Filter with Multi-Select Chips (Priority: P3)

**Goal**: Implement dual-indicator chip states (background + border) for clear selected/unselected distinction

**Independent Test**: Click filter chips - verify selected chips have light background (rgba(255,255,255,0.16)) with green border (#4caf50), unselected chips have dark background (#1e1e1e) with transparent border, no layout shift occurs

### Implementation for User Story 4

- [ ] T038 [US4] Locate filter chip component (likely in src/components/filters/FilterChips.tsx or similar)
- [ ] T039 [US4] Implement unselected chip styling: bgcolor: 'background.paper', border: '2px solid', borderColor: 'transparent'
- [ ] T040 [US4] Implement selected chip styling: bgcolor: 'action.selected', border: '2px solid', borderColor: 'primary.main'
- [ ] T041 [US4] Apply conditional styling based on selected prop using sx prop
- [ ] T042 [US4] Verify Chip components have onClick handlers for toggle behavior
- [ ] T043 [P] [US4] Create integration test in tests/integration/us4-filter-chips.test.tsx verifying chip selection states and no layout shift
- [ ] T044 [US4] Manual test: Toggle multiple chips and verify visual states and no layout shift

**Checkpoint**: User Story 4 complete - Filter chips have clear selected/unselected states with dual indicators

---

## Phase 7: User Story 5 - Scan Table Data with Enhanced Readability (Priority: P2)

**Goal**: Implement zebra striping, hover states, and persistent selection indicators for improved table scanability

**Independent Test**: Scroll through table rows - verify (1) Odd rows have subtle darker background, (2) Hovering shows lighter background, (3) Selection shows orange left border, (4) Combination improves readability

### Implementation for User Story 5

- [ ] T045 [US5] Apply zebra striping to TableRow in src/components/visualizations/DataTable.tsx: '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, '&:nth-of-type(even)': { bgcolor: 'transparent' }
- [ ] T046 [US5] Apply hover state to TableRow in src/components/visualizations/DataTable.tsx: '&:hover': { bgcolor: 'action.selected' } with CSS transition for SC-008 (100ms performance target - verify with DevTools Performance tab)
- [ ] T047 [US5] Add cursor: 'pointer' to TableRow sx prop in src/components/visualizations/DataTable.tsx
- [ ] T048 [US5] Verify all TableRow interaction states work together correctly (zebra + hover + selection)
- [ ] T049 [P] [US5] Create integration test in tests/integration/us5-table-interactions.test.tsx verifying zebra stripes, hover, and selection states
- [ ] T050 [US5] Manual test: Scroll through long table and verify improved scanability

**Checkpoint**: User Story 5 complete - Table data is easily scannable with zebra striping, hover, and selection

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T051 [P] Run full test suite to ensure no regressions: pnpm run test:all
- [ ] T052 [P] Run E2E accessibility tests: pnpm run test:e2e
- [ ] T053 [P] Verify type checking passes: pnpm run type-check
- [ ] T054 [P] Run linting and fix any issues: pnpm run lint:fix
- [ ] T055 [P] Run formatting check: pnpm run format:check
- [ ] T056 Manual contrast ratio verification using Chrome DevTools for all text/background combinations
- [ ] T057 Manual test: Zoom interface to 200% and verify all visual indicators remain visible and proportional
- [ ] T058 Manual test: Test on mobile viewport (xs breakpoint) to verify responsive padding (16px)
- [ ] T059 Manual test: Test on desktop viewport (md+ breakpoint) to verify responsive padding (32px)
- [ ] T060 Verify all edge cases from spec.md are addressed or documented as known limitations
- [ ] T061 [P] Update ACCESSIBILITY.md documentation with new theme contrast ratios and focus indicators
- [ ] T062 Create pull request with all changes and request code review
- [ ] T063 Document any deviations from specification in PR description

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 P1 → US2/US3 P2 → US4/US5 P3)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but may build on same components
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 table structure but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent chip component styling
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Builds on US1/US3 table but adds independent styling layers

### Within Each User Story

- Layout updates before component-specific updates
- Component styling before manual testing
- Implementation complete before integration tests
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T002, T003, T004 can run in parallel

**Phase 2 (Foundational)**: T010, T011, T012, T013 (component overrides) can run in parallel after T006-T009 complete

**Phase 3 (US1)**: T017, T018 (Header) and T022 (unit test) can run in parallel with T019, T020, T021 (cards/table)

**Phase 4 (US2)**: T027 (integration test) can be written in parallel with T024-T026 implementation

**Phase 5 (US3)**: T029-T030 (SearchBar) and T036 (E2E test) can run in parallel with T031-T035 (table selection)

**Phase 6 (US4)**: T043 (integration test) can be written in parallel with T038-T042 implementation

**Phase 7 (US5)**: T049 (integration test) can be written in parallel with T045-T048 implementation

**Phase 8 (Polish)**: T051, T052, T053, T054, T055, T061 can all run in parallel

### User Story Parallelization

If multiple developers are available:
- After Phase 2 completes, US1-US5 can start simultaneously on different components
- US1 (main layout + cards) - Developer A
- US2 (toggle buttons) - Developer B
- US3 (focus indicators + table selection) - Developer C
- US4 (filter chips) - Developer D
- US5 (table zebra/hover) - Can merge with US3 if same developer

---

## Parallel Example: User Story 1

```bash
# After T016 is complete, these can run in parallel:
Task T017: "Update Header component - src/components/layout/Header.tsx"
Task T018: "Update Header Toolbar - src/components/layout/Header.tsx"
Task T019: "Wrap filter card with Paper - filter card component"
Task T020: "Wrap data table with Paper - src/components/visualizations/DataTable.tsx"
Task T022: "Create unit test - tests/unit/components/theme.test.ts"

# T021 depends on T020 completing (same file)
# T023 depends on all implementation tasks completing
```

## Parallel Example: Phase 2 (Foundational)

```bash
# After T006-T009 (palette updates) complete, these can run in parallel:
Task T010: "Add MuiButton override - src/theme/darkTheme.ts components"
Task T011: "Add MuiTextField override - src/theme/darkTheme.ts components"
Task T012: "Add MuiChip override - src/theme/darkTheme.ts components"
Task T013: "Add MuiTableRow override - src/theme/darkTheme.ts components"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (5 tasks) - ~30 minutes
2. Complete Phase 2: Foundational (10 tasks) - ~2-3 hours
3. Complete Phase 3: User Story 1 (8 tasks) - ~3-4 hours
4. **STOP and VALIDATE**: Test US1 independently with all acceptance scenarios
5. Deploy/demo with comfortable dark theme and floating cards

**Total MVP effort**: ~6-8 hours for a single developer

### Incremental Delivery

1. **MVP Release (US1)**: Dark theme foundation + floating cards
   - Delivers: Eye strain reduction, professional appearance, modern floating design
   - Value: Immediate visual comfort improvement
   
2. **Release 2 (+US2)**: Add view mode toggle highlighting
   - Delivers: Clear active state for navigation controls
   - Value: Reduced confusion about current view mode
   
3. **Release 3 (+US3)**: Add focus and selection indicators
   - Delivers: Accessibility compliance, keyboard navigation support
   - Value: WCAG 2.1 Level AA compliance, better keyboard UX
   
4. **Release 4 (+US4)**: Add filter chip states
   - Delivers: Clear filter selection visibility
   - Value: Improved filtering UX with dual indicators
   
5. **Release 5 (+US5)**: Add table interaction enhancements
   - Delivers: Zebra striping, hover feedback, persistent selection
   - Value: Improved data scanability and table usability

### Parallel Team Strategy

With 3 developers after Foundational phase:

**Week 1**:
- Developer A: US1 (main layout, cards, header) - MVP
- Developer B: US2 (toggle buttons) + US4 (chips)
- Developer C: US3 (focus/selection) + US5 (table enhancements)

**Week 2**:
- All: Integration testing, polish, deployment

**Total team effort**: ~2 weeks with parallel development

---

## Validation Checklist

Before marking the feature complete, verify:

- [ ] All colors match specification values exactly
- [ ] All text/background contrast ratios ≥ 4.5:1 (normal text) or ≥ 3:1 (large text)
- [ ] Focus indicators visible on all interactive elements (keyboard navigation)
- [ ] No layout shift during chip selection (transparent border trick working)
- [ ] Zebra striping visible in tables
- [ ] Selected states clearly distinguishable from unselected
- [ ] Responsive padding works correctly (16px mobile, 32px desktop)
- [ ] All automated tests pass (unit, integration, E2E, accessibility)
- [ ] TypeScript compilation successful with no errors
- [ ] Linting and formatting pass
- [ ] Manual zoom to 200% works correctly
- [ ] All edge cases from spec.md addressed or documented

---

## Task Summary

**Total Tasks**: 64
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 10 tasks ⚠️ BLOCKS all user stories
- Phase 3 (US1 - P1): 9 tasks (includes T019a for Card.tsx) 🎯 MVP
- Phase 4 (US2 - P2): 5 tasks
- Phase 5 (US3 - P2): 9 tasks
- Phase 6 (US4 - P3): 7 tasks
- Phase 7 (US5 - P3): 6 tasks
- Phase 8 (Polish): 13 tasks

**Parallel Tasks**: 25 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1 + 2 + 3 = 24 tasks (~6-8 hours for single developer)

**Independent Test Criteria**:
- US1: Open app, verify dark background, floating cards, proper contrast
- US2: Toggle views, verify bright green highlight on active selection
- US3: Tab through UI, click table rows, verify orange indicators
- US4: Click chips, verify light/dark states with green border, no layout shift
- US5: Scroll table, hover rows, click rows, verify zebra/hover/selection states

---

## Notes

- [P] tasks = different files or independent sections, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Foundational phase MUST complete before any user story work begins
- Stop at any checkpoint to validate story independently
- All file paths are estimates - actual locations should be verified during implementation
- Focus on accessibility throughout - WCAG 2.1 Level AA is a hard requirement
- Test focus indicators with keyboard navigation, not just mouse clicks
