# Feature Specification: Enhanced Terpene Data Model with Detailed Info Display

**Feature Branch**: `002-terpene-data-model`
**Created**: 2025-10-25
**Status**: Draft
**Input**: User description: "The app will get a new data model for the terpenes. All information shall be retrieved from the new data source data/terpene-database.json, which also includes a schema. When clicking on a terpene in the table, it shall open an info badge with more detailed information in a meaningful order: effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, sources. In the table view, the sources column can be removed and the Search bar shall be on the header of the site"

## Clarifications

### Session 2025-10-25

- Q: How should the detail view handle rapid clicks on different terpene rows? → A: Update content in place (smooth transition, single modal instance)
- Q: What should the error message say when schema validation fails? → A: Data format error. Please open an issue on GitHub: `https://github.com/icklers/terpene-explorer/issues`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Detailed Terpene Information (Priority: P1)

Users exploring terpene data need to access comprehensive information about individual terpenes to understand their properties, effects, and therapeutic applications without leaving the table view.

**Why this priority**: This is the core value proposition of the feature - enabling users to access rich terpene data from the new data source. Without this, the new data model provides no user-facing benefit.

**Independent Test**: Can be fully tested by clicking any terpene row in the table and verifying that a detail panel/modal displays all required fields (effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, sources) in the specified order. Delivers immediate value by making comprehensive terpene data accessible.

**Acceptance Scenarios**:

1. **Given** a user is viewing the terpene table, **When** they click on any terpene row, **Then** a detail view opens displaying effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, and sources in that order
2. **Given** a user has opened a terpene detail view, **When** they review the information, **Then** all data fields are populated from the terpene-database.json file
3. **Given** a user is viewing terpene details, **When** they want to close the view, **Then** they can easily dismiss it and return to the table view
4. **Given** a terpene has empty or null values for optional fields, **When** the detail view is displayed, **Then** those fields are gracefully hidden or show a "not available" message

---

### User Story 2 - Streamlined Table View (Priority: P2)

Users browsing the terpene table need a cleaner, more focused view that eliminates redundant information and prioritizes the most relevant columns for quick scanning and comparison.

**Why this priority**: Removing the sources column simplifies the table interface and reduces visual clutter, making it easier for users to scan and compare terpenes. Sources are still accessible via the detail view, so no information is lost.

**Independent Test**: Can be fully tested by viewing the terpene table and confirming that the sources column is not present, while other essential columns (name, aroma, effects) remain visible. The table should feel less cluttered and easier to navigate.

**Acceptance Scenarios**:

1. **Given** a user views the terpene table, **When** they examine the column headers, **Then** they see Name, Aroma, and Effects columns but not a Sources column
2. **Given** a user wants to know the sources for a terpene, **When** they click on that terpene row, **Then** the sources information is available in the detailed view
3. **Given** the table has fewer columns, **When** users view the table on smaller screens, **Then** the layout is more responsive and easier to read

---

### User Story 3 - Header-Positioned Search (Priority: P3)

Users need quick access to search functionality from a prominent, consistent location to efficiently filter terpenes without scrolling or searching for the search bar.

**Why this priority**: Moving the search bar to the header improves discoverability and follows common UX patterns where search is prominently placed. However, this is primarily a UI/UX refinement rather than new functionality.

**Independent Test**: Can be fully tested by viewing the application and confirming that the search bar appears in the site header, remains visible while scrolling, and filters the terpene table as expected.

**Acceptance Scenarios**:

1. **Given** a user lands on any page with the terpene table, **When** they look at the header, **Then** they see the search bar prominently displayed
2. **Given** a user scrolls down the terpene table, **When** they want to search, **Then** the search bar remains accessible in the fixed header
3. **Given** a user enters a search term in the header search bar, **When** the search is executed, **Then** the terpene table filters accordingly
4. **Given** a user clears the search, **When** the search term is removed, **Then** the full terpene list is restored

---

### Edge Cases

- What happens when a terpene in the database has missing or incomplete data for required fields like effects or description?
- How does the system handle terpenes with very long descriptions or large arrays of effects that might not fit well in the detail view?
- If the terpene-database.json file is malformed, missing, or fails to load, system displays: "Data format error. Please open an issue on GitHub: `https://github.com/icklers/terpene-explorer/issues`"
- How does the detail view behave on mobile devices with limited screen space?
- When a user clicks rapidly on multiple terpene rows in succession, the detail view updates content in place without closing and reopening
- How are special characters, HTML, or potentially malicious content in the terpene data sanitized before display?
- What happens when the search bar is empty and a user tries to filter?
- How does the table handle sorting when the sources column is removed?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST load all terpene data exclusively from the `data/terpene-database.json` file
- **FR-002**: System MUST display terpene table with columns for Name, Aroma, and Effects (sources column removed)
- **FR-003**: Users MUST be able to click on any terpene row to view detailed information
- **FR-003a**: When user clicks a different terpene row while detail view is open, the view MUST update content in place without closing
- **FR-004**: Detail view MUST display the following fields in order: effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, sources
- **FR-005**: Detail view MUST populate all data from the corresponding terpene entry in terpene-database.json
- **FR-006**: Users MUST be able to close/dismiss the detail view to return to the table
- **FR-007**: System MUST position the search bar in the site header
- **FR-008**: Search bar MUST filter terpenes based on name, aroma, effects, and other searchable fields
- **FR-009**: System MUST handle missing or null data fields gracefully without breaking the UI
- **FR-010**: System MUST sanitize all data loaded from terpene-database.json before rendering to prevent XSS attacks
- **FR-011**: Detail view MUST display all array fields (effects, therapeuticProperties, sources) as formatted lists
- **FR-012**: System MUST preserve existing sorting and filtering functionality after removing the sources column
- **FR-013**: System MUST display boiling point values with appropriate units (Celsius)
- **FR-014**: System MUST validate the terpene-database.json schema on load and show error message if invalid: "Data format error. Please open an issue on GitHub: `https://github.com/icklers/terpene-explorer/issues`"

### Key Entities _(include if feature involves data)_

- **Terpene**: Represents a single terpene compound with comprehensive data including:
  - Identification: id, name, isomerOf, isomerType, category
  - Sensory: aroma, taste, description
  - Biological: effects (array), therapeuticProperties (array), notableDifferences
  - Chemical: molecularData (molecularFormula, molecularWeight, boilingPoint, class), concentrationRange
  - Research: sources (array), references (array), researchTier (dataQuality, evidenceSummary)

- **Terpene Database**: Container for the complete terpene dataset including schema version, categorization tiers, and all terpene entries

- **Detail View**: UI component that displays comprehensive information for a selected terpene in a structured, readable format

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can access detailed terpene information within 2 clicks (click row, view details)
- **SC-002**: All 30+ terpenes from terpene-database.json load and display correctly in the table
- **SC-003**: Detail view displays all 7 required fields (effects, taste, description, therapeuticProperties, notableDifferences, boilingPoint, sources) for every terpene
- **SC-004**: Table view shows 3 columns (Name, Aroma, Effects) with sources column successfully removed
- **SC-005**: Search bar is visible in the header on all screen sizes (mobile, tablet, desktop)
- **SC-006**: Search functionality returns results in under 500ms for the full dataset
- **SC-007**: Zero JavaScript errors or console warnings when loading data from terpene-database.json
- **SC-008**: Detail view opens within 300ms of clicking a terpene row
- **SC-009**: Users can successfully view and interact with terpene details on screens as small as 360px wide
- **SC-010**: 100% of terpene data fields render safely without XSS vulnerabilities

## Assumptions

- The terpene-database.json file structure will remain consistent with the schema defined in the file
- Users have JavaScript enabled in their browsers
- The existing search debounce mechanism (300ms) is sufficient for the new data model
- The detail view will be implemented as a modal dialog or expandable panel (implementation detail to be determined during planning)
- Boiling point values in the database are in Celsius
- The existing Material UI component library will be used for the detail view UI
- Sources are presented as a simple list without needing to resolve/validate URLs
- The search bar can be relocated to the header without requiring significant header redesign
- Terpenes without complete data are still valuable to display (graceful degradation)
- The application will continue to support the same browser versions as currently specified in the project
