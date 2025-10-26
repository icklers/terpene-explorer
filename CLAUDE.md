# terpene-map-claude Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-23

## Active Technologies
- TypeScript 5.7.2, React 19.2.0 + @mui/material 6.3.0, @emotion/react 11.13.5, @emotion/styled 11.13.5, Vite 6.0.3 (003-dark-theme-design)
- LocalStorage for theme preferences (existing useLocalStorage hook) (003-dark-theme-design)

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

npm test && npm run lint

## Code Style

TypeScript 5.7+, Node.js 24 LTS, ES2024 target: Follow standard conventions

## Recent Changes
- 003-dark-theme-design: Added TypeScript 5.7.2, React 19.2.0 + @mui/material 6.3.0, @emotion/react 11.13.5, @emotion/styled 11.13.5, Vite 6.0.3

- 002-terpene-data-model: Added TypeScript 5.7+, Node.js 24 LTS, ES2022 target + React 19.2+, Material UI 6.3+, D3.js 7.9+, i18next 25+, Zod
  3.24+ (schema validation), js-yaml 4.1+

- 001-interactive-terpene-map: Added TypeScript 5.7+, Node.js 24 LTS, ES2024 target + React 18.3+, D3.js 7.9+, Material UI 5.16+, React
  Router 6.28+, i18next 24+ for localization, js-yaml for data parsing

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
