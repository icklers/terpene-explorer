# Component Contracts: Therapeutic-Focused Terpene Details Modal

**Feature**: 008-therapeutic-modal-refactor  
**Date**: 2025-10-31

This document defines the TypeScript interfaces and component contracts for the therapeutic modal feature.

---

## 1. TerpeneDetailModal Component

### Props Interface

```typescript
/**
 * Main modal component for displaying terpene details with Basic/Expert view toggle.
 * Implements WCAG 2.1 AA accessibility standards.
 */
export interface TerpeneDetailModalProps {
  /** Whether the modal is visible */
  open: boolean;
  
  /** Terpene data to display. Null when modal is closed. */
  terpene: Terpene | null;
  
  /** Callback invoked when modal is closed (X button, Escape, backdrop click) */
  onClose: () => void;
  
  /** Optional: Callback invoked when user clicks a therapeutic property chip */
  onTherapeuticPropertyClick?: (property: string) => void;
  
  /** Optional: Callback invoked when user clicks an effect chip */
  onEffectClick?: (effect: string) => void;
}
```

### Component Signature

```typescript
export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps>;
```

### Usage Example

```typescript
import { TerpeneDetailModal } from '@/components/TerpeneDetailModal';

function TerpeneTable() {
  const [selectedTerpene, setSelectedTerpene] = useState<Terpene | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleTherapeuticPropertyClick = (property: string) => {
    // Filter table by therapeutic property
    applyFilter({ therapeuticProperty: property });
    // Modal stays open per clarification decision
  };
  
  return (
    <>
      {/* Table implementation */}
      
      <TerpeneDetailModal
        open={modalOpen}
        terpene={selectedTerpene}
        onClose={() => setModalOpen(false)}
        onTherapeuticPropertyClick={handleTherapeuticPropertyClick}
        onEffectClick={(effect) => applyFilter({ effect })}
      />
    </>
  );
}
```

### Accessibility Contract

**ARIA Attributes**:
- `role="dialog"`
- `aria-labelledby` → modal title
- `aria-describedby` → terpene description
- `aria-modal="true"`

**Keyboard Navigation**:
- `Tab`: Cycle through interactive elements
- `Shift+Tab`: Reverse cycle
- `Escape`: Close modal
- `Enter/Space`: Activate focused element

**Focus Management**:
- Focus trapped within modal when open
- Focus returns to triggering element on close
- First focusable element focused on open

---

## 2. CategoryBadge Component

### Props Interface

```typescript
/**
 * Badge component displaying terpene category (Core/Secondary/Minor).
 * Includes tooltip explaining category meaning.
 */
export interface CategoryBadgeProps {
  /** Terpene category from database */
  category: 'Core' | 'Secondary' | 'Minor';
  
  /** Optional size variant */
  size?: 'small' | 'medium';
}
```

### Component Signature

```typescript
export const CategoryBadge: React.FC<CategoryBadgeProps>;
```

### Usage Example

```typescript
<CategoryBadge category={terpene.category} size="medium" />
```

### Display Contract

| Category  | Color         | Tooltip Text                                   |
|-----------|---------------|------------------------------------------------|
| Core      | primary.main  | "High-prevalence, clinically well-defined"     |
| Secondary | secondary.main| "Moderate prevalence, emerging research"       |
| Minor     | grey[600]     | "Low prevalence or limited research"           |

---

## 3. DataQualityBadge Component

### Props Interface

```typescript
/**
 * Badge component displaying research data quality tier.
 * Used in Expert View → Research & References section.
 */
export interface DataQualityBadgeProps {
  /** Data quality from terpene.researchTier.dataQuality */
  quality: 'Excellent' | 'Good' | 'Limited';
  
  /** Optional size variant */
  size?: 'small' | 'medium';
}
```

### Component Signature

```typescript
export const DataQualityBadge: React.FC<DataQualityBadgeProps>;
```

### Usage Example

```typescript
<DataQualityBadge
  quality={terpene.researchTier.dataQuality}
  size="small"
/>
```

### Display Contract

| Quality   | Color       | Icon | Description Text                              |
|-----------|-------------|------|-----------------------------------------------|
| Excellent | success.main| ✓    | "Confirmed across multiple chemovars"         |
| Good      | info.main   | ℹ️   | "Validated with moderate confidence"          |
| Limited   | warning.main| ⚠️   | "Preliminary or single-source data"           |

---

## 4. Helper Functions Contract

### Location

`src/utils/terpeneHelpers.ts`

### Function Signatures

```typescript
/**
 * Categorizes effects by predefined categories (mood, cognitive, relaxation, physical).
 * @param effects - Array of effect strings from terpene data
 * @param showAll - If true, returns all effects; if false, limits to 3 per category
 * @returns Array of EffectCategory objects with grouped effects
 */
export function categorizeEffects(
  effects: string[],
  showAll?: boolean
): EffectCategory[];

/**
 * Gets semantic color for a therapeutic property chip.
 * @param property - Therapeutic property name
 * @returns Material UI color value (e.g., blue[500])
 */
export function getTherapeuticColor(property: string): string;

/**
 * Parses concentration range and calculates percentile.
 * @param range - Concentration string (e.g., "0.003-1.613 mg/g")
 * @param category - Terpene category for normalization
 * @returns Parsed concentration data with percentile and label
 */
export function parseConcentration(
  range: string,
  category: 'Core' | 'Secondary' | 'Minor'
): ConcentrationData;

/**
 * Gets emoji icon for a natural source.
 * @param source - Source name (e.g., "Lemon peel")
 * @returns Emoji string (e.g., "🍋")
 */
export function getSourceIcon(source: string): string;

/**
 * Copies text to clipboard with fallback for older browsers.
 * @param text - Text to copy
 * @param onSuccess - Optional success callback
 * @param onError - Optional error callback
 */
export async function copyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void>;
```

### Types Used

```typescript
export interface EffectCategory {
  id: 'mood' | 'cognitive' | 'relaxation' | 'physical';
  name: string;
  icon: string;
  effects: string[];
}

export interface ConcentrationData {
  min: number;
  max: number;
  percentile: number;
  label: 'High' | 'Moderate' | 'Low' | 'Trace';
  displayText: string;
}
```

---

## 5. Constants Contract

### Therapeutic Colors

**Location**: `src/constants/therapeuticColors.ts`

```typescript
/**
 * Semantic color mapping for therapeutic properties.
 * All colors meet WCAG AA contrast ratio (4.5:1) against white text.
 */
export const THERAPEUTIC_COLORS: Record<string, string>;

/**
 * Default color for unmapped properties.
 */
export const DEFAULT_THERAPEUTIC_COLOR: string;

/**
 * Gets therapeutic property color with fallback.
 */
export function getTherapeuticColor(property: string): string;
```

### Effect Categories

**Location**: `src/constants/effectCategories.ts` (existing)

```typescript
/**
 * Predefined effect categories with icons.
 */
export const EFFECT_CATEGORIES: Array<{
  id: string;
  name: string;
  icon: string;
}>;

/**
 * Mapping of effect names to category IDs.
 */
export const effectCategoryMapping: Record<string, string>;
```

---

## 6. Event Contracts

### onTherapeuticPropertyClick

**Signature**: `(property: string) => void`

**Triggered When**: User clicks a therapeutic property chip in Basic View

**Parameter**: 
- `property`: Therapeutic property name (e.g., "Anxiolytic", "Anti-inflammatory")

**Expected Behavior**:
- Parent component filters main table by property
- Snackbar notification displays: "Showing terpenes with {property} properties"
- Modal remains open (per clarification decision)

**Example**:
```typescript
onTherapeuticPropertyClick={(property) => {
  filterService.setTherapeuticProperty(property);
  showSnackbar(`Showing terpenes with ${property} properties`);
}}
```

### onEffectClick

**Signature**: `(effect: string) => void`

**Triggered When**: User clicks an effect chip in Expert View

**Parameter**:
- `effect`: Effect name (e.g., "Mood enhancing", "Stress relief")

**Expected Behavior**:
- Parent component filters main table by effect
- Snackbar notification displays: "Showing terpenes with '{effect}' effect"
- Modal remains open

**Example**:
```typescript
onEffectClick={(effect) => {
  filterService.setEffect(effect);
  showSnackbar(`Showing terpenes with '${effect}' effect`);
}}
```

### onClose

**Signature**: `() => void`

**Triggered When**:
- User clicks X button
- User presses Escape key
- User clicks modal backdrop

**Expected Behavior**:
- Modal closes (parent sets `open={false}`)
- Focus returns to triggering element
- Modal state resets (view mode back to 'basic')

**Example**:
```typescript
onClose={() => {
  setModalOpen(false);
  setSelectedTerpene(null);
}}
```

---

## 7. Performance Contracts

### Render Time

**Requirement**: FR-052, SC-002

- **Target**: < 100ms from `open={true}` to visible content
- **Measurement**: Performance API, Lighthouse score
- **Strategy**: Skeleton UI, lazy-load Expert View

### Animation Duration

**Requirement**: FR-053, SC-008

- **Target**: < 200ms toggle transition
- **Condition**: Disabled if `prefers-reduced-motion` is enabled
- **Measurement**: Manual testing, automated E2E

### Layout Stability

**Requirement**: SC-011

- **Target**: Cumulative Layout Shift (CLS) < 0.1
- **Strategy**: Fixed dimensions, skeleton UI preserves layout

---

## 8. Accessibility Contracts

### WCAG 2.1 AA Compliance

**Requirement**: FR-044 to FR-051, SC-005

- **Color Contrast**: Minimum 4.5:1 ratio for all text
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Readers**: Proper ARIA labels and announcements
- **Focus Management**: Trap focus, restore on close
- **Touch Targets**: Minimum 48x48px on mobile
- **Motion Sensitivity**: Respect `prefers-reduced-motion`

### Testing Tools

- **jest-axe**: Automated accessibility audits
- **Playwright**: Keyboard navigation tests
- **NVDA/JAWS**: Screen reader compatibility tests

---

## 9. Internationalization Contract

### Translation Keys

**Namespace**: `modal.terpeneDetail.*`

**Required Keys** (English):

```json
{
  "modal.terpeneDetail.title": "Terpene Details",
  "modal.terpeneDetail.close": "Close",
  "modal.terpeneDetail.viewMode.basic": "Basic View",
  "modal.terpeneDetail.viewMode.expert": "Expert View",
  "modal.terpeneDetail.sections.whatItDoes": "What it does for you:",
  "modal.terpeneDetail.sections.therapeuticProperties": "💊 Therapeutic Properties",
  "modal.terpeneDetail.sections.primaryEffects": "Primary Effects:",
  "modal.terpeneDetail.sections.concentration": "Concentration:",
  "modal.terpeneDetail.sections.alsoFoundIn": "🌿 Also found in:",
  "modal.terpeneDetail.sections.therapeuticDetails": "Therapeutic Details",
  "modal.terpeneDetail.sections.molecularProperties": "Molecular Properties",
  "modal.terpeneDetail.sections.researchEvidence": "Research & References",
  "modal.terpeneDetail.concentration.high": "High",
  "modal.terpeneDetail.concentration.moderate": "Moderate",
  "modal.terpeneDetail.concentration.low": "Low",
  "modal.terpeneDetail.concentration.trace": "Trace",
  "modal.terpeneDetail.categories.moodEnergy": "Mood & Energy",
  "modal.terpeneDetail.categories.cognitive": "Cognitive Enhancement",
  "modal.terpeneDetail.categories.relaxation": "Relaxation & Anxiety",
  "modal.terpeneDetail.categories.physical": "Physical & Physiological",
  "modal.terpeneDetail.readMore": "Read more...",
  "modal.terpeneDetail.showLess": "Show less",
  "modal.terpeneDetail.notableDifferences": "Notable Synergies & Differences",
  "modal.terpeneDetail.completeSources": "Complete Source List",
  "modal.terpeneDetail.dataQuality": "Data Quality:",
  "modal.terpeneDetail.evidenceSummary": "Evidence Summary:",
  "modal.terpeneDetail.references": "📚 References:",
  "modal.terpeneDetail.copySuccess": "Molecular formula copied to clipboard",
  "modal.terpeneDetail.copyError": "Failed to copy to clipboard"
}
```

**German Translations**: Required (same keys with German values)

---

## 10. Testing Contracts

### Unit Tests

**Files**:
- `TerpeneDetailModal.test.tsx`
- `CategoryBadge.test.tsx`
- `DataQualityBadge.test.tsx`
- `terpeneHelpers.test.ts`

**Coverage Target**: ≥80% (constitution requirement)

**Key Scenarios**:
- Renders with valid terpene data
- Handles null terpene gracefully
- Toggles between Basic and Expert views
- Expands/collapses description
- Calls callbacks when chips clicked
- Respects prefers-reduced-motion setting

### Integration Tests

**File**: `terpene-modal-interactions.test.ts`

**Scenarios**:
- Toggle view mode, verify content changes
- Click therapeutic property, verify callback invoked
- Click effect chip, verify callback invoked
- Close modal (all 3 methods), verify onClose called
- Copy molecular formula, verify clipboard API called

### E2E Tests

**File**: `terpene-modal-flows.spec.ts` (Playwright)

**User Stories Covered**:
- US1: Quick Therapeutic Assessment (<15 seconds)
- US2: Deep Therapeutic Exploration (toggle + accordions)
- US3: Filter by Therapeutic Property (click + table filter)
- US4: Category Badge Information (hover tooltip)
- US5: Concentration Context (hover tooltip)

**Accessibility Tests**:
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements
- Focus trap and restoration
- Color contrast ratios
- Touch target sizes (mobile)

---

## Summary

**Component Interfaces**: 3 (TerpeneDetailModal, CategoryBadge, DataQualityBadge)  
**Helper Functions**: 5 (categorizeEffects, getTherapeuticColor, parseConcentration, getSourceIcon, copyToClipboard)  
**Event Callbacks**: 3 (onClose, onTherapeuticPropertyClick, onEffectClick)  
**Translation Keys**: 28  
**Performance Targets**: 3 (render time, animation duration, CLS)  
**Accessibility Requirements**: 6 (contrast, keyboard, screen readers, focus, touch, motion)

All contracts support the specification requirements (FR-001 to FR-057) and success criteria (SC-001 to SC-012).
