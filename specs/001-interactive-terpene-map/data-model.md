# Data Model: Interactive Terpene Map

**Feature**: 001-interactive-terpene-map
**Date**: 2025-10-23
**Status**: Design

## Overview

This document defines the data model for the Interactive Terpene Map application, including entity definitions, relationships, validation rules, and state management patterns using Material UI for theming and React Context for state.

---

## Core Entities

### Terpene

Represents a single terpene compound with its properties, effects, and sources.

```typescript
interface Terpene {
  // Unique identifier
  id: string;                    // UUID v4 format

  // Basic properties
  name: string;                  // Display name (e.g., "Limonene")
  description: string;           // Detailed description of the terpene
  aroma: string;                 // Characteristic aroma (e.g., "Citrus")

  // Relationships
  effects: string[];             // Array of effect names (references Effect entity)
  sources: string[];             // Natural sources (e.g., ["Lemon peel", "Orange"])

  // Metadata (optional, for future extensions)
  boilingPoint?: number;         // In Celsius
  molecularFormula?: string;     // Chemical formula
}
```

**Validation Rules:**

- `id`: Required, must be valid UUID v4 format
- `name`: Required, 1-100 characters, must be unique within dataset
- `description`: Required, 10-1000 characters
- `aroma`: Required, 1-100 characters
- `effects`: Required, array must contain at least 1 effect, max 10 effects
- `sources`: Required, array must contain at least 1 source, max 20 sources
- `boilingPoint`: Optional, if provided must be between -200 and 300 Celsius
- `molecularFormula`: Optional, if provided must match chemical formula pattern

**Data Source:**

- Primary: `/data/terpenes.json`
- Alternative: `/data/terpenes.yaml`
- Format: Array of Terpene objects

---

### Effect

Represents a category of effect that terpenes can have (e.g., "calming", "energetic", "focus").

```typescript
interface Effect {
  // Unique identifier
  name: string;                  // Effect name (e.g., "calming") - serves as ID

  // Display properties
  displayName: {                 // Localized display names
    en: string;
    de: string;
  };

  // Visual properties (Material UI theming)
  color: string;                 // Hex color code for visual representation

  // Relationships
  terpeneCount?: number;         // Computed: Number of terpenes with this effect
}
```

**Validation Rules:**

- `name`: Required, 1-50 characters, lowercase, alphanumeric + hyphens only
- `displayName.en`: Required, 1-50 characters
- `displayName.de`: Required, 1-50 characters
- `color`: Required, valid hex color code (#RRGGBB or #RGB), must meet WCAG 2.1 Level AA contrast (4.5:1)
- `terpeneCount`: Computed property, non-editable

**Material UI Color Requirements:**

- Each effect must have a unique, distinct color
- Colors must meet WCAG 2.1 Level AA contrast requirements (4.5:1 ratio) when used with both light and dark backgrounds
- Color palette managed in `src/services/colorService.ts`
- Integration with Material UI theme palette

**Data Source:**

- Derived from `Terpene.effects` array
- Effect metadata (colors, translations) stored in `src/utils/constants.ts` or separate config file

---

## Application State

### FilterState

Represents the current state of user-applied filters and search.

```typescript
interface FilterState {
  // Search
  searchQuery: string;           // Free-text search query

  // Effect filters
  selectedEffects: string[];     // Array of effect names to filter by
  effectFilterMode: 'any' | 'all'; // Match any effect OR all effects

  // View preferences
  viewMode: 'sunburst' | 'table'; // Current visualization mode

  // Sort (for table view)
  sortBy: 'name' | 'aroma' | 'effects' | 'sources';
  sortDirection: 'asc' | 'desc';
}
```

**Validation Rules:**

- `searchQuery`: 0-200 characters, sanitized to remove special characters
- `selectedEffects`: Array of valid effect names
- `effectFilterMode`: Must be 'any' or 'all', defaults to 'any'
- `viewMode`: Must be 'sunburst' or 'table', defaults to 'sunburst'
- `sortBy`: Must be one of the allowed column names
- `sortDirection`: Must be 'asc' or 'desc'

**State Transitions:**

- User types in search → Update `searchQuery` → Trigger filter recalculation
- User clicks effect category → Toggle effect in `selectedEffects` → Trigger filter recalculation
- User clicks sunburst slice → Set `selectedEffects` to clicked effect → Trigger filter recalculation
- User switches view → Update `viewMode` → Re-render with new visualization
- User clicks table column header → Update `sortBy` and `sortDirection` → Re-sort results

---

### ThemeState

Represents the current theme and localization preferences (Material UI integration).

```typescript
interface ThemeState {
  // Material UI Theme
  mode: 'light' | 'dark' | 'system'; // Theme mode
  systemPreference?: 'light' | 'dark'; // Detected system preference

  // Localization (i18next)
  language: 'en' | 'de';         // Current language
}
```

**Validation Rules:**

- `mode`: Must be 'light', 'dark', or 'system'
- `systemPreference`: Auto-detected via Material UI `useMediaQuery`, read-only
- `language`: Must be 'en' or 'de', defaults to browser language or 'en'

**State Transitions:**

- User toggles theme → Update `mode` → Apply new Material UI theme
- System preference changes → Update `systemPreference` → Apply theme if mode is 'system'
- User switches language → Update `language` → Re-render all UI text via i18next

**Material UI Integration:**

- Uses `CssVarsProvider` with `colorSchemes` for light/dark mode
- Uses `useColorScheme` hook for theme switching
- Automatic system preference detection via `@media (prefers-color-scheme)`

---

### LoadingState

Represents the data loading state using discriminated unions for type safety.

```typescript
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

**State Transitions:**

- App initializes → `status: 'idle'`
- Data fetch begins → `status: 'loading'` (show pulsing cannabis leaf using Material UI animations)
- Data fetch succeeds → `status: 'success', data: Terpene[]` (render visualizations)
- Data fetch fails → `status: 'error', error: Error` (show error message with Material UI Alert)

---

## Derived Data

### FilteredTerpenes

```typescript
interface FilteredTerpenes {
  terpenes: Terpene[];           // Filtered and sorted list
  totalCount: number;            // Total before filtering
  filteredCount: number;         // Count after filtering
  matchedEffects: Set<string>;   // Effects present in filtered results
}
```

**Computation Logic:**

1. Apply search query filter (matches `name`, `aroma`, or `effects`)
2. Apply effect filters (based on `effectFilterMode`)
3. Sort results (based on `sortBy` and `sortDirection`)
4. Calculate derived metadata

**Performance:**

- Memoize computation using `useMemo`
- Target: < 200ms for 500 terpenes (NFR-PERF-002)

---

### SunburstData

```typescript
interface SunburstNode {
  name: string;                  // Node label
  value?: number;                // Leaf nodes: terpene count
  children?: SunburstNode[];     // Branch nodes: child categories
  color?: string;                // Effect category color (from Material UI theme)
  terpeneIds?: string[];         // Terpene IDs in this category
}
```

**Hierarchy:**

```sh
Root
├── Effect Category 1 (Material UI theme color)
│   ├── Terpene A
│   ├── Terpene B
│   └── ...
├── Effect Category 2 (Material UI theme color)
│   ├── Terpene C
│   └── ...
└── ...
```

**Computation Logic:**

1. Group terpenes by effect
2. Create hierarchy: Root → Effects → Terpenes
3. Calculate value (count) for each node
4. Assign colors from Material UI theme palette

---

## Relationships

### Terpene ↔ Effect (Many-to-Many)

- A `Terpene` can have multiple `Effect` categories (1..10)
- An `Effect` can be associated with multiple `Terpene` entries (0..500)
- Relationship stored in `Terpene.effects` array (denormalized)
- Effect metadata stored separately for localization and theming

### Data Integrity

- **Referential Integrity**: All effect names in `Terpene.effects` must correspond to valid effects in the effect configuration
- **Uniqueness**: Terpene IDs and names must be unique
- **Validation**: Performed at data load time with user-friendly error messages (Material UI Snackbar)

---

## State Management Strategy

### Local Component State (useState)

- UI-only state (e.g., Material UI dialog open/closed, tooltip visibility)
- Ephemeral state that doesn't need persistence

### Context API

**ThemeContext:**

- Material UI theme mode (light/dark/system)
- Language preference (en/de)
- Provides theme and i18n configuration to all components

**DataContext:**

- Loaded terpene data (LoadingState<Terpene[]>)
- Effect configuration
- Data loading functions

**FilterContext:**

- Current filter state (FilterState)
- Filtered results (FilteredTerpenes)
- Filter update functions

### Why Not Redux/Zustand?

- **Decision**: Use Context API for state management
- **Rationale**:
  - Application has simple, hierarchical state
  - No complex async workflows beyond initial data load
  - Context API provides sufficient performance for 500 terpenes
  - Reduces bundle size and complexity
  - Material UI components work seamlessly with Context API
- **Alternatives Considered**:
  - Redux Toolkit (overkill for this use case, adds 20KB+)
  - Zustand (unnecessary for non-complex state)
  - Recoil (experimental status, learning curve)

---

## Data Persistence

### Local Storage

Store user preferences (not terpene data):

```typescript
interface StoredPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'de';
  lastViewMode?: 'sunburst' | 'table';
  filterMode?: 'any' | 'all'; // Persist AND/OR filter preference (FR-014)
}
```

**Storage Key**: `terpene-map-preferences`

**Sync Strategy:**

- Load preferences on app initialization
- Save on preference change (debounced)
- Graceful fallback if localStorage unavailable (Safari private mode)

---

## Data Transformation Pipeline

```sh
1. Load Raw Data
   ├── Fetch /data/terpenes.json (primary)
   └── Fallback to /data/terpenes.yaml

2. Parse & Validate (FR-015: Graceful validation)
   ├── Parse JSON/YAML
   ├── Validate schema (Zod recommended)
   ├── Add UUIDs if missing
   ├── Filter out invalid entries (graceful degradation)
   └── Show warning notification with count of skipped entries

3. Transform & Enrich
   ├── Extract unique effects
   ├── Assign effect colors (Material UI palette)
   ├── Generate effect translations (i18next)
   └── Calculate metadata (counts, etc.)

4. Store in Context
   └── Make available to components

5. Apply Filters
   ├── Listen to FilterState changes
   ├── Apply effectFilterMode ('any' or 'all') for multi-effect filters (FR-013)
   ├── Compute filtered results
   └── Update UI (<200ms per NFR-PERF-002)
```

---

## Validation Schema (Zod Example)

```typescript
import { z } from 'zod';

const TerpeneSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  aroma: z.string().min(1).max(100),
  effects: z.array(z.string()).min(1).max(10),
  sources: z.array(z.string()).min(1).max(20),
  boilingPoint: z.number().min(-200).max(300).optional(),
  molecularFormula: z.string().regex(/^[A-Z][a-z]?\d*/).optional(),
});

const TerpeneDataSchema = z.array(TerpeneSchema);

// Usage with graceful validation (FR-015)
interface ValidationResult {
  validTerpenes: Terpene[];
  invalidCount: number;
  errors: string[];
}

function validateTerpeneData(data: unknown): ValidationResult {
  const rawData = Array.isArray(data) ? data : [];
  const validTerpenes: Terpene[] = [];
  const errors: string[] = [];

  rawData.forEach((item, index) => {
    const result = TerpeneSchema.safeParse(item);
    if (result.success) {
      validTerpenes.push(result.data);
    } else {
      errors.push(`Entry ${index + 1}: ${result.error.message}`);
    }
  });

  return {
    validTerpenes,
    invalidCount: errors.length,
    errors
  };
}
```

---

## Error Handling

### Data Loading Errors (Material UI Components)

| Error Type | User Message | Material UI Component | Recovery Action |
|------------|--------------|----------------------|-----------------|
| Network error | "Unable to load terpene data. Please check your connection." | Alert (error severity) | Button with retry |
| Parse error | "Data format is invalid. Please contact support." | Alert (error severity) | Show partial data if possible |
| Validation error | "Some terpene data is incomplete. Showing available entries." | Alert (warning severity) | Filter out invalid entries |
| No data | "No terpene data available." | Empty state (Material UI Box) | Show empty state illustration |

### Runtime Errors

- Wrap components in Error Boundaries
- Log errors to console (no analytics per NFR-PRIV-001)
- Show user-friendly fallback UI (Material UI Paper/Alert)
- Provide "Reload" action (Material UI Button)

---

## Performance Considerations

### Data Volume

- **Target**: 500 terpenes
- **Current expected**: ~50-100 terpenes
- **Growth headroom**: 5x current size

### Optimization Strategies

1. **Memoization**: Cache filtered results, sunburst calculations (React.useMemo)
2. **Virtualization**: If table has > 100 rows, use Material UI's `react-window` integration
3. **Debouncing**: Search input debounced to 300ms
4. **Code Splitting**: Lazy load D3.js sunburst component (React.lazy)
5. **Web Workers**: Consider for heavy filtering if performance < 200ms target

---

## Accessibility Considerations

### Data Presentation (Material UI + WCAG 2.1 Level AA)

- **Screen Readers**: Provide text alternatives for visual charts (ARIA labels)
- **Keyboard Navigation**: All Material UI components support keyboard navigation out-of-box
- **ARIA Labels**: Proper labeling for dynamic content
- **Live Regions**: Announce filter result counts (aria-live)

### Data-Specific Accessibility

- Color is not the only means of distinction (use patterns/labels with Material UI)
- High contrast mode support via Material UI theme (contrastThreshold: 4.5)
- Focus management when switching views (Material UI FocusVisible)
- Proper heading hierarchy in table view (Material UI Typography)

---

## Material UI Component Mapping

| Feature | Material UI Components |
|---------|----------------------|
| Theme switching | `CssVarsProvider`, `useColorScheme`, `IconButton` |
| Language selector | `Select`, `MenuItem` |
| Search bar | `TextField`, `InputAdornment` |
| Effect filters | `Chip`, `FormGroup`, `FormControlLabel` |
| Table view | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, `TableSortLabel` |
| Loading indicator | Custom pulsing cannabis leaf with `CircularProgress` styling |
| Error messages | `Alert`, `Snackbar` |
| View mode toggle | `ToggleButtonGroup`, `ToggleButton` |
| Layout | `AppBar`, `Toolbar`, `Container`, `Box`, `Grid` |

---

## Future Extensions (Out of Scope)

- User-created terpene entries (requires backend)
- Favorites/bookmarks (requires persistence layer)
- Comparison mode (compare multiple terpenes)
- Advanced filtering (by source, boiling point range)
- Data export (CSV, JSON)
- Sharing filtered views (URL parameters)

---

## References

- Feature Specification: `spec.md`
- Implementation Plan: `plan.md`
- Research Findings: `research.md`
- TypeScript Interfaces: `src/models/`
- Material UI Documentation: <https://mui.com/>
- i18next Documentation: <https://www.i18next.com/>
