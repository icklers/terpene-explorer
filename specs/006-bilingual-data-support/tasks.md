# Tasks: Bilingual Terpene Data Support

**Input**: Design documents from `/specs/006-bilingual-data-support/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included following TDD (RED → GREEN → REFACTOR) approach as specified in plan.md

**Organization**: Tasks are grouped by TDD cycles aligned with user stories to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Single-page web application with Vite
- Frontend: `src/` at repository root
- Tests: `tests/unit/`, `tests/integration/`, `tests/e2e/`
- Data: `data/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and translation data structure

- [ ] T001 Create German translation data file at `data/terpene-translations-de.json` with schema (language, version, terpenes object)
- [ ] T002 [P] Create TypeScript interfaces in `src/models/TerpeneTranslation.ts` (TerpeneTranslation, TranslationFile, TranslatedTerpene)
- [ ] T003 [P] Create Zod schemas in `src/models/TerpeneTranslation.ts` (TerpeneTranslationSchema, TranslationFileSchema)
- [ ] T004 [P] Create translation error types in `src/services/translationService.ts` (TranslationValidationError, TranslationLoadError)
- [ ] T005 [P] Create `LanguageBadge` component stub in `src/components/common/LanguageBadge.tsx`
- [ ] T006 [P] Create `TranslatedText` component stub in `src/components/common/TranslatedText.tsx`

---

## Phase 2: Foundational - TDD Cycle 1: Translation File Loading

**Purpose**: Core infrastructure for loading and validating translation files (BLOCKS all user stories)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### RED: Write Tests First (Must FAIL)

- [ ] T007 [P] Write TranslationLoader tests in `tests/unit/services/translationLoader.test.ts` (load valid file, handle missing file, validate schema, verify ID references exist in base database)
- [ ] T008 [P] Write TranslationFile validation tests in `tests/unit/models/TerpeneTranslation.test.ts` (valid schema, invalid language code, missing required fields)

### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T009 Create `TranslationLoader` class in `src/services/translationLoader.ts` with `loadTranslations()` method using dynamic import
- [ ] T010 Implement `validateTranslationFile()` method in `src/services/translationLoader.ts` using Zod schema validation
- [ ] T010A Implement runtime ID validation in `src/services/translationLoader.ts` to verify all translation IDs exist in base terpene database
- [ ] T011 Implement `hasTranslationFile()` method in `src/services/translationLoader.ts` to check file existence
- [ ] T012 Run tests and verify all TranslationLoader tests pass

### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T013 Extract file path constants to `src/constants/translationPaths.ts`
- [ ] T014 Add comprehensive error handling with custom error types in `src/services/translationLoader.ts`
- [ ] T015 Add JSDoc comments to all TranslationLoader methods
- [ ] T016 Run tests and verify all still pass after refactoring

**Checkpoint**: Translation loading infrastructure complete - user story implementation can now begin

---

## Phase 3: Foundational - TDD Cycle 2: Translation Cache

**Purpose**: Performance-optimized caching layer for O(1) translation lookup

### RED: Write Tests First (Must FAIL)

- [ ] T017 [P] Write TranslationCache tests in `tests/unit/services/translationCache.test.ts` (store/retrieve by ID, handle non-existent ID, bulk loading, clear cache)

### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T018 Create `TranslationCache` class in `src/services/translationCache.ts` with Map-based storage
- [ ] T019 Implement `set()`, `get()`, `loadBulk()`, `clear()` methods in `src/services/translationCache.ts`
- [ ] T020 Run tests and verify all TranslationCache tests pass

### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T021 Add memory optimization (track size) in `src/services/translationCache.ts`
- [ ] T022 Extract cache configuration to constants
- [ ] T023 Run tests and verify all still pass after refactoring

**Checkpoint**: Translation caching complete - ready for merge logic

---

## Phase 4: User Story 1 (P1) - Core Terpene Information in Native Language 🎯 MVP

**Goal**: Display all terpene content in German when user switches language

**Independent Test**: Switch language to German, verify all terpene names/descriptions/aromas/effects/sources display in German

### TDD Cycle 3: Translation Merging (Core Logic for US1)

#### RED: Write Tests First (Must FAIL)

- [ ] T024 [P] [US1] Write merge tests in `tests/unit/services/translationService.test.ts` (merge German with English base, mark fully translated, handle missing translation, track fallback fields)
- [ ] T025 [P] [US1] Write translation helper tests in `tests/unit/utils/translationHelpers.test.ts` (getTranslatableFields, isArrayField, mergeTerpeneTranslation)

#### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T026 [US1] Create `mergeTerpeneTranslation()` function in `src/utils/translationHelpers.ts` with field-by-field merging logic
- [ ] T027 [US1] Implement translation status calculation (isFullyTranslated, fallbackFields) in `src/utils/translationHelpers.ts`
- [ ] T028 [US1] Create helper functions `getTranslatableFields()` and `isArrayField()` in `src/utils/translationHelpers.ts`
- [ ] T029 [US1] Run tests and verify all merge logic tests pass

#### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T030 [US1] Extract field iteration logic to separate helper function
- [ ] T031 [US1] Improve TypeScript type inference for merged terpenes
- [ ] T032 [US1] Add comprehensive JSDoc comments to all helper functions
- [ ] T033 [US1] Run tests and verify all still pass after refactoring

### TDD Cycle 4: Translation Service Integration (US1)

#### RED: Write Tests First (Must FAIL)

- [ ] T034 [P] [US1] Write TranslationService integration tests in `tests/unit/services/translationService.test.ts` (initialize with German, get translated terpene by ID, switch languages, get all translated terpenes)

#### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T035 [US1] Create `TranslationService` class in `src/services/translationService.ts` integrating loader + cache + merge logic
- [ ] T036 [US1] Implement `initialize()` method in `src/services/translationService.ts` (load translations, build cache)
- [ ] T037 [US1] Implement `getTranslatedTerpene()` method in `src/services/translationService.ts` (lookup from cache, merge with base)
- [ ] T038 [US1] Implement `getAllTranslatedTerpenes()` method in `src/services/translationService.ts`
- [ ] T039 [US1] Implement `switchLanguage()` method in `src/services/translationService.ts` (reload translations, rebuild cache)
- [ ] T040 [US1] Implement `getCurrentLanguage()` and `getSupportedLanguages()` methods in `src/services/translationService.ts`
- [ ] T041 [US1] Run tests and verify all TranslationService tests pass

#### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T042 [US1] Optimize initialization sequence (parallel loading where possible)
- [ ] T043 [US1] Add singleton pattern if multiple instances detected
- [ ] T044 [US1] Add comprehensive error handling for all service methods
- [ ] T045 [US1] Run tests and verify all still pass after refactoring

### TDD Cycle 6: React Hook Integration (US1)

#### RED: Write Tests First (Must FAIL)

- [ ] T046 [P] [US1] Write useTerpeneTranslation hook tests in `tests/unit/hooks/useTerpeneTranslation.test.ts` (provide translated terpene, track loading state, detect fallback fields, switch language)

#### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T047 [US1] Create `useTerpeneTranslation` hook in `src/hooks/useTerpeneTranslation.ts` with TranslationService integration
- [ ] T048 [US1] Implement state management (loading, error, language) in `src/hooks/useTerpeneTranslation.ts`
- [ ] T049 [US1] Implement `getTerpene()`, `getAllTerpenes()`, `getField()` methods in `src/hooks/useTerpeneTranslation.ts`
- [ ] T050 [US1] Implement `isFullyTranslated()`, `getFallbackFields()`, `switchLanguage()` methods in `src/hooks/useTerpeneTranslation.ts`
- [ ] T051 [US1] Run tests and verify all useTerpeneTranslation tests pass

#### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T052 [US1] Optimize re-renders with useMemo for expensive computations
- [ ] T053 [US1] Add error boundary integration in `src/hooks/useTerpeneTranslation.ts`
- [ ] T054 [US1] Improve TypeScript inference for return types
- [ ] T055 [US1] Run tests and verify all still pass after refactoring

### Integration with Existing Components (US1)

- [ ] T056 [US1] Update `useTerpeneData` hook in `src/hooks/useTerpeneData.ts` to use TranslationService for data loading
- [ ] T057 [US1] Update terpene table components to display translated content using `useTerpeneTranslation`
- [ ] T058 [US1] Update sunburst chart component to display translated terpene names
- [ ] T059 [US1] Update terpene detail views to show translated descriptions, aromas, effects, sources

### Integration Tests (US1)

- [ ] T060 [US1] Write integration test in `tests/integration/terpene-translation.test.tsx` (display German translations in terpene card)
- [ ] T061 [US1] Write integration test for language switching in `tests/integration/terpene-translation.test.tsx` (verify content updates without page reload)
- [ ] T062 [US1] Run integration tests and verify US1 complete flow works

### E2E Tests (US1)

- [ ] T063 [US1] Write E2E test in `tests/e2e/bilingual-support.spec.ts` (switch language, verify German content displays)
- [ ] T064 [US1] Write E2E test for terpene detail view in German in `tests/e2e/bilingual-support.spec.ts`
- [ ] T065 [US1] Run E2E tests and verify US1 user journey works end-to-end

**Checkpoint**: User Story 1 complete - German content displays throughout application ✅

---

## Phase 5: User Story 2 (P2) - Fallback to English for Missing Translations

**Goal**: Display English content with visual indicators when German translation is unavailable

**Independent Test**: Add terpene with partial German translation, verify English fields show italic text with "EN" badge

### TDD Cycle 7: UI Components - Fallback Indicators (US2)

#### RED: Write Tests First (Must FAIL)

- [ ] T066 [P] [US2] Write LanguageBadge tests in `tests/unit/components/LanguageBadge.test.tsx` (render language code, proper ARIA label)
- [ ] T067 [P] [US2] Write TranslatedText tests in `tests/unit/components/TranslatedText.test.tsx` (render normal text when not fallback, render italic with badge when fallback)

#### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T068 [US2] Implement `LanguageBadge` component in `src/components/common/LanguageBadge.tsx` with Material UI Chip
- [ ] T069 [US2] Add ARIA labels and accessibility attributes to `LanguageBadge` component
- [ ] T070 [US2] Implement `TranslatedText` component in `src/components/common/TranslatedText.tsx` with conditional italic styling
- [ ] T071 [US2] Integrate `LanguageBadge` into `TranslatedText` component for fallback display
- [ ] T072 [US2] Run tests and verify all component tests pass

#### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T073 [US2] Extract theme-based styling to constants in `src/theme/translationStyles.ts`
- [ ] T074 [US2] Add size variants (small, medium) to LanguageBadge component
- [ ] T075 [US2] Optimize component re-renders with React.memo if needed
- [ ] T076 [US2] Run tests and verify all still pass after refactoring

### Integration with Existing Components (US2)

- [ ] T077 [US2] Wrap all translatable text fields in `TranslatedText` component throughout terpene display components
- [ ] T078 [US2] Pass `isFallback` prop based on `translationStatus.fallbackFields` from useTerpeneTranslation
- [ ] T079 [US2] Update terpene table to show fallback indicators for partially translated entries
- [ ] T080 [US2] Update terpene detail views to show fallback indicators per field

### Integration Tests (US2)

- [ ] T081 [US2] Write integration test in `tests/integration/terpene-translation.test.tsx` (show fallback indicators for partial translations)
- [ ] T082 [US2] Write integration test for fully translated vs partially translated terpenes
- [ ] T083 [US2] Run integration tests and verify US2 fallback behavior works

### E2E Tests (US2)

- [ ] T084 [US2] Write E2E test in `tests/e2e/bilingual-support.spec.ts` (verify EN badge visible on partially translated content)
- [ ] T085 [US2] Run E2E tests and verify US2 user journey works end-to-end

### Accessibility Tests (US2)

#### TDD Cycle 10: Accessibility (US2)

##### RED: Write Tests First (Must FAIL)

- [ ] T086 [P] [US2] Write accessibility tests in `tests/unit/components/accessibility.test.tsx` (no violations in translated content, announce language context to screen readers, 4.5:1 contrast ratio)

##### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T087 [US2] Ensure semantic HTML (`<em>` tag) for italic text in TranslatedText component
- [ ] T088 [US2] Add proper ARIA labels to LanguageBadge component
- [ ] T089 [US2] Verify and fix contrast ratios if accessibility tests fail
- [ ] T090 [US2] Run accessibility tests and verify all pass

##### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T091 [US2] Extract ARIA label generation to helper function
- [ ] T092 [US2] Document accessibility features in component JSDoc
- [ ] T093 [US2] Run accessibility tests and verify all still pass after refactoring

**Checkpoint**: User Story 2 complete - Fallback indicators display accessibly ✅

---

## Phase 6: User Story 3 (P2) - Language-Aware Filtering and Search

**Goal**: Enable search and filtering using German terms with cross-language support

**Independent Test**: Switch to German, search "Zitrus" and "beruhigend", verify correct results

### TDD Cycle 5: Cross-Language Search (US3)

#### RED: Write Tests First (Must FAIL)

- [ ] T094 [P] [US3] Write TranslationSearchService tests in `tests/unit/services/translationSearch.test.ts` (find by German term, find by English term when UI is German, diacritic-insensitive search, equal ranking regardless of language)
- [ ] T095 [P] [US3] Write normalizeDiacritics tests in `tests/unit/utils/translationHelpers.test.ts` (ä→a, ö→o, ü→u, ß→ss)

#### GREEN: Implement Minimal Code (Make tests PASS)

- [ ] T096 [US3] Create `TranslationSearchService` class in `src/services/translationSearch.ts`
- [ ] T097 [US3] Implement `buildSearchIndex()` method in `src/services/translationSearch.ts` (combine English + German terms)
- [ ] T098 [US3] Implement `normalizeDiacritics()` helper in `src/utils/translationHelpers.ts`
- [ ] T099 [US3] Implement `search()` method in `src/services/translationSearch.ts` (case-insensitive, diacritic-insensitive matching)
- [ ] T100 [US3] Implement `searchFields()` method in `src/services/translationSearch.ts` (search specific fields)
- [ ] T101 [US3] Implement `clearIndex()` method in `src/services/translationSearch.ts`
- [ ] T102 [US3] Run tests and verify all search tests pass

#### REFACTOR: Clean Up Code (Keep tests GREEN)

- [ ] T103 [US3] Optimize search performance with early exit strategies
- [ ] T104 [US3] Add caching for frequently searched terms
- [ ] T105 [US3] Extract normalization logic to separate utility module
- [ ] T106 [US3] Run tests and verify all still pass after refactoring

### Integration with Existing Search/Filter Components (US3)

- [ ] T107 [US3] Update search logic in `src/services/filterService.ts` to use `TranslationSearchService`
- [ ] T108 [US3] Update filter components to support German effect names
- [ ] T109 [US3] Integrate search index building into app initialization
- [ ] T110 [US3] Rebuild search index when language switches
- [ ] T111 [US3] Update autocomplete to show suggestions in current language

### Integration Tests (US3)

- [ ] T112 [US3] Write integration test in `tests/integration/terpene-translation.test.tsx` (search with German terms, filter by German effects)
- [ ] T113 [US3] Write integration test for cross-language search (English term while UI is German)
- [ ] T114 [US3] Write integration test for preserving filters when switching language
- [ ] T115 [US3] Run integration tests and verify US3 search/filter behavior works

### E2E Tests (US3)

- [ ] T116 [US3] Write E2E test in `tests/e2e/bilingual-support.spec.ts` (search with German terms, verify results)
- [ ] T117 [US3] Write E2E test for filter with German effect names
- [ ] T118 [US3] Write E2E test for state preservation during language switch
- [ ] T119 [US3] Run E2E tests and verify US3 user journey works end-to-end

**Checkpoint**: User Story 3 complete - Search and filtering work in both languages ✅

---

## Phase 7: User Story 4 (P3) - Maintain Data Structure Efficiency

**Goal**: Ensure data structure minimizes redundancy and supports efficient lookup

**Independent Test**: Review data structure, verify language-independent data exists once, measure lookup performance <50ms

### Data Structure Validation (US4)

- [ ] T120 [P] [US4] Write data structure validation tests in `tests/unit/services/dataValidation.test.ts` (verify single instance of language-independent data, verify translations reference valid IDs, verify partial translations allowed)
- [ ] T121 [P] [US4] Write performance tests in `tests/unit/services/translationService.test.ts` (verify lookup <1ms, merge <50ms for entire dataset)

### Performance Optimization (US4)

- [ ] T122 [US4] Profile translation lookup performance using browser DevTools
- [ ] T123 [US4] Optimize data loading if performance targets not met
- [ ] T124 [US4] Add performance monitoring for translation operations
- [ ] T125 [US4] Run performance tests and verify all targets met

### Data File Size Validation (US4)

- [ ] T126 [US4] Measure German translation file size (target <60KB uncompressed)
- [ ] T127 [US4] Measure total data size increase (target <50% vs English-only)
- [ ] T128 [US4] Optimize translation file if size targets not met (remove redundant whitespace, etc.)

### Developer Workflow Validation (US4)

- [ ] T129 [US4] Add new test terpene with partial German translation to validate workflow
- [ ] T130 [US4] Verify validation script works correctly with new entry
- [ ] T131 [US4] Document workflow in quickstart.md if changes needed

**Checkpoint**: User Story 4 complete - Data structure efficient and performant ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T132 [P] Update i18next configuration in `src/i18n/config.ts` to register `terpeneData` namespace
- [ ] T133 [P] Add German UI translations for new components in `src/i18n/locales/de.json`
- [ ] T134 [P] Update README.md with bilingual support documentation
- [ ] T135 [P] Update CHANGELOG.md with feature summary
- [ ] T136 Add translation file to build output by updating `vite.config.ts` to copy `data/terpene-translations-de.json` to `public/data/`
- [ ] T137 Run full test suite: `pnpm run test:all`
- [ ] T138 Run type checking: `pnpm run type-check`
- [ ] T139 Run linting and formatting: `pnpm run lint:fix && pnpm run format`
- [ ] T140 Run E2E tests on all browsers: `pnpm run test:e2e`
- [ ] T141 Run accessibility audit: `pnpm run test:a11y`
- [ ] T142 Profile bundle size and verify <50KB increase for translation data
- [ ] T143 Measure and log initial data load time in browser, verify <500ms target met (FR-013)
- [ ] T144 Manual testing using quickstart.md validation scenarios
- [ ] T145 Code review prep: verify all TDD cycles documented, tests green, refactoring complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
  - TDD Cycle 1: Translation File Loading (T007-T016)
  - TDD Cycle 2: Translation Cache (T017-T023)
- **User Story 1 (Phase 4)**: Depends on Foundational completion
  - TDD Cycle 3: Translation Merging (T024-T033)
  - TDD Cycle 4: Translation Service (T034-T045)
  - TDD Cycle 6: React Hook (T046-T055)
  - Component Integration (T056-T059)
  - Tests (T060-T065)
- **User Story 2 (Phase 5)**: Depends on US1 completion (needs translation infrastructure)
  - TDD Cycle 7: UI Components (T066-T076)
  - Component Integration (T077-T080)
  - TDD Cycle 10: Accessibility (T086-T093)
  - Tests (T081-T085)
- **User Story 3 (Phase 6)**: Depends on US1 completion (needs translation service)
  - TDD Cycle 5: Search (T094-T106)
  - Component Integration (T107-T111)
  - Tests (T112-T119)
- **User Story 4 (Phase 7)**: Depends on US1, US2, US3 completion (validates entire system)
  - Validation and Optimization (T120-T131)
- **Polish (Phase 8)**: Depends on all user stories

### TDD Cycle Flow (Critical for All Phases)

**EVERY cycle MUST follow this order**:
1. **RED**: Write failing tests FIRST
2. **GREEN**: Implement minimal code to make tests PASS
3. **REFACTOR**: Clean up code while keeping tests GREEN
4. **VERIFY**: Run all tests to ensure nothing broke

### Within Each User Story

- Tests MUST be written first and FAIL before implementation (RED phase)
- Unit tests before integration tests before E2E tests
- Core service layer before component integration
- Story complete and tested before moving to next priority

### Parallel Opportunities

- **Phase 1 Setup**: All tasks marked [P] can run in parallel (T002, T003, T004, T005, T006)
- **Phase 2 Foundational**: Test writing within each TDD cycle can be parallelized (T007-T008, T017)
- **Phase 4 US1**: Test writing can be parallelized (T024-T025, T034, T046)
- **Phase 5 US2**: Test writing can be parallelized (T066-T067, T086)
- **Phase 6 US3**: Test writing can be parallelized (T094-T095)
- **Phase 7 US4**: Performance tests can run in parallel (T120-T121)
- **Phase 8 Polish**: Documentation tasks can run in parallel (T132-T135)

### Strict TDD Workflow Per Cycle

```
Example: TDD Cycle 3 (Translation Merging)

1. RED Phase:
   - T024: Write merge tests (MUST FAIL)
   - T025: Write helper tests (MUST FAIL)
   - Verify: Run tests, confirm failures

2. GREEN Phase:
   - T026: Implement mergeTerpeneTranslation
   - T027: Implement status calculation
   - T028: Implement helper functions
   - T029: Run tests (MUST PASS)
   - Verify: All tests green

3. REFACTOR Phase:
   - T030: Extract field iteration
   - T031: Improve type inference
   - T032: Add JSDoc
   - T033: Run tests (MUST STAY GREEN)
   - Verify: All tests still green
```

---

## Parallel Example: User Story 1

```bash
# TDD Cycle 3 - RED Phase (can run in parallel):
Task T024: "Write merge tests in tests/unit/services/translationService.test.ts"
Task T025: "Write helper tests in tests/unit/utils/translationHelpers.test.ts"

# TDD Cycle 4 - RED Phase:
Task T034: "Write TranslationService integration tests"

# TDD Cycle 6 - RED Phase:
Task T046: "Write useTerpeneTranslation hook tests"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - TDD Foundation

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (TDD Cycles 1-2)
   - **CRITICAL**: Each cycle MUST complete RED → GREEN → REFACTOR
   - Verify all foundational tests are GREEN before proceeding
3. Complete Phase 4: User Story 1 (TDD Cycles 3-4-6)
   - Each cycle: Write tests FIRST (RED), implement (GREEN), refactor (REFACTOR)
   - Verify all US1 tests are GREEN
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### TDD Quality Gates

**After Each TDD Cycle**:
- ✅ All tests written in RED phase exist and initially failed
- ✅ All tests pass in GREEN phase
- ✅ All tests remain passing after REFACTOR phase
- ✅ No tests skipped or disabled
- ✅ Code coverage meets targets (80%+ for critical paths)

**After Each User Story**:
- ✅ All story tests passing (unit + integration + E2E)
- ✅ Accessibility tests passing (vitest-axe)
- ✅ Independent test criteria verified
- ✅ No regressions in previous stories

### Incremental Delivery (TDD-Driven)

1. Complete Setup + Foundational (TDD Cycles 1-2) → Foundation ready, tests GREEN
2. Add User Story 1 (TDD Cycles 3-4-6) → Test independently → All tests GREEN → Deploy/Demo (MVP!)
3. Add User Story 2 (TDD Cycle 7 + 10) → Test independently → All tests GREEN → Deploy/Demo
4. Add User Story 3 (TDD Cycle 5) → Test independently → All tests GREEN → Deploy/Demo
5. Add User Story 4 (Validation) → Test independently → All tests GREEN → Deploy/Demo
6. Each story adds value without breaking previous stories (test suite verifies)

### Parallel Team Strategy (TDD-Aware)

With multiple developers:

1. Team completes Setup + Foundational together (TDD Cycles 1-2)
   - Pair programming on TDD cycles recommended for alignment
2. Once Foundational is done (all tests GREEN):
   - **Developer A**: User Story 1 (TDD Cycles 3-4-6)
   - **Developer B**: User Story 2 (TDD Cycles 7 + 10) - waits for US1 foundation
   - **Developer C**: User Story 3 (TDD Cycle 5) - waits for US1 foundation
3. Each developer follows RED → GREEN → REFACTOR strictly
4. Stories complete independently with test suites GREEN

---

## Notes

- **TDD is MANDATORY**: All code must have tests written FIRST (RED phase)
- **Test Failures are REQUIRED**: Tests must fail before implementation (RED phase)
- **Tests Must Pass**: Implementation must make all tests pass (GREEN phase)
- **Refactoring is SAFE**: Tests enable confident code improvements (REFACTOR phase)
- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each TDD cycle (RED-GREEN-REFACTOR) or logical group
- Stop at any checkpoint to validate story independently
- **Never skip RED phase** - tests define behavior before implementation
- **Never skip REFACTOR phase** - code quality matters
- **Test suite is documentation** - tests describe exact expected behavior

---

## Test Coverage Targets

| Layer | Target | Phase Responsible |
|-------|--------|-------------------|
| Translation Service | 95%+ | Phase 2, Phase 4 (TDD Cycles 1-4) |
| React Hooks | 90%+ | Phase 4 (TDD Cycle 6) |
| UI Components | 85%+ | Phase 5 (TDD Cycle 7) |
| Integration Tests | Key flows | Phases 4-6 (per user story) |
| E2E Tests | Happy paths | Phases 4-6 (per user story) |
| Accessibility | 100% | Phase 5 (TDD Cycle 10) |

**Total Tasks**: 145  
**TDD Cycles**: 10 cycles across all phases  
**User Stories**: 4 stories (US1-P1, US2-P2, US3-P2, US4-P3)  
**Parallel Opportunities**: 20+ parallelizable tasks marked [P]  
**MVP Scope**: Phase 1 + Phase 2 + Phase 4 (User Story 1) = 66 tasks  

**Test-First Development**: 100% of implementation code follows RED → GREEN → REFACTOR
