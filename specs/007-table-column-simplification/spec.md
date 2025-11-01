# Feature Specification: Table Column Simplification

**Feature Branch**: `007-table-column-simplification`  
**Created**: 2025-10-31  
**Status**: Draft  
**Input**: User description: "The terpene table shall only show the columns: Name, Aroma, Effects. Sources shall be replaced by the Terpene Category (Core, Secondary, Minor). When listing the terpenes table, they shall initially be sorted by their category property (Core, Secondary, Minor)."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Simplified Table Layout (Priority: P1)

A researcher wants to quickly scan terpene information without being overwhelmed by excessive detail. They need to see only the most essential information: the terpene name, its aroma profile, its effects, and its importance category.

**Why this priority**: This is the core functionality that delivers immediate value by simplifying the user interface and reducing cognitive load. The simplified view makes it easier for users to focus on the most relevant information.

**Independent Test**: Can be fully tested by loading the terpene table and verifying that exactly four columns are displayed (Name, Aroma, Effects, Category) and that the Sources column has been removed.

**Acceptance Scenarios**:

1. **Given** the user navigates to the terpene table view, **When** the table loads, **Then** the table displays exactly four column headers ("Name", "Aroma", "Effects", "Category") and the "Sources" column is not present
2. **Given** the table contains terpene data, **When** each row is displayed, **Then** each row shows the terpene's name, aroma description, effects (as chips/badges), and category label

---

### User Story 2 - Category-Based Sorting (Priority: P1)

A user wants to understand which terpenes are most important or common by seeing them organized by their research significance. Core terpenes should appear first, followed by Secondary, then Minor terpenes.

**Why this priority**: Default sorting by category provides immediate context about terpene importance and is critical for the user's understanding of the data hierarchy. This is a fundamental change to the initial user experience.

**Independent Test**: Can be tested by loading the table and verifying that all "Core" terpenes appear first, followed by all "Secondary" terpenes, then all "Minor" terpenes, without requiring any user interaction.

**Acceptance Scenarios**:

1. **Given** the user loads the terpene table, **When** the table displays, **Then** all terpenes with category "Core" appear before any other categories
2. **Given** Core terpenes are displayed first, **When** the table continues, **Then** all "Secondary" category terpenes appear next
3. **Given** Core and Secondary terpenes are displayed, **When** the table completes, **Then** all "Minor" category terpenes appear last
4. **Given** the table is sorted by category, **When** the user clicks the Category column header, **Then** the sort direction toggles between ascending (Core→Secondary→Minor) and descending (Minor→Secondary→Core)

---

### User Story 3 - Category Column Sorting and Display (Priority: P2)

A user wants to sort the table by different columns (Name, Aroma, Effects, or Category) to organize the information according to their current research focus. The Category column should be sortable like other columns.

**Why this priority**: Flexible sorting is important but secondary to the default category-based view. Users need this for specific research tasks but the default view (P1) provides the primary value.

**Independent Test**: Can be tested by clicking each column header and verifying that the table re-sorts correctly based on that column, with proper visual indicators (sort arrows).

**Acceptance Scenarios**:

1. **Given** the table is displayed with category sorting, **When** the user clicks the "Name" column header, **Then** the table re-sorts alphabetically by terpene name
2. **Given** the table is sorted by any column, **When** the user clicks the "Category" column header, **Then** the table sorts by category with proper visual sort indicator
3. **Given** the table is sorted by category ascending, **When** the user clicks the Category column header again, **Then** the sort direction reverses (Minor→Secondary→Core)
4. **Given** the table is sorted by any column, **When** a sort is active, **Then** the active column displays a visual sort direction indicator (ascending or descending arrow)

---

### Edge Cases

- What happens when a terpene has no category value or an invalid category value?
  - **Resolution**: Display as "Uncategorized" at the end of the list (after Minor, rank=4) to maintain data quality visibility
- How does the category sort handle terpenes within the same category?
  - **Resolution**: Within each category group, terpenes should be sorted alphabetically by name as a secondary sort
- What happens if the category property doesn't exist in the data model?
  - **Resolution**: System should gracefully handle missing category fields and log a warning
- How should the category be displayed in the table cell?
  - **Resolution**: Display as plain text label (e.g., "Core", "Secondary", "Minor") without special styling; visual distinction achieved by displaying Core terpene names in bold font weight in the Name column

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The table MUST display exactly four columns: Name, Aroma, Effects, and Category
- **FR-002**: The table MUST NOT display the Sources column
- **FR-003**: The Category column MUST display the terpene's category value from the data model (Core, Secondary, or Minor)
- **FR-004**: The table MUST initially sort by category in ascending order using importance ranking (Core=1, Secondary=2, Minor=3, Uncategorized=4), not alphabetical sorting
- **FR-005**: Within each category group, terpenes MUST be sorted alphabetically by name as a secondary sort criterion
- **FR-006**: The Category column MUST be sortable (clicking the header toggles sort direction)
- **FR-007**: All four columns (Name, Aroma, Effects, Category) MUST support column header sorting
- **FR-008**: The table MUST maintain visual sort indicators (arrows) to show which column is actively sorted and in which direction
- **FR-009**: The table MUST preserve existing functionality for row selection, hover states, and detail modal opening
- **FR-013**: Terpene names in the Name column MUST be displayed in bold font weight (font-weight: 700) when the terpene's category is "Core", and regular font weight (font-weight: 400) for all other categories
- **FR-014**: Category labels in the Category column MUST be displayed as plain text without special styling (no bold, color, or icons)
- **FR-010**: The table MUST handle missing or invalid category values by displaying "Uncategorized" label (sorted after Minor with rank=4)
- **FR-011**: The Effects column MUST continue to display effects as chips/badges with proper internationalization
- **FR-012**: The table MUST support bilingual display (English/German) for all column headers and category labels

### Key Entities

- **Terpene**: Core data entity representing a terpene compound with properties including:
  - `id`: Unique identifier
  - `name`: Terpene name (displayed in Name column)
  - `aroma`: Aromatic profile description (displayed in Aroma column)
  - `effects`: Array of effect strings (displayed as chips in Effects column)
  - `category`: Classification tier - "Core", "Secondary", or "Minor" (displayed in new Category column)
  - `sources`: Array of source strings (no longer displayed in table, still available in detail modal)

- **Column Configuration**: Defines which columns are visible and their sorting behavior:
  - Visible columns: Name, Aroma, Effects, Category
  - Default sort: Category (ascending), then Name (ascending as secondary)
  - All columns sortable with toggle direction behavior

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view the complete terpene list with four columns (Name, Aroma, Effects, Category) without horizontal scrolling on standard desktop displays (≥1024px width)
- **SC-002**: The table loads with terpenes correctly grouped by category, with Core terpenes visible first without requiring scrolling or user interaction
- **SC-003**: Users can successfully sort the table by any of the four columns with immediate visual feedback (sort completes within 100ms for datasets up to 100 terpenes)
- **SC-004**: 100% of terpenes display a valid category label (Core, Secondary, Minor, or Uncategorized)
- **SC-005**: The table layout reduces horizontal space usage by at least 20% compared to the previous five-column layout
- **SC-006**: All existing table interactions (row hover, row selection, keyboard navigation, detail modal) continue to function without regression
- **SC-007**: Category labels and column headers are properly translated in both English and German languages
- **SC-008**: Users can identify the importance tier of any terpene at a glance by scanning the Category column

## Clarifications

### Session 2025-10-31

- Q: Category sorting mechanism - should it use alphabetical string comparison or importance ranking? → A: Importance rank - Predefined order (Core=1, Secondary=2, Minor=3, Uncategorized=4)
- Q: Missing category default behavior - should it display "Uncategorized", "Minor", or blank? → A: "Uncategorized" label - Shows data quality issues explicitly, appears after Minor (rank=4)
- Q: Category visual styling - color badges, text weight, icons, or plain text? → A: Text weight/style - Core terpene names (in Name column) displayed in bold; category labels remain regular weight
