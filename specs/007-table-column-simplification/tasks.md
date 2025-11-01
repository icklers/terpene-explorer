# Tasks: Table Column Simplification

**Feature**: 007-table-column-simplification  
**Branch**: `007-table-column-simplification`  
**Input**: Design documents from `/specs/007-table-column-simplification/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/terpene-table-component.md, quickstart.md

**Organization**: Tasks are grouped by user story (US1, US2, US3) to enable independent implementation and testing of each story. This follows the priority order from spec.md: US1 and US2 are both P1 (critical), US3 is P2 (important but secondary).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies are ready

**Note**: This feature modifies existing components, so minimal setup is required. The data model already contains the `category` field.

- [ ] T001 Verify existing project dependencies are installed (pnpm install)
- [ ] T002 [P] Verify TypeScript 5.7.2, React 19.2.0, Material UI 6.3.0, i18next 25.6.0 are available
- [ ] T003 [P] Verify data/terpene-database.json contains category field for all terpenes
- [ ] T004 [P] Run existing test suite to establish baseline (pnpm run test:run)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Add translation keys for Category column in src/i18n/locales/en.json (table.category, categoryCore, categorySecondary, categoryMinor, categoryUncategorized)
- [ ] T006 [P] Add translation keys for Category column in src/i18n/locales/de.json (Kategorie, Kern, Sekundär, Gering, Unkategorisiert)
- [ ] T007 Verify translation keys are loaded correctly by running dev server (pnpm run dev)

**Checkpoint**: Foundation ready - translations are in place, user story implementation can now begin

---

## Phase 3: User Story 1 - View Simplified Table Layout (Priority: P1) 🎯 MVP

**Goal**: Display exactly four columns (Name, Aroma, Effects, Category) with Sources column removed. This delivers immediate value by simplifying the UI and reducing cognitive load.

**Independent Test**: Load the terpene table and verify that exactly four columns are displayed (Name, Aroma, Effects, Category) and that the Sources column has been removed.

**Acceptance Criteria**:
- Table displays exactly four column headers (Name, Aroma, Effects, Category) and Sources column is absent
- Each row shows terpene name, aroma, effects (as chips), and category label
- Core terpene names are displayed in bold (font-weight: 700), non-Core in regular weight (400)

### RED Phase: Write Failing Tests First (TDD)

**⚠️ CRITICAL**: Write these tests FIRST and verify they FAIL before implementing any code changes.

- [ ] T008 [US1] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify table displays exactly 4 columns (Name, Aroma, Effects, Category) - Expected: FAILS (currently 5 columns)
- [ ] T009 [US1] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify Sources column is NOT present - Expected: FAILS (Sources column exists)
- [ ] T010 [US1] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify Category column header is displayed - Expected: FAILS (Category column missing)
- [ ] T011 [US1] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify Core terpene names are bold (font-weight: 700) - Expected: FAILS (no bold styling)
- [ ] T012 [US1] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify non-Core terpene names are regular weight (font-weight: 400) - Expected: FAILS (no conditional styling)
- [ ] T013 [US1] Write FAILING integration test in tests/integration/us5-table-interactions.test.tsx to verify 4 columns in full component tree - Expected: FAILS (currently 5 columns)
- [ ] T014 [US1] Write FAILING regression test in tests/unit/components/TerpeneTable.test.tsx to verify hover states still work after changes - Expected: FAILS initially (establishes baseline)
- [ ] T015 [US1] Write FAILING regression test in tests/unit/components/TerpeneTable.test.tsx to verify row selection still works after changes - Expected: FAILS initially (establishes baseline)
- [ ] T016 [US1] Write FAILING regression test in tests/unit/components/TerpeneTable.test.tsx to verify detail modal opens on row click - Expected: FAILS initially (establishes baseline)
- [ ] T017 [US1] Run all US1 tests (T008-T016) and verify ALL tests FAIL (RED state confirmed) - Document initial failure messages

### GREEN Phase: Implement to Make Tests Pass

**⚠️ CRITICAL**: Only proceed after verifying all tests FAIL. Implement features to make tests pass.

- [ ] T018 [US1] Update SortColumn type definition in src/components/visualizations/TerpeneTable.tsx (change from 'name' | 'aroma' | 'sources' | 'effects' to 'name' | 'aroma' | 'effects' | 'category')
- [ ] T019 [US1] Update TerpeneTableProps interface in src/components/visualizations/TerpeneTable.tsx (change initialSortBy type to accept 'category', remove 'sources')
- [ ] T020 [US1] Remove Sources column header TableCell from TableHead section in src/components/visualizations/TerpeneTable.tsx (lines ~220-240)
- [ ] T021 [US1] Remove Sources data cell TableCell from TableBody section in src/components/visualizations/TerpeneTable.tsx (line showing terpene.sources.join)
- [ ] T022 [US1] Add Category column header with TableSortLabel after Effects column in src/components/visualizations/TerpeneTable.tsx (use t('table.category') for translation)
- [ ] T023 [US1] Add getCategoryDisplay helper function in src/components/visualizations/TerpeneTable.tsx with signature: `function getCategoryDisplay(category: string | undefined | null, t: TFunction): string` - Returns translated category label with Uncategorized fallback
- [ ] T024 [US1] Add Category data cell after Effects cell in TableBody in src/components/visualizations/TerpeneTable.tsx (call getCategoryDisplay(terpene.category, t))
- [ ] T025 [US1] Add Typography wrapper to Name cell with conditional fontWeight in src/components/visualizations/TerpeneTable.tsx (fontWeight: 700 for Core, 400 for others)
- [ ] T026 [US1] Run all US1 tests (T008-T016) and verify ALL tests PASS (GREEN state achieved) - Tests T008-T013 should now pass, T014-T016 regression tests should confirm no breakage

### REFACTOR Phase: Improve Code Quality (Optional)

- [ ] T027 [US1] Review getCategoryDisplay implementation - Consider extracting to shared utility if reused elsewhere
- [ ] T028 [US1] Review Typography conditional styling - Consider extracting to styled component if complex
- [ ] T029 [US1] Run all US1 tests again after refactoring and verify they still PASS (GREEN state maintained)

**Checkpoint**: At this point, the table displays 4 columns with Category replacing Sources, Core terpene names are bold, and all existing functionality (hover, selection, modal) still works

---

## Phase 4: User Story 2 - Category-Based Sorting (Priority: P1) 🎯 MVP

**Goal**: Implement default sorting by category importance ranking (Core=1, Secondary=2, Minor=3, Uncategorized=4) with secondary alphabetical sort by name within each category. This provides immediate context about terpene importance.

**Independent Test**: Load the table and verify that all "Core" terpenes appear first, followed by all "Secondary" terpenes, then all "Minor" terpenes, without requiring any user interaction. Within each category, terpenes are sorted alphabetically by name.

**Acceptance Criteria**:

- Table loads sorted by category (Core → Secondary → Minor)
- Within each category, terpenes are sorted alphabetically by name
- Category column header shows active sort indicator
- Clicking Category header toggles sort direction (ascending/descending)

### RED Phase: Write Failing Tests First (TDD)

**⚠️ CRITICAL**: Write these tests FIRST and verify they FAIL before implementing any code changes.

- [ ] T030 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify default sort is by category using importance ranking (Core first, not alphabetical) - Expected: FAILS (currently sorts by name)
- [ ] T031 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify secondary alphabetical sort by name within same category group - Expected: FAILS (no secondary sort implemented)
- [ ] T032 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify missing/invalid category displays as "Uncategorized" and sorts last (rank=4) - Expected: FAILS (no Uncategorized handling)
- [ ] T033 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify Core terpenes appear before Secondary terpenes in default sort - Expected: FAILS (no category sort)
- [ ] T034 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify Secondary terpenes appear before Minor terpenes in default sort - Expected: FAILS (no category sort)
- [ ] T035 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify Category column header shows active sort indicator on load - Expected: FAILS (name column active)
- [ ] T036 [US2] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify clicking Category header toggles sort direction (Core→Minor becomes Minor→Core) - Expected: FAILS (no category sort handler)
- [ ] T037 [US2] Write FAILING performance test in tests/unit/components/TerpeneTable.test.tsx to verify category sort completes in <100ms for 100 terpenes - Expected: FAILS (no sort logic yet)
- [ ] T038 [US2] Run all US2 tests (T030-T037) and verify ALL tests FAIL (RED state confirmed) - Document initial failure messages

### GREEN Phase: Implement to Make Tests Pass

**⚠️ CRITICAL**: Only proceed after verifying all tests FAIL. Implement features to make tests pass.

- [ ] T039 [US2] Add CATEGORY_RANK constant in src/components/visualizations/TerpeneTable.tsx: `const CATEGORY_RANK = { Core: 1, Secondary: 2, Minor: 3, Uncategorized: 4 } as const`
- [ ] T040 [US2] Change default initialSortBy prop value from 'name' to 'category' in TerpeneTable function signature in src/components/visualizations/TerpeneTable.tsx
- [ ] T041 [US2] Update sortedTerpenes useMemo in src/components/visualizations/TerpeneTable.tsx to add 'category' case in switch statement
- [ ] T042 [US2] Implement category sort logic in 'category' case: primary sort by CATEGORY_RANK lookup, secondary sort by name.localeCompare in src/components/visualizations/TerpeneTable.tsx
- [ ] T043 [US2] Update Category column TableSortLabel active prop in src/components/visualizations/TerpeneTable.tsx to: active={sortBy === 'category'}
- [ ] T044 [US2] Update Category column TableSortLabel direction prop in src/components/visualizations/TerpeneTable.tsx to: direction={sortBy === 'category' ? sortDirection : 'asc'}
- [ ] T045 [US2] Run all US2 tests (T030-T037) and verify ALL tests PASS (GREEN state achieved) - All category sorting tests should now pass

### REFACTOR Phase: Improve Code Quality (Optional)

- [ ] T046 [US2] Review category sort logic - Consider extracting to separate utility function if complex
- [ ] T047 [US2] Review CATEGORY_RANK constant - Consider moving to constants file if reused elsewhere
- [ ] T048 [US2] Run all US2 tests again after refactoring and verify they still PASS (GREEN state maintained)

**Checkpoint**: At this point, the table defaults to category-based sorting with proper importance ranking and alphabetical secondary sort

---

## Phase 5: User Story 3 - Category Column Sorting and Display (Priority: P2)

**Goal**: Enable users to sort the table by clicking any of the four column headers (Name, Aroma, Effects, Category) with proper visual indicators. This provides flexible sorting for different research tasks.

**Independent Test**: Click each column header and verify that the table re-sorts correctly based on that column, with proper visual indicators (sort arrows) showing active column and direction.

**Acceptance Criteria**:

- Clicking Name column header sorts alphabetically by name
- Clicking Category column header sorts by category with visual indicator
- Sort direction toggles on same column click (ascending ↔ descending)
- Active column displays visual sort direction indicator (arrow)

### RED Phase: Write Failing Tests First (TDD)

**⚠️ CRITICAL**: Write these tests FIRST and verify they FAIL before verifying existing implementation.

- [ ] T049 [US3] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify clicking Name header sorts table alphabetically by name - Expected: FAILS (need to verify handler works)
- [ ] T050 [US3] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify clicking Aroma header sorts table by aroma - Expected: FAILS (need to verify handler works)
- [ ] T051 [US3] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify clicking Effects header sorts table by effects - Expected: FAILS (need to verify handler works)
- [ ] T052 [US3] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify clicking Category header sorts by category with visual indicator - Expected: FAILS (no visual check yet)
- [ ] T053 [US3] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify clicking same column header twice reverses sort direction - Expected: FAILS (no toggle check)
- [ ] T054 [US3] Write FAILING unit test in tests/unit/components/TerpeneTable.test.tsx to verify active column shows visual sort direction indicator (up/down arrow) - Expected: FAILS (no arrow check)
- [ ] T055 [US3] Write FAILING accessibility test in tests/unit/components/TerpeneTable.test.tsx to verify sort arrows have proper aria-sort attributes - Expected: FAILS (no aria verification)
- [ ] T056 [US3] Create E2E test file tests/e2e/table-sorting.spec.ts for category sorting scenarios
- [ ] T057 [P] [US3] Write FAILING E2E test in tests/e2e/table-sorting.spec.ts to verify Core terpenes display first by default - Expected: FAILS initially
- [ ] T058 [P] [US3] Write FAILING E2E test in tests/e2e/table-sorting.spec.ts to verify category importance ranking order (Core→Secondary→Minor) - Expected: FAILS initially
- [ ] T059 [P] [US3] Write FAILING E2E test in tests/e2e/table-sorting.spec.ts to verify clicking Category header toggles sort direction visually - Expected: FAILS initially
- [ ] T060 [P] [US3] Write FAILING E2E test in tests/e2e/table-sorting.spec.ts to verify exactly 4 columns displayed (Name, Aroma, Effects, Category) - Expected: FAILS initially
- [ ] T061 [P] [US3] Write FAILING E2E test in tests/e2e/table-sorting.spec.ts to verify Sources column is not present in DOM - Expected: FAILS initially
- [ ] T062 [US3] Run all US3 tests (T049-T061) and verify ALL tests FAIL (RED state confirmed) - Document initial failure messages

### GREEN Phase: Verify Implementation Makes Tests Pass

**⚠️ CRITICAL**: Only proceed after verifying all tests FAIL. Verify existing implementation makes tests pass.

- [ ] T063 [US3] Verify Category column TableSortLabel has onClick handler calling handleSort('category') in src/components/visualizations/TerpeneTable.tsx
- [ ] T064 [US3] Verify Category column TableSortLabel has direction prop: direction={sortBy === 'category' ? sortDirection : 'asc'} in src/components/visualizations/TerpeneTable.tsx
- [ ] T065 [US3] Verify Category column TableSortLabel has aria-sort attribute for accessibility in src/components/visualizations/TerpeneTable.tsx
- [ ] T066 [US3] Verify handleSort function properly toggles sort direction for all columns in src/components/visualizations/TerpeneTable.tsx
- [ ] T067 [US3] Run all US3 unit tests (T049-T055) and verify ALL tests PASS (GREEN state achieved) - Existing implementation should satisfy all requirements
- [ ] T068 [US3] Run all US3 E2E tests (T057-T061) and verify ALL tests PASS (GREEN state achieved) - E2E tests confirm full user journey

### REFACTOR Phase: Improve Code Quality (Optional)

- [ ] T069 [US3] Review TableSortLabel integration - Consider extracting common sort label props to constant
- [ ] T070 [US3] Review handleSort function - Consider extracting sort toggle logic if complex
- [ ] T071 [US3] Run all US3 tests again after refactoring and verify they still PASS (GREEN state maintained)

**Checkpoint**: All user stories are now complete - table has 4 columns, defaults to category sort, and all columns are sortable with proper visual indicators

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, performance testing, accessibility validation, and documentation

- [ ] T072 [P] Run full unit test suite and verify all tests pass (pnpm run test:unit)
- [ ] T073 [P] Run integration test suite and verify all tests pass (pnpm run test:integration)
- [ ] T074 Run E2E test suite and verify all tests pass (pnpm run test:e2e)
- [ ] T075 [P] Run accessibility tests with vitest-axe and verify zero violations (pnpm run test:a11y)
- [ ] T076 [P] Run TypeScript type checking and verify no errors (pnpm run type-check)
- [ ] T077 [P] Run linting and auto-fix any issues (pnpm run lint:fix)
- [ ] T078 [P] Run code formatting and verify compliance (pnpm run format)
- [ ] T079 Build project and verify no build errors (pnpm run build)
- [ ] T080 Manual visual inspection in light theme (verify layout, bold Core names with font-weight: 700, 4 columns)
- [ ] T081 Manual visual inspection in dark theme (verify layout, bold Core names with font-weight: 700, 4 columns)
- [ ] T082 Manual keyboard navigation testing (Tab through headers and rows, Enter/Space to interact)
- [ ] T083 Manual screen reader testing (verify table structure, column headers, sort states announced correctly)
- [ ] T084 [P] Performance testing with Chrome DevTools (verify <500ms render for 100 terpenes, <100ms sort operations)
- [ ] T085 [P] Run Lighthouse audit and verify Performance ≥90, Accessibility ≥95, Best Practices ≥90
- [ ] T086 [P] Measure DOM node reduction: verify 20% reduction from 250 nodes (5 cols) to 200 nodes (4 cols)
- [ ] T087 Cross-browser testing in Chrome, Firefox, Safari, Edge (verify layout and sorting work consistently)
- [ ] T088 Verify no horizontal scrolling on desktop displays ≥1024px width
- [ ] T089 Update CHANGELOG.md with feature summary, breaking changes, and migration guide
- [ ] T090 Update README.md if table column documentation needs updating
- [ ] T091 Run quickstart.md validation to ensure implementation guide is accurate and complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (verify existing setup)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories (translation keys must be added first)
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - Updates table to 4 columns
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion - Implements category sorting (requires Category column from US1)
- **User Story 3 (Phase 5)**: Depends on User Story 2 completion - Verifies all sorting works (requires category sort logic from US2)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
  - Adds Category column and removes Sources column
  - Makes Core terpene names bold (font-weight: 700)
  - Adds regression tests for existing functionality (hover, selection, modal)
- **User Story 2 (P1)**: **DEPENDS on User Story 1** - Requires Category column to exist
  - Implements category-based sorting logic with importance ranking
  - Changes default sort from 'name' to 'category'
  - Adds performance testing for sort operations
- **User Story 3 (P2)**: **DEPENDS on User Stories 1 and 2** - Requires Category column and sort logic
  - Verifies all column sorting works correctly with visual indicators
  - Adds comprehensive E2E tests for complete sorting behavior
  - Verifies accessibility of sort controls

**Critical Path**: Setup → Foundational → US1 (RED→GREEN→REFACTOR) → US2 (RED→GREEN→REFACTOR) → US3 (RED→GREEN→REFACTOR) → Polish

### Within Each User Story (TDD Order)

**User Story 1 (View Simplified Layout)** - TDD: RED→GREEN→REFACTOR:

1. RED Phase: Write failing tests first (T008-T017)
2. GREEN Phase: Implement to make tests pass (T018-T026)
3. REFACTOR Phase: Improve code quality (T027-T029)

**User Story 2 (Category-Based Sorting)** - TDD: RED→GREEN→REFACTOR:

1. RED Phase: Write failing tests first (T030-T038)
2. GREEN Phase: Implement to make tests pass (T039-T045)
3. REFACTOR Phase: Improve code quality (T046-T048)

**User Story 3 (Column Sorting & Display)** - TDD: RED→GREEN→REFACTOR:

1. RED Phase: Write failing tests first (T049-T062)
2. GREEN Phase: Verify implementation makes tests pass (T063-T068)
3. REFACTOR Phase: Improve code quality (T069-T071)

### Parallel Opportunities

**Phase 1 (Setup)**:

- All tasks T002, T003, T004 can run in parallel

**Phase 2 (Foundational)**:

- Tasks T005 and T006 can run in parallel (different translation files)

**Within User Story 1 - RED Phase**:

- Tasks T008-T016 (write all tests) can be written in parallel by different developers
- Task T017 must wait for T008-T016 to complete (runs all tests)

**Within User Story 2 - RED Phase**:

- Tasks T030-T037 (write all tests) can be written in parallel by different developers
- Task T038 must wait for T030-T037 to complete (runs all tests)

**Within User Story 3 - RED Phase**:

- Tasks T057-T061 (E2E tests) can be written in parallel after T056 completes
- Task T062 must wait for T049-T061 to complete (runs all tests)

**Phase 6 (Polish)**:

- Tasks T072, T073, T075, T076, T077, T078, T084, T085, T086 can run in parallel
- Tasks T080-T083 can run in parallel (different manual tests)

---

## Parallel Example: User Story 1 - RED Phase (Write Failing Tests)

```bash
# Launch all test writing tasks for User Story 1 together (different test scenarios):
Task T008: "Write FAILING test: verify 4 columns displayed"
Task T009: "Write FAILING test: verify Sources column not present"
Task T010: "Write FAILING test: verify Category column displayed"
Task T011: "Write FAILING test: verify Core names bold"
Task T012: "Write FAILING test: verify non-Core names regular weight"
Task T013: "Write FAILING test: integration test for 4 columns"
Task T014: "Write FAILING test: verify hover states work"
Task T015: "Write FAILING test: verify row selection works"
Task T016: "Write FAILING test: verify modal opens"

# Then run verification (must be sequential):
Task T017: "Run all US1 tests → verify ALL FAIL (RED state)"
```

## Parallel Example: User Story 2 - RED Phase (Write Failing Tests)

```bash
# Launch all test writing tasks for User Story 2 together (different test scenarios):
Task T030: "Write FAILING test: default sort by category"
Task T031: "Write FAILING test: secondary alphabetical sort"
Task T032: "Write FAILING test: Uncategorized handling"
Task T033: "Write FAILING test: Core before Secondary"
Task T034: "Write FAILING test: Secondary before Minor"
Task T035: "Write FAILING test: Category column active indicator"
Task T036: "Write FAILING test: toggle sort direction"
Task T037: "Write FAILING test: sort performance <100ms"

# Then run verification (must be sequential):
Task T038: "Run all US2 tests → verify ALL FAIL (RED state)"
```

## Parallel Example: User Story 3 - RED Phase (E2E Tests)

```bash
# Launch all E2E test writing tasks together (after T056 creates file):
Task T057: "Write FAILING E2E test: Core terpenes display first"
Task T058: "Write FAILING E2E test: Category importance ranking order"
Task T059: "Write FAILING E2E test: Clicking Category header toggles"
Task T060: "Write FAILING E2E test: Exactly 4 columns displayed"
Task T061: "Write FAILING E2E test: Sources column not present"

# Then run verification (must be sequential):
Task T062: "Run all US3 tests → verify ALL FAIL (RED state)"
```

---

## Implementation Strategy

### TDD-First Approach (MANDATORY)

**⚠️ CRITICAL**: This project follows strict Test-Driven Development (RED→GREEN→REFACTOR).

**For EVERY user story**:

1. **RED Phase**: Write ALL tests FIRST, run them, verify they FAIL
2. **GREEN Phase**: Implement code to make tests PASS
3. **REFACTOR Phase**: Improve code quality while keeping tests GREEN

**Never implement code before writing the test that should fail.**

### MVP First (User Stories 1 and 2 - Both P1)

Both User Story 1 and User Story 2 are marked as P1 (highest priority) in the spec because they deliver the core functionality:

1. Complete Phase 1: Setup (verify dependencies) - 4 tasks
2. Complete Phase 2: Foundational (add translation keys) - CRITICAL BLOCKER - 3 tasks
3. Complete Phase 3: User Story 1 - TDD: RED→GREEN→REFACTOR - 22 tasks
   - RED: Write 10 failing tests (T008-T017)
   - GREEN: Implement 4-column table with Category (T018-T026)
   - REFACTOR: Optional improvements (T027-T029)
4. Complete Phase 4: User Story 2 - TDD: RED→GREEN→REFACTOR - 19 tasks
   - RED: Write 9 failing tests (T030-T038)
   - GREEN: Implement category-based sorting (T039-T045)
   - REFACTOR: Optional improvements (T046-T048)
5. **STOP and VALIDATE**: Run all tests → verify GREEN state
6. **MVP READY**: Table shows 4 columns and defaults to category sorting

User Story 3 (P2) can be added later for enhanced sorting verification.

### Incremental Delivery (TDD Per Story)

1. Setup + Foundational → Translations ready ✓ (7 tasks)
2. User Story 1 (TDD) → **Deliverable**: 4-column table with bold Core names ✓ (22 tasks)
   - RED: Tests fail (10 tasks)
   - GREEN: Tests pass (9 tasks)
   - REFACTOR: Code improved (3 tasks)
3. User Story 2 (TDD) → **Deliverable**: Category-based default sorting ✓ (MVP!) (19 tasks)
   - RED: Tests fail (9 tasks)
   - GREEN: Tests pass (7 tasks)
   - REFACTOR: Code improved (3 tasks)
4. User Story 3 (TDD) → **Deliverable**: Full sorting verification with E2E tests ✓ (23 tasks)
   - RED: Tests fail (14 tasks)
   - GREEN: Tests pass (6 tasks)
   - REFACTOR: Code improved (3 tasks)
5. Polish → **Final Release**: Production-ready with full test coverage ✓ (20 tasks)

### Sequential Execution (Single Developer - TDD)

This feature has sequential dependencies (US1 → US2 → US3), so a single developer should:

1. Complete Phases 1-2 (Setup + Foundational) - 7 tasks
2. Complete Phase 3 (User Story 1) - TDD cycle - 22 tasks
   - Write tests FIRST → Verify FAIL → Implement → Verify PASS
3. Complete Phase 4 (User Story 2) - TDD cycle - 19 tasks
   - Write tests FIRST → Verify FAIL → Implement → Verify PASS
4. Complete Phase 5 (User Story 3) - TDD cycle - 23 tasks
   - Write tests FIRST → Verify FAIL → Implement → Verify PASS
5. Complete Phase 6 (Polish) - 20 tasks

**Total**: 91 tasks

**Estimated time**: 3-4 hours total (increased from 2-3 hours due to strict TDD with verification steps)

**Time breakdown**:

- Setup + Foundational: 15 minutes
- User Story 1 (TDD): 60 minutes (tests + implementation + verification)
- User Story 2 (TDD): 45 minutes (tests + implementation + verification)
- User Story 3 (TDD): 60 minutes (tests + E2E + verification)
- Polish: 30 minutes (validation + documentation)

---

## Task Count Summary

- **Phase 1 (Setup)**: 4 tasks (T001-T004)
- **Phase 2 (Foundational)**: 3 tasks (T005-T007)
- **Phase 3 (User Story 1)**: 22 tasks (T008-T029)
  - RED Phase: 10 tasks (T008-T017)
  - GREEN Phase: 9 tasks (T018-T026)
  - REFACTOR Phase: 3 tasks (T027-T029)
- **Phase 4 (User Story 2)**: 19 tasks (T030-T048)
  - RED Phase: 9 tasks (T030-T038)
  - GREEN Phase: 7 tasks (T039-T045)
  - REFACTOR Phase: 3 tasks (T046-T048)
- **Phase 5 (User Story 3)**: 23 tasks (T049-T071)
  - RED Phase: 14 tasks (T049-T062)
  - GREEN Phase: 6 tasks (T063-T068)
  - REFACTOR Phase: 3 tasks (T069-T071)
- **Phase 6 (Polish)**: 20 tasks (T072-T091)

**Total**: 91 tasks (increased from 64 to include TDD verification steps and missing coverage)

**Parallel opportunities identified**: 32 tasks can run in parallel (marked with [P] or within RED phases)

**TDD Compliance**: All user story phases follow strict RED→GREEN→REFACTOR methodology

---

## Notes

- **TDD MANDATORY**: All user stories follow strict RED→GREEN→REFACTOR methodology
- **RED Phase**: Write failing tests FIRST, run them, verify they FAIL before any implementation
- **GREEN Phase**: Implement code to make tests PASS, run tests, verify they PASS
- **REFACTOR Phase**: Improve code quality while maintaining GREEN state
- [P] tasks = different files, no dependencies within their phase
- [Story] label (US1, US2, US3) maps task to specific user story for traceability
- Each user story builds on the previous (US1 → US2 → US3 dependency chain)
- User Story 1 and 2 together form the MVP (both P1 priority)
- User Story 3 (P2) enhances with comprehensive sorting tests and E2E verification
- **Never skip RED phase**: Implementing code before writing failing tests violates TDD and project constitution
- Verify each checkpoint to validate story independently before proceeding
- Commit after each TDD cycle (RED→GREEN→REFACTOR) or logical group of tasks
- Follow quickstart.md for detailed implementation guidance
- All test tasks include explicit verification steps (FAIL then PASS)
- Performance tests (T037, T084) verify <100ms sort operations and <500ms render times
- Accessibility tests (T055, T075) verify WCAG 2.1 Level AA compliance with vitest-axe
- Regression tests (T014-T016) ensure existing functionality (hover, selection, modal) still works
