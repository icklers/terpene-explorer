# Implementation Plan: Enhanced Terpene Data Model with Detailed Info Display

**Branch**: `002-terpene-data-model` | **Date**: 2025-10-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-terpene-data-model/spec.md`

**Note**: This plan has been updated to incorporate clarifications from `/speckit.clarify` session on 2025-10-25.

## Summary

This feature migrates the terpene explorer application to use a new comprehensive data model from `data/terpene-database.json`. Users will be able to click on terpene rows in the table to view detailed information (effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, sources) in a modal. The table view will be streamlined by removing the sources column, and the search bar will be repositioned to the site header for better accessibility. All data will be sourced from the new JSON database containing 30+ terpenes with rich metadata including chemical properties, therapeutic information, and research citations.

**Clarifications Applied**:
- Detail view updates content in place when user clicks different rows (no close/reopen animation)
- Validation error message: "Data format error. Please open an issue on GitHub: `https://github.com/icklers/terpene-explorer/issues`"

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 24 LTS, ES2022 target
**Primary Dependencies**: React 19.2+, Material UI 6.3+, D3.js 7.9+, i18next 25+, Zod 3.24+ (schema validation), js-yaml 4.1+
**Storage**: Static JSON files in `/data` directory (no database required)
**Testing**: Vitest 4+ (unit/integration), Playwright 1.49+ (E2E), vitest-axe (accessibility)
**Target Platform**: Web browsers (static SPA deployed to Azure Static Web Apps)
**Project Type**: Web application (frontend-only, static deployment)
**Performance Goals**:
  - Lighthouse Performance ≥90, Accessibility ≥95
  - Search/filter response <200ms for 500 terpenes
  - Detail view render <300ms (including in-place content updates)
  - Table/chart render <500ms
**Constraints**:
  - Bundle size ≤500KB gzipped
  - WCAG 2.1 Level AA compliance
  - Static-only (no backend/database)
  - Client-side data processing only
**Scale/Scope**:
  - 30+ terpenes in initial database (expandable to 500)
  - Single-page application with table, chart, and detail views
  - Multi-language support (en, de minimum)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Gate 1: Accessibility Requirements**

- [x] WCAG 2.1 Level AA compliance documented (FR-010, SC-010)
- [x] 4.5:1 contrast ratio specified for all color choices (Material UI default themes comply)
- [x] Keyboard navigation plan documented (FR-006: modal/dialog must be keyboard accessible)
- [x] Screen reader support considered (Material UI components provide baseline ARIA support)
- [x] vitest-axe included in test strategy (already in devDependencies)

✅ **Gate 2: Performance Budgets**

- [x] Lighthouse score targets defined (Performance ≥90, Accessibility ≥95 in Technical Context)
- [x] Response time targets specified (<200ms filters, <300ms detail view, <500ms renders)
- [x] Bundle size budget considered (≤500KB gzipped in constraints)
- [x] Virtualization plan for large lists (react-window already available for tables >100 items)

✅ **Gate 3: Testing Strategy**

- [x] Unit test framework identified (Vitest 4+ in Technical Context)
- [x] E2E test framework identified (Playwright 1.49+ in Technical Context)
- [x] Accessibility test tool identified (vitest-axe in Technical Context)
- [x] Test coverage target defined (≥80% for critical paths per constitution)

✅ **Gate 4: Component Reuse**

- [x] Material UI components specified for UI elements (Modal/Dialog for detail view, existing table components)
- [x] Custom components justified (D3.js visualizations already exist for sunburst chart)
- [x] No reinvention of existing Material UI components (will use MUI Dialog/Modal, chips, typography)

✅ **Gate 5: Static Architecture**

- [x] No backend server dependencies (static SPA deployment confirmed)
- [x] Data source is static files (data/terpene-database.json confirmed)
- [x] Deployment target is static hosting (Azure Static Web Apps confirmed)
- [x] No database or API required (client-side processing only)

✅ **Gate 6: Internationalization**

- [x] i18next library included (i18next 25+ in dependencies)
- [x] Supported languages specified (en, de minimum in Technical Context)
- [x] Translation files location documented (existing src/i18n/locales/ structure)
- [x] No hard-coded user-facing strings (all detail view labels and error messages will use i18next)

**Initial Assessment**: All gates PASS. No constitution violations identified.

---

**Post-Design Re-evaluation** (after Phase 1):

✅ **Gate 1: Accessibility Requirements** - PASS
- Detail modal uses Material UI Dialog with full ARIA support
- Keyboard navigation implemented (Enter/Space on table rows, ESC to close)
- Focus management handled by MUI Dialog automatically
- All sections use semantic HTML (h2, ul, section)
- vitest-axe tests planned for detail modal
- In-place content updates maintain focus and screen reader context

✅ **Gate 2: Performance Budgets** - PASS
- React.lazy() + Suspense for detail modal (reduces initial bundle)
- Zod validation runs once on load (not on every render)
- Memoization strategy documented (React.memo for modal)
- In-place content updates avoid modal close/reopen overhead
- Expected bundle impact: +15KB (Zod schema + modal component)
- All target times achievable (<200ms search, <300ms modal, <500ms render)

✅ **Gate 3: Testing Strategy** - PASS
- Unit tests: terpeneSchema.test.ts, terpeneData.test.ts, TerpeneDetailModal.test.tsx
- Integration tests: terpene-workflow.test.tsx (table → modal flow, rapid clicks)
- E2E tests: terpene-details.spec.ts (full user journey including error states)
- Accessibility tests: vitest-axe for modal component
- All tests documented in quickstart.md

✅ **Gate 4: Component Reuse** - PASS
- Uses MUI Dialog (not custom modal)
- Uses MUI Chip, Typography, Divider, Button, Alert (for error messages)
- No custom UI components created
- D3.js visualizations untouched (existing)

✅ **Gate 5: Static Architecture** - PASS
- Data loaded from static JSON (data/terpene-database.json)
- No backend/API calls
- Dynamic import for JSON (Vite handles as static asset)
- Deployable to Azure Static Web Apps without changes
- Error boundary for load failures (GitHub link in error message)

✅ **Gate 6: Internationalization** - PASS
- i18n keys added for 7 detail field labels + error messages
- Translation files created: en/terpene-details.json, de/terpene-details.json
- Error message includes GitHub link (language-agnostic URL)
- No hard-coded strings in modal component
- Scientific content (terpene data) remains in English as documented

**Final Assessment**: All gates continue to PASS after design and clarifications. Implementation adheres to constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/002-terpene-data-model/
├── spec.md              # Feature specification (with clarifications)
├── plan.md              # This file (/speckit.plan command output, updated)
├── research.md          # Phase 0 output (updated with clarifications)
├── data-model.md        # Phase 1 output (updated with clarifications)
├── quickstart.md        # Phase 1 output (updated with clarifications)
├── contracts/           # Phase 1 output (updated with clarifications)
│   └── data-service.md
├── checklists/
│   └── requirements.md  # Spec quality validation
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx              # Search bar will be moved here
│   ├── visualizations/
│   │   ├── TerpeneTable.tsx        # Modified: remove sources column, add row click
│   │   └── TerpeneDetailModal.tsx  # NEW: detail view component (in-place updates)
│   └── filters/
│       └── SearchBar.tsx           # Modified: styling for header placement
├── services/
│   └── terpeneData.ts              # NEW/Modified: load from terpene-database.json with error handling
├── types/
│   └── terpene.ts                  # NEW/Modified: updated types for new schema
├── hooks/
│   └── useTerpeneData.ts           # Modified: integrate new data source
├── utils/
│   ├── terpeneSchema.ts            # NEW: Zod schema for validation
│   └── dataValidation.ts           # NEW: JSON schema validation utilities
└── i18n/
    └── locales/
        ├── en/
        │   └── terpene-details.json # NEW: translations for detail fields + error messages
        └── de/
            └── terpene-details.json # NEW: translations for detail fields + error messages

data/
└── terpene-database.json           # NEW: comprehensive terpene database (already exists)

tests/
├── unit/
│   ├── services/
│   │   └── terpeneData.test.ts     # NEW: test data loading, validation & errors
│   ├── utils/
│   │   └── terpeneSchema.test.ts   # NEW: test Zod schema
│   └── components/
│       └── TerpeneDetailModal.test.tsx # NEW: detail modal tests (in-place updates)
├── integration/
│   └── terpene-workflow.test.tsx   # NEW: table click → detail view flow + rapid clicks
└── e2e/
    └── terpene-details.spec.ts     # NEW: E2E test for detail view + error scenarios
```

**Structure Decision**: This is a single-page web application (frontend only). The existing `src/` structure follows React best practices with separation of concerns: components for UI, services for data access, types for TypeScript definitions, hooks for reusable logic, and utils for shared functions. Tests mirror the source structure with unit, integration, and E2E coverage.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All gates pass without requiring complexity justification.

---

## Clarification Impact Analysis

### Clarification 1: In-Place Content Updates

**Specification Change**: Detail view updates content in place when user clicks different terpene rows

**Impact on Design**:
- **Component Architecture**: Modal component must be controlled (single instance, not recreated)
- **State Management**: Modal `open` state separate from `selectedTerpene` state
- **Performance**: Eliminates close/reopen animation overhead (~200ms savings)
- **User Experience**: Smoother transition, maintains scroll position
- **Testing**: Adds integration test for rapid row clicks

**Updated Artifacts**:
- ✅ research.md - Updated modal pattern to emphasize controlled component
- ✅ data-model.md - No changes needed (data model unchanged)
- ✅ contracts/data-service.md - Updated TerpeneDetailModalProps behavior notes
- ✅ quickstart.md - Updated Step 6 implementation code for in-place updates

### Clarification 2: Specific Error Message

**Specification Change**: Validation error displays "Data format error. Please open an issue on GitHub: `https://github.com/icklers/terpene-explorer/issues`"

**Impact on Design**:
- **Error Handling**: Specific error message replaces generic "validation failed"
- **User Guidance**: Provides actionable next step (GitHub issue)
- **Internationalization**: Error message needs translation keys
- **Error Boundary**: Must display formatted message with clickable link

**Updated Artifacts**:
- ✅ research.md - Updated error handling section with specific message
- ✅ data-model.md - Updated error handling contract
- ✅ contracts/data-service.md - Updated error response format
- ✅ quickstart.md - Updated error message in implementation code

## Planning Summary

### Artifacts Generated & Updated

1. **plan.md** (this file) - Updated with clarification impact analysis
2. **research.md** - Updated with in-place modal pattern and specific error messaging
3. **data-model.md** - Updated error handling contract
4. **contracts/data-service.md** - Updated modal behavior and error formats
5. **quickstart.md** - Updated implementation code for both clarifications
6. **CLAUDE.md** - Technology stack already current (no changes needed)

### Key Design Decisions (with Clarifications)

| Decision Area | Choice | Rationale | Clarification Impact |
|---------------|--------|-----------|---------------------|
| Schema Validation | Zod | TypeScript-first, runtime validation, type inference | Error message now specific |
| Detail View UI | Material UI Dialog (controlled) | Accessible, responsive, single instance | **In-place updates** |
| Modal Behavior | Controlled component | State management flexibility | **Enables rapid clicks** |
| Table Interaction | Row onClick | Simple, familiar, keyboard accessible | Triggers in-place update |
| Error UX | Alert with GitHub link | Actionable user guidance | **Specific message defined** |
| Search Placement | Header AppBar | Persistent access, UX patterns | No change |
| Data Loading | Dynamic import + validation | Code splitting, type-safe | Error message updated |
| i18n Strategy | Field labels + errors | Complete localization | **Error message added** |
| Performance | React.lazy + memo | Bundle optimization | In-place updates optimize further |

### Implementation Scope (Updated)

**New Files**: 9
- `src/utils/terpeneSchema.ts`
- `src/components/visualizations/TerpeneDetailModal.tsx` (controlled component)
- `src/i18n/locales/en/terpene-details.json` (with error messages)
- `src/i18n/locales/de/terpene-details.json` (with error messages)
- 5 test files (unit, integration with rapid click tests, E2E with error scenarios)

**Modified Files**: 5
- `src/types/terpene.ts` (modal props updated for controlled behavior)
- `src/services/terpeneData.ts` (specific error message)
- `src/hooks/useTerpeneData.ts`
- `src/components/visualizations/TerpeneTable.tsx`
- `src/components/layout/Header.tsx`

**Estimated Effort**: ~3 hours (unchanged - clarifications simplify implementation)

### Next Steps

1. ✅ Specification clarified (`/speckit.clarify`)
2. ✅ Planning complete with clarifications (`/speckit.plan`)
3. ⏭️ Run `/speckit.tasks` to generate actionable task breakdown
4. ⏭️ Begin implementation following updated quickstart.md
5. ⏭️ Run tests continuously during development
6. ⏭️ Create PR when verification checklist passes

### Constitution Compliance

All 6 constitution gates passed both pre-design and post-design evaluation:
- ✅ Accessibility (WCAG 2.1 AA via MUI Dialog, in-place updates maintain context)
- ✅ Performance (budgets met with React.lazy, in-place updates optimize further)
- ✅ Testing (Vitest + Playwright + vitest-axe, rapid click tests added)
- ✅ Component Reuse (Material UI components only, controlled Dialog pattern)
- ✅ Static Architecture (no backend/database, error boundaries for failures)
- ✅ Internationalization (i18next en/de, error messages localized)

No complexity violations or justifications required.
