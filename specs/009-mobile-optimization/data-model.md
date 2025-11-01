# Data Model: Mobile Optimization

**Feature**: `009-mobile-optimization`  
**Date**: 2025-11-01  
**Phase**: 1 (Design)

This document defines the mobile UI entities, component state, and data transformations required for the mobile-optimized interface.

---

## Mobile UI State Entities

### 1. Mobile Viewport State

Tracks current viewport characteristics to determine mobile vs tablet vs desktop rendering.

```typescript
interface ViewportState {
  /** Current viewport width in pixels */
  width: number;
  
  /** Current viewport height in pixels */
  height: number;
  
  /** Device orientation */
  orientation: 'portrait' | 'landscape';
  
  /** Breakpoint classification */
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  
  /** Whether user is on a touch-enabled device */
  isTouchDevice: boolean;
}
```

**Source**: Window resize events, `matchMedia` API, `navigator.maxTouchPoints`

---

### 2. Mobile Search State

Manages expandable search UI for mobile header.

```typescript
interface MobileSearchState {
  /** Whether search input is expanded in mobile header */
  isExpanded: boolean;
  
  /** Current search query text */
  query: string;
  
  /** Whether search has focus */
  isFocused: boolean;
}
```

**Lifecycle**:
- Initial: `isExpanded = false`
- User taps search icon: `isExpanded = true`, input autofocuses
- User taps close icon or submits: `isExpanded = false`

---

### 3. Settings Sheet State

Manages mobile bottom sheet for theme/language settings.

```typescript
interface SettingsSheetState {
  /** Whether settings sheet is open */
  isOpen: boolean;
  
  /** Current theme mode */
  theme: 'light' | 'dark' | 'system';
  
  /** Current language */
  language: 'en' | 'de';
}
```

**Actions**:
- `openSettings()`: Sets `isOpen = true`
- `closeSettings()`: Sets `isOpen = false`
- `toggleTheme(mode)`: Updates theme, persists to localStorage
- `changeLanguage(lang)`: Updates i18n language, persists to localStorage

---

### 4. Filter Sheet State

Manages mobile filter bottom sheet UI.

```typescript
interface FilterSheetState {
  /** Whether filter sheet is open */
  isOpen: boolean;
  
  /** Currently selected effect filters */
  selectedEffects: string[];
  
  /** Currently selected categories (for category tabs) */
  selectedCategories: string[];
  
  /** Filter mode (AND/OR logic) */
  filterMode: 'AND' | 'OR';
  
  /** Number of terpenes matching current filters (real-time preview) */
  resultsCount: number;
  
  /** Badge count on FAB (number of active filters) */
  activeFilterCount: number;
}
```

**Computed Properties**:
- `activeFilterCount = selectedEffects.length`
- `resultsCount = terpenes.filter(applyFilters).length` (computed on every selection change)

**Actions**:
- `openFilters()`: Opens sheet
- `closeFilters()`: Closes sheet and applies filters
- `toggleEffect(effect)`: Adds/removes effect from selectedEffects
- `toggleCategory(category)`: Adds/removes category from selectedCategories
- `clearFilters()`: Resets all filters
- `toggleFilterMode()`: Switches between AND/OR

---

### 5. Card Grid State

Manages virtual scrolling and card selection.

```typescript
interface CardGridState {
  /** All terpenes to display (filtered) */
  terpenes: Terpene[];
  
  /** Indices of visible cards (for virtual scrolling) */
  visibleIndices: number[];
  
  /** Scroll position (px from top) */
  scrollTop: number;
  
  /** Selected terpene (for modal) */
  selectedTerpene: Terpene | null;
}
```

**Virtual Scrolling**:
- Only render cards in `visibleIndices` (calculated by TanStack Virtual)
- Estimated card height: 180px (varies by content)
- Overscan: 5 cards above/below viewport

---

### 6. Detail Modal State

Manages full-screen terpene detail modal on mobile. 

**Note**: This modal is being refactored in `008-therapeutic-modal-refactor` with Basic/Expert views and categorized effects. Mobile optimization will build on that refactor.

```typescript
interface DetailModalState {
  /** Whether modal is open */
  isOpen: boolean;
  
  /** Terpene being displayed */
  terpene: Terpene | null;
  
  /** Current view mode (from 008-therapeutic-modal-refactor) */
  viewMode: 'basic' | 'expert';
  
  /** Swipe gesture state for dismiss (mobile-specific) */
  swipeState: {
    /** Y-axis drag distance (px) */
    deltaY: number;
    
    /** Whether swipe gesture is active */
    isDragging: boolean;
  };
  
  /** Share status (mobile-specific) */
  shareStatus: 'idle' | 'sharing' | 'success' | 'error';
}
```

**Transitions**:
- Open: Slide up from bottom on mobile (`transform: translateY(100%) → 0%`)
- Close: Slide down (`transform: translateY(0%) → 100%`)
- Swipe-to-close: Triggers close when `swipeState.deltaY > 100px` (mobile-only)

**Integration with 008-therapeutic-modal-refactor**:
- Preserve Basic/Expert toggle in mobile layout
- Ensure touch targets for toggle buttons ≥48x48px
- Stack toggle buttons vertically on narrow screens
- Full-screen mode doesn't interfere with accordion interactions

---

### 7. PWA State

Manages Progressive Web App installation and offline status.

```typescript
interface PWAState {
  /** Whether app is installable (beforeinstallprompt fired) */
  isInstallable: boolean;
  
  /** Deferred install prompt event */
  installPromptEvent: BeforeInstallPromptEvent | null;
  
  /** Whether app is currently installed */
  isInstalled: boolean;
  
  /** Whether user is currently offline */
  isOffline: boolean;
  
  /** Whether install prompt has been shown to user */
  hasShownPrompt: boolean;
  
  /** User engagement metrics for prompt timing */
  engagement: {
    /** Seconds user has been active */
    timeActive: number;
    
    /** Number of terpenes viewed */
    terpenesViewed: number;
  };
}
```

**Install Prompt Logic**:
```typescript
// Show prompt when:
// - User has been active for 30+ seconds, OR
// - User has viewed 3+ terpenes
// - AND hasn't dismissed prompt before (check localStorage)
const shouldShowPrompt = 
  !pwaState.hasShownPrompt &&
  pwaState.isInstallable &&
  (pwaState.engagement.timeActive >= 30 || pwaState.engagement.terpenesViewed >= 3);
```

---

## Component Prop Contracts

### AppBar Props

```typescript
interface AppBarProps {
  /** Current search query */
  searchQuery: string;
  
  /** Search change handler */
  onSearchChange: (query: string) => void;
  
  /** Current theme mode */
  themeMode: 'light' | 'dark';
  
  /** Theme toggle handler */
  onThemeToggle: () => void;
  
  /** Current language */
  language: 'en' | 'de';
  
  /** Language change handler */
  onLanguageChange: (lang: 'en' | 'de') => void;
}
```

---

### TerpeneCardGrid Props

```typescript
interface TerpeneCardGridProps {
  /** Filtered terpenes to display */
  terpenes: Terpene[];
  
  /** Card click handler (opens detail modal) */
  onTerpeneClick: (terpene: Terpene) => void;
  
  /** Whether to enable virtual scrolling */
  enableVirtualization?: boolean; // default: true when terpenes.length > 50
}
```

---

### FilterBottomSheet Props

```typescript
interface FilterBottomSheetProps {
  /** Whether sheet is open */
  open: boolean;
  
  /** Close handler */
  onClose: () => void;
  
  /** All available effects (categorized) */
  effects: Effect[];
  
  /** Currently selected effects */
  selectedEffects: string[];
  
  /** Currently selected categories */
  selectedCategories: string[];
  
  /** Category toggle handler */
  onCategoryToggle: (category: string) => void;
  
  /** Effect toggle handler */
  onToggleEffect: (effect: string) => void;
  
  /** Clear all filters handler */
  onClearFilters: () => void;
  
  /** Number of results matching current filter */
  resultsCount: number;
  
  /** Filter mode (AND/OR) */
  filterMode: 'AND' | 'OR';
  
  /** Filter mode toggle handler */
  onFilterModeToggle: () => void;
}
```

---

### TerpeneDetailModal Props (Enhanced)

```typescript
interface TerpeneDetailModalProps {
  /** Whether modal is open */
  open: boolean;
  
  /** Terpene to display */
  terpene: Terpene | null;
  
  /** Close handler */
  onClose: () => void;
  
  /** Whether to use full-screen mode (auto-detected on mobile) */
  fullScreen?: boolean;
  
  /** Whether to enable swipe-to-close gesture */
  enableSwipeToClose?: boolean; // default: true on mobile
  
  /** Share handler */
  onShare?: (terpene: Terpene) => Promise<void>;
}
```

---

## Data Transformations

### 1. Effect Categorization (Existing, Reused)

Group effects by category for filter bottom sheet.

```typescript
function groupEffectsByCategory(effects: Effect[]): Record<string, Effect[]> {
  return {
    'Mood/Energy': effects.filter(e => e.category === 'mood-energy'),
    'Cognitive': effects.filter(e => e.category === 'cognitive'),
    'Relaxation': effects.filter(e => e.category === 'relaxation'),
    'Physical': effects.filter(e => e.category === 'physical')
  };
}
```

---

### 2. Card Display Data

Transform full terpene data into card-optimized format.

```typescript
interface TerpeneCardData {
  id: string;
  name: string;
  aroma: string;
  topEffects: string[]; // Max 3
  additionalEffectCount: number; // e.g., "+2 more"
}

function toCardData(terpene: Terpene): TerpeneCardData {
  return {
    id: terpene.id,
    name: terpene.name,
    aroma: terpene.aroma,
    topEffects: terpene.effects.slice(0, 3),
    additionalEffectCount: Math.max(0, terpene.effects.length - 3)
  };
}
```

---

### 3. Share Data Formatting

Format terpene data for Web Share API.

```typescript
function formatShareData(terpene: Terpene): ShareData {
  return {
    title: terpene.name,
    text: `${terpene.name} - ${terpene.description}\n\nEffects: ${terpene.effects.join(', ')}`,
    url: `${window.location.origin}/?terpene=${encodeURIComponent(terpene.id)}`
  };
}
```

---

## State Management Strategy

### Local Component State

Use `useState` for UI-only state (modals, sheets, expanded states).

```typescript
// Example: Filter sheet in Home.tsx
const [filterSheetOpen, setFilterSheetOpen] = useState(false);
```

### Shared App State (Context)

Use React Context for state shared across multiple components (theme, language, filters).

```typescript
// Existing: ThemeContext, LanguageContext, FilterContext
// Reuse existing contexts, no new global state needed
```

### URL State (Query Params)

Persist selected terpene in URL for shareable links.

```typescript
// When opening modal:
history.pushState({}, '', `/?terpene=${terpene.id}`);

// When closing modal:
history.pushState({}, '', '/');
```

---

## Performance Considerations

### Virtual Scrolling Threshold

Enable TanStack Virtual when `terpenes.length > 50`:

```typescript
const shouldVirtualize = terpenes.length > 50;
```

### Lazy Loading

Lazy load heavy components:

```typescript
const FilterBottomSheet = lazy(() => import('./components/FilterBottomSheet'));
const TerpeneDetailModal = lazy(() => import('./components/TerpeneDetailModal'));
```

### Memoization

Memoize expensive computations:

```typescript
const filteredTerpenes = useMemo(
  () => applyFilters(terpenes, selectedEffects, filterMode),
  [terpenes, selectedEffects, filterMode]
);
```

---

**Status**: ✅ Data model complete — ready for contracts generation
