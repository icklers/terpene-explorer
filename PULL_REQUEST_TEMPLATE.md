## Feature: Comfortably Dark Theme System

Implements a WCAG 2.1 Level AA compliant dark theme with floating card design for improved eye strain reduction and professional appearance.

### Summary of Changes

This PR implements the complete dark theme system as specified in feature 004-dark-theme-design, including:

1. **Theme Configuration Updates**:
   - Updated darkTheme.ts with WCAG 2.1 Level AA compliant color palette
   - Implemented floating card design with 8px border radius and elevation
   - Added effect-specific colors for filter chips with dual indicator pattern

2. **Component Styling Updates**:
   - AppBar: Sticky positioning with dark green background (#388e3c) and box-shadow
   - FilterControls: Floating card styling with proper padding and spacing
   - TerpeneTable: Zebra striping, hover states, and selection indicators
   - ViewModeToggle: Active state highlighting with bright green (#4caf50)
   - SearchBar: Focus indicators with vibrant orange (#ffb300)

3. **Accessibility Enhancements**:
   - Dual indicator pattern for filter chips to prevent layout shift
   - Clear focus indicators with orange (#ffb300) for keyboard navigation
   - Zebra striping for table rows with odd/even background differentiation
   - Hover and selection states for improved interactivity feedback
   - Proper ARIA labels and semantic HTML throughout

4. **Testing**:
   - Added comprehensive unit tests for theme configuration
   - Created integration tests for all interactive components
   - Verified WCAG 2.1 Level AA compliance with automated testing

### Implementation Details

#### Floating Card Design

- All major UI elements (filter cards, tables, detail cards) use floating cards with:
  - 8px border radius (theme.shape.borderRadius)
  - Box-shadow elevation (0 4px 8px rgba(0,0,0,0.3))
  - 24px spacing between cards (theme.spacing(3))
  - Responsive padding (16px mobile, 32px desktop)

#### Color Palette

- Main background: #121212 (very dark gray)
- Card surface: #1e1e1e (slightly lighter for contrast)
- Structural branding: #388e3c (dark green)
- Active interaction: #4caf50 (bright green)
- Focus/selection: #ffb300 (vibrant orange)
- Text: #ffffff (white) and rgba(255,255,255,0.7) (secondary)

#### Filter Chip Dual Indicator Pattern

To prevent layout shift when toggling between selected/unselected states:

- Selected chips: Light elevated background (rgba(255,255,255,0.16)) with green border (#4caf50)
- Unselected chips: Dark card surface background (#1e1e1e) with transparent border
- Both states use 2px solid border to maintain consistent sizing

#### Table Interactions

- Zebra striping: Odd rows with subtle darker background (rgba(255,255,255,0.08))
- Hover states: Lighter background (rgba(255,255,255,0.16)) with CSS transition
- Selection indicators: 4px vibrant orange (#ffb300) left border
- Keyboard navigation: Clear focus indicators with orange outline

### Deviations from Specification

There are no significant deviations from the specification. All requirements have been implemented as specified:

1. ✅ WCAG 2.1 Level AA compliance verified
2. ✅ Floating card design with 8px border radius
3. ✅ Dark green structural branding (#388e3c)
4. ✅ Bright green active interactions (#4caf50)
5. ✅ Vibrant orange focus/selection indicators (#ffb300)
6. ✅ Dual indicator pattern for filter chips
7. ✅ Zebra striping for table rows
8. ✅ Responsive padding (16px mobile, 32px desktop)

The implementation follows the specification exactly, with all color values, styling patterns, and accessibility features implemented as
required.

### Testing Verification

- ✅ Unit tests for theme configuration pass
- ✅ Integration tests for interactive components pass
- ✅ Type checking passes with no errors
- ✅ Linting passes with no issues
- ✅ Formatting check passes
- ✅ Manual verification of visual states and interactions
- ✅ Accessibility testing with Chrome DevTools contrast checker
- ✅ Keyboard navigation testing
- ✅ Focus indicator visibility testing
- ✅ Responsive design testing on mobile and desktop viewports

### Performance Considerations

- ✅ CSS transitions used for hover effects (100ms duration)
- ✅ Efficient rendering with proper React.memo usage
- ✅ Minimal re-renders with optimized state management
- ✅ Lightweight theme configuration with no unnecessary dependencies

### Accessibility Compliance

- ✅ WCAG 2.1 Level AA contrast ratios verified for all text/background combinations
- ✅ Focus indicators visible for keyboard navigation
- ✅ Screen reader support with proper ARIA labels
- ✅ Semantic HTML structure throughout
- ✅ Color-independent indicators (shapes, positions) in addition to color
- ✅ Proper heading hierarchy maintained
- ✅ Skip links and focus management implemented

### Documentation Updates

- ✅ ACCESSIBILITY.md updated with new theme contrast ratios
- ✅ Theme contract documentation updated
- ✅ Component documentation updated with styling details

Closes #[issue number]
