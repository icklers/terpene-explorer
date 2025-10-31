# Research: Table Filter Bar Extension with Bilingual Support

## Overview
This research document addresses the technical approach for extending the terpene filter functionality to include multi-attribute filtering and bilingual support.

## Key Technical Decisions

### 1. Filter Service Extension
**Decision**: Extend the existing `matchesSearchQuery()` function in `filterService.ts` to handle additional attributes
**Rationale**: This follows the KISS principle by extending existing functionality rather than creating a new service
**Implementation**: Will check search term against name, effects array, aroma string, taste string, and therapeuticProperties array

### 2. Bilingual Search Implementation
**Decision**: Integrate with the existing translation service to match search terms across languages
**Rationale**: Leverages the existing i18next infrastructure and translation service that was already implemented
**Implementation**: When German language is active, search both English and German terpene data; utilize translation service to match English search terms against German attributes and vice versa

### 3. Special Character Handling
**Decision**: Implement proper Unicode normalization for international characters including German umlauts
**Rationale**: Critical for proper matching of German characters (ä, ö, ü) and other diacritics
**Implementation**: Will normalize both search terms and data values using locale-aware comparison methods

### 4. Performance Considerations
**Decision**: Optimize bilingual search to meet 50ms translation service requirement
**Rationale**: Maintains overall performance budget of <100ms for filter operations
**Implementation**: Will implement caching for translation lookups and ensure efficient search algorithms

### 5. State Management for Language Switching
**Decision**: Persist active filter when switching languages and reapply it to the new language data
**Rationale**: Provides better user experience when switching between languages
**Implementation**: Will store the filter state separately from language state and reapply after language change

## Alternatives Considered

### Alternative 1: Separate Filter Services
- **Approach**: Create separate services for English and German filtering
- **Rejected**: Would violate DRY principle and create unnecessary code duplication

### Alternative 2: Pre-translation of Search Terms
- **Approach**: Pre-translate search terms before applying them to the data
- **Rejected**: Would not work for partial matching and would require complex caching strategies

### Alternative 3: Separate Data Sets
- **Approach**: Maintain fully separate data sets with all translations pre-matched
- **Rejected**: Would increase memory usage and complexity without significant performance gains

## Technology Integration Points

### i18next Integration
- Use i18next for language detection and switching
- Extract filter bar placeholder text from translation files
- Ensure proper text direction and formatting for both languages

### Material UI Components
- Use TextField for the search input with appropriate props (maxLength, etc.)
- Maintain accessibility attributes across both languages
- Preserve existing styling and theming

### Testing Framework
- Vitest for unit tests of search logic
- Playwright for E2E tests across both languages
- Jest-axe for accessibility validation in both languages