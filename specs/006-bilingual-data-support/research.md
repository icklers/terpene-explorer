# Research: Bilingual Terpene Data Support

**Feature**: 006-bilingual-data-support  
**Date**: 2025-10-28  
**Status**: Complete

## Overview

This document consolidates research findings for implementing bilingual (English/German) data support in the Terpene Explorer application. The research focuses on translation data structure, i18next integration patterns, fallback mechanisms, and cross-language search strategies.

## Research Tasks

### 1. Translation Data Structure Pattern

**Decision**: Separate translation file with ID-based references

**Rationale**:
- Minimizes data redundancy by keeping language-independent data (molecular formulas, boiling points, IDs, concentration ranges) in a single location
- Allows incremental translation without modifying base data file
- Simplifies version control - translators work in separate files without merge conflicts
- Follows i18next best practices for structured data translation
- Enables future language additions with same pattern
- Keeps English content in existing `terpene-database.json` as single source of truth

**Alternatives Considered**:
1. **Inline translations** - Each terpene entry contains nested `en`/`de` objects for all fields
   - Rejected: Violates DRY principle, bloats file size, creates maintenance burden
2. **Hybrid approach** - Language-independent data in base file, all translations (en + de) in separate file
   - Rejected: Unnecessary abstraction since English content already exists in base file
3. **Duplicate complete databases** - Separate `terpene-database-en.json` and `terpene-database-de.json`
   - Rejected: Massive redundancy, high risk of data inconsistency

**Implementation Details**:
- **Base data**: `/data/terpene-database.json` (existing) contains all English content
- **German translations**: `/data/terpene-translations-de.json` (new) contains only translated fields
- **Translation file structure**:
  ```json
  {
    "terpenes": {
      "<terpene-uuid>": {
        "name": "Limonen",
        "description": "German description...",
        "aroma": "Zitrus, Zitrone, Orange",
        "taste": "Helles Zitrusaroma mit leichter Süße",
        "effects": ["Stimmungsaufhellend", "Stressabbau", "Energetisierend"],
        "therapeuticProperties": ["Antidepressiv", "Entzündungshemmend", "Angstlösend"],
        "sources": ["Zitronenschale", "Orangenschale"],
        "notableDifferences": "German translation of notable differences..."
      }
    }
  }
  ```
- **Translatable fields**: name, description, aroma, taste, effects (array), therapeuticProperties (array), sources (array), notableDifferences
- **Non-translatable fields**: id, isomerOf, isomerType, category, concentrationRange, molecularData (all fields), references, researchTier

### 2. i18next Integration for Data Translations

**Decision**: Create separate i18next namespace for terpene data translations

**Rationale**:
- i18next already configured in the application for UI strings
- Namespaces provide logical separation between UI translations (`common`, `navigation`) and data translations (`terpeneData`)
- Enables lazy loading of large translation datasets
- Leverages existing language detection and switching infrastructure
- Aligns with i18next best practices for structured JSON translation

**Alternatives Considered**:
1. **Custom translation service without i18next** - Build bespoke translation lookup logic
   - Rejected: Reinvents wheel, loses i18next features (language detection, fallback chains, pluralization)
2. **Flatten all translations into single namespace** - Merge UI and data translations
   - Rejected: Creates massive translation files, slower loading, poor organization
3. **Use i18next backend plugin** - Load translations dynamically from API
   - Rejected: Violates static-first principle, adds unnecessary complexity

**Implementation Details**:
- **Namespace**: `terpeneData` for all terpene content translations
- **Loading**: Preload German translation data on app init if user's language is German
- **Access pattern**: `i18next.t('terpeneData:terpenes.{{id}}.name', { id: terpeneId })`
- **Fallback**: Automatic fallback to English when translation key missing (i18next default behavior)
- **Configuration**:
  ```typescript
  i18next.init({
    // ... existing config
    ns: ['common', 'navigation', 'terpeneData'],  // Add new namespace
    defaultNS: 'common',
    resources: {
      de: {
        terpeneData: await import('/data/terpene-translations-de.json')
      }
    }
  });
  ```

### 3. Fallback Visual Indicator Implementation

**Decision**: Material UI Chip component + italic Typography styling

**Rationale**:
- Chip component provides built-in badge styling with minimal customization
- Small, subtle, and consistent with Material Design principles
- Accessible out-of-the-box (proper ARIA attributes, keyboard focusable if interactive)
- Italic text styling is semantic HTML (`<em>` tag) - screen readers announce emphasis
- Combination is visually distinct but not distracting

**Alternatives Considered**:
1. **Custom SVG icon badge** - Design custom language indicator icon
   - Rejected: Unnecessary complexity, harder to maintain, accessibility challenges
2. **Colored background highlight** - Use different background color for fallback content
   - Rejected: Color alone violates WCAG (must not be sole indicator), distracting
3. **Tooltip-only indicator** - Show language info only on hover
   - Rejected: Not perceivable without interaction, fails keyboard/mobile users

**Implementation Details**:
- **Component**: `LanguageBadge.tsx` - reusable component for fallback indicator
- **Usage**: Wrap fallback content in italic text, append language badge
  ```tsx
  <Typography component="em" sx={{ fontStyle: 'italic' }}>
    {englishFallbackText}
    <Chip label="EN" size="small" sx={{ ml: 0.5, height: '18px' }} />
  </Typography>
  ```
- **Accessibility**: 
  - Italic text provides visual cue
  - `<em>` semantic HTML announces emphasis to screen readers
  - Chip includes `aria-label="Content in English"` for explicit language indication
- **Styling**: Small Chip (18px height), subtle color (theme.palette.grey[400]), margin-left for spacing

### 4. Cross-Language Search Strategy

**Decision**: Index both English and German terms, rank all matches equally

**Rationale**:
- Simplest implementation - no language detection or complex ranking algorithms needed
- Meets user expectation: searching "Lemon" or "Zitrone" finds Limonene regardless of UI language
- Performance-friendly - single search pass through both language indexes
- Predictable behavior - no surprising result ordering based on language match

**Alternatives Considered**:
1. **Prefer matches in current UI language** - Rank German matches higher when UI is German
   - Rejected: Adds complexity, may hide relevant results, unclear benefit
2. **Language detection on search query** - Detect query language and search only that language
   - Rejected: Unreliable detection, breaks mixed-language queries, poor UX
3. **Separate search for each language with merge** - Search English, search German, merge results
   - Rejected: Slower (two passes), potential duplicate handling complexity

**Implementation Details**:
- **Search index structure**: Combine English and German terms in single searchable string per terpene
  ```typescript
  interface SearchIndex {
    id: string;
    searchText: string;  // "Limonene Limonen Citrus Zitrus Lemon Zitrone ..."
  }
  ```
- **Index building**: On data load, concatenate all English + German terms for each terpene
- **Search execution**: Single case-insensitive substring match against searchText
- **Diacritic handling**: Normalize characters (ä→a, ö→o, ü→u, ß→ss) for broader matching
- **Performance**: Pre-build index on app load, cache for duration of session

### 5. Translation File Loading and Error Handling

**Decision**: Async load with silent fallback to English-only mode

**Rationale**:
- Translation data is non-critical - app remains functional with English only
- Silent fallback prevents user-facing errors for infrastructure issues
- Developer-focused logging enables debugging without disrupting UX
- Async loading prevents blocking initial render

**Alternatives Considered**:
1. **Show error banner to users** - Display "German translations unavailable" message
   - Rejected: Unnecessary noise, degrades UX for non-critical feature
2. **Retry loading with exponential backoff** - Attempt multiple loads before giving up
   - Rejected: Over-engineering for static files, delays app startup
3. **Block app loading until translations available** - Wait for translation file or fail hard
   - Rejected: Violates progressive enhancement, makes translation failure catastrophic

**Implementation Details**:
- **Loading**: Use dynamic import with try/catch
  ```typescript
  try {
    const translations = await import('/data/terpene-translations-de.json');
    i18next.addResourceBundle('de', 'terpeneData', translations);
  } catch (error) {
    console.error('[Translation] Failed to load German translation data:', error);
    // Continue with English-only mode
  }
  ```
- **Error scenarios**: File not found, malformed JSON, network failure (CDN issue)
- **Logging**: Console error with context for developer debugging
- **User experience**: Seamless - all content displays in English without interruption
- **Validation**: Optional Zod schema validation on load to catch malformed translation files early

### 6. Performance Optimization for Translation Lookup

**Decision**: In-memory Map-based cache with O(1) lookup

**Rationale**:
- Translation lookup is frequent operation (every terpene render, search, filter)
- Map provides O(1) lookup by terpene ID
- Entire translation dataset fits easily in memory (~30KB gzipped, <1MB uncompressed)
- No need for lazy loading or chunking given small dataset size

**Alternatives Considered**:
1. **Lazy load translations per terpene** - Fetch individual translations on demand
   - Rejected: Massive overhead (60+ HTTP requests), latency, complexity
2. **IndexedDB storage** - Persist translations in browser database
   - Rejected: Over-engineering, adds async complexity, no offline requirement
3. **LRU cache with eviction** - Limit cache size and evict old entries
   - Rejected: Premature optimization, full dataset is tiny

**Implementation Details**:
- **Cache structure**:
  ```typescript
  class TranslationCache {
    private cache: Map<string, TerpeneTranslation> = new Map();
    
    load(translations: Record<string, TerpeneTranslation>) {
      Object.entries(translations).forEach(([id, trans]) => {
        this.cache.set(id, trans);
      });
    }
    
    get(id: string, field: keyof TerpeneTranslation): string | string[] | undefined {
      return this.cache.get(id)?.[field];
    }
  }
  ```
- **Initialization**: Build cache once on app load after translations loaded
- **Invalidation**: No cache invalidation needed (static data, page reload required for updates)
- **Memory footprint**: ~60 terpenes × ~1KB per translation = ~60KB total memory

## Summary of Key Decisions

| Aspect | Decision | Key Benefit |
|--------|----------|-------------|
| Data Structure | Separate translation file with ID references | Minimizes redundancy, enables incremental translation |
| i18next Integration | Dedicated `terpeneData` namespace | Leverages existing infrastructure, clean separation |
| Fallback Indicator | Material UI Chip + italic text | Accessible, subtle, consistent with design system |
| Cross-Language Search | Single index with equal ranking | Simple, predictable, performance-friendly |
| Error Handling | Silent fallback to English-only | Non-disruptive, developer-friendly debugging |
| Performance | In-memory Map cache | O(1) lookup, tiny memory footprint |

## Technical Dependencies

**New Dependencies**: None - all requirements met by existing packages

**Existing Dependencies Leveraged**:
- `i18next` (25.6.0) - Translation infrastructure
- `react-i18next` (15.2.0) - React bindings for i18next
- `@mui/material` (6.3.0) - Chip component for language badge
- `zod` (3.24.1) - Optional translation file validation

## Next Steps

With research complete, proceed to Phase 1:
1. Create `data-model.md` - Define TypeScript interfaces for translation data structures
2. Create `contracts/translation-service.ts` - Service interface contracts
3. Create `quickstart.md` - Developer guide for adding new translations
4. Update agent context files with bilingual data support patterns
