# Tasks: Interactive Terpene Map

**Input**: Design documents from `/specs/001-interactive-terpene-map/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: Required by Constitution Principle V - unit/integration tests BEFORE implementation per TDD

**Organization**: Tasks grouped by user story to enable independent implementation and testing. Tests written FIRST (TDD), must FAIL, then implementation makes them pass.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure using Vite 6, React 18, TypeScript 5.7, Material UI 6

- [ ] T001 Initialize Vite React-TypeScript project with pnpm at repository root
- [ ] T002 [P] Configure TypeScript (tsconfig.json, tsconfig.node.json) per plan.md with ES2024 target
- [ ] T003 [P] Configure ESLint 9 (eslint.config.js) with flat config and jsx-a11y plugin
- [ ] T004 [P] Configure Prettier (.prettierrc, .prettierignore) per plan.md
- [ ] T005 [P] Configure Vite (vite.config.ts) with manual chunking and path aliases
- [ ] T006 [P] Configure Vitest (vitest.config.ts) with 80% coverage thresholds
- [ ] T007 [P] Configure Playwright (playwright.config.ts) for port 5173 and mobile viewports
- [ ] T008 Install dependencies: React 18.3+, Material UI 6, D3.js 7.9+, i18next 24+, js-yaml, zod
- [ ] T009 Install dev dependencies: Vitest, Playwright, React Testing Library 16+, vitest-axe (or jest-axe for Vitest compatibility), @types packages
- [ ] T010 Create directory structure in src/ per plan.md (components/, pages/, services/, models/, hooks/, i18n/, theme/, utils/)
- [ ] T011 Create test directory structure: tests/unit/, tests/integration/, tests/e2e/
- [ ] T012 [P] Create .gitignore per plan.md (node_modules, dist, coverage, test-results, etc.)
- [ ] T013 [P] Create data/ directory and add sample terpenes.json with 5-10 sample entries

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Models and Schemas (Can run in parallel)

- [ ] T014 [P] Define Terpene interface in src/models/Terpene.ts per data-model.md
- [ ] T015 [P] Define Effect interface in src/models/Effect.ts per data-model.md
- [ ] T016 [P] Define FilterState interface in src/models/FilterState.ts per data-model.md
- [ ] T017 [P] Define ThemeState and StoredPreferences interfaces in src/models/Preferences.ts

### Unit Tests for Core Services and Utils (TDD - Write First, Must Fail)

- [ ] T018 [P] Write unit tests for validation schema in tests/unit/utils/validation.test.ts (test Zod schema, graceful degradation, invalid entries, edge cases)
- [ ] T019 [P] Write unit tests for dataLoader service in tests/unit/services/dataLoader.test.ts (test JSON/YAML parsing, validation integration, error handling, empty dataset)
- [ ] T020 [P] Write unit tests for accessibility utilities in tests/unit/utils/accessibility.test.ts (test ARIA label generation, focus management)

**Checkpoint**: Core service tests written and FAILING (red) 🔴

### Implementation of Core Services and Utils (Make Tests Pass)

- [ ] T021 [P] Create Zod validation schema in src/utils/validation.ts for graceful validation (FR-015) - make T018 pass
- [ ] T022 Implement dataLoader service in src/services/dataLoader.ts with JSON/YAML parsing and validation - make T019 pass
- [ ] T023 [P] Create accessibility utilities in src/utils/accessibility.ts for ARIA labels and focus management - make T020 pass
- [ ] T024 [P] Create constants file in src/utils/constants.ts for effect colors and configuration

**Checkpoint**: Core service tests PASSING (green) 🟢

### i18n and Theming Setup (Can run in parallel)

- [ ] T025 [P] Setup i18next configuration in src/i18n/config.ts with language detection
- [ ] T026 [P] Create English translations in src/i18n/locales/en.json with all UI strings
- [ ] T027 [P] Create German translations in src/i18n/locales/de.json with all UI strings
- [ ] T028 [P] Create light theme in src/theme/lightTheme.ts with WCAG AA contrast (4.5:1) per constitution
- [ ] T029 [P] Create dark theme in src/theme/darkTheme.ts with WCAG AA contrast (4.5:1) per constitution
- [ ] T030 Create theme configuration in src/theme/themeConfig.ts integrating Material UI CssVarsProvider

### Common Components

- [ ] T031 [P] Create ErrorBoundary component in src/components/common/ErrorBoundary.tsx with Material UI Alert
- [ ] T032 [P] Create LoadingIndicator component (pulsing cannabis leaf) in src/components/common/LoadingIndicator.tsx (FR-012)

### Application Bootstrap

- [ ] T033 Create App.tsx with CssVarsProvider, i18next provider, and ErrorBoundary wrapper
- [ ] T034 Create main.tsx entry point rendering App component
- [ ] T035 Create public/index.html with proper meta tags and WCAG compliance

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Filter Terpene Data (Priority: P1) 🎯 MVP

**Goal**: Enable users to see terpene data and filter by effects with AND/OR toggle

**Independent Test**: Load application, see terpenes displayed, select effect filters, toggle AND/OR mode, verify filtered results

### Tests for User Story 1 (TDD - Write First, Must Fail)

> **TDD Protocol**: Write these tests FIRST, verify they FAIL (red 🔴), then implement to make them pass (green 🟢)

- [ ] T036 [P] [US1] Write unit tests for filterService in tests/unit/services/filterService.test.ts (test AND logic, OR logic, empty filters, no results, edge cases)
- [ ] T037 [P] [US1] Write unit tests for colorService in tests/unit/services/colorService.test.ts (test color assignment, uniqueness, WCAG contrast validation)
- [ ] T038 [P] [US1] Write unit tests for useTerpeneData hook in tests/unit/hooks/useTerpeneData.test.ts (test data loading, error states, loading states, empty dataset)
- [ ] T039 [P] [US1] Write unit tests for useFilters hook in tests/unit/hooks/useFilters.test.ts (test filter state, AND/OR toggle, filter updates, edge cases)
- [ ] T040 [P] [US1] Write component tests for FilterControls in tests/unit/components/FilterControls.test.tsx (test chip rendering, selection, deselection, accessibility)
- [ ] T041 [P] [US1] Write component tests for FilterModeToggle in tests/unit/components/FilterModeToggle.test.tsx (test AND/OR toggle behavior, visual feedback)
- [ ] T042 [US1] Write component tests for TerpeneList in tests/unit/components/TerpeneList.test.tsx (test filtering, empty states, error states, validation warnings)
- [ ] T043 [US1] Write integration test for data flow in tests/integration/us1-filter-flow.test.ts (test dataLoader → filterService → rendering pipeline)

**Checkpoint**: All US1 tests written and FAILING (red) 🔴

### Implementation for User Story 1 (Make Tests Pass)

- [ ] T044 [P] [US1] Implement filterService in src/services/filterService.ts with AND/OR logic (FR-013) - make T036 pass
- [ ] T045 [P] [US1] Implement colorService in src/services/colorService.ts for effect category colors (FR-005) - make T037 pass
- [ ] T046 [P] [US1] Create useTerpeneData hook in src/hooks/useTerpeneData.ts loading data via dataLoader - make T038 pass
- [ ] T047 [P] [US1] Create useFilters hook in src/hooks/useFilters.ts managing FilterState with AND/OR toggle - make T039 pass
- [ ] T048 [P] [US1] Create FilterControls component in src/components/filters/FilterControls.tsx with Material UI Chips - make T040 pass
- [ ] T049 [P] [US1] Create FilterModeToggle component in src/components/filters/FilterModeToggle.tsx with ToggleButtonGroup (FR-013) - make T041 pass
- [ ] T050 [US1] Create TerpeneList component in src/components/visualizations/TerpeneList.tsx displaying filtered results - make T042 pass
- [ ] T051 [US1] Create Home page in src/pages/Home.tsx integrating useTerpeneData, useFilters, FilterControls, and TerpeneList - make T043 pass
- [ ] T052 [US1] Add error handling for data loading failures with user-friendly messages (edge cases)
- [ ] T053 [US1] Add "no results" message for empty filter results (edge cases)
- [ ] T054 [US1] Add validation warning notification (Snackbar) for invalid entries (FR-015)
- [ ] T055 [US1] Add empty state display for zero valid entries (FR-016)
- [ ] T056 [US1] Optimize filter performance to meet <200ms target (NFR-PERF-002) using React.useMemo

**Checkpoint**: User Story 1 complete - all tests PASSING (green) 🟢 - users can view and filter terpenes with AND/OR logic

---

## Phase 4: User Story 3 - Data Visualization and Search (Priority: P1)

**Goal**: Enable sunburst chart, table view, view switching, and search functionality

**Independent Test**: Switch between sunburst and table views, click sunburst slices to filter, search by name/aroma/effects, sort table columns

**Note**: Implementing US3 before US2 because both are P1 priority and US3 is core data exploration

### Tests for User Story 3 (TDD - Write First, Must Fail)

- [ ] T057 [P] [US3] Write unit tests for sunburstTransform utility in tests/unit/utils/sunburstTransform.test.ts (test hierarchy building, color mapping, edge cases)
- [ ] T058 [P] [US3] Write component tests for SearchBar in tests/unit/components/SearchBar.test.tsx (test debouncing, sanitization, search logic, special characters)
- [ ] T059 [P] [US3] Write component tests for SunburstChart in tests/unit/components/SunburstChart.test.tsx (test D3 rendering, click handlers, accessibility, ARIA labels)
- [ ] T060 [P] [US3] Write component tests for TerpeneTable in tests/unit/components/TerpeneTable.test.tsx (test sorting, virtualization, column rendering, accessibility)
- [ ] T061 [US3] Write integration test for search/visualization flow in tests/integration/us3-visualization-flow.test.ts (test search → filter → view switching → rendering)

**Checkpoint**: All US3 tests written and FAILING (red) 🔴

### Implementation for User Story 3 (Make Tests Pass)

- [ ] T062 [P] [US3] Create sunburst data transformation utility in src/utils/sunburstTransform.ts - make T057 pass
- [ ] T063 [P] [US3] Create SearchBar component in src/components/filters/SearchBar.tsx with debouncing (300ms) and sanitization - make T058 pass
- [ ] T064 [P] [US3] Create ViewModeToggle component in src/components/common/ViewModeToggle.tsx with ToggleButtonGroup
- [ ] T065 [US3] Create SunburstChart component in src/components/visualizations/SunburstChart.tsx using D3.js with ARIA labels (FR-009) - make T059 pass
- [ ] T066 [US3] Add keyboard navigation and accessibility to SunburstChart (Tab, Enter, Arrow keys per NFR-A11Y-003)
- [ ] T067 [US3] Implement click handler on sunburst slices to filter main view (FR-009)
- [ ] T068 [P] [US3] Create TerpeneTable component in src/components/visualizations/TerpeneTable.tsx with Material UI Table (FR-010) - make T060 pass
- [ ] T069 [US3] Add sortable columns (Name, Aroma, Sources, Effects) to TerpeneTable using TableSortLabel (FR-010)
- [ ] T070 [US3] Add virtualization to TerpeneTable for >100 rows using react-window
- [ ] T071 [US3] Integrate SearchBar into Home page with filter hook
- [ ] T072 [US3] Integrate ViewModeToggle into Home page to switch between sunburst and table
- [ ] T073 [US3] Update Home page to conditionally render SunburstChart or TerpeneTable based on viewMode - make T061 pass
- [ ] T074 [US3] Optimize sunburst/table render to meet <500ms target (SC-005) using React.lazy for code splitting

**Checkpoint**: User Story 3 complete - all tests PASSING (green) 🟢 - users can visualize data in multiple formats and search

---

## Phase 5: User Story 2 - Theming and Language (Priority: P2)

**Goal**: Enable theme switching (light/dark), language switching (en/de), and localStorage persistence

**Independent Test**: Toggle theme and see appearance change, switch language and see UI text update, close and reopen browser to verify preferences persisted

### Tests for User Story 2 (TDD - Write First, Must Fail)

- [ ] T075 [P] [US2] Write unit tests for useTheme hook in tests/unit/hooks/useTheme.test.ts (test theme switching, system preference detection, persistence)
- [ ] T076 [P] [US2] Write unit tests for useLocalStorage hook in tests/unit/hooks/useLocalStorage.test.ts (test CRUD operations, Safari private mode fallback, edge cases)
- [ ] T077 [US2] Write integration test for theme/i18n persistence in tests/integration/us2-preferences-flow.test.ts (test localStorage → preferences → UI update → persistence)

**Checkpoint**: All US2 tests written and FAILING (red) 🔴

### Implementation for User Story 2 (Make Tests Pass)

- [ ] T078 [P] [US2] Create useTheme hook in src/hooks/useTheme.ts wrapping Material UI useColorScheme - make T075 pass
- [ ] T079 [P] [US2] Create useLocalStorage hook in src/hooks/useLocalStorage.ts for preference persistence (FR-014) - make T076 pass
- [ ] T080 [P] [US2] Create ThemeToggle component in src/components/theme/ThemeToggle.tsx with IconButton
- [ ] T081 [P] [US2] Create LanguageSelector component in src/components/theme/LanguageSelector.tsx with Material UI Select
- [ ] T082 [P] [US2] Create AppBar component in src/components/layout/AppBar.tsx integrating ThemeToggle and LanguageSelector
- [ ] T083 [US2] Integrate useLocalStorage into useTheme to persist theme preference (FR-014) - make T077 pass
- [ ] T084 [US2] Integrate useLocalStorage into i18next to persist language preference (FR-014)
- [ ] T085 [US2] Integrate useLocalStorage into useFilters to persist viewMode and filterMode (FR-014)
- [ ] T086 [US2] Update App.tsx to detect system theme preference and default accordingly (FR-006)
- [ ] T087 [US2] Update Home page to include AppBar with theme and language controls
- [ ] T088 [US2] Add graceful fallback for localStorage unavailable (Safari private mode) per data-model.md

**Checkpoint**: User Story 2 complete - all tests PASSING (green) 🟢 - users can customize theme/language with persistence

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

### Accessibility Polish

- [ ] T089 [P] Create Footer component in src/components/layout/Footer.tsx with accessibility info
- [ ] T090 [P] Add ARIA live regions for announcing filter result counts in FilterControls
- [ ] T091 [P] Add focus management when switching views in Home page (NFR-A11Y-003)
- [ ] T092 [P] Add proper heading hierarchy (h1, h2, h3) throughout application (WCAG compliance)
- [ ] T093 [P] Verify all colors meet 4.5:1 contrast in both themes using browser DevTools (NFR-A11Y-002)

### Security Hardening

- [ ] T094 [P] Add Content Security Policy headers in vite.config.ts (NFR-SEC-001)
- [ ] T095 [P] Sanitize search input to prevent XSS attacks in SearchBar component (NFR-SEC-001)
- [ ] T096 [P] Run pnpm audit and fix any vulnerabilities (NFR-SEC-001)

### Additional Data and Configuration

- [ ] T097 [P] Create sample terpenes.yaml file in data/ directory for alternative format testing
- [ ] T098 [P] Update package.json with proper scripts (dev, build, preview, test, lint, format)

### Performance Testing

- [ ] T099 Test initial load performance target <2s with Lighthouse (NFR-PERF-001)
- [ ] T100 Test interaction performance <200ms for filters/search (NFR-PERF-002)
- [ ] T101 Run Lighthouse audit targeting Performance ≥90, Accessibility ≥95 (SC-001, SC-002)

### Test Coverage Verification (Constitution Requirement)

- [ ] T102 [P] Run Vitest coverage report and verify ≥80% coverage for src/services/ (Constitution Principle V)
- [ ] T103 [P] Run Vitest coverage report and verify ≥80% coverage for src/hooks/ (Constitution Principle V)
- [ ] T104 [P] Run Vitest coverage report and verify ≥80% coverage for src/utils/ (Constitution Principle V)
- [ ] T105 Update package.json scripts to include coverage thresholds enforcement (fail build if <80%)

### End-to-End Tests (Validation Tests - After Implementation)

- [ ] T106 [P] Write E2E test for User Story 1 in tests/e2e/filter-terpenes.spec.ts
- [ ] T107 [P] Write E2E test for User Story 2 in tests/e2e/theme-language.spec.ts
- [ ] T108 [P] Write E2E test for User Story 3 in tests/e2e/visualization-search.spec.ts
- [ ] T109 [P] Write accessibility E2E test with vitest-axe in tests/e2e/accessibility.spec.ts

### Final Polish

- [ ] T110 Code cleanup and refactoring for consistency
- [ ] T111 Verify all user-facing strings are externalized (no hard-coded text per Gate 6)
- [ ] T112 Run quickstart.md validation to ensure setup instructions work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational (Phase 2) completion
  - User Story 1 (Phase 3): Can start after Foundational - No dependencies on other stories
  - User Story 3 (Phase 4): Can start after Foundational - No dependencies on other stories
  - User Story 2 (Phase 5): Can start after Foundational - Integrates with existing UI from US1/US3
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can start after Foundational (Phase 2)
- **User Story 3 (P1)**: Independent - can start after Foundational (Phase 2), integrates with US1 filtering
- **User Story 2 (P2)**: Builds on US1/US3 - adds theme/language to existing UI

### TDD Workflow Within Each Phase

**CRITICAL - Test-Driven Development Order**:

1. **Write tests FIRST** - all test tasks for a phase/story
2. **Verify tests FAIL** (red 🔴) - no implementation exists yet
3. **Implement features** - write code to make tests pass
4. **Verify tests PASS** (green 🟢) - all tests passing
5. **Refactor if needed** - tests still passing after refactor

**Within Each User Story**:

- Tests before implementation (TDD red-green-refactor)
- Services before hooks
- Hooks before components
- Basic components before integration components
- Integration into Home page after individual components complete
- Performance optimization after functionality complete

### Parallel Opportunities

- **Setup (Phase 1)**: T002-T007 (all config files), T012-T013 can run in parallel
- **Foundational (Phase 2)**: T014-T020 (models/test setup), T025-T027 (i18n), T028-T029 (themes), T031-T032 (common components) can run in parallel
- **User Story Tests**: All test tasks within a phase marked [P] can run in parallel
- **User Story Implementation**: After tests fail, implementation tasks marked [P] can run in parallel
- **User Story 1**: T036-T041 (all tests), then T044-T049 (services/hooks/components)
- **User Story 3**: T057-T060 (all tests), then T062-T068 (components)
- **User Story 2**: T075-T076 (tests), then T078-T082 (hooks/components)
- **Polish**: T089-T098 (accessibility/security/config), T102-T109 (all tests) can run in parallel
- **Cross-Story Parallelism**: After Foundational, US1 and US3 can be worked on simultaneously by different developers

---

## Parallel Example: User Story 1 (TDD Workflow)

```bash
# Step 1: Launch all tests for User Story 1 together (MUST FAIL):
Task: "Write unit tests for filterService in tests/unit/services/filterService.test.ts"
Task: "Write unit tests for colorService in tests/unit/services/colorService.test.ts"
Task: "Write unit tests for useTerpeneData hook in tests/unit/hooks/useTerpeneData.test.ts"
Task: "Write unit tests for useFilters hook in tests/unit/hooks/useFilters.test.ts"
Task: "Write component tests for FilterControls"
Task: "Write component tests for FilterModeToggle"
Task: "Write component tests for TerpeneList"
Task: "Write integration test for data flow"

# Verify: npm test → ALL FAIL (red) 🔴

# Step 2: Launch all implementations together (make tests pass):
Task: "Implement filterService" → makes T036 pass
Task: "Implement colorService" → makes T037 pass
Task: "Create useTerpeneData hook" → makes T038 pass
Task: "Create useFilters hook" → makes T039 pass

# Verify: npm test → ALL PASS (green) 🟢
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - TDD)

1. Complete Phase 1: Setup (T001-T013)
2. Complete Phase 2: Foundational (T014-T035) - CRITICAL
3. Complete Phase 3: User Story 1 TESTS (T036-T043) - verify FAIL
4. Complete Phase 3: User Story 1 IMPLEMENTATION (T044-T056) - verify PASS
5. **STOP and VALIDATE**: All US1 tests passing, filtering works
6. Deploy/demo minimal viable product

**MVP Delivers**: Users can view terpenes and filter by effects with AND/OR logic (fully tested)

### Incremental Delivery (TDD for each story)

1. Complete Setup + Foundational → Foundation ready
2. Write US1 tests → Implement US1 → Verify tests pass → Deploy (MVP with filtering!)
3. Write US3 tests → Implement US3 → Verify tests pass → Deploy (Add visualization and search!)
4. Write US2 tests → Implement US2 → Verify tests pass → Deploy (Add theming and i18n!)
5. Complete Polish + E2E tests → Final production-ready release

### Parallel Team Strategy (TDD)

With multiple developers:

1. Team completes Setup (Phase 1) + Foundational (Phase 2) together
2. Once Foundational is done:
   - Developer A: Write US1 tests → Implement US1 (filtering)
   - Developer B: Write US3 tests → Implement US3 (visualization/search)
   - Developer C: Write US2 tests → Implement US2 (theming/i18n) OR helping with US1/US3
3. Each developer follows TDD: tests first (fail), implementation (pass)
4. Stories integrate independently into Home page

---

## Task Summary

- **Total Tasks**: 112
- **Phase 1 (Setup)**: 13 tasks
- **Phase 2 (Foundational)**: 22 tasks (BLOCKING) - includes 3 unit tests
- **Phase 3 (User Story 1)**: 21 tasks (P1 - MVP) - 8 tests + 13 implementation
- **Phase 4 (User Story 3)**: 18 tasks (P1 - Visualization) - 5 tests + 13 implementation
- **Phase 5 (User Story 2)**: 14 tasks (P2 - Theming) - 3 tests + 11 implementation
- **Phase 6 (Polish)**: 24 tasks (Production readiness) - 4 coverage + 4 E2E + 16 polish

**Test Task Breakdown**:

- Unit tests (services): 5 tasks
- Unit tests (hooks): 6 tasks
- Unit tests (utils): 3 tasks
- Unit tests (components): 8 tasks
- Integration tests: 4 tasks
- Coverage verification: 4 tasks
- E2E tests: 4 tasks
- Performance tests: 3 tasks
- **Total Test Tasks**: 37 (33% of all tasks)

**Parallelization Opportunities**: 60+ tasks marked [P] can run concurrently

**Suggested MVP Scope**: Phases 1, 2, and 3 (User Story 1) = 56 tasks for core filtering functionality with full test coverage

**Independent Test Criteria**:

- **US1**: Write tests (fail) → Implement → Tests pass → Load app, select effects, toggle AND/OR, verify correct filtering
- **US3**: Write tests (fail) → Implement → Tests pass → Switch views, click sunburst slice, search by text, sort table
- **US2**: Write tests (fail) → Implement → Tests pass → Toggle theme, switch language, reload browser, verify persistence

---

## TDD Compliance Notes

✅ **Constitution Principle V Compliance**:

- All features accompanied by appropriate tests
- Unit tests for all services, hooks, and utilities
- Integration tests for data flow and component interactions
- E2E tests for critical user journeys
- Accessibility tests with vitest-axe
- Coverage verification ≥80% for critical paths
- Tests run in CI/CD before merging (enforced via package.json)

✅ **Test-First Ordering**:

- Every user story begins with test tasks
- Tests must fail before implementation
- Implementation tasks reference which test they make pass
- Clear checkpoints: "tests failing" → "tests passing"

✅ **Coverage Target**:

- T102-T104: Explicit verification of ≥80% coverage
- T105: Enforcement via build scripts (fail if <80%)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- **TDD workflow**: Tests first (red 🔴) → Implementation (green 🟢) → Refactor
- All file paths follow plan.md project structure
- Commit after each task or logical group
- Stop at any checkpoint to validate tests/story independently
- Performance targets: <2s load, <200ms interactions, <500ms visualizations
- Accessibility: WCAG 2.1 Level AA, 4.5:1 contrast, full keyboard navigation
- Security: OWASP Top 10 compliance, input sanitization, CSP headers
- **Test coverage enforced**: Build fails if <80% coverage for services/hooks/utils
