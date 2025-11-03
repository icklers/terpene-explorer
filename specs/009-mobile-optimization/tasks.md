# Implementation Tasks: Mobile Optimization

**Feature**: `009-mobile-optimization`  
**Branch**: `009-mobile-optimization`  
**Date**: 2025-11-01

This document provides granular implementation tasks with estimates, owners, dependencies, and acceptance criteria.

---

## Phase 1: Foundation (Week 1)

### Task 001: Mobile AppBar Implementation

**ID**: `T001`  
**Owner**: FE  
**Estimate**: 10 hours  
**Dependencies**: None  
**Priority**: P1  
**Files**:
- Create: `src/components/layout/AppBar.tsx`
- Create: `src/components/layout/AppBar.test.tsx`
- Create: `src/hooks/useHeaderCollapse.ts`

**Description**: Implement mobile-aware AppBar component that renders compact header with collapsible search,
hamburger menu, navigation drawer, Settings Bottom Sheet, and scroll-triggered collapse/expand behavior. Ensure all
touch targets meet WCAG AA standards and keyboard accessibility.

**Acceptance Criteria**:
- [ ] Mobile header height is 56px
- [ ] Desktop header height is 64px
- [ ] Hamburger menu icon (left), logo (center), three-dot menu icon ⋮ (right) to open navigation drawer
- [ ] All touch targets ≥44x44px (per FR-006 rationale table)
- [ ] Three-dot menu icon opens navigation drawer (Material UI Drawer with anchor="bottom")
- [ ] Navigation drawer contains app navigation links, branding, and language switcher
- [ ] Settings Bottom Sheet (separate from navigation drawer) accessible from navigation drawer
- [ ] Settings Bottom Sheet contains theme toggle and language selector with ≥48px touch targets
- [ ] Bottom sheets can be closed by swipe-down, close button, or tapping backdrop
- [ ] Header collapses on scroll-down, expands on scroll-up (iOS Safari pattern)
- [ ] FAB and essential controls remain visible during header collapse
- [ ] Haptic feedback on hamburger/three-dot tap using utility function with fallback
- [ ] All interactive elements have aria-labels
- [ ] i18n keys used for all visible strings
- [ ] Unit tests pass with >80% coverage

**Implementation Notes**:
- Use `useMediaQuery(theme.breakpoints.down('sm'))` for mobile detection
- Material UI `Drawer` with `anchor="bottom"` for navigation drawer and Settings Bottom Sheet
- Implement scroll listener for collapse/expand behavior
- Haptic utility function:
  ```typescript
  const triggerHaptic = (duration: number = 10) => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } catch (e) {
      console.debug('Haptic feedback not supported');
    }
  };
  ```

---

### Task 002: TerpeneCardGrid Component

**ID**: `T002`  
**Owner**: FE  
**Estimate**: 12 hours  
**Dependencies**: None  
**Priority**: P1  
**Parallel**: Yes [P]  
**Files**:
- Create: `src/components/visualizations/TerpeneCardGrid.tsx`
- Create: `src/components/visualizations/TerpeneCardGrid.test.tsx`
- Modify: `src/components/visualizations/TerpeneTable.tsx`

**Description**: Create mobile-optimized card grid for displaying terpenes. Integrate TanStack Virtual for lists >50 items. Update TerpeneTable to conditionally render CardGrid on mobile breakpoints.

**Acceptance Criteria**:
- [ ] No horizontal scrolling on 360-430px viewport
- [ ] Cards display: name (H6), aroma (Body2), top 3 effects, "+X more" indicator
- [ ] Full card is tappable with visible pressed state (scale 0.98, shadow elevation 1→4, 200ms)
- [ ] Tap triggers `onTerpeneClick` handler
- [ ] Haptic feedback on card tap (10ms vibration with fallback)
- [ ] Virtual scrolling enabled when `terpenes.length > 50`
- [ ] Smooth scrolling maintained with 60fps
- [ ] Grid layout: 1 column mobile, 2 columns tablet
- [ ] Unit tests cover happy path + edge cases
- [ ] E2E test validates mobile browsing flow

**Implementation Notes**:
- Use Material UI `Grid` with responsive breakpoints (xs=12, sm=6)
- TanStack Virtual with estimated card height 180px, overscan 5
- Card tap animation using transform and box-shadow (GPU-accelerated)
- Use haptic utility function (see T001) for consistent feedback

---

### Task 003: TerpeneDetailModal Mobile Enhancement

**ID**: `T003`  
**Owner**: FE  
**Estimate**: 8 hours  
**Dependencies**: `008-therapeutic-modal-refactor` MUST be complete  
**Priority**: P1  
**Files**:
- Modify: `src/components/visualizations/TerpeneDetailModal.tsx`
- Create: `src/hooks/useSwipeToClose.ts`
- Create: `src/hooks/useShare.ts`

**Description**: Add mobile-specific enhancements to the refactored therapeutic modal (from 008): full-screen mode, slide-up transition, swipe-to-close gesture, and Web Share API integration.

**Acceptance Criteria**:
- [ ] Modal is full-screen on mobile (<600px)
- [ ] Slides up from bottom in ≤300ms using Material UI default transitions
- [ ] Custom AppBar on mobile with close button (left) and share button (right)
- [ ] Web Share API works with fallback to copy-to-clipboard
- [ ] Swipe-down gesture closes modal with threshold: 100px drag distance OR velocity >0.5px/ms
- [ ] Swipe gesture doesn't interfere with accordion interactions
- [ ] Visual feedback during swipe: opacity = Math.max(0.5, 1 - (dragDistance / 100))
- [ ] Basic/Expert toggle works on mobile with ≥48px touch targets (per FR-006 rationale)
- [ ] Toggle buttons stack vertically on narrow screens (<400px)
- [ ] Categorized effects display correctly on mobile
- [ ] ESC key closes modal
- [ ] Focus restored to triggering element on close

**Implementation Notes**:
- Preserve ALL therapeutic modal features from 008-therapeutic-modal-refactor
- Use `TransitionComponent={Slide}` with `direction="up"` on mobile
- Share format: `{name}\n{description}\n{effects}\n{url}`
- Swipe velocity calculation: `velocity = dragDistance / (touchEndTime - touchStartTime)`

---

## Phase 2: Enhancement (Week 2)

### Task 004: FilterBottomSheet Component

**ID**: `T004`  
**Owner**: FE  
**Estimate**: 12 hours  
**Dependencies**: T1.2  
**Priority**: P2  
**Files**:
- Create: `src/components/filters/FilterBottomSheet.tsx`
- Create: `src/components/filters/FilterBottomSheet.test.tsx`
- Modify: `src/pages/Home.tsx`

**Description**: Implement mobile filter interface as bottom sheet with FAB trigger, drag-to-close, real-time results count, category accordions, and sticky Apply button.

**Acceptance Criteria**:
- [ ] FAB visible in bottom-right corner with filter icon
- [ ] FAB shows badge with active filter count
- [ ] FAB touch target ≥56x56px
- [ ] Bottom sheet slides up with drag handle visible
- [ ] Drag handle is 40x4px, centered
- [ ] Real-time results count displays: "X terpenes match"
- [ ] Categories organized as accordions (Mood/Energy, Cognitive, Relaxation, Physical)
- [ ] Effect chips are tappable with ≥44x44px targets
- [ ] "Clear All" button resets filters
- [ ] "Apply" button in sticky footer closes sheet and applies filters
- [ ] Sheet can be closed by: swipe-down, close button, or tapping backdrop
- [ ] Unit tests verify filter logic
- [ ] E2E test validates filter application flow

**Implementation Notes**:
- Material UI `Drawer` with `anchor="bottom"`
- Results count computed via `useMemo` on filter changes
- Keep modal open after applying filter (per spec)

---

### Task 005: Responsive Theme Updates

**ID**: `T005`  
**Owner**: FE  
**Estimate**: 6 hours  
**Dependencies**: None  
**Priority**: P2  
**Parallel**: Yes [P]  
**Files**:
- Modify: `src/theme/darkTheme.ts`
- Modify: `src/theme/lightTheme.ts`

**Description**: Update theme files with responsive typography using CSS clamp() and component overrides for mobile touch targets.

**Acceptance Criteria**:
- [ ] Typography uses clamp() for fluid scaling
- [ ] Base font-size ≥16px on mobile
- [ ] H1: clamp(2rem, 5vw, 2.5rem)
- [ ] Body1: clamp(1rem, 2vw, 1rem)
- [ ] MuiButton: minHeight 44px desktop, 48px mobile
- [ ] MuiIconButton: padding 12px desktop, 14px mobile
- [ ] MuiChip: height 28px desktop, 32px mobile
- [ ] All component overrides use @media queries for mobile
- [ ] Dark and light themes both updated
- [ ] Visual regression tests pass (if configured)

**Implementation Notes**:
- Use `@media (max-width:600px)` for mobile overrides
- Ensure contrast ratios maintained (4.5:1 for text)

---

### Task 006: Virtual Scrolling Integration

**ID**: `T006`  
**Owner**: FE  
**Estimate**: 6 hours  
**Dependencies**: T1.2  
**Priority**: P2  
**Files**:
- Modify: `src/components/visualizations/TerpeneCardGrid.tsx`

**Description**: Optimize TerpeneCardGrid with TanStack Virtual for smooth performance with long lists (>50 terpenes).

**Acceptance Criteria**:
- [ ] Virtual scrolling enabled when `terpenes.length > 50`
- [ ] Only visible cards + overscan (5) rendered in DOM
- [ ] Scroll position maintained on re-render
- [ ] Dynamic row heights supported
- [ ] Smooth 60fps scrolling performance
- [ ] Memory usage bounded (no memory leaks)
- [ ] Performance tests validate <16ms render time per card

**Implementation Notes**:
- TanStack Virtual `useVirtualizer` hook
- Estimated card height: 180px
- Overscan: 5 cards above/below viewport

---

### Task 007: Web Share API Integration

**ID**: `T007`  
**Owner**: FE  
**Estimate**: 4 hours  
**Dependencies**: T1.3  
**Priority**: P2  
**Files**:
- Create: `src/hooks/useShare.ts`
- Create: `src/hooks/useShare.test.ts`

**Description**: Implement Web Share API hook with clipboard fallback for desktop browsers.

**Acceptance Criteria**:
- [ ] `navigator.share()` used when available
- [ ] Fallback to `navigator.clipboard.writeText()` on desktop
- [ ] Success toast notification on share/copy
- [ ] Error handling for denied permissions
- [ ] Share data format: title, text, url
- [ ] Unit tests cover both share and fallback paths

---

## Phase 3: PWA & Polish (Week 3)

### Task 008: PWA Configuration

**ID**: `T008`  
**Owner**: FE  
**Estimate**: 8 hours  
**Dependencies**: None  
**Priority**: P3  
**Files**:
- Modify: `vite.config.ts`
- Modify: `public/manifest.json`
- Create: `public/icon-192x192.png`
- Create: `public/icon-512x512.png`

**Description**: Configure vite-plugin-pwa, create manifest with mobile icons, and setup service worker for offline support.

**Acceptance Criteria**:
- [ ] vite-plugin-pwa installed and configured
- [ ] manifest.json has name, short_name, theme_color, background_color, display, icons
- [ ] App icons: 192x192px and 512x512px (PNG)
- [ ] Service worker registers automatically
- [ ] App is installable on supported browsers (Chrome, Safari, Edge)
- [ ] Previously viewed terpene data cached for offline access
- [ ] Offline indicator displays when navigator.onLine === false (per FR-060)
- [ ] Offline banner states "You're offline. Viewing cached data." with dismiss button
- [ ] Lighthouse PWA audit passes
- [ ] Install prompt appears after engagement threshold: 30s active interaction OR 3 terpene modals viewed

**Implementation Notes**:
- Workbox caching strategies: CacheFirst for assets, NetworkFirst for data
- Theme color: #4caf50 (existing brand green)
- Background color: #121212 (dark mode)
- Engagement tracking: increment counter on tap, scroll, search, or filter events

---

### Task 009: Bundle Optimization

**ID**: `T009`  
**Owner**: FE  
**Estimate**: 8 hours  
**Dependencies**: None  
**Priority**: P3  
**Parallel**: Yes [P]  
**Files**:
- Modify: `vite.config.ts`
- Create: `lighthouserc.json`

**Description**: Implement code splitting, manual chunking, lazy loading, and performance budgets to achieve <200KB JS, <50KB CSS bundles.

**Acceptance Criteria**:
- [ ] Manual chunks: vendor-react, vendor-mui, vendor-i18n, vendor-utils
- [ ] Lazy loading for: FilterBottomSheet, TerpeneDetailModal
- [ ] Critical CSS inlined for FCP optimization (per FR-071)
- [ ] JS bundle ≤200KB gzipped
- [ ] CSS bundle ≤50KB gzipped
- [ ] Total page weight ≤500KB
- [ ] FCP <1.5s on 3G network
- [ ] LCP <2.5s on 3G network
- [ ] TTI <5s on 3G network
- [ ] Bundle visualizer analysis reviewed

**Implementation Notes**:
- Use `React.lazy()` for non-critical components
- Vite `build.rollupOptions.output.manualChunks`
- Tree-shake Material UI via named imports
- Use vite-plugin-critical or similar for critical CSS extraction

---

### Task 010: Lighthouse CI Integration

**ID**: `T010`  
**Owner**: FE/DevOps  
**Estimate**: 6 hours  
**Dependencies**: T3.2  
**Priority**: P3  
**Files**:
- Create: `lighthouserc.json`
- Modify: `.github/workflows/ci.yml`

**Description**: Add Lighthouse CI to GitHub Actions workflow to enforce performance budgets on every PR.

**Acceptance Criteria**:
- [ ] lighthouserc.json configured with assertions
- [ ] Performance ≥90 required
- [ ] Accessibility ≥95 required
- [ ] FCP ≤1500ms, LCP ≤2500ms, TBT ≤300ms, CLS ≤0.1
- [ ] CI step added to GitHub Actions workflow
- [ ] CI fails if budgets exceeded
- [ ] Lighthouse report uploaded to temporary storage
- [ ] Report URL posted in PR comments (optional)

---

### Task 011: Unit Tests

**ID**: `T011`  
**Owner**: QA/FE  
**Estimate**: 8 hours  
**Dependencies**: T1.1, T1.2, T1.3, T2.1  
**Priority**: P3  
**Files**:
- Create: `tests/unit/components/AppBar.test.tsx`
- Create: `tests/unit/components/TerpeneCardGrid.test.tsx`
- Create: `tests/unit/components/FilterBottomSheet.test.tsx`
- Create: `tests/unit/hooks/useSwipeToClose.test.ts`
- Create: `tests/unit/hooks/useShare.test.ts`

**Description**: Write Vitest unit tests for mobile components and hooks with happy path + edge case coverage.

**Acceptance Criteria**:
- [ ] AppBar tests: mobile/desktop rendering, search expansion, settings sheet
- [ ] CardGrid tests: card rendering, tap handling, virtual scrolling threshold
- [ ] FilterBottomSheet tests: filter selection, results count, clear/apply actions
- [ ] useSwipeToClose tests: gesture detection, threshold validation
- [ ] useShare tests: Web Share API, clipboard fallback
- [ ] All tests pass locally
- [ ] Code coverage ≥80% for mobile components

---

### Task 012: E2E Tests

**ID**: `T012`  
**Owner**: QA  
**Estimate**: 10 hours  
**Dependencies**: T1.1, T1.2, T1.3, T2.1  
**Priority**: P3  
**Files**:
- Create: `tests/e2e/mobile-browsing.spec.ts`
- Create: `tests/e2e/mobile-filters.spec.ts`
- Create: `tests/e2e/pwa-install.spec.ts`

**Description**: Create Playwright E2E tests for mobile viewport flows: browsing, filtering, modal interactions, PWA installation.

**Acceptance Criteria**:
- [ ] mobile-browsing.spec.ts: browse cards, open modal, swipe to close, share
- [ ] mobile-filters.spec.ts: open filter sheet, select effects, apply filters, clear
- [ ] pwa-install.spec.ts: trigger install prompt, verify installability
- [ ] Tests run on mobile device emulators (Pixel 5, iPhone 13)
- [ ] All E2E tests pass on CI
- [ ] Screenshots/videos captured on failure

**Implementation Notes**:
- Playwright projects: "Mobile Chrome", "Mobile Safari"
- Use `page.mouse` API for swipe gesture simulation
- Check `beforeinstallprompt` event for PWA installability

---

### Task 013: Accessibility Audit

**ID**: `T013`  
**Owner**: QA/FE  
**Estimate**: 8 hours  
**Dependencies**: T1.1, T1.2, T1.3, T2.1  
**Priority**: P3  
**Files**:
- Create: `tests/unit/accessibility/mobile-components.test.tsx`

**Description**: Run automated axe audits and manual screen reader checks to ensure WCAG 2.1 AA compliance on mobile components.

**Acceptance Criteria**:
- [ ] jest-axe tests for: AppBar, CardGrid, FilterBottomSheet, DetailModal
- [ ] No critical axe violations
- [ ] All interactive elements have aria-labels
- [ ] Focus indicators visible (3px outline, 2px offset, minimum 3:1 contrast per FR-073)
- [ ] Skip-to-content link implemented: visually hidden until focused, appears at top on Tab key
- [ ] Skip-to-content link navigates keyboard focus directly to main content area (per FR-078)
- [ ] Skip link tested with keyboard navigation (Tab from page load activates link)
- [ ] Keyboard navigation works (Tab, Enter, Esc, Arrow keys)
- [ ] Screen reader testing completed (VoiceOver or TalkBack)
- [ ] All headings form logical hierarchy
- [ ] Color contrast ≥4.5:1 for normal text, ≥3:1 for large text

---

### Task 014: Cross-Browser Testing

**ID**: `T014`  
**Owner**: QA  
**Estimate**: 6 hours  
**Dependencies**: T3.4, T3.5, T3.6  
**Priority**: P3  
**Files**: N/A (testing task)

**Description**: Validate mobile experience on target browsers: Chrome Android, Safari iOS, Samsung Internet, Firefox Android, Edge Mobile.

**Acceptance Criteria**:
- [ ] Chrome Android 120+ tested
- [ ] Safari iOS 17+ tested
- [ ] Samsung Internet 23+ tested
- [ ] Firefox Android 121+ tested
- [ ] Edge Mobile 120+ tested
- [ ] No major layout regressions
- [ ] No functional breakages
- [ ] Touch interactions work consistently
- [ ] Gestures work on all browsers

**Implementation Notes**:
- Use BrowserStack or manual device testing
- Focus on critical flows: browse, filter, modal, PWA

---

### Task 015: Documentation

**ID**: `T015`  
**Owner**: FE  
**Estimate**: 4 hours  
**Dependencies**: All previous tasks  
**Priority**: P3  
**Files**:
- Update: `specs/009-mobile-optimization/quickstart.md`
- Create: `CHANGELOG.md` entry

**Description**: Update quickstart guide with final implementation notes and create changelog entry for release.

**Acceptance Criteria**:
- [ ] quickstart.md reflects actual implementation
- [ ] Known limitations documented
- [ ] Setup instructions validated
- [ ] Testing commands verified
- [ ] CHANGELOG.md entry created with features, fixes, breaking changes

---

### Task 016: Pull-to-Refresh Gesture

**ID**: `T016`  
**Owner**: FE  
**Estimate**: 4 hours  
**Dependencies**: T002  
**Priority**: P3  
**Files**:
- Modify: `src/components/visualizations/TerpeneCardGrid.tsx`
- Create: `src/hooks/usePullToRefresh.ts`

**Description**: Implement pull-to-refresh gesture on terpene list with loading indicator and data reload.

**Acceptance Criteria**:
- [ ] Pull-down gesture triggers refresh animation
- [ ] Loading indicator displays during refresh
- [ ] Data reloads (even if unchanged, provides user feedback)
- [ ] Gesture doesn't conflict with browser pull-to-refresh (disabled when app handles it per FR-039)
- [ ] Haptic feedback on refresh trigger (15ms vibration)
- [ ] Works on both mobile Chrome and Safari iOS

**Implementation Notes**:
- Use touchstart/touchmove/touchend events
- Prevent default browser behavior: `preventDefault()` on touchmove
- Threshold: 80px pull distance to trigger refresh
- Loading spinner appears at top during refresh

---

### Task 017: Critical CSS Extraction

**ID**: `T017`  
**Owner**: FE  
**Estimate**: 4 hours  
**Dependencies**: T009  
**Priority**: P3  
**Files**:
- Modify: `vite.config.ts`
- Modify: `index.html`

**Description**: Extract and inline critical CSS for above-the-fold content to achieve FCP <1.5s on 3G networks
(per FR-071). Use vite-plugin-critical for automated extraction.

**Acceptance Criteria**:
- [ ] vite-plugin-critical installed and configured in vite.config.ts
- [ ] Critical CSS extracted for mobile viewport (360px width)
- [ ] Above-the-fold CSS inlined in index.html: header, card grid skeleton, loading states
- [ ] Non-critical CSS loaded asynchronously
- [ ] FCP <1.5s verified via Lighthouse CI on 3G throttling
- [ ] No FOUC (flash of unstyled content) on initial page load
- [ ] Build process completes without errors

**Implementation Notes**:
- Use vite-plugin-critical with configuration:
  ```javascript
  critical({
    dimensions: [{ width: 360, height: 800 }],
    inline: true,
    minify: true,
  })
  ```
- Target critical selectors: AppBar, Card skeleton, FAB, loading spinner

---

### Task 018: Mobile Search Optimization

**ID**: `T018`  
**Owner**: FE  
**Estimate**: 3 hours  
**Dependencies**: T001  
**Priority**: P2  
**Files**:
- Modify: `src/components/layout/AppBar.tsx`
- Create: `src/hooks/useSearchDebounce.ts`

**Description**: Enhance search input with mobile-specific optimizations: type="search", debouncing, mobile-friendly
keyboard, and autocomplete attributes (per FR-086).

**Acceptance Criteria**:
- [ ] Search input has type="search" for mobile keyboard optimization
- [ ] Search is debounced with 300ms delay using custom hook
- [ ] Mobile keyboard shows search/go button instead of return
- [ ] Search input has autocomplete="off" and spellcheck="false"
- [ ] Clear button (×) appears when search has value
- [ ] Search expands to full width on focus (mobile only)
- [ ] Search collapses when empty and blurred
- [ ] i18n placeholder text: "Search terpenes..."
- [ ] Unit tests cover debounce logic and clear functionality

**Implementation Notes**:
- useSearchDebounce hook pattern:
  ```typescript
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);
  ```

---

### Task 019: Version Footer Display

**ID**: `T019`  
**Owner**: FE  
**Estimate**: 2 hours  
**Dependencies**: None  
**Priority**: P3  
**Parallel**: Yes [P]  
**Files**:
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Footer.test.tsx`
- Modify: `src/App.tsx`

**Description**: Create Footer component that displays app version number (centered) above GitHub project link.
Version should be sourced from package.json (per FR-088).

**Acceptance Criteria**:
- [ ] Footer component created with version display and GitHub link
- [ ] Version number centered above GitHub link
- [ ] Version sourced from package.json via import.meta.env.PACKAGE_VERSION or import
- [ ] Typography variant caption used for version (muted color: text.secondary)
- [ ] Footer visible on all pages, positioned at bottom
- [ ] Footer responsive: full width, padding adjusted for mobile
- [ ] GitHub link opens in new tab with rel="noopener noreferrer"
- [ ] All text uses i18n keys
- [ ] Unit tests verify version rendering

**Implementation Notes**:
- Import version from package.json: `import { version } from '../../../package.json'`
- Or configure Vite to expose version: `define: { __APP_VERSION__: JSON.stringify(version) }`
- Footer layout: centered column, version above link

---

## Task Summary

| Phase | Tasks | Total Hours | Parallel Tasks |
|-------|-------|------------:|----------------|
| Phase 1: Foundation | 3 | 30 | T002 |
| Phase 2: Enhancement | 6 | 37 | T005, T018 |
| Phase 3: PWA & Polish | 10 | 62 | T008, T009, T019 |
| **Total** | **19** | **129** | **5** |

**Note**: Total estimate is 129 hours including 21-hour buffer from original 108 hours. This accounts for contingency
and provides headroom for unforeseen complexity. Original spec estimated 120 hours; updated estimate includes critical
CSS extraction (T017), mobile search optimization (T018), and version footer (T019).

## Dependencies Graph

```mermaid
T001 (AppBar) ─────────────────┬────────► T011 (Unit Tests)
                               │
T002 (CardGrid) ───┬───────────┼────────► T011 (Unit Tests)
                   │           │
                   ├─► T004    │
                   │   (Filter)├────────► T012 (E2E Tests)
                   │           │
                   ├─► T006    │
                   │   (VirtualScroll)   │
                   │           │
                   └─► T016    │
                       (PullRefresh)     │
                                          │
T003 (Modal) ──────────────────┼────────► T011, T013 (Tests)
    │                          │
    └─► T007 (Share API)       │
                               │
T005 (Theme) ──────────────────┤
                               │
T008 (PWA) ────────────────────┤
                               │
T009 (Bundle) ─► T010 (Lighthouse CI)
                               │
All ────────────────────────────► T015 (Docs)
```

## Notes

- **Parallel Tasks**: Tasks marked [P] can be worked on simultaneously
- **Critical Path**: T002 → T004 → T012 (longest dependency chain)
- **Prerequisites**: `008-therapeutic-modal-refactor` MUST be complete before T003
- **Testing**: Unit tests (T011) should be written alongside feature development, not after
- **Performance**: T009 and T010 are critical for meeting Lighthouse ≥90 target
- **Touch Targets**: 44px minimum per WCAG AA, 48px for primary buttons, 56px for FAB
- **Haptic Feedback**: All primary interactions include vibration with fallback

---

**Status**: Ready for implementation  
**Next Command**: `/speckit.implement` or manual task assignment
