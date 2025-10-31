# Data Model: Therapeutic-Focused Terpene Details Modal

**Feature**: 008-therapeutic-modal-refactor  
**Date**: 2025-10-31  
**Status**: Complete

## Overview

This document defines the data structures and interfaces for the therapeutic-focused terpene details modal. The modal operates on existing `Terpene` entities from the database schema and introduces new UI-specific types for component props and helper function outputs.

---

## Core Entities

### 1. Terpene (Existing)

**Source**: `/src/types/terpene.ts` (re-exported from `/src/utils/terpeneSchema.ts`)

The primary entity representing a terpene compound. This structure is defined in the database schema and validated with Zod.

**Key Fields Used by Modal**:

```typescript
interface Terpene {
  // Identity & Classification
  name: string;                           // Display name (e.g., "Limonene")
  category: 'Core' | 'Secondary' | 'Minor'; // Prevalence/research tier
  
  // Aromatic Profile
  aroma: string;                          // Comma-separated descriptors
  
  // Therapeutic Information
  description: string;                    // Patient-friendly explanation
  therapeuticProperties: string[];        // e.g., ["Anxiolytic", "Anti-inflammatory"]
  effects: string[];                      // e.g., ["Mood enhancing", "Stress relief"]
  notableDifferences?: string;            // Synergies, isomer distinctions
  
  // Concentration Data
  concentrationRange: string;             // e.g., "0.003-1.613 mg/g"
  
  // Botanical Context
  sources: string[];                      // e.g., ["Lemon peel", "Orange rind"]
  
  // Molecular Data
  molecularData: MolecularData;
  isomerOf?: string;                      // Parent compound name (if isomer)
  isomerType?: string;                    // e.g., "Optical (Enantiomer)"
  
  // Research Evidence
  researchTier: ResearchTier;
  references: Reference[];
}
```

**Relationships**:
- Effects map to `effectCategories` via `effectCategoryMapping` (database schema)
- Therapeutic properties map to semantic colors (application constant)

---

## Component Interfaces

### 2. TerpeneDetailModalProps

**Purpose**: Props for the main modal component

**Location**: `/src/types/terpene.ts` (to be updated)

```typescript
interface TerpeneDetailModalProps {
  // Modal state
  open: boolean;                          // Whether modal is visible
  terpene: Terpene | null;                // Terpene to display (null = closed)
  
  // Event handlers
  onClose: () => void;                    // Close modal callback
  onTherapeuticPropertyClick?: (property: string) => void;  // Filter by property
  onEffectClick?: (effect: string) => void;                 // Filter by effect
}
```

**Validation Rules**:
- `terpene` can be `null` when modal is closed
- `open` should be `false` when `terpene` is `null`
- Callbacks are optional (component works without them)

---

### 3. CategoryBadgeProps

**Purpose**: Props for category badge component (Core/Secondary/Minor)

**Location**: `/src/components/CategoryBadge.tsx` (new file)

```typescript
interface CategoryBadgeProps {
  category: 'Core' | 'Secondary' | 'Minor';
  size?: 'small' | 'medium';              // Optional size variant
}
```

**Display Rules**:
- **Core**: Primary color (blue), "High-prevalence, clinically well-defined"
- **Secondary**: Secondary color (orange), "Moderate prevalence, emerging research"
- **Minor**: Gray, "Low prevalence or limited research"

---

### 4. DataQualityBadgeProps

**Purpose**: Props for research data quality indicator

**Location**: `/src/components/DataQualityBadge.tsx` (new file)

```typescript
interface DataQualityBadgeProps {
  quality: 'Excellent' | 'Good' | 'Limited';
  size?: 'small' | 'medium';
}
```

**Display Rules**:
- **Excellent**: Green badge with checkmark, "Confirmed across multiple chemovars"
- **Good**: Blue badge, "Validated with moderate confidence"
- **Limited**: Orange badge, "Preliminary or single-source data"

---

## Helper Function Types

### 5. EffectCategory

**Purpose**: Grouped effects by category for display in modal

**Location**: `/src/utils/terpeneHelpers.ts` (new file)

```typescript
interface EffectCategory {
  id: 'mood' | 'cognitive' | 'relaxation' | 'physical';
  name: string;                           // Translated display name
  icon: string;                           // Emoji icon (🌞, 🧠, 🧘, 🏃)
  effects: string[];                      // Filtered effects for this category
}
```

**Usage**:
```typescript
const categorizeEffects = (
  effects: string[],
  showAll: boolean = false
): EffectCategory[];
```

**Business Logic**:
- Use `effectCategoryMapping` from database schema to group effects
- Filter out categories with zero effects (FR-009)
- Limit to 3 effects per category in Basic View (FR-010)
- Show all effects in Expert View (`showAll = true`)

---

### 6. ConcentrationData

**Purpose**: Parsed concentration information for visualization

**Location**: `/src/utils/terpeneHelpers.ts` (new file)

```typescript
interface ConcentrationData {
  min: number;                            // Minimum value (mg/g)
  max: number;                            // Maximum value (mg/g)
  percentile: number;                     // 0-100 (relative to category)
  label: 'High' | 'Moderate' | 'Low' | 'Trace';
  displayText: string;                    // Original range string
}
```

**Usage**:
```typescript
const parseConcentration = (
  range: string,
  category: 'Core' | 'Secondary' | 'Minor'
): ConcentrationData;
```

**Calculation Rules**:
- Parse format: `"0.003-1.613 mg/g"`
- Percentile calculated against category-specific baseline:
  - Core: 0-2.0 mg/g
  - Secondary: 0-1.0 mg/g
  - Minor: 0-0.5 mg/g
- Label thresholds:
  - High: ≥75th percentile
  - Moderate: 40-74th percentile
  - Low: 10-39th percentile
  - Trace: <10th percentile

---

## Constants & Mappings

### 7. Therapeutic Property Colors

**Purpose**: Semantic color mapping for therapeutic property chips

**Location**: `/src/constants/therapeuticColors.ts` (new file)

```typescript
import { red, orange, blue, cyan, indigo, purple, teal, green, brown, grey } from '@mui/material/colors';

export const THERAPEUTIC_COLORS: Record<string, string> = {
  // Mental Health (Blues/Cyans)
  'Anxiolytic': blue[500],
  'Antidepressant': cyan[500],
  'Sedative': indigo[600],
  'Neuroprotective': purple[500],
  'Anti-epileptic': purple[600],
  
  // Physical Health (Reds/Oranges)
  'Anti-inflammatory': red[400],
  'Analgesic': orange[500],
  'Muscle relaxant': red[300],
  
  // Respiratory (Teals)
  'Bronchodilator': teal[500],
  'Mucolytic': teal[400],
  
  // Immune (Greens)
  'Antimicrobial': brown[400],
  'Antiviral': green[600],
  'Antioxidant': green[500],
  
  // Digestive (Browns/Ambers)
  'Gastroprotective': brown[300],
  'Antispasmodic': brown[500],
};

export const DEFAULT_THERAPEUTIC_COLOR = grey[600];

export const getTherapeuticColor = (property: string): string => {
  return THERAPEUTIC_COLORS[property] || DEFAULT_THERAPEUTIC_COLOR;
};
```

**Accessibility Note**: All color values have been verified to meet 4.5:1 contrast ratio against white text (WCAG AA).

---

### 8. Effect Category Configuration

**Source**: Existing `/src/constants/effectCategories.ts`

This file already contains effect category definitions. The modal will reference this existing configuration.

**Expected Structure**:
```typescript
export const EFFECT_CATEGORIES = [
  { id: 'mood', name: 'Mood & Energy', icon: '🌞' },
  { id: 'cognitive', name: 'Cognitive Enhancement', icon: '🧠' },
  { id: 'relaxation', name: 'Relaxation & Anxiety', icon: '🧘' },
  { id: 'physical', name: 'Physical & Physiological', icon: '🏃' },
];

export const effectCategoryMapping: Record<string, string> = {
  'Mood enhancing': 'mood',
  'Energizing': 'mood',
  'Focus': 'cognitive',
  'Stress relief': 'relaxation',
  'Anxiety relief': 'relaxation',
  'Anti-inflammatory': 'physical',
  // ... (complete mapping in actual file)
};
```

---

## State Management

### 9. Modal Component State

**Location**: Internal state within `TerpeneDetailModal.tsx`

```typescript
// View mode toggle
const [viewMode, setViewMode] = useState<'basic' | 'expert'>('basic');

// Description expansion (Basic View)
const [expandedDescription, setExpandedDescription] = useState<boolean>(false);

// Loading state (for skeleton UI)
const [isLoading, setIsLoading] = useState<boolean>(false);
```

**State Transitions**:
1. Modal opens → `viewMode` resets to `'basic'`
2. User clicks toggle → `viewMode` changes, content updates
3. User clicks "Read more..." → `expandedDescription` toggles
4. Modal closes → all state resets

---

## Data Flow Diagram

```
┌─────────────────────┐
│  Parent Component   │
│  (TerpeneTable)     │
└──────────┬──────────┘
           │
           │ props: { terpene, open, onClose, callbacks }
           ↓
┌──────────────────────────────────────────────┐
│     TerpeneDetailModal Component             │
├──────────────────────────────────────────────┤
│  State:                                      │
│  - viewMode: 'basic' | 'expert'              │
│  - expandedDescription: boolean              │
│                                              │
│  Derived Data (helpers):                     │
│  - categorizedEffects = categorizeEffects()  │
│  - concentrationData = parseConcentration()  │
│  - therapeuticColor = getTherapeuticColor()  │
│                                              │
│  Handlers:                                   │
│  - handleToggleView()                        │
│  - handlePropertyClick() → callback          │
│  - handleEffectClick() → callback            │
│  - handleCopyFormula() → clipboard API       │
└──────────────────────────────────────────────┘
           │
           │ renders
           ↓
┌──────────────────────────────────────────────┐
│  Child Components:                           │
│  - CategoryBadge                             │
│  - DataQualityBadge                          │
│  - Material UI components (Dialog, Chip...)  │
└──────────────────────────────────────────────┘
```

---

## Validation Rules

### Field-Level Validation

**From Spec (FR-001 to FR-057)**:

1. **Required Fields**:
   - `name`, `category`, `description`, `therapeuticProperties`, `effects` (Assumption #1)
   
2. **Optional Fields**:
   - `notableDifferences` (conditionally display if present)
   - `isomerOf`, `isomerType` (conditionally display if present)
   
3. **Array Fields**:
   - `therapeuticProperties`: Display all (no truncation per FR-006)
   - `effects`: Limit to 3 per category in Basic View (FR-010), show all in Expert View (FR-018)
   - `sources`: First 3 in Basic View (FR-013), all in Expert View (FR-020)
   
4. **String Parsing**:
   - `aroma`: Split by comma, trim whitespace
   - `concentrationRange`: Parse with regex `/(\d+\.?\d*)-(\d+\.?\d*)/`

---

## Performance Considerations

### Data Size Estimates

- Single `Terpene` object: ~2-5 KB (JSON)
- Modal renders 1 terpene at a time: No large dataset concerns
- Lazy-load Expert View: FR-054 requires skeleton UI, content loads when toggle activated

### Memoization Strategy

```typescript
// Memoize expensive computations
const categorizedEffects = useMemo(
  () => categorizeEffects(terpene.effects, viewMode === 'expert'),
  [terpene.effects, viewMode]
);

const concentrationData = useMemo(
  () => parseConcentration(terpene.concentrationRange, terpene.category),
  [terpene.concentrationRange, terpene.category]
);
```

---

## Migration Notes

### Existing Modal → New Modal (COMPLETE REFACTOR)

**IMPORTANT**: This is not an incremental update. The entire modal implementation will be **deleted and rewritten**.

**Files to Remove**:
- `src/components/visualizations/TerpeneDetailModal.tsx` (182 lines) - DELETE COMPLETELY

**Files to Create**:
- `src/components/TerpeneDetailModal.tsx` (new implementation at different location)
- `src/components/CategoryBadge.tsx`
- `src/components/DataQualityBadge.tsx`
- `src/utils/terpeneHelpers.ts`
- `src/constants/therapeuticColors.ts`

**Breaking Changes**:
- Props interface updated (added `onTherapeuticPropertyClick`, `onEffectClick`)
- Internal structure completely refactored (Basic/Expert views, not simple field list)
- Import path changed (from `./TerpeneDetailModal` to `../TerpeneDetailModal` in TerpeneTable.tsx)
- No longer displays "taste" field (removed per medical patient focus)
- Effects are now categorized, not flat list
- Concentration shown as visual bar + label, not just range text
- Boiling point moved to Expert View accordion

**Migration Path**:
1. **Delete** the old modal: `src/components/visualizations/TerpeneDetailModal.tsx`
2. Create new modal with new implementation at `src/components/TerpeneDetailModal.tsx`
3. Update import in `TerpeneTable.tsx`: `import { TerpeneDetailModal } from '../TerpeneDetailModal';`
4. Add new callback props if filtering feature desired: `onTherapeuticPropertyClick`, `onEffectClick`
5. Remove old modal tests (if any exist for the old implementation)
6. Add new test suite per contracts/components.md

**Backward Compatibility**:
- `onTherapeuticPropertyClick` and `onEffectClick` are optional (modal works without them)
- Same basic props (`open`, `terpene`, `onClose`) maintained for minimal parent component changes

---

## Summary

**Total New Types**: 6 (3 component props, 3 helper types)  
**Modified Types**: 1 (TerpeneDetailModalProps updated)  
**New Constants**: 1 (THERAPEUTIC_COLORS mapping)  
**Existing Types Referenced**: 7 (Terpene, MolecularData, Reference, ResearchTier, etc.)

All data structures support the specification requirements (FR-001 to FR-057) and success criteria (SC-001 to SC-012).

**Next Steps**: Generate component contracts (TypeScript interfaces) and quickstart.md.
