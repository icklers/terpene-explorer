# Data Model: Categorized Effect Filters

**Feature**: 003-categorized-effect-filters  
**Date**: 2025-10-26  
**Status**: Phase 1 Complete

## Overview

This document defines the data structures, entities, and relationships for the categorized effect filters feature. The system uses a
hybrid architecture: category definitions and effect→category mappings are stored in the database (`data/terpene-database.json`), while UI
properties (emoticons, colors, ARIA labels) are managed in the frontend.

---

## Core Entities

### 1. EffectCategory

**Source**: `data/terpene-database.json` (Database layer)

**Purpose**: Represents a therapeutic classification grouping for effects.

**Schema**:

```typescript
interface EffectCategory {
  id: EffectCategoryId; // 'mood' | 'cognitive' | 'relaxation' | 'physical'
  name: string; // Display name (e.g., "Mood & Energy")
  displayOrder: number; // Rendering order (1-4)
  description: string; // Therapeutic intent description
}
```

**Database Structure**:

```json
{
  "effectCategories": [
    {
      "id": "mood",
      "name": "Mood & Energy",
      "displayOrder": 1,
      "description": "Daytime energizing effects that enhance mood, motivation, and vitality"
    },
    {
      "id": "cognitive",
      "name": "Cognitive & Mental Enhancement",
      "displayOrder": 2,
      "description": "Daytime cognitive effects that support focus, alertness, and mental clarity"
    },
    {
      "id": "relaxation",
      "name": "Relaxation & Anxiety Management",
      "displayOrder": 3,
      "description": "Evening/nighttime effects that promote relaxation, stress relief, and calm"
    },
    {
      "id": "physical",
      "name": "Physical & Physiological Management",
      "displayOrder": 4,
      "description": "Therapeutic physical effects that address pain, inflammation, and bodily functions"
    }
  ]
}
```

**Validation** (Zod):

```typescript
const EffectCategoryIdEnum = z.enum(['mood', 'cognitive', 'relaxation', 'physical']);

const EffectCategorySchema = z.object({
  id: EffectCategoryIdEnum,
  name: z.string().min(1),
  displayOrder: z.number().int().positive(),
  description: z.string().min(1),
});
```

**Constraints**:
- Exactly 4 categories (validated by `.length(4)` in TerpeneDatabaseSchema)
- Fixed IDs (cannot add/remove categories without schema change)
- `displayOrder` must be unique positive integers (enforced in UI logic)

---

### 2. EffectCategoryMapping

**Source**: `data/terpene-database.json` (Database layer)

**Purpose**: Maps each effect to its parent category, establishing the effect→category relationship.

**Schema**:

```typescript
type EffectCategoryMapping = Record<Effect, EffectCategoryId>;
```

**Database Structure**:

```json
{
  "effectCategoryMapping": {
    "Energizing": "mood",
    "Mood enhancing": "mood",
    "Mood stabilizing": "mood",
    "Uplifting": "mood",
    "Alertness": "cognitive",
    "Cognitive enhancement": "cognitive",
    "Focus": "cognitive",
    "Memory-enhancement": "cognitive",
    "Anxiety relief": "relaxation",
    "Relaxing": "relaxation",
    "Sedative": "relaxation",
    "Stress relief": "relaxation",
    "Couch-lock": "relaxation",
    "Anti-inflammatory": "physical",
    "Appetite suppressant": "physical",
    "Breathing support": "physical",
    "Muscle relaxant": "physical",
    "Pain relief": "physical",
    "Seizure related": "physical"
  }
}
```

**Validation** (Zod):

```typescript
const EffectCategoryMappingSchema = z.record(EffectEnum, EffectCategoryIdEnum);
```

**Constraints**:
- All 19 effects must have a category mapping
- Each effect belongs to exactly one category (no multi-category effects)
- Effect names must match `EffectEnum` exactly (case-sensitive)
- Category IDs must be valid `EffectCategoryIdEnum` values

---

### 3. CategoryUIConfig

**Source**: `src/utils/constants.ts` (Frontend layer)

**Purpose**: Provides UI-specific properties for rendering categories (emoticons, fallback text, accessibility labels).

**Schema**:

```typescript
interface CategoryUIConfig {
  emoticon: string; // Unicode emoticon (⚡, 🧠, 😌, 💪)
  fallbackLetter: string; // Single letter for emoticon rendering failure (M, C, R, P)
  ariaLabel: string; // Screen reader announcement
}

type CategoryUIConfigMap = Record<EffectCategoryId, CategoryUIConfig>;
```

**Frontend Structure**:

```typescript
// src/utils/constants.ts
export const CATEGORY_UI_CONFIG: CategoryUIConfigMap = {
  mood: {
    emoticon: '⚡',
    fallbackLetter: 'M',
    ariaLabel: 'Mood and Energy category',
  },
  cognitive: {
    emoticon: '🧠',
    fallbackLetter: 'C',
    ariaLabel: 'Cognitive and Mental Enhancement category',
  },
  relaxation: {
    emoticon: '😌',
    fallbackLetter: 'R',
    ariaLabel: 'Relaxation and Anxiety Management category',
  },
  physical: {
    emoticon: '💪',
    fallbackLetter: 'P',
    ariaLabel: 'Physical and Physiological Management category',
  },
};
```

**Constraints**:
- Emoticons must be single Unicode characters (or grapheme clusters)
- Fallback letters must be single uppercase ASCII characters
- ARIA labels must describe therapeutic context (not technical emoticon names)

---

### 4. CategoryColorTokens

**Source**: `src/theme/themeConfig.ts` (Frontend theme layer)

**Purpose**: Defines category colors as theme tokens that map to Material UI palette colors.

**Schema**:

```typescript
declare module '@mui/material/styles' {
  interface Theme {
    category: {
      mood: string;
      cognitive: string;
      relaxation: string;
      physical: string;
    };
  }
  interface ThemeOptions {
    category?: {
      mood?: string;
      cognitive?: string;
      relaxation?: string;
      physical?: string;
    };
  }
}
```

**Light Theme** (`src/theme/lightTheme.ts`):

```typescript
export const lightTheme = createTheme({
  category: {
    mood: '#FF9800', // Orange 500
    cognitive: '#9C27B0', // Purple 500
    relaxation: '#2196F3', // Blue 500
    physical: '#4CAF50', // Green 500
  },
});
```

**Dark Theme** (`src/theme/darkTheme.ts`):

```typescript
export const darkTheme = createTheme({
  category: {
    mood: '#FFB74D', // Orange 300 (lighter for dark backgrounds)
    cognitive: '#BA68C8', // Purple 300
    relaxation: '#64B5F6', // Blue 300
    physical: '#81C784', // Green 300
  },
});
```

**Constraints**:
- Colors must meet WCAG 2.1 Level AA contrast (4.5:1 ratio)
- Light theme uses palette 500 shades
- Dark theme uses palette 300 shades (for better contrast on dark backgrounds)
- Colors must be distinguishable for users with color vision deficiencies

---

### 5. FilterState

**Source**: `src/models/FilterState.ts` (Frontend state model)

**Purpose**: Manages user filter selections for both category-level and individual effect filtering.

**Schema**:

```typescript
interface FilterState {
  categoryFilters: EffectCategoryId[]; // Selected category IDs
  effectFilters: Effect[]; // Selected individual effect names
  // ... other existing filters (aroma, intensity, etc.)
}
```

**State Transitions**:

1. **Category Filter Toggle**:
   ```
   User clicks "Mood & Energy" checkbox
   → categoryFilters: [] → ['mood']
   → Terpenes filtered to show ANY effect from Mood category
   ```

2. **Individual Effect Toggle**:
   ```
   User clicks "Energizing" chip
   → effectFilters: [] → ['Energizing']
   → Terpenes filtered to show Energizing effect specifically
   ```

3. **Auto-Sync on Deselection** (FR-020):
   ```
   User has: categoryFilters: ['mood'], effectFilters: ['Energizing', 'Uplifting']
   User deselects all mood effects
   → effectFilters: []
   → categoryFilters: [] (auto-deselected)
   ```

**Persistence**:
- Stored in `localStorage` via `useLocalStorage` hook
- Key: `filterState`
- Persists across sessions and page reloads

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        TerpeneDatabase                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ effectCategories: EffectCategory[]                        │  │
│  │   - mood (displayOrder: 1)                                │  │
│  │   - cognitive (displayOrder: 2)                           │  │
│  │   - relaxation (displayOrder: 3)                          │  │
│  │   - physical (displayOrder: 4)                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ effectCategoryMapping: Record<Effect, EffectCategoryId>  │  │
│  │   "Energizing" → "mood"                                   │  │
│  │   "Alertness" → "cognitive"                               │  │
│  │   "Anxiety relief" → "relaxation"                         │  │
│  │   "Pain relief" → "physical"                              │  │
│  │   ... (19 total mappings)                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ entries: Terpene[]                                        │  │
│  │   - id, name, aroma, taste                                │  │
│  │   - effects: Effect[] (e.g., ["Energizing", "Uplifting"])│  │
│  │   - therapeuticProperties: TherapeuticProperty[]          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────┐
         │        Frontend Layer (React)          │
         ├────────────────────────────────────────┤
         │ CATEGORY_UI_CONFIG: CategoryUIConfig   │
         │   - emoticons, fallback letters, ARIA  │
         ├────────────────────────────────────────┤
         │ Theme: CategoryColorTokens             │
         │   - Light/dark theme color mappings    │
         ├────────────────────────────────────────┤
         │ FilterState: User selections           │
         │   - categoryFilters: EffectCategoryId[]│
         │   - effectFilters: Effect[]            │
         └────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────┐
         │     Filter Service (Business Logic)    │
         │  applyEffectFilters(terpenes, filters) │
         │  - Uses effectCategoryMapping          │
         │  - Applies OR/AND logic                │
         │  - Returns filtered Terpene[]          │
         └────────────────────────────────────────┘
```

**Relationship Rules**:

1. **One-to-Many**: EffectCategory → Effect (one category contains multiple effects)
2. **Many-to-One**: Effect → EffectCategory (each effect belongs to exactly one category)
3. **Many-to-Many**: Terpene ↔ Effect (terpenes can have multiple effects, effects appear in multiple terpenes)
4. **Derived**: Terpene → EffectCategory (via effect membership)

---

## Data Flow

### 1. Initial Load

```
1. Fetch /data/terpene-database.json
2. Validate with TerpeneDatabaseSchema (Zod)
3. Extract effectCategories + effectCategoryMapping
4. Merge with CATEGORY_UI_CONFIG (emoticons, ARIA labels)
5. Apply theme colors from CategoryColorTokens
6. Render category UI with Material UI components
```

### 2. Category Filter Selection

```
User clicks "Mood & Energy" checkbox
↓
toggleCategoryFilter('mood') called
↓
FilterState: categoryFilters: ['mood']
↓
applyEffectFilters(terpenes, filters, effectCategoryMapping)
  - Filter terpenes where ANY effect maps to 'mood' category
  - Use effectCategoryMapping['Energizing'] === 'mood' lookup
↓
Display filtered terpenes
```

### 3. Individual Effect Selection

```
User clicks "Energizing" chip
↓
toggleEffectFilter('Energizing') called
↓
FilterState: effectFilters: ['Energizing']
↓
applyEffectFilters(terpenes, filters, effectCategoryMapping)
  - Filter terpenes where effects include 'Energizing'
↓
Display filtered terpenes
```

### 4. Auto-Sync (FR-020)

```
User has: categoryFilters: ['mood'], effectFilters: ['Energizing', 'Uplifting']
User deselects last effect: 'Uplifting'
↓
effectFilters: ['Energizing'] → []
↓
syncCategoryFilters(filters, effectCategoryMapping)
  - Check if ANY effect in effectFilters maps to 'mood'
  - Result: No effects left → Remove 'mood' from categoryFilters
↓
FilterState: categoryFilters: [], effectFilters: []
```

---

## Material UI Component Mapping

| Entity                | Material UI Component(s)       | Props / Config                                      |
| --------------------- | ------------------------------ | --------------------------------------------------- |
| EffectCategory        | `<Box>`, `<Typography>`        | Display category name + emoticon                    |
| CategoryUIConfig      | `<Box role="img">` or fallback | `aria-label` for accessibility                      |
| Category Header       | `<Checkbox>`, `<FormControlLabel>` | Category-level filter toggle                    |
| Category Group        | `<Accordion>` (mobile only)    | `useMediaQuery(theme.breakpoints.down('sm'))`      |
| Effect Chip           | `<Chip>`                       | `sx={{ backgroundColor: theme.category[categoryId] }}` |
| Visual Separator      | `<Divider>`                    | `sx={{ my: 2 }}` (16px vertical spacing)           |
| Category Color        | `theme.category[id]`           | Applied via `sx` prop                               |

---

## Performance Considerations

### Memoization

```typescript
// Memoize category lookup
const getCategoryForEffect = useMemo(() => {
  return (effect: Effect) => effectCategoryMapping[effect];
}, [effectCategoryMapping]);

// Memoize filtered terpenes
const filteredTerpenes = useMemo(() => {
  return applyEffectFilters(terpenes, filters, effectCategoryMapping);
}, [terpenes, filters, effectCategoryMapping]);
```

### Virtualization

- Not required initially (19 effects < 50 threshold)
- If effects expand beyond 50, use `react-window` for effect chip list

### Database Loading

- Database already loaded for main application (no additional fetch)
- `effectCategories` and `effectCategoryMapping` extracted once at app init
- No network overhead (static JSON file)

---

## Validation Rules

### Database Validation (Zod)

```typescript
// Enforced by TerpeneDatabaseSchema
✓ effectCategories must have exactly 4 entries
✓ Each category must have id, name, displayOrder, description
✓ displayOrder must be positive integer
✓ effectCategoryMapping must map all 19 effects to valid categories
✓ Category IDs must be: 'mood', 'cognitive', 'relaxation', 'physical'
```

### Frontend Validation

```typescript
// Type safety enforced by TypeScript
✓ categoryFilters must contain only valid EffectCategoryId values
✓ effectFilters must contain only valid Effect enum values
✓ Theme colors must be valid CSS color strings
✓ Emoticons must be strings (Unicode grapheme clusters)
```

---

## Summary

This data model implements a **hybrid architecture**:

- **Database layer**: Stores category definitions and effect→category mappings (source of truth for relationships)
- **Frontend layer**: Stores UI properties (emoticons, colors, ARIA labels) (presentation concerns)
- **Type safety**: Zod schemas validate database structure, TypeScript enforces correct usage in code
- **Performance**: Memoized lookups, no additional network requests, static data structure

**Key Benefits**:
1. Single source of truth for effect categorization (database)
2. Type-safe access via Zod-generated types
3. Theme-aware color system with automatic light/dark adaptation
4. Accessibility built-in (ARIA labels, fallback text, WCAG contrast)
5. Extensible: Add new effects by updating database + mapping (no code changes needed)
