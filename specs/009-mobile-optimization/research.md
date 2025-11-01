# Research: Mobile Optimization

**Feature**: `009-mobile-optimization`  
**Date**: 2025-11-01  
**Phase**: 0 (Research & Resolution)

This document resolves all "NEEDS CLARIFICATION" items from the Technical Context and researches best practices for mobile-first web development, PWA implementation, and performance optimization.

---

## Research Questions & Resolutions

### 1. Mobile Breakpoint Strategy

**Question**: What breakpoints should we use for mobile, tablet, and desktop?

**Decision**: Material UI's standard breakpoints with mobile-first approach

**Rationale**:
- Material UI default: xs=0, sm=600, md=960, lg=1280, xl=1920
- Aligns with industry standards and device statistics
- Mobile-first: design for smallest screen first, progressively enhance
- Target viewports: 280px-430px (mobile), 600px-1024px (tablet), 1024px+ (desktop)

**Alternatives Considered**:
- Custom breakpoints (e.g., 320, 768, 1024) — rejected: non-standard, increases complexity
- Bootstrap breakpoints — rejected: not aligned with Material UI

**Sources**:
- Material UI documentation: https://mui.com/material-ui/customization/breakpoints/
- StatCounter mobile device stats 2024

---

### 2. Touch Target Standards

**Question**: What minimum touch target size ensures accessibility?

**Decision**: 44x44px minimum (WCAG 2.1 AA), 48x48px recommended for primary actions

**Rationale**:
- WCAG 2.1 Level AA requires 44x44px minimum
- Apple HIG recommends 44pt (~44px), Material Design recommends 48dp
- Larger targets (48px+) reduce mis-taps and improve UX on mobile
- Padding/spacing between targets prevents accidental activation

**Alternatives Considered**:
- 40x40px — rejected: below WCAG AA threshold
- 56x56px for all — rejected: wastes screen space for secondary actions

**Sources**:
- WCAG 2.1 Success Criterion 2.5.5: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- Material Design Touch Target Guidelines

---

### 3. Performance Budget Tooling

**Question**: How do we enforce performance budgets in CI/CD?

**Decision**: Lighthouse CI with custom performance budgets

**Rationale**:
- Lighthouse CI integrates with GitHub Actions, provides score history
- Can fail builds if budgets exceeded
- Supports custom budgets for JS/CSS size, FCP, LCP, TTI metrics
- Free and widely adopted

**Implementation**:
```yaml
# lighthouserc.json
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
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Alternatives Considered**:
- WebPageTest API — rejected: requires external account, slower
- Custom bundle size plugin only — rejected: doesn't measure runtime performance

**Sources**:
- Lighthouse CI documentation: https://github.com/GoogleChrome/lighthouse-ci
- Web Vitals: https://web.dev/vitals/

---

### 4. PWA Service Worker Strategy

**Question**: Which service worker library/pattern should we use?

**Decision**: Workbox with vite-plugin-pwa for automated generation

**Rationale**:
- Workbox is Google's production-ready service worker library
- vite-plugin-pwa generates manifest and service worker automatically
- Supports multiple caching strategies (CacheFirst, NetworkFirst, StaleWhileRevalidate)
- Handles precaching of app shell and runtime caching of data
- Zero-config for basic PWA, extensible for advanced needs

**Implementation**:
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Terpene Explorer',
        short_name: 'Terpenes',
        description: 'Explore cannabis terpenes and their effects',
        theme_color: '#4caf50',
        background_color: '#121212',
        display: 'standalone',
        icons: [/* icon definitions */]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
});
```

**Alternatives Considered**:
- Manual service worker — rejected: error-prone, reinvents Workbox
- sw-precache (deprecated) — rejected: unmaintained
- Next.js PWA plugin — rejected: we use Vite, not Next.js

**Sources**:
- Workbox documentation: https://developers.google.com/web/tools/workbox
- vite-plugin-pwa: https://vite-pwa-org.netlify.app/

---

### 5. Virtual Scrolling Library

**Question**: How do we handle long lists (>50 items) performantly?

**Decision**: TanStack Virtual (formerly react-virtual) with Material UI integration

**Rationale**:
- Renders only visible items, dramatically improves performance for long lists
- Framework-agnostic, works with Material UI Grid/List
- Supports dynamic row heights (important for card heights varying by content)
- Lightweight (~3KB gzipped), actively maintained
- Smooth scrolling with momentum preservation

**Implementation**:
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function TerpeneCardGrid({ terpenes }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: terpenes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // estimated card height
    overscan: 5 // render extra items above/below viewport
  });

  return (
    <Box ref={parentRef} sx={{ height: '100vh', overflow: 'auto' }}>
      <Box sx={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const terpene = terpenes[virtualItem.index];
          return (
            <Box
              key={virtualItem.key}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <TerpeneCard terpene={terpene} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
```

**Alternatives Considered**:
- react-window — rejected: less flexible for dynamic heights, TanStack is successor
- Material UI built-in virtualization — rejected: limited, not as performant
- No virtualization — rejected: performance degrades significantly >100 items

**Sources**:
- TanStack Virtual: https://tanstack.com/virtual/latest
- Performance comparison: https://github.com/TanStack/virtual/discussions/268

---

### 6. Responsive Typography System

**Question**: How should typography scale across devices?

**Decision**: CSS clamp() for fluid typography with Material UI theme integration

**Rationale**:
- clamp() provides smooth scaling between min/max without JavaScript
- Better than media query breakpoints (eliminates jumps at breakpoints)
- Material UI theme supports clamp() in typography variants
- Improves readability: larger text on mobile, optimized for desktop
- Single source of truth in theme configuration

**Implementation**:
```typescript
// theme.ts
typography: {
  h1: { fontSize: 'clamp(2rem, 5vw, 2.5rem)' },     // 32px-40px
  h2: { fontSize: 'clamp(1.75rem, 4vw, 2rem)' },    // 28px-32px
  h3: { fontSize: 'clamp(1.5rem, 3.5vw, 1.75rem)' }, // 24px-28px
  body1: { fontSize: 'clamp(1rem, 2vw, 1rem)' },     // 16px
  button: { fontSize: 'clamp(0.875rem, 2vw, 1rem)' } // 14px-16px
}
```

**Alternatives Considered**:
- Fixed font sizes with media queries — rejected: creates visual jumps
- JavaScript-based scaling (react-textfit) — rejected: adds JS overhead, janky
- vw units only — rejected: can become too small/large at extremes

**Sources**:
- CSS clamp() MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
- Modern Fluid Typography: https://css-tricks.com/snippets/css/fluid-typography/

---

### 7. Gesture Library for Swipe Actions

**Question**: How do we implement swipe-to-close and pull-to-refresh gestures?

**Decision**: Material UI's SwipeableDrawer + custom hook for modal gestures

**Rationale**:
- Material UI SwipeableDrawer provides swipe-to-close for bottom sheets natively
- For modals, lightweight custom hook using touch events (no external library needed)
- React-spring for physics-based animations (already used by Material UI)
- Avoids heavy gesture libraries (Hammer.js, react-use-gesture) for simple use case

**Implementation**:
```tsx
// useSwipeToClose.ts
function useSwipeToClose(onClose: () => void, threshold = 100) {
  const [startY, setStartY] = useState(0);
  const [deltaY, setDeltaY] = useState(0);

  const handleTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const delta = currentY - startY;
    if (delta > 0) setDeltaY(delta);
  };

  const handleTouchEnd = () => {
    if (deltaY > threshold) onClose();
    setDeltaY(0);
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd, deltaY };
}
```

**Alternatives Considered**:
- Hammer.js — rejected: 21KB, overkill for simple swipe detection
- react-use-gesture — rejected: adds dependency, we only need basic swipe
- Framer Motion gestures — rejected: too heavy for this use case

**Sources**:
- Touch Events MDN: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
- Material UI SwipeableDrawer: https://mui.com/material-ui/react-drawer/#swipeable

---

### 8. Web Share API Fallback Strategy

**Question**: What fallback should we provide when Web Share API is unavailable?

**Decision**: Copy-to-clipboard with toast notification

**Rationale**:
- Web Share API not supported in desktop browsers (Chrome/Firefox/Safari desktop)
- Copy-to-clipboard works universally with Clipboard API
- Material UI Snackbar provides non-intrusive feedback
- Graceful degradation: native share on mobile, clipboard on desktop

**Implementation**:
```tsx
async function handleShare(terpene: Terpene) {
  const shareData = {
    title: terpene.name,
    text: `${terpene.name} - ${terpene.description}`,
    url: window.location.href
  };

  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share failed', err);
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`${terpene.name}\n${terpene.description}\n${window.location.href}`);
    showSnackbar('Link copied to clipboard!');
  }
}
```

**Alternatives Considered**:
- Share buttons for social networks — rejected: privacy concerns, adds external scripts
- Email mailto: link — rejected: poor UX, doesn't work on all devices
- No fallback — rejected: confusing for desktop users

**Sources**:
- Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard

---

### 9. Mobile Testing Strategy

**Question**: How do we test mobile layouts and interactions?

**Decision**: Playwright with mobile emulation + real device testing

**Rationale**:
- Playwright supports mobile viewports, touch events, geolocation, orientation
- Can test PWA install flow and offline functionality
- Real device testing (BrowserStack/manual) for final validation
- Playwright visual regression testing for layout shifts

**Implementation**:
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13']
      }
    },
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro']
      }
    }
  ]
});

// test example
test('mobile: swipe to close modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13
  await page.goto('/');
  await page.click('[data-testid="terpene-card"]');
  
  // Simulate swipe down gesture
  await page.mouse.move(200, 100);
  await page.mouse.down();
  await page.mouse.move(200, 400, { steps: 10 });
  await page.mouse.up();
  
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

**Alternatives Considered**:
- Cypress mobile testing — rejected: Playwright has better mobile support
- Manual testing only — rejected: not scalable, misses regressions
- Jest + React Testing Library only — rejected: can't test full mobile interactions

**Sources**:
- Playwright mobile emulation: https://playwright.dev/docs/emulation
- Playwright devices: https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json

---

### 10. Bundle Optimization Techniques

**Question**: How do we achieve <200KB JS, <50KB CSS bundle sizes?

**Decision**: Code splitting, tree-shaking, dynamic imports, and Vite manual chunking

**Rationale**:
- Vite provides automatic code splitting for routes
- Dynamic imports (React.lazy) defer non-critical components
- Manual chunk splitting separates vendor code from app code
- Material UI tree-shaking via named imports reduces bundle significantly
- CSS purging via PostCSS removes unused styles

**Implementation**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-utils': ['zod', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
});

// Lazy load components
const TerpeneDetailModal = lazy(() => import('./components/TerpeneDetailModal'));
const FilterBottomSheet = lazy(() => import('./components/FilterBottomSheet'));
```

**Analysis**:
- react + react-dom: ~45KB gzipped
- @mui/material (tree-shaken): ~80KB gzipped
- i18next: ~15KB gzipped
- App code: ~40KB gzipped (estimated)
- Total: ~180KB (within 200KB budget)

**Alternatives Considered**:
- No code splitting — rejected: single bundle too large
- Preact instead of React — rejected: breaks Material UI compatibility
- Custom UI components — rejected: increases bundle, decreases accessibility

**Sources**:
- Vite code splitting: https://vitejs.dev/guide/build.html#chunking-strategy
- Material UI tree-shaking: https://mui.com/material-ui/guides/minimizing-bundle-size/

---

## Technology Stack Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Framework** | React | 19.2+ | Component architecture, existing project |
| **UI Library** | Material UI | 6.3+ | Accessibility, mobile components, existing |
| **Styling** | Emotion | 11.13+ | Material UI dependency, CSS-in-JS |
| **Build Tool** | Vite | 6.0+ | Fast builds, code splitting, existing |
| **TypeScript** | TypeScript | 5.7+ | Type safety, existing project |
| **i18n** | i18next | 25+ | Existing localization setup |
| **PWA** | vite-plugin-pwa | 0.20+ | Automated service worker + manifest |
| **Service Worker** | Workbox | via plugin | Caching strategies, proven pattern |
| **Virtual Scrolling** | TanStack Virtual | 3.10+ | Performance for long lists |
| **Testing (Unit)** | Vitest | 2.1+ | Fast, Vite-native, existing |
| **Testing (E2E)** | Playwright | 1.48+ | Mobile emulation, existing |
| **Performance** | Lighthouse CI | 0.14+ | Automated performance gating |

---

## Best Practices Applied

### Mobile-First Design
1. Start with mobile viewport (360px), progressively enhance to desktop
2. Use `min-width` media queries, not `max-width`
3. Test on real devices early and often

### Touch Optimization
1. 44x44px minimum touch targets (WCAG AA)
2. 8px spacing between adjacent tappable elements
3. Visual feedback within 100ms of touch
4. Avoid hover-dependent interactions

### Performance
1. Lazy load below-the-fold content
2. Virtual scrolling for lists >50 items
3. Optimize images (WebP, lazy loading)
4. Critical CSS inlining for FCP
5. Bundle size budget enforcement

### PWA
1. Manifest with proper icons (192x192, 512x512)
2. Service worker for offline app shell
3. Cache-first for static assets, network-first for data
4. Install prompt at appropriate time (not immediately)

### Accessibility
1. ARIA labels on all interactive elements
2. Keyboard navigation (Tab, Enter, Esc)
3. Screen reader testing (VoiceOver, TalkBack)
4. Focus indicators visible (3:1 contrast)
5. Color not sole means of information

---

## Open Questions (for Phase 1)

1. **Navigation Drawer Content**: What links go in the hamburger menu beyond language switcher?
   - Tentative: Home, About, Settings, Feedback (if applicable)
   
2. **PWA Install Prompt Timing**: When should we show install prompt?
   - Tentative: After 30 seconds of engagement OR after viewing 3 terpenes
   
3. **Offline Message**: What should we show when user is offline?
   - Tentative: Subtle banner at top: "You're offline. Some features may be limited."

4. **Share Content Format**: What text should be shared?
   - Tentative: `{Terpene Name}\n{Description}\n{URL}`

These will be resolved during Phase 1 design.

---

## Dependency Note: Therapeutic Modal Refactor

**IMPORTANT**: Feature `008-therapeutic-modal-refactor` is refactoring the `TerpeneDetailModal` component with:
- Basic View / Expert View toggle
- Categorized effects (Mood & Energy, Cognitive, Relaxation, Physical)
- Therapeutic properties as clickable chips
- Accordion sections in Expert View
- Color-coded therapeutic domains

**Mobile Optimization Strategy**:
1. Build ON TOP of the refactored modal (don't replace it)
2. Add mobile-specific enhancements:
   - Full-screen mode on mobile (< 600px)
   - Slide-up transition animation
   - Swipe-to-close gesture
   - Web Share API button
   - Stack toggle buttons vertically on narrow screens
3. Preserve all therapeutic-focused features
4. Ensure touch targets ≥48px for toggle buttons
5. Test accordion interactions work with swipe gestures

**Implementation Order**: Complete 008-therapeutic-modal-refactor FIRST, then add mobile optimizations.

---

**Status**: ✅ Research complete — ready for Phase 1 (Design & Contracts)
