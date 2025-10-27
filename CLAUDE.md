# Terpene Explorer Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-23

## Active Technologies

- TypeScript 5.7+, Node.js 24 LTS, ES2022 target + React 19.2+, Material UI 6.3+, Emotion 11.13+ (styling), Zod 3.24+ (schema validation)
  (003-categorized-effect-filters)
- Static JSON files in `/data` directory (terpene-database.json with effect categorization) (003-categorized-effect-filters)

- TypeScript 5.7+, Node.js 24 LTS, ES2022 target + React 19.2+, Material UI 6.3+, D3.js 7.9+, i18next 25+, Zod 3.24+ (schema validation),
  js-yaml 4.1+ (002-terpene-data-model)
- Static JSON files in `/data` directory (no database required) (002-terpene-data-model)

- TypeScript 5.7+, Node.js 24 LTS, ES2024 target + React 18.3+, D3.js 7.9+, Material UI 5.16+, React Router 6.28+, i18next 24+ for
  localization, js-yaml for data parsing (001-interactive-terpene-map)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

pnpm run type-check && pnpm run format && pnpm run lint:fix && pnpm run build

## Code Style

TypeScript 5.7+, Node.js 24 LTS, ES2024 target: Follow standard conventions

## Recent Changes

- 003-categorized-effect-filters: Added TypeScript 5.7+, Node.js 24 LTS, ES2022 target + React 19.2+, Material UI 6.3+, Emotion 11.13+
  (styling), Zod 3.24+ (schema validation)

- 002-terpene-data-model: Added TypeScript 5.7+, Node.js 24 LTS, ES2022 target + React 19.2+, Material UI 6.3+, D3.js 7.9+, i18next 25+, Zod
  3.24+ (schema validation), js-yaml 4.1+

- 001-interactive-terpene-map: Added TypeScript 5.7+, Node.js 24 LTS, ES2024 target + React 18.3+, D3.js 7.9+, Material UI 5.16+, React
  Router 6.28+, i18next 24+ for localization, js-yaml for data parsing

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
<!-- PHASE 6 TESTING NOTE -->
<!-- For Phase 6 (Category-level filtering) we intentionally avoid writing full new unit test suites.
     Instead: run the existing unit test(s) that cover the FilterControls/CategoryTabs component
     and the filter service logic to validate the integration. This keeps the iteration fast while
     ensuring component-level behavior is verified.

     Example (run locally):
       pnpm run type-check
       pnpm vitest tests/unit/components/FilterControls.test.ts --run

     Additions or new tests may be authored later during polishing (Phase 8) if coverage gaps are found.
-->
