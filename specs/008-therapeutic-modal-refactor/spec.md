# Feature Specification: Therapeutic-Focused Terpene Details Modal

**Feature Branch**: `008-therapeutic-modal-refactor`  
**Created**: 2025-10-31  
**Status**: Draft  
**Input**: User description: "Refactor terpene details modal with therapeutic information prioritized for medical cannabis patients using hybrid Basic/Expert view toggle"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Quick Therapeutic Assessment (Priority: P1)

A medical cannabis patient views a terpene's details to quickly understand how it can help their health condition without being overwhelmed by scientific data.

**Why this priority**: This is the core value proposition - medical patients need rapid access to therapeutic information to make informed decisions about their treatment. This addresses the primary user need: "How does this terpene help my health condition?"

**Independent Test**: Can be fully tested by opening the modal for any terpene and verifying that therapeutic properties, categorized effects, and patient-friendly descriptions are immediately visible without scrolling, and that the user can identify key therapeutic benefits within 15 seconds.

**Acceptance Scenarios**:

1. **Given** a medical patient is viewing the terpene table, **When** they click on a terpene name, **Then** the modal opens displaying the Basic View with therapeutic properties prominently featured at the top
2. **Given** the modal is open in Basic View, **When** the user scans the content, **Then** they can identify therapeutic benefits (Antidepressant, Anti-inflammatory, Anxiolytic, etc.) within 10 seconds
3. **Given** the Basic View is displayed, **When** the user views the effects section, **Then** effects are organized by category (Mood & Energy, Relaxation & Anxiety, Physical & Physiological) with recognizable icons
4. **Given** a terpene has concentration data, **When** the Basic View displays, **Then** a visual progress bar shows relative concentration with a label (High/Moderate/Low/Trace)
5. **Given** the modal displays aroma information, **When** the user views the identity section, **Then** aromas appear as color-coded chips with relevant icons for quick recognition

---

### User Story 2 - Deep Therapeutic Exploration (Priority: P2)

An informed patient or healthcare provider wants to access complete pharmacological information, molecular data, and research evidence to understand the terpene in depth.

**Why this priority**: While not all users need scientific depth, medical professionals and informed patients require access to complete data for clinical decision-making and patient education. This satisfies the "scientific depth on demand" principle.

**Independent Test**: Can be tested by toggling to Expert View and verifying that all three accordion sections (Therapeutic Details, Molecular Properties, Research & Evidence) are present and contain complete information from the database.

**Acceptance Scenarios**:

1. **Given** the modal is open in Basic View, **When** the user clicks the "Expert View" toggle, **Then** the view switches to show three expandable accordion sections
2. **Given** Expert View is active, **When** the page loads, **Then** the "Therapeutic Details" accordion is expanded by default showing all effects categorized
3. **Given** the Therapeutic Details accordion is expanded, **When** the user views it, **Then** they see complete effects organized by category, notable synergies/differences in a highlighted callout, and the complete source list
4. **Given** Expert View is active, **When** the user expands the "Molecular Properties" accordion, **Then** they see chemical class, molecular formula with copy button, molecular weight, boiling point, and isomer information (if applicable)
5. **Given** Expert View is active, **When** the user expands the "Research & Evidence" accordion, **Then** they see a color-coded data quality badge, evidence summary, and clickable reference citations with type badges
6. **Given** the user is viewing molecular formula, **When** they click the copy button, **Then** the formula is copied to clipboard and a success toast notification appears

---

### User Story 3 - Filter by Therapeutic Property (Priority: P2)

A patient wants to find other terpenes with similar therapeutic properties by clicking on a therapeutic property chip in the modal.

**Why this priority**: This enables discovery workflows where patients can explore terpenes by their specific health needs, creating a more personalized research experience.

**Independent Test**: Can be tested by clicking any therapeutic property chip in the modal and verifying that the main table is filtered to show only terpenes with that property, with appropriate feedback to the user.

**Acceptance Scenarios**:

1. **Given** the modal is open showing therapeutic property chips, **When** the user clicks on a property (e.g., "Anxiolytic"), **Then** the main terpene table is filtered to show only terpenes with that property
2. **Given** a therapeutic property filter is applied, **When** the filter activates, **Then** a snackbar notification appears with the message "Showing terpenes with [Property] properties"
3. **Given** the user clicked a therapeutic property chip, **When** the filter is applied, **Then** the modal remains open to allow viewing the current terpene details while comparing with filtered results
4. **Given** the modal is open after a filter is applied, **When** the user wants to close it, **Then** they can use the X button, Escape key, or click outside the modal
4. **Given** Expert View is active, **When** the user clicks an effect chip in the categorized effects section, **Then** the main table is filtered by that specific effect

---

### User Story 4 - Category Badge Information (Priority: P3)

A user wants to understand what the category badge (Core/Secondary/Minor) means without leaving the modal.

**Why this priority**: While helpful for understanding terpene prevalence and research quality, this is supplementary information that doesn't block primary workflows.

**Independent Test**: Can be tested by hovering over or clicking the category badge and verifying that explanatory information is displayed.

**Acceptance Scenarios**:

1. **Given** the modal displays a category badge, **When** the user hovers over it, **Then** a tooltip appears explaining what the category means (e.g., "Core: High-prevalence, clinically well-defined terpenes")
2. **Given** the modal is open, **When** the user views the category badge, **Then** it is color-coded to match the category type (Core in primary color, Secondary in secondary color, Minor in gray)

---

### User Story 5 - Concentration Context (Priority: P3)

A user wants to understand what the concentration value means in practical terms for dosing and potency.

**Why this priority**: While concentration is important, the visual indicator provides immediate context. Additional explanation is supplementary.

**Independent Test**: Can be tested by hovering over or clicking the concentration bar and verifying that contextual information is provided.

**Acceptance Scenarios**:

1. **Given** the modal displays a concentration bar, **When** the user hovers over it, **Then** a tooltip appears explaining what the label means (e.g., "High concentration - top 25% for Core terpenes")
2. **Given** the user wants more detailed concentration information, **When** they click on the concentration bar or label, **Then** an info dialog appears explaining concentration ranges and their therapeutic significance

---

### Edge Cases

- What happens when a terpene has no effects in a particular category (e.g., no "Physical & Physiological" effects)? → That category section should not be displayed in the effects list to avoid empty sections
- How does the system handle terpenes with no isomer information? → The isomer information section in Expert View should be conditionally hidden if `isomerOf` is null
- What happens when a terpene has no notable differences or synergies? → The Notable Synergies callout should be hidden in Expert View
- What happens when the modal is opened on a very small mobile screen? → The modal becomes full-screen, toggle buttons stack vertically, and touch targets are enlarged to 48x48px minimum
- How does the system handle very long terpene descriptions? → Basic View shows a truncated version (120 characters) with a "Read more..." link that expands the full text
- What happens when a user presses Escape key while the modal is open? → The modal closes and focus is restored to the triggering element
- How does the system handle terpenes with many therapeutic properties (>10)? → Basic View shows all properties as chips that wrap naturally; no truncation of therapeutic properties as they are primary information
- What happens when a reference URL is not accessible or broken? → The reference is still displayed but the external link icon is not shown; clicking shows a "Link unavailable" message
- How does the copy-to-clipboard function handle browsers that don't support the Clipboard API? → A fallback method (select and copy) is used, or an error message is shown if clipboard access is denied

## Requirements _(mandatory)_

### Functional Requirements

#### Basic View Display

- **FR-001**: System MUST display a two-mode toggle (Basic View / Expert View) with Basic View as the default
- **FR-002**: System MUST display the terpene name as a prominent heading (24px, bold) at the top of the modal
- **FR-003**: System MUST display a category badge (Core/Secondary/Minor) next to the terpene name with color coding
- **FR-004**: System MUST display aroma descriptors as clickable chips with appropriate icons in the Identity section
- **FR-005**: System MUST display a therapeutic description with the heading "What it does for you:" in plain, patient-friendly language (target: Flesch-Kincaid Grade Level 6-8, short sentences, avoid medical jargon)
- **FR-006**: System MUST display therapeutic properties as color-coded, clickable chips immediately below the description
- **FR-007**: System MUST organize and display effects by category using the effectCategoryMapping from the database schema
- **FR-008**: System MUST display category headers with appropriate icons (🌞 Mood & Energy, 🧠 Cognitive, 🧘 Relaxation, 🏃 Physical)
- **FR-009**: System MUST display only categories that contain effects for the current terpene (no empty sections)
- **FR-010**: System MUST display up to 3 effects per category in Basic View
- **FR-011**: System MUST display concentration range with both numeric value and visual progress bar
- **FR-012**: System MUST calculate and display a concentration label (High/Moderate/Low/Trace) based on percentile
- **FR-013**: System MUST display natural sources (first 3) with appropriate icons and common names
- **FR-014**: System MUST NOT display the "taste" field as it is not medically relevant

#### Expert View Display

- **FR-015**: System MUST display three accordion sections in Expert View: "Therapeutic Details", "Molecular Properties", "Research & Evidence"
- **FR-016**: System MUST expand the "Therapeutic Details" accordion by default when switching to Expert View
- **FR-017**: System MUST keep "Molecular Properties" and "Research & Evidence" accordions collapsed by default
- **FR-018**: System MUST display all effects organized by category (no 3-effect limit) in the Therapeutic Details accordion
- **FR-019**: System MUST display notable synergies and differences in a highlighted callout with warning icon (⚠️) if the field exists
- **FR-020**: System MUST display the complete list of natural sources in the Therapeutic Details accordion
- **FR-021**: System MUST display molecular class, formula, weight, and boiling point in the Molecular Properties accordion
- **FR-022**: System MUST provide a copy button next to the molecular formula that copies to clipboard
- **FR-023**: System MUST conditionally display isomer information (type and parent compound) only if `isomerOf` is not null
- **FR-024**: System MUST display a color-coded data quality badge in the Research & Evidence accordion
- **FR-025**: System MUST display the evidence summary text
- **FR-026**: System MUST display references as a numbered list with type badges and external link icons for URLs

#### Interactions

- **FR-027**: Users MUST be able to toggle between Basic View and Expert View using a toggle button group
- **FR-028**: System MUST maintain toggle state while the modal is open
- **FR-029**: Users MUST be able to click therapeutic property chips to filter the main terpene table by that property
- **FR-030**: System MUST display a snackbar notification when a therapeutic property filter is applied (Material UI Snackbar, 3-second duration, bottom-center position, auto-dismiss with close button)
- **FR-031**: System MUST keep the modal open after applying a filter to allow users to compare current terpene details with filtered results
- **FR-032**: Users MUST be able to click effect chips in Expert View to filter the main terpene table
- **FR-033**: System MUST copy molecular formula to clipboard when the copy button is clicked
- **FR-034**: System MUST display a success toast notification after copying molecular formula (Material UI Snackbar, 3-second duration, bottom-center position, auto-dismiss)
- **FR-035**: Users MUST be able to expand and collapse accordion sections independently in Expert View
- **FR-036**: System MUST allow multiple accordions to be open simultaneously
- **FR-037**: Users MUST be able to close the modal using the X button, Escape key, or clicking outside
- **FR-038**: System MUST restore focus to the triggering element when the modal closes

#### Responsive Behavior

- **FR-039**: System MUST display the modal as full-screen on mobile devices (< 600px width)
- **FR-040**: System MUST display the modal as a centered dialog with max-width 600px on tablet/desktop (≥ 600px width)
- **FR-041**: System MUST stack toggle buttons vertically on mobile devices
- **FR-042**: System MUST ensure all touch targets are minimum 48x48px on mobile
- **FR-043**: System MUST wrap chips naturally on all screen sizes

#### Accessibility

- **FR-044**: System MUST provide appropriate ARIA labels for all interactive elements
- **FR-045**: System MUST support full keyboard navigation (Tab, Enter, Escape)
- **FR-046**: System MUST trap focus within the modal when open
- **FR-047**: System MUST ensure color contrast ratio of at least 4.5:1 for all text
- **FR-048**: System MUST provide text labels alongside icon-only elements
- **FR-049**: System MUST announce toggle view changes to screen readers
- **FR-050**: System MUST provide descriptive aria-labels for accordion expand/collapse states
- **FR-051**: System MUST respect the user's prefers-reduced-motion setting and disable animations when enabled

#### Performance

- **FR-052**: System MUST render the modal in under 100 milliseconds
- **FR-053**: System MUST animate toggle transitions smoothly without layout shifts (unless prefers-reduced-motion is enabled)
- **FR-054**: System MUST conditionally render Expert View content only when the Expert View toggle is activated (content not rendered in DOM until toggled)
- **FR-055**: System MUST display skeleton/placeholder UI (Material UI Skeleton component) in the modal frame immediately when triggered, preserving layout dimensions before full content loads

### Color Coding System

- **FR-056**: System MUST apply semantic colors to therapeutic property chips based on therapeutic domain using Material UI palette values (all meeting 4.5:1 contrast ratio):
  - Mental Health: Anxiolytic (blue[500]), Antidepressant (cyan[700]), Sedative (indigo[500]), Neuroprotective (purple[600])
  - Physical Health: Anti-inflammatory (red[600]), Analgesic (orange[700]), Muscle relaxant (deepOrange[600])
  - Respiratory: Bronchodilator (teal[600]), Mucolytic (cyan[600])
  - Immune: Antimicrobial (green[700]), Antiviral (lightGreen[800]), Antioxidant (green[600])
  - Digestive: Gastroprotective (brown[600]), Antispasmodic (amber[800])
- **FR-057**: System MUST apply category-specific colors to effect category headers using Material UI palette values:
  - Mood & Energy: amber[700]
  - Cognitive Enhancement: blue[600]
  - Relaxation & Anxiety: indigo[600]
  - Physical & Physiological: red[600]

### Key Entities

- **Terpene**: Represents a terpene compound with therapeutic, molecular, and research data
  - Attributes: name, category, description, aroma, effects, therapeuticProperties, notableDifferences, concentrationRange, sources, molecularData, researchTier, references, isomerOf, isomerType
  - Relationships: Maps to effectCategories via effectCategoryMapping

- **Effect Category**: Represents a grouping of effects by patient goal
  - Attributes: id, name, icon, description, displayOrder
  - Predefined categories: mood, cognitive, relaxation, physical

- **Therapeutic Property**: Represents a specific therapeutic action or benefit
  - Used for: Color coding, filtering, patient decision-making
  - Examples: Anxiolytic, Anti-inflammatory, Analgesic, Neuroprotective

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Medical cannabis patients can identify at least 3 therapeutic benefits of a terpene within 15 seconds of opening the modal
- **SC-002**: The modal renders and displays content in under 100 milliseconds on standard devices
- **SC-003**: At least 40% of users who open the modal explore the Expert View toggle during their session
- **SC-004**: At least 30% of users click on therapeutic property chips to filter the main table
- **SC-005**: The modal passes WCAG 2.1 AA accessibility compliance (minimum 4.5:1 color contrast, keyboard navigation, screen reader compatibility)
- **SC-006**: Users can complete the primary task (understanding therapeutic benefits) without scrolling on mobile devices in portrait orientation
- **SC-007**: At least 85% of users report that they understand the therapeutic purpose of a terpene after viewing the Basic View (via user testing)
- **SC-008**: The toggle interaction between Basic and Expert views completes within 200 milliseconds with smooth animation
- **SC-009**: Copy-to-clipboard functionality works successfully on at least 95% of supported browsers
- **SC-010**: At least 50% of users who open a modal re-open another terpene modal in the same session (indicating successful information finding)
- **SC-011**: The modal maintains performance with no layout shifts (Cumulative Layout Shift score < 0.1)
- **SC-012**: All interactive elements have touch targets of at least 48x48 pixels on mobile devices

## Assumptions

1. **Data Availability**: All terpenes in the database have complete data for name, category, description, effects, and therapeuticProperties fields
2. **Effect Categorization**: The effectCategoryMapping in the database schema correctly maps all possible effects to their appropriate categories
3. **Browser Support**: Target browsers support CSS Grid, Flexbox, Clipboard API (with fallback), and modern JavaScript ES2022 features
4. **User Language**: Primary language is English with German translation support via i18next (existing infrastructure)
5. **Device Support**: Modal must support screen sizes from 320px (small mobile) to 1920px+ (desktop)
6. **Performance Baseline**: Testing will be conducted on devices meeting minimum specifications: 2GB RAM, dual-core processor, modern browser (last 2 versions)
7. **Color Scheme**: The application supports both light and dark themes, and the modal must respect user's theme preference
8. **Concentration Calculation**: The concentration percentile calculation uses a normalized scale where values are compared against category-specific averages (Core/Secondary/Minor have different baselines)
9. **Icon Support**: The system can display emoji icons consistently across all supported platforms (🌞, 🧠, 🧘, 🏃, etc.)
10. **Reference Links**: Not all references will have clickable URLs; some are citation-only (e.g., "PubMed 35278524")
11. **Medical Disclaimer**: The application includes appropriate medical disclaimer text elsewhere in the UI; the modal does not need to repeat this
12. **Filter Integration**: The main terpene table already supports filtering by therapeutic properties and effects (existing functionality that the modal will trigger)

## Dependencies

1. **Existing Terpene Data**: The terpene database schema at `data/terpene-database.json` with effectCategories and effectCategoryMapping
2. **Existing Theme System**: Material UI theme with color palette and responsive breakpoints
3. **Existing i18n Setup**: i18next configuration for bilingual support (English/German)
4. **Existing Filter Service**: Main table filtering functionality that can be triggered programmatically
5. **Existing Notification System**: Snackbar/Toast notification component for user feedback

## User Testing Plan

### SC-007 Validation: Therapeutic Understanding

**Objective**: Verify that at least 85% of users understand the therapeutic purpose of a terpene after viewing the Basic View

**Method**: Think-Aloud User Testing Sessions

**Participants**: 
- Target: 10-12 participants
- Profile: Medical cannabis patients or caregivers (mix of technical literacy levels)
- Recruitment: Cannabis community forums, patient advocacy groups, medical dispensaries

**Protocol**:
1. **Pre-Task**: Brief participants on scenario: "You're researching terpenes for health conditions"
2. **Task**: Ask participant to open modal for 3 different terpenes (e.g., Myrcene, Limonene, Linalool)
3. **Questions** (after each terpene):
   - "What health conditions or symptoms could this terpene help with?" (open-ended)
   - "How confident are you in your understanding?" (1-5 scale)
   - "What information was most helpful?" (open-ended)
4. **Success Criteria**: Participant correctly identifies at least 2 therapeutic properties or effects from the Basic View within 30 seconds
5. **Data Collection**: Video recording, facilitator notes, satisfaction survey

**Timing**: After Phase 8 completion, before production release

**Success Threshold**: ≥85% of participants (9 out of 10) correctly identify therapeutic uses

**Fallback**: If threshold not met, iterate on FR-005 (description clarity), FR-006 (property visibility), or FR-008 (effect categorization)

## Clarifications

### Session 2025-10-31

- Q: What should users see while the modal is loading/rendering? → A: Show skeleton/placeholder UI in modal frame immediately
- Q: Should the modal automatically close after applying a filter, or stay open for comparison? → A: Stay open, allow manual close by user
- Q: Should animations respect the user's prefers-reduced-motion setting? → A: Respect prefers-reduced-motion, disable animations

## Out of Scope

The following features are explicitly out of scope for this specification and may be considered for future iterations:

1. **Symptom-Based Search**: A feature to search "Show me terpenes for anxiety" - requires medical validation and legal review
2. **Terpene Comparison**: Side-by-side comparison of 2-3 terpenes - adds significant UI complexity
3. **Dosing Guidance**: Specific dosing recommendations or effective concentration ranges - requires medical disclaimer and regulatory review
4. **Save/Favorite Terpenes**: Personal profile building with saved terpenes - requires data persistence and user account system
5. **Molecular Structure Visualization**: 2D or 3D molecular structure rendering - requires additional visualization libraries
6. **Print/Export Functionality**: Ability to print or export terpene information - separate feature
7. **Share Functionality**: Social sharing or direct link sharing - separate feature
8. **Related Terpenes Section**: Suggestions for synergistic or similar terpenes - requires recommendation algorithm
9. **Comments/Notes**: User-generated notes or comments on terpenes - requires backend storage
10. **Historical Concentration Data**: Trends in concentration over time or by region - requires expanded dataset
