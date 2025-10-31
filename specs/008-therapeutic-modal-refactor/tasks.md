# Implementation Tasks: Therapeutic-Focused Terpene Details Modal

**Feature**: 008-therapeutic-modal-refactor  
**Branch**: `008-therapeutic-modal-refactor`  
**Generated**: 2025-11-01  
**Approach**: Test-Driven Development (TDD) with RED→GREEN→REFACTOR cycles

## Overview

This document breaks down the therapeutic modal refactor into executable tasks organized by user story. Each task follows strict TDD (Test-Driven Development) where tests are written BEFORE implementation.

**Total Tasks**: 94 tasks across 8 phases  
**Parallelizable**: 41 tasks marked with [P]  
**TDD Cycles**: ~40 RED→GREEN→REFACTOR cycles  
**Estimated Effort**: 3-5 days with TDD discipline

---

## Implementation Strategy

### TDD Workflow (MANDATORY)

Every task follows RED→GREEN→REFACTOR:

1. **🔴 RED**: Write failing test
2. **🟢 GREEN**: Minimal code to pass
3. **🔵 REFACTOR**: Improve without breaking tests
4. **Commit** after each cycle

### Phase Organization

- **Phase 1**: Setup & Cleanup (remove old modal)
- **Phase 2**: Foundational Infrastructure (TDD on helpers/constants)
- **Phase 3**: US1 - Quick Therapeutic Assessment (Basic View)
- **Phase 4**: US2 - Deep Therapeutic Exploration (Expert View)
- **Phase 5**: US3 - Filter by Therapeutic Property (Interactions)
- **Phase 6**: US4 - Category Badge Information (Tooltips)
- **Phase 7**: US5 - Concentration Context (Tooltips)
- **Phase 8**: Polish & Cross-Cutting Concerns

### Independent Testing

Each user story phase includes independent test criteria that can be validated without completing other stories.

---

## Phase 1: Setup & Cleanup

**Goal**: Prepare project for new modal implementation by removing old code and setting up test infrastructure.

**Independent Test**: After this phase, project compiles without errors, old modal is removed, and test infrastructure is ready.

### Tasks

- [ ] T001 Remove old modal implementation at `src/components/visualizations/TerpeneDetailModal.tsx`
- [ ] T002 Create new directory structure: `src/components/` for new modal (not in visualizations/)
- [ ] T003 Update import in `src/components/visualizations/TerpeneTable.tsx` to point to new location (stub only)
- [ ] T004 [P] Add i18n keys to `src/i18n/locales/en/translation.json` (modal.terpeneDetail.* namespace, 28 keys per contracts)
- [ ] T005 [P] Add i18n keys to `src/i18n/locales/de/translation.json` (German translations of 28 keys)
- [ ] T006 Verify project compiles after old modal removal (`pnpm type-check`)

**Validation**:
```bash
pnpm type-check  # Must pass
pnpm lint        # Must pass
# Old modal file deleted
# New i18n keys present
```

---

## Phase 2: Foundational Infrastructure (TDD)

**Goal**: Build and test helper functions and constants using TDD. These are pure logic with no UI dependencies.

**Independent Test**: All helper functions and constants have 100% test coverage and can be used independently.

### TDD Cycle 1: Therapeutic Colors Constant

- [ ] T007 [P] 🔴 RED: Write test for `getTherapeuticColor()` in `src/utils/terpeneHelpers.test.ts` - expect blue[500] for Anxiolytic
- [ ] T008 🟢 GREEN: Implement `getTherapeuticColor()` in `src/utils/terpeneHelpers.ts` - return color from inline map
- [ ] T009 🔵 REFACTOR: Extract THERAPEUTIC_COLORS to `src/constants/therapeuticColors.ts` with semantic domain mapping per FR-056 (Mental Health: blue[500], cyan[700], indigo[500], purple[600]; Physical: red[600], orange[700], deepOrange[600]; Respiratory: teal[600], cyan[600]; Immune: green[700], lightGreen[800], green[600]; Digestive: brown[600], amber[800])
- [ ] T010 [P] 🔴 RED: Add tests for all 15 therapeutic properties with correct Material UI colors from FR-056
- [ ] T011 🟢 GREEN: Complete color mapping for all properties using exact values from spec
- [ ] T012 🔵 REFACTOR: Verify all colors meet 4.5:1 contrast ratio against white text using Chrome DevTools Color Picker - document results in code comments with actual ratios (e.g., blue[500] = 4.87:1, cyan[700] = 4.52:1)

**Commit**: `feat: add therapeutic property color mapping with WCAG AA compliance (FR-056)`

### TDD Cycle 2: Effect Categorization

- [ ] T013 [P] 🔴 RED: Write test for `categorizeEffects()` - expect effects grouped by category (mood, cognitive, relaxation, physical)
- [ ] T014 🟢 GREEN: Implement `categorizeEffects()` - use existing `effectCategoryMapping` from database schema
- [ ] T015 [P] 🔴 RED: Add test for showAll=false - expect max 3 effects per category
- [ ] T016 🟢 GREEN: Implement slice logic for Basic View (first 3 effects)
- [ ] T017 [P] 🔴 RED: Add test for empty category filtering - expect no empty categories returned
- [ ] T018 🟢 GREEN: Implement filter to remove categories with zero effects
- [ ] T019 🔵 REFACTOR: Extract category configuration (icons, names) to clean structure

**Commit**: `feat: add effect categorization with Basic/Expert view support`

### TDD Cycle 3: Concentration Parsing

- [ ] T020 [P] 🔴 RED: Write test for `parseConcentration()` - expect parsing of "0.003-1.613 mg/g" format
- [ ] T021 🟢 GREEN: Implement regex parsing for min-max range
- [ ] T022 [P] 🔴 RED: Add test for percentile calculation - expect different results for Core/Secondary/Minor categories
- [ ] T023 🟢 GREEN: Implement category-specific percentile calculation (Core: 0-2.0, Secondary: 0-1.0, Minor: 0-0.5 mg/g)
- [ ] T024 [P] 🔴 RED: Add test for concentration labels - expect High(≥75%), Moderate(40-74%), Low(10-39%), Trace(<10%)
- [ ] T025 🟢 GREEN: Implement label thresholds
- [ ] T026 🔵 REFACTOR: Extract category maximums constant, clean up calculation logic

**Commit**: `feat: add concentration parsing with category-specific percentiles`

### TDD Cycle 4: Source Icons

- [ ] T027 [P] 🔴 RED: Write test for `getSourceIcon()` - expect 🍋 for "Lemon peel"
- [ ] T028 🟢 GREEN: Implement source-to-icon mapping
- [ ] T029 [P] 🔴 RED: Add tests for all common sources (Lemon, Orange, Lavender, Pine, Pepper, Hops)
- [ ] T030 🟢 GREEN: Complete icon map with fallback 🌿
- [ ] T031 🔵 REFACTOR: Extract icon map to constant

**Commit**: `feat: add natural source icon mapping`

### TDD Cycle 5: Copy to Clipboard

- [ ] T032 [P] 🔴 RED: Write test for `copyToClipboard()` - expect Clipboard API call with text
- [ ] T033 🟢 GREEN: Implement Navigator clipboard.writeText()
- [ ] T034 [P] 🔴 RED: Add test for fallback when Clipboard API unavailable - expect document.execCommand('copy')
- [ ] T035 🟢 GREEN: Implement fallback with textarea element
- [ ] T036 [P] 🔴 RED: Add test for error handling - expect error callback invoked
- [ ] T037 🟢 GREEN: Implement try-catch with error callback
- [ ] T038 🔵 REFACTOR: Clean up clipboard logic, add comments

**Commit**: `feat: add clipboard copy with fallback and error handling`

**Phase 2 Validation**:
```bash
pnpm test src/utils/terpeneHelpers.test.ts    # All pass
pnpm test:coverage src/utils/terpeneHelpers.ts # 100% coverage
```

---

## Phase 3: US1 - Quick Therapeutic Assessment (TDD)

**Goal**: Implement Basic View of modal with therapeutic information prioritized using TDD.

**User Story**: Medical cannabis patient views terpene details to quickly understand therapeutic benefits.

**Independent Test**: Modal opens with Basic View showing therapeutic properties, categorized effects, and concentration data. User can identify therapeutic benefits within 15 seconds without toggling to Expert View.

### TDD Cycle 6: Category Badge Component

- [ ] T039 [P] [US1] 🔴 RED: Write test for `CategoryBadge` rendering "Core" with primary color in `src/components/CategoryBadge.test.tsx`
- [ ] T040 [US1] 🟢 GREEN: Create `src/components/CategoryBadge.tsx` with Material UI Chip, color logic
- [ ] T041 [P] [US1] 🔴 RED: Add tests for Secondary (secondary color) and Minor (gray) categories
- [ ] T042 [US1] 🟢 GREEN: Implement color switching based on category prop
- [ ] T043 [P] [US1] 🔴 RED: Add test for size prop (small/medium)
- [ ] T044 [US1] 🟢 GREEN: Implement size variants
- [ ] T045 [US1] 🔵 REFACTOR: Extract category-to-color mapping, clean up component

**Commit**: `feat(US1): add CategoryBadge component with color coding`

### TDD Cycle 7: Modal Shell & Identity Section

- [ ] T046 [P] [US1] 🔴 RED: Write test for modal rendering with terpene name in `src/components/TerpeneDetailModal.test.tsx`
- [ ] T047 [US1] 🟢 GREEN: Create `src/components/TerpeneDetailModal.tsx` with Material UI Dialog, display name
- [ ] T048 [P] [US1] 🔴 RED: Add test for CategoryBadge rendering next to name
- [ ] T049 [US1] 🟢 GREEN: Integrate CategoryBadge in modal header
- [ ] T050 [P] [US1] 🔴 RED: Add test for aroma chips with icons
- [ ] T051 [US1] 🟢 GREEN: Implement aroma section - split by comma, map to Chip with `getSourceIcon()`
- [ ] T052 [P] [US1] 🔴 RED: Add test for close button (X icon)
- [ ] T053 [US1] 🟢 GREEN: Add IconButton with CloseIcon, wire to onClose prop
- [ ] T054 [US1] 🔵 REFACTOR: Extract header section to clean structure

**Commit**: `feat(US1): add modal shell with identity section (name, category, aromas)`

### TDD Cycle 8: Description Section

- [ ] T055 [P] [US1] 🔴 RED: Write test for "What it does for you:" heading display
- [ ] T056 [US1] 🟢 GREEN: Add Typography with translated heading (i18n key)
- [ ] T057 [P] [US1] 🔴 RED: Add test for truncated description (120 chars) with "Read more..." link
- [ ] T058 [US1] 🟢 GREEN: Implement description truncation logic with useState for expansion
- [ ] T059 [P] [US1] 🔴 RED: Add test for "Show less" link after expansion
- [ ] T060 [US1] 🟢 GREEN: Implement collapse logic
- [ ] T061 [US1] 🔵 REFACTOR: Extract description component logic

**Commit**: `feat(US1): add therapeutic description with expand/collapse`

### TDD Cycle 9: Therapeutic Properties Section

- [ ] T062 [P] [US1] 🔴 RED: Write test for therapeutic properties heading "💊 Therapeutic Properties"
- [ ] T063 [US1] 🟢 GREEN: Add section with Typography heading
- [ ] T064 [P] [US1] 🔴 RED: Add test for therapeutic property chips with semantic colors
- [ ] T065 [US1] 🟢 GREEN: Map therapeuticProperties array to Chip components with `getTherapeuticColor()`
- [ ] T066 [P] [US1] 🔴 RED: Add test for chip click handler calling `onTherapeuticPropertyClick` callback
- [ ] T067 [US1] 🟢 GREEN: Wire onClick to optional callback prop
- [ ] T068 [US1] 🔵 REFACTOR: Extract chip rendering logic

**Commit**: `feat(US1): add clickable therapeutic property chips with color coding`

### TDD Cycle 10: Effects Section

- [ ] T069 [P] [US1] 🔴 RED: Write test for "Primary Effects:" heading
- [ ] T070 [US1] 🟢 GREEN: Add section with Typography heading
- [ ] T071 [P] [US1] 🔴 RED: Add test for categorized effects using `categorizeEffects(showAll=false)`
- [ ] T072 [US1] 🟢 GREEN: Call `categorizeEffects()` helper with useMemo, render categories
- [ ] T073 [P] [US1] 🔴 RED: Add test for category headers with icons (🌞, 🧠, 🧘, 🏃)
- [ ] T074 [US1] 🟢 GREEN: Render category headers with icon + name
- [ ] T075 [P] [US1] 🔴 RED: Add test for effects list (max 3 per category in Basic View)
- [ ] T076 [US1] 🟢 GREEN: Render effects as bulleted list under each category
- [ ] T077 [P] [US1] 🔴 RED: Add test for empty category filtering (no empty sections displayed)
- [ ] T078 [US1] 🟢 GREEN: Filter returns only categories with effects (already in helper)
- [ ] T079 [US1] 🔵 REFACTOR: Extract effect category rendering logic

**Commit**: `feat(US1): add categorized effects display with icons`

### TDD Cycle 11: Concentration Section

- [ ] T080 [P] [US1] 🔴 RED: Write test for concentration section with numeric range display
- [ ] T081 [US1] 🟢 GREEN: Add section showing concentrationRange value
- [ ] T082 [P] [US1] 🔴 RED: Add test for visual progress bar using `parseConcentration()`
- [ ] T083 [US1] 🟢 GREEN: Call `parseConcentration()`, render Material UI LinearProgress with percentile value
- [ ] T084 [P] [US1] 🔴 RED: Add test for concentration label (High/Moderate/Low/Trace)
- [ ] T085 [US1] 🟢 GREEN: Display label from parseConcentration result
- [ ] T086 [US1] 🔵 REFACTOR: Extract concentration visualization to clean component

**Commit**: `feat(US1): add concentration visualization with progress bar and labels`

### TDD Cycle 12: Natural Sources Section

- [ ] T087 [P] [US1] 🔴 RED: Write test for "🌿 Also found in:" heading
- [ ] T088 [US1] 🟢 GREEN: Add section with Typography heading
- [ ] T089 [P] [US1] 🔴 RED: Add test for first 3 sources displayed with icons
- [ ] T090 [US1] 🟢 GREEN: Slice sources array (first 3), map to display with `getSourceIcon()`
- [ ] T091 [US1] 🔵 REFACTOR: Clean up sources rendering

**Commit**: `feat(US1): add natural sources section with icons (first 3)`

### TDD Cycle 13: Responsive & Accessibility (Basic View)

- [ ] T092 [P] [US1] 🔴 RED: Write test for full-screen mode on mobile (<600px) using Material UI Dialog fullScreen prop
- [ ] T093 [US1] 🟢 GREEN: Use `useMediaQuery` to detect mobile, set `fullScreen={isMobile}`
- [ ] T094 [P] [US1] 🔴 RED: Add test for keyboard navigation (Tab, Escape)
- [ ] T095 [US1] 🟢 GREEN: Verify Dialog handles Escape (Material UI default), test Tab order
- [ ] T096 [P] [US1] 🔴 RED: Add test for ARIA labels (aria-labelledby, aria-describedby)
- [ ] T097 [US1] 🟢 GREEN: Add ARIA attributes to Dialog
- [ ] T098 [P] [US1] 🔴 RED: Add test for focus trap (focus stays in modal)
- [ ] T099 [US1] 🟢 GREEN: Verify Material UI Dialog focus trap works
- [ ] T100 [P] [US1] 🔴 RED: Add test for touch targets ≥48px on mobile
- [ ] T101 [US1] 🟢 GREEN: Set button/chip sizes to meet minimum (Material UI defaults sufficient)
- [ ] T102 [US1] 🔵 REFACTOR: Clean up responsive/a11y logic

**Commit**: `feat(US1): add responsive behavior and accessibility (WCAG 2.1 AA)`

### TDD Cycle 14: Performance (Basic View)

- [ ] T103 [P] [US1] 🔴 RED: Write test for <100ms render time (performance.now() timing)
- [ ] T104 [US1] 🟢 GREEN: Verify render performance, add useMemo for expensive computations (categorizedEffects, concentrationData)
- [ ] T105 [P] [US1] 🔴 RED: Add test for CLS <0.1 (layout stability)
- [ ] T106 [US1] 🟢 GREEN: Use skeleton UI pattern for loading states (prevents layout shift)
- [ ] T107 [US1] 🔵 REFACTOR: Optimize component structure for performance

**Commit**: `feat(US1): optimize performance (<100ms render, CLS <0.1)`

**Phase 3 Validation (US1 Independent Test)**:
```bash
pnpm test src/components/TerpeneDetailModal.test.tsx --grep="US1"  # All pass
pnpm dev  # Manual test:
# 1. Click terpene in table
# 2. Modal opens in Basic View
# 3. Therapeutic properties visible at top
# 4. Effects categorized with icons
# 5. Concentration bar displayed
# 6. Can identify benefits in <15 seconds ✅
```

---

## Phase 4: US2 - Deep Therapeutic Exploration (TDD)

**Goal**: Implement Expert View with toggle and three accordion sections using TDD.

**User Story**: Informed patient or healthcare provider accesses complete pharmacological information, molecular data, and research evidence.

**Independent Test**: Toggle to Expert View reveals three accordion sections (Therapeutic Details expanded by default, Molecular Properties, Research & Evidence). All data from database is accessible.

### TDD Cycle 15: View Toggle

- [ ] T108 [P] [US2] 🔴 RED: Write test for ToggleButtonGroup rendering with "Basic View" and "Expert View" buttons
- [ ] T109 [US2] 🟢 GREEN: Add Material UI ToggleButtonGroup with two ToggleButtons
- [ ] T110 [P] [US2] 🔴 RED: Add test for default state (Basic View selected)
- [ ] T111 [US2] 🟢 GREEN: Set initial useState to 'basic'
- [ ] T112 [P] [US2] 🔴 RED: Add test for toggle onChange switching viewMode state
- [ ] T113 [US2] 🟢 GREEN: Wire onChange to setViewMode(newValue)
- [ ] T114 [P] [US2] 🔴 RED: Add test for Expert View content rendering when toggled
- [ ] T115 [US2] 🟢 GREEN: Add conditional render: `{viewMode === 'expert' && <ExpertViewContent />}`
- [ ] T116 [P] [US2] 🔴 RED: Add test for vertical stacking on mobile
- [ ] T117 [US2] 🟢 GREEN: Apply responsive styles to ToggleButtonGroup (flexDirection: column on xs)
- [ ] T118 [P] [US2] 🔴 RED: Add test for screen reader announcement on toggle
- [ ] T119 [US2] 🟢 GREEN: Add aria-label to ToggleButtonGroup, verify Material UI announces state change
- [ ] T120 [P] [US2] 🔴 RED: Add test for <200ms toggle animation
- [ ] T121 [US2] 🟢 GREEN: Verify Material UI transition timing, optimize if needed
- [ ] T122 [P] [US2] 🔴 RED: Add test for prefers-reduced-motion (animation disabled)
- [ ] T123 [US2] 🟢 GREEN: Use `useMediaQuery('(prefers-reduced-motion: reduce)')`, set TransitionProps timeout to 0
- [ ] T124 [US2] 🔵 REFACTOR: Extract toggle logic, clean up state management

**Commit**: `feat(US2): add Basic/Expert view toggle with accessibility`

### TDD Cycle 16: Data Quality Badge Component

- [ ] T125 [P] [US2] 🔴 RED: Write test for `DataQualityBadge` rendering "Excellent" with green badge in `src/components/DataQualityBadge.test.tsx`
- [ ] T126 [US2] 🟢 GREEN: Create `src/components/DataQualityBadge.tsx` with Material UI Chip, color for Excellent=green
- [ ] T127 [P] [US2] 🔴 RED: Add tests for "Good" (blue) and "Limited" (orange) quality levels
- [ ] T128 [US2] 🟢 GREEN: Implement quality-to-color mapping
- [ ] T129 [P] [US2] 🔴 RED: Add test for checkmark icon on Excellent
- [ ] T130 [US2] 🟢 GREEN: Add conditional icon rendering
- [ ] T131 [US2] 🔵 REFACTOR: Extract quality config constant

**Commit**: `feat(US2): add DataQualityBadge component with color coding`

### TDD Cycle 17: Therapeutic Details Accordion

- [ ] T132 [P] [US2] 🔴 RED: Write test for "Therapeutic Details" accordion rendering in Expert View
- [ ] T133 [US2] 🟢 GREEN: Add Material UI Accordion with AccordionSummary ("Therapeutic Details" heading)
- [ ] T134 [P] [US2] 🔴 RED: Add test for defaultExpanded=true (accordion open by default)
- [ ] T135 [US2] 🟢 GREEN: Set `defaultExpanded` prop on Therapeutic Details accordion
- [ ] T136 [P] [US2] 🔴 RED: Add test for all effects displayed (no 3-effect limit) using `categorizeEffects(showAll=true)`
- [ ] T137 [US2] 🟢 GREEN: Call `categorizeEffects(effects, true)`, render all effects as chips
- [ ] T138 [P] [US2] 🔴 RED: Add test for clickable effect chips calling `onEffectClick` callback
- [ ] T139 [US2] 🟢 GREEN: Wire onClick to optional `onEffectClick` prop
- [ ] T140 [P] [US2] 🔴 RED: Add test for Notable Synergies callout (Alert with warning icon) if notableDifferences exists
- [ ] T141 [US2] 🟢 GREEN: Conditionally render Material UI Alert with notableDifferences text
- [ ] T142 [P] [US2] 🔴 RED: Add test for complete sources list (all sources, not just 3)
- [ ] T143 [US2] 🟢 GREEN: Map all sources to chips with icons
- [ ] T144 [US2] 🔵 REFACTOR: Extract accordion content to clean sections

**Commit**: `feat(US2): add Therapeutic Details accordion with all effects and sources`

### TDD Cycle 18: Molecular Properties Accordion

- [ ] T145 [P] [US2] 🔴 RED: Write test for "Molecular Properties" accordion rendering collapsed by default
- [ ] T146 [US2] 🟢 GREEN: Add Accordion without defaultExpanded
- [ ] T147 [P] [US2] 🔴 RED: Add test for molecular class display
- [ ] T148 [US2] 🟢 GREEN: Add Typography showing `terpene.molecularData.class`
- [ ] T149 [P] [US2] 🔴 RED: Add test for molecular formula with copy button
- [ ] T150 [US2] 🟢 GREEN: Add formula display + IconButton with ContentCopyIcon
- [ ] T151 [P] [US2] 🔴 RED: Add test for copy button click calling `copyToClipboard()`
- [ ] T152 [US2] 🟢 GREEN: Wire copy button onClick to `copyToClipboard(molecularFormula, onSuccess, onError)`
- [ ] T153 [P] [US2] 🔴 RED: Add test for success toast notification after copy
- [ ] T154 [US2] 🟢 GREEN: Implement onSuccess callback showing snackbar "Molecular formula copied to clipboard"
- [ ] T155 [P] [US2] 🔴 RED: Add test for molecular weight display
- [ ] T156 [US2] 🟢 GREEN: Add Typography showing `molecularData.molecularWeight` with "g/mol" unit
- [ ] T157 [P] [US2] 🔴 RED: Add test for boiling point display
- [ ] T158 [US2] 🟢 GREEN: Add Typography showing `molecularData.boilingPoint` with "°C" unit
- [ ] T159 [P] [US2] 🔴 RED: Add test for conditional isomer information (only if isomerOf exists)
- [ ] T160 [US2] 🟢 GREEN: Conditionally render Box with isomerType and isomerOf when `terpene.isomerOf !== null`
- [ ] T161 [US2] 🔵 REFACTOR: Extract molecular properties rendering to clean grid layout

**Commit**: `feat(US2): add Molecular Properties accordion with copy-to-clipboard`

### TDD Cycle 19: Research & Evidence Accordion

- [ ] T162 [P] [US2] 🔴 RED: Write test for "Research & Evidence" accordion rendering collapsed by default
- [ ] T163 [US2] 🟢 GREEN: Add Accordion without defaultExpanded
- [ ] T164 [P] [US2] 🔴 RED: Add test for DataQualityBadge rendering with `terpene.researchTier.dataQuality`
- [ ] T165 [US2] 🟢 GREEN: Integrate DataQualityBadge component in accordion
- [ ] T166 [P] [US2] 🔴 RED: Add test for "Evidence Summary:" heading
- [ ] T167 [US2] 🟢 GREEN: Add Typography with heading
- [ ] T168 [P] [US2] 🔴 RED: Add test for evidence summary text display
- [ ] T169 [US2] 🟢 GREEN: Add Typography showing `terpene.researchTier.evidenceSummary`
- [ ] T170 [P] [US2] 🔴 RED: Add test for "📚 References:" heading
- [ ] T171 [US2] 🟢 GREEN: Add Typography with heading
- [ ] T172 [P] [US2] 🔴 RED: Add test for numbered reference list
- [ ] T173 [US2] 🟢 GREEN: Map `terpene.references` to Material UI List with ListItem (numbered)
- [ ] T174 [P] [US2] 🔴 RED: Add test for reference type badges (Chip with type)
- [ ] T175 [US2] 🟢 GREEN: Add Chip showing `reference.type` next to each reference
- [ ] T176 [P] [US2] 🔴 RED: Add test for external link icon for URL references
- [ ] T177 [US2] 🟢 GREEN: Conditionally add IconButton with LaunchIcon when `reference.source.startsWith('http')`
- [ ] T178 [US2] 🔵 REFACTOR: Extract references rendering logic

**Commit**: `feat(US2): add Research & Evidence accordion with references`

### TDD Cycle 20: Accordion Interactions

- [ ] T179 [P] [US2] 🔴 RED: Write test for independent accordion expand/collapse
- [ ] T180 [US2] 🟢 GREEN: Verify Material UI Accordion allows independent control (default behavior)
- [ ] T181 [P] [US2] 🔴 RED: Add test for multiple accordions open simultaneously
- [ ] T182 [US2] 🟢 GREEN: Verify no exclusive expansion (Material UI default allows multiple open)
- [ ] T183 [P] [US2] 🔴 RED: Add test for accordion aria-labels for screen readers
- [ ] T184 [US2] 🟢 GREEN: Add aria-labelledby to AccordionSummary, aria-controls to AccordionDetails
- [ ] T185 [US2] 🔵 REFACTOR: Clean up accordion structure

**Commit**: `feat(US2): ensure accordion accessibility and independent control`

**Phase 4 Validation (US2 Independent Test)**:
```bash
pnpm test src/components/TerpeneDetailModal.test.tsx --grep="US2"  # All pass
pnpm dev  # Manual test:
# 1. Open modal, click "Expert View" toggle
# 2. Three accordions visible ✅
# 3. Therapeutic Details expanded by default ✅
# 4. All effects visible as chips ✅
# 5. Molecular formula has copy button ✅
# 6. References display with type badges ✅
```

---

## Phase 5: US3 - Filter by Therapeutic Property (TDD)

**Goal**: Implement clickable therapeutic property and effect chips that filter the main table using TDD.

**User Story**: Patient finds other terpenes with similar therapeutic properties by clicking chips in modal.

**Independent Test**: Clicking any therapeutic property chip or effect chip filters the main table and shows snackbar notification. Modal stays open.

### TDD Cycle 21: Therapeutic Property Filter Integration

- [ ] T186 [P] [US3] 🔴 RED: Write integration test for chip click triggering `onTherapeuticPropertyClick` callback with property name
- [ ] T187 [US3] 🟢 GREEN: Verify callback already wired in Phase 3 (T066-T067), test parent component integration
- [ ] T188 [P] [US3] 🔴 RED: Add test for snackbar notification "Showing terpenes with [Property] properties"
- [ ] T189 [US3] 🟢 GREEN: In parent component (TerpeneTable), implement callback that shows snackbar with i18n message
- [ ] T190 [P] [US3] 🔴 RED: Add test for table filtering (only terpenes with selected property visible)
- [ ] T191 [US3] 🟢 GREEN: In parent component, call existing filter service: `filterService.setTherapeuticProperty(property)`
- [ ] T192 [P] [US3] 🔴 RED: Add test for modal staying open after filter applied
- [ ] T193 [US3] 🟢 GREEN: Verify modal `open` state not changed by filter callback
- [ ] T194 [US3] 🔵 REFACTOR: Clean up filter integration logic

**Commit**: `feat(US3): integrate therapeutic property chip clicks with table filter`

### TDD Cycle 22: Effect Filter Integration

- [ ] T195 [P] [US3] 🔴 RED: Write integration test for effect chip click in Expert View triggering `onEffectClick` callback
- [ ] T196 [US3] 🟢 GREEN: Verify callback already wired in Phase 4 (T138-T139), test parent component integration
- [ ] T197 [P] [US3] 🔴 RED: Add test for snackbar notification "Showing terpenes with '[Effect]' effect"
- [ ] T198 [US3] 🟢 GREEN: In parent component, implement callback that shows snackbar with i18n message
- [ ] T199 [P] [US3] 🔴 RED: Add test for table filtering by specific effect
- [ ] T200 [US3] 🟢 GREEN: In parent component, call existing filter service: `filterService.setEffect(effect)`
- [ ] T201 [US3] 🔵 REFACTOR: Clean up effect filter integration

**Commit**: `feat(US3): integrate effect chip clicks with table filter`

### TDD Cycle 23: Modal Close Behaviors

- [ ] T202 [P] [US3] 🔴 RED: Write test for X button closing modal
- [ ] T203 [US3] 🟢 GREEN: Verify IconButton onClick calls onClose (already implemented in T052-T053)
- [ ] T204 [P] [US3] 🔴 RED: Add test for Escape key closing modal
- [ ] T205 [US3] 🟢 GREEN: Verify Material UI Dialog handles Escape (default behavior)
- [ ] T206 [P] [US3] 🔴 RED: Add test for backdrop click closing modal
- [ ] T207 [US3] 🟢 GREEN: Verify Dialog onClose prop handles backdrop click (default behavior)
- [ ] T208 [P] [US3] 🔴 RED: Add test for focus restoration to triggering element on close
- [ ] T209 [US3] 🟢 GREEN: Verify Material UI Dialog restores focus (default behavior)
- [ ] T210 [US3] 🔵 REFACTOR: Document modal close behaviors

**Commit**: `feat(US3): verify modal close behaviors (X, Escape, backdrop)`

**Phase 5 Validation (US3 Independent Test)**:
```bash
pnpm test tests/integration/terpene-modal-interactions.test.ts --grep="US3"  # All pass
pnpm dev  # Manual test:
# 1. Open modal, click "Anxiolytic" chip
# 2. Snackbar shows "Showing terpenes with Anxiolytic properties" ✅
# 3. Table filtered to anxiolytic terpenes ✅
# 4. Modal stays open ✅
# 5. Click X button, modal closes ✅
```

---

## Phase 6: US4 - Category Badge Information (TDD)

**Goal**: Add tooltip to category badge explaining what Core/Secondary/Minor means using TDD.

**User Story**: User understands category badge meaning without leaving modal.

**Independent Test**: Hovering over category badge displays tooltip with explanation.

### TDD Cycle 24: Category Badge Tooltip

- [ ] T211 [P] [US4] 🔴 RED: Write test for CategoryBadge showing tooltip on hover
- [ ] T212 [US4] 🟢 GREEN: Wrap CategoryBadge in Material UI Tooltip component in modal
- [ ] T213 [P] [US4] 🔴 RED: Add test for "Core" tooltip text: "High-prevalence, clinically well-defined terpenes"
- [ ] T214 [US4] 🟢 GREEN: Add Tooltip title prop with Core explanation (i18n key)
- [ ] T215 [P] [US4] 🔴 RED: Add tests for "Secondary" and "Minor" tooltip texts
- [ ] T216 [US4] 🟢 GREEN: Implement conditional tooltip text based on category prop
- [ ] T217 [P] [US4] 🔴 RED: Add test for tooltip placement (bottom)
- [ ] T218 [US4] 🟢 GREEN: Set Tooltip placement prop
- [ ] T219 [US4] 🔵 REFACTOR: Extract tooltip texts to i18n, clean up

**Commit**: `feat(US4): add category badge tooltip with explanations`

**Phase 6 Validation (US4 Independent Test)**:
```bash
pnpm test src/components/CategoryBadge.test.tsx --grep="tooltip"  # Pass
pnpm dev  # Manual test:
# 1. Open modal, hover over "Core" badge
# 2. Tooltip shows "High-prevalence, clinically well-defined terpenes" ✅
```

---

## Phase 7: US5 - Concentration Context (TDD)

**Goal**: Add tooltip to concentration bar explaining percentile labels using TDD.

**User Story**: User understands concentration value practical meaning.

**Independent Test**: Hovering over concentration bar displays tooltip with context.

### TDD Cycle 25: Concentration Tooltip

- [ ] T220 [P] [US5] 🔴 RED: Write test for concentration section showing tooltip on hover
- [ ] T221 [US5] 🟢 GREEN: Wrap concentration Box in Material UI Tooltip
- [ ] T222 [P] [US5] 🔴 RED: Add test for "High concentration" tooltip text: "Top 25% for Core terpenes"
- [ ] T223 [US5] 🟢 GREEN: Generate tooltip text from concentration label and category: `"${label} concentration - ${getTooltipText(label, category)}"`
- [ ] T224 [P] [US5] 🔴 RED: Add tests for Moderate, Low, Trace tooltip texts
- [ ] T225 [US5] 🟢 GREEN: Implement `getConcentrationTooltipText()` helper with label and category-specific messages
- [ ] T226 [US5] 🔵 REFACTOR: Extract tooltip generation logic, add i18n keys

**Commit**: `feat(US5): add concentration tooltip with percentile explanations`

**Phase 7 Validation (US5 Independent Test)**:
```bash
pnpm test src/components/TerpeneDetailModal.test.tsx --grep="concentration.*tooltip"  # Pass
pnpm dev  # Manual test:
# 1. Open modal with high-concentration terpene
# 2. Hover over concentration bar
# 3. Tooltip shows "High concentration - top 25% for Core terpenes" ✅
```

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final integration, performance optimization, accessibility verification, and E2E testing.

**Independent Test**: All user stories work together seamlessly. Performance targets met. Accessibility audit passes. E2E tests pass.

### Integration & Parent Component Updates

- [ ] T227 Update `src/components/visualizations/TerpeneTable.tsx` import path from `'./TerpeneDetailModal'` to `'../TerpeneDetailModal'`
- [ ] T228 [P] Add `onTherapeuticPropertyClick` and `onEffectClick` props to TerpeneDetailModal invocation in TerpeneTable
- [ ] T229 Implement filter callbacks in TerpeneTable using existing filter service
- [ ] T230 [P] Add snackbar/toast notifications for filter feedback (use Material UI Snackbar or existing notification system)
- [ ] T231 Test modal integration with TerpeneTable (open, filter, close flows)

### Performance Optimization

- [ ] T232 [P] Add useMemo for `categorizedEffects` computation (both Basic and Expert views)
- [ ] T233 [P] Add useMemo for `concentrationData` computation
- [ ] T234 Verify modal render time <100ms using React DevTools Profiler
- [ ] T235 [P] Verify toggle animation <200ms
- [ ] T236 Measure Cumulative Layout Shift (CLS) score <0.1 using Lighthouse
- [ ] T237 [P] Implement skeleton loading UI for modal content (prevents layout shift)
- [ ] T238 Optimize bundle size: verify lazy-loading strategy for Expert View (if needed)

### Accessibility Audit

- [ ] T239 Run jest-axe tests on all components (`pnpm test -- --grep="accessibility"`)
- [ ] T240 [P] Verify color contrast ratios ≥4.5:1 using browser DevTools Color Picker: Check all therapeutic property chips (FR-056 colors), category headers (FR-057 colors), text on backgrounds; document results in accessibility-audit.md
- [ ] T241 [P] Test full keyboard navigation: Tab through all interactive elements, Escape to close
- [ ] T242 Test screen reader compatibility: NVDA (Windows) or VoiceOver (Mac)
- [ ] T243 [P] Verify prefers-reduced-motion disables animations (set in OS, test toggle)
- [ ] T244 [P] Verify touch targets ≥48x48px on mobile (iPhone SE viewport in DevTools)
- [ ] T245 Verify focus trap works (Tab doesn't leave modal when open)
- [ ] T246 Verify focus restoration (focus returns to triggering element on close)
- [ ] T247 Run Lighthouse accessibility audit (target score ≥95)
- [ ] T247a Document color contrast validation results: Create `docs/accessibility-audit-007.md` with contrast ratios for all therapeutic property colors (from FR-056) and effect category colors (from FR-057) against white text backgrounds

### E2E Testing (Playwright - use playwright-planner and playwright-generator agents)

- [ ] T248 Create E2E test plan for all 5 user stories using playwright-planner agent
- [ ] T249 [P] Generate E2E test: US1 - Quick Therapeutic Assessment (open modal, verify Basic View content, <15 sec scan)
- [ ] T250 [P] Generate E2E test: US2 - Deep Therapeutic Exploration (toggle to Expert View, expand accordions, verify data)
- [ ] T251 [P] Generate E2E test: US3 - Filter by Therapeutic Property (click chip, verify table filter, snackbar, modal stays open)
- [ ] T252 [P] Generate E2E test: US4 - Category Badge Information (hover badge, verify tooltip)
- [ ] T253 [P] Generate E2E test: US5 - Concentration Context (hover concentration bar, verify tooltip)
- [ ] T254 Run all E2E tests: `pnpm test:e2e tests/e2e/terpene-modal-flows.spec.ts`

### User Testing (Manual - SC-007 Validation)

- [ ] T254a Recruit 10-12 medical cannabis patients or caregivers for user testing sessions (per User Testing Plan in spec.md)
- [ ] T254b Conduct think-aloud sessions: participants open modals for 3 terpenes, identify therapeutic uses within 30 seconds
- [ ] T254c Collect data: video recordings, facilitator notes, post-task questionnaire (confidence rating 1-5, open-ended feedback)
- [ ] T254d Analyze results: calculate success rate (participants correctly identifying ≥2 therapeutic properties), identify friction points
- [ ] T254e Document findings in `docs/user-testing-007-results.md` with recommendations for iteration if <85% success rate

### Final Validation

- [ ] T255 Run full test suite: `pnpm test` (all unit + integration tests pass)
- [ ] T256 Run type checking: `pnpm type-check` (no TypeScript errors)
- [ ] T257 Run linting: `pnpm lint` (no ESLint errors)
- [ ] T258 Run formatting: `pnpm format` (code formatted)
- [ ] T259 Generate test coverage report: `pnpm test:coverage` (verify ≥80% coverage)
- [ ] T260 Build production bundle: `pnpm build` (succeeds without errors)
- [ ] T261 Verify bundle size within budget (~500KB gzipped total)
- [ ] T262 Manual smoke test: Open modal for 5 different terpenes, test all interactions
- [ ] T263 Mobile smoke test: Test on iPhone viewport (full-screen modal, vertical toggle, 48px targets)
- [ ] T264 Cross-browser testing: Chrome, Firefox, Safari (if available)

### Documentation & Cleanup

- [ ] T265 Update component documentation in code (JSDoc comments)
- [ ] T266 [P] Verify all i18n keys used (no hard-coded strings)
- [ ] T267 [P] Add README or inline comments explaining TDD approach taken
- [ ] T268 Git: Squash/organize commits into logical feature commits (optional)
- [ ] T269 Create pull request with comprehensive description and screenshots
- [ ] T270 Update CHANGELOG.md with feature addition

**Phase 8 Validation (Complete Feature Test)**:
```bash
# Full validation
pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e && pnpm build

# Lighthouse audit
# Open http://localhost:5173 after `pnpm dev`
# Run Lighthouse in Chrome DevTools
# Verify scores: Performance ≥90, Accessibility ≥95

# Test coverage
pnpm test:coverage
# Verify overall coverage ≥80%
```

---

## Dependencies & Execution Order

### User Story Completion Order

```
Phase 1: Setup (blocking)
  ↓
Phase 2: Foundational (blocking - required by all stories)
  ↓
Phase 3: US1 ───────────────┐
  ↓                          │
Phase 4: US2 (depends on US1)│
  ↓                          │
Phase 5: US3 (depends on US1+US2)
  ↓                          │
Phase 6: US4 (depends on US1)│
  ↓                          │
Phase 7: US5 (depends on US1)│
  ↓                          ↓
Phase 8: Polish (depends on all)
```

**Independent User Stories**: US4, US5 can be implemented in parallel after US1 completes.

**Dependent User Stories**: US2 requires US1 (needs Basic View + toggle), US3 requires US1+US2 (needs chips from both views).

### Parallel Execution Opportunities

Within each phase, tasks marked with **[P]** can be executed in parallel:

**Phase 2 (Foundational)**:
- Tests can be written in parallel for different helpers (T007, T013, T020, T027, T032)
- Implementation after tests must be sequential per helper (RED→GREEN→REFACTOR)

**Phase 3 (US1)**:
- Component tests can be written in parallel (T039, T046, T055, T062, T069, T080, T087, T092, T103)
- Implementation within each TDD cycle must be sequential

**Phase 4 (US2)**:
- Similar parallel test writing opportunities for toggle, accordions, and badge components

**Phase 8 (Polish)**:
- Most validation tasks (T240-T247, T249-T253) can run in parallel once implementation complete

---

## TDD Validation Checklist

**Before marking feature complete, verify TDD discipline**:

### Process Verification
- [ ] Every function has tests written BEFORE implementation (RED first)
- [ ] Every component has tests written BEFORE JSX rendering
- [ ] Git history shows RED→GREEN→REFACTOR commit pattern (~40 commits)
- [ ] No production code exists without corresponding test
- [ ] Test coverage ≥80% achieved through TDD (not retrofitted)

### Coverage Verification
```bash
pnpm test:coverage
# Verify coverage targets:
# - src/utils/terpeneHelpers.ts: 100%
# - src/constants/therapeuticColors.ts: 100%
# - src/components/TerpeneDetailModal.tsx: ≥90%
# - src/components/CategoryBadge.tsx: 100%
# - src/components/DataQualityBadge.tsx: 100%
# - Overall: ≥80%
```

### Quality Verification
- [ ] All tests pass: `pnpm test`
- [ ] All E2E tests pass: `pnpm test:e2e`
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`

---

## MVP Scope (Recommended First Delivery)

**Minimal Viable Product**: Phase 1-3 only (US1 - Quick Therapeutic Assessment)

This delivers core value: medical patients can view therapeutic information in an accessible modal.

**MVP Tasks**: T001-T107 (107 tasks)  
**MVP Effort**: 1-2 days with TDD discipline  
**MVP Test**: User can open modal, see therapeutic properties, categorized effects, concentration data  

**Incremental Delivery**:
1. **MVP**: US1 only → Get feedback
2. **v2**: Add US2 (Expert View) → Scientific depth
3. **v3**: Add US3 (Filtering) → Discovery workflows
4. **v4**: Add US4+US5 (Tooltips) → Enhanced UX
5. **Polish**: Phase 8 → Production-ready

---

## Task Format Validation

✅ **All tasks follow required format**:
- Checkbox: `- [ ]`
- Task ID: T001, T002, T003...
- [P] marker: For parallelizable tasks
- [Story] label: [US1], [US2], [US3], [US4], [US5] (where applicable)
- Description: Clear action with file path

**Example**: `- [ ] T062 [P] [US1] 🔴 RED: Write test for therapeutic properties heading "💊 Therapeutic Properties"`

---

## Summary

**Total Tasks**: 270  
**TDD Cycles**: ~40 RED→GREEN→REFACTOR cycles  
**Parallelizable**: 94 tasks marked [P]  
**User Stories**: 5 (US1-US5)  
**Independent Tests**: Each story has validation criteria  
**MVP Scope**: Phases 1-3 (107 tasks, US1 only)  

**Execution Approach**: Strict TDD with incremental delivery. Start with MVP (US1), validate, then add US2-US5 based on feedback.

**Next Steps**:
1. Start Phase 1: Remove old modal, setup i18n keys
2. Begin Phase 2: TDD helpers (start with T007 - RED test for getTherapeuticColor)
3. Continue Phase 3: TDD Basic View components
4. Validate US1 independently before proceeding to US2

🎯 **Remember**: RED (test) → GREEN (code) → REFACTOR (clean) → COMMIT → Repeat!
