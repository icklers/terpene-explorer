# Quickstart: Mobile Optimization Development

**Feature**: `009-mobile-optimization`  
**Last Updated**: 2025-11-01

This guide helps developers get started with implementing and testing the mobile optimization features.

---

## Prerequisites

- Node.js 24+ LTS
- pnpm 8+
- Modern web browser (Chrome 120+, Safari 17+, Firefox 121+)
- Mobile device or browser DevTools for testing

---

## Setup

### 1. Install Dependencies

```bash
cd /home/si/dev/terpene-explorer
pnpm install
```

### 2. Add Mobile-Specific Dependencies

```bash
# PWA support
pnpm add -D vite-plugin-pwa workbox-window

# Virtual scrolling
pnpm add @tanstack/react-virtual

# Already installed (verify):
# - @mui/material@6.3+
# - @emotion/react@11.13+
# - react@19.2+
# - i18next@25+
```

### 3. Start Development Server

```bash
pnpm run dev
```

App runs at `http://localhost:5173`

---

## Development Workflow

### Phase 1: Foundation (Week 1)

#### Task 1: Mobile AppBar

**Files to create/modify**:
- `src/components/layout/AppBar.tsx`

**Implementation**:
1. Add `useMediaQuery(theme.breakpoints.down('sm'))` hook
2. Create mobile layout with:
   - Hamburger menu button (left)
   - App logo or expanded search (center)
   - Search + settings icons (right)
3. Add settings bottom sheet (Material UI `Drawer` with `anchor="bottom"`)
4. Add expandable search state

**Testing**:
```bash
# Unit tests
pnpm vitest src/components/layout/AppBar.test.tsx

# Visual check
# Open http://localhost:5173 and resize browser to mobile width (360px)
```

**Acceptance**:
- [x] Header height is 56px on mobile
- [x] All touch targets ≥44x44px
- [x] Search expands on tap, collapses on close
- [x] Settings open in bottom sheet with drag handle

---

#### Task 2: Terpene Card Grid

**Files to create**:
- `src/components/visualizations/TerpeneCardGrid.tsx`
- `src/components/visualizations/TerpeneCardGrid.test.tsx`

**Files to modify**:
- `src/components/visualizations/TerpeneTable.tsx` (add mobile detection)

**Implementation**:
1. Create card component with:
   - Terpene name (H6)
   - Aroma (Body2)
   - Top 3 effect chips
   - "+X more" indicator
2. Use Material UI `Grid` for layout (xs=12, sm=6)
3. Add tap feedback animation (scale 0.98)
4. Integrate TanStack Virtual when `terpenes.length > 50`

**Testing**:
```bash
# Unit test
pnpm vitest src/components/visualizations/TerpeneCardGrid.test.tsx

# E2E test
pnpm playwright test tests/e2e/mobile-browsing.spec.ts
```

**Acceptance**:
- [x] No horizontal scrolling on 360px viewport
- [x] Cards display name, aroma, effects
- [x] Tapping card triggers `onTerpeneClick`
- [x] Smooth scrolling with >50 items

---

#### Task 3: Full-Screen Detail Modal

**PREREQUISITE**: Complete `008-therapeutic-modal-refactor` FIRST. This task adds mobile enhancements to the refactored modal.

**Files to modify**:
- `src/components/visualizations/TerpeneDetailModal.tsx`

**Implementation**:
1. Add `fullScreen={isMobile}` prop to `Dialog` (preserve Basic/Expert view logic)
2. Change `TransitionComponent` to `Slide` with `direction="up"` on mobile
3. Replace `DialogTitle` with custom `AppBar` on mobile (includes share button)
4. Add swipe-to-close gesture (custom hook, ensure doesn't conflict with accordion swipes)
5. Stack Basic/Expert toggle buttons vertically on narrow screens (<400px)
6. Ensure all toggle buttons and chips meet 48x48px touch target minimum

**Testing**:
```bash
# E2E test with gesture
pnpm playwright test tests/e2e/mobile-browsing.spec.ts --grep "swipe to close"

# Test therapeutic modal features still work
pnpm playwright test tests/e2e/therapeutic-modal.spec.ts --project="Mobile Chrome"
```

**Acceptance**:
- [x] Modal is full-screen on mobile (<600px)
- [x] Slides up from bottom in <300ms
- [x] Share button works (Web Share API or fallback)
- [x] Swipe down closes modal (doesn't interfere with accordion interactions)
- [x] Basic/Expert toggle works on mobile with proper touch targets
- [x] Categorized effects display correctly on mobile

---

### Phase 2: Enhancement (Week 2)

#### Task 4: Filter Bottom Sheet

**Files to create**:
- `src/components/filters/FilterBottomSheet.tsx`
- `src/components/filters/FilterBottomSheet.test.tsx`

**Files to modify**:
- `src/pages/Home.tsx` (add FAB + sheet integration)

**Implementation**:
1. Create `Drawer` with `anchor="bottom"`
2. Add drag handle (40x4px, centered)
3. Show real-time results count: "X terpenes match"
4. Category tabs (collapsed accordions on mobile)
5. Sticky "Apply" button at bottom

**Testing**:
```bash
# E2E flow
pnpm playwright test tests/e2e/mobile-filters.spec.ts
```

**Acceptance**:
- [x] FAB visible in bottom-right with badge count
- [x] Sheet slides up with drag handle
- [x] Results count updates in real-time
- [x] Apply closes sheet and filters results

---

#### Task 5: Responsive Theme

**Files to modify**:
- `src/theme/darkTheme.ts`
- `src/theme/lightTheme.ts`

**Implementation**:
1. Add responsive typography using `clamp()`:
   ```typescript
   h1: { fontSize: 'clamp(2rem, 5vw, 2.5rem)' }
   ```
2. Add component overrides for touch targets:
   ```typescript
   MuiButton: {
     styleOverrides: {
       root: {
         '@media (max-width:600px)': {
           minHeight: 48
         }
       }
     }
   }
   ```
3. Update chip, icon button sizes for mobile

**Testing**:
```bash
# Visual regression (if configured)
pnpm playwright test --update-snapshots
```

**Acceptance**:
- [x] Font sizes scale smoothly across viewports
- [x] Buttons ≥48px height on mobile
- [x] Touch targets meet 44px minimum

---

### Phase 3: PWA & Polish (Week 3)

#### Task 6: PWA Setup

**Files to create/modify**:
- `vite.config.ts` (add vite-plugin-pwa)
- `public/manifest.json` (update with mobile icons)
- `public/icon-192x192.png`
- `public/icon-512x512.png`

**Implementation**:
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Terpene Explorer',
        short_name: 'Terpenes',
        theme_color: '#4caf50',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ]
});
```

**Testing**:
```bash
# Build and preview
pnpm build
pnpm preview

# Check PWA in Chrome DevTools > Application > Manifest
# Test offline: DevTools > Network > Offline
```

**Acceptance**:
- [x] App is installable (Add to Home Screen)
- [x] App works offline (previously viewed data)
- [x] Manifest valid (Lighthouse audit)

---

#### Task 7: Lighthouse CI

**Files to create**:
- `lighthouserc.json`
- `.github/workflows/ci.yml` (update)

**Configuration**:
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:5173"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1500}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}]
      }
    }
  }
}
```

**Testing**:
```bash
# Local Lighthouse run
pnpm build
pnpm preview &
npx @lhci/cli@latest autorun

# Check scores
# Performance: ≥90
# Accessibility: ≥95
```

---

## Testing Guide

### Unit Tests (Vitest)

Run all unit tests:
```bash
pnpm vitest
```

Run specific component test:
```bash
pnpm vitest src/components/layout/AppBar.test.tsx
```

Watch mode:
```bash
pnpm vitest --watch
```

Coverage:
```bash
pnpm vitest --coverage
```

---

### E2E Tests (Playwright)

Run all E2E tests:
```bash
pnpm playwright test
```

Run mobile tests only:
```bash
pnpm playwright test tests/e2e/mobile-*.spec.ts
```

Run specific device:
```bash
pnpm playwright test --project="Mobile Chrome"
```

Debug mode:
```bash
pnpm playwright test --debug
```

Show report:
```bash
pnpm playwright show-report
```

---

### Accessibility Testing

Automated (jest-axe):
```bash
pnpm vitest tests/unit/accessibility/*.test.tsx
```

Manual (screen readers):
1. **VoiceOver (macOS/iOS)**:
   - Enable: System Preferences > Accessibility > VoiceOver
   - Navigate: Cmd+Option+Arrow keys
   
2. **TalkBack (Android)**:
   - Enable: Settings > Accessibility > TalkBack
   - Navigate: Swipe left/right

Check list:
- [ ] All interactive elements announced
- [ ] Headings form logical hierarchy
- [ ] Focus order matches visual order
- [ ] Form inputs have labels

---

### Performance Testing

Local Lighthouse:
```bash
# Build production bundle
pnpm build

# Start preview server
pnpm preview &

# Run Lighthouse
npx lighthouse http://localhost:4173 --view
```

Bundle analysis:
```bash
# Build with visualization
pnpm build

# Check dist/ folder sizes
ls -lh dist/assets/

# Analyze chunks
npx vite-bundle-visualizer
```

---

## Mobile Testing

### Browser DevTools

**Chrome DevTools**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device: "Pixel 5" or "iPhone 13"
4. Test gestures: Enable touch simulation

**Safari Responsive Design Mode**:
1. Develop > Enter Responsive Design Mode
2. Select device from presets
3. Test touch interactions

---

### Real Devices

**iOS (Safari)**:
1. Connect iPhone via USB
2. Enable Web Inspector: Settings > Safari > Advanced > Web Inspector
3. Open Safari on Mac > Develop > [Your iPhone] > localhost:5173

**Android (Chrome)**:
1. Enable Developer Options on Android
2. Enable USB Debugging
3. Connect via USB
4. Chrome DevTools > Remote Devices > localhost:5173

---

## Common Issues

### Issue: Touch targets too small

**Solution**: Check component styles have `@media (max-width:600px)` overrides for `minHeight: 48px`

---

### Issue: Horizontal scrolling on mobile

**Solution**: 
1. Check `Container` has proper `maxWidth`
2. Ensure no fixed-width elements exceed viewport
3. Use `overflow-x: hidden` if needed

---

### Issue: Animations janky

**Solution**:
1. Only animate `transform` and `opacity` (GPU-accelerated)
2. Add `will-change: transform` for smooth transitions
3. Limit to 60fps (16ms per frame)

---

### Issue: PWA not installing

**Solution**:
1. Verify manifest.json is valid (Chrome DevTools > Application)
2. Ensure HTTPS (or localhost)
3. Check service worker registered (Application > Service Workers)
4. Wait for `beforeinstallprompt` event

---

## Useful Commands

```bash
# Type check
pnpm run type-check

# Lint
pnpm run lint

# Format
pnpm run format

# Build
pnpm run build

# Preview production build
pnpm run preview

# Run all checks
pnpm run type-check && pnpm run lint && pnpm vitest --run && pnpm playwright test
```

---

## Resources

- [Material UI Breakpoints](https://mui.com/material-ui/customization/breakpoints/)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Playwright Mobile Emulation](https://playwright.dev/docs/emulation)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Questions?** Check [plan.md](./plan.md) for architecture details or [research.md](./research.md) for technology decisions.
