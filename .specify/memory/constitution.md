<!--
Sync Impact Report:
- Version change: 1.2.0 → 1.2.1
- Modified principles: None (PATCH update)
- Added principles: None
- Removed sections: None
- Configuration updates:
  - ✅ package.json migrated from Create React App to Vite 6
  - ✅ Node.js 24+ engine requirement added
  - ✅ pnpm package manager specified
  - ✅ All modern dependencies updated (React 18.3, Material UI 6, TypeScript 5.7, i18next 24)
  - ✅ vite.config.ts created with manual chunking and performance budgets
  - ✅ vitest.config.ts created with 80% coverage thresholds
  - ✅ tsconfig.json created with strict mode and ES2022 target
  - ✅ tsconfig.node.json created for config files
  - ✅ eslint.config.js created (flat config) with jsx-a11y rules
  - ✅ .prettierrc and .prettierignore created
  - ✅ playwright.config.ts updated for Vite (port 5173, mobile viewports)
  - ✅ .gitignore updated for Vite and modern tooling
- Templates requiring updates:
  - ✅ All templates remain valid (constitution gates unchanged)
- Follow-up TODOs:
  - ✅ COMPLETED: Update package.json to use Vite instead of Create React App
  - ✅ COMPLETED: Specify Node.js 24 and pnpm requirements
  - ✅ COMPLETED: Add all missing dependencies (i18next, vitest, zod, etc.)
  - ✅ COMPLETED: Create all configuration files per research.md
- Next steps:
  - Run `pnpm install` to install all dependencies
  - Create src/ directory structure per plan.md
  - Implement core application per /speckit.tasks
-->
# Interactive Terpene Map Constitution

## Core Principles

### I. Modern User Experience (UX)

The application MUST provide an intuitive, responsive, and accessible user interface using Material UI 5+ as the design system. The interface MUST follow Material Design principles for consistency and usability. Performance is non-negotiable: target Lighthouse performance score ≥90, with sub-200ms filter/search response times and sub-500ms visualization render times. The interface MUST be fully responsive across mobile, tablet, and desktop devices.

**Rationale**: Users expect modern, fast, and beautiful interfaces. Material UI provides battle-tested components with built-in accessibility, reducing development time while ensuring quality.

### II. Component-Based Architecture

The application MUST be built using React 18+ with a component-based architecture. Components MUST be modular, reusable, and independently testable. Each component SHOULD have a single responsibility and clear prop interfaces defined in TypeScript. State management SHALL use React Context API for global state, with local useState/useReducer for component-specific state. Avoid over-engineering with external state libraries (Redux, Zustand) unless complexity clearly warrants it.

**Rationale**: Component modularity enables parallel development, easier testing, and maintainability. Context API suffices for this application's state complexity while minimizing bundle size.

### III. Static-First & Serverless

The application MUST be deployable as a static site to platforms like Vercel, Netlify, or GitHub Pages. All data MUST be loaded from static JSON/YAML files in the `/data` directory. No backend server or database is required. Dynamic functionality SHALL be handled entirely client-side using React. The build output MUST be optimized for CDN distribution with proper cache headers.

**Rationale**: Static deployment maximizes scalability, minimizes operational overhead, reduces costs, and simplifies security posture. The application's data volume (≤500 terpenes) makes client-side processing viable.

### IV. Security by Design

Security is a primary, non-negotiable concern. The application MUST be protected against OWASP Top 10 vulnerabilities. All user inputs (search queries, filters) MUST be sanitized to prevent XSS attacks. The application MUST use HTTPS for all network communication (enforced by hosting provider). Content Security Policy (CSP) headers SHOULD be configured. No user tracking or analytics SHALL be included (privacy by design). All dependencies MUST be regularly audited for vulnerabilities using `npm audit` or `pnpm audit`.

**Rationale**: Educational applications dealing with health-related information must prioritize user privacy and security. Static architecture inherently reduces attack surface.

### V. Comprehensive Testing

All features MUST be accompanied by appropriate tests. Unit tests (Vitest) MUST cover business logic in services, hooks, and utility functions. Integration tests MUST verify component interactions and data flow. End-to-end tests (Playwright) MUST validate critical user journeys. Accessibility tests (jest-axe) MUST verify WCAG 2.1 Level AA compliance. Target test coverage: ≥80% for critical paths. Tests MUST run in CI/CD before merging.

**Rationale**: Testing prevents regressions, documents expected behavior, and ensures accessibility requirements are met. Automated testing enables confident refactoring.

### VI. Keep It Simple, Stupid (KISS)

The application MUST prioritize simplicity in design and implementation. Code SHOULD be self-documenting with clear naming conventions. Avoid premature optimization, clever abstractions, or over-engineering. When choosing between two solutions, prefer the simpler one unless complexity is justified by measurable benefits. Complex D3.js visualizations SHOULD be isolated in dedicated components with clear interfaces.

**Rationale**: Simpler code is easier to understand, maintain, and debug. Complexity should be earned through real requirements, not anticipated needs.

### VII. You Ain't Gonna Need It (YAGNI)

Functionality MUST NOT be added until it is actually needed. Features explicitly marked "Out of Scope" (user accounts, data persistence, server-side rendering) SHALL NOT be implemented unless requirements change. Avoid building abstractions for hypothetical future use cases. Database layers, API clients, and backend integrations are NOT needed for this static application.

**Rationale**: Premature features increase maintenance burden, slow development, and create complexity without delivering immediate value.

### VIII. Don't Repeat Yourself (DRY)

Code and logic SHOULD be reused wherever possible. Common UI patterns MUST use Material UI components (buttons, inputs, cards) rather than custom implementations. Repeated data transformations MUST be extracted into utility functions. Effect colors, translations, and configuration MUST be centralized in constant files. However, avoid premature abstraction—duplication is acceptable if it avoids inappropriate coupling.

**Rationale**: Reuse reduces code volume, ensures consistency, and concentrates bug fixes. Material UI provides pre-built, accessible components that eliminate the need for custom UI code.

### IX. Accessibility First

Accessibility is MANDATORY, not optional. The application MUST comply with WCAG 2.1 Level AA standards. All text MUST have a minimum 4.5:1 contrast ratio against backgrounds. All interactive elements MUST be fully operable via keyboard (Tab, Enter, Space, Arrow keys). Screen readers MUST be able to navigate and understand all content using proper ARIA labels and semantic HTML. Color MUST NOT be the sole means of conveying information. Material UI components provide baseline accessibility, but custom components (D3.js charts) MUST add appropriate ARIA attributes.

**Rationale**: Accessibility is a fundamental right. WCAG AA compliance ensures the application is usable by people with disabilities, fulfilling the educational mission.

### X. Performance Budgets

The application MUST meet specific performance budgets. Lighthouse scores MUST be: Performance ≥90, Accessibility ≥95, Best Practices ≥90. Initial bundle size MUST be ≤500KB gzipped. Filter/search operations MUST complete in <200ms for 500 terpenes. Sunburst chart and table view MUST render in <500ms. Use code splitting (React.lazy), tree-shaking (named imports), and virtualization (for tables >100 rows) to meet these budgets.

**Rationale**: Performance directly impacts user experience. Slow applications frustrate users and reduce engagement. Performance budgets prevent feature creep from degrading experience.

### XI. Internationalization Support

The application MUST support multiple languages (initially English and German). All user-facing text MUST be externalized using i18next. Hard-coded strings are NOT allowed. Translation files MUST be maintained in `src/i18n/locales/`. Material UI component labels (table headers, buttons) MUST use the appropriate locale provider (deDE, enUS). The application MUST detect browser language preference and default to it, with a UI control to switch languages.

**Rationale**: Educational content should be accessible to non-English speakers. Internationalization from the start is easier than retrofitting later.

## Development Workflow

All code changes MUST be introduced through Pull Requests (PRs) on GitHub. Each PR MUST:
- Pass all automated tests (unit, integration, e2e, accessibility)
- Pass ESLint linting with zero errors
- Maintain or improve Lighthouse scores
- Be reviewed and approved by at least one team member
- Have a descriptive commit message following Conventional Commits format

The CI/CD pipeline MUST run on every PR and block merging if any check fails. Deployments to production SHOULD occur automatically after merging to the main branch.

## Constitution Check Gates

When filling out the "Constitution Check" section in `plan.md`, verify:

✅ **Gate 1: Accessibility Requirements**
- [ ] WCAG 2.1 Level AA compliance documented
- [ ] 4.5:1 contrast ratio specified for all color choices
- [ ] Keyboard navigation plan documented
- [ ] Screen reader support considered
- [ ] jest-axe or similar tool included in test strategy

✅ **Gate 2: Performance Budgets**
- [ ] Lighthouse score targets defined (Performance ≥90, Accessibility ≥95)
- [ ] Response time targets specified (<200ms filters, <500ms renders)
- [ ] Bundle size budget considered (~500KB gzipped total)
- [ ] Virtualization plan for large lists (>100 items)

✅ **Gate 3: Testing Strategy**
- [ ] Unit test framework identified (Vitest recommended)
- [ ] E2E test framework identified (Playwright recommended)
- [ ] Accessibility test tool identified (jest-axe recommended)
- [ ] Test coverage target defined (≥80% for critical paths)

✅ **Gate 4: Component Reuse**
- [ ] Material UI components specified for UI elements
- [ ] Custom components justified (e.g., D3.js visualizations)
- [ ] No reinvention of existing Material UI components

✅ **Gate 5: Static Architecture**
- [ ] No backend server dependencies
- [ ] Data source is static files (JSON/YAML)
- [ ] Deployment target is static hosting (Vercel/Netlify/GitHub Pages)
- [ ] No database or API required

✅ **Gate 6: Internationalization**
- [ ] i18next or similar internationalization library included
- [ ] Supported languages specified (en, de minimum)
- [ ] Translation files location documented
- [ ] No hard-coded user-facing strings

**Post-Design Re-check**: After Phase 1 design is complete, re-verify that the implementation plan adheres to all gates above. Flag any deviations in the "Complexity Tracking" section with explicit justification.

## Governance

This constitution is the single source of truth for project principles and practices. Any proposed amendments require:
1. A PR to this document with clear rationale
2. Discussion with team/stakeholders
3. Update to the Sync Impact Report at the top of this file
4. Version increment following semantic versioning:
   - **MAJOR**: Breaking changes to principles (removing/redefining core requirements)
   - **MINOR**: Adding new principles or materially expanding existing ones
   - **PATCH**: Clarifications, typo fixes, non-semantic refinements

All development activities, code reviews, and architectural decisions MUST align with this constitution. The Constitution Check gates MUST be verified before starting Phase 0 research and re-verified after Phase 1 design.

**Complexity Tracking Requirement**: If any gate fails or a principle must be violated, document the violation in the "Complexity Tracking" table in `plan.md` with explicit justification of why the simpler approach is insufficient.

**Version**: 1.2.1 | **Ratified**: 2025-10-23 | **Last Amended**: 2025-10-23
