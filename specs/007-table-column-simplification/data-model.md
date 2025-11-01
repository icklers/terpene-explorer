# Data Model: Table Column Simplification

**Feature**: 007-table-column-simplification  
**Date**: 2025-11-01  
**Status**: Complete

## Overview

This document defines the data model and entities for the table column simplification feature. Since the `category`
field already exists in the `Terpene` entity, this feature primarily involves UI-level changes to how data is displayed
and sorted.

## Entities

### 1. Terpene (Existing - No Changes)

**Source**: `src/types/terpene.ts` and `src/utils/terpeneSchema.ts`

**Description**: Core terpene entity with all properties including the `category` field that will now be displayed in
the table.

**Fields**:

| Field                  | Type                            | Description                                                 | Validation                                    |
| ---------------------- | ------------------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| `id`                   | string                          | Unique UUID identifier                                      | Must be valid UUID                            |
| `name`                 | string                          | Terpene name (e.g., "Limonene", "α-Pinene")                | Min length 1                                  |
| `category`             | enum                            | Classification tier: "Core", "Secondary", or "Minor"        | **Must be one of: Core, Secondary, Minor**    |
| `aroma`                | string                          | Aromatic profile description                                | Min length 1                                  |
| `effects`              | Effect[]                        | Array of effect enums                                       | Min 1 effect                                  |
| `therapeuticProperties`| TherapeuticProperty[]           | Array of therapeutic property enums                         | -                                             |
| `description`          | string                          | Detailed terpene description                                | Min length 1                                  |
| `taste`                | string                          | Flavor profile                                              | Min length 1                                  |
| `sources`              | string[]                        | Natural sources (e.g., ["Lemon", "Orange"])                 | -                                             |
| `isomerOf`             | string \| null                  | Parent compound if this is an isomer variant                | -                                             |
| `isomerType`           | enum \| null                    | Type of isomerism                                           | If set, must be valid enum value              |
| `notableDifferences`   | string?                         | Isomer-specific differences                                 | -                                             |
| `concentrationRange`   | string?                         | Typical concentration in cannabis                           | -                                             |
| `molecularData`        | MolecularData                   | Chemical structure information                              | Required                                      |
| `references`           | Reference[]                     | Scientific references                                       | -                                             |
| `researchTier`         | ResearchTier                    | Data quality assessment                                     | Required                                      |

**Key Change**: The `category` field (already present) will now be:

- Displayed in the table UI (replacing Sources column)
- Used for default sorting (importance ranking)
- Rendered with appropriate translations (en, de)

**Validation Rules**:

- `category` must be one of: "Core", "Secondary", or "Minor"
- If `category` is missing or invalid, UI displays "Uncategorized" (rank=4)
- All other validation rules remain unchanged

**State Transitions**: None (static data)

---

### 2. CategoryRank (New - UI Helper)

**Source**: `src/components/visualizations/TerpeneTable.tsx` (to be added)

**Description**: Mapping object that defines importance ranking for category-based sorting.

**Structure**:

```typescript
const CATEGORY_RANK = {
  Core: 1,
  Secondary: 2,
  Minor: 3,
  Uncategorized: 4,
} as const;

type CategoryRankKey = keyof typeof CATEGORY_RANK;
type CategoryRankValue = (typeof CATEGORY_RANK)[CategoryRankKey];
```

**Purpose**:

- Enables numerical comparison for category sorting (instead of alphabetical)
- Provides predictable ordering: Core (most important) → Minor (least important)
- Handles missing/invalid categories by assigning rank=4 (Uncategorized)

**Usage**:

```typescript
function sortByCategory(a: Terpene, b: Terpene): number {
  const categoryA = (a.category || 'Uncategorized') as CategoryRankKey;
  const categoryB = (b.category || 'Uncategorized') as CategoryRankKey;

  const rankA = CATEGORY_RANK[categoryA];
  const rankB = CATEGORY_RANK[categoryB];

  // Primary sort by category rank
  if (rankA !== rankB) {
    return rankA - rankB;
  }

  // Secondary sort by name (alphabetical)
  return a.name.localeCompare(b.name);
}
```

---

### 3. TerpeneTableColumn (Modified)

**Source**: Implicit in `src/components/visualizations/TerpeneTable.tsx`

**Description**: Defines the visible columns in the terpene table and their sorting behavior.

**Previous State** (5 columns):

```typescript
type SortColumn = 'name' | 'aroma' | 'sources' | 'effects';
```

**New State** (4 columns):

```typescript
type SortColumn = 'name' | 'aroma' | 'effects' | 'category';
```

**Column Definitions**:

| Column ID  | Display Header  | Data Source          | Sortable | Sort Type    | Translation Key     |
| ---------- | --------------- | -------------------- | -------- | ------------ | ------------------- |
| `name`     | Name            | `terpene.name`       | Yes      | Alphabetical | `table.name`        |
| `aroma`    | Aroma           | `terpene.aroma`      | Yes      | Alphabetical | `table.aroma`       |
| `effects`  | Effects         | `terpene.effects`    | Yes      | Alphabetical | `table.effects`     |
| `category` | Category        | `terpene.category`   | Yes      | Rank-based   | `table.category`    |
| ~~`sources`~~ | ~~Sources~~ | ~~`terpene.sources`~~ | ~~Yes~~ | ~~Alphabetical~~ | ~~`table.sources`~~ (REMOVED) |

**Key Changes**:

1. **Removed**: `sources` column (no longer displayed in table)
2. **Added**: `category` column with rank-based sorting
3. **Default Sort**: Changed from `name` (ascending) to `category` (ascending by rank, then name alphabetically)

**Sort Behavior by Column**:

- **Name**: Alphabetical comparison (`a.name.localeCompare(b.name)`)
- **Aroma**: Alphabetical comparison (`a.aroma.localeCompare(b.aroma)`)
- **Effects**: Alphabetical comparison of joined effect array (`a.effects.join(', ').localeCompare(...)`)
- **Category**: Importance rank comparison (Core=1 < Secondary=2 < Minor=3 < Uncategorized=4), then alphabetical by
  name

---

### 4. TerpeneTableProps (Modified)

**Source**: `src/components/visualizations/TerpeneTable.tsx`

**Description**: Component props interface for the TerpeneTable component.

**Previous State**:

```typescript
export interface TerpeneTableProps {
  terpenes: Terpene[];
  initialSortBy?: 'name' | 'aroma' | 'sources' | 'effects';
  initialSortDirection?: 'asc' | 'desc';
}
```

**New State**:

```typescript
export interface TerpeneTableProps {
  terpenes: Terpene[];
  initialSortBy?: 'name' | 'aroma' | 'effects' | 'category';
  initialSortDirection?: 'asc' | 'desc';
}
```

**Changes**:

1. `initialSortBy` now accepts `'category'` instead of `'sources'`
2. Default value changes from `'name'` to `'category'`
3. Default `initialSortDirection` remains `'asc'`

**Usage Example**:

```typescript
<TerpeneTable terpenes={allTerpenes} initialSortBy="category" initialSortDirection="asc" />
```

---

### 5. CategoryDisplayName (New - UI Helper)

**Source**: `src/i18n/locales/en.json` and `de.json` (translations)

**Description**: Internationalized display names for category values.

**English (`en.json`)**:

```json
{
  "table": {
    "category": "Category",
    "categoryCore": "Core",
    "categorySecondary": "Secondary",
    "categoryMinor": "Minor",
    "categoryUncategorized": "Uncategorized"
  }
}
```

**German (`de.json`)**:

```json
{
  "table": {
    "category": "Kategorie",
    "categoryCore": "Kern",
    "categorySecondary": "Sekundär",
    "categoryMinor": "Gering",
    "categoryUncategorized": "Unkategorisiert"
  }
}
```

**Usage in Component**:

```typescript
const { t } = useTranslation();

function getCategoryDisplayName(category: string | undefined | null): string {
  const categoryKey = category || 'Uncategorized';
  switch (categoryKey) {
    case 'Core':
      return t('table.categoryCore', 'Core');
    case 'Secondary':
      return t('table.categorySecondary', 'Secondary');
    case 'Minor':
      return t('table.categoryMinor', 'Minor');
    default:
      return t('table.categoryUncategorized', 'Uncategorized');
  }
}
```

---

## Entity Relationships

```text
TerpeneDatabase
  ├─ entries: Terpene[]
  │    ├─ category: "Core" | "Secondary" | "Minor"  ← Used for sorting
  │    ├─ name: string  ← Secondary sort key
  │    ├─ aroma: string  ← Displayed in Aroma column
  │    ├─ effects: Effect[]  ← Displayed as chips in Effects column
  │    └─ sources: string[]  ← NOT displayed in table (available in detail modal)
  │
  └─ UI Layer
       ├─ CATEGORY_RANK (importance ranking)
       ├─ TerpeneTableColumn (column definitions)
       └─ CategoryDisplayName (i18n translations)
```

**Key Relationships**:

1. **Terpene.category** → **CATEGORY_RANK**: Maps category string to numerical rank for sorting
2. **Terpene.category** → **CategoryDisplayName**: Maps category string to translated display name
3. **TerpeneTableColumn**: Defines which Terpene fields are displayed and how they're sorted

---

## Data Validation

### Category Field Validation

**Validation Rule**: Category must be one of the predefined values: "Core", "Secondary", "Minor"

**Zod Schema** (already exists in `src/utils/terpeneSchema.ts`):

```typescript
category: z.enum(['Core', 'Secondary', 'Minor'])
```

**Runtime Handling**:

```typescript
function validateCategory(category: string | undefined | null): string {
  const validCategories = ['Core', 'Secondary', 'Minor'];
  if (!category || !validCategories.includes(category)) {
    console.warn(`Invalid or missing category: ${category}. Defaulting to "Uncategorized".`);
    return 'Uncategorized';
  }
  return category;
}
```

**Error Handling**:

- **Missing category**: Display "Uncategorized" in UI, log warning to console
- **Invalid category**: Display "Uncategorized" in UI, log warning to console
- **Valid category**: Display translated category name

---

## Summary

This feature leverages the existing `category` field in the Terpene entity without requiring data model changes. The
primary modifications are:

1. **UI Layer**: Replace Sources column with Category column in `TerpeneTable` component
2. **Sorting Logic**: Implement category-based sorting using importance ranking (CATEGORY_RANK)
3. **Internationalization**: Add translation keys for category column and category values
4. **Type Updates**: Modify `SortColumn` type and `TerpeneTableProps` interface to reflect new column set

**No Database Schema Changes Required**: The `category` field already exists in `terpene-database.json` and is properly
validated by the existing Zod schema.

**Next Steps**: Define component contracts in `/contracts/` directory to specify exact API interfaces and behavior.
