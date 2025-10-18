# Feature Specification: Interactive Terpene Map

**Feature Branch**: `001-interactive-terpene-map`
**Created**: 2025-10-18
**Status**: Draft
**Input**: User description: "I want to To transform terpene data data/terpenes.{json,yaml} into a dynamic, filterable, and visually engaging educational tool that is accessible on all modern devices. 3.1. User Experience & Design Layout: The application shall be fully responsive. Interface: The design shall be clean, modern, and uncluttered. Feedback: All interactive elements shall provide clear visual feedback on user actions. 3.2. Color System & Theming Category Color-Coding: Each effect category shall be assigned a unique and distinct color. Light & Dark Mode: The application shall support both themes and default to the user's system preference. The color palette for both themes must meet accessibility requirements. 3.3. Accessibility Standard: The application shall target compliance with Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. Color Contrast: All text and meaningful UI elements shall have a contrast ratio of at least 4.5:1. Keyboard Navigation: All interactive elements shall be fully navigable and operable using only a keyboard. Screen Reader Support: The application shall use semantic HTML and ARIA attributes where necessary. 3.4. Localization Languages: The application shall be fully localized to support English (en) and German (de). Control: A UI toggle shall allow users to switch languages. 3.5. Performance Load Time: The application shall have a fast initial load time. Responsiveness: All interactions shall be processed instantly with no discernible lag."

## Clarifications

### Session 2025-10-18

- Q: How should the sunburst chart behave when a user interacts with it? → A: Clicking a slice filters the main data view.
- Q: What columns should be displayed in the table view, and should they be sortable? → A: Name, Aroma, Sources, Effects (all sortable).
- Q: Which fields should the search bar use to find matching terpenes? → A: Search by Name, Aroma, and Effects.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Filter Terpene Data (Priority: P1)

As a user, I want to see a visual representation of all terpenes from the dataset, so that I can get an overview of the available data. I also want to be able to filter the terpenes by their effects, so that I can find terpenes that have the characteristics I'm interested in.

**Why this priority**: This is the core functionality of the application.

**Independent Test**: The user can load the application and see the terpene data. The user can use the filter controls and see the list of terpenes update accordingly.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the user views the main screen, **Then** a list or grid of terpenes is displayed.
2. **Given** the terpene list is displayed, **When** the user selects an effect filter, **Then** the list updates to show only terpenes with that effect.

---

### User Story 2 - Theming and Language (Priority: P2)

As a user, I want to be able to switch between a light and a dark theme, so that I can use the application comfortably in different lighting conditions. I also want to be able to switch the language of the application between English and German.

**Why this priority**: This improves the user experience and accessibility of the application.

**Independent Test**: The user can toggle between light and dark mode and see the application's appearance change. The user can switch the language and see the UI text update.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** the user activates the theme toggle, **Then** the application switches between light and dark mode.
2. **Given** the application is running, **When** the user selects a language from the language switcher, **Then** the UI text updates to the selected language.

---

### User Story 3 - Data Visualization and Search (Priority: P1)

As a user, I want to be able to view the terpene data in different formats, such as a sunburst chart and a table, so that I can choose the representation that best suits my needs. I also want to be able to search for specific terpenes by name, so that I can quickly find the information I'm looking for.

**Why this priority**: This provides users with powerful tools to explore and analyze the data.

**Independent Test**: The user can switch between the different views (sunburst, table). The user can type in the search bar and see the data views update with filtered results.

**Acceptance Scenarios**:

1. **Given** the application is displaying terpene data, **When** the user selects the 'sunburst chart' view, **Then** the data is rendered as a sunburst chart.
2. **Given** the application is displaying terpene data, **When** the user selects the 'table' view, **Then** the data is rendered in a tabular format with sortable columns for Name, Aroma, Sources, and Effects.
3. **Given** the application is displaying terpene data in the sunburst chart view, **When** the user clicks on a slice, **Then** the main data view is filtered to show only the selected terpene or effect category.
4. **Given** the application is displaying terpene data, **When** the user types in the search bar, **Then** the data in the current view is filtered to show only terpenes matching the search term (by Name, Aroma, or Effects).

---

### Edge Cases

- What happens when the terpene data fails to load? The application should display a user-friendly error message.
- How does the system handle filtering for an effect that no terpenes have? The application should display a "no results" message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display terpene data from `data/terpenes.{json,yaml}`.
- **FR-002**: The application MUST be fully responsive and accessible on all modern devices.
- **FR-003**: The design SHALL be clean, modern, and uncluttered.
- **FR-004**: All interactive elements SHALL provide clear visual feedback on user actions.
- **FR-005**: Each effect category SHALL be assigned a unique and distinct color.
- **FR-006**: The application SHALL support both light and dark themes and default to the user's system preference.
- **FR-007**: The application SHALL be fully localized to support English (en) and German (de).
- **FR-008**: A UI toggle SHALL allow users to switch languages.
- **FR-009**: The application MUST provide an interactive sunburst chart visualization of the terpene data, where clicking on a slice filters the main data view.
- **FR-010**: The application MUST provide a table view of the terpene data with sortable columns for Name, Aroma, Sources, and Effects.
- **FR-011**: The application MUST have a functional search bar that filters terpenes by Name, Aroma, and Effects.

### Non-Functional Requirements

- **NFR-A11Y-001 (Accessibility)**: The application SHALL target compliance with Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.
- **NFR-A11Y-002 (Accessibility)**: All text and meaningful UI elements SHALL have a contrast ratio of at least 4.5:1.
- **NFR-A11Y-003 (Accessibility)**: All interactive elements SHALL be fully navigable and operable using only a keyboard.
- **NFR-A11Y-004 (Accessibility)**: The application SHALL use semantic HTML and ARIA attributes where necessary.
- **NFR-PERF-001 (Performance)**: The application SHALL have a fast initial load time.
- **NFR-PERF-002 (Performance)**: All interactions SHALL be processed instantly with no discernible lag.

### Key Entities *(include if feature involves data)*

- **Terpene**: Represents a single terpene. It has a name, description, and a list of associated effects.
- **Effect**: Represents a category of effect that a terpene can have (e.g., "calming", "energetic").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The application achieves a Lighthouse performance score of 90 or higher.
- **SC-002**: The application achieves a Lighthouse accessibility score of 95 or higher.
- **SC-003**: Users can filter the terpene list and see updated results in under 200ms.
- **SC-004**: 95% of users can successfully find a specific terpene and its effects.
- **SC-005**: The sunburst chart and table view load and are interactive within 500ms.
- **SC-006**: The search bar provides results in under 200ms as the user types.