# Implementation Plan: Table Column Simplification

**Branch**: `007-table-column-simplification` | **Date**: 2025-11-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-table-column-simplification/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Simplify the terpene table by replacing the Sources column with a Category column (Core/Secondary/Minor) and implementing category-based default sorting with alphabetical secondary sort within each category group. The table will display only Name, Aroma, Effects, and Category columns, with Core terpene names displayed in bold font weight.

## Technical Context

**Language/Version**: TypeScript 5.7.2, Node.js 24 LTS, ES2022 target  
**Primary Dependencies**: React 19.2.0, Material UI 6.3.0, Emotion 11.13.5, i18next 25.6.0, Zod 3.24.1  
**Storage**: Static JSON files (`/data/terpene-database.json` with category field already present)  
**Testing**: Vitest 4.0.3 (unit/integration), Playwright 1.49.1 (E2E), vitest-axe (accessibility)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), responsive design (mobile/tablet/desktop)  
**Project Type**: Web application (single-page React app with frontend-only architecture)  
**Performance Goals**: Table rendering <500ms for datasets up to 100 terpenes, sort operations <100ms  
**Constraints**: WCAG 2.1 Level AA compliance, Lighthouse Performance ≥90, <500KB gzipped bundle  
**Scale/Scope**: ~50 terpenes in database, single table component modification, 4 columns total

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Gate 1: Accessibility Requirements**

- [x] WCAG 2.1 Level AA compliance documented (existing table accessibility maintained, sortable columns with ARIA labels)
- [x] 4.5:1 contrast ratio specified (using existing Material UI theme with compliant colors)
- [x] Keyboard navigation plan documented (existing table keyboard navigation preserved)
- [x] Screen reader support considered (ARIA sort labels, column headers, table semantics)
- [x] vitest-axe included in test strategy (existing accessibility test infrastructure)

✅ **Gate 2: Performance Budgets**

- [x] Lighthouse score targets defined (Performance ≥90, Accessibility ≥95 - no regression expected)
- [x] Response time targets specified (<100ms sort operations, <500ms table render - existing targets)
- [x] Bundle size budget considered (~500KB gzipped total - minimal impact, removing Sources column logic)
- [x] Virtualization plan for large lists (existing react-window integration ready for >100 items)

✅ **Gate 3: Testing Strategy**

- [x] Unit test framework identified (Vitest 4.0.3 - updating existing TerpeneTable.test.tsx)
- [x] E2E test framework identified (Playwright 1.49.1 - updating table interaction tests)
- [x] Accessibility test tool identified (vitest-axe - verifying sortable table accessibility)
- [x] Test coverage target defined (≥80% for critical paths - updating existing 100% coverage)

✅ **Gate 4: Component Reuse**

- [x] Material UI components specified (Table, TableCell, TableSortLabel, Chip - all existing)
- [x] Custom components justified (None - modifying existing TerpeneTable component only)
- [x] No reinvention of existing Material UI components (leveraging TableSortLabel for category sorting)

✅ **Gate 5: Static Architecture**

- [x] No backend server dependencies (pure client-side modification)
- [x] Data source is static files (`/data/terpene-database.json` already contains category field)
- [x] Deployment target is static hosting (Vercel/Netlify/GitHub Pages - no change)
- [x] No database or API required (reading from existing static JSON)

✅ **Gate 6: Internationalization**

- [x] i18next 25.6.0 included (existing internationalization infrastructure)
- [x] Supported languages specified (en, de - adding `table.category` translation key)
- [x] Translation files location documented (`src/i18n/locales/en.json`, `de.json`)
- [x] No hard-coded user-facing strings (using `t('table.category')` for Category column header)

**Status**: All gates PASSED. No constitution violations. This is a simplification feature that reduces complexity
by removing one column and leveraging existing data model fields.

---

### Post-Design Re-check (Phase 1 Complete)

After completing research, data model, and contract design, re-verified all constitution gates:

✅ **Gate 1: Accessibility** - PASS
- Category column uses Material UI TableSortLabel with built-in ARIA support
- Bold Core names maintain same contrast ratio as regular text
- All keyboard navigation and screen reader support preserved

✅ **Gate 2: Performance** - PASS  
- Category sorting adds negligible overhead (O(n log n) with efficient rank lookup)
- Removal of Sources column reduces DOM nodes by 20% (250 → 200 cells)
- No performance degradation expected; likely minor improvement

✅ **Gate 3: Testing** - PASS
- Test strategy defined: update existing unit/integration tests, add new E2E tests
- vitest-axe accessibility tests will verify sortable table accessibility
- Coverage target maintained at ≥80%

✅ **Gate 4: Component Reuse** - PASS
- Uses existing Material UI TableSortLabel component for category sorting
- No custom UI components needed
- Leverages existing i18n infrastructure (useTranslation hook)

✅ **Gate 5: Static Architecture** - PASS
- Pure client-side modification, no backend changes
- Category field already exists in static JSON data
- No new data files or API endpoints needed

✅ **Gate 6: Internationalization** - PASS
- Translation keys defined for category column and category labels
- Follows existing i18n pattern (t('table.category'), t('table.categoryCore'), etc.)
- German translations provided (Kategorie, Kern, Sekundär, Gering)

**Post-Design Status**: ✅ ALL GATES PASSED. Design adheres to all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── visualizations/
│       └── TerpeneTable.tsx         # MODIFIED: Remove Sources column, add Category column, implement category sorting
├── i18n/
│   └── locales/
│       ├── en.json                  # MODIFIED: Add table.category translation
│       └── de.json                  # MODIFIED: Add table.category translation
├── types/
│   └── terpene.ts                   # VERIFIED: Category field already present in Terpene type
└── utils/
    └── terpeneSchema.ts             # VERIFIED: Category enum already defined

data/
└── terpene-database.json            # VERIFIED: Category field already populated for all terpenes

tests/
├── unit/
│   └── components/
│       └── TerpeneTable.test.tsx    # MODIFIED: Update tests for 4 columns, category sorting
├── integration/
│   └── us5-table-interactions.test.tsx  # MODIFIED: Update integration tests for new column layout
└── e2e/
    └── table-sorting.spec.ts        # NEW: E2E tests for category-based sorting
```

**Structure Decision**: Single project web application structure. All modifications are isolated to the existing
`TerpeneTable` component, translation files, and corresponding test files. No new files needed except E2E tests for
category sorting behavior. The data model already supports the category field, so no schema or data changes required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No complexity violations.** This feature actually reduces complexity by:

1. Removing the Sources column (simplification)
2. Leveraging existing category field from data model (no new schema needed)
3. Using existing Material UI TableSortLabel component (no custom sort UI)
4. Reusing existing translation infrastructure (minimal new i18n keys)

This aligns perfectly with KISS and YAGNI principles from the constitution.
