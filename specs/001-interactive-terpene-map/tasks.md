# Tasks: Interactive Terpene Map

**Input**: Design documents from `/specs/001-interactive-terpene-map/`
**Prerequisites**: plan.md, spec.md, data-model.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize React project using Create React App in `frontend/`
- [ ] T002 [P] Install dependencies: `d3`, `tailwindcss`
- [ ] T003 [P] Install development dependencies: `jest`, `playwright`, `@testing-library/react`
- [ ] T004 [P] Configure Tailwind CSS in `frontend/tailwind.config.js` and `frontend/src/index.css`
- [ ] T005 [P] Set up project structure in `frontend/src/` with `components`, `pages`, `services`, `data`, `hooks`, `styles`, `utils` directories.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T006 Implement data loading service in `frontend/src/services/dataService.js` to fetch and parse `terpenes.json`
- [ ] T007 Set up global state management for terpene data, theme, and language using React Context in `frontend/src/context/`

---

## Phase 3: User Story 1 - View and Filter Terpene Data (Priority: P1) 🎯 MVP

**Goal**: Allow users to view and filter the terpene data.

**Independent Test**: The user can see the terpene grid and filter it by effect.

- [ ] T008 [US1] Create a `TerpeneCard` component in `frontend/src/components/TerpeneCard.js` to display a single terpene.
- [ ] T009 [US1] Create a `TerpeneGrid` component in `frontend/src/components/TerpeneGrid.js` to display a grid of `TerpeneCard` components.
- [ ] T010 [US1] Create a `Filter` component in `frontend/src/components/Filter.js` to allow users to filter by effect.
- [ ] T011 [US1] Implement the filtering logic in the main page `frontend/src/pages/HomePage.js` to filter the terpenes based on the selected effect.
- [ ] T012 [US1] Write unit tests for the `TerpeneCard`, `TerpeneGrid`, and `Filter` components in `frontend/src/tests/`.

---

## Phase 4: User Story 2 - Theming and Language (Priority: P2)

**Goal**: Allow users to switch between light/dark themes and English/German languages.

**Independent Test**: The user can toggle the theme and language and see the UI update accordingly.

- [ ] T013 [US2] Implement theme switching (light/dark) in `frontend/src/hooks/useTheme.js` and apply it to the root component.
- [ ] T014 [US2] Implement language switching (en/de) in `frontend/src/hooks/useLocalization.js` and create translation files in `frontend/public/locales/`.
- [ ] T015 [US2] Write unit tests for the theme and localization hooks in `frontend/src/tests/`.

---

## Phase 5: User Story 3 - Data Visualization and Search (Priority: P1)

**Goal**: Provide advanced data visualization and search capabilities.

**Independent Test**: The user can switch between views, use the sunburst chart, table view, and search bar.

- [ ] T016 [US3] Create the `SunburstChart` component in `frontend/src/components/SunburstChart.js` using D3.js.
- [ ] T017 [US3] Implement the interaction logic for the sunburst chart to filter the main data view when a slice is clicked.
- [ ] T018 [US3] Create the `TableView` component in `frontend/src/components/TableView.js` with sortable columns.
- [ ] T019 [US3] Create the `SearchBar` component in `frontend/src/components/SearchBar.js`.
- [ ] T020 [US3] Implement the search logic in `frontend/src/pages/HomePage.js` to filter terpenes by name, aroma, and effects.
- [ ] T021 [US3] Write unit tests for the `SunburstChart`, `TableView`, and `SearchBar` components in `frontend/src/tests/`.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 [P] Write integration tests for all user flows in `frontend/src/tests/`.
- [ ] T023 Write end-to-end tests with Playwright for the main user journeys in `frontend/tests/e2e/`.
- [ ] T024 Review and refactor code for performance and readability.
- [ ] T025 Update `README.md` with detailed instructions.
