# Tasks: Interactive Terpene Map

**Input**: Design documents from `/specs/001-interactive-terpene-map/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The tasks below include test tasks as requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize React project with Create React App
- [x] T003 [P] Install dependencies: D3.js, Material UI, Jest, Playwright, React Testing Library
- [ ] T004 [P] Configure Material UI
- [x] T005 [P] Configure Jest and Playwright in `jest.config.js` and `playwright.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create a data service in `src/services/dataService.js` to load and parse terpene data from `data/terpenes.json` and `data/terpenes.yaml`
- [x] T007 [P] Create a data validation service in `src/services/validationService.js` to validate the loaded data against the data model
- [x] T008 Implement the main application layout component in `src/components/Layout.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Filter Terpene Data (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to see a visual representation of all terpenes from the dataset, so that I can get an overview of the available data. I also want to be able to filter the terpenes by their effects, so that I can find terpenes that have the characteristics I'm interested in.

**Independent Test**: The user can load the application and see the terpene data. The user can use the filter controls and see the list of terpenes update accordingly.

### Tests for User Story 1 ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] [US1] Unit test for `TerpeneCard` component in `src/components/TerpeneCard.test.js`
- [x] T010 [P] [US1] Unit test for `TerpeneGrid` component in `src/components/TerpeneGrid.test.js`
- [x] T011 [P] [US1] Unit test for `EffectFilter` component in `src/components/EffectFilter.test.js`
- [x] T012 [P] [US1] Integration test for filtering logic in `src/pages/MainPage.test.js`

### Implementation for User Story 1

- [x] T013 [P] [US1] Create `TerpeneCard` component in `src/components/TerpeneCard.js`
- [x] T014 [US1] Create `TerpeneGrid` component in `src/components/TerpeneGrid.js` (depends on T013)
- [x] T015 [P] [US1] Create `EffectFilter` component in `src/components/EffectFilter.js`
- [x] T016 [US1] Implement the main page in `src/pages/MainPage.js` to display the `TerpeneGrid` and `EffectFilter` (depends on T014, T015)
- [x] T017 [US1] Implement filtering logic in `src/pages/MainPage.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 3 - Data Visualization and Search (Priority: P1)

**Goal**: As a user, I want to be able to view the terpene data in different formats, such as a sunburst chart and a table, so that I can choose the representation that best suits my needs. I also want to be able to search for specific terpenes by name, so that I can quickly find the information I'm looking for.

**Independent Test**: The user can switch between the different views (sunburst, table). The user can type in the search bar and see the data views update with filtered results.

### Tests for User Story 3 ⚠️

- [x] T018 [P] [US3] Unit test for `SunburstChart` component in `src/components/SunburstChart.test.js` (Note: Unit test is basic due to D3/Jest compatibility issues with Create React App. Full D3 rendering will be covered by E2E tests.)
- [x] T019 [P] [US3] Unit test for `TableView` component in `src/components/TableView.test.js`
- [x] T020 [P] [US3] Unit test for `ViewSwitcher` component in `src/components/ViewSwitcher.test.js`
- [x] T021 [P] [US3] Unit test for `SearchBar` component in `src/components/SearchBar.test.js`
- [x] T022 [P] [US3] Integration test for search and view switching in `src/pages/MainPage.test.js`

### Implementation for User Story 3

- [x] T023 [P] [US3] Create `SunburstChart` component in `src/components/SunburstChart.js` using D3.js
- [x] T024 [P] [US3] Create `TableView` component in `src/components/TableView.js`
- [x] T025 [P] [US3] Create `ViewSwitcher` component in `src/components/ViewSwitcher.js`
- [x] T026 [P] [US3] Create `SearchBar` component in `src/components/SearchBar.js`
- [x] T027 [US3] Integrate `ViewSwitcher` and `SearchBar` into `src/pages/MainPage.js` (depends on T025, T026)
- [x] T028 [US3] Implement search logic in `src/pages/MainPage.js`
- [x] T029 [US3] Implement sunburst chart filtering logic in `src/components/SunburstChart.js`

**Checkpoint**: At this point, User Stories 1 and 3 should both work independently

---

## Phase 5: User Story 2 - Theming and Language (Priority: P2)

**Goal**: As a user, I want to be able to switch between a light and a dark theme, so that I can use the application comfortably in different lighting conditions. I also want to be able to switch the language of the application between English and German.

**Independent Test**: The user can toggle between light and dark mode and see the application's appearance change. The user can switch the language and see the UI text update.

### Tests for User Story 2 ⚠️

- [x] T030 [P] [US2] Unit test for theme switching in `src/contexts/ThemeContext.test.js`
- [x] T031 [P] [US2] Unit test for language switching in `src/contexts/LanguageContext.test.js`

### Implementation for User Story 2

- [x] T032 [US2] Implement a theme context and provider in `src/contexts/ThemeContext.js`
- [x] T033 [P] [US2] Create `ThemeToggleButton` component in `src/components/ThemeToggleButton.js`
- [x] T034 [US2] Implement a language context and provider in `src/contexts/LanguageContext.js`
- [x] T035 [P] [US2] Create `LanguageSwitcher` component in `src/components/LanguageSwitcher.js`
- [x] T036 [US2] Integrate `ThemeToggleButton` and `LanguageSwitcher` into `src/components/Layout.js` (depends on T033, T035)
- [x] T037 [P] [US2] Create localization files for English and German in `src/locales/en.json` and `src/locales/de.json`
- [x] T038 [US2] Update all UI text to use the localization service

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T039 [P] Implement the pulsing cannabis leaf loading indicator in `src/components/LoadingIndicator.js`
- [x] T040 [P] Implement user-friendly error messages in `src/components/ErrorMessage.js`
- [x] T041 [P] Implement "no results" message in `src/components/NoResults.js`
- [x] T042 [P] Sanitize search input in `src/components/SearchBar.js`
- [ ] T043 Review accessibility (WCAG 2.1 AA) across the application
- [ ] T044 Performance optimization across all stories
- [ ] T045 [P] End-to-end tests with Playwright in `tests/e2e/`
- [ ] T046 Final documentation review of `README.md` and `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for TerpeneCard component in src/components/TerpeneCard.test.js"
Task: "Unit test for TerpeneGrid component in src/components/TerpeneGrid.test.js"
Task: "Unit test for EffectFilter component in src/components/EffectFilter.test.js"
Task: "Integration test for filtering logic in src/pages/MainPage.test.js"

# Launch all components for User Story 1 together:
Task: "Create TerpeneCard component in src/components/TerpeneCard.js"
Task: "Create EffectFilter component in src/components/EffectFilter.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. Complete Phase 4: User Story 3
5. **STOP and VALIDATE**: Test User Stories 1 and 3 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 & 3 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 3
   - Developer C: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
