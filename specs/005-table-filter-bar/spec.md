# Feature Specification: Table Filter Bar Extension with Bilingual Support

**Feature Branch**: `005-table-filter-bar`  
**Created**: 2025-10-28  
**Status**: Draft  
**Input**: User description: "extend the current filter feature. the user shall be able to filter the table for effects, taste, therapeutic properties and aroma, when using the search bar. the search bar shall show in the filter area, instead of the header and be described properly as \"Filter\" bar: \"Filter terpenes by name, effect, aroma...\". Update the specification according to the recent findings in `@.idea/main_merge_implications_analysis.md`. Don't change any functionality, just adapt the original specification **only if required**."

**Context**: This feature extends the existing filter functionality that currently supports filtering by terpene name only. The extension adds filtering by effects, taste, therapeutic properties, and aroma, while also improving the filter bar's location and labeling. The implementation must be compatible with the recently introduced bilingual data support feature allowing users to switch between English and German terpene data.

## Clarifications

### Session 2025-10-28

- Q: Should there be a minimum number of characters required before the filter activates? → A: 2 characters minimum
- Q: What specific debounce delay should be used for real-time filtering as the user types? → A: 300ms
- Q: When no terpenes match the filter criteria, what specific message should be displayed? → A: No match found for your filter
- Q: Should there be a maximum length for the filter text input? → A: 100 characters maximum
- Q: When multiple terpenes match the filter criteria, how should the results be ordered in the table? → A: Maintain original table order

### Session 2025-10-31

- Q: Should the system log filter operations for observability and debugging? → A: System must log all filter operations including query terms, results count, and performance metrics
- Q: What performance requirements apply to translation service lookups? → A: Translation service lookups must complete within 50ms to maintain overall performance targets
- Q: How should the system handle translation service failures? → A: System must gracefully degrade by performing English-only search when translation service fails
- Q: What should happen to active filters when user switches languages? → A: Active filter should persist and be reapplied when user switches languages
- Q: Should the system support special characters in search queries for both languages? → A: System must support special characters in both English and German including umlauts, accents, and other diacritics

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Maintain Existing Name Filtering (Priority: P1)

A user views the pre-rendered terpene table with the existing filter functionality. The current
ability to filter by terpene name continues to work exactly as before, serving as the foundation for
the extended filtering capabilities.

**Why this priority**: Name filtering is the existing core functionality that must be preserved.
This ensures backward compatibility and that existing users experience no disruption.

**Independent Test**: Can be fully tested by loading the page and typing a terpene name (e.g.,
"Linalool") in the filter bar, verifying only matching rows remain visible, exactly as the current
implementation works.

**Acceptance Scenarios**:

1. **Given** the page loads with the existing filter feature, **When** user types "linalool" in the
   filter bar, **Then** only rows containing "linalool" in the name remain visible (existing
   behavior preserved)
2. **Given** the filter bar is empty, **When** user types partial name "lina", **Then** table
   updates showing all terpenes matching "lina" (existing behavior preserved)
3. **Given** user has filtered the table, **When** user clears the filter bar, **Then** all
   terpenes are displayed again (existing behavior preserved)
4. **Given** existing name filtering works, **When** new attributes are added, **Then** name
   filtering continues to function identically

---

### User Story 2 - Extend Filtering to Include Effects (Priority: P1)

A user wants to find terpenes that produce specific effects, extending beyond the current name-only
filtering. They type an effect name (e.g., "relaxing", "energizing", or their German equivalents "entspannend", "energisierend") into the existing filter bar,
and the table dynamically shows terpenes that have that effect in their effects list, regardless of the selected language.

**Why this priority**: Effects are a primary decision criteria for users selecting terpenes. This
story verifies that existing effects filtering continues to work correctly and is extended to support bilingual data.

**Independent Test**: Can be fully tested by typing an effect (e.g., "calming" or "beruhigend") in the filter bar
and verifying that table rows with terpenes containing that effect remain visible in both English and German views. Verifies existing
capability is preserved and enhanced with bilingual support.

**Acceptance Scenarios**:

1. **Given** the existing filter bar with English language selected, **When** user types "relaxing", **Then** rows with terpenes
   having "relaxing" effect are visible (new capability)
2. **Given** user types partial effect "energ" with English selected, **When** filtering occurs, **Then** terpenes with
   "energizing" effect remain visible (new capability)
3. **Given** the filter bar with German language selected, **When** user types "entspannend", **Then** rows with terpenes
   having "entspannend" effect (the German translation) are visible (new capability)
4. **Given** user types partial effect "energ" with German selected, **When** filtering occurs, **Then** terpenes with
   "energisierend" effect remain visible (new capability)
5. **Given** multiple terpenes match the effect, **When** displayed, **Then** all matching terpenes
   are shown in the table
6. **Given** user searches for text that matches both name and effect, **When** filtering occurs,
   **Then** all matches from both attributes are shown
7. **Given** user searches for an English effect term with German language selected, **When** filtering occurs using the translation service, **Then** terpenes with the matching German translation of the effect are shown (bilingual capability)

---

### User Story 3 - Extend Filtering to Include Aroma (Priority: P2)

A user wants to find terpenes based on aroma characteristics (e.g., "citrus", "pine", "floral", or their German equivalents "Zitrus", "Kiefer", "blumig"),
extending the filter capabilities beyond name and effects. They type the aroma descriptor into the
filter bar, and the table shows terpenes with matching aroma profiles, regardless of the selected language.

**Why this priority**: Aroma is a key sensory characteristic. Secondary priority as this story
primarily verifies existing aroma search functionality is maintained and enhanced with bilingual support.

**Independent Test**: Can be fully tested by typing an aroma (e.g., "citrus" or "Zitrus") in the filter bar and
verifying rows with matching aroma profiles remain visible in both English and German views. Verifies existing capability.

**Acceptance Scenarios**:

1. **Given** the extended filter bar with English language selected, **When** user types "citrus", **Then** rows with citrus aroma
   terpenes are visible (new capability)
2. **Given** user types partial aroma "flor" with English selected, **When** filtering, **Then** terpenes with "floral"
   aroma remain visible (new capability)
3. **Given** the extended filter bar with German language selected, **When** user types "Zitrus", **Then** rows with Zitrus aroma
   terpenes are visible (new capability)
4. **Given** user types partial aroma "blüm" with German selected, **When** filtering, **Then** terpenes with "blumig"
   aroma remain visible (new capability)
5. **Given** a terpene has multiple aromas including searched term, **When** displayed, **Then**
   that terpene row is visible
6. **Given** user searches for text matching name, effect, and aroma, **When** filtering, **Then**
   all matches from all attributes are shown
7. **Given** user searches for an English aroma term with German language selected, **When** filtering occurs using the translation service, **Then** terpenes with the matching German translation of the aroma are shown (bilingual capability)

---

### User Story 4 - Extend Filtering to Include Taste (Priority: P2)

A user wants to find terpenes based on taste profiles (e.g., "sweet", "bitter", "spicy" or their German equivalents "süß", "bitter", "scharf"), further
extending the multi-attribute filtering. They type the taste descriptor into the filter bar, and the
table shows terpenes with matching taste profiles, regardless of the selected language.

**Why this priority**: Taste is an important sensory characteristic alongside aroma. Equal priority
to aroma as both are key sensory selection criteria.

**Independent Test**: Can be fully tested by typing a taste (e.g., "sweet" or "süß") in the filter bar and
verifying rows with matching taste profiles remain visible in both English and German views. Delivers value for users who recognize
terpenes by flavor.

**Acceptance Scenarios**:

1. **Given** the extended filter bar with English language selected, **When** user types "sweet", **Then** rows with sweet taste
   terpenes are visible (new capability)
2. **Given** user types partial taste "bit" with English selected, **When** filtering, **Then** terpenes with "bitter"
   taste remain visible (new capability)
3. **Given** the extended filter bar with German language selected, **When** user types "süß", **Then** rows with süß taste
   terpenes are visible (new capability)
4. **Given** user types partial taste "bitt" with German selected, **When** filtering, **Then** terpenes with "bitter"
   taste remain visible (new capability)
5. **Given** a terpene has multiple taste profiles including searched term, **When** displayed, **Then**
   that terpene row is visible
6. **Given** user searches for text matching multiple attributes, **When** filtering, **Then** all
   matches across name, effect, aroma, and taste are shown
7. **Given** user searches for an English taste term with German language selected, **When** filtering occurs using the translation service, **Then** terpenes with the matching German translation of the taste are shown (bilingual capability)

---

### User Story 5 - Extend Filtering to Include Therapeutic Properties (Priority: P2)

A user wants to find terpenes based on therapeutic benefits (e.g., "anti-inflammatory",
"analgesic", or their German equivalents "entzündungshemmend", "schmerzlindernd"), completing the multi-attribute filter extension. They type the therapeutic property
into the filter bar, and the table shows terpenes with matching therapeutic properties, regardless of the selected language.

**Why this priority**: Therapeutic properties are important for users seeking specific health
benefits. Secondary priority as users typically filter by name/effect first, then refine by
therapeutic needs.

**Independent Test**: Can be fully tested by typing a therapeutic property (e.g.,
"anti-inflammatory" or "entzündungshemmend") in the filter bar and verifying rows with matching properties remain visible in both English and German views.
Delivers value for users with wellness goals.

**Acceptance Scenarios**:

1. **Given** the extended filter bar with English language selected, **When** user types "anti-inflammatory", **Then** rows with
   anti-inflammatory properties are visible (new capability)
2. **Given** user types "pain" with English selected, **When** filtering, **Then** terpenes with analgesic or pain-relief
   properties remain visible (new capability)
3. **Given** the extended filter bar with German language selected, **When** user types "entzündungshemmend", **Then** rows with
   entzündungshemmend properties are visible (new capability)
4. **Given** user types medical terminology with German selected, **When** filtering, **Then** terpenes with matching
   properties using scientific or common names in German are shown
5. **Given** user types "Schmerzen" with German selected, **When** filtering, **Then** terpenes with schmerzlindernde or similar
   pain-relief properties remain visible (new capability)
6. **Given** user searches for text matching any attribute, **When** filtering, **Then** all
   matches across name, effect, aroma, taste, and therapeutic properties are shown
7. **Given** user searches for an English therapeutic term with German language selected, **When** filtering occurs using the translation service, **Then** terpenes with the matching German translation of the therapeutic property are shown (bilingual capability)

---

### User Story 6 - Improve Filter Bar Location and Label (Priority: P1)

A user opens the page and immediately understands where and how to filter the table. As part of this
extension, the filter bar is relocated to the filter area (if not already there), has a clear label
"Filter" or "Filter Bar", and includes updated descriptive placeholder text like "Filter terpenes by
name, effect, aroma, taste..." in English or "Terpene nach Name, Wirkung, Aroma, Geschmack filtern..." in German to reflect all new filtering capabilities and support the bilingual UI.

**Why this priority**: Clear UI labeling and placement is critical for discoverability and
usability. Users must understand the extended filtering capabilities immediately in their selected language. P1 priority as it
affects all other filtering user stories.

**Independent Test**: Can be fully tested by loading the page and visually confirming: (1) filter
bar is in the filter area, not header; (2) label clearly indicates "Filter" functionality; (3)
placeholder text is properly translated and mentions all filterable attributes. Delivers value through improved user
comprehension.
bar is in the filter area, not header; (2) label clearly indicates "Filter" functionality; (3)
placeholder text guides user on what can be filtered in the selected language. Delivers value through improved user
comprehension.

**Acceptance Scenarios**:

1. **Given** user opens the page, **When** viewing the filter area, **Then** filter bar is visible
   in the filter area (not in the header)
2. **Given** user sees the filter bar with English selected, **When** reading the label, **Then** it clearly says
   "Filter" or "Filter Bar"
3. **Given** user sees the filter bar with German selected, **When** reading the label, **Then** it clearly says
   "Filter" or "Filter" in German
4. **Given** filter bar is empty with English selected, **When** user views it, **Then** placeholder text reads "Filter
   terpenes by name, effect, aroma..." or similar descriptive text
5. **Given** filter bar is empty with German selected, **When** user views it, **Then** placeholder text reads "Terpene nach Name, Wirkung, Aroma..."
   or similar descriptive text in German
6. **Given** user focuses on filter bar with English selected, **When** placeholder text is shown, **Then** it indicates
   all filterable attributes (name, effect, aroma, taste, therapeutic properties)
7. **Given** user focuses on filter bar with German selected, **When** placeholder text is shown, **Then** it indicates
   all filterable attributes in German (Name, Wirkung, Aroma, Geschmack, therapeutische Eigenschaften)
8. **Given** user switches language from English to German, **When** viewing the filter bar, **Then** the placeholder text updates to German
9. **Given** user switches language from German to English, **When** viewing the filter bar, **Then** the placeholder text updates to English

---

### Edge Cases

**Resolved Edge Case Handling:**

- **Multiple attribute matches**: When filter term matches multiple attributes simultaneously (e.g.,
  "citrus" matches both name and aroma), system returns rows matching ANY attribute using OR logic
  (FR-006). All matching rows are displayed without duplicate handling needed.
- **Interaction with category filters**: Filtering works in conjunction with existing category
  filters (therapeutic, sensory, cognitive). Filter bar applies AND logic with category filters -
  results must match both filter text AND selected categories (FR-019).
- **Special characters and non-English characters**: System handles special characters (e.g., "á",
  "ñ", "-", "/") in filter text through existing sanitization. All text matching is
  case-insensitive and uses lowercase normalization (FR-015). No XSS vulnerability due to
  client-side filtering without server round-trip.
- **Performance with large datasets**: System maintains performance (<100ms filter operation) for up
  to 500 terpenes through efficient string matching and debounced input (300ms). For datasets
  exceeding 500 terpenes, consider implementing virtualization in TerpeneTable component (FR-020a,
  SC-006).

## Requirements _(mandatory)_

### Functional Requirements

**Existing Functionality to Preserve:**

- **FR-001**: System MUST maintain existing terpene name filtering capability without any
  regression or changes to current behavior

**New Filtering Extensions:**

- **FR-002**: System MUST maintain filtering across effect names (existing capability to be preserved
  and verified)
- **FR-003**: System MUST maintain filtering across aroma descriptors (existing capability to be
  preserved and verified)
- **FR-004**: System MUST extend filtering to search across taste profiles in addition to existing
  attributes (NEW capability)
- **FR-005**: System MUST extend filtering to search across therapeutic properties in addition to
  existing attributes (NEW capability)
- **FR-006**: System MUST match rows when filter text matches ANY of the searchable attributes
  (name, effect, aroma, taste, therapeutic property)
- **FR-024**: System MUST support bilingual filtering by searching both English and German terpene data
  when the user has selected German language
- **FR-025**: System MUST utilize the translation service to match English search terms against German
  terpene attributes when German language is selected
- **FR-026**: System MUST match German search terms against both English and German terpene attributes when
  German language is selected

**UI/UX Improvements:**

- **FR-007**: System MUST display filter bar in the filter area (relocate if currently in header)
- **FR-008**: Filter bar MUST have a visible label reading "Filter" or "Filter Bar"
- **FR-009**: Filter bar MUST update placeholder text to: "Filter terpenes by name, effect, aroma,
  taste..." in English or "Terpene nach Name, Wirkung, Aroma, Geschmack filtern..." in German
  or similar text indicating all filterable attributes in the selected language
- **FR-027**: System MUST internationalize all filter bar UI elements to support both English and German languages
- **FR-028**: System MUST update filter bar placeholder text dynamically when user switches languages

**Existing Behavior to Maintain:**

- **FR-010**: System MUST render the complete terpene table on initial page load before any
  filtering (existing behavior)
- **FR-011**: System MUST filter table rows in real-time as user types in the filter bar (existing
  behavior)
- **FR-012**: System MUST hide table rows that do not match the filter criteria (existing behavior)
- **FR-013**: System MUST show table rows that match the filter criteria (existing behavior)
- **FR-014**: System MUST support partial matching (e.g., "anti" matches "anti-inflammatory")
  (existing behavior)
- **FR-015**: System MUST be case-insensitive (e.g., "CITRUS" matches "citrus") (existing behavior)
- **FR-016**: System MUST display all terpenes when filter bar is empty (existing behavior)
- **FR-017**: System MUST show empty state with message "No match found for your filter" when no
  rows match filter criteria
- **FR-018**: System MUST allow users to clear the filter bar to restore full table view (existing
  behavior)
- **FR-019**: Filter bar MUST work in conjunction with existing category filters (if any are active)
  (existing behavior)
- **FR-020**: System MUST debounce filtering operations with a 300ms delay to optimize performance
  during real-time filtering (UX debounce does not count toward filter operation time)
- **FR-020a**: Filter operation itself (after debounce) MUST complete in <100ms for up to 500
  terpenes to meet constitution performance requirements (<200ms filter budget)
- **FR-021**: System MUST require a minimum of 2 characters before activating filter (display all
  results if less than 2 characters entered)
- **FR-022**: System MUST limit filter text input to a maximum of 100 characters
- **FR-023**: System MUST maintain the original table order when displaying filtered results (no
  re-sorting based on match quality or attribute type)
- **FR-029**: System MUST log all filter operations including query terms, results count, and performance metrics for observability
- **FR-030**: Translation service lookups MUST complete within 50ms to maintain overall performance targets
- **FR-031**: System MUST gracefully degrade by performing English-only search when translation service fails
- **FR-032**: System MUST persist active filters and reapply them when user switches languages
- **FR-033**: System MUST support special characters in both English and German including umlauts, accents, and other diacritics

### Key Entities

- **Filter Bar (SearchBar Component)**: The input field in the filter area where users type filter
  criteria. Implemented as the `SearchBar` component. Includes label, placeholder text, and current
  filter value. Note: "filter bar" is the user-facing term; "SearchBar" is the technical component
  name.
- **Filter Criteria**: The text entered by user, parsed and normalized for matching against table
  data
- **Table Row**: A row in the terpene table that can be shown or hidden based on filter criteria
- **Filterable Attributes**: The specific data fields searchable via filter bar - terpene name,
  effects array, aroma descriptors, taste profiles, therapeutic properties array (camelCase:
  `therapeuticProperties`)
- **Empty State**: Visual feedback shown when no table rows match the filter criteria
- **Translation Service**: The service (e.g., effectTranslationService) that provides term translation
  between English and German for cross-language matching
- **Bilingual Data Model**: The data structure containing both English and German terpene information
  supporting multi-language search functionality

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can locate the filter bar within 3 seconds of page load
- **SC-002**: Users understand filtering capability from placeholder text within 5 seconds in both English and German
- **SC-003**: Table filtering updates with less than 400ms total perceived latency (300ms debounce
  + <100ms filter operation) for datasets up to 100 terpenes in both languages
- **SC-004**: 95% of filter queries return at least one result when filtering for documented
  attributes in both English and German
- **SC-005**: Users can successfully filter by name, effect, aroma, taste, or therapeutic property
  on first attempt in both English and German
- **SC-006**: Filter bar remains performant (filter operation responsive within 100ms, total
  perceived latency <400ms including 300ms debounce) with up to 200 table rows in both languages
- **SC-007**: Zero crashes or errors when handling edge cases (empty filter, special characters,
  very long filter text) in both English and German
- **SC-008**: Users can successfully perform cross-language searches (English terms in German mode and vice versa)
  with 90% accuracy in finding relevant terpenes
- **SC-009**: Language switch from English to German or vice versa updates the filter bar UI and
  functionality within 2 seconds

## Assumptions

- **An existing filter feature already supports filtering by terpene name** - this feature extends
  that capability
- The terpene table is already implemented and contains columns for name, effects, aroma, taste, and
  therapeutic properties
- The existing data model provides terpene data in a structure that supports filtering by all
  specified attributes
- A filter area already exists in the UI (or can be added) separate from the page header
- The table uses client-side rendering for all rows (filtering happens in browser, not via API
  calls)
- There may be existing category filters that work alongside the filter bar
- Real-time filtering with debouncing is already implemented for name filtering
- Users understand common terminology for effects, aromas, tastes, and therapeutic properties
- The existing filter implementation can be extended to search additional attributes without
  requiring a complete rewrite
- The bilingual data support infrastructure (i18next, translation services, etc.) is already implemented
  and available for integration
- The system performance will remain within acceptable limits despite additional translation lookups
  required for bilingual search functionality
- Users understand common terminology for effects, aromas, tastes, and therapeutic properties in both English and German
