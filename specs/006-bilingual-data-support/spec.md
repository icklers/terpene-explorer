# Feature Specification: Bilingual Terpene Data Support

**Feature Branch**: `006-bilingual-data-support`  
**Created**: 2025-10-28  
**Status**: Draft  
**Input**: User description: "Add full bilingual data support to the Interactive Terpene Map. Currently, only UI elements (buttons, labels, table headers) are translated between English and German, while the terpene data itself (names, descriptions, aromas, sources) remains in English only. The goal is to make scientific terpene information accessible to German-speaking users in their native language, enhancing the educational value of the application. Minimize data redundancy."

## Clarifications

### Session 2025-10-28

- Q: How should German translations be organized relative to the base English terpene data? → A: Separate translation file with ID references - Base data in one file, German translations in a separate file referencing terpene IDs
- Q: What specific visual indicator should be used when displaying English fallback content in German language mode? → A: Italic text with a small language badge (e.g., "EN")
- Q: How should translation completeness be calculated and displayed to users? → A: Not displayed to users - irrelevant information
- Q: What should happen if the German translation file cannot be loaded or is malformed? → A: Log error and continue silently - Log the error for developers, display all content in English without user notification
- Q: How should search ranking work when users enter mixed English/German terms or when results match in different languages? → A: Treat all matches equally regardless of language

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Core Terpene Information in Native Language (Priority: P1)

A German-speaking user visits the Interactive Terpene Map and switches to German language. They browse terpene information (names, descriptions, aromas, therapeutic properties, and sources) which are now displayed in German. The user can read and understand all scientific terpene information in their native language, making the educational content accessible without language barriers.

**Why this priority**: This is the core value proposition of the feature - providing accessible scientific information to German-speaking users. Without this, the feature delivers no user value.

**Independent Test**: Switch language to German and verify that all terpene names, descriptions, aromas, effects, therapeutic properties, and sources display in German. Compare with English version to ensure content equivalence.

**Acceptance Scenarios**:

1. **Given** a user has selected German language, **When** viewing the terpene table or sunburst chart, **Then** all terpene names display in German (e.g., "Limonen" instead of "Limonene")
2. **Given** a user has selected German language, **When** opening terpene detail information, **Then** descriptions, aromas, effects, therapeutic properties, and sources are shown in German
3. **Given** a user switches from English to German, **When** viewing the same terpene, **Then** all content updates to German without page reload
4. **Given** a user has selected German language, **When** searching for a terpene, **Then** search matches both English and German terms (e.g., searching "Zitrone" finds Limonene)

---

### User Story 2 - Fallback to English for Missing Translations (Priority: P2)

When viewing terpene data in German, if certain content lacks a German translation, the user sees the English version as a fallback with a visual indicator. This ensures no information is hidden from users while maintaining transparency about translation completeness.

**Why this priority**: This provides a safety net for incomplete translations and supports iterative translation workflows. Users still get value even if translations are partial.

**Independent Test**: Add a new terpene entry with only English content, switch to German, and verify English content displays with a fallback indicator.

**Acceptance Scenarios**:

1. **Given** a terpene entry lacks German translation for description, **When** viewing in German language, **Then** the English description displays in italic text with a small "EN" language badge
2. **Given** a terpene has partial German translations (name but no description), **When** viewing in German, **Then** translated fields show in German and untranslated fields show in English with italic text and "EN" badge

---

### User Story 3 - Language-Aware Filtering and Search (Priority: P2)

Users can filter and search terpenes using terms in their selected language. Search matches recognize both German and English terms, allowing users to find terpenes naturally in their language (e.g., searching "beruhigend" for "sedative" effect or "Kiefer" for "Pine" source).

**Why this priority**: Search and filtering are critical navigation features. Supporting native language terms improves user experience and discoverability.

**Independent Test**: Switch to German, search for German terms (e.g., "Zitrus", "beruhigend"), and verify results match correctly.

**Acceptance Scenarios**:

1. **Given** a user has selected German language, **When** searching for "Zitrus", **Then** all terpenes with citrus-related aromas appear in results
2. **Given** a user filters by effect "Beruhigend" in German, **When** viewing results, **Then** only terpenes with sedative effects are shown
3. **Given** a user searches using English terms while German is selected, **When** searching "Lemon", **Then** results include relevant terpenes (cross-language search support)
4. **Given** a user types partial German words, **When** searching, **Then** autocomplete suggestions appear in German

---

### User Story 4 - Maintain Data Structure Efficiency (Priority: P3)

The data structure for bilingual support minimizes redundancy while supporting efficient lookup in both languages. Developers can easily add new terpenes or translations without duplicating entire data structures.

**Why this priority**: This is a technical quality requirement that supports maintainability and future scalability. It doesn't directly deliver user value but ensures long-term sustainability.

**Independent Test**: Review data structure, verify that common data (molecular formulas, boiling points, IDs) exists once, and translations are separated. Add a test terpene entry to validate the workflow.

**Acceptance Scenarios**:

1. **Given** a developer adds a new terpene entry, **When** providing content, **Then** language-independent data (ID, molecular formula, boiling point, concentration ranges) is defined once
2. **Given** a developer adds German translations, **When** updating the data file, **Then** only translated text fields (name, description, aroma, effects, sources) are duplicated
3. **Given** the system loads terpene data, **When** merging base and translated content, **Then** lookup performance remains under 50ms for the entire dataset
4. **Given** translation data is missing for a field, **When** accessing that field, **Then** the system gracefully falls back to English without errors

---

### Edge Cases

- **Partial translations**: What happens when only some fields (e.g., name and aroma) have German translations but description is missing?
  - System displays translated fields in German and falls back to English for untranslated fields, showing English text in italic with "EN" badge
  
- **Mixed-language search**: How does search behave when user enters search terms mixing German and English words?
  - Search matches terms in both languages simultaneously, returning all relevant results with equal ranking regardless of match language
  
- **Special characters**: How are German-specific characters (ä, ö, ü, ß) handled in search and filtering?
  - Search is case-insensitive and diacritic-insensitive (searching "Zitrus" matches "Zitrus", searching "Musky" matches "Müsky")
  
- **Array field translations**: How are comma-separated lists (effects, sources, aromas) translated?
  - Each array element is translated individually while preserving array structure
  
- **Compound terms**: How are multi-word terms like "Muscle relaxant" or "Pine needles" translated?
  - Treated as atomic units - translated as complete phrases, not word-by-word
  
- **Dynamic content**: What happens when new terpenes are added without German translations?
  - New terpenes display in English with italic text and "EN" badge until translations are added
  
- **Language switching mid-session**: Does changing language preserve user's current view (filters, search, selected terpene)?
  - Yes, language change preserves application state including filters, search queries, and selected terpene

- **Translation file errors**: What happens if the German translation file is corrupted, malformed, or fails to load?
  - System logs the error for developers and continues operating in English-only mode without notifying users

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST support displaying all translatable terpene fields (names, descriptions, aromas, taste, effects, therapeutic properties, sources, notable differences) in both English and German based on user's selected language
- **FR-002**: System MUST fall back to English content when German translation is unavailable for any field
- **FR-003**: System MUST display fallback English content in italic text with a small "EN" language badge when in German language mode
- **FR-004**: System MUST enable search functionality to match terpenes using German terminology
- **FR-005**: System MUST enable search functionality to match terpenes using English terminology regardless of selected language
- **FR-006**: System MUST rank all search results equally regardless of whether the match occurred in English or German content
- **FR-007**: System MUST enable filtering by effects using German effect names
- **FR-008**: System MUST enable filtering by effects using English effect names regardless of selected language
- **FR-009**: System MUST preserve language-independent data (IDs, molecular formulas, molecular weights, boiling points, concentration ranges) in single instances
- **FR-010**: System MUST support case-insensitive and diacritic-insensitive search for both languages
- **FR-011**: System MUST maintain application state (filters, search, selected terpene) when user switches language
- **FR-012**: System MUST validate data structure integrity at load time, ensuring translations reference valid base entries
- **FR-013**: System MUST load and parse bilingual data within 500ms for initial page load
- **FR-014**: System MUST support incremental addition of German translations without requiring all fields to be translated simultaneously
- **FR-015**: System MUST log errors when translation file is corrupted or fails to load, and continue operating in English-only mode without user notification

### Key Entities _(include if feature involves data)_

- **TerpeneBaseData**: Language-independent core data including ID (UUID), molecular formula, molecular weight, boiling point, chemical class, concentration ranges, isomer information, category, and research tier metadata. This data exists once per terpene in the base data file. English content (names, descriptions, aromas, effects, therapeutic properties, sources, taste, notable differences) is stored as the default language in this file.

- **TerpeneTranslation**: Language-specific content for a given terpene in a separate translation file. Each translation entry references a terpene by ID and provides German translations for: name, description, aroma descriptors, taste description, effects list, therapeutic properties list, sources list, and notable differences. Translation entries use language code "de" and can be partial (missing fields fall back to English).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: German-speaking users can read all terpene information (names, descriptions, aromas, effects, therapeutic properties, sources) in German language
- **SC-002**: Users can search for terpenes using German terminology (e.g., "Zitrus", "beruhigend") and receive relevant results within 100ms
- **SC-003**: Users can filter terpenes by effects using German effect names with results appearing immediately
- **SC-004**: Application state (selected terpene, active filters, search query) is preserved when switching between English and German languages
- **SC-005**: Initial data load time for bilingual dataset remains under 500ms on standard broadband connection
- **SC-006**: Data file size increase remains under 50% compared to English-only dataset (achieving efficient storage with minimal redundancy)
- **SC-007**: When German translations are incomplete, users see English fallback content in italic text with "EN" badge for 100% of untranslated fields (both missing fields and empty string values trigger fallback)
- **SC-008**: Search functionality correctly matches both German and English terms simultaneously in cross-language search scenarios
- **SC-009**: Developers can add new terpene entries with partial translations (e.g., name only) without data validation errors

## Assumptions

- German scientific terminology for terpenes follows established German chemistry and botany conventions
- Terpene names use standardized German botanical nomenclature (e.g., "Limonen" for Limonene, "Myrcen" for Myrcene)
- Effect and therapeutic property translations align with German medical and pharmacological terminology
- Source plant names use common German plant names (e.g., "Zitrone" for Lemon, "Kiefer" for Pine)
- Translation quality is sufficient for educational purposes (professional translation or expert validation assumed)
- Data structure allows for future addition of more languages without architectural changes
- German character encoding (UTF-8) is supported throughout the application stack
- Users expect instant language switching without page reload
- Fallback to English is acceptable to users when German translation is unavailable
- Search behavior matches user mental model (both languages searchable regardless of UI language setting)

## Out of Scope

- Additional languages beyond English and German
- Automatic translation services or machine translation integration
- User-contributed translations or community translation features
- Translation management interfaces or admin panels
- Audio pronunciation guides for terpene names
- Regional language variants (e.g., Austrian German, Swiss German)
- Right-to-left language support architecture
- Dynamic language detection based on user location
- Export of bilingual data to external formats (PDF, CSV)
- Translation version control or change tracking
- Professional translator collaboration tools
