# Implementation Plan: Mobile Optimization

**Branch**: `009-mobile-optimization` | **Date**: 2025-11-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/009-mobile-optimization/spec.md` + `.idea/mobile-optimization-proposal.md`

## Summary

Transform Terpene Explorer into a mobile-first web application by implementing responsive layouts, touch-optimized interactions, a card-based browsing interface, full-screen modals, and bottom-sheet filters. The app will meet WCAG 2.1 AA standards, achieve Lighthouse Performance ≥90, and function as an installable Progressive Web App with offline support.

## Technical Context

**Language/Version**: TypeScript 5.7+, React 19.2+  
**Primary Dependencies**: Material UI 6.3+, Emotion 11.13+, i18next 25+, vite-plugin-pwa 0.20+, TanStack Virtual 3.10+  
**Storage**: Static JSON files in `/data` directory (client-side only)  
**Testing**: Vitest (unit), Playwright (E2E + mobile emulation), jest-axe (accessibility), Lighthouse CI (performance)  
**Target Platform**: Modern web browsers on mobile (Chrome 120+, Safari 17+, Samsung 23+, Firefox 121+, Edge 120+)  
**Project Type**: Web application (frontend only, Vite SPA)

**Performance Goals**: Lighthouse ≥90, FCP <1.5s, LCP <2.5s, TTI <5s, 60fps animations, <200ms filter response  
**Constraints**: JS bundle ≤200KB, CSS ≤50KB, total ≤500KB, 44px touch targets, 4.5:1 contrast ratio  
**Scale/Scope**: ~50-200 terpenes, 1000+ concurrent users, 280px-1024px viewports, 3-week delivery

## Constitution Check

✅ **Gate 1: Accessibility Requirements**

- [x] WCAG 2.1 Level AA compliance documented (44px touch targets, 4.5:1 contrast)
- [x] Keyboard navigation plan documented (Tab, Enter, Esc for modals, Arrow keys)
- [x] Screen reader support (ARIA labels, semantic HTML, live regions for dynamic content)
- [x] jest-axe included in test strategy + manual VoiceOver/TalkBack testing

✅ **Gate 2: Performance Budgets**

- [x] Lighthouse score targets: Performance ≥90, Accessibility ≥95
- [x] Response time targets: filters <200ms, visualization renders <500ms
- [x] Bundle size budgets: ~200KB JS, ~50KB CSS, ~500KB total
- [x] Virtualization plan: TanStack Virtual for lists >50 items

✅ **Gate 3: Testing Strategy**

- [x] Unit tests: Vitest for components, hooks, utils
- [x] E2E tests: Playwright with mobile device emulation (Pixel 5, iPhone 13, iPad Pro)
- [x] Accessibility: jest-axe automated + manual screen reader validation
- [x] Coverage target: ≥80% for critical paths (components, services, filters)

✅ **Gate 4: Component Reuse**

- [x] Material UI components: AppBar, Drawer, Dialog, Card, Chip, FAB, Button, IconButton
- [x] Custom components justified: TerpeneCardGrid (mobile card layout), FilterBottomSheet (mobile filter UX)
- [x] No reinvention: using MUI SwipeableDrawer, Dialog, Grid instead of custom implementations

✅ **Gate 5: Static Architecture**

- [x] No backend server (static site deployment)
- [x] Data source: `/data/terpene-database.json` and `/data/terpene-translations-de.json`
- [x] Deployment: Vercel/Netlify/GitHub Pages (static hosting)
- [x] No database, no API endpoints

✅ **Gate 6: Internationalization**

- [x] i18next library (existing setup maintained)
- [x] Supported languages: English (en), German (de)
- [x] Translation files: `src/i18n/locales/{en,de}/translation.json`
- [x] No hard-coded strings (all UI text uses `t()` function)

**Post-Research Status**: ✅ All gates passed. Research complete (see [research.md](./research.md)). Ready for Phase 1 design.

## Project Structure

### Documentation (this feature)

```text
specs/009-mobile-optimization/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 (technology decisions, best practices) ✅ Complete
├── data-model.md        # Phase 1 (mobile UI entities and state)
├── quickstart.md        # Phase 1 (developer onboarding guide)
├── contracts/           # Phase 1 (component APIs)
│   ├── AppBar.contract.ts
│   ├── TerpeneCardGrid.contract.ts
│   ├── FilterBottomSheet.contract.ts
│   └── TerpeneDetailModal.contract.ts
├── tasks.md             # Granular implementation tasks ✅ Complete
└── checklists/
    └── requirements.md  # Spec quality checklist ✅ Complete
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppBar.tsx                    # 🆕 Mobile-aware header with navigation drawer
│   │   └── Footer.tsx                    # 🆕 Version display + GitHub link
│   ├── visualizations/
│   │   ├── TerpeneCardGrid.tsx           # 🆕 Mobile card grid view
│   │   ├── TerpeneDetailModal.tsx        # 🔄 Add mobile full-screen mode + swipe-to-close
│   │   └── TerpeneTable.tsx              # 🔄 Integrate card grid for mobile
│   └── filters/
│       └── FilterBottomSheet.tsx         # 🆕 Mobile filter interface (Material UI Drawer)
├── pages/
│   └── Home.tsx                           # 🔄 Add FAB + bottom sheet integration
├── theme/
│   ├── darkTheme.ts                       # 🔄 Add responsive typography + touch targets
│   └── lightTheme.ts                      # 🔄 Add responsive typography + touch targets
├── hooks/
│   ├── useMediaBreakpoints.ts             # 🆕 Custom breakpoint hooks
│   ├── useSwipeToClose.ts                 # 🆕 Swipe gesture detection with velocity threshold
│   ├── useShare.ts                        # 🆕 Web Share API with fallback
│   └── useSearchDebounce.ts               # 🆕 300ms search debouncing
└── utils/
    └── pwa.ts                             # 🆕 PWA install prompts, offline detection

tests/
├── unit/
│   ├── components/
│   │   ├── AppBar.test.tsx                # 🆕 Mobile header tests
│   │   ├── TerpeneCardGrid.test.tsx       # 🆕 Card grid tests
│   │   └── FilterBottomSheet.test.tsx     # 🆕 Bottom sheet tests
│   └── hooks/
│       ├── useSwipeToClose.test.ts        # 🆕 Gesture tests
│       └── useShare.test.ts               # 🆕 Share API tests
├── integration/
│   └── mobile-filters.test.tsx            # 🆕 Filter integration tests
└── e2e/
    ├── mobile-browsing.spec.ts            # 🆕 Card grid + modal E2E
    ├── mobile-filters.spec.ts             # 🆕 Filter bottom sheet E2E
    └── pwa-install.spec.ts                # 🆕 PWA installation flow E2E

public/
├── manifest.json                          # 🔄 Update with mobile icons
├── icon-192x192.png                       # 🆕 PWA icon
├── icon-512x512.png                       # 🆕 PWA icon
└── sw.js                                  # 🆕 Service worker (auto-generated by vite-plugin-pwa)

vite.config.ts                             # 🔄 Add vite-plugin-pwa, manual chunking
lighthouserc.json                          # 🆕 Lighthouse CI configuration
.github/workflows/
└── ci.yml                                 # 🔄 Add Lighthouse CI step
```

**Structure Decision**: Web application (frontend only). Updating existing React components with mobile-responsive behavior via Material UI breakpoints. New mobile-specific components (CardGrid, FilterBottomSheet) isolate mobile UX patterns without affecting desktop code. No backend changes required.

## Complexity Tracking

> No constitution violations. All gates passed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| _None_    | N/A        | N/A                                  |
