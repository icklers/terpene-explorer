# Mobile Design Brief: Terpene Explorer

**Project:** Mobile Optimization Initiative  
**Version:** 1.0  
**Date:** November 1, 2025  
**Designer:** World-Class UX/UI Expert  
**Status:** For Approval

---

## Executive Summary

Transform Terpene Explorer from a desktop-first web application into a **best-in-class mobile experience** that rivals native applications.
This initiative addresses critical mobile usability issues while maintaining the existing desktop experience.

**Goal:** Deliver a mobile experience that feels native, performs excellently, and delights users through intuitive interactions and
thoughtful design.

---

## Problem Statement

### Current Situation

Terpene Explorer currently provides basic responsive design but falls short of modern mobile UX expectations:

- Users must scroll horizontally to view table data
- Interactive elements are too small for comfortable touch interaction
- Navigation feels cramped and overwhelming on small screens
- No gesture-based interactions that mobile users expect
- Missing progressive web app capabilities for installation
- Performance is not optimized for mobile networks and devices

### Business Impact

- **User Experience:** Frustrated users abandon the app within seconds
- **Engagement:** Mobile users spend significantly less time than desktop users
- **Market Opportunity:** Cannot compete with native mobile applications
- **Distribution:** Unable to distribute via app stores or home screen installation
- **Accessibility:** Fails to meet mobile touch target requirements

### User Pain Points

1. **"I can't tap the buttons accurately"** - Touch targets are too small
2. **"I have to scroll sideways to see the data"** - Horizontal scrolling required
3. **"The interface feels cluttered"** - Too much information at once
4. **"It doesn't feel like a mobile app"** - Missing native-like interactions
5. **"It's slow to load on my phone"** - Not optimized for mobile networks

---

## Design Objectives

### Primary Objectives

1. **Eliminate Horizontal Scrolling**
   - All content must fit within viewport width
   - No hidden information requiring horizontal panning
   - Vertical scrolling only for content navigation

2. **Optimize Touch Interactions**
   - All interactive elements minimum 44x44px (WCAG 2.1 AA)
   - Minimum 8px spacing between tappable elements
   - Clear visual feedback on touch
   - No reliance on hover states

3. **Streamline Information Architecture**
   - Progressive disclosure of information
   - Content prioritization for small screens
   - Clear visual hierarchy
   - Scannable layout patterns

4. **Deliver Native-Like Experience**
   - Gesture-based interactions (swipe, pull-to-refresh)
   - Bottom sheet UI patterns
   - Full-screen immersive views
   - Smooth, 60fps animations

5. **Enable Progressive Web App**
   - Installable to home screen
   - Offline functionality
   - Fast, reliable performance
   - Share API integration

### Secondary Objectives

- Maintain visual consistency with desktop version
- Preserve all existing functionality
- Support landscape and portrait orientations
- Ensure cross-browser compatibility
- Meet WCAG 2.1 Level AA accessibility standards

---

## Target Users

### Primary Personas

**Mobile-First User (70% of target)**

- Age: 25-45
- Device: Smartphone (iOS or Android)
- Context: On-the-go, quick lookups
- Needs: Fast access, clear information, easy navigation
- Pain Point: Desktop-optimized interfaces

**Tablet User (20% of target)**

- Age: 30-55
- Device: iPad or Android tablet
- Context: Relaxed browsing, research
- Needs: Comfortable reading, detailed views
- Pain Point: Interfaces that don't adapt to screen size

**Desktop User (10% of target)**

- Age: 25-65
- Device: Laptop or desktop
- Context: Deep research, data analysis
- Needs: Comprehensive data views, sorting, filtering
- Pain Point: Changes that break workflow

### User Journeys

**Journey 1: Quick Terpene Lookup**

1. User searches for specific terpene
2. Views card with key information
3. Taps to see full details
4. Shares with friend via messaging app

**Journey 2: Effect-Based Discovery**

1. User selects therapeutic effect category
2. Filters by specific effects
3. Browses terpene cards
4. Saves favorites for later

**Journey 3: In-Depth Research**

1. User opens app from home screen
2. Explores multiple terpenes
3. Compares therapeutic properties
4. References information offline

---

## Design Principles

### 1. Touch-First Design

**What:** Design for fingers, not mouse pointers

- Large, easy-to-tap targets
- Clear active states
- Generous spacing
- No precision required

### 2. Content-First Approach

**What:** Prioritize essential information

- Progressive disclosure
- Clear hierarchy
- Scannable layouts
- Hide secondary information

### 3. Performance Matters

**What:** Fast, responsive, smooth

- Load critical content first
- Optimize for 3G networks
- Smooth 60fps animations
- Minimal jank or lag

### 4. Native Feel

**What:** Match mobile platform expectations

- Bottom sheets for actions
- Swipe gestures
- Full-screen modals
- System integration

### 5. Accessibility Always

**What:** Inclusive design for all users

- WCAG 2.1 Level AA compliance
- Screen reader support
- Keyboard navigation
- Clear focus indicators

---

## Key Design Requirements

### Navigation & Information Architecture

**Header Navigation**

- **What:** Simplified mobile header that provides access to key functions
- **Must Have:**
  - Hamburger menu for navigation (left)
  - App branding/logo (center or left)
  - Settings access (right)
  - Search functionality (expandable or dedicated)
- **Must Not:**
  - Cram multiple controls into limited space
  - Use hover-dependent interactions
  - Hide essential features behind multiple taps

**Content Organization**

- **What:** Card-based layout for browsing terpenes
- **Must Have:**
  - Vertical scrolling only
  - Clear visual separation between items
  - Touch-friendly cards with adequate padding
  - Key information visible at a glance
- **Must Not:**
  - Use table layouts requiring horizontal scroll
  - Display all information at once
  - Overwhelm with dense data

**Filter System**

- **What:** Bottom sheet drawer for filtering options
- **Must Have:**
  - Floating action button (FAB) to trigger
  - Badge showing active filter count
  - Drag-to-close gesture support
  - Clear, apply, and close actions
  - Results count preview
- **Must Not:**
  - Occupy permanent screen space
  - Block content viewing
  - Require multiple steps to activate

### Touch Interaction Standards

**Touch Targets**

- **What:** All interactive elements sized for comfortable tapping
- **Minimum:** 44x44px (WCAG 2.1 AA standard)
- **Optimal:** 48x48px for primary actions
- **Spacing:** Minimum 8px between adjacent tappable elements

**Buttons & Controls**

- **What:** Clear, tappable buttons with visual feedback
- **Must Have:**
  - Active state (pressed appearance)
  - Disabled state (reduced opacity)
  - Loading state (spinner or progress)
  - Success state (confirmation feedback)
- **Visual Feedback:**
  - Immediate response to touch (< 100ms)
  - Haptic feedback where supported
  - Clear state changes

**Gestures**

- **What:** Intuitive, discoverable gesture interactions
- **Supported Gestures:**
  - Swipe down: Close modal/return to previous
  - Swipe left/right: Navigate between items (optional)
  - Pull down: Refresh content
  - Pinch: Zoom (future enhancement)
- **Must Not:**
  - Conflict with system gestures
  - Require tutorials to discover
  - Be the only way to perform actions

### Content Display Patterns

**Terpene Cards**

- **What:** Compact, scannable cards showing key terpene information
- **Must Display:**
  - Terpene name (prominent)
  - Aroma description (secondary)
  - Top 3 effects (visual chips/badges)
  - "+X more" indicator if additional effects
  - Tap target for full details
- **Card Behavior:**
  - Tap anywhere to open details
  - Visual pressed state
  - 16:9 or consistent aspect ratio
  - Minimum 120px height

**Detail Modal**

- **What:** Full-screen immersive view for complete terpene information
- **Must Have:**
  - Full-screen on mobile (< 600px)
  - Slide-up entrance animation
  - Close button (top left)
  - Share button (top right)
  - Swipe-down to close
  - Scrollable content area
- **Content Sections:**
  1. Header: Terpene name + actions
  2. Effects: Visual badges with categories
  3. Taste/Aroma: Descriptive text
  4. Description: Full details
  5. Therapeutic properties: Categorized list
  6. Sources: Natural occurrence

**Filter Interface**

- **What:** Bottom sheet with category-based filtering
- **Must Display:**
  - Drag handle indicator (top)
  - Current filter count
  - Results count preview
  - Category tabs/accordion
  - Effect chips within categories
  - AND/OR logic toggle
  - Clear all button
  - Apply button (sticky footer)
- **Interaction:**
  - Drag handle to open/close
  - Tap outside to close
  - Category expansion/collapse
  - Multi-select effects
  - Immediate results preview

### Typography & Readability

**Font Sizing**

- **What:** Responsive, readable text across all devices
- **Base Size:** 16px minimum (mobile), 14px (desktop)
- **Scale:** Fluid typography using CSS clamp()
- **Line Height:** 1.5-1.6 for body text
- **Line Length:** 45-75 characters optimal

**Hierarchy**

- **What:** Clear visual distinction between content levels
- **H1:** 28-32px (mobile), 36-40px (desktop) - Page titles
- **H2:** 24-28px (mobile), 32-36px (desktop) - Section headers
- **H3:** 20-24px (mobile), 24-28px (desktop) - Subsections
- **Body:** 16-18px (mobile), 14-16px (desktop) - Content
- **Caption:** 12-14px (mobile/desktop) - Metadata

**Font Weight**

- Light (300): Avoid on mobile (poor readability)
- Regular (400): Body text
- Medium (500): Subheadings
- Semibold (600): Primary headings, buttons
- Bold (700): Emphasis only

### Color & Contrast

**Color Palette**

- **What:** Maintain existing brand colors with mobile optimization
- **Primary:** Forest Green (#4caf50) - Brand identity
- **Secondary:** Vibrant Orange (#ffb300) - Calls to action
- **Categories:**
  - Mood/Energy: Orange (#FFB74D)
  - Cognitive: Purple (#BA68C8)
  - Relaxation: Blue (#64B5F6)
  - Physical: Green (#81C784)

**Contrast Requirements**

- **What:** WCAG 2.1 Level AA compliance
- **Text on Backgrounds:** Minimum 4.5:1 ratio
- **Large Text (≥18px):** Minimum 3:1 ratio
- **UI Components:** Minimum 3:1 ratio
- **Focus Indicators:** Minimum 3:1 ratio against adjacent colors

**Dark Mode**

- **What:** Optimized for OLED screens and low-light viewing
- **Background:** #121212 (very dark grey, not pure black)
- **Surface:** #1e1e1e (elevated surfaces)
- **Text Primary:** #ffffff (high contrast)
- **Text Secondary:** rgba(255, 255, 255, 0.70)

### Animation & Transitions

**Animation Principles**

- **What:** Smooth, purposeful motion that guides attention
- **Duration:** 200-300ms for most transitions
- **Easing:** Ease-out for entrances, ease-in for exits
- **Performance:** GPU-accelerated (transform, opacity)
- **Respect:** prefers-reduced-motion media query

**Key Animations**

- Modal entrance: Slide up from bottom (300ms)
- Modal exit: Slide down to bottom (250ms)
- Card tap: Scale down to 0.98 (100ms)
- Filter sheet: Slide up with spring physics
- Page transition: Cross-fade (200ms)
- Loading: Pulse or spinner (continuous)

**Must Not**

- Use animation durations > 500ms
- Animate layout properties (width, height, top, left)
- Ignore reduced motion preferences
- Add gratuitous animation
- Block interaction during animation

### Performance Standards

**Loading Performance**

- **What:** Fast initial load and time to interactive
- **Metrics:**
  - First Contentful Paint: < 1.5s
  - Largest Contentful Paint: < 2.5s
  - Time to Interactive: < 5s (3G network)
  - Total Blocking Time: < 300ms
  - Cumulative Layout Shift: < 0.1

**Runtime Performance**

- **What:** Smooth scrolling and interaction
- **Metrics:**
  - Frame rate: 60fps minimum
  - Input latency: < 100ms response
  - Animation jank: None visible
  - Memory usage: < 50MB on mobile
  - Battery drain: Minimal impact

**Network Optimization**

- **What:** Efficient data loading for mobile networks
- **Requirements:**
  - Total page weight: < 500KB
  - JavaScript bundle: < 200KB
  - CSS bundle: < 50KB
  - Images: WebP with fallbacks
  - Critical CSS: Inlined
  - Code splitting: Route-based

### Accessibility Requirements

**Keyboard Navigation**

- **What:** Full keyboard control for all features
- **Requirements:**
  - Logical tab order
  - Visible focus indicators (3px outline, 2px offset)
  - No keyboard traps
  - Skip to main content link
  - Esc to close modals/sheets

**Screen Reader Support**

- **What:** Complete information available to assistive technology
- **Requirements:**
  - Semantic HTML landmarks
  - ARIA labels on all interactive elements
  - ARIA live regions for dynamic content
  - Alt text on images
  - Form labels properly associated

**Touch Accessibility**

- **What:** Easy to use for users with motor impairments
- **Requirements:**
  - 44x44px minimum touch targets
  - Adequate spacing (8px minimum)
  - No time-limited interactions
  - Error tolerance (accidental taps)
  - Alternative to complex gestures

---

## Scope Definition

### In Scope (Must Deliver)

#### Phase 1: Foundation (Week 1)

1. **Mobile Navigation Header**
   - Hamburger menu implementation
   - Collapsible search bar
   - Settings bottom sheet
   - Responsive logo/branding

2. **Card-Based Layout**
   - Terpene card grid component
   - Responsive card sizing
   - Touch-optimized interactions
   - Loading and error states

3. **Full-Screen Modal**
   - Mobile-optimized detail view
   - Swipe-to-close gesture
   - Share functionality integration
   - Proper content hierarchy

4. **Touch Optimization**
   - All touch targets ≥ 44px
   - Adequate spacing (≥ 8px)
   - Clear active states
   - Haptic feedback (where supported)

#### Phase 2: Enhancement (Week 2)

5. **Filter Bottom Sheet**
   - Floating action button
   - Draggable bottom drawer
   - Filter preview and counts
   - Category-based organization

6. **Gesture System**
   - Swipe to close modals
   - Pull to refresh content
   - Smooth gesture animations
   - Visual feedback

7. **Performance Optimization**
   - Virtual scrolling for lists
   - Lazy loading of images
   - Code splitting
   - Loading optimizations

8. **Responsive Typography**
   - Fluid font scaling
   - Optimized line heights
   - Proper text hierarchy
   - Readable at all sizes

#### Phase 3: Polish (Week 3)

9. **Progressive Web App**
   - Service worker for offline
   - Install prompts
   - App manifest
   - Cache strategies

10. **Native Integration**
    - Web Share API
    - Haptic feedback
    - System theme following
    - Add to home screen

11. **Final Polish**
    - Animation refinement
    - Micro-interactions
    - Edge case handling
    - Cross-browser testing

### Out of Scope (Future Enhancements)

- Voice search and control
- Augmented reality visualization
- Native mobile app development
- User accounts and personalization
- Social features and community
- Advanced analytics integration
- Internationalization beyond English/German
- Multi-device synchronization
- Offline-first data management
- Advanced search with filters
- Comparison tools
- Bookmarking and favorites
- Push notifications

---

## Success Criteria

### User Experience Metrics

**Usability**

- Zero horizontal scrolling required
- 100% touch target compliance (≥ 44px)
- User satisfaction rating: ≥ 4.5/5 stars
- Task completion rate: ≥ 85%
- Error rate: < 5% of interactions

**Engagement**

- Mobile bounce rate: < 30%
- Average session duration: > 2 minutes
- Pages per session: > 3 pages
- Return user rate: > 40%
- Time to first interaction: < 2 seconds

### Technical Metrics

**Performance**

- Lighthouse Mobile Score: ≥ 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 300ms

**Accessibility**

- WCAG 2.1 Level AA compliance: 100%
- Screen reader compatibility: Full
- Keyboard navigation: Complete
- Color contrast ratios: All pass (≥ 4.5:1)
- Touch target sizes: 100% compliant

**Quality**

- Zero critical bugs in production
- Zero horizontal scroll instances
- Cross-browser compatibility: Chrome, Safari, Firefox, Edge
- Cross-device compatibility: iOS, Android, Tablets
- Regression: Zero desktop functionality broken

### Business Metrics

**Adoption**

- PWA installs: Track and report
- Mobile traffic: Increase by 30%
- User retention: Improve by 25%
- Positive reviews: Increase by 40%
- Support tickets: Decrease by 50%

---

## Constraints & Assumptions

### Technical Constraints

**Technology Stack**

- Must use existing React 19.2+ codebase
- Must use Material UI 6.3+ components
- Must maintain TypeScript type safety
- Must work with existing data structure
- Must support Node.js 24 LTS

**Browser Support**

- Chrome Android 120+
- Safari iOS 17+
- Samsung Internet 23+
- Firefox Android 121+
- Edge Mobile 120+

**Device Support**

- Smartphones: 360px - 430px width
- Tablets: 600px - 1024px width
- Foldables: 280px - 420px width
- Portrait and landscape orientations

### Design Constraints

**Brand Guidelines**

- Must maintain existing color palette
- Must keep forest green as primary color
- Must preserve app logo and branding
- Must use existing icon set
- Must maintain dark theme aesthetics

**Content Constraints**

- All existing terpene data must be accessible
- No information can be permanently hidden
- Filtering logic must remain intact
- Search functionality must be preserved
- Bilingual support (English/German) required

### Resource Constraints

**Timeline**

- Maximum 3 weeks for implementation
- 120 hours total development time
- Weekly milestone deliverables
- Daily progress updates

**Budget**

- Development: $12,000 - $18,000
- Testing devices: $1,000 - $2,000
- Tools/services: $500 - $1,000
- Total: $13,500 - $21,000

### Assumptions

**User Behavior**

- Users primarily access via mobile devices
- Users expect native app-like interactions
- Users value speed over visual complexity
- Users will install PWA if prompted
- Users prefer vertical scrolling

**Technical Capabilities**

- Users have modern browsers (2023+)
- Users have JavaScript enabled
- Users have decent network (3G minimum)
- Users can install PWAs on devices
- Users accept permission prompts

---

## Design Deliverables

### Phase 1 Deliverables (Week 1)

**Design Assets**

- Mobile navigation wireframes
- Card layout designs (multiple states)
- Modal designs (mobile vs desktop)
- Touch target sizing guidelines
- Interaction flow diagrams

**Documentation**

- Component specifications
- Interaction patterns
- Gesture documentation
- Accessibility guidelines
- Testing requirements

### Phase 2 Deliverables (Week 2)

**Design Assets**

- Bottom sheet UI designs
- Filter interface layouts
- Gesture animation specifications
- Loading state designs
- Error state designs

**Documentation**

- Animation timing specifications
- Performance requirements
- Integration guidelines
- Testing scenarios
- User flow updates

### Phase 3 Deliverables (Week 3)

**Design Assets**

- PWA install prompts
- Offline state designs
- Share dialog mockups
- Final polish details
- Icon and splash screens

**Documentation**

- Complete design system
- Implementation notes
- Testing results
- Known issues/limitations
- Maintenance guidelines

---

## Stakeholder Review & Approval

### Review Process

**Week 1 Review**

- **When:** End of Week 1 (Day 5)
- **What:** Foundation components demo
- **Who:** Product owner, developers, key users
- **Goal:** Validate core mobile experience
- **Decision:** Proceed to Week 2 or iterate

**Week 2 Review**

- **When:** End of Week 2 (Day 10)
- **What:** Enhanced features demo
- **Who:** Full team + external testers
- **Goal:** Validate interactions and performance
- **Decision:** Proceed to Week 3 or adjust

**Final Review**

- **When:** End of Week 3 (Day 15)
- **What:** Complete mobile experience
- **Who:** All stakeholders + user testing
- **Goal:** Production readiness assessment
- **Decision:** Launch or final adjustments

### Approval Gates

**Design Approval**

- [ ] Visual design approved by stakeholders
- [ ] Interaction patterns validated by users
- [ ] Accessibility requirements confirmed
- [ ] Performance targets agreed upon
- [ ] Timeline and budget approved

**Development Approval**

- [ ] Technical approach validated
- [ ] Component architecture approved
- [ ] Testing strategy confirmed
- [ ] Deployment plan agreed
- [ ] Maintenance plan established

**Launch Approval**

- [ ] All success criteria met
- [ ] No critical bugs outstanding
- [ ] User acceptance testing passed
- [ ] Performance metrics achieved
- [ ] Documentation complete

---

## Risk Assessment

### High Priority Risks

**Risk 1: Desktop Experience Degradation**

- **Impact:** High - Could alienate existing users
- **Mitigation:** Extensive desktop regression testing, separate mobile/desktop components

**Risk 2: Performance Issues**

- **Impact:** High - Poor mobile experience
- **Mitigation:** Performance budgets, profiling, optimization focus

**Risk 3: Timeline Overrun**

- **Impact:** Medium - Budget and resource issues
- **Mitigation:** Phased delivery, MVP focus, buffer time

### Medium Priority Risks

**Risk 4: Browser Compatibility**

- **Impact:** Medium - Some users can't access
- **Mitigation:** Progressive enhancement, polyfills, fallbacks

**Risk 5: User Confusion**

- **Impact:** Medium - Poor adoption
- **Mitigation:** Onboarding hints, documentation, user testing

**Risk 6: Gesture Discovery**

- **Impact:** Low - Features underutilized
- **Mitigation:** Visual hints, help section, user education

---

## Glossary

**Bottom Sheet:** A UI pattern where a panel slides up from the bottom of the screen, commonly used for filters, settings, or additional
actions.

**Cumulative Layout Shift (CLS):** A metric that measures visual stability - how much content unexpectedly shifts during page load.

**Floating Action Button (FAB):** A circular button that floats above content, typically used for the primary action on a screen.

**First Contentful Paint (FCP):** The time when the first content appears on screen during page load.

**Haptic Feedback:** Physical vibration feedback in response to user actions on touch devices.

**Largest Contentful Paint (LCP):** The time when the largest content element becomes visible during page load.

**Progressive Web App (PWA):** A web application that can be installed on devices and work offline like a native app.

**Time to Interactive (TTI):** The time when a page becomes fully interactive and responsive to user input.

**Touch Target:** The tappable area of an interactive element; must be at least 44x44px for accessibility.

**WCAG:** Web Content Accessibility Guidelines - international standards for web accessibility.

---

## Appendix

### Reference Materials

**Design Systems**

- Material Design 3 Mobile Patterns
- iOS Human Interface Guidelines
- Android App Quality Guidelines
- WCAG 2.1 Level AA Standards

**Technical Resources**

- Material UI Mobile Documentation
- React Swipeable Gesture Library
- Workbox PWA Framework
- Web Share API Specification

**Competitive Analysis**

- Leafly (Cannabis reference app)
- AllTrails (Discovery/filtering patterns)
- Notion (Bottom sheet implementation)
- Spotify (Mobile navigation)

### Contact Information

**Design Lead**

- Role: UX/UI Design Expert
- Responsibilities: Design direction, review, approval

**Development Lead**

- Role: Technical Implementation
- Responsibilities: Component development, integration

**Product Owner**

- Role: Business Requirements
- Responsibilities: Scope, priorities, acceptance

---

## Version History

| Version | Date       | Author       | Changes              |
| ------- | ---------- | ------------ | -------------------- |
| 1.0     | 2025-11-01 | UX/UI Expert | Initial design brief |

---

## Approval Signatures

**Design Approved By:**

- Name: ********\_\_\_********
- Title: ********\_\_\_********
- Date: ********\_\_\_********
- Signature: ********\_\_\_********

**Technical Approved By:**

- Name: ********\_\_\_********
- Title: ********\_\_\_********
- Date: ********\_\_\_********
- Signature: ********\_\_\_********

**Business Approved By:**

- Name: ********\_\_\_********
- Title: ********\_\_\_********
- Date: ********\_\_\_********
- Signature: ********\_\_\_********

---

**This design brief focuses on WHAT needs to be achieved. Implementation details (HOW) are covered in separate technical documentation.**

**Next Steps:** Review → Approve → Proceed to Implementation → Launch 🚀
