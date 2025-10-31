# Tasks: Table Filter Bar Extension

**Feature Branch**: `005-table-filter-bar`  
**Input**: Design documents from `/specs/005-table-filter-bar/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Following TDD protocol (RED-GREEN-REFACTOR) as specified in user requirements. All test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US6)
- Include exact file paths in descriptions

## Path Conventions

Single-page web application structure:
- Source: `src/` at repository root
- Tests: `tests/` at repository root
- Translations: `src/i18n/locales/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project environment and establish baseline

**Note**: This is an extension feature - project already initialized, dependencies already installed

- [ ] T001 Verify current branch is `005-table-filter-bar` and project builds successfully
- [ ] T002 Run existing test suite to establish baseline (`pnpm vitest --run`)
- [ ] T003 Verify dev server starts and current filter works (`pnpm dev`)
- [ ] T004 Document current filter behavior as baseline for backward compatibility testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure needed before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Add filter service constants (MIN_SEARCH_LENGTH=2, MAX_SEARCH_LENGTH=100) to `src/services/filterService.ts`
- [ ] T006 [P] Verify Terpene model includes optional `taste` and `therapeuticProperties` fields in `src/models/Terpene.ts`
- [ ] T007 [P] Document current SearchBar location (in header vs filter area) in `src/pages/Home.tsx` or `src/components/layout/Header.tsx`
- [ ] T008 [P] Verify SearchBar has visible label or document that Material UI TextField provides implicit labeling via placeholder
- [ ] T009 [P] Verify `sanitizeSearchQuery()` utility handles special characters and prevents XSS in `src/utils/sanitize.ts`
- [ ] T010 [P] Implement 2-character minimum check in `applyEffectFilters()` in `src/services/filterService.ts`
- [ ] T011 [P] Add test for 1-character query (no filtering applied, all results visible) in `tests/unit/services/filterService.test.ts`
- [ ] T012 [P] Add test for 2-character query (filtering applied) in `tests/unit/services/filterService.test.ts`
- [ ] T013 [P] Review existing `matchesSearchQuery()` function in `src/services/filterService.ts` for extension points
- [ ] T014 [P] Review existing `applyEffectFilters()` function in `src/services/filterService.ts` (after 2-char minimum added)
- [ ] T015 [P] Add logging functionality for filter operations (query terms, results count, performance metrics) to `src/services/filterService.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 2.5: Bilingual Support Implementation

**Purpose**: Implement bilingual search capabilities and special character support

**⚠️ CRITICAL**: This phase must complete before US2-5 can be fully validated

- [ ] T016 [P] Update `matchesSearchQuery()` in `src/services/filterService.ts` to integrate with translation service (FR-025, FR-026)
- [ ] T017 [P] Implement special character handling for both English and German (FR-033) in `src/services/filterService.ts`
- [ ] T018 [P] Add translation service performance check (must complete within 50ms) in `src/services/filterService.ts`
- [ ] T019 [P] Add graceful degradation fallback to English-only search when translation service fails (FR-031)
- [ ] T020 [P] Add test for cross-language search (English term -> German results) in `tests/unit/services/filterService.test.ts`
- [ ] T021 [P] Add test for special character search in `tests/unit/services/filterService.test.ts`
- [ ] T022 [P] Add test for translation service failure handling in `tests/unit/services/filterService.test.ts`
- [ ] T023 [P] Add logic to persist active filters and reapply them when user switches languages (FR-032)

**Checkpoint**: Bilingual functionality implemented and tested

---

## Phase 3: User Story 1 - Maintain Existing Name Filtering (Priority: P1) 🎯 MVP

**Goal**: Ensure backward compatibility - existing name filtering continues to work exactly as before

**Independent Test**: Load page, type "linalool" in filter bar, verify only matching rows visible (existing behavior preserved)

### Tests for User Story 1 (TDD RED Phase)

> **RED PHASE**: Write failing tests first, ensure they FAIL before implementation

- [ ] T024 [P] [US1] Add regression test for name filtering in `tests/unit/services/filterService.test.ts`
- [ ] T025 [P] [US1] Add regression test for partial name matching ("lina" matches "linalool") in `tests/unit/services/filterService.test.ts`
- [ ] T026 [P] [US1] Add regression test for case-insensitive name search in `tests/unit/services/filterService.test.ts`
- [ ] T027 [P] [US1] Add regression test for empty filter shows all results in `tests/unit/services/filterService.test.ts`
- [ ] T028 [US1] Run tests - verify they PASS (baseline behavior already working)

### Implementation for User Story 1 (GREEN Phase)

**Note**: User Story 1 is about preserving existing behavior - minimal code changes

- [ ] T029 [US1] Document existing `matchesSearchQuery()` name search logic with JSDoc comments in `src/services/filterService.ts`
- [ ] T030 [US1] Verify no regressions by running all existing filter tests (`pnpm vitest tests/unit/services/filterService.test.ts --run`)

### Refactor for User Story 1 (REFACTOR Phase)

- [ ] T031 [US1] Extract name search logic into clear variable for readability in `src/services/filterService.ts`
- [ ] T032 [US1] Re-run tests to ensure refactoring didn't break functionality

**Checkpoint**: User Story 1 complete - existing name filtering verified and protected by tests

---

## Phase 4: User Story 2 - Maintain Filtering for Effects (Priority: P1)

**Goal**: Verify that existing effect filtering continues to work (effects already searched in current implementation)

**Independent Test**: Type "relaxing" in filter bar, verify terpenes with "relaxing" effect remain visible

**Note**: Effects filtering already exists in current implementation - this story verifies and extends test coverage

### Tests for User Story 2 (TDD RED Phase)

- [ ] T033 [P] [US2] Add test for effect filtering ("relaxing" matches terpene with relaxing effect) in `tests/unit/services/filterService.test.ts`
- [ ] T034 [P] [US2] Add test for partial effect matching ("energ" matches "energizing") in `tests/unit/services/filterService.test.ts`
- [ ] T035 [P] [US2] Add test for multi-attribute match (query matches both name AND effect) in `tests/unit/services/filterService.test.ts`
- [ ] T036 [US2] Run tests - verify they PASS (effects already searched in current implementation)

### Implementation for User Story 2 (GREEN Phase)

- [ ] T037 [US2] Document existing effects search logic in `matchesSearchQuery()` with JSDoc in `src/services/filterService.ts`
- [ ] T038 [US2] Verify effects array search handles empty arrays gracefully in `src/services/filterService.ts`

### Integration for User Story 2

- [ ] T039 [US2] Add integration test for combined name + effect filtering in `tests/integration/filter-flow.test.ts`
- [ ] T040 [US2] Run integration tests to verify User Story 1 + User Story 2 work together

**Checkpoint**: User Stories 1 and 2 complete and independently testable

---

## Phase 5: User Story 3 - Maintain Filtering for Aroma (Priority: P2)

**Goal**: Verify that existing aroma filtering continues to work (aroma already searched in current implementation)

**Independent Test**: Type "citrus" in filter bar, verify terpenes with citrus aroma remain visible

**Note**: Aroma filtering already exists - verify and document

### Tests for User Story 3 (TDD RED Phase)

- [ ] T041 [P] [US3] Add test for aroma filtering ("citrus" matches terpene with citrus aroma) in `tests/unit/services/filterService.test.ts`
- [ ] T042 [P] [US3] Add test for partial aroma matching ("flor" matches "floral") in `tests/unit/services/filterService.test.ts`
- [ ] T043 [P] [US3] Add test for multi-attribute match (query matches name, effect, AND aroma) in `tests/unit/services/filterService.test.ts`
- [ ] T044 [US3] Run tests - verify they PASS (aroma already searched in current implementation)

### Implementation for User Story 3 (GREEN Phase)

- [ ] T045 [US3] Document existing aroma search logic in `matchesSearchQuery()` with JSDoc in `src/services/filterService.ts`
- [ ] T046 [US3] Verify aroma string search handles different delimiters (comma, space) in `src/services/filterService.ts`

### Integration for User Story 3

- [ ] T047 [US3] Add integration test for name + effect + aroma filtering in `tests/integration/filter-flow.test.ts`

**Checkpoint**: User Stories 1, 2, and 3 complete and independently testable

---

## Phase 6: User Story 4 - Extend Filtering to Include Taste (Priority: P2)

**Goal**: Extend filter to search taste field (NEW capability - first actual extension)

**Independent Test**: Type "sweet" in filter bar, verify terpenes with sweet taste remain visible

### Tests for User Story 4 (TDD RED Phase)

- [ ] T048 [P] [US4] Add test for taste filtering ("sweet" matches terpene.taste) in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T049 [P] [US4] Add test for partial taste matching ("bit" matches "bitter") in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T050 [P] [US4] Add test for undefined taste field (graceful handling) in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T051 [P] [US4] Add test for empty taste string in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T052 [US4] Run tests - verify they FAIL (taste not yet searched)

### Implementation for User Story 4 (GREEN Phase)

- [ ] T053 [US4] Extend `matchesSearchQuery()` to search `taste` field with null-safety (`|| ''`) in `src/services/filterService.ts`
- [ ] T054 [US4] Add JSDoc comment documenting taste search in `matchesSearchQuery()` in `src/services/filterService.ts`
- [ ] T055 [US4] Run tests - verify they NOW PASS

### Refactor for User Story 4 (REFACTOR Phase)

- [ ] T056 [US4] Review string normalization logic for consistency across all fields in `src/services/filterService.ts`
- [ ] T057 [US4] Re-run all tests to ensure refactoring didn't break anything

### Integration for User Story 4

- [ ] T058 [US4] Add integration test for name + effect + aroma + taste filtering in `tests/integration/filter-flow.test.ts`
- [ ] T059 [US4] Manual test in browser: type "sweet", verify results

**Checkpoint**: User Stories 1-4 complete - taste filtering now works

---

## Phase 7: User Story 5 - Extend Filtering to Include Therapeutic Properties (Priority: P2)

**Goal**: Extend filter to search therapeuticProperties array (NEW capability - completes multi-attribute search)

**Independent Test**: Type "anti-inflammatory" in filter bar, verify matching terpenes visible

### Tests for User Story 5 (TDD RED Phase)

- [ ] T060 [P] [US5] Add test for therapeutic property filtering ("anti-inflammatory" matches) in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T061 [P] [US5] Add test for partial therapeutic matching ("anti" matches "anti-inflammatory") in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T062 [P] [US5] Add test for undefined therapeuticProperties array (graceful handling) in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T063 [P] [US5] Add test for empty therapeuticProperties array in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T064 [P] [US5] Add test for medical terminology (scientific vs common names) in `tests/unit/services/filterService.test.ts` - SHOULD FAIL
- [ ] T065 [US5] Run tests - verify they FAIL (therapeuticProperties not yet searched)

### Implementation for User Story 5 (GREEN Phase)

- [ ] T066 [US5] Extend `matchesSearchQuery()` to search `therapeuticProperties` array with null-safety (`|| []`) in `src/services/filterService.ts`
- [ ] T067 [US5] Map therapeuticProperties array to lowercase and join for searching in `src/services/filterService.ts`
- [ ] T068 [US5] Add JSDoc comment documenting all 5 searchable attributes in `matchesSearchQuery()` in `src/services/filterService.ts`
- [ ] T069 [US5] Run tests - verify they NOW PASS

### Refactor for User Story 5 (REFACTOR Phase)

- [ ] T070 [US5] Consider extracting array normalization to helper function if duplicated in `src/services/filterService.ts`
- [ ] T071 [US5] Verify OR logic is clear: returns true if ANY attribute matches in `src/services/filterService.ts`
- [ ] T072 [US5] Re-run all tests to ensure refactoring didn't break anything

### Integration for User Story 5

- [ ] T073 [US5] Add integration test for all 5 attributes (name + effect + aroma + taste + therapeutic) in `tests/integration/filter-flow.test.ts`
- [ ] T074 [US5] Manual test in browser: type "anti-inflammatory", verify results

**Checkpoint**: User Stories 1-5 complete - all attribute filtering now works

---

## Phase 8: User Story 6 - Improve Filter Bar Location and Label (Priority: P1)

**Goal**: Update filter bar UI with clear labeling and updated placeholder text reflecting all searchable attributes

**Independent Test**: Load page, visually confirm filter bar in filter area, read placeholder text showing all attributes

### Tests for User Story 6 (TDD RED Phase)

- [ ] T075 [P] [US6] Add test for 100-character maxLength enforcement in SearchBar in `tests/unit/components/SearchBar.test.tsx` - SHOULD FAIL
- [ ] T076 [P] [US6] Add test for paste truncation (>100 chars → 100 chars) in `tests/unit/components/SearchBar.test.tsx` - SHOULD FAIL
- [ ] T077 [P] [US6] Add test for updated placeholder text (contains "taste" and "therapeutic") in `tests/unit/components/SearchBar.test.tsx` - SHOULD FAIL
- [ ] T078 [P] [US6] Add test for updated ARIA label (multi-attribute filtering) in `tests/unit/components/SearchBar.test.tsx` - SHOULD FAIL
- [ ] T079 [P] [US6] Add test for filter bar in filter area (not header) in `tests/unit/components/Home.test.tsx` - SHOULD PASS
- [ ] T080 [US6] Run tests - verify they FAIL (UI not yet updated)

### Implementation for User Story 6 (GREEN Phase)

- [ ] T081 [P] [US6] Update English placeholder text in `src/i18n/locales/en/translation.json` to "Filter terpenes by name, effect, aroma, taste, therapeutic properties..."
- [ ] T082 [P] [US6] Update German placeholder text in `src/i18n/locales/de/translation.json` to "Terpene nach Name, Effekt, Aroma, Geschmack, therapeutischen Eigenschaften filtern..."
- [ ] T083 [P] [US6] Update English ARIA label in `src/i18n/locales/en/translation.json` to "Filter terpenes by multiple attributes"
- [ ] T084 [P] [US6] Update German ARIA label in `src/i18n/locales/de/translation.json` to "Terpene nach mehreren Attributen filtern"
- [ ] T085 [P] [US6] Add `maxLength={100}` prop to SearchBar component usage in `src/pages/Home.tsx`
- [ ] T086 [US6] Verify SearchBar location per T007 documentation, relocate if needed in `src/pages/Home.tsx`
- [ ] T087 [US6] Run tests - verify they NOW PASS

### Integration for User Story 6

- [ ] T088 [US6] Restart dev server to reload i18next translations (`pnpm dev`)
- [ ] T089 [US6] Manual test: verify placeholder text updated in English
- [ ] T090 [US6] Manual test: switch to German, verify placeholder updated
- [ ] T091 [US6] Manual test: try pasting 150 characters, verify truncated to 100
- [ ] T092 [US6] Manual test: verify filter bar location in filter area (not header)

**Checkpoint**: User Story 6 complete - UI updated with proper labeling and constraints

---

## Phase 9: Cross-Story Feature - Empty State Message

**Goal**: Update empty state message to "No match found for your filter" when no results

**Independent Test**: Type "xyzabc123" (nonexistent), verify empty state shows correct message

### Tests for Empty State (TDD RED Phase)

- [ ] T093 [P] Add test for empty state message when no matches in `tests/unit/components/TerpeneTable.test.tsx` or verify existing
- [ ] T094 Add integration test for filter with no results in `tests/integration/filter-flow.test.ts`

### Implementation for Empty State (GREEN Phase)

- [ ] T095 Verify TerpeneTable empty state uses translation key in `src/components/visualizations/TerpeneTable.tsx`
- [ ] T096 Update or verify "No match found for your filter" message in translation files if needed
- [ ] T097 Manual test: type nonexistent term, verify message displays

**Checkpoint**: Empty state message verified or updated

---

## Phase 10: E2E Tests (End-to-End Validation)

**Goal**: Validate complete user journeys with Playwright E2E tests

- [ ] T098 [P] Add E2E test for name filtering in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T099 [P] Add E2E test for effect filtering in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T100 [P] Add E2E test for taste filtering in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T101 [P] Add E2E test for therapeutic property filtering in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T102 [P] Add E2E test for 1-character input (no filtering) in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T103 [P] Add E2E test for 2-character input (filtering activates) in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T104 [P] Add E2E test for 100-character maximum in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T105 [P] Add E2E test for placeholder text visibility in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T106 [P] Add E2E test for combined filters (search + effect categories) in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T107 [P] Add E2E test for bilingual search functionality in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T108 [P] Add E2E test for special character search in `tests/e2e/filter-terpenes.spec.ts`
- [ ] T109 Run all E2E tests: `pnpm playwright test`

**Checkpoint**: All E2E tests pass - complete user journeys validated

---

## Phase 11: Polish & Validation

**Purpose**: Final validation, documentation, and cleanup

- [ ] T110 Run full test suite: `pnpm vitest --run` - verify all tests pass
- [ ] T111 Run type checking: `pnpm run type-check` - verify no errors
- [ ] T112 Run linting: `pnpm run lint` - verify no errors (or fix any issues)
- [ ] T113 Run build: `pnpm run build` - verify successful build
- [ ] T114 Test accessibility with keyboard: Tab to filter, type, clear with keyboard
- [ ] T115 Test screen reader: Verify ARIA labels and results count announced
- [ ] T116 Add automated performance benchmark test in `tests/unit/services/filterService.test.ts` (measure filter operation time for 200 terpenes)
- [ ] T117 Performance test: Filter 200 terpenes manually, verify <100ms filter operation time (400ms total with debounce)
- [ ] T118 [P] Update CHANGELOG.md with feature changes
- [ ] T119 [P] Verify quickstart.md steps still accurate
- [ ] T120 [P] Add code comments for future maintainers in modified files
- [ ] T121 Final manual test: Complete workflow from quickstart.md
- [ ] T122 Compare against spec.md acceptance criteria - verify all met
- [ ] T123 Git commit with conventional commit message: "feat(filter): extend multi-attribute search with taste and therapeutic properties"

**Checkpoint**: Feature complete, tested, and ready for PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories (includes 2-char minimum implementation)
- **Bilingual Support (Phase 2.5)**: Depends on Foundational - BLOCKS US2-5 full validation
- **User Story 1 (Phase 3)**: Depends on Foundational - Can start independently
- **User Story 2 (Phase 4)**: Depends on Foundational - Can run parallel with US1 (different focus)
- **User Story 3 (Phase 5)**: Depends on Foundational - Can run parallel with US1-2
- **User Story 4 (Phase 6)**: Depends on Foundational - Can run parallel with US1-3, US5-6
- **User Story 5 (Phase 7)**: Depends on Foundational - Can run parallel with US1-4, US6
- **User Story 6 (Phase 8)**: Depends on Foundational - Can run parallel with US1-5
- **Empty State (Phase 9)**: Depends on US1-5 completion
- **E2E Tests (Phase 10)**: After all user stories implemented
- **Polish (Phase 11)**: After all other phases complete

### User Story Dependencies

All user stories (US1-US6) are **independently implementable** after Foundational phase:

- **US1 (Maintain Name Filtering)**: No dependencies - baseline behavior
- **US2 (Extend to Effects)**: No dependencies beyond foundational (extends existing function)
- **US3 (Extend to Aroma)**: No dependencies beyond foundational (extends existing function)
- **US4 (Extend to Taste)**: No dependencies beyond foundational (extends existing function) - First true extension
- **US5 (Extend to Therapeutic)**: No dependencies beyond foundational (extends existing function) - Completes multi-attribute
- **US6 (UI Improvements)**: No dependencies beyond foundational (touches only UI/translations)

### Within Each User Story (TDD Protocol)

**RED Phase** → **GREEN Phase** → **REFACTOR Phase**:

1. **Tests FIRST** (write failing tests)
2. **Verify tests FAIL** (if new capability) or PASS (if existing behavior)
3. **Implement minimum code** to make tests pass
4. **Verify tests PASS**
5. **Refactor** for quality (extract helpers, add comments)
6. **Re-run tests** to ensure refactoring didn't break anything

### Parallel Opportunities

**Within Foundational Phase (Phase 2)**:
- T005-T009 [P] can all run in parallel (constants, verification, documentation tasks)
- T010-T012 [P] can run in parallel (2-char minimum implementation and tests)

**Within Each User Story's Test Phase**:
- All [P] test tasks can run in parallel (different test cases, same file)

**User Stories Can Run in Parallel** (if team capacity allows):
- After Foundational complete, US1-US6 can be assigned to different developers
- Each developer follows TDD protocol for their story
- Stories merge independently

**Within E2E Phase (Phase 10)**:
- All E2E test tasks (T098-T108) marked [P] can run in parallel

**Within Polish Phase (Phase 11)**:
- T118 [P], T119 [P], T120 [P] can run in parallel

---

## Parallel Example: User Story 4 (Taste Filtering)

```bash
# RED Phase - Launch all test tasks together:
Task: "[P] [US4] Add test for taste filtering in tests/unit/services/filterService.test.ts"
Task: "[P] [US4] Add test for partial taste matching in tests/unit/services/filterService.test.ts"
Task: "[P] [US4] Add test for undefined taste field in tests/unit/services/filterService.test.ts"
Task: "[P] [US4] Add test for empty taste string in tests/unit/services/filterService.test.ts"

# GREEN Phase - Sequential implementation:
Task: "[US4] Extend matchesSearchQuery() to search taste field"
Task: "[US4] Add JSDoc comment documenting taste search"
Task: "[US4] Run tests - verify they NOW PASS"

# REFACTOR Phase - Sequential cleanup:
Task: "[US4] Review string normalization logic"
Task: "[US4] Re-run all tests"
```

---

## Parallel Example: User Story 6 (UI Updates)

```bash
# After tests written, launch all translation updates in parallel:
Task: "[P] [US6] Update English placeholder text in src/i18n/locales/en/translation.json"
Task: "[P] [US6] Update German placeholder text in src/i18n/locales/de/translation.json"
Task: "[P] [US6] Update English ARIA label in src/i18n/locales/en/translation.json"
Task: "[P] [US6] Update German ARIA label in src/i18n/locales/de/translation.json"

# Then sequential UI integration:
Task: "[US6] Add maxLength={100} prop to SearchBar in src/pages/Home.tsx"
Task: "[US6] Verify SearchBar location in src/pages/Home.tsx"
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

**Fastest Path to Value**:
1. ✅ Phase 1: Setup (verify environment)
2. ✅ Phase 2: Foundational (add constants, verify data model, implement 2-char minimum)
3. ✅ Phase 2.5: Bilingual Support (implement translation service integration)
4. ✅ Phase 3: User Story 1 (maintain name filtering - backward compatibility)
5. ✅ Phase 4: User Story 2 (maintain effect filtering - verify existing behavior)
6. ✅ Phase 8: User Story 6 (UI improvements - update placeholder, maxLength)
7. ✅ **STOP and VALIDATE**: Test MVP - name + effect filtering with improved UI and 2-char minimum
8. ✅ Deploy/Demo MVP if ready

**MVP Scope**: Just P1 stories (US1, US2, US6) + Foundational + Bilingual Support = ~60 tasks

### Full Feature (All Stories)

**Complete Implementation**:
1. Complete MVP (Phases 1-4, 8) with 2-char minimum in Phase 2
2. Add User Story 3: Aroma (Phase 5) - verify existing behavior
3. Add User Story 4: Taste (Phase 6) - **first true extension**
4. Add User Story 5: Therapeutic Properties (Phase 7) - complete multi-attribute
5. Add Empty State Message (Phase 9)
6. Add E2E Tests (Phase 10)
7. Polish & Validate (Phase 11)

**Full Scope**: All 123 tasks

### Incremental Delivery

**Deliver Value Early and Often**:
1. **Sprint 1**: Setup + Foundational + Bilingual (includes 2-char min) + US1 + US2 → Deploy (MVP with name+effect filtering)
2. **Sprint 2**: US6 (UI improvements) → Deploy (improved placeholder and labels)
3. **Sprint 3**: US4 (Taste) → Deploy (first new attribute)
4. **Sprint 4**: US5 (Therapeutic) → Deploy (complete multi-attribute)
5. **Sprint 5**: US3 (Aroma verify) + Empty State + E2E + Polish → Deploy (full feature)

Each sprint delivers testable, deployable value.

### Parallel Team Strategy

**With 3 Developers After Foundational Phase**:

- **Developer A**: 
  - Phase 3: User Story 1 (Maintain Name)
  - Phase 4: User Story 2 (Extend Effects)
  
- **Developer B**:
  - Phase 6: User Story 4 (Extend Taste) ← First true extension
  - Phase 7: User Story 5 (Extend Therapeutic)
  
- **Developer C**:
  - Phase 8: User Story 6 (UI Improvements)
  - Phase 9: Empty State Message

All converge for Phase 10 (E2E Tests) and Phase 11 (Polish).

---

## Task Count Summary

- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 11 tasks (includes 2-char minimum + verification tasks)
- **Phase 2.5 (Bilingual Support)**: 8 tasks (bilingual functionality)
- **Phase 3 (US1 - Name)**: 9 tasks
- **Phase 4 (US2 - Effects)**: 8 tasks
- **Phase 5 (US3 - Aroma)**: 7 tasks
- **Phase 6 (US4 - Taste)**: 12 tasks
- **Phase 7 (US5 - Therapeutic)**: 15 tasks
- **Phase 8 (US6 - UI)**: 17 tasks
- **Phase 9 (Empty State)**: 5 tasks
- **Phase 10 (E2E Tests)**: 12 tasks
- **Phase 11 (Polish)**: 14 tasks (includes automated performance test)

**Total**: 122 tasks

**MVP Tasks** (P1 stories only): ~59 tasks (Phases 1-4, 8, 11)

**Parallel Tasks**: 52 tasks marked [P] (42% can run in parallel)

---

## Notes

- **[P] tasks** = different files, no dependencies - can run in parallel
- **[Story] label** maps task to specific user story for traceability
- **TDD Protocol**: RED (failing tests) → GREEN (minimal implementation) → REFACTOR (quality)
- **Each user story** should be independently completable and testable
- **Verify tests fail** before implementing (RED phase validation)
- **Stop at any checkpoint** to validate story independently
- **Manual tests complement automated tests** - both are important
- **Backward compatibility** is critical - US1-3 verify existing behavior works

---

## Quick Reference: Critical Paths

### Fastest MVP (P1 Only)

Setup → Foundational → Bilingual Support → US1 → US2 → US6 → Polish → **DONE** (~59 tasks)

### Full Feature

MVP → US3 → US4 → US5 → Empty State → E2E Tests → Final Polish → **DONE** (122 tasks)

### Highest Value Tasks (Must Complete)

1. T005-T015: Foundational setup (includes 2-char min, logging, bilingual infrastructure)
2. T016-T023: Bilingual support implementation
3. T024-T032: US1 backward compatibility
4. T033-T040: US2 effects filtering
5. T053-T059: US4 taste filtering ← **First true extension**
6. T066-T074: US5 therapeutic filtering ← **Completes multi-attribute**
7. T081-T092: US6 UI updates ← **User-facing improvements**
