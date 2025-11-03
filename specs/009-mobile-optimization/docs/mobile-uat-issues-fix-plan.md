# Mobile UAT Issues - Fix Plan

**Feature**: `009-mobile-optimization`  
**Date**: 2025-11-03  
**Status**: UAT Issues Identified - Fix Plan Created

---

## Executive Summary

User Acceptance Testing (UAT) on mobile devices (iPhone 16) revealed 4 critical UX issues that prevent effective use of the application on mobile. This document outlines the issues, root causes, proposed solutions following Material Design and mobile UX best practices, and implementation tasks.

---

## Issues Identified

### Issue #1: Table Horizontal Scroll Not Working (High Priority)

**Symptoms:**
- Table cannot be scrolled horizontally on mobile
- Effects column content is cut off/invisible

**Root Cause Analysis:**
- Investigation needed: The `TerpeneTable` component has conditional rendering (`isMobile` check at line 195) that should show `TerpeneCardGrid` on mobile (<600px)
- Possible causes:
  1. Breakpoint not triggering correctly
  2. User device falls between 600-768px (tablet range) where table still renders
  3. `TableContainer` missing horizontal scroll overflow

**Impact:** High - Users cannot view effect data, core feature unusable

---

### Issue #2: Filter Clear Button Not Visible (Critical)

**Symptoms:**
- Users cannot clear active filters
- Clear all/reset button not visible on mobile

**Root Cause:**
- FilterControls component likely has layout issues on mobile
- Clear button may be positioned outside viewport or hidden by overflow

**Impact:** Critical - Users get stuck with filters applied, cannot reset to see all terpenes

---

### Issue #3: Filter by Effects Section Not Scrollable (High Priority)

**Symptoms:**
- "Filter by Effects" section not showing effects
- Section appears empty or non-interactive
- Cannot scroll to see more effects

**Root Cause:**
- FilterControls effects list lacks proper overflow handling
- Accordion/expansion panel may have `overflow: hidden` preventing scroll
- Container height constraints preventing content visibility

**Impact:** High - Primary filtering mechanism non-functional on mobile

---

### Issue #4: Modal Close Button Not Visible at Normal Zoom (Critical)

**Symptoms:**
- Close button (X) not visible in TerpeneDetailModal on iPhone 16 at 100% zoom
- Button becomes visible only when zooming out the entire page
- Suggests layout/positioning issue

**Root Cause:**
- Mobile AppBar close button positioning issue
- Possible viewport height calculation error
- iOS Safari viewport quirks (address bar affects vh units)

**Impact:** Critical - Users trapped in modal, cannot navigate back (accessibility violation)

---

## Mobile Filter UX Best Practices Analysis

### Industry Standards (Material Design, iOS HIG, Leading Apps)

**What Top Apps Do:**
- **Airbnb, Amazon, Zillow**: FAB (Floating Action Button) with filter icon → opens bottom sheet
- **Google Maps**: Bottom sheet with filters, swipe-to-dismiss
- **Uber Eats**: Sticky filter bar at top with "Filters" button → full-screen modal
- **Instagram**: Bottom sheet for filters with drag handle

**Material Design Recommendations:**
- Use bottom sheets for mobile filter UI
- Provide visual affordance (drag handle)
- Show active filter count as badge
- Sticky "Apply" button at bottom of sheet
- Support swipe-to-dismiss gesture

**Key Principles:**
1. **Progressive Disclosure**: Hide complexity until needed (FAB reveals filters)
2. **Thumb Zone**: Primary actions within easy reach (bottom 2/3 of screen)
3. **Clear Affordances**: Visual cues for interaction (drag handle, badges)
4. **Escape Hatches**: Multiple ways to close (swipe, backdrop, close button)
5. **Feedback**: Real-time result count updates

---

## Proposed Solutions

### Solution #1: Table Scroll Fix (Quick Fix)

**Option A: Force Card Grid on Small Tablets**
- Expand `isMobile` breakpoint to `md` (960px) instead of `sm` (600px)
- Ensures card grid used on all mobile/tablet devices

**Option B: Enable Horizontal Scroll + Sticky Column**
- Wrap `TableContainer` in scrollable box
- Make first column (Name) sticky for context
- Add scroll shadow indicator

**Recommendation**: **Option A** - Aligns with mobile-first strategy, card grid is better UX

---

### Solution #2: Mobile Filter Architecture (Complete Redesign)

**Recommended Approach: FAB + Bottom Sheet Pattern**

#### Components:
1. **FilterFAB** (Floating Action Button)
   - Position: Fixed bottom-right (16px from edges)
   - Icon: `FilterListIcon` from Material UI
   - Badge: Shows active filter count
   - Haptic feedback on tap
   - Elevated (z-index above content)

2. **FilterBottomSheet** (Drawer Component)
   - Anchor: `bottom`
   - Full width, 85% max height (leaves status bar visible)
   - Drag handle at top (40x4px rounded bar)
   - Swipe-to-dismiss gesture
   - Backdrop with 50% opacity
   - Sections:
     - Header: "Filters" title + Close button
     - Content: Scrollable filter sections (accordions)
     - Footer: Sticky buttons (Clear All | Apply)

3. **FilterSection** (Accordion)
   - Category tabs (Mood, Cognitive, Relaxation, Physical)
   - Each tab: Expandable accordion with effects
   - Multi-select chips with checkboxes
   - Real-time result count: "X terpenes match"

#### UX Flow:
```
1. User taps FAB (shows badge: "3 active")
2. Bottom sheet slides up (300ms animation)
3. User sees current filters, can:
   - Clear all (resets + closes sheet)
   - Select/deselect effects
   - See live count: "12 terpenes match"
4. User taps "Apply" or swipes down → sheet closes
5. FAB badge updates with new count
```

**Advantages:**
- ✅ Follows Material Design guidelines
- ✅ Optimized for thumb zone (bottom interaction)
- ✅ Provides clear escape hatches (swipe, backdrop, buttons)
- ✅ Shows feedback (real-time count, badge)
- ✅ Saves screen space (filters hidden until needed)
- ✅ Familiar pattern (used by major apps)

---

### Solution #3: Modal Close Button Fix

**Root Cause Hypothesis:**
- iOS Safari viewport height (vh) includes address bar, causing layout issues
- Mobile AppBar may extend beyond safe area

**Proposed Fix:**
```typescript
// Use dvh (dynamic viewport height) instead of vh
// Add safe area insets for iOS

<Dialog
  fullScreen={isMobile}
  PaperProps={{
    sx: {
      height: isMobile ? '100dvh' : 'auto', // Dynamic viewport height
      paddingTop: 'env(safe-area-inset-top)', // iOS notch/status bar
      paddingBottom: 'env(safe-area-inset-bottom)', // iOS home indicator
    }
  }}
>
  <MuiAppBar position="sticky"> {/* Changed from "static" to "sticky" */}
    <Toolbar sx={{ minHeight: 56 }}> {/* Explicit height */}
      <IconButton edge="start" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      {/* ... */}
    </Toolbar>
  </MuiAppBar>
</Dialog>
```

**Additional Safeguards:**
- Ensure close button has `minWidth: 48px`, `minHeight: 48px`
- Test on iOS Safari with address bar shown/hidden
- Add visual regression test for iOS viewport

---

## Implementation Plan

### Phase 1: Critical Fixes (High Priority - 2-3 days)

#### Task 1.1: Fix Table Scroll Issue
**File**: `src/components/visualizations/TerpeneTable.tsx`

```typescript
// Change breakpoint from 'sm' to 'md'
const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Was: 'sm'
```

**Acceptance Criteria:**
- [ ] Card grid renders on devices ≤960px (tablets included)
- [ ] No horizontal scroll issues on any mobile device
- [ ] Desktop (>960px) still shows table view

**Testing:**
- [ ] iPhone 16 (390x844)
- [ ] iPad (768x1024)
- [ ] Android tablet (800x1280)

---

#### Task 1.2: Fix Modal Close Button Visibility
**File**: `src/components/TerpeneDetailModal.tsx`

**Changes:**
1. Use `100dvh` instead of implicit height
2. Add iOS safe area insets
3. Change AppBar position to `sticky`
4. Ensure close button touch target: 48x48px

**Acceptance Criteria:**
- [ ] Close button visible at normal zoom (100%) on iPhone 16
- [ ] Button doesn't overlap with iOS status bar/notch
- [ ] Touch target ≥48x48px
- [ ] Works with iOS address bar shown/hidden

**Testing:**
- [ ] iOS Safari (iPhone 16)
- [ ] iOS Safari (iPhone SE - smaller screen)
- [ ] Chrome on Android
- [ ] Test with page scroll (modal should remain sticky)

---

### Phase 2: Filter UX Redesign (Medium Priority - 3-5 days)

#### Task 2.1: Create FilterFAB Component
**New File**: `src/components/filters/FilterFAB.tsx`

**Features:**
- Floating Action Button with filter icon
- Badge showing active filter count
- Fixed position: bottom-right (16px margins)
- Haptic feedback on tap
- Opens FilterBottomSheet
- Accessible: `aria-label="Open filters, X active"`

**Acceptance Criteria:**
- [ ] FAB visible on mobile only (<600px)
- [ ] Badge shows correct count (0 = hidden, 1+ = visible)
- [ ] Haptic feedback works (iOS/Android)
- [ ] Touch target ≥56x56px (Material Design FAB spec)
- [ ] Doesn't overlap with content
- [ ] Above other UI elements (z-index: 1050)

---

#### Task 2.2: Create FilterBottomSheet Component
**New File**: `src/components/filters/FilterBottomSheet.tsx`

**Features:**
- Material UI Drawer with `anchor="bottom"`
- 85vh max height (maintains visibility of status bar)
- Drag handle at top (visual affordance)
- Swipe-to-dismiss gesture (via `useSwipeToClose` hook)
- Backdrop with 50% opacity
- Three sections:
  1. Header: Title + Close button
  2. Content: Scrollable filter sections
  3. Footer: Sticky "Clear All" + "Apply" buttons

**Acceptance Criteria:**
- [ ] Sheet slides up in <300ms
- [ ] Drag handle visible (40x4px, centered)
- [ ] Swipe down closes sheet (threshold: 100px or velocity >0.5px/ms)
- [ ] Backdrop tap closes sheet
- [ ] Content scrolls independently
- [ ] Footer buttons always visible (sticky)
- [ ] Buttons have ≥48px height

**Components:**
```typescript
interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}
```

---

#### Task 2.3: Refactor FilterControls for Mobile
**File**: `src/components/filters/FilterControls.tsx`

**Changes:**
1. Add responsive layout detection
2. On desktop: Render current inline layout
3. On mobile: Render simplified version for BottomSheet
4. Extract effect category sections to separate component
5. Fix scrolling in accordion panels

**Mobile Layout:**
```
┌─────────────────────────────┐
│ ═══ Drag Handle            │
│                             │
│ Filters              [X]    │ ← Header
├─────────────────────────────┤
│ 📍 Category Tabs            │
│ ┌─┬─┬─┬─┐                  │
│ │😊│🧠│😌│💪│              │
│ └─┴─┴─┴─┘                  │
│                             │
│ ▼ Mood & Energy (8)        │ ← Accordion
│   ☐ Happy                   │
│   ☐ Euphoric                │
│   ☐ Uplifted                │
│   ... (scrollable)          │
│                             │
│ 12 terpenes match           │ ← Live count
│                             │
├─────────────────────────────┤
│ [Clear All]    [Apply]      │ ← Footer (sticky)
└─────────────────────────────┘
```

**Acceptance Criteria:**
- [ ] Effects list scrollable within accordion
- [ ] Each effect chip: 48px min height
- [ ] Category tabs: 48px height
- [ ] Real-time result count visible
- [ ] "Clear All" resets all filters + closes sheet
- [ ] "Apply" closes sheet (filters already applied via state)

---

#### Task 2.4: Integrate FAB + BottomSheet in Home Page
**File**: `src/pages/Home.tsx`

**Changes:**
1. Add state for bottom sheet open/close
2. Render `FilterFAB` on mobile
3. Render `FilterBottomSheet` with filter state
4. Hide desktop `FilterControls` on mobile
5. Update active filter count logic

**Conditional Rendering:**
```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

return (
  <Box>
    {/* Desktop: Inline filters */}
    {!isMobile && (
      <FilterControls {...filterProps} />
    )}

    {/* Mobile: FAB + Bottom Sheet */}
    {isMobile && (
      <>
        <FilterFAB 
          activeCount={activeFilterCount}
          onClick={() => setBottomSheetOpen(true)}
        />
        <FilterBottomSheet
          open={bottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
          {...filterProps}
        />
      </>
    )}

    <TerpeneTable terpenes={filteredTerpenes} />
  </Box>
);
```

**Acceptance Criteria:**
- [ ] FAB visible on mobile only
- [ ] Desktop filters remain unchanged
- [ ] State synchronization works (FAB badge updates)
- [ ] No layout shift when switching desktop ↔ mobile

---

### Phase 3: Polish & Testing (1-2 days)

#### Task 3.1: Add Clear Filters Functionality
**Files**: All filter components

**Requirements:**
- Desktop: Visible "Clear All" button in FilterControls
- Mobile: "Clear All" button in BottomSheet footer
- Keyboard shortcut: ESC key clears filters
- Visual feedback: Snackbar "Filters cleared"

**Acceptance Criteria:**
- [ ] Desktop clear button visible and functional
- [ ] Mobile clear button in bottom sheet footer
- [ ] Clears all filters and closes sheet (mobile)
- [ ] Shows confirmation toast
- [ ] Updates result count immediately

---

#### Task 3.2: Fix Effects Section Scrolling
**File**: `src/components/filters/FilterControls.tsx`

**Investigation Points:**
1. Check `AccordionDetails` has `overflow: auto`
2. Ensure parent containers don't have `overflow: hidden`
3. Set `maxHeight` on scrollable region
4. Add scroll indicators (shadows at top/bottom)

**Fix:**
```typescript
<AccordionDetails
  sx={{
    maxHeight: '300px',
    overflowY: 'auto',
    overflowX: 'hidden',
    // Scroll shadows for affordance
    background: `
      linear-gradient(white 30%, transparent),
      linear-gradient(transparent, white 70%) 0 100%,
      radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), transparent),
      radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), transparent) 0 100%
    `,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
    backgroundAttachment: 'local, local, scroll, scroll',
  }}
>
  {/* Effect chips */}
</AccordionDetails>
```

**Acceptance Criteria:**
- [ ] Effects list scrollable on mobile
- [ ] Scroll shadows indicate more content
- [ ] Touch scrolling smooth (60fps)
- [ ] No horizontal overflow

---

#### Task 3.3: Comprehensive Mobile Testing
**Devices to Test:**
- iPhone 16 (390x844) - iOS Safari
- iPhone SE (375x667) - iOS Safari (smallest modern iPhone)
- iPad (768x1024) - iOS Safari
- Samsung Galaxy S24 (360x800) - Chrome
- Google Pixel 8 (412x915) - Chrome

**Test Scenarios:**
1. **Filter Workflow**
   - [ ] Open filters via FAB
   - [ ] Select effects from each category
   - [ ] See real-time result count
   - [ ] Apply filters
   - [ ] Clear filters
   - [ ] Close sheet via swipe

2. **Table/Card Grid**
   - [ ] Card grid renders on mobile
   - [ ] No horizontal scroll needed
   - [ ] Cards show all content
   - [ ] Tap opens modal

3. **Modal Interaction**
   - [ ] Close button visible
   - [ ] Swipe down closes modal
   - [ ] Share button works
   - [ ] Content scrolls properly

4. **Performance**
   - [ ] Animations smooth (60fps)
   - [ ] No layout shift
   - [ ] Haptic feedback works
   - [ ] Touch targets ≥48px

---

## Technical Architecture

### New Components Structure

```
src/components/filters/
├── FilterControls.tsx (existing - refactor)
├── FilterFAB.tsx (new)
├── FilterBottomSheet.tsx (new)
└── FilterSection.tsx (new - extracted from FilterControls)
```

### State Management

**FilterState Interface:**
```typescript
interface FilterState {
  selectedEffects: string[];
  selectedCategories: string[];
  searchQuery: string;
}

interface FilterActions {
  setSelectedEffects: (effects: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSearchQuery: (query: string) => void;
  clearAllFilters: () => void;
}
```

**Home Page State:**
```typescript
const [filterState, setFilterState] = useState<FilterState>({
  selectedEffects: [],
  selectedCategories: [],
  searchQuery: '',
});
const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

const activeFilterCount = useMemo(() => 
  filterState.selectedEffects.length + 
  filterState.selectedCategories.length +
  (filterState.searchQuery ? 1 : 0),
  [filterState]
);
```

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Load `FilterBottomSheet` only when opened (React.lazy)
   - Defer non-critical animations

2. **Virtualization**
   - If effect lists >50 items, use virtual scrolling
   - Already implemented in TerpeneCardGrid

3. **Debouncing**
   - Search input: 300ms debounce
   - Filter changes: Update count in real-time, apply on close

4. **Animation Performance**
   - Use `transform` and `opacity` only (GPU-accelerated)
   - Avoid animating `height`, `width`, `top`, `left`
   - Use `will-change` sparingly

5. **Bundle Size**
   - FilterBottomSheet adds ~5KB gzipped
   - FilterFAB adds ~2KB gzipped
   - Total impact: <10KB (acceptable)

---

## Accessibility Checklist

### WCAG 2.1 Level AA Compliance

- [ ] All touch targets ≥48x48px (WCAG 2.5.5)
- [ ] Color contrast ≥4.5:1 for text (WCAG 1.4.3)
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Screen reader announcements:
  - [ ] FAB: "Open filters, 3 active"
  - [ ] Bottom sheet: "Filters dialog"
  - [ ] Result count: "12 terpenes match"
- [ ] Focus visible on all interactive elements
- [ ] Modal traps focus (can't tab outside)
- [ ] Close on ESC key
- [ ] Swipe gestures have keyboard alternatives

---

## Rollout Strategy

### Incremental Deployment

**Week 1: Critical Fixes**
- Day 1-2: Fix table scroll (Task 1.1)
- Day 2-3: Fix modal close button (Task 1.2)
- Day 3: Testing + Deploy to staging

**Week 2: Filter Redesign**
- Day 1-2: Build FilterFAB + FilterBottomSheet (Tasks 2.1, 2.2)
- Day 3: Refactor FilterControls (Task 2.3)
- Day 4: Integration (Task 2.4)
- Day 5: Testing + Deploy to staging

**Week 3: Polish**
- Day 1: Clear filters functionality (Task 3.1)
- Day 2: Fix effects scrolling (Task 3.2)
- Day 3-4: Comprehensive testing (Task 3.3)
- Day 5: Production deployment

### Feature Flags

Consider using feature flags for gradual rollout:
```typescript
const USE_MOBILE_FILTER_SHEET = process.env.VITE_FEATURE_MOBILE_FILTERS === 'true';

{isMobile && USE_MOBILE_FILTER_SHEET ? (
  <FilterFAB />
) : (
  <FilterControls />
)}
```

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Usability Metrics**
   - Task completion rate: >90% for "Find and filter terpene"
   - Error rate: <5% (users getting stuck/confused)
   - Time to complete filter task: <30 seconds

2. **Technical Metrics**
   - Lighthouse Mobile Score: ≥90
   - First Contentful Paint: <1.5s
   - Largest Contentful Paint: <2.5s
   - Cumulative Layout Shift: <0.1

3. **User Feedback**
   - UAT approval from test users
   - Zero critical bugs in production (P0/P1)
   - Positive qualitative feedback on filter UX

---

## Risk Assessment

### Potential Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| iOS Safari viewport bugs | High | Medium | Extensive iOS testing, use dvh units |
| Filter sheet performance on low-end devices | Medium | Low | Optimize animations, test on older devices |
| User confusion with new filter pattern | Medium | Low | Clear onboarding, familiar UI patterns |
| Regression in desktop experience | High | Low | Comprehensive testing, feature flags |
| Breaking changes to existing filters | High | Low | Careful refactoring, maintain API compatibility |

---

## References

### Design Systems & Guidelines
- [Material Design - Bottom Sheets](https://m3.material.io/components/bottom-sheets/overview)
- [Material Design - FAB Specifications](https://m3.material.io/components/floating-action-button/specs)
- [iOS Human Interface Guidelines - Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)
- [WCAG 2.1 - Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

### Inspiration (Mobile Filter UX)
- Airbnb iOS/Android app (bottom sheet filters)
- Amazon mobile app (filter drawer)
- Google Maps (bottom sheet POI filters)
- Zillow mobile (property filters)

### Technical Resources
- [React Material UI Drawer Documentation](https://mui.com/material-ui/react-drawer/)
- [CSS dvh Units for iOS Safari](https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport)
- [iOS Safe Area Insets](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

---

## Next Steps

1. **Review & Approval** (Priority: Immediate)
   - Team review of this plan
   - Stakeholder approval for filter UX redesign
   - Design mockups (optional, can use Material Design defaults)

2. **Task Creation** (Priority: This Week)
   - Create GitHub issues for each task
   - Assign priorities and estimates
   - Set up project board

3. **Implementation** (Priority: Start Week 1)
   - Begin with critical fixes (Phase 1)
   - Parallel work on filter redesign (Phase 2)
   - Final polish and testing (Phase 3)

4. **UAT Round 2** (Priority: End of Week 3)
   - Test with original UAT participants
   - Verify all issues resolved
   - Gather feedback on new filter UX

---

**Document Status**: ✅ Complete - Ready for Review  
**Last Updated**: 2025-11-03  
**Author**: Development Team  
**Reviewers**: TBD
