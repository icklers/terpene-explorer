# Mobile UAT Issues - Action Plan Summary

**Feature:** `009-mobile-optimization`
**Date:** 2025-11-03
**Status:** UAT Issues - Immediate Action Required

## Issues Summary

### 🔴 Critical Issues

1. **Modal Close Button Not Visible** (Issue #4)
   - Close button (X) not visible at normal zoom on iPhone 16
   - Users trapped in modal, cannot navigate back
   - **Fix:** iOS safe area insets + proper viewport height units

2. **Cannot Clear Filters** (Issue #2)
   - Clear/reset button not visible on mobile
   - Users stuck with applied filters
   - **Fix:** Add visible clear button in mobile filter UI

### 🟠 High Priority Issues

3. **Table Not Scrollable Horizontally** (Issue #1)
   - Effects column cut off on mobile
   - **Fix:** Expand breakpoint to show card grid on tablets

4. **Effects Filter Section Not Showing** (Issue #3)
   - Filter by Effects section appears empty
   - **Fix:** Enable scrolling in accordion panels

## Recommended Solution: Mobile Filter Redesign

### Why Redesign Filters for Mobile?

Current inline filter layout doesn't work on mobile because:

- Takes too much vertical space
- Not scrollable in sections
- No clear way to reset/clear
- Difficult thumb reach for controls

### Industry Best Practice: FAB + Bottom Sheet

**What leading apps do (Airbnb, Amazon, Google Maps):**

```
Mobile Screen:
┌─────────────────────┐
│  [Header]           │
│                     │
│  [Content]          │
│  [Terpene Cards]    │
│                     │
│              [🔍]   │ ← FAB with badge
└─────────────────────┘
        ↓ Tap FAB
┌─────────────────────┐
│  ══ Drag Handle     │
│  Filters      [×]   │
│─────────────────────│
│  😊 🧠 😌 💪       │ ← Category tabs
│                     │
│  ▼ Mood & Energy    │ ← Accordions
│    ☐ Happy          │
│    ☐ Euphoric       │
│    ... (scrollable) │
│                     │
│  12 terpenes match  │ ← Live count
│─────────────────────│
│ [Clear] [Apply]     │ ← Sticky footer
└─────────────────────┘
```

**Benefits:**

- ✅ Saves screen space (filters hidden until needed)
- ✅ Optimized for thumb zone (bottom interaction)
- ✅ Clear escape hatches (swipe, backdrop, buttons)
- ✅ Real-time feedback (result count, badge)
- ✅ Familiar pattern (Material Design standard)

## Implementation Tasks

### Phase 1: Critical Fixes (2-3 days)

#### Task 1.1: Fix Table Scroll Issue

**File:** `src/components/visualizations/TerpeneTable.tsx`

**Change:**

```typescript
// Line 89: Change breakpoint from 'sm' to 'md'
const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Was: 'sm'
```

**Why:** Ensures card grid on all mobile/tablet devices (≤960px)

#### Task 1.2: Fix Modal Close Button

**File:** `src/components/TerpeneDetailModal.tsx`

**Changes:**

```typescript
<Dialog
  fullScreen={isMobile}
  PaperProps={{
    sx: {
      height: isMobile ? '100dvh' : 'auto', // Dynamic viewport
      paddingTop: 'env(safe-area-inset-top)', // iOS notch
      paddingBottom: 'env(safe-area-inset-bottom)', // iOS home indicator
    }
  }}
>
  <MuiAppBar position="sticky"> {/* Was: "static" */}
    <Toolbar sx={{ minHeight: 56 }}>
      <IconButton 
        edge="start" 
        onClick={onClose}
        sx={{ minWidth: 48, minHeight: 48 }} // Explicit touch target
      >
        <CloseIcon />
      </IconButton>
```

**Why:** Fixes iOS Safari viewport issues, ensures button always visible

### Phase 2: Filter UX Redesign (3-5 days)

#### Task 2.1: Create FilterFAB Component

**New File:** `src/components/filters/FilterFAB.tsx`

**Features:**

- Floating Action Button with filter icon
- Badge showing active filter count
- Fixed bottom-right position (16px margins)
- Haptic feedback on tap
- 56x56px touch target (Material Design spec)

#### Task 2.2: Create FilterBottomSheet Component

**New File:** `src/components/filters/FilterBottomSheet.tsx`

**Features:**

- Material UI Drawer (`anchor="bottom"`)
- 85vh max height
- Drag handle at top
- Swipe-to-dismiss gesture
- Three sections: Header, Scrollable Content, Sticky Footer
- Real-time result count
- Clear All + Apply buttons

#### Task 2.3: Refactor FilterControls for Mobile

**File:** `src/components/filters/FilterControls.tsx`

**Changes:**

- Extract effect sections to separate component
- Fix scrolling in accordions (`maxHeight: 300px`, `overflowY: auto`)
- Add responsive layout detection
- Mobile: Simplified version for BottomSheet
- Desktop: Keep current inline layout

#### Task 2.4: Integrate in Home Page

**File:** `src/pages/Home.tsx`

**Logic:**

```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

return (
  <>
    {/* Desktop: Inline filters */}
    {!isMobile && <FilterControls {...props} />}

    {/* Mobile: FAB + Bottom Sheet */}
    {isMobile && (
      <>
        <FilterFAB 
          activeCount={activeFilterCount}
          onClick={() => setSheetOpen(true)}
        />
        <FilterBottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          {...props}
        />
      </>
    )}
  </>
);
```

### Phase 3: Polish & Testing (1-2 days)

#### Task 3.1: Add Clear Filters Functionality

- Desktop: Visible "Clear All" button in FilterControls
- Mobile: "Clear All" button in BottomSheet footer
- Visual feedback: Snackbar "Filters cleared"

#### Task 3.2: Fix Effects Section Scrolling

- Add `maxHeight: 300px` to accordion details
- Enable `overflowY: auto`
- Add scroll shadow indicators

#### Task 3.3: Comprehensive Testing

**Devices:**

- iPhone 16 (390x844) - iOS Safari
- iPhone SE (375x667) - iOS Safari
- iPad (768x1024) - iOS Safari
- Samsung Galaxy S24 - Chrome
- Google Pixel 8 - Chrome

**Test Scenarios:**

- Filter workflow (open, select, apply, clear)
- Table/card grid rendering
- Modal interaction (close, swipe, share)
- Performance (60fps animations, haptics)

## Success Criteria

- [ ] All 4 UAT issues resolved
- [ ] Card grid renders on all mobile devices (no table scroll)
- [ ] Modal close button visible at 100% zoom on iOS
- [ ] Filters accessible and clearable on mobile
- [ ] Effects section scrollable
- [ ] Lighthouse Mobile Score ≥90
- [ ] Touch targets ≥48px (WCAG AA)
- [ ] UAT approval from test users

## Timeline

- **Week 1:** Critical fixes (Tasks 1.1, 1.2) + Testing
- **Week 2:** Filter redesign (Tasks 2.1-2.4)
- **Week 3:** Polish (Tasks 3.1-3.3) + Production deployment

## Next Steps

1. **Review this plan** with team
2. **Create GitHub issues** for each task
3. **Start Phase 1** (critical fixes) immediately
4. **Design review** (optional) for filter UX before Phase 2
5. **Schedule UAT Round 2** after Phase 3 completion

## References

- [Material Design - Bottom Sheets](https://m3.material.io/components/bottom-sheets/overview)
- [Material Design - FAB](https://m3.material.io/components/floating-action-button/specs)
- [iOS Safe Area Insets](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [WCAG Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

---

**Status:** ✅ Plan Complete - Ready for Implementation
**Last Updated:** 2025-11-03
