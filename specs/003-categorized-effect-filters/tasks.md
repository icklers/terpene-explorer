# Tasks: Categorized Effect Filters

**Input**: Design documents from `/specs/003-categorized-effect-filters/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-contracts.md, quickstart.md

**Feature**: Enable users to filter terpenes by therapeutic effect categories (Mood, Cognitive, Relaxation, Physical) with visual grouping, color coding, emoticons, and category-level filtering.

**Tests**: E2E tests are included as they are specified in the feature requirements (accessibility, mobile responsiveness).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification of prerequisites

- [ ] T001 Verify database schema includes effectCategories and effectCategoryMapping in data/terpene-database.json
- [ ] T002 Verify Zod schemas exported from src/utils/terpeneSchema.ts (EffectCategory, EffectCategoryMapping types)
- [ ] T003 [P] Run pnpm type-check to ensure TypeScript compilation passes
- [ ] T004 [P] Verify Material UI 6.3+ and Emotion 11.13+ are available in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create CATEGORY_UI_CONFIG constant in src/utils/categoryUIConfig.ts with emoticons, fallback letters, and ARIA labels for all 4 categories
- [ ] T006 [P] Add category color tokens to src/theme/lightTheme.ts (category.mood, category.cognitive, category.relaxation, category.physical)
- [ ] T007 [P] Add category color tokens to src/theme/darkTheme.ts with appropriate contrast for dark mode
- [ ] T008 Extend TypeScript theme types in src/theme/themeConfig.ts to include category palette interface
- [ ] T009 Add categoryFilters field to FilterState interface in src/models/FilterState.ts (type: EffectCategoryId[])
- [ ] T010 Update useFilters hook in src/hooks/useFilters.ts to initialize categoryFilters as empty array in localStorage
- [ ] T011 Create applyEffectFilters function in src/services/filterService.ts with OR/AND logic for category and effect filters
- [ ] T012 Create syncCategoryFilters function in src/services/filterService.ts to auto-deselect categories when effects cleared
- [ ] T013 [P] Run pnpm type-check to verify all foundational changes compile without errors

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Categorized Effects (Priority: P1) 🎯 MVP

**Goal**: Display effect filters organized into 4 therapeutic categories with emoticons, enabling users to quickly identify which category addresses their therapeutic needs.

**Independent Test**: Open effect filter interface and verify effects are visually grouped into categories (Mood & Energy ⚡, Cognitive & Mental Enhancement 🧠, Relaxation & Anxiety Management 😌, Physical & Physiological Management 💪) in correct order. Each category displays emoticon and effects are correctly grouped (4 mood, 4 cognitive, 5 relaxation, 6 physical).

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create CategoryEmoticon component in src/components/filters/CategoryEmoticon.tsx with canvas-based emoticon detection and fallback letter rendering
- [ ] T015 [P] [US1] Create CategoryFilterGroup component skeleton in src/components/filters/CategoryFilterGroup.tsx (desktop layout only, no accordion yet)
- [ ] T016 [US1] Implement category header rendering in CategoryFilterGroup.tsx with emoticon, category name, and checkbox (non-functional for US1)
- [ ] T017 [US1] Implement effect chips grid layout in CategoryFilterGroup.tsx displaying effects for each category
- [ ] T018 [US1] Modify FilterControls component in src/components/filters/FilterControls.tsx to load effectCategories from database
- [ ] T019 [US1] Render CategoryFilterGroup components in FilterControls.tsx sorted by displayOrder with dividers between categories
- [ ] T020 [US1] Add visual spacing/dividers between category groups in FilterControls.tsx (per FR-009)

### E2E Tests for User Story 1

- [ ] T021 [P] [US1] Create E2E test in tests/e2e/filter-categories.spec.ts to verify 4 categories render in correct order
- [ ] T022 [P] [US1] Add E2E test case to verify emoticons display or fallback letters render correctly
- [ ] T023 [P] [US1] Add E2E test case to verify effects are grouped correctly (4 mood, 4 cognitive, 5 relaxation, 6 physical)
- [ ] T024 [P] [US1] Add E2E test case to verify category display order: Mood → Cognitive → Relaxation → Physical

**Checkpoint**: At this point, User Story 1 should be fully functional - users can see categorized effects with emoticons (no filtering yet)

---

## Phase 4: User Story 2 - Visual Category Distinction via Color Coding (Priority: P2)

**Goal**: Apply distinct colors to each category so users can quickly identify therapeutic categories at a glance, with WCAG 2.1 AA contrast compliance.

**Independent Test**: Examine category groups and verify each has unique, distinguishable color scheme using theme tokens. Test with color vision deficiency simulators and verify WCAG 2.1 AA contrast ratios (4.5:1).

### Implementation for User Story 2

- [ ] T025 [P] [US2] Apply category background color to category headers in CategoryFilterGroup.tsx using theme.palette.category[categoryId]
- [ ] T026 [P] [US2] Add color coding to category dividers/borders in FilterControls.tsx using category theme tokens
- [ ] T027 [US2] Style CategoryEmoticon fallback circles with category colors and contrasting text using theme.palette.getContrastText()
- [ ] T028 [US2] Verify category colors adapt correctly when switching between light and dark themes

### Accessibility Tests for User Story 2

- [ ] T029 [P] [US2] Create accessibility test in tests/e2e/accessibility.spec.ts to verify WCAG 2.1 AA contrast ratios for all category colors in light theme
- [ ] T030 [P] [US2] Add test case to verify WCAG 2.1 AA contrast ratios for all category colors in dark theme
- [ ] T031 [P] [US2] Add test case to verify emoticons have proper ARIA labels ("Mood and Energy category" not "high voltage sign")

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - categories are visually distinct with accessible colors

---

## Phase 5: User Story 3 - Individual Effect Color Coding (Priority: P3)

**Goal**: Apply category colors to individual effect filter chips so users can recognize therapeutic categories when interacting with filters.

**Independent Test**: Click effect chips and verify they inherit parent category colors. Verify selected state maintains category color with visual feedback (darker shade or border).

### Implementation for User Story 3

- [ ] T032 [P] [US3] Apply category color to effect chips in CategoryFilterGroup.tsx using theme.palette.category[categoryId]
- [ ] T033 [P] [US3] Implement outlined variant for unselected chips with category border color
- [ ] T034 [P] [US3] Implement filled variant for selected chips with category background color
- [ ] T035 [US3] Add hover state styling for effect chips with category color variations
- [ ] T036 [US3] Verify effect chip colors persist across theme changes (light/dark mode)

### Unit Tests for User Story 3

- [ ] T037 [P] [US3] Create unit test in tests/unit/components/CategoryFilterGroup.test.tsx to verify effect chips render with correct category colors
- [ ] T038 [P] [US3] Add test case to verify outlined variant for unselected chips
- [ ] T039 [P] [US3] Add test case to verify filled variant for selected chips
- [ ] T040 [P] [US3] Add test case to verify chip colors update when theme changes

**Checkpoint**: All user stories 1-3 should now be independently functional - full color coding implementation complete

---

## Phase 6: User Story 4 - Category-Level Filtering (Priority: P2)

**Goal**: Enable users to filter terpenes by entire categories (e.g., "show only Mood & Energy effects") with OR logic for multiple categories and auto-sync when individual effects are deselected.

**Independent Test**: Select "Mood & Energy" category and verify only terpenes with mood effects display. Select multiple categories and verify OR logic (union of results). Deselect all individual effects in a category and verify category auto-deselects.

### Implementation for User Story 4

- [ ] T041 [US4] Add toggleCategoryFilter method to useFilters hook in src/hooks/useFilters.ts
- [ ] T042 [US4] Modify toggleEffectFilter method in src/hooks/useFilters.ts to call syncCategoryFilters after effect selection changes (FR-019)
- [ ] T043 [US4] Implement category checkbox click handler in CategoryFilterGroup.tsx to call onCategoryToggle prop
- [ ] T044 [US4] Implement category checkbox state logic in CategoryFilterGroup.tsx (checked, unchecked, indeterminate)
- [ ] T045 [US4] Integrate applyEffectFilters function in FilterControls.tsx or parent component to filter terpene results
- [ ] T046 [US4] Implement visual feedback for active category filters (checked checkbox, highlight)
- [ ] T047 [US4] Verify immediate terpene result updates when category filters change

### Unit Tests for User Story 4

- [ ] T048 [P] [US4] Create unit test in tests/unit/services/filterService.test.ts to verify OR logic for multiple category filters
- [ ] T049 [P] [US4] Add test case to verify OR logic when both category and effect filters are active
- [ ] T050 [P] [US4] Add test case to verify applyEffectFilters returns all terpenes when no filters active
- [ ] T050.5 [P] [US4] Add test case to verify AND logic when category selected plus individual effects from same category selected
- [ ] T051 [P] [US4] Create unit test in tests/unit/services/filterService.test.ts for syncCategoryFilters auto-deselect behavior
- [ ] T052 [P] [US4] Add test case to verify syncCategoryFilters keeps category selected if any effect still selected
- [ ] T053 [P] [US4] Create unit test in tests/unit/hooks/useFilters.test.ts to verify toggleCategoryFilter adds/removes categories
- [ ] T054 [P] [US4] Add test case to verify toggleEffectFilter calls syncCategoryFilters

### Integration Tests for User Story 4

- [ ] T055 [P] [US4] Create integration test in tests/integration/us4-category-filter-flow.test.tsx to verify category selection filters terpenes
- [ ] T056 [P] [US4] Add test case to verify combining category and effect filters uses OR logic
- [ ] T057 [P] [US4] Add test case to verify auto-deselect when all effects manually deselected

### E2E Tests for User Story 4

- [ ] T058 [P] [US4] Add E2E test in tests/e2e/filter-categories.spec.ts to verify category checkbox filters terpenes correctly
- [ ] T059 [P] [US4] Add test case to verify multiple category filters show union of results (OR logic)
- [ ] T060 [P] [US4] Add test case to verify category + effect filters combine with OR logic
- [ ] T061 [P] [US4] Add test case to verify category auto-unchecks when all individual effects deselected

**Checkpoint**: All user stories including category-level filtering should now work - full feature complete

---

## Phase 7: Mobile Responsiveness (FR-013)

**Goal**: Implement collapsible accordions on mobile screens (320px-480px) where users tap category headers to expand/collapse content.

**Independent Test**: Open app on mobile viewport (375px width), verify categories render as collapsed accordions. Tap category header and verify content expands. Verify category checkbox visible in accordion header.

### Implementation for Mobile

- [ ] T062 [P] Add useMediaQuery hook in CategoryFilterGroup.tsx to detect mobile breakpoint (theme.breakpoints.down('sm'))
- [ ] T063 Wrap CategoryFilterGroup content in Material UI Accordion component when isMobile is true
- [ ] T064 Move category header into AccordionSummary with expand icon when on mobile
- [ ] T065 Move effect chips into AccordionDetails when on mobile
- [ ] T066 Set accordions to collapsed by default on mobile (expanded: false)
- [ ] T067 Verify category checkbox remains functional in accordion header

### E2E Tests for Mobile

- [ ] T068 [P] Create mobile E2E test in tests/e2e/filter-categories.spec.ts with viewport size 375x667 (iPhone SE)
- [ ] T069 [P] Add test case to verify categories render as collapsed accordions on mobile
- [ ] T070 [P] Add test case to verify tapping accordion header expands/collapses content
- [ ] T071 [P] Add test case to verify category checkbox visible and functional in accordion header
- [ ] T072 [P] Add test case to verify effect chips visible in expanded accordion details
- [ ] T072.5 [P] Add E2E test to verify filter state persists after page reload (localStorage validation)

**Checkpoint**: Mobile UI complete - accordions work correctly on small screens

---

## Phase 8: Accessibility & Cross-Cutting Polish

**Purpose**: Final accessibility verification, performance optimization, and documentation

### Accessibility Final Checks

- [ ] T073 [P] Run vitest-axe accessibility tests on FilterControls with category filters
- [ ] T074 [P] Verify keyboard navigation works: Tab to focus category checkboxes, Space to toggle
- [ ] T075 [P] Verify keyboard navigation for effect chips: Tab to focus, Enter/Space to toggle
- [ ] T076 [P] Verify screen reader announces category names with ARIA labels correctly
- [ ] T077 [P] Test accordion keyboard navigation: Tab to header, Enter/Space to expand/collapse

### Performance Validation

- [ ] T078 [P] Wrap applyEffectFilters in useMemo to prevent unnecessary recalculations
- [ ] T079 [P] Memoize CategoryFilterGroup component with React.memo to prevent unnecessary re-renders
- [ ] T080 [P] Use useCallback for event handlers in CategoryFilterGroup (onCategoryToggle, onEffectToggle)
- [ ] T081 Measure filter response time with 500+ terpenes (target: <100ms)
- [ ] T082 Measure accordion expand/collapse time on mobile (target: <50ms)
- [ ] T083 Run pnpm build and verify zero bundle size increase compared to baseline
- [ ] T083.5 [P] Measure color theme application time (target: <16ms for 60fps rendering)
- [ ] T083.6 [P] Measure initial filter panel render time (target: <200ms)

### Documentation & Cleanup

- [ ] T084 [P] Update README.md with category filter feature documentation
- [ ] T085 [P] Update ACCESSIBILITY.md with category filter keyboard shortcuts and ARIA labels
- [ ] T086 [P] Update CHANGELOG.md with feature release notes for version tracking
- [ ] T087 [P] Add JSDoc comments to CategoryFilterGroup and CategoryEmoticon components
- [ ] T088 [P] Add JSDoc comments to applyEffectFilters and syncCategoryFilters functions
- [ ] T089 Run ESLint and fix any new warnings introduced by this feature
- [ ] T090 Run full test suite (unit + integration + E2E) and verify all tests pass
- [ ] T091 Run quickstart.md validation checklist to ensure all success criteria met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P2 for US4)
- **Mobile Responsiveness (Phase 7)**: Depends on User Story 1 (CategoryFilterGroup component exists)
- **Polish (Phase 8)**: Depends on all user stories and mobile implementation being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (CategoryFilterGroup component exists to apply colors)
- **User Story 3 (P3)**: Depends on User Story 1 (CategoryFilterGroup component exists to color effect chips)
- **User Story 4 (P2)**: Depends on Foundational (Phase 2) - Filter logic functions exist independently of UI
- **Mobile (Phase 7)**: Depends on User Story 1 (CategoryFilterGroup component exists to wrap in accordion)

### Within Each User Story

- **User Story 1**: T014 (CategoryEmoticon) and T015 (CategoryFilterGroup skeleton) can run in parallel → T016-T020 sequential
- **User Story 2**: All implementation tasks (T025-T028) can run in parallel → Test tasks (T029-T031) can run in parallel
- **User Story 3**: Implementation tasks (T032-T036) can run in parallel → Test tasks (T037-T040) can run in parallel
- **User Story 4**: Implementation sequential (T041-T047) → All test phases can run in parallel within each test type
- **Mobile**: T062 can start independently → T063-T067 sequential → Test tasks (T068-T072) can run in parallel
- **Polish**: Most tasks marked [P] can run in parallel except T090-T091 which must be last

### Parallel Opportunities

- **Setup (Phase 1)**: T003 and T004 can run in parallel
- **Foundational (Phase 2)**: T006-T007 (theme files) can run in parallel, T011-T012 (service functions) can run in parallel
- **User Story 1**: T014 and T015 can start together, T021-T024 (E2E tests) can run in parallel
- **User Story 2**: All implementation (T025-T028) and all tests (T029-T031) can run in parallel within each group
- **User Story 3**: All implementation (T032-T036) and all tests (T037-T040) can run in parallel within each group
- **User Story 4**: Test tasks within each test type can run in parallel (T048-T050, T055-T057, T058-T061)
- **Mobile**: Test tasks (T068-T072) can run in parallel
- **Polish**: Most tasks (T073-T089) can run in parallel, except final validation (T090-T091)

---

## Parallel Example: User Story 2

```bash
# Launch all implementation tasks for User Story 2 together:
Task: "Apply category background color to headers in CategoryFilterGroup.tsx"
Task: "Add color coding to dividers in FilterControls.tsx"
Task: "Style CategoryEmoticon fallback with category colors"
Task: "Verify colors adapt to theme switching"

# Launch all accessibility tests for User Story 2 together:
Task: "Verify WCAG 2.1 AA contrast for light theme"
Task: "Verify WCAG 2.1 AA contrast for dark theme"
Task: "Verify emoticons have proper ARIA labels"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T013) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T014-T024)
4. **STOP and VALIDATE**: Test User Story 1 independently - users can see categorized effects with emoticons
5. Deploy/demo if ready

**MVP Deliverable**: Effect filters organized into 4 categories with emoticons - no filtering yet, just improved organization and discoverability.

### Incremental Delivery (Recommended)

1. **Setup + Foundational** (T001-T013) → Foundation ready
2. **Add User Story 1** (T014-T024) → Test independently → **Deploy/Demo (MVP!)** - Categorized effect display with emoticons
3. **Add User Story 2** (T025-T031) → Test independently → Deploy/Demo - Color coding for quick visual identification
4. **Add User Story 4** (T041-T061) → Test independently → Deploy/Demo - Category-level filtering functionality
5. **Add User Story 3** (T032-T040) → Test independently → Deploy/Demo - Individual effect chip color coding
6. **Add Mobile** (T062-T072) → Test independently → Deploy/Demo - Mobile accordion UI
7. **Polish** (T073-T091) → Final validation → Production release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T013)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T014-T024) - MVP
   - Developer B: User Story 4 filter logic (T041-T047) - Can start in parallel with US1
   - Developer C: Theme setup for US2 (T006-T007 already done in Foundational)
3. **After User Story 1 complete**:
   - Developer A: User Story 2 (T025-T031) - Color coding
   - Developer B: User Story 4 tests (T048-T061)
   - Developer C: User Story 3 (T032-T040) - Effect chip colors
4. **After core stories complete**:
   - Developer A: Mobile (T062-T072)
   - Developer B: Accessibility (T073-T077)
   - Developer C: Performance (T078-T083)
5. **Final**: Documentation and validation together (T084-T091)

Stories complete and integrate independently.

---

## Task Count Summary

- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 9 tasks - **BLOCKS all user stories**
- **Phase 3 (User Story 1 - P1)**: 11 tasks (7 implementation + 4 E2E tests)
- **Phase 4 (User Story 2 - P2)**: 7 tasks (4 implementation + 3 accessibility tests)
- **Phase 5 (User Story 3 - P3)**: 9 tasks (5 implementation + 4 unit tests)
- **Phase 6 (User Story 4 - P2)**: 22 tasks (7 implementation + 8 unit + 3 integration + 4 E2E tests)
- **Phase 7 (Mobile Responsiveness)**: 12 tasks (6 implementation + 6 E2E tests including persistence test)
- **Phase 8 (Polish & Cross-Cutting)**: 21 tasks (5 accessibility + 8 performance + 8 documentation/validation)

**Total**: 95 tasks

**Parallel Opportunities**: 47+ tasks can run in parallel (all marked with [P])

**MVP Scope**: Phase 1-3 only (24 tasks) - Delivers categorized effect display with emoticons

**Suggested First Milestone**: Setup + Foundational + User Story 1 (13 + 11 = 24 tasks) - Foundation + MVP

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- E2E tests verify end-to-end user journeys per requirement FR-013 (mobile) and Success Criteria SC-003 to SC-010
- Unit/integration tests verify filter logic correctness per FR-016, FR-017, FR-020
- Accessibility tests verify WCAG 2.1 AA compliance per FR-006 and Success Criteria SC-004, SC-006
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
