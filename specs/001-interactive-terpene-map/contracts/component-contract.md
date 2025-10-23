# Component Contract: React Component Interfaces

**Feature**: 001-interactive-terpene-map
**Date**: 2025-10-23
**Contract Type**: Component API Specification
**Version**: 1.0.0

## Overview

This contract defines the public interfaces (props, events, and behavior) for all major React components in the Interactive Terpene Map application, with Material UI integration.

---

## Core Components

### TerpeneTable

**Purpose**: Display terpenes in a sortable Material UI table

```typescript
interface TerpeneTableProps {
  /** Array of terpenes to display */
  terpenes: Terpene[];

  /** Current sort configuration */
  sortBy: 'name' | 'aroma' | 'effects' | 'sources';
  sortDirection: 'asc' | 'desc';

  /** Callback when sort changes */
  onSortChange: (sortBy: TerpeneTableProps['sortBy'], direction: 'asc' | 'desc') => void;

  /** Callback when row is clicked */
  onRowClick?: (terpene: Terpene) => void;

  /** Loading state */
  loading?: boolean;

  /** Current language for localization */
  language: 'en' | 'de';

  /** Material UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Displays terpenes in a sortable table with Material UI components
 */
export function TerpeneTable(props: TerpeneTableProps): JSX.Element;
```

**Behavior:**
- Renders Material UI `Table` with `TableHead` and `TableBody`
- Column headers are clickable for sorting (Material UI `TableSortLabel`)
- Indicates current sort column and direction with visual feedback
- Supports keyboard navigation (tab through rows, enter to select)
- Shows loading skeleton when `loading` is true
- Virtualizes rows if count > 100 (performance optimization)
- ARIA labels for screen readers

---

### SunburstChart

**Purpose**: Display terpenes in a D3.js sunburst visualization integrated with Material UI theme

```typescript
interface SunburstChartProps {
  /** Hierarchical data for the sunburst */
  data: SunburstNode;

  /** Chart dimensions */
  width: number;
  height: number;

  /** Callback when a slice is clicked */
  onSliceClick: (node: SunburstNode) => void;

  /** Currently selected effect (for highlighting) */
  selectedEffect?: string;

  /** Material UI theme (for colors) */
  theme: Theme;

  /** Current language for labels */
  language: 'en' | 'de';

  /** Material UI sx prop */
  sx?: SxProps<Theme>;
}

/**
 * D3.js sunburst chart visualization with Material UI theme integration
 */
export function SunburstChart(props: SunburstChartProps): JSX.Element;
```

**Behavior:**
- Renders SVG sunburst chart using D3.js
- Colors derived from Material UI theme palette
- Animates transitions when data changes
- Highlights selected effect slice
- Keyboard accessible (tab to slices, enter to select)
- Responsive to container size changes
- Tooltips show terpene names on hover (Material UI `Tooltip`)
- ARIA labels for accessibility

---

### SearchBar

**Purpose**: Free-text search input with Material UI styling

```typescript
interface SearchBarProps {
  /** Current search query */
  value: string;

  /** Callback when query changes (debounced internally) */
  onChange: (query: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Debounce delay in milliseconds */
  debounceMs?: number; // default: 300

  /** Loading state (shows progress indicator) */
  loading?: boolean;

  /** Material UI sx prop */
  sx?: SxProps<Theme>;
}

/**
 * Material UI TextField for searching terpenes
 */
export function SearchBar(props: SearchBarProps): JSX.Element;
```

**Behavior:**
- Renders Material UI `TextField` with search icon
- Debounces input changes (default 300ms)
- Shows `CircularProgress` indicator when loading
- Clear button (X) when query is not empty
- Auto-focus on mount (optional)
- Keyboard accessible
- ARIA labels for screen readers

---

### FilterControls

**Purpose**: Effect category filter chips with Material UI styling

```typescript
interface FilterControlsProps {
  /** Available effects to filter by */
  availableEffects: Effect[];

  /** Currently selected effects */
  selectedEffects: string[];

  /** Callback when effect selection changes */
  onEffectToggle: (effectName: string) => void;

  /** Filter mode (any or all effects) */
  mode: 'any' | 'all';

  /** Callback when mode changes */
  onModeChange: (mode: 'any' | 'all') => void;

  /** Current language for labels */
  language: 'en' | 'de';

  /** Material UI sx prop */
  sx?: SxProps<Theme>;
}

/**
 * Effect filter chips using Material UI Chip components
 */
export function FilterControls(props: FilterControlsProps): JSX.Element;
```

**Behavior:**
- Renders Material UI `Chip` components for each effect
- Selected chips have filled variant, unselected have outlined
- Chips colored according to effect colors (WCAG AA compliant)
- Toggle button group for mode selection ('any' vs 'all')
- Keyboard accessible (arrow keys to navigate, space to select)
- Screen reader announces current selections
- Responsive layout (wraps on small screens)

---

### ThemeToggle

**Purpose**: Toggle between light/dark/system theme modes

```typescript
interface ThemeToggleProps {
  /** Current theme mode */
  mode: 'light' | 'dark' | 'system';

  /** Callback when mode changes */
  onChange: (mode: 'light' | 'dark' | 'system') => void;

  /** Material UI sx prop */
  sx?: SxProps<Theme>;
}

/**
 * Material UI IconButton for theme switching
 */
export function ThemeToggle(props: ThemeToggleProps): JSX.Element;
```

**Behavior:**
- Renders Material UI `IconButton` with theme icon
- Cycles through light → dark → system on click
- Shows current mode with appropriate icon (sun/moon/auto)
- Smooth transition animations (Material UI fade)
- Keyboard accessible (space/enter to toggle)
- ARIA label describes current mode

---

### LanguageSelector

**Purpose**: Select language (English/German)

```typescript
interface LanguageSelectorProps {
  /** Current language */
  language: 'en' | 'de';

  /** Callback when language changes */
  onChange: (language: 'en' | 'de') => void;

  /** Material UI sx prop */
  sx?: SxProps<Theme>;
}

/**
 * Material UI Select for language switching
 */
export function LanguageSelector(props: LanguageSelectorProps): JSX.Element;
```

**Behavior:**
- Renders Material UI `Select` with language options
- Shows flag icons for visual identification
- Keyboard accessible (arrow keys, enter to select)
- Updates i18next configuration on change
- ARIA label for screen readers

---

### LoadingIndicator

**Purpose**: Animated cannabis leaf loading indicator

```typescript
interface LoadingIndicatorProps {
  /** Size of the indicator */
  size?: 'small' | 'medium' | 'large'; // default: 'medium'

  /** Loading message (localized) */
  message?: string;

  /** Material UI sx prop */
  sx?: SxProps<Theme>;
}

/**
 * Custom pulsing cannabis leaf with Material UI animations
 */
export function LoadingIndicator(props: LoadingIndicatorProps): JSX.Element;
```

**Behavior:**
- Renders custom cannabis leaf SVG
- Pulsing animation using Material UI `keyframes`
- Centered in container by default
- Optional text message below indicator
- ARIA live region announces loading state
- Respects user's reduced motion preference

---

### ErrorBoundary

**Purpose**: Catch and display React errors gracefully

```typescript
interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: React.ReactNode;

  /** Fallback UI component */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;

  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * React Error Boundary with Material UI fallback UI
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>;
```

**Behavior:**
- Catches errors in child component tree
- Renders Material UI `Alert` with error message
- Provides "Reload" button to reset error state
- Logs errors to console (no external analytics)
- Does not catch errors in event handlers or async code

---

## Layout Components

### AppLayout

**Purpose**: Main application layout with Material UI structure

```typescript
interface AppLayoutProps {
  /** Page content */
  children: React.ReactNode;

  /** Current theme mode */
  theme: Theme;

  /** Current language */
  language: 'en' | 'de';

  /** Theme toggle handler */
  onThemeChange: (mode: 'light' | 'dark' | 'system') => void;

  /** Language change handler */
  onLanguageChange: (language: 'en' | 'de') => void;
}

/**
 * Main layout with Material UI AppBar, Container, and responsive grid
 */
export function AppLayout(props: AppLayoutProps): JSX.Element;
```

**Behavior:**
- Material UI `AppBar` with title, theme toggle, language selector
- Responsive `Container` with max width
- Material UI `Box` for content area
- Sticky footer (optional)
- Responsive breakpoints for mobile/tablet/desktop
- ARIA landmarks (header, main, footer)

---

## Context Providers

### ThemeProvider

**Purpose**: Provide Material UI theme and theme switching

```typescript
interface ThemeContextValue {
  mode: 'light' | 'dark' | 'system';
  theme: Theme;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
}

/**
 * Material UI CssVarsProvider with custom theme configuration
 */
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element;

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue;
```

---

### DataProvider

**Purpose**: Provide terpene data and loading state

```typescript
interface DataContextValue {
  terpenes: Terpene[];
  effects: Effect[];
  loadingState: LoadingState<Terpene[]>;
  reloadData: () => Promise<void>;
}

/**
 * React Context provider for terpene data
 */
export function DataProvider({ children }: { children: React.ReactNode }): JSX.Element;

/**
 * Hook to access data context
 */
export function useData(): DataContextValue;
```

---

### FilterProvider

**Purpose**: Provide filter state and filtered results

```typescript
interface FilterContextValue {
  // Current filters
  searchQuery: string;
  selectedEffects: string[];
  effectFilterMode: 'any' | 'all';
  viewMode: 'sunburst' | 'table';
  sortBy: 'name' | 'aroma' | 'effects' | 'sources';
  sortDirection: 'asc' | 'desc';

  // Filtered results
  filteredTerpenes: FilteredTerpenes;

  // Filter actions
  setSearchQuery: (query: string) => void;
  toggleEffect: (effectName: string) => void;
  setEffectFilterMode: (mode: 'any' | 'all') => void;
  setViewMode: (mode: 'sunburst' | 'table') => void;
  setSorting: (sortBy: string, direction: 'asc' | 'desc') => void;
  clearFilters: () => void;
}

/**
 * React Context provider for filter state
 */
export function FilterProvider({ children }: { children: React.ReactNode }): JSX.Element;

/**
 * Hook to access filter context
 */
export function useFilters(): FilterContextValue;
```

---

## Custom Hooks

### useTerpeneData

```typescript
interface UseTerpeneDataReturn {
  terpenes: Terpene[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * Hook to load and manage terpene data
 */
export function useTerpeneData(): UseTerpeneDataReturn;
```

---

### useDebounce

```typescript
/**
 * Debounce a value with specified delay
 */
export function useDebounce<T>(value: T, delay: number): T;
```

---

### useLocalStorage

```typescript
/**
 * Sync state with localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void];
```

---

## Accessibility Contract

All components must:

1. **Keyboard Navigation**
   - Fully operable with keyboard only
   - Logical tab order
   - Visible focus indicators (Material UI FocusVisible)

2. **ARIA Attributes**
   - Proper roles, labels, and descriptions
   - Live regions for dynamic content
   - State announcements (expanded, selected, etc.)

3. **Screen Reader Support**
   - Semantic HTML elements
   - Alternative text for images/icons
   - Descriptive labels for form controls

4. **Color Contrast**
   - WCAG 2.1 Level AA (4.5:1 ratio)
   - Material UI theme ensures compliance
   - Color is not sole indicator (use icons/labels)

5. **Responsive Design**
   - Works on mobile, tablet, desktop
   - Material UI breakpoints (xs, sm, md, lg, xl)
   - Touch targets ≥ 44x44px

---

## Performance Contract

### Component Rendering

- **Table**: Virtual scrolling for > 100 rows
- **Sunburst**: Lazy loaded with React.lazy
- **Search**: Debounced input (300ms default)
- **Filters**: Memoized computations with useMemo

### Re-render Optimization

- All components use React.memo where appropriate
- Context split to minimize unnecessary re-renders
- Event handlers use useCallback

### Bundle Size

- Material UI tree-shaking (named imports only)
- D3.js modular imports (d3-hierarchy, d3-scale)
- Code splitting for heavy components

---

## Testing Contract

All components must have:

1. **Unit Tests** (Vitest + React Testing Library)
   - Render without errors
   - Handle props correctly
   - Fire callbacks on user interaction
   - Keyboard navigation works

2. **Accessibility Tests** (jest-axe)
   - No WCAG violations
   - Proper ARIA attributes
   - Keyboard accessible

3. **Integration Tests**
   - Component interactions work
   - Context updates propagate
   - Material UI theme integration

4. **Visual Regression Tests** (optional with Playwright)
   - Component appearance matches design
   - Theme switching works
   - Responsive breakpoints

---

## Material UI Component Usage

| Component | Material UI Imports |
|-----------|---------------------|
| TerpeneTable | Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel |
| SunburstChart | Box, Tooltip, useTheme |
| SearchBar | TextField, InputAdornment, IconButton, CircularProgress |
| FilterControls | Chip, FormGroup, FormControlLabel, ToggleButtonGroup, ToggleButton |
| ThemeToggle | IconButton, Fade |
| LanguageSelector | Select, MenuItem, FormControl, InputLabel |
| LoadingIndicator | Box, Typography, keyframes |
| AppLayout | AppBar, Toolbar, Container, Box, Grid |

---

## Versioning

- **Component API Version**: 1.0.0
- **Breaking Changes**: Require major version bump
- **New Props**: Minor version bump
- **Bug Fixes**: Patch version bump

---

## References

- Data Model: `data-model.md`
- Data Contract: `data-contract.md`
- Feature Specification: `spec.md`
- Material UI Documentation: https://mui.com/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
