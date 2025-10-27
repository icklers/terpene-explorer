# Feature Specification: Comfortably Dark Theme System

**Feature Branch**: `004-dark-theme-design`  
**Created**: October 26, 2025  
**Status**: Draft  
**GitHub Issue**: [#23](https://github.com/icklers/terpene-explorer/issues/23)  
**Input**: User description: "The application shall use a 'comfortably dark' theme, prioritizing low eye strain and a professional, branded feel. The design is not flat or 'stuck' to the screen edges; it uses a cohesive, inset layout where all major UI elements (filter cards, tables, detail cards, etc.) are 'floating' cards with matching rounded corners (8px). This creates a modern, unified, and tactile feel."

## Clarifications

### Session 2025-10-26

- Q: What color should be used for the main application background (the area behind the floating cards)? → A: Very dark gray (#121212) - Industry standard for dark themes, reduces eye strain better than pure black
- Q: What text colors should be used for primary and secondary text on dark backgrounds? → A: Primary: #ffffff (white), Secondary: rgba(255,255,255,0.7) - Standard high-contrast text with clear hierarchy
- Q: What spacing should be used between floating card components? → A: 24px (3× base unit) - Generous spacing, enhances floating effect, comfortable breathing room
- Q: What shadow/elevation should be applied to floating cards? → A: Medium: 0 4px 8px rgba(0,0,0,0.3) - Material Design elevation 4, clear floating effect
- Q: What background color should be used for the floating card surfaces? → A: Slightly lighter (#1e1e1e) - Material Design dark surface, subtle contrast with main background

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Application with Comfortable Dark Theme (Priority: P1)

A user opens the terpene explorer application and immediately experiences a dark interface that reduces eye strain during extended research sessions. All content is presented in floating cards with consistent visual styling that feels modern and professional.

**Why this priority**: This is the foundational visual experience that affects every interaction. Without this, users cannot benefit from any other feature improvements. It directly addresses the core need for reduced eye strain and professional appearance.

**Independent Test**: Can be fully tested by opening the application and verifying that all UI elements display with the dark theme, floating card design, and proper contrast ratios. Delivers immediate value through improved visual comfort.

**Acceptance Scenarios**:

1. **Given** the user has opened the application, **When** the main interface loads, **Then** the background displays a comfortable dark color that reduces eye strain
2. **Given** the user is viewing the interface, **When** observing UI components, **Then** all major elements (filter cards, tables, detail cards) appear as floating cards with 8px rounded corners
3. **Given** the user views the header, **When** looking at structural branding elements, **Then** the header and table headers display the dark green (#388e3c) color consistently
4. **Given** the user has the application open for an extended period, **When** working with the interface, **Then** eye strain is noticeably reduced compared to bright or flat designs

---

### User Story 2 - Navigate Active Interface Elements (Priority: P2)

A user interacts with primary controls like view mode toggles and immediately identifies which option is currently active through clear visual feedback using the bright green accent color.

**Why this priority**: After the base theme is established, users need clear feedback on their current selections to navigate confidently. This prevents confusion about the current application state.

**Independent Test**: Can be fully tested by toggling between Sunburst and Table views and verifying the bright green (#4caf50) highlight appears on the active selection. Delivers clear state indication.

**Acceptance Scenarios**:

1. **Given** the user is on the main page, **When** viewing the view mode toggle, **Then** the currently selected mode (Sunburst or Table) displays with bright green (#4caf50) highlighting
2. **Given** the user clicks a different view mode, **When** the selection changes, **Then** the bright green highlight immediately moves to the newly selected option
3. **Given** the user returns to the application, **When** the page loads, **Then** the previously selected view mode is still highlighted in bright green

---

### User Story 3 - Identify Focus and Selection States (Priority: P2)

A user navigating with keyboard or mouse can clearly see which element has focus or is selected through the vibrant orange (#ffb300) highlight color, ensuring accessibility compliance and clear visual feedback.

**Why this priority**: Essential for accessibility and user confidence. Users must always know where they are in the interface, especially keyboard users and those with visual impairments.

**Independent Test**: Can be fully tested by tabbing through the interface with keyboard and clicking table rows, verifying orange highlights appear correctly. Delivers accessibility compliance.

**Acceptance Scenarios**:

1. **Given** the user clicks the search bar, **When** the input receives focus, **Then** a vibrant orange (#ffb300) focus ring appears around the search field
2. **Given** the user is viewing a table, **When** clicking a row, **Then** a 4px orange left border appears on the selected row
3. **Given** the user tabs through the interface with keyboard, **When** each element receives focus, **Then** the orange focus indicator is clearly visible and meets WCAG contrast requirements
4. **Given** the user has selected a table row, **When** clicking elsewhere, **Then** the orange selection border remains on the selected row until a different row is selected

---

### User Story 4 - Filter with Multi-Select Chips (Priority: P3)

A user applies filters using chip-based controls and can immediately distinguish between selected and unselected filter options through the light/dark toggle design with bright green borders on selected chips.

**Why this priority**: Important for filtering functionality but depends on the base theme being established first. Enhances the filtering experience with clear visual state.

**Independent Test**: Can be fully tested by clicking filter chips and verifying selected chips show light background with green border while unselected chips show dark background. Delivers clear filter state.

**Acceptance Scenarios**:

1. **Given** the user is viewing filter options, **When** a chip is unselected, **Then** it displays with a dark background (#1e1e1e) that blends with the card
2. **Given** the user clicks a filter chip, **When** the chip becomes selected, **Then** it displays with a light elevated background (rgba(255, 255, 255, 0.16)) and a bright green (#4caf50) border
3. **Given** multiple filter chips are visible, **When** viewing the interface, **Then** selected and unselected chips are clearly distinguishable without relying on color alone
4. **Given** the user has selected multiple chips, **When** clicking a selected chip again, **Then** it returns to the dark unselected state

---

### User Story 5 - Scan Table Data with Enhanced Readability (Priority: P3)

A user viewing tabular terpene data can easily scan rows thanks to zebra striping, hover feedback, and persistent selection indicators that work together to improve readability without creating visual noise.

**Why this priority**: Enhances the data viewing experience but requires the base theme and interaction colors to be established first. Improves usability for data-heavy workflows.

**Independent Test**: Can be fully tested by scrolling through a table with multiple rows, hovering over rows, and selecting rows to verify zebra striping, hover states, and selection borders. Delivers improved data scanability.

**Acceptance Scenarios**:

1. **Given** the user is viewing a table with multiple rows, **When** observing the table, **Then** odd rows display with a subtle darker background (action.hover) creating zebra stripes
2. **Given** the user hovers over a table row, **When** the mouse moves over the row, **Then** the row background changes to the hover color (action.selected) providing clear feedback
3. **Given** the user clicks a table row, **When** the row is selected, **Then** a 4px vibrant orange (#ffb300) left border appears and remains visible
4. **Given** the user is scanning a long table, **When** scrolling through rows, **Then** the combination of zebra stripes and hover feedback makes individual rows easy to track

---

### Edge Cases

- What happens when a user has a browser that doesn't support backdrop-filter for floating card effects? The design should gracefully degrade to solid backgrounds while maintaining readability.
- How does the system handle very long content in floating cards? Cards should expand naturally while maintaining rounded corners and padding consistency.
- What happens when a user zooms the interface to 200% or higher? All visual indicators (borders, focus rings) must remain visible and proportional.
- How does the theme handle printed pages or PDF exports? A print-friendly version should be considered or the theme should adapt appropriately.
- What happens when users have Windows High Contrast mode or similar accessibility features enabled? The theme should respect system-level accessibility settings.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST apply a dark background color scheme throughout the entire application that prioritizes low eye strain, using very dark gray (#121212) as the main page background behind floating cards
- **FR-002**: System MUST render all major UI elements (filter cards, tables, detail cards) as floating cards with 8px rounded corners
- **FR-003**: System MUST use slightly lighter dark gray (#1e1e1e) as the background color for floating card surfaces to create subtle contrast with the main background
- **FR-004**: System MUST use white (#ffffff) for primary text and semi-transparent white (rgba(255,255,255,0.7)) for secondary text to ensure WCAG 2.1 Level AA compliance on dark backgrounds
- **FR-005**: System MUST apply dark green (#388e3c) as the background color for structural branding elements including main header and table headers
- **FR-006**: System MUST highlight the currently selected view mode toggle (Sunburst or Table) with bright green (#4caf50) color
- **FR-007**: System MUST display vibrant orange (#ffb300) focus rings around interactive elements when they receive focus
- **FR-008**: System MUST show a 4px vibrant orange (#ffb300) left border on selected table rows
- **FR-009**: System MUST render unselected filter chips with dark background (#1e1e1e) that blends with the card background
- **FR-010**: System MUST render selected filter chips with light elevated background (rgba(255, 255, 255, 0.16)) and bright green (#4caf50) border
- **FR-011**: System MUST apply zebra striping to table rows using a subtle darker background (action.hover) for odd rows
- **FR-012**: System MUST change table row background color on hover (action.selected) to provide interaction feedback
- **FR-013**: System MUST ensure all color combinations meet WCAG 2.1 Level AA contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text)
- **FR-014**: System MUST maintain consistent 8px border radius across all floating card components
- **FR-015**: System MUST create visual separation between floating cards and the main background using 24px spacing between cards and box-shadow of 0 4px 8px rgba(0,0,0,0.3) for elevation
- **FR-016**: System MUST preserve all interactive states (focus, hover, selected, active) with clear visual differentiation
- **FR-017**: System MUST ensure that selection and focus indicators are visible to users who cannot distinguish colors (shape/position based indicators in addition to color)

### Key Entities

- **Theme Configuration**: Represents the complete dark theme definition including all color values, main background (#121212), card surface background (#1e1e1e), table wrapper background (#272727 for visual separation from card surfaces), text colors (primary #ffffff, secondary rgba(255,255,255,0.7)), structural colors (dark green #388e3c), interaction colors (bright green #4caf50, vibrant orange #ffb300), spacing (24px between cards), radius values (8px corners), and elevation (box-shadow: 0 4px 8px rgba(0,0,0,0.3))
- **Floating Card Component**: Represents any major UI element (filter card, table, detail card) that appears as a floating, elevated component with rounded corners and consistent styling
- **Color Role**: Represents the semantic meaning of each color (structural branding, active interaction, highlight/focus, selection state) and defines where each color should be applied
- **Interaction State**: Represents the various states of interactive elements (default, hover, focus, selected, active) and their corresponding visual treatments
- **Table Row State**: Represents the visual state of table rows including base (odd/even for zebra stripes), hover, and selected states

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All color contrast ratios between text and backgrounds meet or exceed WCAG 2.1 Level AA requirements (4.5:1 for normal text, 3:1 for large text) when measured with automated accessibility tools
- **SC-002**: Users can identify the currently active view mode within 1 second of viewing the interface
- **SC-003**: Users navigating with keyboard can clearly see which element has focus 100% of the time, with focus indicators meeting WCAG 2.1 Level AA visibility requirements
- **SC-004**: All major UI components (filter cards, tables, detail cards) display as floating cards with consistent 8px rounded corners across all viewports
- **SC-005**: 90% of users report reduced eye strain compared to the previous theme in user satisfaction surveys
- **SC-006**: Selected table rows remain clearly identifiable even when users cannot distinguish between green and orange colors
- **SC-007**: The interface maintains professional appearance and brand consistency across all pages and components
- **SC-008**: Hover feedback on table rows is visible within 100 milliseconds of mouse movement over the row
- **SC-009**: Theme applies consistently across all supported browsers without visual degradation or layout issues
- **SC-010**: Users can complete typical workflows (filtering, viewing details, navigating tables) without confusion about interface state or active selections

## Assumptions

- The application already has a theming system in place that can be extended or modified for this dark theme implementation
- Users have modern browsers that support CSS features required for floating card effects (box-shadow, border-radius)
- The existing terpene data and component structure will remain unchanged; only visual styling will be updated
- The color palette provided (#388e3c, #4caf50, #ffb300) has been validated for brand alignment
- Users will primarily use the application in low-light environments where the dark theme provides the most benefit
- The existing component library (likely Material-UI based on theme structure references) supports the required customization
- Accessibility compliance targets WCAG 2.1 Level AA as the minimum standard
- The floating card design applies to desktop and tablet viewports; mobile layouts may have adapted spacing

## Dependencies

- Existing theme configuration system must support dark mode palette definition
- Component library must support customization of focus indicators and selection states
- Browser compatibility requirements for CSS features (border-radius, box-shadow, rgba colors)
- Accessibility testing tools for validating contrast ratios and focus indicator visibility

## Out of Scope

- Implementation of a theme switcher to toggle between light and dark modes (this spec defines only the dark theme)
- Animation or transitions between theme states
- User preference storage for theme selection
- Customization of individual color values by end users
- Print stylesheet optimization (mentioned as edge case but not required for MVP)
- High contrast mode customization beyond respecting system settings
- Mobile-specific layout adaptations beyond responsive card sizing
