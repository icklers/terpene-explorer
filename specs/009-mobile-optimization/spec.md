# Feature Specification: Mobile Optimization

**Feature Branch**: `009-mobile-optimization`  
**Created**: 2025-11-01  
**Status**: Draft  
**Input**: User description: "The app requires to be usable on mobile. Transform Terpene Explorer from a desktop-first web application into a best-in-class mobile experience that rivals native applications, addressing critical mobile usability issues while maintaining the existing desktop experience."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Quick Terpene Lookup on Mobile (Priority: P1)

A mobile user wants to quickly look up a specific terpene while on the go, view its key properties in an easy-to-read format, and share the information with someone.

**Why this priority**: This is the most common use case for mobile users and represents the core value proposition. Without this working smoothly, the app has no mobile viability.

**Independent Test**: Can be fully tested by opening the app on a mobile device, searching for a terpene, viewing its details in a card format without horizontal scrolling, and using the native share feature to share the information.

**Acceptance Scenarios**:

1. **Given** user opens app on smartphone (360-430px width), **When** they view the terpene list, **Then** all content fits within viewport width with no horizontal scrolling required
2. **Given** user browses terpene list, **When** they tap any terpene card, **Then** card provides visual feedback within 100ms and all touch targets are minimum 44x44px
3. **Given** user views terpene card, **When** they read the information, **Then** terpene name, aroma, and top 3 effects are clearly visible without expanding
4. **Given** user taps a terpene card, **When** detail modal opens, **Then** it slides up from bottom in under 300ms and displays in full-screen on mobile
5. **Given** user views terpene details in modal, **When** they swipe down from top, **Then** modal closes smoothly and returns to previous view
6. **Given** user wants to share terpene information, **When** they tap share button in detail modal, **Then** native mobile share dialog appears with app-appropriate content

---

### User Story 2 - Effect-Based Filtering on Mobile (Priority: P2)

A mobile user wants to discover terpenes based on therapeutic effects they're seeking, using an intuitive mobile-friendly filter interface that doesn't clutter the screen.

**Why this priority**: Filtering is a core discovery feature but secondary to basic browsing. Users must be able to browse before filtering becomes valuable.

**Independent Test**: Can be fully tested by opening the filter interface via a floating action button, selecting effect categories without precision challenges, and seeing filtered results update in real-time.

**Acceptance Scenarios**:

1. **Given** user views terpene list, **When** they look for filter access, **Then** a floating action button (FAB) is visible in bottom-right corner with filter icon and active filter count badge
2. **Given** user taps filter FAB, **When** bottom sheet opens, **Then** it slides up from bottom with drag handle visible and doesn't cover entire screen initially
3. **Given** filter bottom sheet is open, **When** user views filter options, **Then** effects are organized by categories (Mood/Energy, Cognitive, Relaxation, Physical) with clear visual separation
4. **Given** user selects effect filters, **When** they make selections, **Then** results count preview updates immediately showing "X terpenes match"
5. **Given** user applies filters, **When** bottom sheet closes, **Then** FAB badge shows active filter count and filtered results display in card grid
6. **Given** user wants to close filter sheet, **When** they swipe down on drag handle or tap outside sheet, **Then** sheet closes smoothly without applying changes
7. **Given** user has active filters, **When** they tap "Clear All" button, **Then** all filters reset and full terpene list displays

---

### User Story 3 - Mobile Navigation and Settings Access (Priority: P3)

A mobile user wants to access app settings, switch language, toggle theme, and navigate the app using a mobile-optimized header that doesn't waste precious screen space.

**Why this priority**: Essential for usability but less critical than core browsing and filtering features. Users need content access first, settings second.

**Independent Test**: Can be fully tested by accessing the hamburger menu, navigating to settings, changing preferences, and verifying the interface responds appropriately on mobile viewports.

**Acceptance Scenarios**:

1. **Given** user opens app on mobile, **When** they view the header, **Then** it displays hamburger menu (left), app logo (center), and settings icon (right) with all touch targets ≥ 44px
2. **Given** user taps hamburger menu, **When** navigation drawer opens, **Then** it slides in from left with app branding, navigation links, and language switcher clearly visible
3. **Given** user taps settings icon, **When** settings bottom sheet opens, **Then** theme toggle and language selector are accessible with large, easy-to-tap controls
4. **Given** user changes theme in settings, **When** they toggle dark mode, **Then** app transitions smoothly to dark theme within 200ms with no flash of unstyled content
5. **Given** user switches language, **When** they select German or English, **Then** all visible text updates immediately including terpene names, effects, and UI labels

---

### User Story 4 - Progressive Web App Installation (Priority: P4)

A mobile user wants to install the app to their home screen for quick access, use it offline when network is unavailable, and have a native app-like experience.

**Why this priority**: Enhances user experience significantly but requires core functionality to be working first. This is a retention and engagement feature.

**Independent Test**: Can be fully tested by triggering PWA install prompt, adding app to home screen, verifying offline functionality, and confirming service worker caching.

**Acceptance Scenarios**:

1. **Given** user visits app on supported mobile browser, **When** they interact for 30 seconds, **Then** browser may show install prompt (if browser supports it)
2. **Given** user installs PWA to home screen, **When** they launch from home screen icon, **Then** app opens in standalone mode without browser UI
3. **Given** user has app installed, **When** they lose network connection, **Then** previously viewed terpene data remains accessible with clear offline indicator
4. **Given** user is offline, **When** they attempt to access new data, **Then** appropriate offline message displays explaining limited functionality
5. **Given** app is installed, **When** user views splash screen on launch, **Then** branded splash screen displays with app icon and colors

---

### User Story 5 - Touch-Optimized Gestures and Interactions (Priority: P5)

A mobile user expects native app-like gestures such as pull-to-refresh, smooth scrolling, haptic feedback on interactions, and intuitive swipe gestures throughout the app.

**Why this priority**: Polish feature that significantly improves perceived quality but not essential for basic functionality. Enhances user delight after core features work.

**Independent Test**: Can be fully tested by performing swipe gestures, pull-to-refresh actions, and verifying haptic feedback on supported devices.

**Acceptance Scenarios**:

1. **Given** user is viewing terpene list, **When** they pull down from top of list, **Then** refresh animation appears and content reloads (even if data hasn't changed)
2. **Given** user opens detail modal, **When** they swipe down with moderate velocity, **Then** modal closes smoothly with physics-based animation
3. **Given** user taps interactive elements, **When** device supports haptics, **Then** subtle haptic feedback provides tactile confirmation
4. **Given** user scrolls through long content, **When** they scroll quickly, **Then** scroll momentum feels natural with smooth 60fps performance
5. **Given** user navigates between views, **When** transitions occur, **Then** animations respect prefers-reduced-motion setting for accessibility

---

### Edge Cases

- What happens when user rotates device from portrait to landscape mid-interaction?
  - All layouts adapt responsively without losing scroll position or interaction state
  - Modal remains open with adjusted dimensions
  - Bottom sheets adjust height appropriately

- How does system handle very small screens (< 360px width)?
  - App maintains usability with adjusted font sizes and spacing
  - Touch targets never fall below 44px minimum
  - Content remains readable with appropriate text wrapping

- What happens when user has very large font size set (accessibility)?
  - Text scales appropriately using relative units
  - Touch targets grow proportionally
  - Layout adjusts to prevent overflow
  - Horizontal scrolling remains prohibited

- How does app behave on slow 3G network?
  - Loading states display immediately to indicate activity
  - Critical content prioritized in loading order
  - Progressive enhancement ensures basic functionality works
  - Timeout handling prevents infinite loading states

- What happens when JavaScript fails to load or is disabled?
  - Basic HTML content remains accessible
  - Appropriate fallback message displays
  - No broken interactive elements visible

- How does app handle rapid repeated taps (double-tap protection)?
  - Event handlers debounce rapid interactions
  - Modal/sheet cannot be opened multiple times simultaneously
  - Button states disable during loading to prevent duplicate actions

- What happens when user has very long custom effect descriptions?
  - Text truncates with ellipsis in card view
  - Full text visible in expanded detail modal
  - "Show more" interaction if needed

- How does app respond when user denies permissions (location, notifications)?
  - App continues to function normally
  - No persistent permission prompts
  - Settings provide clear path to enable if desired

## Requirements _(mandatory)_

### Functional Requirements

#### Layout & Viewport Management

- **FR-001**: System MUST eliminate all horizontal scrolling on viewports from 280px to 430px width (smartphones)
- **FR-002**: System MUST provide card-based layout for terpene browsing that vertically scrolls only
- **FR-003**: System MUST adapt layouts responsively for tablet viewports (600px - 1024px) while maintaining mobile optimizations
- **FR-004**: System MUST maintain existing desktop experience unchanged for viewports ≥ 1024px width
- **FR-005**: System MUST handle orientation changes (portrait ↔ landscape) without breaking layout or losing interaction state

#### Touch Interaction Standards

- **FR-006**: System MUST ensure all interactive elements have minimum touch targets: 44px minimum per WCAG 2.1 AA, 48px recommended for primary action buttons, 56px for floating action buttons (FAB)
- **FR-007**: System MUST provide minimum 8px spacing between adjacent tappable elements
- **FR-008**: System MUST show visual feedback within 100ms of touch interaction (scale to 0.98, increase shadow elevation from 1 to 4, duration 200ms)
- **FR-009**: System MUST provide haptic feedback on supported devices for primary interactions (card tap, modal open/close, filter apply, share button) using Vibration API with graceful degradation when unsupported
- **FR-010**: System MUST implement debouncing to prevent accidental double-taps

#### Navigation & Header

- **FR-011**: System MUST display mobile-optimized header with hamburger menu (left), app logo (center), and three-dot vertical menu icon (⋮) for settings access (right); all touch targets ≥44x44px
- **FR-012**: System MUST implement slide-in navigation drawer (bottom sheet) triggered by hamburger menu
- **FR-013**: System MUST provide settings bottom sheet for theme toggle and language selection
- **FR-014**: System MUST collapse header on scroll-down and expand on scroll-up (iOS Safari pattern) while keeping FAB and essential controls visible
- **FR-015**: (Merged with FR-014 - sticky controls maintained via FAB during header collapse)

#### Content Display - Terpene Cards

- **FR-016**: System MUST display terpenes in card grid format with consistent sizing
- **FR-017**: System MUST show terpene name, aroma description, and top 3 effects on each card
- **FR-018**: System MUST indicate additional effects with "+X more" badge when effects exceed 3
- **FR-019**: System MUST make entire card tappable with visible pressed state
- **FR-020**: System MUST maintain card minimum height of 120px for consistent grid layout

#### Content Display - Detail Modal

- **FR-021**: System MUST open terpene details in full-screen modal on mobile viewports (< 600px)
- **FR-022**: System MUST implement slide-up entrance animation for modal (max 300ms duration)
- **FR-023**: System MUST provide close button (top-left) and share button (top-right) in modal header
- **FR-024**: System MUST support swipe-down gesture to close modal with visual feedback
- **FR-025**: System MUST organize modal content in scrollable sections: header, effects, taste/aroma, description, therapeutic properties, sources
- **FR-026**: System MUST display effect badges with category colors in detail view

#### Filter Interface

- **FR-027**: System MUST provide floating action button (FAB) for filter access in bottom-right corner with 56x56px touch target
- **FR-028**: System MUST show active filter count badge on FAB when filters are applied
- **FR-029**: System MUST implement bottom sheet for filter interface with drag handle
- **FR-030**: System MUST organize filters by effect categories: Mood/Energy, Cognitive, Relaxation, Physical
- **FR-031**: System MUST show real-time results count preview as user selects filters ("X terpenes match")
- **FR-032**: System MUST support swipe-down on drag handle to close bottom sheet
- **FR-033**: System MUST allow tap-outside-sheet to close bottom sheet without applying changes
- **FR-034**: System MUST provide "Clear All" button to reset all filters
- **FR-035**: System MUST provide "Apply" button in sticky footer to apply filter selections

#### Gesture System

- **FR-036**: System MUST implement swipe-down gesture to close modals and bottom sheets
- **FR-037**: System MUST provide pull-to-refresh gesture on main terpene list with loading indicator
- **FR-038**: System MUST implement smooth, physics-based animations for gesture interactions using spring animations (damping ratio 0.8, stiffness 300) or Material Design motion specifications
- **FR-039**: System MUST ensure gestures don't conflict with system-level gestures: iOS swipe-back navigation, Android navigation gestures, browser pull-to-refresh (disable when app handles it)
- **FR-040**: System MUST provide visual feedback during gesture interactions: modal opacity reduces proportionally to drag distance during swipe-to-close

#### Typography & Readability

- **FR-041**: System MUST use minimum 16px base font size on mobile viewports
- **FR-042**: System MUST implement fluid typography scaling using CSS clamp() for responsive sizing
- **FR-043**: System MUST maintain 1.5-1.6 line height for body text readability
- **FR-044**: System MUST establish clear heading hierarchy using clamp(): H1 (clamp(2rem, 5vw, 2.5rem) = 32-40px), H2 (clamp(1.75rem, 4vw, 2rem) = 28-32px), H3 (clamp(1.5rem, 3.5vw, 1.75rem) = 24-28px)
- **FR-045**: System MUST ensure text line length stays within optimal reading range by applying max-width: 65ch on body text containers

#### Color & Contrast

- **FR-046**: System MUST maintain existing brand colors (forest green #4caf50, vibrant orange #ffb300)
- **FR-047**: System MUST ensure all text meets WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **FR-048**: System MUST maintain category color coding: Orange (Mood/Energy), Purple (Cognitive), Blue (Relaxation), Green (Physical)
- **FR-049**: System MUST optimize dark mode for OLED displays with very dark grey (#121212) background
- **FR-050**: System MUST ensure focus indicators have minimum 3:1 contrast against adjacent colors

#### Animation & Transitions

- **FR-051**: System MUST limit animation durations to 200-300ms for most transitions
- **FR-052**: System MUST use GPU-accelerated properties only (transform, opacity) for performance
- **FR-053**: System MUST respect prefers-reduced-motion media query for accessibility
- **FR-054**: System MUST use ease-out easing for entrance animations, ease-in for exit animations
- **FR-055**: System MUST maintain 60fps frame rate during all animations and transitions

#### Progressive Web App

- **FR-056**: System MUST implement service worker for offline functionality
- **FR-057**: System MUST provide valid PWA manifest file with app metadata and icons
- **FR-058**: System MUST support installation to home screen on supported browsers
- **FR-059**: System MUST cache previously viewed terpene data for offline access
- **FR-060**: System MUST display offline indicator when network is unavailable: non-intrusive banner at top stating "You're offline. Viewing cached data." with dismiss option
- **FR-061**: System MUST provide branded splash screen for installed PWA

#### Native Integration

- **FR-062**: System MUST implement Web Share API for sharing terpene information
- **FR-063**: System MUST adapt to system theme preferences when user hasn't set app theme explicitly
- **FR-064**: System MUST provide install prompts for PWA where browser supports it (trigger after 30 seconds of engagement OR after viewing 3 terpenes)
- **FR-065**: System MUST handle orientation change events for layout adjustments

#### Performance Requirements

- **FR-066**: System MUST implement virtual scrolling for long terpene lists (> 50 items)
- **FR-067**: System MUST lazy load non-critical content (note: no images in current scope)
- **FR-068**: System MUST implement code splitting for route-based chunks
- **FR-069**: System MUST keep total initial page weight under 500KB
- **FR-070**: System MUST keep JavaScript bundle under 200KB, CSS bundle under 50KB
- **FR-071**: System MUST inline critical CSS for initial paint optimization (FCP <1.5s)

#### Accessibility Requirements

- **FR-072**: System MUST provide logical keyboard tab order through all interactive elements
- **FR-073**: System MUST show visible focus indicators (3px outline, 2px offset, minimum 3:1 contrast) on all focusable elements
- **FR-074**: System MUST use semantic HTML5 landmarks (header, nav, main, aside, footer)
- **FR-075**: System MUST provide ARIA labels on all interactive elements
- **FR-076**: System MUST implement ARIA live regions for dynamic content updates
- **FR-077**: System MUST support Escape key to close modals and bottom sheets
- **FR-078**: System MUST provide "skip to main content" link for keyboard users (visually hidden until focused)
- **FR-079**: System MUST ensure no keyboard traps in interactive components

#### Cross-Browser & Device Support

- **FR-080**: System MUST support Chrome Android 120+, Safari iOS 17+, Samsung Internet 23+, Firefox Android 121+, Edge Mobile 120+
- **FR-081**: System MUST function on smartphones (360-430px width), tablets (600-1024px width), and foldables (280-420px width)
- **FR-082**: System MUST support both portrait and landscape orientations
- **FR-083**: System MUST maintain bilingual support (English/German) on all mobile layouts

#### Data & Content Preservation

- **FR-084**: System MUST make all existing terpene data accessible through mobile interface
- **FR-085**: System MUST preserve all filtering logic from desktop version
- **FR-086**: System MUST maintain search functionality with mobile-optimized input (type="search", debouncing, mobile-friendly keyboard)
- **FR-087**: System MUST ensure no information is permanently hidden on mobile (use progressive disclosure)

### Key Entities

- **Terpene Card**: Mobile-optimized representation of a terpene with name, aroma, top 3 effects, and "+X more" indicator; minimum 120px height, full-width tappable area with 44x44px minimum touch target
  
- **Detail Modal**: Full-screen (on mobile < 600px) view containing complete terpene information including Basic/Expert view toggle (from 008-therapeutic-modal-refactor), categorized effects, therapeutic properties badge chips, and natural sources; supports swipe-to-close gesture

- **Filter Bottom Sheet**: Mobile interface with drag handle, category-organized effect filters, real-time results preview, clear all button, and sticky apply button in footer

- **Mobile Navigation Header**: Condensed header with hamburger menu (left), app logo (center), three-dot menu icon for settings (right); all touch targets ≥44px with appropriate spacing; collapses on scroll-down, expands on scroll-up

- **Floating Action Button (FAB)**: Circular button positioned bottom-right for filter access; displays badge with active filter count; 56x56px touch target

- **Effect Category Badge**: Color-coded chip indicating effect category (Orange/Purple/Blue/Green) and effect name; used in both card summaries and detail modals; inherits from 008-therapeutic-modal-refactor

- **Navigation Bottom Sheet**: Slide-in bottom panel containing app navigation links, branding, and language switcher; triggered by hamburger menu

- **Settings Bottom Sheet**: Bottom sheet for theme toggle and language selection with large, easy-to-tap controls (≥48px)

- **PWA Manifest**: Configuration defining app metadata, icons, theme colors, display mode for installed progressive web app

- **Service Worker**: Background script managing offline caching, network request handling, and PWA lifecycle

## Success Criteria _(mandatory)_

### Measurable Outcomes

#### Usability Metrics

- **SC-001**: Users can browse and interact with terpene information without any horizontal scrolling on devices with 360px to 430px viewport width
- **SC-002**: 100% of interactive elements meet or exceed minimum touch target sizes (44px minimum, 48px for primary buttons, 56px for FAB)
- **SC-003**: Users receive visual feedback within 100 milliseconds of any touch interaction
- **SC-004**: Users can complete terpene lookup task (open app → search/scroll to find specific terpene → view details → close modal) in under 30 seconds on mobile device
- **SC-005**: 85% or more of users successfully complete primary tasks (browse, filter, view details) on first attempt without assistance

#### Engagement Metrics

- **SC-006**: Mobile session duration increases to average 2 minutes or more per visit
- **SC-007**: Mobile bounce rate decreases to below 30% of visitors
- **SC-008**: Users view 3 or more terpene cards per session on average
- **SC-009**: Time to first meaningful interaction reduces to under 2 seconds

#### Performance Metrics

- **SC-011**: Google Lighthouse mobile performance score reaches 90 or above
- **SC-012**: First Contentful Paint occurs in under 1.5 seconds on 3G network
- **SC-013**: Largest Contentful Paint occurs in under 2.5 seconds on 3G network
- **SC-014**: Time to Interactive achieved in under 5 seconds on 3G network
- **SC-015**: Cumulative Layout Shift score stays below 0.1
- **SC-016**: Total Blocking Time remains under 300 milliseconds
- **SC-017**: All animations and scrolling maintain 60 frames per second

#### Accessibility Metrics

- **SC-018**: App achieves 100% WCAG 2.1 Level AA compliance
- **SC-019**: All color contrast ratios meet or exceed 4.5:1 for normal text and 3:1 for large text
- **SC-020**: Screen reader users can navigate and access all features without assistance
- **SC-021**: Keyboard-only users can access all functionality without mouse/touch
- **SC-022**: 100% of interactive elements provide visible focus indicators with 3:1 contrast minimum

#### Quality Metrics

- **SC-023**: Zero instances of horizontal scrolling detected in production across supported viewports
- **SC-024**: Zero critical bugs affecting mobile usability in production
- **SC-025**: App functions correctly on Chrome Android, Safari iOS, Samsung Internet, Firefox Android, and Edge Mobile
- **SC-026**: No regression in desktop functionality - all existing features work as before
- **SC-027**: Support ticket volume related to mobile usability decreases by 50% or more

#### Adoption Metrics

- **SC-028**: Progressive Web App can be installed to home screen on supported devices
- **SC-029**: Mobile traffic to the application increases by 30% or more within 60 days of launch
- **SC-030**: User retention on mobile improves by 25% compared to pre-optimization baseline
- **SC-031**: App receives user satisfaction rating of 4.5 or higher out of 5 stars from mobile users
- **SC-032**: Percentage of users who complete full terpene detail view increases by 40%

## Assumptions _(mandatory)_

### Technical Assumptions

- **TECH-001**: Users have modern mobile browsers released in 2023 or later (Chrome 120+, Safari 17+, Samsung Internet 23+, Firefox 121+, Edge 120+)
- **TECH-002**: Users have JavaScript enabled in their browsers
- **TECH-003**: Users have network connectivity of at least 3G speeds (minimum 400kbps)
- **TECH-004**: Users' devices support CSS Grid, Flexbox, and modern CSS features (custom properties, clamp)
- **TECH-005**: Users' browsers support ES2022 JavaScript features
- **TECH-006**: Users have devices with touch input capability
- **TECH-007**: Service Worker API is supported for PWA functionality

### User Behavior Assumptions

- **USER-001**: Majority of mobile users access app for quick lookups rather than extended research sessions
- **USER-002**: Mobile users expect native app-like interactions (gestures, smooth animations)
- **USER-003**: Mobile users prefer vertical scrolling over horizontal scrolling
- **USER-004**: Users will install PWA if installation provides clear value and is prompted appropriately
- **USER-005**: Users accept standard web permissions (storage for theme preferences, cache for offline)
- **USER-006**: Users on mobile are comfortable with bottom sheet and modal UI patterns
- **USER-007**: Users expect instant visual feedback when interacting with touch interfaces

### Content Assumptions

- **CONTENT-001**: Existing terpene database structure remains unchanged
- **CONTENT-002**: All terpene data can be effectively displayed in card format with progressive disclosure
- **CONTENT-003**: Top 3 effects are sufficient for card preview; additional effects shown on demand
- **CONTENT-004**: Bilingual support (English/German) remains a requirement for mobile
- **CONTENT-005**: Effect categorization into 4 categories (Mood/Energy, Cognitive, Relaxation, Physical) is adequate for mobile filtering

### Design Assumptions

- **DESIGN-001**: Existing brand colors (forest green, vibrant orange) work well on mobile interfaces
- **DESIGN-002**: Dark theme is preferred by significant portion of mobile users
- **DESIGN-003**: Material Design 3 patterns align well with user expectations for mobile interfaces
- **DESIGN-004**: Category color coding (Orange, Purple, Blue, Green) provides sufficient visual distinction
- **DESIGN-005**: 44x44px touch target minimum meets user needs for comfortable interaction

### Resource Assumptions

- **RESOURCE-001**: Development can be completed within 3-week timeline (120 hours total)
- **RESOURCE-002**: Testing devices covering iOS and Android platforms are available
- **RESOURCE-003**: Team has expertise in React, Material UI, PWA development, and mobile optimization
- **RESOURCE-004**: No significant changes to backend or data structure are required
- **RESOURCE-005**: Budget of $13,500 - $21,000 is adequate for development, testing, and tools

### Scope Assumptions

- **SCOPE-001**: Desktop experience remains untouched and fully functional
- **SCOPE-002**: Mobile optimization focuses on viewports 280px - 1024px
- **SCOPE-003**: Phase 1-3 features from design brief are all in scope for this feature
- **SCOPE-004**: Future enhancements (voice search, AR, native apps, accounts) are explicitly out of scope
- **SCOPE-005**: Existing filtering logic and search functionality are preserved, only UI is adapted

### Performance Assumptions

- **PERF-001**: Terpene database size remains manageable for client-side filtering (< 200 entries)
- **PERF-002**: Virtual scrolling becomes necessary only when list exceeds 50 items
- **PERF-003**: Initial page load optimization can achieve < 500KB total weight
- **PERF-004**: Modern mobile devices (2020+) have sufficient processing power for smooth animations
- **PERF-005**: Service worker caching won't cause excessive storage usage on user devices

## Dependencies

### External Dependencies

- **DEP-001**: Material UI 6.3+ components with mobile-optimized variants
- **DEP-002**: React 19.2+ with concurrent features for smooth transitions
- **DEP-003**: Emotion 11.13+ for styled components and theme integration
- **DEP-004**: Vite 6.0+ build tooling with mobile optimization plugins
- **DEP-005**: Workbox or similar for service worker generation and PWA tooling
- **DEP-006**: TypeScript 5.7+ for type safety throughout mobile components

### Internal Dependencies

- **DEP-007**: Existing dark theme implementation (003-dark-theme-design)
- **DEP-008**: Existing bilingual data support (006-bilingual-data-support)
- **DEP-009**: Existing effect categorization system (003-categorized-effect-filters)
- **DEP-010**: Existing terpene data model and JSON structure (002-terpene-data-model)
- **DEP-011**: Existing table/filter functionality to be adapted (005-table-filter-bar)
- **DEP-012**: Existing i18next localization setup (006-bilingual-data-support)
- **DEP-013**: **CRITICAL**: Therapeutic modal refactor (008-therapeutic-modal-refactor) — Mobile optimization MUST build on the refactored modal with Basic/Expert views, categorized effects, and therapeutic properties. Mobile enhancements add full-screen mode, swipe gestures, and share functionality WITHOUT breaking the therapeutic-focused design.

### Browser API Dependencies

- **DEP-014**: Web Share API for native sharing functionality
- **DEP-015**: Service Worker API for offline support and PWA
- **DEP-016**: Cache API for storing terpene data offline
- **DEP-017**: Vibration API for haptic feedback (graceful degradation)
- **DEP-018**: matchMedia API for responsive breakpoints and theme detection
- **DEP-019**: IntersectionObserver API for lazy loading and virtual scrolling

## Constraints

### Technical Constraints

- **CONST-001**: Must maintain TypeScript 5.7+ type safety throughout
- **CONST-002**: Must use existing React 19.2+ architecture without major refactoring
- **CONST-003**: Must work within Material UI 6.3+ component library constraints
- **CONST-004**: Must support Node.js 24 LTS build environment
- **CONST-005**: Must maintain ES2022 target for compatibility
- **CONST-006**: Cannot introduce breaking changes to existing desktop functionality

### Browser Support Constraints

- **CONST-007**: Must support Chrome Android 120+ (released late 2023)
- **CONST-008**: Must support Safari iOS 17+ (released September 2023)
- **CONST-009**: Must support Samsung Internet 23+ (released 2024)
- **CONST-010**: Must support Firefox Android 121+ (released late 2023)
- **CONST-011**: Must support Edge Mobile 120+ (released late 2023)
- **CONST-012**: Cannot rely on features not available in these browser versions

### Device Support Constraints

- **CONST-013**: Must function on smartphone viewports 360px - 430px width (95th percentile coverage)
- **CONST-014**: Must support tablet viewports 600px - 1024px width
- **CONST-015**: Must accommodate foldable devices 280px - 420px width (emerging form factor)
- **CONST-016**: Must support both portrait and landscape orientations
- **CONST-017**: Must function on devices with varying pixel densities (1x to 4x)

### Design Constraints

- **CONST-018**: Must maintain existing forest green (#4caf50) as primary brand color
- **CONST-019**: Must preserve vibrant orange (#ffb300) for calls to action
- **CONST-020**: Must keep category colors: Orange (#FFB74D), Purple (#BA68C8), Blue (#64B5F6), Green (#81C784)
- **CONST-021**: Must maintain existing app logo and branding elements
- **CONST-022**: Must preserve existing icon set throughout mobile interface
- **CONST-023**: Must maintain dark theme aesthetics with #121212 background

### Content Constraints

- **CONST-024**: All existing terpene data must remain accessible (no data loss)
- **CONST-025**: No information can be permanently hidden from users
- **CONST-026**: Filtering logic must remain functionally identical to desktop
- **CONST-027**: Search functionality must be preserved and accessible
- **CONST-028**: Bilingual support (English/German) is mandatory
- **CONST-029**: Effect categorization must remain consistent with existing system

### Performance Constraints

- **CONST-030**: Total initial page weight must not exceed 500KB
- **CONST-031**: JavaScript bundle must not exceed 200KB
- **CONST-032**: CSS bundle must not exceed 50KB
- **CONST-033**: First Contentful Paint must occur within 1.5 seconds on 3G
- **CONST-034**: Time to Interactive must be achieved within 5 seconds on 3G
- **CONST-035**: All animations must maintain 60fps minimum

### Accessibility Constraints

- **CONST-036**: Must meet WCAG 2.1 Level AA compliance (non-negotiable)
- **CONST-037**: All touch targets must be minimum 44x44px (WCAG requirement)
- **CONST-038**: All text contrast must meet 4.5:1 ratio minimum (normal text)
- **CONST-039**: Large text (≥18px) must meet 3:1 contrast ratio minimum
- **CONST-040**: Focus indicators must be visible with 3:1 contrast against adjacent colors
- **CONST-041**: Must support screen readers (VoiceOver, TalkBack)

### Timeline Constraints

- **CONST-042**: Development must complete within 3 weeks maximum
- **CONST-043**: Total development time limited to 120 hours
- **CONST-044**: Weekly milestone deliverables required
- **CONST-045**: Daily progress updates expected
- **CONST-046**: Cannot extend timeline beyond 3 weeks without explicit approval

### Budget Constraints

- **CONST-047**: Total budget range: $13,500 - $21,000
- **CONST-048**: Development budget: $12,000 - $18,000
- **CONST-049**: Testing devices budget: $1,000 - $2,000
- **CONST-050**: Tools/services budget: $500 - $1,000
- **CONST-051**: Cannot exceed maximum budget without stakeholder approval

### Scope Constraints

- **CONST-052**: Voice search and control explicitly out of scope
- **CONST-053**: Augmented reality features explicitly out of scope
- **CONST-054**: Native mobile app development explicitly out of scope
- **CONST-055**: User accounts and personalization explicitly out of scope
- **CONST-056**: Social features and community explicitly out of scope
- **CONST-057**: Advanced analytics integration explicitly out of scope
- **CONST-058**: Additional language support beyond English/German explicitly out of scope
- **CONST-059**: Multi-device synchronization explicitly out of scope
- **CONST-060**: Offline-first data management (beyond basic caching) explicitly out of scope

## Risks & Mitigation

### High Priority Risks

**RISK-001: Desktop Experience Degradation**
- **Impact**: High - Could alienate existing desktop users who represent 10% of target audience
- **Probability**: Medium - Shared components may introduce unintended side effects
- **Mitigation Strategy**: 
  - Create separate mobile-specific components where necessary
  - Implement comprehensive desktop regression testing suite
  - Use responsive design breakpoints to isolate mobile-only changes
  - Test desktop experience after each mobile component addition
  - Maintain desktop smoke tests in CI/CD pipeline

**RISK-002: Performance Target Failure**
- **Impact**: High - Poor performance defeats purpose of mobile optimization
- **Probability**: Medium - Ambitious performance targets with limited bundle size
- **Mitigation Strategy**:
  - Establish performance budgets before development starts
  - Use bundle analyzer to monitor JavaScript/CSS size continuously
  - Implement code splitting for non-critical features
  - Profile components regularly during development
  - Use Lighthouse CI to catch performance regressions
  - Optimize images and lazy load non-critical assets

**RISK-003: Timeline Overrun**
- **Impact**: Medium - Budget impact and delayed value delivery
- **Probability**: Medium - Aggressive 3-week timeline with many requirements
- **Mitigation Strategy**:
  - Follow strict phased delivery approach (Week 1: Foundation, Week 2: Enhancement, Week 3: Polish)
  - Focus on MVP for each phase
  - Build buffer time into estimates
  - Identify and defer nice-to-have features to future iterations
  - Daily progress tracking and early warning system
  - Maintain clear priority ordering (P1 must-haves vs P2-P5 enhancements)

### Medium Priority Risks

**RISK-004: Browser Compatibility Issues**
- **Impact**: Medium - Some users on older browsers cannot access mobile experience
- **Probability**: Low - Targeting modern browsers (2023+) reduces risk
- **Mitigation Strategy**:
  - Use progressive enhancement approach
  - Provide polyfills for critical features
  - Implement feature detection before using advanced APIs
  - Test across all target browsers early and often
  - Provide graceful fallbacks for unsupported features
  - Document browser compatibility clearly

**RISK-005: User Confusion with New Interface**
- **Impact**: Medium - Poor adoption if users don't understand new mobile patterns
- **Probability**: Low - Using standard mobile UI patterns reduces confusion
- **Mitigation Strategy**:
  - Use familiar mobile patterns (bottom sheets, FABs, swipe gestures)
  - Provide subtle visual hints for gesture-based interactions
  - Create optional onboarding tooltips for first-time mobile users
  - Conduct user testing with target audience
  - Monitor analytics for confusion signals (rapid exits, repeated actions)
  - Provide help documentation accessible from settings

**RISK-006: Gesture Discovery Issues**
- **Impact**: Low - Users may not discover gesture-based shortcuts
- **Probability**: Medium - Gestures are secondary interaction method
- **Mitigation Strategy**:
  - Always provide button-based alternatives to gestures
  - Include subtle visual hints (drag handle on bottom sheet)
  - Add brief gesture tips in help section
  - Don't rely on gestures as only way to accomplish tasks
  - Use common gesture patterns users know from other apps
  - Track gesture usage analytics to measure discovery

**RISK-007: Accessibility Compliance Failure**
- **Impact**: High - Legal and ethical implications, excludes users
- **Probability**: Low - Clear WCAG guidelines and automated testing available
- **Mitigation Strategy**:
  - Run automated accessibility tests (axe, Lighthouse) in CI/CD
  - Manual testing with screen readers (VoiceOver, TalkBack)
  - Ensure keyboard navigation works for all features
  - Test touch target sizes with real devices
  - Verify color contrast ratios during design phase
  - Consult WCAG 2.1 AA checklist throughout development

**RISK-008: PWA Installation Friction**
- **Impact**: Low - Reduced engagement if users don't install
- **Probability**: Medium - Browser install prompts are often ignored
- **Mitigation Strategy**:
  - Provide clear value proposition for installation
  - Trigger install prompt at appropriate moment (not immediately)
  - Make app fully functional without installation
  - Don't repeatedly prompt if user declines
  - Monitor install rate and adjust strategy
  - Educate users on benefits (offline access, home screen)

### Low Priority Risks

**RISK-009: Service Worker Cache Issues**
- **Impact**: Low - Stale content or excessive storage usage
- **Probability**: Low - Established PWA patterns and tools available
- **Mitigation Strategy**:
  - Use Workbox for reliable caching strategies
  - Implement cache versioning and automatic cleanup
  - Set reasonable cache size limits
  - Provide manual cache clearing in settings
  - Monitor cache storage usage
  - Test update mechanisms thoroughly

**RISK-010: Animation Performance on Low-End Devices**
- **Impact**: Low - Reduced user experience on budget devices
- **Probability**: Low - Using GPU-accelerated properties
- **Mitigation Strategy**:
  - Only animate transform and opacity properties
  - Respect prefers-reduced-motion setting
  - Test on older devices (2-3 years old)
  - Provide option to disable animations in settings
  - Use will-change CSS property judiciously
  - Profile animation performance regularly

## Out of Scope

The following items are explicitly NOT included in this feature specification and should not be implemented as part of mobile optimization:

### Future Enhancement Features

- **Voice search and voice control** - Natural language voice commands for hands-free operation
- **Augmented reality visualization** - AR view of terpene molecular structures or plant sources
- **Native mobile app development** - iOS and Android native applications (separate from PWA)
- **User accounts and personalization** - User registration, profiles, saved preferences across devices
- **Social features and community** - User reviews, ratings, comments, sharing to social networks
- **Advanced analytics integration** - Detailed user behavior tracking, A/B testing, heat mapping
- **Push notifications** - Alerts for new terpenes, updates, or personalized recommendations
- **Offline-first architecture** - Full offline data synchronization and conflict resolution
- **Multi-device synchronization** - Syncing user data and preferences across devices
- **Advanced search with natural language** - Semantic search beyond basic keyword matching
- **Comparison tools** - Side-by-side comparison of multiple terpenes
- **Bookmarking and favorites** - User-curated lists of preferred terpenes
- **Gamification elements** - Achievements, badges, progress tracking
- **Integration with third-party services** - Calendar, health tracking, note-taking apps

### Internationalization Beyond Current Support

- **Additional languages beyond English/German** - Spanish, French, Chinese, etc.
- **Right-to-left (RTL) language support** - Arabic, Hebrew interface layouts
- **Regional content variations** - Location-specific terpene information
- **Currency and unit localization** - Beyond what's currently supported

### Advanced Technical Features

- **Real-time collaboration** - Multiple users viewing same data simultaneously
- **Advanced data visualization** - Interactive charts, graphs, 3D models
- **Machine learning recommendations** - AI-powered terpene suggestions
- **Geolocation-based features** - Finding nearby sources or dispensaries
- **Barcode/QR code scanning** - Scanning product codes for terpene lookup
- **Camera-based identification** - Image recognition of plants or products
- **Bluetooth/NFC integration** - Connecting to external devices
- **biometric authentication** - Fingerprint or face recognition login

### Content and Data Expansion

- **User-generated content** - Community contributions to terpene database
- **Dosage calculators** - Medical or therapeutic dosage recommendations
- **Interaction checking** - Drug or supplement interaction warnings
- **Medical advice features** - Health recommendations or diagnosis tools
- **E-commerce integration** - Direct purchasing of terpene products
- **Inventory management** - Tracking personal terpene collections
- **Batch tracking** - QR codes linking to specific product batches

### Platform-Specific Features

- **iOS-specific features** - HealthKit integration, Siri shortcuts, widgets
- **Android-specific features** - Quick settings tiles, app widgets, Wear OS
- **Desktop-specific enhancements** - Keyboard shortcuts, system tray, desktop notifications
- **Smart TV interfaces** - Optimized layouts for television displays
- **Smartwatch applications** - Wearable device interfaces
- **Voice assistant skills** - Alexa, Google Assistant integrations

All of these features may be considered for future releases but are not part of the current mobile optimization scope.
