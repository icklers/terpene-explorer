# Implementation Plan: Interactive Terpene Map

**Branch**: `001-interactive-terpene-map` | **Date**: 2025-10-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-interactive-terpene-map/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a dynamic, filterable, and visually engaging educational tool for terpene data that transforms static JSON/YAML data into an interactive web application. The application will feature multiple visualization modes (sunburst chart, table view), comprehensive filtering and search capabilities, full localization support (English/German), and theme switching (light/dark mode). The technical stack centers on React 18 for UI, D3.js 7 for data visualization, Material UI 5 for component styling and theming, with Vite for build tooling, and Jest/Playwright for testing.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 24 LTS, ES2024 target
**Primary Dependencies**: React 18.3+, D3.js 7.9+, Material UI 5.16+, React Router 6.28+, i18next 24+ for localization, js-yaml for data parsing
**Storage**: Static files (JSON/YAML data files in `/data` directory), no backend persistence
**Testing**: Vitest (latest) for unit/integration tests, Playwright (latest) for end-to-end tests, React Testing Library 16+
**Build Tooling**: Vite 6+ (latest), TypeScript compiler, ESLint 9+ (flat config), Prettier 3+
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive design for mobile/tablet/desktop
**Project Type**: Single-page web application (SPA)
**Performance Goals**: Lighthouse performance ≥90, accessibility ≥95, <200ms filter/search response, <500ms chart/table render, handle 500 terpenes smoothly
**Constraints**: WCAG 2.1 Level AA compliance, 4.5:1 contrast ratio, full keyboard navigation, OWASP Top 10 security, no analytics/tracking
**Scale/Scope**: Up to 500 terpenes, 2 languages (en/de), multiple effect categories with color-coding

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: All gates passed ✅

✅ **Gate 1: Accessibility Requirements**
- [x] WCAG 2.1 Level AA compliance documented (NFR-A11Y-001 through NFR-A11Y-004)
- [x] 4.5:1 contrast ratio specified for all color choices (Material UI contrastThreshold: 4.5)
- [x] Keyboard navigation plan documented (all Material UI components + custom D3.js charts)
- [x] Screen reader support considered (ARIA labels, semantic HTML)
- [x] jest-axe included in test strategy (Vitest + jest-axe for accessibility tests)

✅ **Gate 2: Performance Budgets**
- [x] Lighthouse score targets defined (Performance ≥90, Accessibility ≥95)
- [x] Response time targets specified (<200ms filters, <500ms renders)
- [x] Bundle size budget considered (~400-500KB gzipped total)
- [x] Virtualization plan for large lists (react-window for tables >100 rows)

✅ **Gate 3: Testing Strategy**
- [x] Unit test framework identified (Vitest with React Testing Library)
- [x] E2E test framework identified (Playwright)
- [x] Accessibility test tool identified (jest-axe)
- [x] Test coverage target defined (≥80% for critical paths per constitution)

✅ **Gate 4: Component Reuse**
- [x] Material UI components specified for UI elements (see data-model.md Material UI Component Mapping)
- [x] Custom components justified (D3.js sunburst chart - no Material UI equivalent)
- [x] No reinvention of existing Material UI components (using Table, TextField, Chip, etc.)

✅ **Gate 5: Static Architecture**
- [x] No backend server dependencies (static SPA)
- [x] Data source is static files (JSON/YAML in /data directory)
- [x] Deployment target is static hosting (Vercel/Netlify/GitHub Pages documented in quickstart.md)
- [x] No database or API required

✅ **Gate 6: Internationalization**
- [x] i18next included in dependencies (i18next 24+)
- [x] Supported languages specified (en, de per FR-007, FR-008)
- [x] Translation files location documented (src/i18n/locales/)
- [x] No hard-coded user-facing strings (all text via i18next)

**Post-Design Re-check**: ✅ All gates re-verified after Phase 1 design completion. No violations. No complexity tracking needed.

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
/
├── data/                      # Static terpene data files
│   ├── terpenes.json         # Primary data source
│   └── terpenes.yaml         # Alternative format
│
├── public/                    # Static assets served by Vite
│   ├── index.html
│   └── assets/               # Images, icons, fonts
│
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component with theme/i18n providers
│   │
│   ├── components/           # Reusable UI components
│   │   ├── layout/          # AppBar, Sidebar, Footer
│   │   ├── visualizations/  # SunburstChart, TerpeneTable
│   │   ├── filters/         # FilterControls, SearchBar
│   │   ├── common/          # LoadingIndicator (cannabis leaf), ErrorBoundary
│   │   └── theme/           # ThemeToggle, LanguageSelector
│   │
│   ├── pages/               # Top-level route components
│   │   └── Home.tsx         # Main terpene explorer page
│   │
│   ├── services/            # Business logic and data access
│   │   ├── dataLoader.ts    # Load and parse JSON/YAML
│   │   ├── filterService.ts # Filter and search logic
│   │   └── colorService.ts  # Effect category color mapping
│   │
│   ├── models/              # TypeScript interfaces and types
│   │   ├── Terpene.ts
│   │   ├── Effect.ts
│   │   └── FilterState.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useTerpeneData.ts
│   │   ├── useFilters.ts
│   │   └── useTheme.ts
│   │
│   ├── i18n/                # Internationalization
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── de.json
│   │
│   ├── theme/               # Material UI theme configuration
│   │   ├── lightTheme.ts
│   │   ├── darkTheme.ts
│   │   └── themeConfig.ts
│   │
│   └── utils/               # Utility functions
│       ├── accessibility.ts
│       ├── validation.ts
│       └── constants.ts
│
├── tests/
│   ├── unit/                # Component and service unit tests
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   ├── integration/         # Integration tests
│   │   └── dataFlow.test.ts
│   └── e2e/                 # Playwright end-to-end tests
│       ├── terpene-explorer.spec.ts
│       ├── accessibility.spec.ts
│       └── localization.spec.ts
│
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint flat config
└── package.json
```

**Structure Decision**: Single-page web application structure using Vite's recommended React-TypeScript template. The structure separates concerns into components (UI), services (business logic), models (data types), and hooks (state management). Material UI components will be used throughout for consistent theming and accessibility.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations identified. The design follows standard SPA architecture patterns appropriate for the feature scope.
