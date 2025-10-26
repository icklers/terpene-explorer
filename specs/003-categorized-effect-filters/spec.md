# Feature Specification: Categorized Effect Filters

**Feature Branch**: `003-categorized-effect-filters`  
**Created**: October 25, 2025  
**Status**: Draft  
**GitHub Issue**: [#29](https://github.com/icklers/terpene-explorer/issues/29)  
**Input**: User description: "As a medical cannabis user, I want to easily navigate through the effects with categories, so that I can
find the right terpenes for my therapy. The categories shall be color coded."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Categorized Effects (Priority: P1)

As a medical cannabis user, I need to see effect filters organized into therapeutic categories (Mood & Energy, Cognitive & Mental
Enhancement, Relaxation & Anxiety Management, Physical & Physiological Management) with corresponding emoticons so that I can quickly
identify which category addresses my therapeutic needs.

**Why this priority**: This is the foundation of the feature. Without categorized grouping and visual emoticons, users cannot benefit from
organized navigation. This delivers immediate value by reducing cognitive load and improving discoverability.

**Independent Test**: Can be fully tested by opening the effect filter interface and verifying that effects are visually grouped into the
four specified categories with emoticons in the correct order. Delivers value even if color coding isn't implemented yet.

**Acceptance Scenarios**:

1. **Given** I am viewing the effect filter interface, **When** I look at the available effects, **Then** I see effects organized into four
   distinct category groups
2. **Given** I am viewing the categorized effects, **When** I scan the categories, **Then** they appear in this specific order: 1. Mood &
   Energy (⚡), 2. Cognitive & Mental Enhancement (🧠), 3. Relaxation & Anxiety Management (😌), 4. Physical & Physiological Management (💪)
3. **Given** I am viewing each category, **When** I look at the category header, **Then** I see a Material emoticon displayed alongside the
   category name (⚡ for energy, 🧠 for cognitive, 😌 for relaxation, 💪 for physical)
4. **Given** I am viewing the Mood & Energy category, **When** I review the effects, **Then** I see only energy-related effects (Energizing,
   Mood enhancing, Mood stabilizing, Uplifting)
5. **Given** I am viewing the Cognitive & Mental Enhancement category, **When** I review the effects, **Then** I see only cognitive-related
   effects (Alertness, Cognitive enhancement, Focus, Memory-enhancement)
6. **Given** I am viewing the Relaxation & Anxiety Management category, **When** I review the effects, **Then** I see only
   relaxation-related effects (Anxiety relief, Relaxing, Sedative, Stress relief, Couch-lock)
7. **Given** I am viewing the Physical & Physiological Management category, **When** I review the effects, **Then** I see only
   physical-related effects (Anti-inflammatory, Appetite suppressant, Breathing support, Muscle relaxant, Pain relief, Seizure related)

---

### User Story 2 - Visual Category Distinction via Color Coding (Priority: P2)

As a medical cannabis user, I need each effect category to have a distinct color so that I can quickly identify which therapeutic category an
effect belongs to at a glance.

**Why this priority**: Color coding significantly enhances usability by providing instant visual recognition. While grouping (P1) provides
organization, color coding accelerates comprehension and reduces the time needed to find relevant effects.

**Independent Test**: Can be tested by examining the visual appearance of category groups and verifying each has a unique, distinguishable
color scheme. Delivers value by improving visual navigation even without filter selection functionality.

**Acceptance Scenarios**:

1. **Given** I am viewing the categorized effect filters, **When** I look at the Mood & Energy category, **Then** it displays with a
   distinct color scheme different from other categories
2. **Given** I am viewing the categorized effect filters, **When** I look at the Cognitive & Mental Enhancement category, **Then** it
   displays with a distinct color scheme different from other categories
3. **Given** I am viewing the categorized effect filters, **When** I look at the Relaxation & Anxiety Management category, **Then** it
   displays with a distinct color scheme different from other categories
4. **Given** I am viewing the categorized effect filters, **When** I look at the Physical & Physiological Management category, **Then** it
   displays with a distinct color scheme different from other categories
5. **Given** I am viewing all four categories, **When** I compare their colors, **Then** each category's color is visually distinguishable
   from the others
6. **Given** I am a user with color vision deficiency, **When** I view the categories, **Then** the colors meet WCAG 2.1 Level AA contrast
   requirements
7. **Given** I am viewing the categories, **When** I see the emoticons (⚡🧠😌💪), **Then** they provide additional visual cues beyond color
   to help me distinguish categories

---

### User Story 3 - Individual Effect Color Coding (Priority: P3)

As a medical cannabis user, I need each individual effect filter chip to display in the color of its parent category so that I can
immediately recognize which therapeutic category it belongs to while interacting with filters.

**Why this priority**: This extends color coding to individual effect interactions, providing context even when effects are selected or
viewed in isolation. While valuable for advanced usability, the feature is still functional without this level of detail.

**Independent Test**: Can be tested by clicking individual effect filter chips and verifying they inherit their category's color. Delivers
value by maintaining visual consistency throughout the user's filtering journey.

**Acceptance Scenarios**:

1. **Given** I am viewing the effect filter interface, **When** I look at an effect chip in the Mood & Energy category (e.g., "Energizing"),
   **Then** the chip displays in the Mood & Energy category color
2. **Given** I am viewing the effect filter interface, **When** I look at an effect chip in the Cognitive & Mental Enhancement category
   (e.g., "Focus"), **Then** the chip displays in the Cognitive category color
3. **Given** I am viewing the effect filter interface, **When** I look at an effect chip in the Relaxation & Anxiety Management category
   (e.g., "Stress relief"), **Then** the chip displays in the Relaxation category color
4. **Given** I am viewing the effect filter interface, **When** I look at an effect chip in the Physical & Physiological Management category
   (e.g., "Pain relief"), **Then** the chip displays in the Physical category color
5. **Given** I have selected an effect filter, **When** the chip becomes active/selected, **Then** it maintains its category color coding
   with appropriate visual feedback (e.g., darker shade or border)

---

### User Story 4 - Category-Level Filtering (Priority: P2)

As a medical cannabis user, I need to filter terpenes by entire effect categories (e.g., "show only Mood & Energy effects") so that I can
quickly narrow down terpenes based on my broad therapeutic needs without selecting individual effects.

**Why this priority**: Category-level filtering provides a faster workflow for users who know their therapeutic category but haven't
decided on specific effects. It complements individual effect selection and reduces interaction steps for broad searches.

**Independent Test**: Can be tested by selecting a category filter and verifying that only terpenes containing effects from that category
are displayed. Delivers value by providing a quick filtering shortcut even if other features aren't complete.

**Acceptance Scenarios**:

1. **Given** I am viewing the effect filter interface, **When** I look at each category header, **Then** I see a selectable control
   (checkbox or toggle) next to the category name that allows me to filter by that entire category
2. **Given** I have not selected any category filters, **When** I select the "Mood & Energy" category filter, **Then** the system displays
   only terpenes that contain at least one effect from the Mood & Energy category (Energizing, Mood enhancing, Mood stabilizing, Uplifting)
3. **Given** I have selected the "Cognitive & Mental Enhancement" category filter, **When** I review the results, **Then** I see only
   terpenes with cognitive-related effects (Alertness, Cognitive enhancement, Focus, Memory-enhancement)
4. **Given** I have selected multiple category filters (e.g., "Mood & Energy" and "Relaxation & Anxiety Management"), **When** I view the
   results, **Then** I see terpenes that contain effects from ANY of the selected categories (OR logic)
5. **Given** I have selected a category filter, **When** I also select individual effect filters within that category, **Then** the system
   applies both filters using AND logic (terpenes must match the category AND the specific effects)
6. **Given** I have active category filters, **When** I deselect a category filter, **Then** the terpene results update immediately to
   remove that category's constraint
7. **Given** I have selected a category filter, **When** I view the filter interface, **Then** the category filter control displays visual
   feedback (e.g., checked state, highlight) indicating it is active

---

### Edge Cases

- What happens when a new effect needs to be added that doesn't clearly fit into one of the four categories?
- How does the system handle users with different color vision capabilities (colorblind users)?
- What happens when viewing the interface on small mobile screens where category grouping might need to be collapsed?
- How does the system maintain color coding and emoticon consistency when effects are displayed in different UI contexts (filter panel,
  terpene detail cards, search results)?
- What happens if category display order needs to be customizable per user preference in the future?
- What happens if emoticons don't render properly on older browsers or devices?
- How does the system ensure emoticons are accessible to screen reader users?
- What happens when a user selects a category filter but then deselects all individual effects within that category?
- How should the system handle conflicting filter logic when category filters and individual effect filters interact?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST organize all 19 effects into exactly four categories as defined in
  `docs/effect-categorization.md`:
  - Mood & Energy (⚡)
  - Cognitive & Mental Enhancement (🧠)
  - Relaxation & Anxiety Management (😌)
  - Physical & Physiological Management (💪)
- **FR-002**: System MUST display categories in this fixed order: 1. Mood & Energy, 2. Cognitive & Mental Enhancement, 3. Relaxation &
  Anxiety Management, 4. Physical & Physiological Management
- **FR-003**: System MUST assign effects to categories according to the mapping defined in `docs/effect-categorization.md`:
  - **Mood & Energy**: Energizing, Mood enhancing, Mood stabilizing, Uplifting (4 effects)
  - **Cognitive & Mental Enhancement**: Alertness, Cognitive enhancement, Focus, Memory-enhancement (4 effects)
  - **Relaxation & Anxiety Management**: Anxiety relief, Relaxing, Sedative, Stress relief, Couch-lock (5 effects)
  - **Physical & Physiological Management**: Anti-inflammatory, Appetite suppressant, Breathing support, Muscle relaxant, Pain relief,
    Seizure related (6 effects)
- **FR-004**: System MUST display a Material Emoticon icon for each category that represents its therapeutic purpose:
  - ⚡ for Mood & Energy (daytime energizing effects)
  - 🧠 for Cognitive & Mental Enhancement (daytime cognitive effects)
  - 😌 for Relaxation & Anxiety Management (evening/nighttime relaxation effects)
  - 💪 for Physical & Physiological Management (therapeutic physical effects)
  - The emoticon MUST be displayed alongside the category name in the filter interface
- **FR-004a**: If emoticon fails to render, system MUST display category initial letter as fallback
  (M for Mood & Energy, C for Cognitive, R for Relaxation, P for Physical)
- **FR-004b**: System MUST provide custom ARIA labels for category emoticons that describe the therapeutic context
  (e.g., "Mood and Energy category" for ⚡, not "high voltage sign")
- **FR-005**: System MUST assign a unique, distinct color to each of the four effect categories
- **FR-006**: Category colors MUST meet WCAG 2.1 Level AA contrast requirements (4.5:1 ratio) for accessibility
- **FR-007**: System MUST apply the category color to all effect filter chips belonging to that category
- **FR-008**: System MUST maintain color coding consistency across the filter panel interface where effects are displayed
- **FR-009**: System MUST visually group effects by category in the filter interface with category headers displaying
  the category name and emoticon, separated by dividing lines or spacing between groups
- **FR-010**: Each effect MUST belong to exactly one category (no effect can appear in multiple categories)
- **FR-011**: Category grouping, colors, and emoticons MUST persist across user sessions and theme changes (light/dark mode)
- **FR-012**: On small mobile screens (320px-480px), system MUST implement collapsible accordions where users can tap category headers to
  expand/collapse individual categories
- **FR-013**: System MUST provide a selectable control (checkbox or toggle) for each category header that enables category-level filtering
- **FR-014**: When a category filter is selected, system MUST display only terpenes containing at least one effect from that category
- **FR-015**: When multiple category filters are selected, system MUST apply OR logic (show terpenes matching ANY selected category)
- **FR-016**: When both category filters and individual effect filters are active, system MUST apply OR logic (show terpenes matching
  category filters OR individual effect filters, union of both filter types)
- **FR-017**: System MUST provide immediate visual feedback when a category filter is activated (checked state, highlight, or similar)
- **FR-018**: System MUST update terpene results immediately when category filters are selected or deselected
- **FR-019**: When a user manually deselects all individual effects within an active category filter, system MUST automatically deselect
  the category filter and update results immediately to maintain filter state consistency

### Key Entities

- **Effect Category**: Represents a therapeutic classification grouping
  - Attributes: name, display order, color scheme, emoticon, member effects, usage timing (daytime/evening/therapeutic)
  - Relationships: Contains multiple Effect entities
  - Categories: Mood & Energy (⚡ lightning bolt), Cognitive & Mental Enhancement (🧠 brain),
    Relaxation & Anxiety Management (😌 relieved face),
    Physical & Physiological Management (💪 flexed biceps)

- **Effect**: Individual therapeutic effect that users can filter by
  - Attributes: name, display name, parent category
  - Relationships: Belongs to exactly one Effect Category

## Success Criteria _(mandatory)_

### Measurable Outcomes (Implementation Validation)

- **SC-004**: Category colors and emoticons are distinguishable by users with common color vision deficiencies (deuteranopia, protanopia)
- **SC-006**: Zero visual accessibility violations related to color contrast in automated WCAG 2.1 testing
- **SC-007**: Category grouping with emoticons remains visually coherent on screen sizes from 320px (mobile) to 2560px (desktop)
- **SC-008**: Emoticons render correctly in at least 95% of modern browsers (Chrome, Firefox, Safari, Edge) across desktop and mobile
  platforms

### Post-Launch Metrics (User Testing)

The following criteria require user testing and baseline measurements after deployment:

- **SC-001**: Users can identify which category an effect belongs to within 2 seconds of viewing the filter interface using either color or
  emoticon cues
- **SC-002**: 95% of users correctly associate effects with their therapeutic categories in usability testing
- **SC-003**: Time to select relevant effect filters reduces by 30% compared to current uncategorized implementation
- **SC-005**: User satisfaction score for "finding relevant effects" increases by at least 40% in post-implementation surveys
- **SC-009**: Users can successfully filter by effect category with 95% accuracy in usability testing
- **SC-010**: Category-level filtering reduces time to find relevant terpenes by at least 40% compared to individual effect selection for
  broad therapeutic searches

## Assumptions _(mandatory)_

- The 19 effects and their therapeutic categorizations are defined in `docs/effect-categorization.md` within this feature spec directory
- Effect categorization is fixed; new effects require specification update and cannot be dynamically assigned to categories
- The existing effect filter UI component is modular enough to support category-based grouping and emoticon display
- Users are familiar with standard filter UI patterns (chips, checkboxes, or similar selection controls)
- The four category names and emoticons are intuitive for the target medical cannabis user audience
- Material emoticons (⚡🧠😌💪) render consistently across modern browsers and devices
- Both light and dark theme support already exists in the application
- Color palettes are already established in the design system (referencing Material UI palette per existing codebase)
- Category emoticons serve both aesthetic and functional purposes (helping colorblind users distinguish categories)

## Dependencies _(optional)_

- **Completed Feature**: Database normalization (PR #30) must be merged, as it defines the 19 standardized effects
- **Documentation**: Effect categorization is documented in `specs/003-categorized-effect-filters/docs/effect-categorization.md`
- **Existing Component**: Effect filter component (`FilterControls.tsx`) provides the foundation for enhancement
- **Design System**: Material UI color palette and theming system provides the color infrastructure
- **Accessibility Framework**: WCAG 2.1 compliance requirements are already enforced project-wide

## Out of Scope _(optional)_

- Customizing category order per user preference (fixed order is required)
- Adding new categories beyond the specified four
- Allowing effects to belong to multiple categories simultaneously
- User-definable color schemes for categories (colors will be system-defined)
- Internationalization of category names (will use existing i18n infrastructure if already present)

## Clarifications

### Session 2025-10-26

- Q: How should categories be visually separated in the filter interface? → A: Category headers with dividing lines or spacing between groups
- Q: What should display if an emoticon fails to render? → A: Display category initial letter (M, C, R, P)
- Q: How should screen readers announce the category emoticons? → A: Provide custom ARIA labels that describe the therapeutic context
  (e.g., "Mood and Energy category" instead of "high voltage sign")
- Q: How should the system determine category colors? → A: Define category-specific color tokens in the theme configuration that map to
  Material UI palette colors, allowing theme-aware color selection
- Q: How should category grouping adapt on small mobile screens (320px-480px)? → A: Use collapsible accordions where users can tap category
  headers to expand/collapse individual categories
- Q: When a user activates a category filter but then manually deselects all individual effects within that category, what should happen?
  → A: Automatically deselect the category filter when all its individual effects are deselected; update results immediately
- Q: When a user selects a category filter AND individual effect filters from DIFFERENT categories, how should the system resolve this?
  → A: Combine using OR logic: show terpenes matching category filters OR individual effect filters (union of both filter types)
