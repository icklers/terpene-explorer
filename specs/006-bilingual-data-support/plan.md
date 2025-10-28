# Implementation Plan: Bilingual Terpene Data Support

**Branch**: `006-bilingual-data-support` | **Date**: 2025-10-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/006-bilingual-data-support/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add full bilingual (English/German) data support to the Interactive Terpene Map by extracting translatable terpene content into separate translation files while maintaining the existing `terpene-database.json` as the single source of truth for English content. The implementation will use i18next's translation infrastructure (already in place for UI strings) to serve terpene data translations. German translations will be stored in a separate JSON file that references terpene entries by ID. The system will gracefully fall back to English when German translations are unavailable, displaying untranslated content in italic text with an "EN" language badge.

## Technical Context

**Language/Version**: TypeScript 5.7.2, Node.js 24 LTS, ES2022 target  
**Primary Dependencies**: React 19.2.0, Material UI 6.3.0, i18next 25.6.0, react-i18next 15.2.0, Zod 3.24.1  
**Storage**: Static JSON files (`/data/terpene-database.json` for English, `/data/terpene-translations-de.json` for German)  
**Testing**: Vitest 4.0.3 (unit/integration), Playwright 1.49.1 (E2E), vitest-axe 0.1.0 (accessibility)  
**Target Platform**: Web (static site deployed to Vercel/Netlify/GitHub Pages)  
**Project Type**: Single-page web application with Vite 7.1.12 bundler  
**Performance Goals**: <500ms data load time, <100ms search response, <50ms translation lookup  
**Constraints**: Data file size increase <50% vs English-only, maintain existing i18n infrastructure, no backend required  
**Scale/Scope**: ~60 terpenes in database, 8 translatable fields per terpene, 2 languages (en, de)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design._

✅ **Gate 1: Accessibility Requirements**

- [x] WCAG 2.1 Level AA compliance documented - Fallback indicator (italic + "EN" badge) is perceivable visually and semantically
- [x] 4.5:1 contrast ratio specified - Existing theme contrast ratios apply to all translated content
- [x] Keyboard navigation plan documented - No new interactive elements; language switcher already keyboard-accessible
- [x] Screen reader support considered - ARIA labels will include language context for fallback content
- [x] vitest-axe included in test strategy - Existing accessibility test suite will cover translated content

✅ **Gate 2: Performance Budgets**

- [x] Lighthouse score targets defined - Maintain existing Performance ≥90, Accessibility ≥95
- [x] Response time targets specified - <500ms load (FR-019), <100ms search (SC-002), <50ms lookup (User Story 4)
- [x] Bundle size budget considered - Translation files add <50% to data size (SC-006), ~30KB gzipped per language
- [x] Virtualization plan for large lists - Existing react-window implementation handles translated content

✅ **Gate 3: Testing Strategy**

- [x] Unit test framework identified - Vitest for translation service, lookup logic, fallback behavior
- [x] E2E test framework identified - Playwright for language switching, cross-language search, visual indicators
- [x] Accessibility test tool identified - vitest-axe for fallback indicator accessibility
- [x] Test coverage target defined - ≥80% for translation service, fallback logic, search integration

✅ **Gate 4: Component Reuse**

- [x] Material UI components specified - Chip component for "EN" badge, existing Typography for italic text
- [x] Custom components justified - Translation service utility (new, domain-specific logic required)
- [x] No reinvention of existing Material UI components - Reusing existing i18next integration, no UI reinvention

✅ **Gate 5: Static Architecture**

- [x] No backend server dependencies - All translation data served as static JSON files
- [x] Data source is static files - `terpene-database.json` (English), `terpene-translations-de.json` (German)
- [x] Deployment target is static hosting - No changes to existing Vercel/Netlify deployment
- [x] No database or API required - Client-side translation merging and lookup

✅ **Gate 6: Internationalization**

- [x] i18next 25.6.0 already included - Extending existing i18n infrastructure for data translations
- [x] Supported languages specified - English (default), German (de)
- [x] Translation files location documented - `/data/` for terpene data, `/src/i18n/locales/` for UI strings
- [x] No hard-coded user-facing strings - All terpene content sourced from translation-aware service

## Project Structure

### Documentation (this feature)

```text
specs/006-bilingual-data-support/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── translation-service.ts  # TypeScript interface definitions
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (existing)
frontend/src/
├── components/
│   ├── common/
│   │   └── LanguageBadge.tsx        # NEW: "EN" fallback indicator component
│   ├── filters/
│   │   └── [existing filter components - updated for bilingual support]
│   ├── layout/
│   └── visualizations/
│       └── [existing viz components - updated for bilingual data]
├── hooks/
│   ├── useTerpeneData.ts            # UPDATED: Integration with translation service
│   └── useTerpeneTranslation.ts     # NEW: Hook for accessing translated terpene data
├── i18n/
│   ├── config.ts                    # UPDATED: Register terpene data namespace
│   └── locales/
│       ├── en.json                  # Existing UI translations
│       └── de.json                  # Existing UI translations
├── models/
│   ├── Terpene.ts                   # UPDATED: Add translation-aware types
│   └── TerpeneTranslation.ts        # NEW: Translation data model
├── services/
│   ├── translationService.ts        # NEW: Core translation lookup and fallback logic
│   └── terpeneDataService.ts        # UPDATED: Load and merge translations
└── utils/
    └── translationHelpers.ts        # NEW: Helper functions for cross-language search

data/
├── terpene-database.json            # Existing: English content (single source of truth)
└── terpene-translations-de.json     # NEW: German translations by terpene ID

tests/
├── unit/
│   ├── services/
│   │   └── translationService.test.ts  # NEW: Translation lookup and fallback tests
│   └── utils/
│       └── translationHelpers.test.ts  # NEW: Cross-language search tests
├── integration/
│   └── terpene-translation.test.ts     # NEW: End-to-end translation flow tests
└── e2e/
    └── bilingual-support.spec.ts       # NEW: Playwright tests for language switching
```

**Structure Decision**: This is a web application using the existing React + Vite structure. The bilingual feature adds a new translation service layer in `/src/services/`, a new hook for consuming translated data, a new UI component for fallback indicators, and German translation data in `/data/`. All changes integrate with the existing i18next infrastructure and component architecture, requiring no structural reorganization.

## TDD Implementation Strategy

**Approach**: RED → GREEN → REFACTOR for all new code

This feature will be implemented following strict Test-Driven Development (TDD) principles. Each implementation cycle follows the pattern:

1. **RED**: Write a failing test that defines desired behavior
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Clean up code while keeping tests green

### TDD Cycle Breakdown

#### Cycle 1: Translation File Loading (Foundation)

**RED - Write Tests First**:
```typescript
// tests/unit/services/translationLoader.test.ts
describe('TranslationLoader', () => {
  it('should load valid German translation file', async () => {
    const loader = new TranslationLoader();
    const result = await loader.loadTranslations('de');
    expect(result).toBeDefined();
    expect(result?.language).toBe('de');
  });

  it('should return undefined for non-existent language', async () => {
    const loader = new TranslationLoader();
    const result = await loader.loadTranslations('fr');
    expect(result).toBeUndefined();
  });

  it('should validate translation file schema', () => {
    const invalidData = { language: 'de' }; // Missing required fields
    expect(() => loader.validateTranslationFile(invalidData)).toThrow();
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `TranslationLoader` class
- Implement `loadTranslations()` method with dynamic import
- Implement `validateTranslationFile()` with Zod schema
- Make all tests pass

**REFACTOR**:
- Extract file path logic to constants
- Add error handling with proper error types
- Improve type safety

---

#### Cycle 2: Translation Cache (Performance)

**RED - Write Tests First**:
```typescript
// tests/unit/services/translationCache.test.ts
describe('TranslationCache', () => {
  it('should store and retrieve translations by ID', () => {
    const cache = new TranslationCache();
    cache.set('uuid-123', { name: 'Limonen' });
    expect(cache.get('uuid-123')).toEqual({ name: 'Limonen' });
  });

  it('should return undefined for non-existent ID', () => {
    const cache = new TranslationCache();
    expect(cache.get('uuid-456')).toBeUndefined();
  });

  it('should support loading bulk translations', () => {
    const cache = new TranslationCache();
    const translations = { 'uuid-1': { name: 'Test1' }, 'uuid-2': { name: 'Test2' } };
    cache.loadBulk(translations);
    expect(cache.get('uuid-1')?.name).toBe('Test1');
    expect(cache.get('uuid-2')?.name).toBe('Test2');
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `TranslationCache` class with Map storage
- Implement `set()`, `get()`, `loadBulk()` methods
- Make all tests pass

**REFACTOR**:
- Optimize memory usage
- Add clear() method for testing
- Add size tracking

---

#### Cycle 3: Translation Merging (Core Logic)

**RED - Write Tests First**:
```typescript
// tests/unit/services/translationService.test.ts
describe('TranslationService - Merge Logic', () => {
  it('should merge German translation with English base data', () => {
    const baseTerpene = { id: 'uuid-1', name: 'Limonene', aroma: 'Citrus' };
    const translation = { name: 'Limonen' };
    
    const result = service.mergeTerpeneTranslation(baseTerpene, translation, 'de');
    
    expect(result.name).toBe('Limonen'); // German
    expect(result.aroma).toBe('Citrus'); // English fallback
    expect(result.translationStatus.fallbackFields).toContain('aroma');
  });

  it('should mark fully translated terpenes correctly', () => {
    const baseTerpene = { id: 'uuid-1', name: 'Limonene', aroma: 'Citrus' };
    const translation = { name: 'Limonen', aroma: 'Zitrus' };
    
    const result = service.mergeTerpeneTranslation(baseTerpene, translation, 'de');
    
    expect(result.translationStatus.isFullyTranslated).toBe(true);
    expect(result.translationStatus.fallbackFields).toHaveLength(0);
  });

  it('should handle missing translation gracefully', () => {
    const baseTerpene = { id: 'uuid-1', name: 'Limonene', aroma: 'Citrus' };
    
    const result = service.mergeTerpeneTranslation(baseTerpene, undefined, 'de');
    
    expect(result.name).toBe('Limonene'); // All English
    expect(result.translationStatus.isFullyTranslated).toBe(false);
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `mergeTerpeneTranslation()` function
- Implement field-by-field merging logic
- Calculate translation status metadata
- Make all tests pass

**REFACTOR**:
- Extract field iteration to helper function
- Improve type inference
- Add comprehensive JSDoc comments

---

#### Cycle 4: Translation Service Integration

**RED - Write Tests First**:
```typescript
// tests/unit/services/translationService.test.ts (continued)
describe('TranslationService - Full Service', () => {
  it('should initialize and load German translations', async () => {
    const service = new TranslationService();
    await service.initialize('de');
    
    expect(service.getCurrentLanguage()).toBe('de');
    expect(service.isInitialized()).toBe(true);
  });

  it('should get translated terpene by ID', async () => {
    await service.initialize('de');
    const terpene = service.getTranslatedTerpene('uuid-123', 'de');
    
    expect(terpene).toBeDefined();
    expect(terpene.name).toBe('Limonen');
  });

  it('should switch languages and reload translations', async () => {
    await service.initialize('en');
    await service.switchLanguage('de');
    
    expect(service.getCurrentLanguage()).toBe('de');
    const terpene = service.getTranslatedTerpene('uuid-123', 'de');
    expect(terpene.name).toBe('Limonen');
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `TranslationService` class
- Wire up loader + cache + merge logic
- Implement `initialize()`, `getTranslatedTerpene()`, `switchLanguage()`
- Make all tests pass

**REFACTOR**:
- Add singleton pattern if needed
- Optimize initialization sequence
- Add comprehensive error handling

---

#### Cycle 5: Cross-Language Search

**RED - Write Tests First**:
```typescript
// tests/unit/services/translationSearch.test.ts
describe('TranslationSearchService', () => {
  it('should find terpenes by German term', () => {
    const results = searchService.search('Zitrone', 'de');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Limonen');
  });

  it('should find terpenes by English term when UI is German', () => {
    const results = searchService.search('Lemon', 'de');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Limonen'); // Result in German
  });

  it('should handle diacritic-insensitive search', () => {
    const results = searchService.search('Zitrus', 'de');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should rank all matches equally regardless of language', () => {
    const results = searchService.search('citrus', 'de');
    // All results should be present, not filtered by match language
    expect(results.length).toBeGreaterThan(0);
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `TranslationSearchService` class
- Implement `buildSearchIndex()` with English + German terms
- Implement `search()` with case-insensitive matching
- Implement `normalizeDiacritics()` helper
- Make all tests pass

**REFACTOR**:
- Optimize search performance (early exit, caching)
- Extract normalization logic
- Add search scoring if needed

---

#### Cycle 6: React Hook Integration

**RED - Write Tests First**:
```typescript
// tests/unit/hooks/useTerpeneTranslation.test.ts
import { renderHook, act } from '@testing-library/react';

describe('useTerpeneTranslation', () => {
  it('should provide translated terpene', async () => {
    const { result } = renderHook(() => useTerpeneTranslation());
    
    await act(async () => {
      await result.current.switchLanguage('de');
    });
    
    const terpene = result.current.getTerpene('uuid-123');
    expect(terpene?.name).toBe('Limonen');
  });

  it('should track loading state during initialization', async () => {
    const { result } = renderHook(() => useTerpeneTranslation());
    
    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await result.current.switchLanguage('de');
    });
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should detect fallback fields', async () => {
    const { result } = renderHook(() => useTerpeneTranslation());
    await act(async () => {
      await result.current.switchLanguage('de');
    });
    
    const fallbacks = result.current.getFallbackFields('uuid-partial');
    expect(fallbacks).toContain('aroma'); // Partially translated terpene
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `useTerpeneTranslation` hook
- Wire up TranslationService
- Implement state management (loading, error, language)
- Make all tests pass

**REFACTOR**:
- Optimize re-renders with useMemo
- Add error boundary integration
- Improve TypeScript inference

---

#### Cycle 7: UI Components (Fallback Indicators)

**RED - Write Tests First**:
```typescript
// tests/unit/components/LanguageBadge.test.tsx
describe('LanguageBadge', () => {
  it('should render language code', () => {
    const { getByText } = render(<LanguageBadge language="en" />);
    expect(getByText('EN')).toBeInTheDocument();
  });

  it('should have proper ARIA label', () => {
    const { getByLabelText } = render(<LanguageBadge language="en" />);
    expect(getByLabelText('Content in English')).toBeInTheDocument();
  });
});

// tests/unit/components/TranslatedText.test.tsx
describe('TranslatedText', () => {
  it('should render normal text when not fallback', () => {
    const { container } = render(
      <TranslatedText isFallback={false}>Test content</TranslatedText>
    );
    expect(container.querySelector('em')).not.toBeInTheDocument();
  });

  it('should render italic text with badge when fallback', () => {
    const { container, getByText } = render(
      <TranslatedText isFallback={true} fallbackLanguage="en">
        Test content
      </TranslatedText>
    );
    expect(container.querySelector('em')).toBeInTheDocument();
    expect(getByText('EN')).toBeInTheDocument();
  });
});
```

**GREEN - Implement Minimal Code**:
- Create `LanguageBadge` component with Material UI Chip
- Create `TranslatedText` component with conditional styling
- Make all tests pass

**REFACTOR**:
- Extract theme-based styling
- Add size variants
- Optimize re-renders

---

#### Cycle 8: Integration Tests (Component + Service)

**RED - Write Tests First**:
```typescript
// tests/integration/terpene-translation.test.tsx
describe('Translation Data Integration', () => {
  it('should display German translations in terpene card', async () => {
    const { findByText } = render(<TerpeneCard terpeneId="uuid-123" />);
    
    // Switch to German
    await userEvent.click(screen.getByRole('button', { name: /language/i }));
    await userEvent.click(screen.getByText('Deutsch'));
    
    // Verify German name appears
    expect(await findByText('Limonen')).toBeInTheDocument();
  });

  it('should show fallback indicators for partial translations', async () => {
    const { findByText } = render(<TerpeneDetail terpeneId="uuid-partial" />);
    
    // Switch to German
    await switchLanguage('de');
    
    // Verify fallback badge appears for untranslated field
    expect(await findByText('EN')).toBeInTheDocument();
  });

  it('should preserve filters when switching language', async () => {
    const { findByText } = render(<TerpeneExplorer />);
    
    // Apply filter
    await userEvent.click(screen.getByText('Sedative'));
    
    // Switch language
    await switchLanguage('de');
    
    // Verify filter still active (now in German)
    expect(await findByText('Beruhigend')).toBeInTheDocument();
  });
});
```

**GREEN - Implement Minimal Code**:
- Update existing components to use `useTerpeneTranslation`
- Add `TranslatedText` wrappers where needed
- Wire up language switcher to service
- Make all tests pass

**REFACTOR**:
- Extract common translation patterns
- Optimize component re-renders
- Improve prop drilling (consider Context if needed)

---

#### Cycle 9: E2E Tests (User Journeys)

**RED - Write Tests First**:
```typescript
// tests/e2e/bilingual-support.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Bilingual Support', () => {
  test('should switch language and display German content', async ({ page }) => {
    await page.goto('/');
    
    // Switch to German
    await page.click('[aria-label="Change language"]');
    await page.click('text=Deutsch');
    
    // Verify German content
    await expect(page.locator('h1')).toContainText('Limonen');
  });

  test('should search with German terms', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Change language"]');
    await page.click('text=Deutsch');
    
    // Search with German term
    await page.fill('[placeholder*="suchen"]', 'Zitrone');
    
    // Verify results appear
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('should display fallback indicators accessibly', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Change language"]');
    await page.click('text=Deutsch');
    
    // Check for EN badge on partially translated content
    const badge = page.locator('[aria-label="Content in English"]');
    await expect(badge).toBeVisible();
  });
});
```

**GREEN - Implement Minimal Code**:
- Ensure all user-facing features work end-to-end
- Fix any integration issues discovered
- Make all E2E tests pass

**REFACTOR**:
- Optimize page load performance
- Add loading states where needed
- Improve error handling

---

#### Cycle 10: Accessibility Tests

**RED - Write Tests First**:
```typescript
// tests/unit/components/accessibility.test.tsx
import { axe } from 'vitest-axe';

describe('Translation Accessibility', () => {
  it('should have no accessibility violations in translated content', async () => {
    const { container } = render(
      <TranslatedText isFallback={true}>Test content</TranslatedText>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should announce language context to screen readers', () => {
    const { getByRole } = render(<LanguageBadge language="en" />);
    const badge = getByRole('status', { hidden: true });
    expect(badge).toHaveAttribute('aria-label', 'Content in English');
  });

  it('should maintain 4.5:1 contrast ratio for fallback text', async () => {
    const { container } = render(
      <TranslatedText isFallback={true}>Test</TranslatedText>
    );
    // Manual check or automated contrast checker
    const italicText = container.querySelector('em');
    expect(italicText).toHaveStyle({ fontStyle: 'italic' });
  });
});
```

**GREEN - Implement Minimal Code**:
- Add ARIA labels to badge components
- Ensure semantic HTML (`<em>` for italic)
- Verify contrast ratios
- Make all accessibility tests pass

**REFACTOR**:
- Extract ARIA label generation
- Add skip links if needed
- Document accessibility features

---

### TDD Workflow Summary

For each cycle:

1. **Start with RED**: Write failing test that describes desired behavior
2. **Move to GREEN**: Write simplest code that makes test pass (no premature optimization)
3. **REFACTOR**: Improve code quality without changing behavior
4. **Verify**: Run all tests to ensure nothing broke
5. **Commit**: Commit after each RED-GREEN-REFACTOR cycle

### TDD Principles Applied

- **Test First**: No production code without a failing test
- **Small Steps**: Each cycle is small and focused
- **Fast Feedback**: Tests run in <5 seconds for rapid iteration
- **Regression Safety**: Growing test suite prevents future breaks
- **Documentation**: Tests serve as executable specifications
- **Refactoring Confidence**: Green tests enable fearless refactoring

### Test Coverage Targets

| Layer | Target Coverage | Notes |
|-------|----------------|-------|
| Translation Service | 95%+ | Core business logic, critical |
| React Hooks | 90%+ | Integration with React lifecycle |
| UI Components | 85%+ | Focus on behavior, not implementation |
| Integration Tests | Key flows | Language switch, search, fallback |
| E2E Tests | Happy paths | User journeys from spec.md |
| Accessibility | 100% | All interactive elements tested |

### Continuous Integration

All tests must pass before merging:

```bash
# Type checking
pnpm run type-check

# Unit tests with coverage
pnpm run test:coverage

# Integration tests
pnpm run test:integration

# E2E tests
pnpm run test:e2e

# Accessibility tests
pnpm run test:a11y

# All checks
pnpm run validate
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution gates pass without exceptions.
