# Implementation Plan: Comfortably Dark Theme System

**Branch**: `004-dark-theme-design` | **Date**: October 26, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-dark-theme-design/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a comprehensive dark theme system for the Terpene Explorer application that prioritizes eye strain reduction and professional branded appearance. The theme features a floating card design with Material Design elevation patterns, using a strategic color hierarchy: dark green (#388e3c) for structural branding, bright green (#4caf50) for active interactions, and vibrant orange (#ffb300) for focus/selection states. All UI components will be rendered as floating cards with 8px rounded corners, 24px spacing, and box-shadow elevation on a very dark gray (#121212) background.

## Technical Context

**Language/Version**: TypeScript 5.7.2, React 19.2.0  
**Primary Dependencies**: @mui/material 6.3.0, @emotion/react 11.13.5, @emotion/styled 11.13.5, Vite 6.0.3  
**Storage**: LocalStorage for theme preferences (existing useLocalStorage hook)  
**Testing**: Vitest 4.0.3 (unit/integration), Playwright 1.49.1 (E2E), vitest-axe (accessibility), @axe-core/playwright  
**Target Platform**: Modern browsers (ES2022+), responsive web application (desktop, tablet, mobile)  
**Project Type**: Single-page React web application with Material-UI component library  
**Performance Goals**: 
- Theme application within 100ms of page load
- Hover feedback within 100ms (SC-008)
- No layout shift during theme application
- Smooth 60fps animations/transitions  
**Constraints**: 
- WCAG 2.1 Level AA compliance (4.5:1 contrast for normal text, 3:1 for large text) - FR-011
- Must work with existing Material-UI theming system
- Cannot break existing component functionality
- Must support system preference detection (existing themeConfig.ts infrastructure)
- No implementation of theme switcher (out of scope) - only dark theme definition  
**Scale/Scope**: 
- Approximately 15-20 existing React components to update
- 3 major UI sections: Header, Filter Card, Table
- Existing theme system to extend (darkTheme.ts already present)
- Integration with existing useTheme hook and ThemeProvider

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Note**: The project constitution file is a template placeholder. Applying standard React/TypeScript web application best practices:

✅ **Component Modularity**: Theme configuration isolated in `/src/theme/` directory  
✅ **Type Safety**: TypeScript strict mode enabled, all theme values typed  
✅ **Testing**: Vitest for unit tests, Playwright for E2E, accessibility testing with axe-core  
✅ **Accessibility**: WCAG 2.1 Level AA compliance enforced  
✅ **Code Quality**: ESLint, Prettier, and type-checking in place  
✅ **Single Responsibility**: Each theme file has one clear purpose (darkTheme.ts for palette, themeConfig.ts for utilities)  

**No violations detected** - This is a visual theme enhancement that extends existing theme infrastructure without introducing new complexity or architectural changes.

## Project Structure

### Documentation (this feature)

```text
specs/004-dark-theme-design/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (Material-UI theming best practices)
├── data-model.md        # Phase 1 output (Theme configuration data model)
├── quickstart.md        # Phase 1 output (Developer guide for applying theme)
├── contracts/           # Phase 1 output (TypeScript type definitions)
│   └── theme-contract.ts  # Theme configuration interfaces
├── checklists/
│   └── requirements.md  # Specification quality checklist (complete)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── theme/                    # Theme configuration (EXISTING - TO MODIFY)
│   ├── darkTheme.ts         # Dark theme definition (TO UPDATE with new palette)
│   ├── lightTheme.ts        # Light theme (NO CHANGES - out of scope)
│   ├── indigoTheme.ts       # Alternative theme (NO CHANGES - out of scope)
│   └── themeConfig.ts       # Theme utilities (NO CHANGES - already supports dark mode)
│
├── components/               # React components (TO UPDATE for new visual specs)
│   ├── layout/
│   │   ├── Header.tsx       # Main app header (UPDATE bgcolor, spacing)
│   │   └── MainLayout.tsx   # Page layout wrapper (UPDATE background, padding)
│   ├── filters/
│   │   ├── SearchBar.tsx    # Search input (UPDATE focus colors, border radius)
│   │   └── FilterChips.tsx  # Multi-select chips (UPDATE selected/unselected states)
│   ├── visualizations/
│   │   └── DataTable.tsx    # Terpene data table (UPDATE header, rows, selection)
│   └── common/
│       ├── Card.tsx         # Floating card component (UPDATE elevation, spacing)
│       └── ToggleButtons.tsx # View mode toggle (UPDATE active state color)
│
├── hooks/
│   ├── useTheme.ts          # Theme hook (NO CHANGES - already functional)
│   └── useLocalStorage.ts   # Storage hook (NO CHANGES - existing infrastructure)
│
└── pages/
    └── Home.tsx             # Main page (UPDATE layout structure for floating cards)

tests/
├── unit/
│   └── components/
│       └── theme.test.ts    # Theme application tests (NEW)
├── integration/
│   └── theme-integration.test.tsx  # Theme + components integration (NEW)
└── e2e/
    └── accessibility.spec.ts  # A11y tests (UPDATE for new color contrasts)
```

**Structure Decision**: Single-page web application structure. All theme-related code is centralized in `/src/theme/` directory following Material-UI conventions. Components are organized by function (layout, filters, visualizations, common) and will be updated to use the new theme palette values. No new directories needed - extending existing infrastructure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No complexity violations** - This feature extends existing theme infrastructure without adding architectural complexity. All changes are configuration updates to the existing Material-UI theme system.
