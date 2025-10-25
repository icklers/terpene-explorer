# Tasks: Enhanced Terpene Data Model with Detailed Info Display

**Input**: Design documents from `/specs/002-terpene-data-model/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/data-service.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are included below for completeness but marked as OPTIONAL. Implementation-first approach is recommended.

**Organization**: Tasks are grouped by user story (US1, US2, US3) to enable independent implementation and testing of each story.

**Clarifications Applied**:
- Detail view updates content in place (controlled modal pattern)
- Validation error: "Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues"

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a frontend-only web application with `src/` at repository root per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies are ready

- [X] T001 Verify Node.js 24+ and pnpm 10+ are installed
- [X] T002 [P] Verify all dependencies are installed: `pnpm install`
- [X] T003 [P] Verify TypeScript compilation works: `pnpm type-check`
- [X] T004 [P] Verify linting passes: `pnpm lint`
- [X] T005 [P] (DON'T EXECUTE, Unit Tests broken) Verify existing tests pass: `pnpm test:run`

**Checkpoint**: Development environment is ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create Zod schema for terpene-database.json in src/utils/terpeneSchema.ts
- [X] T007 [P] Update TypeScript type definitions in src/types/terpene.ts to export Zod-inferred types
- [X] T008 Create data service with validation in src/services/terpeneData.ts (loadTerpeneDatabase function)
- [X] T009 [P] Add i18n translation files: src/i18n/locales/en/terpene-details.json with field labels and error message
- [X] T010 [P] Add i18n translation files: src/i18n/locales/de/terpene-details.json with field labels and error message
- [X] T011 Create React hook for data loading in src/hooks/useTerpeneDatabase.ts (new hook to avoid breaking existing functionality)

**Checkpoint**: Foundation ready - data can be loaded and validated. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View Detailed Terpene Information (Priority: P1) 🎯 MVP

**Goal**: Users can click any terpene row to view comprehensive detail information in a modal that displays effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, and sources

**Independent Test**: Click any terpene row in table → Modal opens → Verify all 7 fields display in correct order → Close modal → Modal dismisses. Test rapid clicks on different rows → Content updates in place without close/reopen.

### Tests for User Story 1 (OPTIONAL ⚠️)

> **NOTE**: Tests are NOT required by spec. If implementing tests, write them FIRST and ensure they FAIL before implementation.

- [ ] T012 [P] [US1] OPTIONAL: Unit test for TerpeneDetailModal component rendering in tests/unit/components/TerpeneDetailModal.test.tsx
- [ ] T013 [P] [US1] OPTIONAL: Unit test for modal controlled component behavior (prop changes) in tests/unit/components/TerpeneDetailModal.test.tsx
- [ ] T014 [P] [US1] OPTIONAL: Integration test for table click → modal flow in tests/integration/terpene-workflow.test.tsx
- [ ] T015 [P] [US1] OPTIONAL: Integration test for rapid row clicks (in-place updates) in tests/integration/terpene-workflow.test.tsx
- [ ] T016 [P] [US1] OPTIONAL: E2E test for complete user journey in tests/e2e/terpene-details.spec.ts
- [ ] T017 [P] [US1] OPTIONAL: Accessibility test with vitest-axe for modal in tests/unit/components/TerpeneDetailModal.test.tsx

### Implementation for User Story 1

- [X] T018 [P] [US1] Create TerpeneDetailModal controlled component in src/components/visualizations/TerpeneDetailModal.tsx with all 7 fields in specified order
- [X] T019 [P] [US1] Update TerpeneTable component to add onClick handler to rows in src/components/visualizations/TerpeneTable.tsx
- [X] T020 [US1] Add state management for selected terpene and modal open state in src/components/visualizations/TerpeneTable.tsx
- [X] T021 [US1] Add keyboard navigation support (Enter/Space keys) to table rows in src/components/visualizations/TerpeneTable.tsx
- [X] T022 [US1] Integrate TerpeneDetailModal with table click handler in src/components/visualizations/TerpeneTable.tsx
- [X] T023 [US1] Add graceful handling for missing/null optional fields in modal (hide sections or show "Not available")
- [X] T024 [US1] Verify modal uses keepMounted prop for in-place content updates (controlled component pattern)
- [ ] T025 [US1] Test modal behavior with rapid row clicks (content updates without close/reopen)

**Checkpoint**: User Story 1 is fully functional. Users can view detailed terpene information by clicking table rows. Test independently before proceeding.

---

## Phase 4: User Story 2 - Streamlined Table View (Priority: P2)

**Goal**: Remove sources column from table to reduce clutter while keeping sources accessible in detail view

**Independent Test**: View terpene table → Verify only Name, Aroma, and Effects columns are visible → Sources column is absent → Click any row → Verify sources are available in detail modal

### Tests for User Story 2 (OPTIONAL ⚠️)

- [ ] T026 [P] [US2] OPTIONAL: Unit test verifying table has exactly 3 columns (Name, Aroma, Effects) in tests/unit/components/TerpeneTable.test.tsx
- [ ] T027 [P] [US2] OPTIONAL: Integration test verifying sources column removal doesn't break sorting in tests/integration/terpene-workflow.test.tsx
- [ ] T028 [P] [US2] OPTIONAL: Visual regression test for table layout on mobile/tablet/desktop in tests/e2e/terpene-table-layout.spec.ts

### Implementation for User Story 2

- [ ] T029 [US2] Remove Sources column from table header and body in src/components/visualizations/TerpeneTable.tsx
- [ ] T030 [US2] Verify table sorting still works correctly after column removal
- [ ] T031 [US2] Verify table is responsive on mobile devices (test down to 360px width per success criteria)
- [ ] T032 [US2] Verify sources are still accessible in detail modal (should already work from US1)

**Checkpoint**: User Story 2 is complete. Table is streamlined with 3 columns, sources are in detail view. Test independently.

---

## Phase 5: User Story 3 - Header-Positioned Search (Priority: P3)

**Goal**: Move search bar to site header for persistent accessibility while scrolling

**Independent Test**: View app → Verify search bar is in header → Scroll down table → Search bar remains visible and accessible → Enter search term → Table filters → Clear search → Full list restores

### Tests for User Story 3 (OPTIONAL ⚠️)

- [ ] T033 [P] [US3] OPTIONAL: Unit test for Header component with integrated SearchBar in tests/unit/components/layout/Header.test.tsx
- [ ] T034 [P] [US3] OPTIONAL: Integration test for search functionality from header in tests/integration/header-search.test.tsx
- [ ] T035 [P] [US3] OPTIONAL: E2E test for header search persistence while scrolling in tests/e2e/header-search.spec.ts

### Implementation for User Story 3

- [ ] T036 [US3] Move SearchBar component import to Header component in src/components/layout/Header.tsx
- [ ] T037 [US3] Lift search state to parent container if Header and table are in different components (check current architecture)
- [ ] T038 [US3] Update SearchBar styling for header placement (responsive: right-aligned on desktop, full-width on mobile)
- [ ] T039 [US3] Remove SearchBar from previous location (likely near table)
- [ ] T040 [US3] Verify search bar remains visible in fixed/sticky header while scrolling
- [ ] T041 [US3] Verify search functionality still works (filters table correctly)
- [ ] T042 [US3] Test search bar on mobile devices (verify accessibility and usability)

**Checkpoint**: User Story 3 is complete. Search bar is in header and remains accessible. All three user stories are now independently functional.

---

## Phase 6: Error Handling & Edge Cases

**Purpose**: Handle error scenarios and edge cases across all user stories

- [ ] T043 [P] Add error boundary component for data load failures in src/components/ErrorBoundary.tsx
- [ ] T044 [P] Implement error display with specific message: "Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues"
- [ ] T045 [P] Add retry button to error boundary
- [ ] T046 Test error scenarios: malformed JSON, missing file, validation failure
- [ ] T047 [P] Verify XSS sanitization for all data fields loaded from JSON (use existing sanitizeSearchQuery utility if available)
- [ ] T048 Handle very long descriptions and large arrays in modal (scrolling, truncation, or expansion)
- [ ] T049 Test modal behavior on mobile devices with limited screen space (360px width per success criteria)
- [ ] T050 Verify empty search behavior (returns full list, no errors)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T051 [P] Verify bundle size ≤500KB gzipped using `pnpm build` and checking dist/ output
- [ ] T052 [P] Run Lighthouse audit: Performance ≥90, Accessibility ≥95
- [ ] T053 [P] Verify search response time <200ms with browser DevTools
- [ ] T054 [P] Verify detail modal opens in <300ms (including in-place updates)
- [ ] T055 [P] Test all keyboard navigation (Tab, Enter, Space, ESC)
- [ ] T056 [P] Verify screen reader compatibility with modal (test with NVDA or JAWS)
- [ ] T057 Code cleanup: Remove console.logs, unused imports, commented code
- [ ] T058 Update documentation if needed (README, CLAUDE.md already updated)
- [ ] T059 Run full test suite: `pnpm test:all` (if tests were implemented)
- [ ] T060 Final validation against quickstart.md checklist

**Final Checkpoint**: All user stories complete, performance verified, ready for PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if multiple developers)
  - OR sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P3)
- **Error Handling (Phase 6)**: Can start after US1 complete (error boundary needed for MVP)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 Foundational. No dependencies on other stories. ✅ MVP-ready
- **User Story 2 (P2)**: Depends on Phase 2 Foundational. Modifies same table component as US1 (sequential recommended). Can technically start in parallel if using feature branches
- **User Story 3 (P3)**: Depends on Phase 2 Foundational. Modifies different components (Header vs Table). CAN run in parallel with US1/US2

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Component creation can be parallel ([P] marked tasks)
- Integration tasks depend on component completion
- Story must be validated independently before moving to next priority

### Parallel Opportunities

**Phase 2 (Foundational):**
```bash
# These can all run in parallel:
T007 [P] Update types
T009 [P] Add en translations
T010 [P] Add de translations
```

**User Story 1 (US1) Tests (if implementing):**
```bash
# All tests can be written in parallel:
T012 [P] [US1] Unit test - modal rendering
T013 [P] [US1] Unit test - controlled behavior
T014 [P] [US1] Integration test - click flow
T015 [P] [US1] Integration test - rapid clicks
T016 [P] [US1] E2E test - user journey
T017 [P] [US1] Accessibility test
```

**User Story 1 (US1) Implementation:**
```bash
# These can run in parallel (different concerns):
T018 [P] [US1] Create TerpeneDetailModal component
T019 [P] [US1] Update TerpeneTable onClick
```

**Cross-Story Parallelization (if team has capacity):**
```bash
# After Phase 2 completes, these can run in parallel:
Developer A: Phase 3 (User Story 1)
Developer B: Phase 5 (User Story 3) - different component (Header)
# Note: US2 modifies same table as US1, so sequential recommended
```

**Phase 6 (Error Handling):**
```bash
# These can run in parallel:
T043 [P] Error boundary component
T044 [P] Error message display
T045 [P] Retry button
T047 [P] XSS sanitization verification
T048 [P] Long content handling
```

**Phase 7 (Polish):**
```bash
# Most polish tasks can run in parallel:
T051 [P] Bundle size check
T052 [P] Lighthouse audit
T053 [P] Search performance
T054 [P] Modal performance
T055 [P] Keyboard navigation
T056 [P] Screen reader test
```

---

## Parallel Example: User Story 1 Implementation

```bash
# After Phase 2 Foundational completes:

# Step 1: Write tests in parallel (if implementing tests):
Task T012: "Unit test for TerpeneDetailModal rendering"
Task T013: "Unit test for controlled component behavior"
Task T014: "Integration test for table click flow"
Task T015: "Integration test for rapid clicks"
Task T016: "E2E test for user journey"
Task T017: "Accessibility test with vitest-axe"

# Step 2: Implement components in parallel:
Task T018: "Create TerpeneDetailModal in src/components/visualizations/TerpeneDetailModal.tsx"
Task T019: "Update TerpeneTable onClick in src/components/visualizations/TerpeneTable.tsx"

# Step 3: Sequential integration (depends on T018, T019):
Task T020: "Add state management in TerpeneTable"
Task T021: "Add keyboard navigation to table rows"
Task T022: "Integrate modal with table click handler"
Task T023: "Add graceful handling for missing fields"
Task T024: "Verify keepMounted prop for in-place updates"
Task T025: "Test rapid row clicks"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Recommended approach for fastest time-to-value:**

1. ✅ Complete Phase 1: Setup (T001-T005)
2. ✅ Complete Phase 2: Foundational (T006-T011) - CRITICAL
3. ✅ Complete Phase 3: User Story 1 (T012-T025) - Detail view functionality
4. ✅ Complete Phase 6: Core error handling (T043-T046) - Error boundary
5. **STOP and VALIDATE**: Test User Story 1 independently
   - Click terpene rows → Modal opens with all fields
   - Click different rows rapidly → Content updates in place
   - Test error scenarios → Error boundary works
6. ✅ Deploy/demo MVP if ready

**MVP delivers**: Core feature (clickable rows with detailed information in modal)

### Incremental Delivery

**Recommended for continuous value delivery:**

1. ✅ Complete Setup + Foundational (Phase 1-2) → Foundation ready
2. ✅ Add User Story 1 + Error Handling → Test independently → Deploy/Demo (MVP!)
3. ✅ Add User Story 2 → Test independently → Deploy/Demo (cleaner table)
4. ✅ Add User Story 3 → Test independently → Deploy/Demo (better search UX)
5. ✅ Add Polish → Final validation → Production release

**Each story adds value without breaking previous stories**

### Parallel Team Strategy

**If you have 2-3 developers:**

1. **Together**: Complete Setup + Foundational (Phase 1-2)
2. **Once Foundational done:**
   - **Developer A**: User Story 1 (T012-T025) - Detail modal
   - **Developer B**: User Story 3 (T033-T042) - Header search (different component, no conflict)
   - **Developer C**: Error handling (T043-T050) - Can start after US1 basics
3. **After parallel work:**
   - **Developer A or B**: User Story 2 (T026-T032) - Table cleanup (touches table modified by US1)
4. **Together**: Polish (T051-T060)

**Parallel efficiency**: ~40% faster completion with 2-3 developers

---

## Task Summary

**Total Tasks**: 60
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 6 tasks - BLOCKING ⚠️
- **Phase 3 (US1 - Detail View)**: 14 tasks (6 optional tests + 8 implementation)
- **Phase 4 (US2 - Table Cleanup)**: 7 tasks (3 optional tests + 4 implementation)
- **Phase 5 (US3 - Header Search)**: 10 tasks (3 optional tests + 7 implementation)
- **Phase 6 (Error Handling)**: 8 tasks
- **Phase 7 (Polish)**: 10 tasks

**Tasks by User Story**:
- **US1**: 14 tasks (6 tests + 8 implementation) - MVP core
- **US2**: 7 tasks (3 tests + 4 implementation) - Quick win
- **US3**: 10 tasks (3 tests + 7 implementation) - UX enhancement

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- **US1**: Click row → Modal opens → All 7 fields display → Close works → Rapid clicks update in place
- **US2**: Table has 3 columns (no sources) → Sources in modal → Responsive on mobile
- **US3**: Search in header → Visible while scrolling → Filters table → Clear restores

**Suggested MVP Scope**: Phase 1-2 + Phase 3 (US1) + Phase 6 (core errors) = ~25 tasks

---

## Notes

- **[P] tasks**: Different files or independent concerns, no dependencies within phase
- **[Story] label**: Maps task to specific user story for traceability
- **Optional tests**: Marked with ⚠️ - only implement if team wants TDD approach
- **Each user story is independently testable**: Can stop after any story and have working feature
- **Commit strategy**: Commit after each task or logical group
- **Checkpoints**: Stop at any checkpoint to validate story independently
- **Avoid**: Vague tasks, same-file conflicts, cross-story dependencies that break independence

**Clarification Impacts**:
- T024: Verify `keepMounted` prop ensures in-place content updates
- T025: Test rapid row clicks specifically (clarification requirement)
- T044: Specific error message with GitHub link (clarification requirement)
