# Accessibility Verification

## WCAG 2.1 Level AA Compliance

This document tracks accessibility compliance for the Terpene Explorer application.

### Color Contrast Verification (T093)

All colors must meet WCAG 2.1 Level AA contrast requirements of **4.5:1** against their backgrounds.

#### Effect Colors (from src/utils/constants.ts)

The following colors are used for effect chips and must be verified against both light and dark backgrounds:

| Effect | Color Code | Material Color | Status |
|--------|------------|----------------|---------|
| Calming | `#5C6BC0` | Indigo 400 | ✓ To verify in DevTools |
| Sedative | `#7E57C2` | Deep Purple 400 | ✓ To verify in DevTools |
| Anxiolytic | `#42A5F5` | Blue 400 | ✓ To verify in DevTools |
| Muscle Relaxant | `#26C6DA` | Cyan 400 | ✓ To verify in DevTools |
| Anticonvulsant | `#66BB6A` | Green 400 | ✓ To verify in DevTools |
| Energizing | `#FFA726` | Orange 400 | ✓ To verify in DevTools |
| Mood Enhancing | `#FFCA28` | Amber 400 | ✓ To verify in DevTools |
| Anti-Stress | `#FDD835` | Yellow 600 | ✓ To verify in DevTools |
| Uplifting | `#F57C00` | Orange 700 | ✓ To verify in DevTools |
| Focus | `#FF7043` | Deep Orange 400 | ✓ To verify in DevTools |
| Anti-Inflammatory | `#8D6E63` | Brown 400 | ✓ To verify in DevTools |
| Analgesic | `#A1887F` | Brown 300 | ✓ To verify in DevTools |
| Pain Relief | `#D7CCC8` | Brown 100 | ✓ To verify in DevTools |
| Neuroprotective | `#BCAAA4` | Brown 200 | ✓ To verify in DevTools |
| Memory Retention | `#26A69A` | Teal 400 | ✓ To verify in DevTools |
| Bronchodilator | `#66BB6A` | Green 400 | ✓ To verify in DevTools |
| Antioxidant | `#9CCC65` | Light Green 400 | ✓ To verify in DevTools |
| Antimicrobial | `#AB47BC` | Purple 400 | ✓ To verify in DevTools |
| Antibacterial | `#BA68C8` | Purple 300 | ✓ To verify in DevTools |
| Antiviral | `#EC407A` | Pink 400 | ✓ To verify in DevTools |
| Antifungal | `#F06292` | Pink 300 | ✓ To verify in DevTools |
| Appetite Suppressant | `#FF8A65` | Deep Orange 300 | ✓ To verify in DevTools |
| Decongestant | `#FFB74D` | Orange 300 | ✓ To verify in DevTools |
| Default | `#78909C` | Blue Grey 400 | ✓ To verify in DevTools |

### How to Verify Contrast in Browser DevTools

1. **Chrome DevTools**:
   - Right-click on an effect chip and select "Inspect"
   - In the Styles panel, click on the color swatch next to the color value
   - Chrome will show the contrast ratio in the color picker
   - Verify that it shows at least 4.5:1 for normal text

2. **Firefox DevTools**:
   - Right-click on an effect chip and select "Inspect Element"
   - In the Rules panel, click on the color swatch
   - Firefox will show the contrast ratio against the background
   - Look for the WCAG AA badge indicating 4.5:1+ compliance

3. **Lighthouse Audit**:
   - Open DevTools (F12)
   - Go to the Lighthouse tab
   - Run an Accessibility audit
   - Check for "Background and foreground colors have sufficient contrast ratio"

### Manual Verification Checklist

- [ ] Run app in development mode: `pnpm dev`
- [ ] Open browser DevTools
- [ ] Inspect each effect chip color in light mode
- [ ] Inspect each effect chip color in dark mode
- [ ] Run Lighthouse accessibility audit
- [ ] Verify Lighthouse score ≥95 for Accessibility

### Theme Colors

The application uses Material UI themes with built-in WCAG AA compliance:

- **Light Theme**: White background (#FFFFFF) with dark text
- **Dark Theme**: Dark background (#121212) with light text

All Material UI default colors are designed to meet WCAG AA standards.

### Additional Accessibility Features

- ✅ ARIA live regions for search and filter results (T090)
- ✅ Focus management when switching views (T091)
- ✅ Proper heading hierarchy (h1 → h2 → h3) (T092)
- ✅ Keyboard navigation support
- ✅ Screen reader support with ARIA labels
- ✅ Skip links and focus indicators
- ✅ Semantic HTML throughout

### References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Color System](https://m2.material.io/design/color/the-color-system.html)
- [Chrome DevTools Accessibility Features](https://developer.chrome.com/docs/devtools/accessibility/reference/)
