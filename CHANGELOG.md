# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.3.0 (2025-11-02)

* chore(deps): bump react-window from 2.2.1 to 2.2.2 (#56) ([77075fd](https://github.com/icklers/terpene-explorer/commit/77075fd)), closes [#56](https://github.com/icklers/terpene-explorer/issues/56)
* chore(release): 1.3.0 [skip ci] ([7d3c302](https://github.com/icklers/terpene-explorer/commit/7d3c302))
* feat: add automated release workflow v2 ([d159bac](https://github.com/icklers/terpene-explorer/commit/d159bac))

## 1.3.0 (2025-11-02)

* feat: add automated release workflow v2 ([d159bac](https://github.com/icklers/terpene-explorer/commit/d159bac))

## 1.2.0 (2025-11-02)

* Merge branch 'main' into 008-therapeutic-modal-refactor ([f8f22fa](https://github.com/icklers/terpene-explorer/commit/f8f22fa))
* Merge pull request #61 from icklers/008-therapeutic-modal-refactor ([aa0469f](https://github.com/icklers/terpene-explorer/commit/aa0469f)), closes [#61](https://github.com/icklers/terpene-explorer/issues/61)
* chore: formatting ([73aaa93](https://github.com/icklers/terpene-explorer/commit/73aaa93))
* chore(ci): mint GitHub App installation token before release and add diagnostics (#54) ([a9ae59c](https://github.com/icklers/terpene-explorer/commit/a9ae59c)), closes [#54](https://github.com/icklers/terpene-explorer/issues/54) [#53](https://github.com/icklers/terpene-explorer/issues/53)
* chore(ci): trigger release on CI workflow_run and download CI artifacts via dawidd6/action-download- ([6931c86](https://github.com/icklers/terpene-explorer/commit/6931c86))
* chore(release): 1.0.0 [skip ci] ([9f0be76](https://github.com/icklers/terpene-explorer/commit/9f0be76))
* chore(release): 1.1.0 [skip ci] ([6b0a2d8](https://github.com/icklers/terpene-explorer/commit/6b0a2d8))
* chore(release): 1.1.1 [skip ci] ([0eddd1a](https://github.com/icklers/terpene-explorer/commit/0eddd1a))
* feat: add table column simplification specification ([28647ec](https://github.com/icklers/terpene-explorer/commit/28647ec))
* feat: complete mobile optimization specification and planning ([0a0a45b](https://github.com/icklers/terpene-explorer/commit/0a0a45b))
* feat: Implement category color coding for effect chips in TerpeneTable (#52) ([d0a9a72](https://github.com/icklers/terpene-explorer/commit/d0a9a72)), closes [#52](https://github.com/icklers/terpene-explorer/issues/52)
* feat: Terpene Details Modal with Basic/Expert View ([7088005](https://github.com/icklers/terpene-explorer/commit/7088005)), closes [#US1-Complete](https://github.com/icklers/terpene-explorer/issues/US1-Complete) [Hi#prevalence](https://github.com/Hi/issues/prevalence) [#2E7D32](https://github.com/icklers/terpene-explorer/issues/2E7D32) [#66BB6A](https://github.com/icklers/terpene-explorer/issues/66BB6A) [#757575](https://github.com/icklers/terpene-explorer/issues/757575) [#9E9E9E](https://github.com/icklers/terpene-explorer/issues/9E9E9E) [#60](https://github.com/icklers/terpene-explorer/issues/60) [#US1-Complete](https://github.com/icklers/terpene-explorer/issues/US1-Complete) [Hi#prevalence](https://github.com/Hi/issues/prevalence) [#2E7D32](https://github.com/icklers/terpene-explorer/issues/2E7D32) [#66BB6A](https://github.com/icklers/terpene-explorer/issues/66BB6A) [#757575](https://github.com/icklers/terpene-explorer/issues/757575) [#9E9E9E](https://github.com/icklers/terpene-explorer/issues/9E9E9E) [#60](https://github.com/icklers/terpene-explorer/issues/60) [#US1-Complete](https://github.com/icklers/terpene-explorer/issues/US1-Complete) [Hi#prevalence](https://github.com/Hi/issues/prevalence) [#2E7D32](https://github.com/icklers/terpene-explorer/issues/2E7D32) [#66BB6A](https://github.com/icklers/terpene-explorer/issues/66BB6A) [#757575](https://github.com/icklers/terpene-explorer/issues/757575) [#9E9E9E](https://github.com/icklers/terpene-explorer/issues/9E9E9E) [#60](https://github.com/icklers/terpene-explorer/issues/60)
* feat(007): complete TDD-compliant implementation plan for table column simplification ([28505f2](https://github.com/icklers/terpene-explorer/commit/28505f2))
* feat(ci): implement automated release with semantic-release (#53) ([59da2ec](https://github.com/icklers/terpene-explorer/commit/59da2ec)), closes [#53](https://github.com/icklers/terpene-explorer/issues/53)
* feat(spec): update specification ([cae43c1](https://github.com/icklers/terpene-explorer/commit/cae43c1))
* ci: fix code formatting ([2737005](https://github.com/icklers/terpene-explorer/commit/2737005))
* ci: make release workflow wait for CI success using workflow_run trigger ([deb461a](https://github.com/icklers/terpene-explorer/commit/deb461a))
* fix: opencode prompts ([f1313b4](https://github.com/icklers/terpene-explorer/commit/f1313b4))
* fix: release workflow ([846d7e1](https://github.com/icklers/terpene-explorer/commit/846d7e1))
* fix(ci): remove extra parentheses in echo statements causing syntax error ([f5d9921](https://github.com/icklers/terpene-explorer/commit/f5d9921))
* docs(spec): address analysis findings for therapeutic modal refactor ([6f258c5](https://github.com/icklers/terpene-explorer/commit/6f258c5))


### BREAKING CHANGE

* Manual tag creation no longer triggers releases.
The release process is now fully automated via semantic-release on pushes to main.

* chore(ci): update github-script action to v8

- Update actions/github-script from v7 to v8 in both PR validation and release workflows
- Ensures compatibility with latest GitHub Actions runtime

* chore(ci): avoid pushing to protected main by removing @semantic-release/git

* chore(ci): enable git pushes via GitHub App installation token; add token mint step to release workflow

* chore(ci): ensure App installation token is minted before semantic-release; add diagnostic/fallback logs
* Modal now includes concentration visualization with percentile indicators
* Modal now includes concentration visualization with percentile indicators
* Modal now includes concentration visualization with percentile indicators

## <small>1.1.1 (2025-11-02)</small>

* fix(ci): Release workflow wait for CI, no Dependabot PR deployments ([b2fff29](https://github.com/icklers/terpene-explorer/commit/b2fff29))
* ci: fix code formatting ([f683ab0](https://github.com/icklers/terpene-explorer/commit/f683ab0))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Therapeutic-Focused Terpene Details Modal (Feature #008)

- **Complete Modal Refactor**: Rebuilt terpene details modal with therapeutic information prioritized for medical cannabis patients
- **Dual View System**: Basic View for quick assessment and Expert View for scientific depth
- **User Stories Implemented**:
  - US1: Quick Therapeutic Assessment - patients identify benefits in <15 seconds
  - US2: Deep Therapeutic Exploration - accordion-based scientific data access
  - US4: Category Badge Information - tooltips explain terpene prevalence tiers
  - US5: Concentration Context - percentile-based concentration explanations
  
- **UI Improvements**:
  - Color-coded therapeutic property chips (WCAG AA compliant)
  - Categorized effects display (Mood & Energy, Relaxation, Physical)
  - Concentration visualization with percentile indicators
  - Natural sources display with first 3 in Basic View, all in Expert View
  - Category badges with inline positioning and tooltips
  - Responsive design with full-screen mode on mobile
  
- **Data Quality System**:
  - Improved badge color coding (Excellent: dark green, Good: light green, Moderate: green border, Limited: grey border, Unknown: filled grey)
  - Evidence summaries with quality indicators
  - Reference citations with type badges and external links
  
- **Molecular Properties Accordion**:
  - Chemical class, molecular formula with copy-to-clipboard
  - Molecular weight, boiling point display
  - Isomer information when applicable
  
- **Accessibility Features**:
  - Full keyboard navigation support
  - ARIA labels and semantic HTML
  - Focus trap when modal open
  - Focus restoration on close
  - Touch targets ≥48px on mobile
  
- **Performance Optimizations**:
  - Memoized effect categorization computation
  - Memoized concentration data parsing
  - Optimized re-renders with dependency tracking

### Changed

- **Typography Consistency**: All headings use consistent subtitle1 style without colons
- **Effects Display**: Basic View shows flat color-coded chips; Expert View adds category groupings
- **Removed Visual Clutter**: Eliminated emojis from aroma profiles, natural sources, and section headings
- **Heading Hierarchy**: Changed "Primary Effects" to "Effects", removed "What it does for you:" colon
- **Description Truncation**: Increased from 120 to 180 characters (+50%) for better context

### Technical Details

- **Testing**: 74 passing tests (62 modal + 12 supporting components)
- **TDD Approach**: All features developed with RED→GREEN→REFACTOR cycles
- **Coverage**: Maintained high test coverage across all components
- **Bundle Size**: Total gzipped: ~102kB (within budget)
- **Type Safety**: Zero TypeScript errors
- **Code Quality**: Zero ESLint warnings

## 1.1.0 (2025-11-01)

- feat: Implement category color coding for effect chips in TerpeneTable (#52)
  ([e743569](https://github.com/icklers/terpene-explorer/commit/e743569)), closes
  [#52](https://github.com/icklers/terpene-explorer/issues/52)

## 1.0.0 (2025-11-01)

- fix: Add favicon.svg and refine navigationFallback ([e4e6630](https://github.com/icklers/terpene-explorer/commit/e4e6630))
- fix: Effects translation ([3545f04](https://github.com/icklers/terpene-explorer/commit/3545f04))
- fix: Fix Phase 3 UAT issues - data loading and manifest errors ([ba47668](https://github.com/icklers/terpene-explorer/commit/ba47668))
- fix: GitHub Pages asset loading and security headers ([e26ab27](https://github.com/icklers/terpene-explorer/commit/e26ab27))
- fix: opencode prompts ([d3858d3](https://github.com/icklers/terpene-explorer/commit/d3858d3))
- fix: release workflow ([af2d8d4](https://github.com/icklers/terpene-explorer/commit/af2d8d4))
- fix: resolve ESLint warnings and import order issues ([59ac5c6](https://github.com/icklers/terpene-explorer/commit/59ac5c6))
- fix: resolve TranslationService initialization race condition ([76d121b](https://github.com/icklers/terpene-explorer/commit/76d121b))
- fix: Sequential CI and Azure SWA deployment workflow (#48) ([42ac1ed](https://github.com/icklers/terpene-explorer/commit/42ac1ed)), closes
  [#48](https://github.com/icklers/terpene-explorer/issues/48)
- fix: synchronize terpene translation hook with i18next language system
  ([3d89300](https://github.com/icklers/terpene-explorer/commit/3d89300))
- fix: translate effect names in terpene table and preserve category mapping
  ([9f80b87](https://github.com/icklers/terpene-explorer/commit/9f80b87))
- fix: translate effect names in terpene table and preserve category mapping
  ([713f473](https://github.com/icklers/terpene-explorer/commit/713f473))
- fix: UAT bug fixes - default table view and clear filters button ([b08da88](https://github.com/icklers/terpene-explorer/commit/b08da88))
- fix: use correct timer type in SearchBar ([f7eb0a7](https://github.com/icklers/terpene-explorer/commit/f7eb0a7))
- fix: validation and ci ([d15dbcd](https://github.com/icklers/terpene-explorer/commit/d15dbcd))
- fix(azure-swa): Configure workflow to wait for CI completion ([4e3dd38](https://github.com/icklers/terpene-explorer/commit/4e3dd38))
- fix(azure-swa): Fix static file serving and MIME type issues ([f735498](https://github.com/icklers/terpene-explorer/commit/f735498))
- fix(azure-swa): Fix wildcard patterns in navigationFallback exclude
  ([1828067](https://github.com/icklers/terpene-explorer/commit/1828067))
- fix(azure-swa): Improve routing reliability and file handling ([e31093c](https://github.com/icklers/terpene-explorer/commit/e31093c))
- fix(azure-swa): Point app_location directly to built files ([d28f304](https://github.com/icklers/terpene-explorer/commit/d28f304))
- fix(azure-swa): Remove hardcoded production URL for preview deployments
  ([c152516](https://github.com/icklers/terpene-explorer/commit/c152516))
- fix(azure-swa): Remove navigationFallback to fix JS MIME type issue
  ([862a4f2](https://github.com/icklers/terpene-explorer/commit/862a4f2))
- fix(azure-swa): Simplify MIME type configuration ([37fdfc1](https://github.com/icklers/terpene-explorer/commit/37fdfc1))
- fix(ci): automerge-dependabot syntax ([7b2edf1](https://github.com/icklers/terpene-explorer/commit/7b2edf1))
- fix(ci): deployment workflow can access ci build artifacts ([09d874f](https://github.com/icklers/terpene-explorer/commit/09d874f))
- fix(ci): remove extra parentheses in echo statements causing syntax error
  ([0f19876](https://github.com/icklers/terpene-explorer/commit/0f19876))
- fix(ci): SWA workflow ([ad7979a](https://github.com/icklers/terpene-explorer/commit/ad7979a))
- fix(ci): SWA workflow ([0945171](https://github.com/icklers/terpene-explorer/commit/0945171))
- fix(ci): update actions ([fc32404](https://github.com/icklers/terpene-explorer/commit/fc32404))
- fix(ci): update swa workflow ([036dcfe](https://github.com/icklers/terpene-explorer/commit/036dcfe))
- fix(filterService): guard against undefined category definition in getCategoryForEffect
  ([0cdc20b](https://github.com/icklers/terpene-explorer/commit/0cdc20b))
- fix(test): move integration tests to src/**tests** and fix linting ([5bd7e9b](https://github.com/icklers/terpene-explorer/commit/5bd7e9b))
- fix(tests): Fix German UI translation E2E tests ([8552254](https://github.com/icklers/terpene-explorer/commit/8552254))
- fix(theme): default to dark; add e2e test for terpene table colors ([67d5ba4](https://github.com/icklers/terpene-explorer/commit/67d5ba4))
- fix(theme): default to dark; add e2e test for terpene table colors ([7192648](https://github.com/icklers/terpene-explorer/commit/7192648))
- fix(ui): use dark contrast text for selected category tabs ([5bfc7e9](https://github.com/icklers/terpene-explorer/commit/5bfc7e9))
- fix(ui): use dark contrast text for selected category tabs ([b079a56](https://github.com/icklers/terpene-explorer/commit/b079a56))
- chore: Add @testing-library/dom to fix test dependencies ([92e4ddb](https://github.com/icklers/terpene-explorer/commit/92e4ddb))
- chore: add eslint-plugin-react-refresh (fix missing plugin) ([f9a2968](https://github.com/icklers/terpene-explorer/commit/f9a2968))
- chore: apply recent workspace edits (tsconfig/package/vitest) (#22)
  ([10377dc](https://github.com/icklers/terpene-explorer/commit/10377dc)), closes
  [#22](https://github.com/icklers/terpene-explorer/issues/22)
- chore: Enhance package.json scripts for better DX (T098) ([5874719](https://github.com/icklers/terpene-explorer/commit/5874719))
- chore: Fix formatting issues and finalize implementation ([5543c04](https://github.com/icklers/terpene-explorer/commit/5543c04))
- chore: format ([8e21021](https://github.com/icklers/terpene-explorer/commit/8e21021))
- chore: formatting ([8f4577a](https://github.com/icklers/terpene-explorer/commit/8f4577a))
- chore: formatting ([e09d525](https://github.com/icklers/terpene-explorer/commit/e09d525))
- chore: integrate qwen agent ([9e37e9b](https://github.com/icklers/terpene-explorer/commit/9e37e9b))
- chore: playwright agents ([c090365](https://github.com/icklers/terpene-explorer/commit/c090365))
- chore: sync local edits before creating PR ([7497df3](https://github.com/icklers/terpene-explorer/commit/7497df3))
- chore: update .gitignore ([4479907](https://github.com/icklers/terpene-explorer/commit/4479907))
- chore: update package name and repository metadata to icklers/terpene-explorer
  ([2b721bb](https://github.com/icklers/terpene-explorer/commit/2b721bb))
- chore: Update task tracking for completed T089, T094, T095, T096 ([5ffe898](https://github.com/icklers/terpene-explorer/commit/5ffe898))
- chore(ai-agents): add AI agent docs and agent tooling files ([aa13793](https://github.com/icklers/terpene-explorer/commit/aa13793))
- chore(ai): add spec-kit prompts for GH Copilot ([c53afb4](https://github.com/icklers/terpene-explorer/commit/c53afb4))
- chore(ci): mint GitHub App installation token before release and add diagnostics (#54)
  ([8269243](https://github.com/icklers/terpene-explorer/commit/8269243)), closes
  [#54](https://github.com/icklers/terpene-explorer/issues/54) [#53](https://github.com/icklers/terpene-explorer/issues/53)
- chore(ci): trigger release on CI workflow_run and download CI artifacts via dawidd6/action-download-
  ([f1c43a8](https://github.com/icklers/terpene-explorer/commit/f1c43a8))
- chore(ci): update GitHub workflows and Dependabot config (.github) ([7e7516a](https://github.com/icklers/terpene-explorer/commit/7e7516a))
- chore(data): schema fixes, add terpene adapter, replace unsafe casts; tests for adapter & schema
  ([07e58f8](https://github.com/icklers/terpene-explorer/commit/07e58f8))
- chore(deps): bump multiple dependencies (react-router-dom@7.9.4, uuid@13.0.0, eslint-plugin-react-ho
  ([bec0c16](https://github.com/icklers/terpene-explorer/commit/bec0c16))
- chore(docs): update mentions of repo name to icklers/terpene-explorer
  ([2f0469c](https://github.com/icklers/terpene-explorer/commit/2f0469c))
- chore(lint): migrate .eslintignore -> eslint.config.js ignores; remove deprecated .eslintignore
  ([5d9c9e8](https://github.com/icklers/terpene-explorer/commit/5d9c9e8))
- chore(test): improved filter tests ([ded5ac4](https://github.com/icklers/terpene-explorer/commit/ded5ac4))
- chore(tests): fix strict TypeScript errors in tests and update package name
  ([1673e8e](https://github.com/icklers/terpene-explorer/commit/1673e8e))
- feat: Add Azure Static Web App configuration ([fe4ba10](https://github.com/icklers/terpene-explorer/commit/fe4ba10))
- feat: add categorized effect filters with accessibility and mobile support
  ([7008cde](https://github.com/icklers/terpene-explorer/commit/7008cde))
- feat: Add EFFECT_CATEGORIZATION.md for effect categorization ([baf8097](https://github.com/icklers/terpene-explorer/commit/baf8097))
- feat: Add planning and task generation artifacts ([d4b8daf](https://github.com/icklers/terpene-explorer/commit/d4b8daf))
- feat: add table column simplification specification ([8033686](https://github.com/icklers/terpene-explorer/commit/8033686))
- feat: Apply category colors to effect filter chips ([3f0fd3c](https://github.com/icklers/terpene-explorer/commit/3f0fd3c))
- feat: complete bilingual terpene data support implementation ([81ce8e5](https://github.com/icklers/terpene-explorer/commit/81ce8e5))
- feat: complete mobile optimization specification and planning ([26ce6f8](https://github.com/icklers/terpene-explorer/commit/26ce6f8))
- feat: complete Phase 2 foundational infrastructure (6/6 tasks) ([066bdb4](https://github.com/icklers/terpene-explorer/commit/066bdb4))
- feat: Complete Phase 3 User Story 1 remaining tasks (T052-T056) ([078fa63](https://github.com/icklers/terpene-explorer/commit/078fa63))
- feat: Complete Phase 4 visualization integration (T062-T074) ([d8231f5](https://github.com/icklers/terpene-explorer/commit/d8231f5))
- feat: Complete specification for bilingual data support ([dea8ce6](https://github.com/icklers/terpene-explorer/commit/dea8ce6)), closes
  [#24](https://github.com/icklers/terpene-explorer/issues/24)
- feat: Complete specification for comfortably dark theme system ([9e6e1b3](https://github.com/icklers/terpene-explorer/commit/9e6e1b3)),
  closes [#121212](https://github.com/icklers/terpene-explorer/issues/121212)
  [#1e1e1e](https://github.com/icklers/terpene-explorer/issues/1e1e1e) [#272727](https://github.com/icklers/terpene-explorer/issues/272727)
  [#388e3c](https://github.com/icklers/terpene-explorer/issues/388e3c) [#4caf50](https://github.com/icklers/terpene-explorer/issues/4caf50)
  [#ffb300](https://github.com/icklers/terpene-explorer/issues/ffb300)
- feat: create TerpeneDetailModal component (Phase 3: T018) ([ebeb31a](https://github.com/icklers/terpene-explorer/commit/ebeb31a))
- feat: Finalize spec with TDD tasks and modern tooling ([1680943](https://github.com/icklers/terpene-explorer/commit/1680943))
- feat: Implement bilingual terpene data support with German translation
  ([af5074c](https://github.com/icklers/terpene-explorer/commit/af5074c))
- feat: implement foundational data infrastructure (Phase 2: 5/6 tasks)
  ([75c5433](https://github.com/icklers/terpene-explorer/commit/75c5433))
- feat: Implement Phase 2 foundational layer with TDD ([433fdc6](https://github.com/icklers/terpene-explorer/commit/433fdc6))
- feat: Implement Phase 3 User Story 1 services, hooks, and components (T044-T051)
  ([7350dd7](https://github.com/icklers/terpene-explorer/commit/7350dd7))
- feat: Implement Phase 4 core utilities and components (T062-T064) ([a2fdbde](https://github.com/icklers/terpene-explorer/commit/a2fdbde))
- feat: Implement Phase 4 visualization components (T065-T068) ([0f6f830](https://github.com/icklers/terpene-explorer/commit/0f6f830))
- feat: Implement Phase 5 - Theme & Language Settings with Persistence
  ([ef5b5f6](https://github.com/icklers/terpene-explorer/commit/ef5b5f6))
- feat: Implement security & accessibility polish (T089, T094-T096) ([bbfd179](https://github.com/icklers/terpene-explorer/commit/bbfd179))
- feat: implement table column simplification ([7de0ce8](https://github.com/icklers/terpene-explorer/commit/7de0ce8)), closes
  [#50](https://github.com/icklers/terpene-explorer/issues/50)
- feat: Implement WCAG 2.1 Level AA compliant dark theme with floating card design
  ([a3403b0](https://github.com/icklers/terpene-explorer/commit/a3403b0))
- feat: integrate new terpene database with table view and filters (Phase 3: T011b-T025)
  ([3466d14](https://github.com/icklers/terpene-explorer/commit/3466d14))
- feat: integrate TerpeneDetailModal with table (Phase 3: T019-T024) ([e21a59d](https://github.com/icklers/terpene-explorer/commit/e21a59d))
- feat: move search to sticky header for persistent accessibility (Phase 5: T036-T042)
  ([9dffac2](https://github.com/icklers/terpene-explorer/commit/9dffac2))
- feat: normalize terpene database with user-friendly effects ([f276b19](https://github.com/icklers/terpene-explorer/commit/f276b19))
- feat: remove sources column from table (Phase 4: T029-T032) ([83e9e53](https://github.com/icklers/terpene-explorer/commit/83e9e53))
- feat: Support multiple deployment targets ([9c67b75](https://github.com/icklers/terpene-explorer/commit/9c67b75))
- feat(007): complete TDD-compliant implementation plan for table column simplification
  ([78cae2b](https://github.com/icklers/terpene-explorer/commit/78cae2b))
- feat(azure-swa): Comprehensive staticwebapp.config.json with MIME type fixes
  ([59d70d8](https://github.com/icklers/terpene-explorer/commit/59d70d8))
- feat(ci): implement automated release with semantic-release (#53) ([5d52bdd](https://github.com/icklers/terpene-explorer/commit/5d52bdd)),
  closes [#53](https://github.com/icklers/terpene-explorer/issues/53)
- feat(filters): apply category color tokens to effect chips and mark tasks T032-T036 done; fix lint
  ([a72e9c8](https://github.com/icklers/terpene-explorer/commit/a72e9c8))
- feat(filters): apply category color tokens to effect chips and mark tasks T032-T036 done; fix lint
  ([c9f574f](https://github.com/icklers/terpene-explorer/commit/c9f574f))
- feat(filters/modal): sync category selection with category toggle; colorize modal effect chips by ca
  ([9450ed5](https://github.com/icklers/terpene-explorer/commit/9450ed5))
- feat(filters/modal): sync category selection with category toggle; colorize modal effect chips by ca
  ([7904cc2](https://github.com/icklers/terpene-explorer/commit/7904cc2))
- feat(spec): complete categorized effect filters specification ([3bd53ce](https://github.com/icklers/terpene-explorer/commit/3bd53ce)),
  closes [#29](https://github.com/icklers/terpene-explorer/issues/29)
- (ci): fix pnpm version ([cf5a769](https://github.com/icklers/terpene-explorer/commit/cf5a769))
- ✅ Phase 7: Mobile Responsiveness Complete ([67d4bce](https://github.com/icklers/terpene-explorer/commit/67d4bce))
- checkpoint ([1643c6d](https://github.com/icklers/terpene-explorer/commit/1643c6d))
- create mode 100644 .github/chatmodes/dev-react.chatmode.md ([3a0e096](https://github.com/icklers/terpene-explorer/commit/3a0e096))
- create mode 100644 .github/chatmodes/dev-react.chatmode.md ([681010b](https://github.com/icklers/terpene-explorer/commit/681010b))
- create mode 100644 .github/chatmodes/dev-react.chatmode.md ([f6186cf](https://github.com/icklers/terpene-explorer/commit/f6186cf))
- Disable auto-merge for Dependabot workflows ([d46c03d](https://github.com/icklers/terpene-explorer/commit/d46c03d))
- Disable auto-merge for Dependabot workflows ([9a70da1](https://github.com/icklers/terpene-explorer/commit/9a70da1))
- Fix ESLint react-hooks/set-state-in-effect violations ([6e63341](https://github.com/icklers/terpene-explorer/commit/6e63341))
- Implement Multi-Attribute Filter Search Bar Extension (#49) ([a5a3148](https://github.com/icklers/terpene-explorer/commit/a5a3148)),
  closes [#49](https://github.com/icklers/terpene-explorer/issues/49)
- Initial commit ([8b4c082](https://github.com/icklers/terpene-explorer/commit/8b4c082))
- Initial commit ([8576481](https://github.com/icklers/terpene-explorer/commit/8576481))
- Initial plan ([dd54623](https://github.com/icklers/terpene-explorer/commit/dd54623))
- Initial plan for ESLint react-hooks violations fix ([7ca3d9c](https://github.com/icklers/terpene-explorer/commit/7ca3d9c))
- Merge branch '003-categorized-effect-filters' into ai-agents ([360353a](https://github.com/icklers/terpene-explorer/commit/360353a))
- Merge branch '007-table-column-simplification' ([bab76a8](https://github.com/icklers/terpene-explorer/commit/bab76a8))
- Merge branch '008-therapeutic-modal-refactor' ([39f6567](https://github.com/icklers/terpene-explorer/commit/39f6567))
- Merge branch 'main' into 001-interactive-terpene-map ([64b3abd](https://github.com/icklers/terpene-explorer/commit/64b3abd))
- Merge branch 'main' into 001-interactive-terpene-map ([27e2fff](https://github.com/icklers/terpene-explorer/commit/27e2fff))
- Merge branch 'main' into 001-interactive-terpene-map ([fb2c4c9](https://github.com/icklers/terpene-explorer/commit/fb2c4c9))
- Merge branch 'main' into 001-interactive-terpene-map ([1309c90](https://github.com/icklers/terpene-explorer/commit/1309c90))
- Merge branch 'main' into 003-categorized-effect-filters ([51e522b](https://github.com/icklers/terpene-explorer/commit/51e522b))
- Merge branch 'main' into 003-categorized-effect-filters ([a84bc02](https://github.com/icklers/terpene-explorer/commit/a84bc02))
- Merge branch 'main' into 003-categorized-effect-filters ([32a7dc8](https://github.com/icklers/terpene-explorer/commit/32a7dc8))
- Merge branch 'main' into 004-dark-theme-design ([da33c3f](https://github.com/icklers/terpene-explorer/commit/da33c3f))
- Merge branch 'main' into 006-bilingual-data-support-qwen ([21037ae](https://github.com/icklers/terpene-explorer/commit/21037ae))
- Merge branch 'main' into dependabot/npm_and_yarn/development-dependencies-d56eae9b96
  ([33b80c9](https://github.com/icklers/terpene-explorer/commit/33b80c9))
- Merge branch 'main' into normalize-data ([bbc8d59](https://github.com/icklers/terpene-explorer/commit/bbc8d59))
- Merge branch 'qwen-agent' into 004-dark-theme-design ([810a853](https://github.com/icklers/terpene-explorer/commit/810a853))
- Merge pull request #1 from icklers/001-interactive-terpene-map ([f107238](https://github.com/icklers/terpene-explorer/commit/f107238)),
  closes [#1](https://github.com/icklers/terpene-explorer/issues/1)
- Merge pull request #10 from icklers/dependabot/npm_and_yarn/development-dependencies-d56eae9b96
  ([3998048](https://github.com/icklers/terpene-explorer/commit/3998048)), closes
  [#10](https://github.com/icklers/terpene-explorer/issues/10)
- Merge pull request #15 from icklers/001-interactive-terpene-map ([3739fc0](https://github.com/icklers/terpene-explorer/commit/3739fc0)),
  closes [#15](https://github.com/icklers/terpene-explorer/issues/15)
- Merge pull request #16 from icklers/001-interactive-terpene-map ([313492b](https://github.com/icklers/terpene-explorer/commit/313492b)),
  closes [#16](https://github.com/icklers/terpene-explorer/issues/16)
- Merge pull request #17 from icklers/001-interactive-terpene-map ([c8afbcf](https://github.com/icklers/terpene-explorer/commit/c8afbcf)),
  closes [#17](https://github.com/icklers/terpene-explorer/issues/17)
- Merge pull request #18 from icklers/001-interactive-terpene-map ([04d0b60](https://github.com/icklers/terpene-explorer/commit/04d0b60)),
  closes [#18](https://github.com/icklers/terpene-explorer/issues/18)
- Merge pull request #19 from icklers/ci-fix ([9b0bc7b](https://github.com/icklers/terpene-explorer/commit/9b0bc7b)), closes
  [#19](https://github.com/icklers/terpene-explorer/issues/19)
- Merge pull request #2 from icklers/001-interactive-terpene-map ([564f952](https://github.com/icklers/terpene-explorer/commit/564f952)),
  closes [#2](https://github.com/icklers/terpene-explorer/issues/2)
- Merge pull request #20 from icklers/001-interactive-terpene-map ([7c4d9bf](https://github.com/icklers/terpene-explorer/commit/7c4d9bf)),
  closes [#20](https://github.com/icklers/terpene-explorer/issues/20)
- Merge pull request #21 from icklers/001-interactive-terpene-map ([8f9c496](https://github.com/icklers/terpene-explorer/commit/8f9c496)),
  closes [#21](https://github.com/icklers/terpene-explorer/issues/21)
- Merge pull request #25 from icklers/002-terpene-data-model ([265ffa1](https://github.com/icklers/terpene-explorer/commit/265ffa1)), closes
  [#25](https://github.com/icklers/terpene-explorer/issues/25)
- Merge pull request #26 from icklers/feat/adapter-tests-002-terpene-data-model
  ([076e152](https://github.com/icklers/terpene-explorer/commit/076e152)), closes
  [#26](https://github.com/icklers/terpene-explorer/issues/26)
- Merge pull request #30 from icklers/normalize-data ([20c632d](https://github.com/icklers/terpene-explorer/commit/20c632d)), closes
  [#30](https://github.com/icklers/terpene-explorer/issues/30)
- Merge pull request #36 from icklers/dependabot-fixes ([947b295](https://github.com/icklers/terpene-explorer/commit/947b295)), closes
  [#36](https://github.com/icklers/terpene-explorer/issues/36)
- Merge pull request #37 from icklers/ai-agents ([2239369](https://github.com/icklers/terpene-explorer/commit/2239369)), closes
  [#37](https://github.com/icklers/terpene-explorer/issues/37)
- Merge pull request #38 from icklers/ai-agents ([ef0ee9e](https://github.com/icklers/terpene-explorer/commit/ef0ee9e)), closes
  [#38](https://github.com/icklers/terpene-explorer/issues/38)
- Merge pull request #39 from icklers/003-categorized-effect-filters
  ([f753c0c](https://github.com/icklers/terpene-explorer/commit/f753c0c)), closes
  [#39](https://github.com/icklers/terpene-explorer/issues/39)
- Merge pull request #40 from icklers/003-categorized-effect-filters
  ([83d7e0c](https://github.com/icklers/terpene-explorer/commit/83d7e0c)), closes
  [#40](https://github.com/icklers/terpene-explorer/issues/40)
- Merge pull request #42 from icklers/003-categorized-effect-filters
  ([7a7b697](https://github.com/icklers/terpene-explorer/commit/7a7b697)), closes
  [#42](https://github.com/icklers/terpene-explorer/issues/42)
- Merge pull request #43 from icklers/004-dark-theme-design ([0c5c48f](https://github.com/icklers/terpene-explorer/commit/0c5c48f)), closes
  [#43](https://github.com/icklers/terpene-explorer/issues/43)
- Merge pull request #45 from icklers/fix/table-color ([7657c21](https://github.com/icklers/terpene-explorer/commit/7657c21)), closes
  [#45](https://github.com/icklers/terpene-explorer/issues/45)
- Merge pull request #46 from icklers/006-bilingual-data-support-qwen
  ([e58a9e0](https://github.com/icklers/terpene-explorer/commit/e58a9e0)), closes
  [#46](https://github.com/icklers/terpene-explorer/issues/46)
- Merge pull request #47 from icklers/copilot/fix-eslint-react-hooks-violations
  ([aba6a15](https://github.com/icklers/terpene-explorer/commit/aba6a15)), closes
  [#47](https://github.com/icklers/terpene-explorer/issues/47)
- Phase 2 Completion (T025-T035) - Application Bootstrap: ([c1988b9](https://github.com/icklers/terpene-explorer/commit/c1988b9))
- plan and constitution ([8e934cd](https://github.com/icklers/terpene-explorer/commit/8e934cd))
- Update src/services/filterService.ts ([15ad189](https://github.com/icklers/terpene-explorer/commit/15ad189))
- Update staticwebapp.config.json ([62daab3](https://github.com/icklers/terpene-explorer/commit/62daab3))
- Update staticwebapp.config.json ([87e6394](https://github.com/icklers/terpene-explorer/commit/87e6394))
- docs: add complete specification for 002-terpene-data-model feature
  ([0d79457](https://github.com/icklers/terpene-explorer/commit/0d79457))
- docs: add comprehensive implementation status report ([ca5d4d7](https://github.com/icklers/terpene-explorer/commit/ca5d4d7))
- docs(spec): add complete specification for table filter bar extension
  ([69f6b36](https://github.com/icklers/terpene-explorer/commit/69f6b36))
- docs(spec): address analysis findings for therapeutic modal refactor
  ([eecfb33](https://github.com/icklers/terpene-explorer/commit/eecfb33))
- refactor: Fix unused parameter warnings in Vite config ([f6bc0a4](https://github.com/icklers/terpene-explorer/commit/f6bc0a4))
- refactor(filterService): remove redundant guard in getCategoryForEffect
  ([5677a12](https://github.com/icklers/terpene-explorer/commit/5677a12))
- style: apply consistent code formatting across codebase ([3b2b637](https://github.com/icklers/terpene-explorer/commit/3b2b637))
- style: apply Prettier formatting to remaining files ([fb72738](https://github.com/icklers/terpene-explorer/commit/fb72738))
- style: fix indentation and formatting in Home.tsx ([d14e03b](https://github.com/icklers/terpene-explorer/commit/d14e03b))
- ci: add Azure Static Web Apps workflow file ([b7e1783](https://github.com/icklers/terpene-explorer/commit/b7e1783))
- ci: add Azure Static Web Apps workflow file ([290768e](https://github.com/icklers/terpene-explorer/commit/290768e))
- ci: remove default Azure SWA workflow ([0e6dd97](https://github.com/icklers/terpene-explorer/commit/0e6dd97))
- ci: workflow config ([226f460](https://github.com/icklers/terpene-explorer/commit/226f460))
- ci: workflow for Azure SWA, rename wf files ([b5ab50c](https://github.com/icklers/terpene-explorer/commit/b5ab50c))
- build: add missing eslint dependencies for flat config ([84717e4](https://github.com/icklers/terpene-explorer/commit/84717e4))
- build: upgrade to pnpm 10.19.0 ([3d6bda9](https://github.com/icklers/terpene-explorer/commit/3d6bda9))
- build(deps-dev): bump eslint-config-prettier from 9.1.2 to 10.1.8 (#12)
  ([ca22965](https://github.com/icklers/terpene-explorer/commit/ca22965)), closes
  [#12](https://github.com/icklers/terpene-explorer/issues/12)
- build(deps-dev): bump eslint-config-prettier from 9.1.2 to 10.1.8 (#12)
  ([14aeca9](https://github.com/icklers/terpene-explorer/commit/14aeca9)), closes
  [#12](https://github.com/icklers/terpene-explorer/issues/12)
- build(deps-dev): bump jsdom from 25.0.1 to 27.0.1 (#14) ([54c9dd7](https://github.com/icklers/terpene-explorer/commit/54c9dd7)), closes
  [#14](https://github.com/icklers/terpene-explorer/issues/14)
- build(deps-dev): bump jsdom from 25.0.1 to 27.0.1 (#14) ([8a9159e](https://github.com/icklers/terpene-explorer/commit/8a9159e)), closes
  [#14](https://github.com/icklers/terpene-explorer/issues/14)
- build(deps-dev): bump the development-dependencies group with 2 updates
  ([198226c](https://github.com/icklers/terpene-explorer/commit/198226c))
- build(deps-dev): bump the development-dependencies group with 2 updates
  ([b09ceee](https://github.com/icklers/terpene-explorer/commit/b09ceee))
- build(deps): bump i18next from 24.2.3 to 25.6.0 (#13) ([05b5aba](https://github.com/icklers/terpene-explorer/commit/05b5aba)), closes
  [#13](https://github.com/icklers/terpene-explorer/issues/13)
- build(deps): bump i18next from 24.2.3 to 25.6.0 (#13) ([6f02a88](https://github.com/icklers/terpene-explorer/commit/6f02a88)), closes
  [#13](https://github.com/icklers/terpene-explorer/issues/13)
- build(deps): bump the production-dependencies group with 2 updates (#11)
  ([b471a11](https://github.com/icklers/terpene-explorer/commit/b471a11)), closes
  [#11](https://github.com/icklers/terpene-explorer/issues/11)
- build(deps): bump the production-dependencies group with 2 updates (#11)
  ([2a744cf](https://github.com/icklers/terpene-explorer/commit/2a744cf)), closes
  [#11](https://github.com/icklers/terpene-explorer/issues/11)
- test: Add Phase 3 hook tests (T038-T039) ([cc440ef](https://github.com/icklers/terpene-explorer/commit/cc440ef))
- test: Add Phase 3 TDD test suite (T036-T037) ([59efa25](https://github.com/icklers/terpene-explorer/commit/59efa25))
- test: Add Phase 4 TDD test suite for User Story 3 (T057-T061) ([24006c3](https://github.com/icklers/terpene-explorer/commit/24006c3))
- test: Complete Phase 3 TDD test suite (T040-T043) ([ae40e95](https://github.com/icklers/terpene-explorer/commit/ae40e95))

### BREAKING CHANGE

- Manual tag creation no longer triggers releases. The release process is now fully automated via semantic-release on pushes to main.

- chore(ci): update github-script action to v8

- Update actions/github-script from v7 to v8 in both PR validation and release workflows

- Ensures compatibility with latest GitHub Actions runtime

- chore(ci): avoid pushing to protected main by removing @semantic-release/git

- chore(ci): enable git pushes via GitHub App installation token; add token mint step to release workflow

- chore(ci): ensure App installation token is minted before semantic-release; add diagnostic/fallback logs

### Added

- Categorized Effect Filters feature
  - 4 therapeutic categories: Mood & Energy, Cognitive & Mental Enhancement, Relaxation & Anxiety Management, Physical & Physiological
    Management
  - Category-level filtering with OR logic
  - Color-coded UI with WCAG 2.1 AA compliant contrast ratios
  - Mobile-responsive accordion interface
  - Full accessibility support with ARIA labels and keyboard navigation
  - Comprehensive test suite with 71/71 tests passing

## [1.0.0] - 2024-10-27

### Added

- Interactive D3.js visualizations for terpene data
- Effect-based filtering with search functionality
- Multi-language support (i18next)
- Material UI component library integration
- TypeScript type safety
- Zod schema validation
- Comprehensive test suite

### Security

- Static JSON database (no backend dependencies)
- Input sanitization for search and filter queries

---

## Release Naming Convention

Releases are named after terpenes:

- v1.0.0: Myrcene (Earthy, Musky)
- Future releases: Pinene, Limonene, Linalool, Beta-Caryophyllene, etc.
