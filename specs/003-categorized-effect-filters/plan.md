# Implementation Plan: Categorized Effect Filters

**Branch**: `003-categorized-effect-filters` | **Date**: 2025-10-26 | **Spec**: [spec.md](./spec.md) | **GitHub Issue**: [#29](https://github.com/icklers/terpene-explorer/issues/29)

**Input**: Feature specification from `/specs/003-categorized-effect-filters/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement categorized effect filters that organize 19 therapeutic effects into 4 color-coded categories (Mood & Energy ⚡, Cognitive &
Mental Enhancement 🧠, Relaxation & Anxiety Management 😌, Physical & Physiological Management 💪) with both visual organization and
category-level filtering functionality. Users can filter terpenes by entire categories or individual effects within categories, with
intuitive OR/AND logic resolution and automatic filter state consistency management.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 24 LTS, ES2022 target  
**Primary Dependencies**: React 19.2+, Material UI 6.3+, Emotion 11.13+ (styling), Zod 3.24+ (schema validation)  
**Storage**: Static JSON files in `/data` directory (terpene-database.json with effect categorization)  
**Testing**: Vitest 4+ (unit/integration), React Testing Library 16.3+, Playwright 1.49+ (E2E), vitest-axe (accessibility)  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive 320px-2560px  
**Project Type**: Web application (frontend-only single-page app, static deployment to Azure Static Web Apps)  
**Performance Goals**:

- Filter interaction response <100ms
- Category accordion expand/collapse <50ms on mobile
- Color theme application <16ms (60fps)
- Initial filter panel render <200ms

**Constraints**:

- WCAG 2.1 Level AA contrast ratio 4.5:1 for category colors
- Category emoticons must have ARIA labels
- Filter state must persist across sessions (localStorage)
- Mobile accordion UI for screens <480px
- Minimal bundle size increase (<5KB gzipped, reuse existing Material UI components)

**Scale/Scope**:

- 4 effect categories (fixed)
- 19 effects total (from normalized database)
- Category-level + individual effect filtering with OR/AND logic
- Light/dark theme support for category colors

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Gate 1: Component Reuse & Material UI Alignment**

- [x] Using existing Material UI components (Accordion, Checkbox, Chip, Typography, Divider) - no custom components needed
- [x] No reinvention of filtering UI (extending existing FilterControls component)
- [x] Emoticon fallback strategy defined (initial letters: M, C, R, P)
- [x] Accessible ARIA labels specified for screen readers

✅ **Gate 2: Static Architecture & Zero Backend**

- [x] No backend dependencies (frontend-only feature)
- [x] Data sourced from existing `/data/terpene-database.json` (already normalized in PR #30)
- [x] Filter state persisted in localStorage only (no server calls)

✅ **Gate 3: Performance Budget**

- [x] Minimal bundle size increase goal (<5KB gzipped, reusing Material UI Accordion, Checkbox)
- [x] Performance targets specified (<100ms filter interaction, <50ms accordion)
- [x] Theme color tokens leverage existing Material UI palette (no custom color system)

✅ **Gate 4: Testing Strategy**

- [x] Unit tests planned (Vitest + React Testing Library for component behavior)
- [x] Integration tests planned (filter logic with multiple selections)
- [x] E2E tests planned (Playwright for user journeys across P1-P3 stories)
- [x] Accessibility tests planned (vitest-axe for ARIA labels, keyboard navigation, color contrast)

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
│   └── filters/
│       └── FilterControls.tsx          # MODIFY: Add category-level filtering UI
├── models/
│   ├── FilterState.ts                  # MODIFY: Add categoryFilters: string[]
│   └── Terpene.ts                      # READ: Effect type already defined
├── services/
│   └── filterService.ts                # MODIFY: Add category filter logic (OR/AND resolution)
├── theme/
│   ├── themeConfig.ts                  # MODIFY: Add category color tokens
│   ├── darkTheme.ts                    # MODIFY: Define category colors for dark theme
│   └── lightTheme.ts                   # MODIFY: Define category colors for light theme
├── utils/
│   ├── categoryUIConfig.ts             # NEW: Add CATEGORY_UI_CONFIG with emoticons, fallback letters, ARIA labels
│   └── terpeneSchema.ts                # READ: EffectEnum already defined
└── hooks/
    └── useFilters.ts                   # MODIFY: Add category filter state management

tests/
├── unit/
│   ├── components/
│   │   └── FilterControls.test.tsx     # NEW: Category UI rendering tests
│   ├── services/
│   │   └── filterService.test.ts       # NEW: OR/AND logic tests
│   └── hooks/
│       └── useFilters.test.ts          # NEW: Category state management tests
├── integration/
│   └── us4-category-filter-flow.test.tsx # NEW: Category + effect filter interaction
└── e2e/
    └── filter-categories.spec.ts       # NEW: P1-P3 user journeys, mobile accordion

data/
└── terpene-database.json               # READ: Already has normalized effects from PR #30

specs/003-categorized-effect-filters/
└── docs/
    └── effect-categorization.md        # READ: Category mappings reference
```

**Structure Decision**: Extends existing single-page web application structure. This feature modifies existing filter components and theme
configuration rather than adding new top-level modules. Category definitions are added to `utils/categoryUIConfig.ts`, category colors are theme
tokens in `theme/` files, and filter logic extends `services/filterService.ts`. Mobile accordion UI uses Material UI `<Accordion>` component
(already in dependency tree).

**Implementation Guidelines**:

- **Category Colors**: Define as category-specific color tokens in the theme configuration that map to Material UI palette colors 
  (e.g., `category.mood: palette.blue[500]`), enabling theme-aware color selection across light/dark modes
- **Emoticon Fallback**: Use canvas-based detection in CategoryEmoticon component to test rendering before displaying
- **Filter Logic**: Implement OR logic for all filter combinations (multiple categories, category + effects) for simplicity

## Complexity Tracking

> **No violations - this section intentionally left blank**

This feature introduces no constitution violations. It extends existing components, reuses Material UI primitives, maintains static
architecture, and follows established testing patterns. Category-level filtering adds logical complexity but does not violate architectural
principles.
