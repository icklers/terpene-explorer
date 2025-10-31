# Implementation Plan: Table Filter Bar Extension

**Branch**: `005-table-filter-bar` | **Date**: 2025-10-28 | **Spec**: [spec.md](./spec.md)  
**Updated**: 2025-10-31 (post feature 006 merge and clarification)  
**Input**: Feature specification from `/specs/005-table-filter-bar/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

**Clarification (Session 2025-10-31)**: When TranslationSearchService is unavailable or fails in German mode, the system must gracefully degrade to English-only search with a console warning (silent fallback for users, logged error for developers). This ensures filtering remains functional even if bilingual infrastructure fails (FR-025).

**Integration Reference**: See `specs/005-table-filter-bar/docs/feature-006-merge-implications.md` for detailed analysis of the bilingual integration strategy, including the recommended hybrid approach (delegate to TranslationSearchService in German mode with English fallback).

## Summary

Extend the existing terpene filter functionality to support multi-attribute filtering beyond the current name-only capability. The extension adds filtering by effects, taste, aroma, and therapeutic properties while maintaining backward compatibility with existing name filtering. The implementation must integrate with the bilingual infrastructure from feature 006, coordinating with TranslationSearchService to provide cross-language search when German UI language is active, with graceful degradation to English-only search if the service fails. Additionally, improve UI/UX by relocating the filter bar to the filter area with clear labeling and updated placeholder text. All changes follow TDD protocol (RED, GREEN, REFACTOR) and maintain the static-first architecture with client-side filtering.

**Key Requirements**:
- Extend `filterService.ts` `matchesSearchQuery()` to search across name, effects, taste, aroma, and therapeutic properties
- Integrate with TranslationSearchService for bilingual search when German language mode is active
- Implement graceful degradation to English-only search when TranslationSearchService fails (with console warning)
- Update `SearchBar` component placeholder text to reflect new capabilities
- Relocate filter bar to filter area if not already there
- Implement 2-character minimum, 300ms debounce, 100-character maximum
- Maintain original table order (no re-sorting)
- Display "No match found for your filter" empty state
- Preserve all existing name filtering behavior (backward compatibility)

## Technical Context

**Language/Version**: TypeScript 5.7.2, Node.js 24 LTS, ES2022 target  
**Primary Dependencies**: React 19.2.0, Material UI 6.3.0, Emotion 11.13.5, Vite 6.0.3, Vitest (testing), Playwright (E2E)  
**Storage**: Static JSON files (`/data/terpene-database.json`) - client-side only  
**Testing**: Vitest (unit/integration), Playwright (E2E), jest-axe (accessibility)  
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) via static CDN deployment  
**Project Type**: Single-page web application with static-first architecture  
**Performance Goals**: <100ms filter operation for 100-200 terpenes (300ms debounce separate for UX), Lighthouse Performance ≥90  
**Constraints**: Client-side filtering only, no backend, maintain 80% test coverage, WCAG 2.1 Level AA compliance  
**Scale/Scope**: ~100-500 terpenes, single filter bar extension feature touching 3-5 files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Gate 1: Accessibility Requirements**
- [x] WCAG 2.1 Level AA compliance documented (existing SearchBar already compliant)
- [x] 4.5:1 contrast ratio maintained (using Material UI default colors)
- [x] Keyboard navigation plan documented (TextField supports Tab, Enter, clear with keyboard)
- [x] Screen reader support considered (ARIA labels already present, will maintain)
- [x] jest-axe included in test strategy (existing in project)

✅ **Gate 2: Performance Budgets**
- [x] Lighthouse score targets defined (Performance ≥90, existing baseline)
- [x] Response time targets specified (300ms debounce for UX + <100ms filter operation = <400ms total perceived latency, meets constitution <200ms filter operation requirement)
- [x] Bundle size budget considered (extending existing service, minimal bundle impact ~2KB)
- [x] Virtualization plan for large lists (TerpeneTable already handles >100 items, no change needed)

✅ **Gate 3: Testing Strategy**
- [x] Unit test framework identified (Vitest - already configured)
- [x] E2E test framework identified (Playwright - already configured)
- [x] Accessibility test tool identified (jest-axe - already configured)
- [x] Test coverage target defined (≥80% for critical paths - existing standard)

✅ **Gate 4: Component Reuse**
- [x] Material UI components specified (TextField already used in SearchBar)
- [x] Custom components justified (extending existing SearchBar, not creating new)
- [x] No reinvention of existing Material UI components

✅ **Gate 5: Static Architecture**
- [x] No backend server dependencies
- [x] Data source is static files (terpene-database.json)
- [x] Deployment target is static hosting (Vercel/Netlify/GitHub Pages)
- [x] No database or API required

✅ **Gate 6: Internationalization**
- [x] i18next included (already configured)
- [x] Supported languages specified (en, de - existing)
- [x] Translation files location documented (src/i18n/locales/)
- [x] No hard-coded user-facing strings (will use t() for placeholder updates)

**Post-Design Re-check**: All gates pass. This is a minimal extension to existing functionality following established patterns. No new complexity introduced.

## Project Structure

### Documentation (this feature)

```text
specs/005-table-filter-bar/
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
│       └── SearchBar.tsx          # MODIFY: Update placeholder, add label
├── services/
│   └── filterService.ts           # MODIFY: Extend matchesSearchQuery() to search new fields
├── i18n/
│   └── locales/
│       ├── en/
│       │   └── translation.json   # MODIFY: Update placeholder text
│       └── de/
│           └── translation.json   # MODIFY: Update placeholder text (German)
├── pages/
│   └── Home.tsx                   # VERIFY: Filter bar already in filter area
└── models/
    └── Terpene.ts                 # READ ONLY: Understand taste/therapeutic fields

tests/
├── unit/
│   ├── services/
│   │   └── filterService.test.ts  # MODIFY: Add tests for new search fields
│   └── components/
│       └── SearchBar.test.tsx     # MODIFY: Add tests for 2-char minimum, 100-char max
└── integration/
    └── filter-flow.test.ts        # MODIFY: Add multi-attribute search scenarios
```

**Structure Decision**: Single-project web application structure (existing). This feature extends 2 existing files (`SearchBar.tsx`, `filterService.ts`) and updates translation files. No new components or services required. Follows KISS principle by reusing existing architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations**. All constitution gates pass. This is a straightforward extension of existing filtering logic following established patterns.
